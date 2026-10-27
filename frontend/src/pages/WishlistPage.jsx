/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ExternalLink, Bell, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { PriceAlertModal } from '../components/PriceAlertModal.jsx';

export const WishlistPage = () => {
  const { user, token, wishlistIds, toggleWishlist } = useApp();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductForAlert, setSelectedProductForAlert] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/wishlists', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token, wishlistIds]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Bookmark className="w-10 h-10 text-neutral-400 mx-auto" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Saved Acoustic Portfolio</h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Sign in or create a profile to sync saved earbuds across devices, monitor price drops, and store acoustic preferences.
        </p>
        <Link
          to="/account"
          className="inline-block px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs tracking-wide transition shadow-xs"
        >
          Sign In to SmartPick
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 mb-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Your Saved Models ({items.length})
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-12 text-center border border-black/[0.08] dark:border-white/[0.08] space-y-3">
          <Bookmark className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">Your portfolio is empty</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Browse our audited earbuds catalog or consult the AI advisor to bookmark models for future review.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs transition"
          >
            Explore Tested Earbuds
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            const prod = item.product;
            if (!prod) return null;
            const offers = prod.offers || [];
            const lowestPrice = offers.length > 0 ? Math.min(...offers.map((o) => o.current_price)) : 0;
            const bestOffer = offers.find((o) => o.current_price === lowestPrice) || offers[0];

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#111216] rounded-2xl p-5 border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-contain bg-[#f5f5f7] dark:bg-neutral-800 shrink-0 p-1.5"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                        {prod.brand}
                      </span>
                      <Link
                        to={`/products/${prod.id}`}
                        className="font-bold text-sm text-neutral-900 dark:text-white hover:text-neutral-600 line-clamp-1 block mt-0.5"
                      >
                        {prod.name}
                      </Link>
                      <div className="mt-1 flex items-baseline gap-2 tabular-nums">
                        <span className="text-base font-bold text-neutral-900 dark:text-white">
                          ₹{lowestPrice.toLocaleString('en-IN')}
                        </span>
                        {bestOffer?.original_price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{bestOffer.original_price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProductForAlert(prod)}
                    className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium hover:underline font-mono"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Price Alert</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(prod.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {bestOffer && (
                      <a
                        href={bestOffer.affiliate_url || bestOffer.retailer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs flex items-center gap-1 transition shadow-2xs"
                      >
                        <span>Store</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedProductForAlert && (
        <PriceAlertModal
          productId={selectedProductForAlert.id}
          productName={selectedProductForAlert.name}
          currentPrice={
            selectedProductForAlert.offers && selectedProductForAlert.offers.length > 0
              ? Math.min(...selectedProductForAlert.offers.map((o) => o.current_price))
              : 2000
          }
          isOpen={true}
          onClose={() => setSelectedProductForAlert(null)}
        />
      )}
    </div>
  );
};
