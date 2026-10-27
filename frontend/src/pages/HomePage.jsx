/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Tablet,
  Home,
  Check,
  ChevronRight,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard.jsx';

import heroShowcaseImg from '../assets/images/hero_audio_showcase_1793002888947.jpg';
import studioMacroImg from '../assets/images/studio_earbuds_macro_1793002888854.jpg';
import labChamberImg from '../assets/images/acoustic_testing_chamber_1793002903816.jpg';

export const HomePage = () => {
  const navigate = useNavigate();
  const [naturalQuery, setNaturalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'All Products', icon: Layers },
    { id: 'smartphones', label: 'Smartphones', icon: Smartphone },
    { id: 'laptops', label: 'Laptops', icon: Laptop },
    { id: 'audio', label: 'Audio & ANC', icon: Headphones },
    { id: 'smartwatches', label: 'Smartwatches', icon: Watch },
    { id: 'tablets', label: 'Tablets', icon: Tablet },
    { id: 'smart-home', label: 'Smart Living', icon: Home }
  ];

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory === 'all'
      ? '/api/products?limit=8'
      : `/api/products?category=${selectedCategory}&limit=8`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.data || []);
      })
      .catch(err => console.error('Failed to load featured products:', err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (naturalQuery.trim()) {
      navigate(`/advisor?q=${encodeURIComponent(naturalQuery.trim())}`);
    } else {
      navigate('/advisor');
    }
  };

  const handleExampleClick = (example) => {
    navigate(`/advisor?q=${encodeURIComponent(example)}`);
  };

  return (
    <div className="space-y-20 pb-24">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-black/[0.06] dark:border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800/80 border border-black/[0.06] dark:border-white/[0.06] text-xs font-mono tracking-wider uppercase text-neutral-800 dark:text-neutral-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Verified Electronics & Lifestyle Tech · India</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.08] text-balance">
                The Fiduciary Tech Advisor. Curated without retail noise.
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                Marketplaces overwhelm shoppers with thousands of sponsored listings. SmartPick indexes audited hardware data sheets, BIS laboratory standards, and real-time retailer pricing to recommend 3–5 definitive choices with transparent compromises.
              </p>

              {/* Natural Language Command Bar */}
              <form onSubmit={handleQuerySubmit} className="pt-2 max-w-xl">
                <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-2xl border border-black/[0.12] dark:border-white/[0.14] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] focus-within:border-neutral-900 dark:focus-within:border-white transition">
                  <Sparkles className="w-5 h-5 text-neutral-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={naturalQuery}
                    onChange={e => setNaturalQuery(e.target.value)}
                    placeholder="Describe your requirement: e.g. Flagship phone under ₹70,000 for travel & low light..."
                    className="w-full px-3 py-3 text-neutral-900 dark:text-white bg-transparent placeholder-neutral-400 focus:outline-none text-xs sm:text-sm font-medium"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide transition shrink-0 flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Curate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Curated Multi-Category Prompts */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                  Popular Scenarios:
                </span>
                {[
                  'Camera phone under ₹75,000 for portrait photography',
                  'Lightweight laptop for coding with 16GB RAM',
                  'Noise cancelling over-ear headphones for flights',
                  'Smartwatch with 10+ day battery & GPS',
                  'Cordless vacuum for pet hair & hard floors'
                ].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleExampleClick(chip)}
                    className="px-3 py-1 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-neutral-800/60 dark:hover:bg-neutral-700/80 transition cursor-pointer border border-black/[0.04] dark:border-white/[0.04]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Hero Studio Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.08)] bg-neutral-100 dark:bg-neutral-900">
                <img
                  src={heroShowcaseImg}
                  alt="Precision audio and tech studio showcase"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-300">
                    Hardware Evaluation Standard
                  </span>
                  <p className="text-base font-bold tracking-tight text-white mt-1">
                    Certified 6-Factor Deterministic Auditing
                  </p>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    Tested against Bureau of Indian Standards (BIS) and verified manufacturer data sheets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold">
            Explore Verified Categories
          </span>
          <Link
            to="/products"
            className="text-xs font-semibold text-neutral-900 dark:text-white hover:underline flex items-center gap-1"
          >
            <span>View All Tech Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'bg-white dark:bg-[#111216] text-neutral-600 dark:text-neutral-400 border-black/[0.08] dark:border-white/[0.08] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED MULTI-CATEGORY PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              {selectedCategory === 'all'
                ? 'Curated Technology Across All Categories'
                : `Verified Picks: ${categories.find(c => c.id === selectedCategory)?.label}`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Every model audited for hardware specifications, real-world battery endurance, and verified live retail prices.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. THREE PILLARS OF EVIDENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-7 rounded-2xl bg-white dark:bg-[#111216] border border-black/[0.07] dark:border-white/[0.07] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs font-bold text-neutral-900 dark:text-white">
              01
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Hard Budget Ceilings
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If your budget is ₹50,000, we never show ₹54,999 models pretending it fits. We respect your financial boundaries completely.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#111216] border border-black/[0.07] dark:border-white/[0.07] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs font-bold text-neutral-900 dark:text-white">
              02
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Honest Engineering Compromises
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every device involves trade-offs. We explicitly list what you sacrifice: thermal throttling vs battery life, screen brightness vs battery drain, or camera optical zoom.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white dark:bg-[#111216] border border-black/[0.07] dark:border-white/[0.07] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs font-bold text-neutral-900 dark:text-white">
              03
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Verified Retail Comparison
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We cross-check Amazon India, Flipkart, and Croma deals to find genuine historical low prices and link you directly to the retailer to complete your purchase safely.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CRAFTSMANSHIP & RIGOR DOCUMENTARY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 dark:bg-[#111216] text-white p-8 sm:p-12 border border-neutral-800 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                Independent Audit Standard
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Zero sponsored rankings. No fake flash timers.
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                SmartPick is funded strictly through transparent retailer affiliate links that never affect product scores. A ₹30,000 phone with better camera stabilization will always outrank a ₹70,000 phone if your stated goal is low-light video clarity.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Deterministic 6-Factor Algorithm
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Bureau of Indian Standards (BIS) Validated
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Zero Algorithmic Bias
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-700/60 shadow-lg">
                <img
                  src={labChamberImg}
                  alt="Precision laboratory verification"
                  className="w-full aspect-[16/10] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIMARY ADVISOR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-14 text-center space-y-5 border border-neutral-800">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-white flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Stop scrolling 500 duplicate marketplace listings.
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-xs sm:text-sm leading-relaxed">
            Tell our AI tech advisor what you need: phone, laptop, headphones, or smartwatch. Receive 3–5 tailored picks in under 20 seconds.
          </p>
          <div className="pt-2">
            <Link
              to="/advisor"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs sm:text-sm tracking-wide shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Shopping Advisor</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
