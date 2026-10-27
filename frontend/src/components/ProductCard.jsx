import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Bookmark,
  ShieldCheck,
  ExternalLink,
  Info,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { IssueReportModal } from './IssueReportModal.jsx';

export const ProductCard = ({ product, recommendationData }) => {
  const { compareList, addToCompare, removeFromCompare, isInWishlist, toggleWishlist } = useApp();
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isCompared = compareList.includes(product.id);
  const isSaved = isInWishlist(product.id);

  // Extract key specs safely
  const getSpec = (key) => {
    const s = (product.specifications || []).find((x) => x.spec_key === key);
    return s ? s.spec_value : null;
  };

  const offers = product.offers || [];
  const lowestPrice = offers.length > 0
    ? Math.min(...offers.map((o) => o.current_price))
    : (product.current_price || product.price || null);
  const bestOffer = offers.length > 0
    ? offers.find((o) => o.current_price === lowestPrice) || offers[0]
    : null;

  // Build clean inline spec string (zero-pill discipline) adapting to category
  const category = (product.category || '').toLowerCase();
  const specItems = [];

  if (category === 'smartphones') {
    const proc = getSpec('processor');
    const disp = getSpec('display');
    const cam = getSpec('rear_camera');
    const bat = getSpec('battery_charging');
    if (proc) specItems.push(proc.split('(')[0].trim());
    if (disp) specItems.push(disp.split(',')[0].trim());
    if (cam) specItems.push(cam.split('+')[0].trim());
    if (bat) specItems.push(bat.split(',')[0].trim());
  } else if (category === 'laptops') {
    const proc = getSpec('processor');
    const ram = getSpec('ram_storage');
    const disp = getSpec('display');
    const bat = getSpec('battery_life');
    if (proc) specItems.push(proc.split('(')[0].trim());
    if (ram) specItems.push(ram);
    if (disp) specItems.push(disp.split('(')[0].trim());
    if (bat) specItems.push(bat.includes('Up to') ? bat : `${bat}h Battery`);
  } else if (category === 'smartwatches') {
    const disp = getSpec('display');
    const bat = getSpec('battery_life');
    const water = getSpec('water_resistance');
    if (disp) specItems.push(disp.split(',')[0].trim());
    if (bat) specItems.push(bat.includes('Up to') ? bat : `${bat} Battery`);
    if (water) specItems.push(water);
  } else if (category === 'tablets') {
    const disp = getSpec('display');
    const proc = getSpec('processor');
    const bat = getSpec('battery_life');
    if (disp) specItems.push(disp.split('(')[0].trim());
    if (proc) specItems.push(proc.split('(')[0].trim());
    if (bat) specItems.push(bat);
  } else if (category === 'smart-home') {
    const power = getSpec('suction_power') || getSpec('sensor') || getSpec('sound_dispersion');
    const bat = getSpec('runtime') || getSpec('battery_life');
    const filt = getSpec('filtration') || getSpec('clicks');
    if (power) specItems.push(power.split('(')[0].trim());
    if (bat) specItems.push(bat);
    if (filt) specItems.push(filt.split('(')[0].trim());
  } else {
    // Audio / earbuds
    const anc = getSpec('anc_rating');
    const battery = getSpec('total_battery_life');
    const driver = getSpec('driver_size');
    const water = getSpec('water_resistance');
    if (anc && !anc.toLowerCase().includes('not available')) specItems.push(`ANC ${anc}`);
    else specItems.push('Passive Isolation');
    if (battery && !battery.toLowerCase().includes('not available')) specItems.push(`${battery}h Battery`);
    if (driver && !driver.toLowerCase().includes('not available')) specItems.push(`${driver}mm Drivers`);
    if (water && !water.toLowerCase().includes('not available')) specItems.push(water);
  }

  return (
    <article className="group bg-white dark:bg-[#111216] rounded-2xl border border-black/[0.08] dark:border-white/[0.08] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
      {/* Recommendation Match Strip */}
      {recommendationData && (
        <div
          className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
            recommendationData.is_near_match
              ? 'bg-amber-500/[0.06] border-amber-500/20 text-amber-900 dark:text-amber-200'
              : 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
          }`}
        >
          <span className="flex items-center gap-1.5 font-medium tracking-tight text-[11px] uppercase">
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
            {recommendationData.is_near_match ? 'Near-Match Alternative' : 'Top Recommendation'}
          </span>
          <span className="font-mono text-xs font-semibold tabular-nums">
            {recommendationData.match_score}/100 Match
          </span>
        </div>
      )}

      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] bg-[#f5f5f7] dark:bg-[#16181f] overflow-hidden flex items-center justify-center p-6 border-b border-black/[0.04] dark:border-white/[0.04]">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Verified Badge */}
        {product.status === 'approved' && (
          <span className="absolute top-3 left-3 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-800 dark:text-neutral-200 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-md border border-black/[0.06] dark:border-white/[0.08] shadow-2xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Audited
          </span>
        )}

        {/* Action Controls in Corner */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label="Save to Wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-2xs border ${
              isSaved
                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                : 'bg-white/90 text-neutral-600 hover:text-neutral-900 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:text-white border-black/[0.08] dark:border-white/[0.08]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Brand & Price Header */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] font-semibold text-neutral-600 dark:text-neutral-400">
              {product.brand} · {product.category.replace('-', ' ')}
            </span>
            <div className="flex items-baseline gap-1.5 tabular-nums">
              {lowestPrice ? (
                <>
                  <span className="text-base font-bold text-neutral-900 dark:text-white tracking-tight">
                    ₹{lowestPrice.toLocaleString('en-IN')}
                  </span>
                  {bestOffer?.original_price && bestOffer.original_price > lowestPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      ₹{bestOffer.original_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-neutral-400 italic">Price unavailable</span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.id}`}
            className="block font-semibold text-neutral-900 dark:text-white text-base leading-snug hover:text-neutral-600 dark:hover:text-neutral-300 transition line-clamp-1"
          >
            {product.name}
          </Link>

          {/* Inline Specifications (Zero-Pill Architecture) */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 font-normal tracking-tight">
            {specItems.join('  ·  ')}
          </p>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed pt-1">
            {product.description}
          </p>
        </div>

        {/* Grounded Recommendation Section if passed */}
        {recommendationData && (
          <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2 text-xs">
            <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
              <span className="font-semibold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider block mb-1">
                Audited Fit Rationale
              </span>
              <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                {recommendationData.why_it_fits}
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-850 p-3 rounded-xl border border-black/[0.04] dark:border-white/[0.04]">
              <span className="font-semibold text-neutral-900 dark:text-white text-[11px] uppercase tracking-wider block mb-1">
                Key Compromise & Limitation
              </span>
              <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed">
                {recommendationData.trade_offs}
              </p>
            </div>

            {recommendationData.score_breakdown && (
              <div className="pt-1">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition"
                >
                  <Info className="w-3 h-3" />
                  <span>{showBreakdown ? 'Hide scoring formula' : 'View scoring breakdown'}</span>
                </button>

                {showBreakdown && (
                  <div className="mt-2 p-3 bg-neutral-100/70 dark:bg-neutral-800 rounded-xl space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 font-mono">
                    <div className="flex justify-between">
                      <span>Use-case fit (35%):</span>
                      <span className="font-semibold">{recommendationData.score_breakdown.use_fit}/35</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Value for money (25%):</span>
                      <span className="font-semibold">{recommendationData.score_breakdown.value_for_money}/25</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spec completeness (15%):</span>
                      <span className="font-semibold">{recommendationData.score_breakdown.spec_completeness}/15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Evidence confidence (10%):</span>
                      <span className="font-semibold">{recommendationData.score_breakdown.evidence_quality}/10</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Card Footer: Retailers & Quick Actions */}
        <div className="mt-5 pt-3.5 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2 text-xs">
          {/* Compare Toggle */}
          <button
            onClick={() => (isCompared ? removeFromCompare(product.id) : addToCompare(product.id))}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 ${
              isCompared
                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                : 'border-black/[0.1] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>{isCompared ? 'Compared' : 'Compare'}</span>
          </button>

          <div className="flex items-center gap-2">
            {bestOffer ? (
              <a
                href={bestOffer.affiliate_url || bestOffer.retailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs transition flex items-center gap-1 shadow-xs"
              >
                <span>Store</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <Link
                to={`/products/${product.id}`}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-medium text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition flex items-center gap-1"
              >
                <span>Specs</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <IssueReportModal
        productId={product.id}
        productName={product.name}
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
      />
    </article>
  );
};
