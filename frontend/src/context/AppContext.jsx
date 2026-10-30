import React, { createContext, useContext, useState, useEffect } from 'react';

// ONE base URL for every API call.
// Default '' = go through the Vite dev proxy (/api -> backend, see vite.config.js).
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

const AppContext = createContext(null);

const CART_KEY = 'smartpick_cart';
const SAVED_LATER_KEY = 'smartpick_saved_for_later';
const ORDERS_KEY = 'smartpick_orders';
const BUY_NOW_KEY = 'smartpick_buy_now';
const TOKEN_KEY = 'smartpick_token';

// Read initial state from localStorage safely
const readStoredJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const readStoredToken = () => {
  const t = localStorage.getItem(TOKEN_KEY);
  if (!t || t === 'undefined' || t === 'null') {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return t;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(readStoredToken);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('smartpick_theme') === 'dark';
  });

  const COMPARE_KEY = 'smartpick_compare_v2';
  const [compareList, setCompareList] = useState(() => {
    // Always start clean: remove ALL legacy keys
    localStorage.removeItem('smartpick_compare');
    // Load from versioned key only
    const stored = localStorage.getItem(COMPARE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // De-duplicate and normalize to strings
          const unique = [...new Set(parsed.map(String))];
          return unique;
        }
      } catch { /* corrupted, start fresh */ }
    }
    return [];
  });

  const [wishlistIds, setWishlistIds] = useState([]);

  // Global Cart State: array of items { id, product_id, name, brand, category, image_url, unit_price, original_price, quantity, key_spec }
  const [cartItems, setCartItems] = useState(() => {
    const saved = readStoredJson(CART_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  // Saved for Later list
  const [savedForLater, setSavedForLater] = useState(() => {
    const saved = readStoredJson(SAVED_LATER_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  // Buy Now item (skips cart, goes straight to checkout)
  const [buyNowItem, setBuyNowItem] = useState(() => {
    try {
      const saved = sessionStorage.getItem(BUY_NOW_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Orders persisted in localStorage
  const [orders, setOrders] = useState(() => {
    const saved = readStoredJson(ORDERS_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  // Toast notifications (supports link action)
  const [toast, setToast] = useState(null);

  const showToast = (message, action = null) => {
    setToast({ message, action });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cartItems]);

  // Sync saved for later to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_LATER_KEY, JSON.stringify(savedForLater));
    } catch (e) {
      console.error('Failed to persist saved for later:', e);
    }
  }, [savedForLater]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist orders:', e);
    }
  }, [orders]);

  // Sync buyNow to sessionStorage
  useEffect(() => {
    try {
      if (buyNowItem) {
        sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(buyNowItem));
      } else {
        sessionStorage.removeItem(BUY_NOW_KEY);
      }
    } catch (e) {
      console.error('Failed to persist buy now item:', e);
    }
  }, [buyNowItem]);

  const clearSession = () => {
    setUser(null);
    setToken(null);
    setWishlistIds([]);
    localStorage.removeItem(TOKEN_KEY);
  };

  // ---------------- API helper ----------------
  const apiFetch = async (url, options = {}, authToken = token) => {
    const headers = { ...(options.headers || {}) };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
    if (res.status === 401 && authToken) {
      console.warn(`401 from ${url}: clearing session`);
      clearSession();
      showToast('Session expired, please sign in again');
    }
    return res;
  };

  // ---------------- Cart Actions ----------------

  /**
   * Helper to normalize product object into clean cart item schema
   */
  const formatCartItem = (product, quantity = 1) => {
    const offers = product.offers || [];
    const lowestOfferPrice = offers.length > 0 ? Math.min(...offers.map((o) => o.current_price)) : null;
    const bestOffer = offers.find((o) => o.current_price === lowestOfferPrice) || offers[0];

    const price = Number(product.unit_price || product.current_price || lowestOfferPrice || product.price || 0);
    const originalPrice = Number(product.original_price || bestOffer?.original_price || price);

    // Extract a concise key spec for the cart display
    let keySpec = '';
    if (product.specifications && Array.isArray(product.specifications)) {
      const topSpec = product.specifications.find((s) =>
        ['processor', 'display', 'battery_life', 'driver_size', 'anc'].includes(s.spec_key)
      );
      if (topSpec) keySpec = `${topSpec.spec_key.replace('_', ' ')}: ${topSpec.spec_value}`;
    }

    return {
      id: product.id || `item_${Date.now()}`,
      product_id: product.id,
      name: product.name || 'Smart Tech Product',
      brand: product.brand || 'SmartPick',
      category: product.category || 'electronics',
      image_url: product.image_url || '/images/products/placeholder.svg',
      unit_price: price,
      original_price: originalPrice,
      quantity: Math.min(Math.max(1, Number(quantity) || 1), 10),
      key_spec: keySpec || product.key_spec || '',
    };
  };

  /**
   * Adds an item to the cart or increments its quantity
   */
  const addToCart = (productOrId, quantity = 1) => {
    let itemToAdd = null;

    if (typeof productOrId === 'object' && productOrId !== null) {
      itemToAdd = formatCartItem(productOrId, quantity);
    } else {
      // It's a string/number ID; search existing items or create basic stub
      itemToAdd = {
        id: productOrId,
        product_id: productOrId,
        name: `Product ${productOrId}`,
        unit_price: 999,
        original_price: 1499,
        quantity: Math.min(Math.max(1, Number(quantity) || 1), 10),
      };
    }

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (i) => i.product_id === itemToAdd.product_id || i.id === itemToAdd.id
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(10, updated[existingIndex].quantity + (Number(quantity) || 1));
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [...prevItems, itemToAdd];
      }
    });

    showToast('Added to cart', {
      label: 'View Cart',
      url: '/cart',
    });

    return true;
  };

  /**
   * Updates item quantity (clamped 1 to 10)
   */
  const updateQuantity = (productId, newQuantity) => {
    const qty = Math.min(10, Math.max(1, parseInt(newQuantity, 10) || 1));
    setCartItems((prev) =>
      prev.map((item) =>
        item.product_id === productId || item.id === productId
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  /**
   * Removes an item from the cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product_id !== productId && item.id !== productId)
    );
    showToast('Item removed from cart');
  };

  /**
   * Empties the cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Moves an item from cart to "Saved for Later"
   */
  const saveForLater = (productId) => {
    const item = cartItems.find((i) => i.product_id === productId || i.id === productId);
    if (!item) return;

    setCartItems((prev) =>
      prev.filter((i) => i.product_id !== productId && i.id !== productId)
    );

    setSavedForLater((prev) => {
      if (prev.some((i) => i.product_id === item.product_id)) return prev;
      return [...prev, item];
    });

    showToast(`Moved "${item.name}" to Saved for Later`);
  };

  /**
   * Moves an item back to cart from "Saved for Later"
   */
  const moveToCart = (productId) => {
    const item = savedForLater.find((i) => i.product_id === productId || i.id === productId);
    if (!item) return;

    setSavedForLater((prev) =>
      prev.filter((i) => i.product_id !== productId && i.id !== productId)
    );

    setCartItems((prev) => {
      const exists = prev.find((i) => i.product_id === item.product_id);
      if (exists) {
        return prev.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: Math.min(10, i.quantity + 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    showToast(`Moved "${item.name}" back to Cart`, {
      label: 'View Cart',
      url: '/cart',
    });
  };

  /**
   * Removes item from "Saved for Later"
   */
  const removeSavedForLater = (productId) => {
    setSavedForLater((prev) =>
      prev.filter((i) => i.product_id !== productId && i.id !== productId)
    );
    showToast('Removed from Saved for Later');
  };

  /**
   * Initiates Buy Now (single product straight to checkout without altering current cart)
   */
  const setBuyNow = (product, quantity = 1) => {
    const formatted = formatCartItem(product, quantity);
    setBuyNowItem(formatted);
    return formatted;
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
    sessionStorage.removeItem(BUY_NOW_KEY);
  };

  // Backwards compatibility cart object matching previous interface
  const cart = {
    items: cartItems,
    id: 'local_cart',
    total_items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
  };

  const fetchCart = async () => {
    // Local cart is always up-to-date; if user is authenticated we could also ping /api/cart
    return cart;
  };

  // ---------------- Order Actions ----------------

  const saveOrder = (orderData) => {
    const newOrder = {
      id: orderData.id || `SP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      created_at: new Date().toISOString(),
      status: orderData.status || 'Confirmed',
      items: orderData.items || [],
      shipping_address: orderData.shipping_address || {},
      payment_method: orderData.payment_method || 'UPI',
      payment_details: orderData.payment_details || {},
      totals: orderData.totals || {},
      total_amount: orderData.totals?.grandTotal || orderData.total_amount || 0,
      estimated_delivery: orderData.estimated_delivery || 'In 2-3 Business Days',
      is_guest: !user,
      customer_email: user?.email || orderData.customer_email || 'shopper@smartpick.in',
      customer_name: user?.full_name || orderData.customer_name || 'SmartPick Customer',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId) || null;
  };

  // ---------------- Theme / compare sync ----------------

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartpick_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartpick_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist compare list under versioned key
  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.error('Failed to persist compare list:', e);
    }
  }, [compareList]);

  // ---------------- Auth / wishlist ----------------

  const fetchWishlist = async (authToken = token) => {
    if (!authToken) return;
    try {
      const r = await apiFetch('/api/wishlists', {}, authToken);
      if (r.ok) {
        const data = await r.json();
        setWishlistIds((data.items || []).map((i) => i.product_id));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  };

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await apiFetch('/api/auth/me', {}, token);
        if (cancelled) return;
        if (!r.ok) return;
        const data = await r.json();
        const u = data?.user || data;
        if (u && u.id) {
          setUser(u);
          fetchWishlist(token);
        }
      } catch (e) {
        console.error('Failed to load user:', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Login failed');
        return false;
      }
      const data = await res.json();
      const receivedToken = data.token || data.access_token;
      if (!receivedToken) {
        showToast('Login succeeded but the server returned no token');
        return false;
      }
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
      if (data.user) setUser(data.user);
      showToast(`Welcome back, ${data.user?.full_name || ''}!`);
      return true;
    } catch (e) {
      console.error('Login error:', e);
      showToast('Network error during login');
      return false;
    }
  };

  const register = async (email, password, fullName, phone) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, phone }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Registration failed');
        return false;
      }
      const data = await res.json();
      const receivedToken = data.token || data.access_token;
      if (!receivedToken) {
        showToast('Account created but the server returned no token');
        return false;
      }
      localStorage.setItem(TOKEN_KEY, receivedToken);
      setToken(receivedToken);
      if (data.user) setUser(data.user);
      showToast(`Account created for ${data.user?.full_name || fullName}`);
      return true;
    } catch (e) {
      console.error('Register error:', e);
      showToast('Network error during registration');
      return false;
    }
  };

  const logout = () => {
    clearSession();
    showToast('Signed out of SmartPick');
  };

  // ---------------- Compare ----------------

  const addToCompare = (productId) => {
    // Ensure ID is a string
    const id = String(productId);
    setCompareList((prev) => {
      // Idempotent: ignore if already present
      if (prev.includes(id)) return prev;
      if (prev.length >= 4) {
        showToast('You can compare at most 4 products at once');
        return prev;
      }
      const next = [...prev, id];
      return next;
    });
    showToast('Product added to comparison');
  };

  const removeFromCompare = (productId) => {
    const id = String(productId);
    setCompareList((prev) => prev.filter((x) => x !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  // ---------------- Wishlist ----------------

  const toggleWishlist = async (productId) => {
    if (!token) {
      // Local wishlist support for guest
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        if (exists) {
          showToast('Removed from saved wishlist');
          return prev.filter((id) => id !== productId);
        } else {
          showToast('Added to your saved wishlist');
          return [...prev, productId];
        }
      });
      return;
    }

    const isSaved = wishlistIds.includes(productId);
    try {
      if (isSaved) {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
        await apiFetch(`/api/wishlists/default/items/${productId}`, { method: 'DELETE' });
        showToast('Removed from saved wishlist');
      } else {
        setWishlistIds((prev) => [...prev, productId]);
        await apiFetch('/api/wishlists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId }),
        });
        showToast('Added to your saved wishlist');
      }
    } catch (e) {
      console.error('Wishlist error:', e);
      showToast('Could not update wishlist');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.includes(productId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        apiFetch,
        isDarkMode,
        toggleDarkMode,
        login,
        register,
        logout,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        toast,
        toastMessage: toast?.message || null,
        showToast,
        // Cart state & actions
        cart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        savedForLater,
        saveForLater,
        moveToCart,
        removeSavedForLater,
        buyNowItem,
        setBuyNow,
        clearBuyNow,
        // Orders
        orders,
        saveOrder,
        getOrderById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
