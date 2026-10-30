import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Bookmark,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import {
  calculateCartTotals,
  validateCoupon,
  checkPincodeDelivery,
  COUPONS,
  DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from '../utils/cartUtils.js';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    saveForLater,
    savedForLater,
    moveToCart,
    removeSavedForLater,
    addToCart,
    clearCart,
  } = useApp();

  const navigate = useNavigate();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Pincode state
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [pincodeError, setPincodeError] = useState('');

  // Catalog recommendations for "You may also like"
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products?limit=8')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.products || [];
        // Filter out items already in cart
        const cartIds = cartItems.map((i) => i.product_id);
        setRecommendedProducts(list.filter((p) => !cartIds.includes(p.id)).slice(0, 4));
      })
      .catch(() => {
        setRecommendedProducts([]);
      });
  }, [cartItems]);

  // Recalculate totals whenever items or applied coupon change
  const totals = calculateCartTotals(cartItems, appliedCoupon);

  // If subtotal drops below coupon minimum, auto-invalidate with message
  useEffect(() => {
    if (appliedCoupon?.minOrder && totals.subtotal < appliedCoupon.minOrder) {
      setAppliedCoupon(null);
      setCouponSuccess('');
      setCouponError(
        `Coupon ${appliedCoupon.code} was removed because order total fell below ₹${appliedCoupon.minOrder}`
      );
    }
  }, [totals.subtotal, appliedCoupon]);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const res = validateCoupon(couponCode, totals.subtotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setCouponSuccess(res.message);
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  const handleCheckPincode = (e) => {
    e?.preventDefault();
    setPincodeError('');
    const res = checkPincodeDelivery(pincode);
    if (res.valid) {
      setPincodeResult(res);
    } else {
      setPincodeResult(null);
      setPincodeError(res.message);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Shopping Cart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Shopping Cart
            {cartItems.length > 0 && (
              <span className="ml-3 text-sm font-mono font-medium text-neutral-500 dark:text-neutral-400">
                ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} {cartItems.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'item' : 'items'})
              </span>
            )}
          </h1>
        </div>

        {cartItems.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-semibold text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Cart</span>
            </button>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <Link
              to="/products"
              className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="py-16 px-4 text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-500">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Your Cart is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Explore our laboratory-verified gadgets, compare flagship smartphones, audiophile earphones, and high-performance laptops.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore All Verified Tech</span>
            </Link>
          </div>
        </div>
      ) : (
        /* 2-Column Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List (col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Delivery Banner Indicator */}
            <div className="p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 text-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white shadow-2xs">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  {totals.isFreeDelivery ? (
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Congratulations! You unlocked FREE Standard Delivery
                    </p>
                  ) : (
                    <p className="text-neutral-700 dark:text-neutral-300">
                      Add <span className="font-bold text-neutral-900 dark:text-white">₹{totals.deliveryThresholdRemaining.toLocaleString('en-IN')}</span> more to qualify for <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE Delivery</span>
                    </p>
                  )}
                  <span className="text-[11px] text-neutral-500">Orders above ₹499 qualify for complimentary zero-fee delivery</span>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Standard Fee</span>
                <p className="font-bold text-neutral-900 dark:text-white">
                  {totals.isFreeDelivery ? <span className="text-emerald-600 dark:text-emerald-400">FREE</span> : `₹${STANDARD_DELIVERY_FEE}`}
                </p>
              </div>
            </div>

            {/* Items Container */}
            <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
              {cartItems.map((item) => {
                const discountPct = item.original_price > item.unit_price
                  ? Math.round(((item.original_price - item.unit_price) / item.original_price) * 100)
                  : 0;

                const lineTotal = item.unit_price * item.quantity;
                const lineOriginalTotal = item.original_price * item.quantity;

                return (
                  <div key={item.id} className="p-4 sm:p-6 transition hover:bg-neutral-50/50 dark:hover:bg-neutral-850/30">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Thumbnail */}
                      <Link
                        to={`/products/${item.product_id}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 p-2 flex items-center justify-center border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden group"
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-200"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/images/products/placeholder.svg';
                          }}
                        />
                      </Link>

                      {/* Product Info & Specs */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                                {item.brand} • {item.category}
                              </span>
                              <Link
                                to={`/products/${item.product_id}`}
                                className="block font-bold text-sm sm:text-base text-neutral-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition leading-snug mt-0.5"
                              >
                                {item.name}
                              </Link>
                              {item.key_spec && (
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1 font-mono">
                                  {item.key_spec}
                                </p>
                              )}
                            </div>

                            {/* Price on Desktop */}
                            <div className="text-right shrink-0">
                              <span className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white tabular-nums">
                                ₹{lineTotal.toLocaleString('en-IN')}
                              </span>
                              {discountPct > 0 && (
                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                  <span className="text-xs text-neutral-400 line-through tabular-nums">
                                    ₹{lineOriginalTotal.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                    {discountPct}% OFF
                                  </span>
                                </div>
                              )}
                              <span className="text-[10px] text-neutral-500 font-mono block">
                                ₹{item.unit_price.toLocaleString('en-IN')} each
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls: Stepper, Save For Later, Remove */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                          {/* Stepper (1 to 10) */}
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-neutral-500 mr-2 hidden sm:inline">Quantity:</span>
                            <div className="flex items-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 p-0.5">
                              <button
                                type="button"
                                disabled={item.quantity <= 1}
                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center rounded text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold font-mono text-neutral-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={item.quantity >= 10}
                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center rounded text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {item.quantity >= 10 && (
                              <span className="text-[10px] text-amber-600 font-mono ml-2">Max limit (10)</span>
                            )}
                          </div>

                          {/* Secondary Actions */}
                          <div className="flex items-center gap-4 text-xs font-medium">
                            <button
                              type="button"
                              onClick={() => saveForLater(item.product_id)}
                              className="text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition flex items-center gap-1.5"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save for Later</span>
                            </button>
                            <span className="text-neutral-300 dark:text-neutral-700">•</span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery Pincode Checker Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Estimate Express Delivery to PIN Code
                </h3>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 560001)"
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs hover:opacity-90 transition"
                >
                  Check
                </button>
              </form>

              {pincodeError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pincodeError}</span>
                </p>
              )}

              {pincodeResult && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {pincodeResult.message}
                    </p>
                    <p className="text-[11px] opacity-80">
                      Dispatched from {pincodeResult.hubName}
                    </p>
                  </div>
                  {pincodeResult.isExpressAvailable && (
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-bold">
                      EXPRESS ELIGIBLE
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Order Summary (col-span-4) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            {/* Promo Codes & Coupons Box */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Apply Offers & Coupons
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      {appliedCoupon.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-full text-emerald-700 hover:text-red-600 transition"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SAVE10, FLAT200"
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs uppercase font-mono bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs hover:opacity-90 transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-red-500 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}

              {couponSuccess && !appliedCoupon && (
                <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponSuccess}</span>
                </p>
              )}

              {/* Available Coupons Strip */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Available Demo Coupons:
                </span>
                <div className="space-y-1">
                  {Object.values(COUPONS).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCouponCode(c.code);
                        const res = validateCoupon(c.code, totals.subtotal);
                        if (res.valid) {
                          setAppliedCoupon(res.coupon);
                          setCouponSuccess(res.message);
                          setCouponError('');
                        } else {
                          setCouponError(res.message);
                        }
                      }}
                      className="w-full text-left p-2 rounded-lg bg-neutral-50 dark:bg-neutral-850/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] transition flex items-center justify-between group"
                    >
                      <span className="font-mono font-bold text-neutral-900 dark:text-white group-hover:underline">
                        {c.code}
                      </span>
                      <span className="text-neutral-500 text-[10.5px]">
                        {c.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Financials & Order Summary */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Price Details ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items)
              </h3>

              <div className="space-y-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Price (MRP Total)</span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    ₹{totals.originalSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {totals.mrpDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount on MRP</span>
                    <span className="font-mono tabular-nums">
                      -₹{totals.mrpDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                    ₹{totals.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {totals.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">
                      -₹{totals.couponDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Standard Delivery Fee</span>
                  <span className="font-mono tabular-nums">
                    {totals.isFreeDelivery ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">FREE</span>
                    ) : (
                      `₹${totals.deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                  <span>Estimated GST (18% inclusive)</span>
                  <span className="font-mono tabular-nums">
                    ₹{totals.gstAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-neutral-900 dark:text-white block">
                    Total Amount
                  </span>
                  <span className="text-[10px] text-neutral-400">Inclusive of all taxes</span>
                </div>
                <span className="text-2xl font-black text-neutral-900 dark:text-white font-mono tabular-nums">
                  ₹{totals.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Total Savings Highlight Pill */}
              {totals.totalSavings > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 text-center">
                  ✨ You will save ₹{totals.totalSavings.toLocaleString('en-IN')} on this order!
                </div>
              )}

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-extrabold text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit SSL Encrypted & Verified Fulfillment</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved For Later Section */}
      {savedForLater.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-neutral-500" />
              <span>Saved For Later ({savedForLater.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedForLater.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-3"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 shrink-0 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1.5 flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/products/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono uppercase text-neutral-400 font-bold block">
                      {item.brand}
                    </span>
                    <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="font-extrabold text-sm text-neutral-900 dark:text-white mt-1 tabular-nums">
                      ₹{item.unit_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => moveToCart(item.product_id)}
                    className="text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
                  >
                    <span>Move to Cart</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSavedForLater(item.product_id)}
                    className="text-neutral-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* You May Also Like Recommendations Strip */}
      {recommendedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                Recommended Add-ons
              </span>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                You May Also Like
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1"
            >
              <span>Explore All Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((prod) => {
              const lowestPrice = prod.offers?.length > 0
                ? Math.min(...prod.offers.map((o) => o.current_price))
                : (prod.current_price || prod.price || 999);

              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between space-y-3 hover:shadow-md transition"
                >
                  <Link to={`/products/${prod.id}`} className="space-y-2 block">
                    <div className="w-full h-32 bg-neutral-100 dark:bg-neutral-850 rounded-xl p-3 flex items-center justify-center">
                      <img
                        src={prod.image_url || '/images/products/placeholder.svg'}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/products/placeholder.svg';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                        {prod.brand} • {prod.category}
                      </span>
                      <h4 className="font-bold text-xs text-neutral-900 dark:text-white line-clamp-1 mt-0.5">
                        {prod.name}
                      </h4>
                      <p className="font-extrabold text-sm text-neutral-900 dark:text-white mt-1 tabular-nums">
                        ₹{lowestPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart(prod, 1)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mobile Sticky Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0c0f]/95 backdrop-blur-md border-t border-neutral-200 dark:border-neutral-800 p-4 px-6 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono block">
              Total Amount
            </span>
            <span className="text-xl font-black text-neutral-900 dark:text-white font-mono tabular-nums">
              ₹{totals.grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleProceedToCheckout}
            className="py-3 px-6 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
