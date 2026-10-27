import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const Navbar = () => {
  const { user, isDarkMode, toggleDarkMode, compareList, wishlistIds, logout } = useApp();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#faf9f7]/90 dark:bg-[#0b0c0f]/90 backdrop-blur-xl border-b border-black/[0.07] dark:border-white/[0.08] transition-colors">
      {/* Top Editorial Authority Micro-bar */}
      <div className="border-b border-black/[0.05] dark:border-white/[0.05] bg-white/60 dark:bg-black/40 px-4 py-1.5 text-[11px] text-neutral-600 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="font-medium tracking-tight">
              Independent Tech & Electronics Lab — Verified Smartphones, Laptops, Audio, Wearables & Smart Living
            </span>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
            <span className="hidden sm:inline text-neutral-500 dark:text-neutral-400">
              Deterministic evaluations with zero sponsored bias
            </span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link
              to="/methodology"
              className="hover:text-neutral-900 dark:hover:text-white transition tracking-wide text-[10.5px] uppercase font-semibold"
            >
              Audit Standards
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-[10.5px] font-mono tracking-wider text-neutral-600 dark:text-neutral-400">
              IN · INR (₹)
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar (1-Row, 3-Zone Contract) */}
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
              to="/products?category=smartphones"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${location.search.includes('smartphones')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <span>Phones</span>
            </Link>

            <Link
              to="/products?category=laptops"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${location.search.includes('laptops')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <span>Laptops</span>
            </Link>

            <Link
              to="/products?category=audio"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${location.search.includes('audio') || location.search.includes('earbuds')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <span>Audio</span>
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

            <Link
              to="/methodology"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${isActive('/methodology')
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60'
                }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
              <span>Audit</span>
            </Link>
          </nav>

          {/* Zone 3: Utility Controls & Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/70 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

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

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block mx-1" />

            {/* User Account Menu / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white/70 dark:bg-neutral-800/70 text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-[10px]">
                    {user.full_name.charAt(0).toUpperCase()}
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
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        Account & Acoustic Preferences
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
      {
        mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0b0c0f] px-5 py-4 space-y-1.5 animate-in slide-in-from-top-2 duration-150">
            <Link
              to="/advisor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white" />
              AI Advisor Intake
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              Tested Earbuds Catalog
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
            <Link
              to="/methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-semibold text-neutral-900 dark:text-white text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              Lab Testing Methodology
            </Link>
          </div>
        )
      }
    </header >
  );
};