/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  X,
  Scale,
  Bookmark,
  Bell,
  ExternalLink,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShoppingCart,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { PriceHistoryChart } from '../components/PriceHistoryChart.jsx';
import { IssueReportModal } from '../components/IssueReportModal.jsx';
import { PriceAlertModal } from '../components/PriceAlertModal.jsx';
import { EmptyState } from '../components/EmptyState.jsx';

export const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    isInWishlist,
    toggleWishlist,
    addToCart,
    setBuyNow,
  } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found in database');
        return res.json();
      })
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider">Loading verified specifications & offers...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          type="server-error"
          title="Product Record Not Found"
          description="The requested product model could not be retrieved from our audited database or the server returned an error."
          details={`ID requested: "${productId}". This item may have been de-listed or the local database connection was interrupted.`}
          actionText="Browse Catalog"
          actionHref="/products"
          secondaryActionText="Consult AI Advisor"
          secondaryActionHref="/advisor"
        />
      </div>
    );
  }

  const isCompared = compareList.includes(product.id);
  const isSaved = isInWishlist(product.id);

  const offers = product.offers || [];
  const lowestPrice = offers.length > 0 ? Math.min(...offers.map((o) => o.current_price)) : 0;
  const bestOffer = offers.find((o) => o.current_price === lowestPrice) || offers[0];

  const specs = product.specifications || [];
  const pros = (product.pros_cons || []).filter((pc) => pc.type === 'pro');
  const cons = (product.pros_cons || []).filter((pc) => pc.type === 'con');
  const reviews = product.reviews_insights && product.reviews_insights.length > 0 ? product.reviews_insights[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">Home</Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <Link to="/products" className="hover:text-neutral-900 dark:hover:text-white transition">Catalog</Link>
        <span className="text-neutral-300 dark:text-neutral-700">/</span>
        <span className="text-neutral-900 dark:text-white font-semibold truncate">{product.brand} {product.name}</span>
      </nav>

      {/* Main Contiguous Purchase & Details Module */}
      <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery / Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-[#f5f5f7] dark:bg-[#16181f] overflow-hidden relative flex items-center justify-center p-8 border border-black/[0.04] dark:border-white/[0.04]">
              <img
                src={product.image_url || `/images/categories/${(product.category || 'audio').toLowerCase()}.svg`}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  const cat = (product.category || 'audio').toLowerCase();
                  e.currentTarget.src = `/images/categories/${cat}.svg`;
                }}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-900 dark:text-neutral-100 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md border border-black/[0.08] dark:border-white/[0.08] shadow-2xs flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited Specification</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between w-full text-xs text-neutral-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Audited: {new Date(product.last_checked_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
              <button
                onClick={() => setIssueModalOpen(true)}
                className="hover:text-neutral-900 dark:hover:text-white underline underline-offset-2 transition"
              >
                Report Spec Discrepancy
              </button>
            </div>
          </div>

          {/* Details & Purchase Module */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-600 dark:text-neutral-400">
                  {product.brand}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">·</span>
                <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
                  Model: {product.model_number || 'Standard Unit'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
                  Lowest Verified Retail Price
                </span>
                <div className="flex items-baseline gap-2.5 mt-1 tabular-nums">
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    {lowestPrice > 0 ? `₹${lowestPrice.toLocaleString('en-IN')}` : 'Not available'}
                  </span>
                  {bestOffer?.original_price && bestOffer.original_price > lowestPrice && (
                    <>
                      <span className="text-sm text-neutral-400 line-through">
                        ₹{bestOffer.original_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        {bestOffer.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 flex items-center gap-1.5 transition shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBuyNow(product, 1);
                    navigate('/checkout?buyNow=true');
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 transition shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => (isCompared ? removeFromCompare(product.id) : addToCompare(product.id))}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    isCompared
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                      : 'border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Compare Studio' : 'Compare'}</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    isSaved
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                      : 'border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={() => setAlertModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Price Alert</span>
                </button>
              </div>
            </div>

            {/* Verified Retailer Offers Module */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 font-semibold">
                  Audited Retailer Store Offers
                </h3>
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(true)}
                  className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white underline"
                >
                  Report Broken Link
                </button>
              </div>

              {offers.length === 0 ? (
                <EmptyState
                  type="broken-link"
                  title="No Active Retailer Offers Found"
                  description="All retailer store links for this model are currently unavailable, out of stock, or pending verification."
                  details="SmartPick runs automated verification sweeps. If a store link has moved or discontinued, report it below to alert our audit queue."
                  actionText="Browse Available Products"
                  actionHref="/products"
                  onReport={() => setIssueModalOpen(true)}
                  className="p-6"
                />
              ) : (
                <div className="space-y-2">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-neutral-850 border border-black/[0.06] dark:border-white/[0.06] shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-neutral-900 dark:text-white">
                            {offer.retailer_name}
                          </span>
                          {offer.is_affiliate && (
                            <span className="text-[9.5px] font-mono uppercase px-1.5 py-0.2 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded">
                              Partner Store
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-medium block ${
                          offer.availability_status === 'in_stock'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}>
                          {offer.availability_status === 'in_stock'
                            ? '✓ Verified In Stock'
                            : 'Stock Pending Verification'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-neutral-900 dark:text-white tabular-nums">
                          {offer.current_price ? `₹${offer.current_price.toLocaleString('en-IN')}` : 'Not available'}
                        </span>
                        <a
                          href={offer.affiliate_url || offer.retailer_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <span>Buy on {offer.retailer_name}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Commercial Transparency Note */}
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
              Commercial Disclosure: When purchasing through certified retailer links, SmartPick may earn an affiliate commission. Pricing, returns, and fulfillment are managed directly by the retailer.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.06] gap-2">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Hardware & Technical Specifications
            </h2>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">
              Spec completeness audit: <strong>{product.data_completeness_score}%</strong> · Missing attributes explicitly verified as "Not available"
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Standardized Attributes
          </span>
        </div>

        {specs.length === 0 ? (
          <div className="text-xs text-neutral-400 italic py-4">Laboratory specifications: Not available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            {specs.map((s) => {
              const isMissing = !s.spec_value || s.spec_value.toLowerCase().includes('not available') || s.confidence === 'missing';
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2.5 border-b border-black/[0.05] dark:border-white/[0.05] text-xs sm:text-sm"
                >
                  <span className="text-neutral-500 dark:text-neutral-400 capitalize">
                    {s.spec_key.replace(/_/g, ' ')}
                  </span>
                  <span className={`font-semibold text-right ${isMissing ? 'text-neutral-400 italic' : 'text-neutral-900 dark:text-white'}`}>
                    {isMissing ? 'Not available' : `${s.spec_value} ${s.unit ? s.unit : ''}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pros & Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-7 border border-black/[0.08] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3>Audited Strengths (Pros)</h3>
          </div>
          {pros.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">Not available</p>
          ) : (
            <ul className="space-y-3 text-xs sm:text-sm">
              {pros.map((p) => (
                <li key={p.id} className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cons */}
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-7 border border-black/[0.08] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-sm uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3>Compromises & Limitations (Cons)</h3>
          </div>
          {cons.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">Not available</p>
          ) : (
            <ul className="space-y-3 text-xs sm:text-sm">
              {cons.map((c) => (
                <li key={c.id} className="flex items-start gap-2.5 text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  <X className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Reviews Insights Summary */}
      {reviews && (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Verified Buyer Sentiment & Thematic Insights
            </h3>
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
              Confidence: {reviews.confidence}
            </span>
          </div>

          <p className="text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
            "{reviews.summary}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-850 rounded-xl">
              <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                Dominant Praise:
              </span>
              <p className="text-neutral-600 dark:text-neutral-300">{reviews.positive_theme || 'Not available'}</p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-850 rounded-xl">
              <span className="font-bold text-neutral-900 dark:text-white block mb-1">
                Frequent Caution:
              </span>
              <p className="text-neutral-600 dark:text-neutral-300">{reviews.negative_theme || 'Not available'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Price History Chart */}
      {product.price_history && product.price_history.length > 0 && (
        <PriceHistoryChart data={product.price_history} productName={product.name} />
      )}

      {/* Modals */}
      <IssueReportModal
        productId={product.id}
        productName={product.name}
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
      />

      <PriceAlertModal
        productId={product.id}
        productName={product.name}
        currentPrice={lowestPrice}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
};
