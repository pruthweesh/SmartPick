/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  Home,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: Layers, defaultCeiling: 150000 },
  { id: 'smartphones', name: 'Smartphones', icon: Smartphone, defaultCeiling: 140000 },
  { id: 'laptops', name: 'Laptops', icon: Laptop, defaultCeiling: 150000 },
  { id: 'audio', name: 'Audio & ANC', icon: Headphones, defaultCeiling: 35000 },
  { id: 'smartwatches', name: 'Smartwatches', icon: Watch, defaultCeiling: 50000 },
  { id: 'tablets', name: 'Tablets', icon: Tablet, defaultCeiling: 70000 },
  { id: 'smart-home', name: 'Smart Living', icon: Home, defaultCeiling: 60000 }
];

const PRICE_PRESETS = [
  { label: 'All Budgets', max: 150000 },
  { label: 'Under ₹3k', max: 3000 },
  { label: 'Under ₹10k', max: 10000 },
  { label: 'Under ₹35k', max: 35000 },
  { label: 'Under ₹75k', max: 75000 },
  { label: 'Under ₹1.3L', max: 130000 }
];

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'all';
  const initialMaxPrice = Number(searchParams.get('max_price')) || 150000;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('min_price')) || 0);

  // Hardware criteria
  const [ancOnly, setAncOnly] = useState(searchParams.get('anc') === 'true');
  const [waterOnly, setWaterOnly] = useState(searchParams.get('water') === 'true');
  const [gamingOnly, setGamingOnly] = useState(searchParams.get('gaming') === 'true');
  const [minBattery, setMinBattery] = useState(searchParams.get('battery') || '');

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'price_asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category state with searchParams if changed from outside
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Dynamic brands list computed from loaded products
  const availableBrands = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      if (p.brand) set.add(p.brand);
    });
    return ['All Brands', ...Array.from(set).sort()];
  }, [products]);

  const fetchFilteredProducts = () => {
    setLoading(true);
    setServerError(null);
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery) params.set('search', searchQuery);
    if (selectedBrand && selectedBrand !== 'All Brands') params.set('brand', selectedBrand);
    if (maxPrice < 150000) params.set('max_price', String(maxPrice));
    if (minPrice > 0) params.set('min_price', String(minPrice));
    if (ancOnly) params.set('anc', 'true');
    if (waterOnly) params.set('water_resistance', 'true');
    if (gamingOnly) params.set('gaming_mode', 'true');
    if (minBattery) params.set('min_battery', minBattery);
    if (sortBy) params.set('sort', sortBy);
    params.set('limit', '50');

    fetch(`/api/products?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to retrieve products`);
        return res.json();
      })
      .then(data => {
        setProducts(data.data || []);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setServerError('Unable to fetch product catalog from SmartPick server. Check network or server status.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategory, searchQuery, selectedBrand, maxPrice, minPrice, ancOnly, waterOnly, gamingOnly, minBattery, sortBy]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSelectedBrand('');
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (catId === 'all') {
        next.delete('category');
      } else {
        next.set('category', catId);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedBrand('');
    setMaxPrice(150000);
    setMinPrice(0);
    setAncOnly(false);
    setWaterOnly(false);
    setGamingOnly(false);
    setMinBattery('');
    setSortBy('price_asc');
    setSearchParams({});
  };

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>41 Verified Laboratory Specifications · Multi-Category Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {selectedCategory === 'all'
              ? 'Curated Tech & Hardware Catalog'
              : `Curated ${activeCategoryObj.name}`}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Every device audited for silicon benchmarks, verified battery runtimes, authentic acoustic measurements, and real-time live Indian retail pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.1] dark:border-white/[0.1] text-xs font-semibold text-neutral-900 dark:text-white shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-mono hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white transition shadow-2xs"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="completeness">Spec Completeness</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Ribbon Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-black/[0.05] dark:border-white/[0.05]">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-tight transition shrink-0 border ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white shadow-2xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-black/[0.06] dark:border-white/[0.06] hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-850'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside
          className={`space-y-6 md:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white dark:bg-[#111216] p-6 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] h-fit shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              Filter Parameters
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Keyword or Model
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. MacBook, S24, ANC, Dyson..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white font-medium"
              />
            </div>
          </div>

          {/* Budget Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Budget Ceiling
              </label>
              <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                {maxPrice >= 150000 ? 'No Limit' : `₹${maxPrice.toLocaleString('en-IN')}`}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={2000}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-white"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-400">
              <span>₹1k</span>
              <span>₹50k</span>
              <span>₹1.5L+</span>
            </div>

            {/* Price Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRICE_PRESETS.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setMaxPrice(p.max)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition ${
                    maxPrice === p.max
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white'
                      : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-black/[0.06] dark:border-white/[0.06] hover:bg-neutral-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Manufacturer / Brand
            </label>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
            >
              {availableBrands.map(b => (
                <option key={b} value={b === 'All Brands' ? '' : b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
              Hardware Criteria
            </span>

            <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={ancOnly}
                onChange={e => setAncOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 accent-neutral-900 dark:accent-white"
              />
              <span className="font-medium">Active Noise Cancellation (ANC)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={waterOnly}
                onChange={e => setWaterOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 accent-neutral-900 dark:accent-white"
              />
              <span className="font-medium">IPX4+ / Water Resistance</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={gamingOnly}
                onChange={e => setGamingOnly(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-900 focus:ring-neutral-900 accent-neutral-900 dark:accent-white"
              />
              <span className="font-medium">Low Latency / High Performance</span>
            </label>
          </div>

          {/* Battery Filter */}
          <div className="space-y-1.5 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Playback / Battery Endurance
            </label>
            <select
              value={minBattery}
              onChange={e => setMinBattery(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
            >
              <option value="">Any battery life</option>
              <option value="15">15+ hours</option>
              <option value="30">30+ hours</option>
              <option value="40">40+ hours</option>
              <option value="50">50+ hours (Marathon)</option>
            </select>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>
              Showing <strong className="text-neutral-900 dark:text-white font-bold">{products.length}</strong> verified models
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Zero sponsored bias
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-96 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800 animate-pulse" />
              ))}
            </div>
          ) : serverError ? (
            <EmptyState
              type="server-error"
              title="Catalog Server Unavailable"
              description={serverError}
              actionText="Retry Loading Catalog"
              onAction={fetchFilteredProducts}
              secondaryActionText="Reset All Filters"
              onSecondaryAction={resetFilters}
            />
          ) : products.length === 0 ? (
            <EmptyState
              type="no-results"
              title="No Products Matched Your Criteria"
              description="No audited models in this category match your active search terms or strict hardware parameters."
              details="Try raising the budget ceiling, switching to 'All Categories', selecting 'All Brands', or clearing specific hardware filters."
              actionText="Reset All Filters"
              onAction={resetFilters}
              secondaryActionText="Ask AI Advisor"
              secondaryActionHref="/advisor"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
