import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Scale,
  Bookmark,
  Sun,
  Moon,
  ShieldCheck,
  User,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronDown,
  ShoppingCart,
  Package,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const Navbar = () => {
  const { user, isDarkMode, toggleDarkMode, compareList, wishlistIds, cart, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountNavOpen, setAccountNavOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const accountMenuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountNavOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAccountActive =
    isActive('/account') ||
    isActive('/cart') ||
    isActive('/order-history') ||
    isActive('/payment') ||
    isActive('/alerts') ||
    isActive('/faq') ||
    isActive('/terms') ||
    isActive('/privacy');

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7]/90 dark:bg-[#0b0c0f]/90 backdrop-blur-xl border-b border-black/[0.07] dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-bold tracking-tighter text-sm shadow-sm group-hover:scale-[1.02] transition">
                SP
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                  SMARTPICK
                </span>
                <span className="text-[9.5px] font-semibold tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400 mt-0.5">
                  Tech Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${isActive('/')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <span>Home</span>
            </Link>

            <Link
              to="/advisor"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${isActive('/advisor')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advisor</span>
            </Link>

            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${location.pathname === '/products' && !location.search
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <span>All Products</span>
            </Link>

            <Link
              to="/compare"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${isActive('/compare')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <Scale className="w-3.5 h-3.5 opacity-70" />
              <span>Studio</span>
              {compareList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white text-[10px] font-mono">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Account Option right after Studio */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountNavOpen(!accountNavOpen)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${isAccountActive || accountNavOpen
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                  }`}
              >
                <User className="w-3.5 h-3.5 opacity-70" />
                <span>Account</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${accountNavOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountNavOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200/90 dark:border-neutral-800 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* Account Header */}
                  <div className="px-3.5 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    {user ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-neutral-900 dark:text-white truncate">{user.full_name}</p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white">Customer Account</p>
                          <p className="text-[10.5px] text-neutral-500">Sign in to track orders & cart</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setAccountNavOpen(false)}
                          className="px-3 py-1 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[11px] font-semibold"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Shopping & Orders Section */}
                  <div className="space-y-0.5">
                    <span className="block px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Shopping & Orders
                    </span>
                    <Link
                      to="/cart"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <span className="flex items-center gap-2.5">
                        <ShoppingCart className="w-4 h-4 text-neutral-400" />
                        <span>My Cart</span>
                      </span>
                      {cart?.items?.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold">
                          {cart.items.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/order-history"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <Package className="w-4 h-4 text-neutral-400" />
                      <span>Order History & Invoices</span>
                    </Link>

                    <Link
                      to="/payment/preview"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <CreditCard className="w-4 h-4 text-neutral-400" />
                      <span>Payment Methods & UPI</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <span className="flex items-center gap-2.5">
                        <Bookmark className="w-4 h-4 text-neutral-400" />
                        <span>Saved Wishlist</span>
                      </span>
                      {wishlistIds.length > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-mono">
                          {wishlistIds.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/alerts"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <Bell className="w-4 h-4 text-neutral-400" />
                      <span>Price Drop Alerts</span>
                    </Link>
                  </div>

                  {/* Settings & Policies */}
                  <div className="pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800 space-y-0.5">
                    <span className="block px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Account & Policies
                    </span>
                    <Link
                      to="/account"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <Settings className="w-4 h-4 text-neutral-400" />
                      <span>Profile Settings</span>
                    </Link>

                    <Link
                      to="/faq"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <HelpCircle className="w-4 h-4 text-neutral-400" />
                      <span>Help & FAQs</span>
                    </Link>

                    <Link
                      to="/terms"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <span>Terms & Return Policy</span>
                    </Link>

                    <Link
                      to="/privacy"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <Shield className="w-4 h-4 text-neutral-400" />
                      <span>Privacy Policy</span>
                    </Link>

                    <Link
                      to="/report-issue"
                      onClick={() => setAccountNavOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition"
                    >
                      <AlertCircle className="w-4 h-4 text-neutral-400" />
                      <span>Report an Issue</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  {user && (
                    <div className="pt-2 mt-1 border-t border-neutral-100 dark:border-neutral-800">
                      <button
                        onClick={() => {
                          setAccountNavOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Quick Access */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[9px] font-mono font-bold flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>

            {/* Saved Wishlist Link */}
            <Link
              to="/wishlist"
              aria-label="Saved products"
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition relative"
            >
              <Bookmark className="w-4 h-4" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neutral-900 dark:bg-white" />
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block mx-1" />

            {/* User Avatar / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-[10px]">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.full_name}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/80 dark:border-neutral-800 py-2 z-50 text-xs animate-in fade-in duration-100">
                    <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="font-bold text-neutral-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                          LAB ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 font-medium"
                      >
                        <Settings className="w-3.5 h-3.5 text-neutral-400" />
                        Account & Preferences
                      </Link>

                      <Link
                        to="/order-history"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 font-medium"
                      >
                        <Package className="w-3.5 h-3.5 text-neutral-400" />
                        My Orders
                      </Link>

                      <Link
                        to="/alerts"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 font-medium"
                      >
                        <Bell className="w-3.5 h-3.5 text-neutral-400" />
                        Price Drop Trackers
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-neutral-900 dark:text-white font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Database Governance
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/20 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/account"
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold tracking-wide transition shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0b0c0f] px-5 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Home
          </Link>
          <Link
            to="/advisor"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
            AI Advisor
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <Search className="w-4 h-4 text-neutral-400" />
            All Products Catalog
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <span className="flex items-center gap-2.5">
              <Scale className="w-4 h-4 text-neutral-400" />
              Comparison Studio
            </span>
            {compareList.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-[10px] font-mono font-bold">
                {compareList.length}
              </span>
            )}
          </Link>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <span className="block px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
              Account & Shopping
            </span>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5 text-neutral-400" />
                My Cart
              </span>
              {cart?.items?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-mono">
                  {cart.items.length}
                </span>
              )}
            </Link>
            <Link
              to="/order-history"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Package className="w-3.5 h-3.5 text-neutral-400" />
              Order History
            </Link>
            <Link
              to="/payment/preview"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
              Payment Methods
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
              Wishlist
            </Link>
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-400" />
              Profile Settings
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              FAQs & Help
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              Terms of Service
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
