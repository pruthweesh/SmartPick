/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Scale,
  X,
  Plus,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useApp();
  const [searchParams] = useSearchParams();

  const [compareProducts, setCompareProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [drawerSearch, setDrawerSearch] = useState('');
  const [filterDifferencesOnly, setFilterDifferencesOnly] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState('stacked');

  useEffect(() => {
    fetch('/api/products?limit=50')
      .then(r => r.json())
      .then(d => setAllProducts(d.data || []));
  }, []);

  useEffect(() => {
    const ids = searchParams.get('ids')
      ? searchParams.get('ids').split(',')
      : compareList;

    if (ids.length < 2) {
      if (allProducts.length >= 2 && compareList.length === 0) {
        addToCompare(allProducts[0].id);
        addToCompare(allProducts[1].id);
      }
      return;
    }

    setLoading(true);
    fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_ids: ids.slice(0, 4) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setCompareProducts(data.products);
          setAiInsight(data.ai_comparison || '');
        }
      })
      .catch(err => console.error('Failed to fetch comparison:', err))
      .finally(() => setLoading(false));
  }, [compareList, searchParams, allProducts]);

  const masterAttributes = useMemo(() => [
    { label: 'Lowest Price (INR)', key: 'price' },
    { label: 'Processor / Chipset', key: 'processor' },
    { label: 'Display & Refresh Rate', key: 'display' },
    { label: 'RAM & Internal Storage', key: 'ram_storage' },
    { label: 'Camera Hardware', key: 'rear_camera' },
    { label: 'Battery Capacity / Life', key: 'total_battery_life' },
    { label: 'Charging Speed / Tech', key: 'fast_charging' },
    { label: 'Active Noise Cancellation', key: 'anc_rating' },
    { label: 'Audio Driver / Sound', key: 'driver_size' },
    { label: 'Microphone & Calls', key: 'enc_mic_quality' },
    { label: 'Ingress Protection (IP)', key: 'water_resistance' },
    { label: 'Operating System', key: 'os' },
    { label: 'Wireless Protocol', key: 'bluetooth_version' },
    { label: 'Audio Codec Support', key: 'audio_codec' },
    { label: 'Manufacturer Warranty', key: 'warranty' }
  ], []);

  const getAttributeValue = (prod, key) => {
    if (key === 'price') {
      const best = prod.offers && prod.offers.length > 0
        ? Math.min(...prod.offers.map(o => o.current_price))
        : 0;
      return best > 0 ? `₹${best.toLocaleString('en-IN')}` : 'Not available';
    }
    const spec = (prod.specifications || []).find(s => s.spec_key === key);
    if (!spec || !spec.spec_value) return 'Not available';
    const str = String(spec.spec_value).trim();
    if (!str || str.toLowerCase() === 'null' || str.toLowerCase().includes('not available')) {
      return 'Not available';
    }
    return `${str}${spec.unit ? ' ' + spec.unit : ''}`;
  };

  const isAttrDifferent = (key) => {
    if (compareProducts.length < 2) return false;
    const values = compareProducts.map(p => getAttributeValue(p, key));
    return new Set(values).size > 1;
  };

  const displayedAttributes = useMemo(() => {
    // Only display attributes that are present in at least one compared product
    const relevantAttrs = masterAttributes.filter(attr => {
      if (attr.key === 'price') return true;
      return compareProducts.some(p => {
        const val = getAttributeValue(p, attr.key);
        return val !== 'Not available';
      });
    });

    if (!filterDifferencesOnly) return relevantAttrs;
    return relevantAttrs.filter(attr => isAttrDifferent(attr.key));
  }, [masterAttributes, filterDifferencesOnly, compareProducts]);

  const filteredDrawerProducts = useMemo(() => {
    const term = drawerSearch.toLowerCase().trim();
    return allProducts
      .filter(p => !compareList.includes(p.id))
      .filter(p => !term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term) || (p.category && p.category.toLowerCase().includes(term)));
  }, [allProducts, compareList, drawerSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07] gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 mb-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>Side-by-Side Hardware Matrix</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Comparison Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Compare verified technical attributes side-by-side with automatic difference detection across categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareProducts.length < 4 && (
            <button
              onClick={() => {
                setSelectorOpen(!selectorOpen);
                setDrawerSearch('');
              }}
              className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Model ({compareProducts.length}/4)</span>
            </button>
          )}

          {compareProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-4 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs transition"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Add Product Dropdown Drawer */}
      {selectorOpen && (
        <div className="bg-white dark:bg-[#111216] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-sm space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Select product to add to studio (up to 4):
            </h4>
            <button
              onClick={() => setSelectorOpen(false)}
              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by brand, model, or category (e.g. OnePlus, MacBook, S24)..."
              value={drawerSearch}
              onChange={e => setDrawerSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
            {filteredDrawerProducts.length > 0 ? (
              filteredDrawerProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    addToCompare(p.id);
                    setSelectorOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-black/[0.06] dark:border-white/[0.06] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left text-xs transition"
                >
                  <img src={p.image_url} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-neutral-100 p-0.5 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-neutral-900 dark:text-white block truncate">{p.name}</span>
                    <span className="text-neutral-500 text-[10px] uppercase font-mono">{p.brand} · {p.category}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-xs text-neutral-400 italic py-2 col-span-full">
                No matching models found in our tested catalog.
              </p>
            )}
          </div>
        </div>
      )}

      {/* AI Comparison Analysis Box */}
      {aiInsight && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-white shrink-0" />
            <h3 className="font-bold text-base tracking-tight">Acoustic Comparative Analysis</h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {aiInsight}
          </p>
        </div>
      )}

      {/* Comparison Body */}
      {compareProducts.length < 2 ? (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-12 text-center border border-black/[0.08] dark:border-white/[0.08] space-y-4">
          <Scale className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">Add at least 2 products to compare</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Browse our tested earbuds catalog and click "Compare" on the models you wish to evaluate side-by-side.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs transition"
          >
            Browse Earbuds Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar: Filter Differences */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111216] p-4 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] shadow-2xs">
            <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                Comparing {compareProducts.length} models
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <button
                type="button"
                onClick={() => setFilterDifferencesOnly(!filterDifferencesOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                  filterDifferencesOnly
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.06]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{filterDifferencesOnly ? 'Showing Differences Only' : 'Show Differences Only'}</span>
              </button>
            </div>

            {/* Mobile View Switcher */}
            <div className="flex md:hidden items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[11px] font-mono text-neutral-400">Layout:</span>
              <div className="inline-flex rounded-lg bg-neutral-100 dark:bg-neutral-800 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMobileViewMode('stacked')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    mobileViewMode === 'stacked'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  Stacked
                </button>
                <button
                  type="button"
                  onClick={() => setMobileViewMode('specs')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    mobileViewMode === 'specs'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  By Spec
                </button>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Table */}
          <div className="hidden md:block bg-white dark:bg-[#111216] rounded-3xl border border-black/[0.08] dark:border-white/[0.08] overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-black/[0.07] dark:border-white/[0.07] bg-neutral-50/50 dark:bg-neutral-900/40">
                  <th className="p-5 w-48 text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                    Acoustic Attribute
                  </th>
                  {compareProducts.map(prod => (
                    <th key={prod.id} className="p-5 align-top w-64 min-w-[220px]">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                            {prod.brand}
                          </span>
                          <button
                            onClick={() => removeFromCompare(prod.id)}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="w-20 h-20 rounded-xl bg-[#f5f5f7] dark:bg-[#16181f] p-2 flex items-center justify-center">
                          <img src={prod.image_url} alt={prod.name} className="w-full h-full object-contain" />
                        </div>

                        <Link
                          to={`/products/${prod.id}`}
                          className="font-bold text-sm text-neutral-900 dark:text-white hover:text-neutral-600 line-clamp-1 block"
                        >
                          {prod.name}
                        </Link>

                        {prod.offers && prod.offers.length > 0 ? (
                          <a
                            href={prod.offers[0].affiliate_url || prod.offers[0].retailer_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs transition shadow-2xs tabular-nums"
                          >
                            <span>Buy for ₹{prod.offers[0].current_price.toLocaleString('en-IN')}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <div className="text-center py-1.5 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-400 text-xs italic">
                            Offers: Not available
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-black/[0.06] dark:divide-white/[0.06] text-xs">
                {displayedAttributes.map(attr => {
                  const isDifferent = isAttrDifferent(attr.key);

                  return (
                    <tr
                      key={attr.key}
                      className={`transition ${isDifferent ? 'bg-neutral-50/70 dark:bg-neutral-850/50' : 'hover:bg-neutral-50/30'}`}
                    >
                      <td className="p-4 font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50/40 dark:bg-neutral-900/40 text-xs font-mono">
                        {attr.label}
                        {isDifferent && (
                          <span className="block text-[10px] text-neutral-400 font-normal mt-0.5">
                            Differs between models
                          </span>
                        )}
                      </td>

                      {compareProducts.map(prod => {
                        const val = getAttributeValue(prod, attr.key);
                        return (
                          <td key={prod.id} className="p-4 font-medium text-neutral-900 dark:text-white">
                            <span
                              className={
                                val.toLowerCase().includes('not available')
                                  ? 'text-neutral-400 italic'
                                  : attr.key === 'price'
                                  ? 'font-bold text-sm tabular-nums'
                                  : ''
                              }
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Cards */}
          <div className="block md:hidden space-y-4">
            {compareProducts.map(prod => (
              <div
                key={prod.id}
                className="bg-white dark:bg-[#111216] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden shadow-2xs"
              >
                <div className="p-4 bg-neutral-50/70 dark:bg-neutral-900/50 border-b border-black/[0.06] dark:border-white/[0.06] flex items-start gap-3">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-14 h-14 rounded-xl object-contain bg-[#f5f5f7] dark:bg-neutral-800 shrink-0 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                        {prod.brand}
                      </span>
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Link
                      to={`/products/${prod.id}`}
                      className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1 block mt-0.5"
                    >
                      {prod.name}
                    </Link>
                    <div className="mt-1 font-bold text-sm tabular-nums">
                      {getAttributeValue(prod, 'price')}
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05] text-xs">
                  {displayedAttributes.map(attr => (
                    <div key={attr.key} className="p-3.5 flex items-center justify-between gap-3">
                      <span className="text-neutral-500 dark:text-neutral-400">{attr.label}</span>
                      <span className="font-medium text-neutral-900 dark:text-white text-right">
                        {getAttributeValue(prod, attr.key)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
