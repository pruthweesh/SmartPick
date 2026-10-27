import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('smartpick_token'));
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('smartpick_theme') === 'dark';
  });
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = localStorage.getItem('smartpick_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlistIds, setWishlistIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartpick_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartpick_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync compare list to localStorage
  useEffect(() => {
    localStorage.setItem('smartpick_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Fetch current user and wishlist if token exists
  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => (r.ok ? r.json() : null))
        .then(data => {
          if (data && data.id) {
            setUser(data);
            fetchWishlist(token);
          } else {
            setToken(null);
            localStorage.removeItem('smartpick_token');
          }
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('smartpick_token');
        });
    }
  }, [token]);

  const fetchWishlist = async (authToken) => {
    try {
      const r = await fetch('/api/wishlists', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (r.ok) {
        const data = await r.json();
        setWishlistIds((data.items || []).map(i => i.product_id));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Login failed');
        return false;
      }
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartpick_token', data.token);
      showToast(`Welcome back, ${data.user.full_name}!`);
      fetchWishlist(data.token);
      return true;
    } catch {
      showToast('Network error during login');
      return false;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName })
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Registration failed');
        return false;
      }
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartpick_token', data.token);
      showToast(`Account created for ${data.user.full_name}`);
      return true;
    } catch {
      showToast('Network error during registration');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWishlistIds([]);
    localStorage.removeItem('smartpick_token');
    showToast('Signed out of SmartPick');
  };

  const addToCompare = (productId) => {
    if (compareList.includes(productId)) return;
    if (compareList.length >= 4) {
      showToast('You can compare at most 4 products at once');
      return;
    }
    setCompareList(prev => [...prev, productId]);
    showToast('Product added to comparison');
  };

  const removeFromCompare = (productId) => {
    setCompareList(prev => prev.filter(id => id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const toggleWishlist = async (productId) => {
    if (!token) {
      showToast('Please sign in to save products to your wishlist');
      return;
    }
    const isSaved = wishlistIds.includes(productId);
    if (isSaved) {
      // Remove
      setWishlistIds(prev => prev.filter(id => id !== productId));
      await fetch(`/api/wishlists/default/items/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Removed from saved wishlist');
    } else {
      // Add
      setWishlistIds(prev => [...prev, productId]);
      await fetch('/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      });
      showToast('Added to your saved wishlist');
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
        toastMessage,
        showToast
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
