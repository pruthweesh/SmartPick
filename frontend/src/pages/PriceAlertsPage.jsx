/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const PriceAlertsPage = () => {
  const { user, token, showToast } = useApp();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchAlerts();
  }, [token]);

  const fetchAlerts = () => {
    setLoading(true);
    fetch('/api/price-alerts', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAlerts(data.alerts || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (alertId) => {
    try {
      const res = await fetch(`/api/price-alerts/${alertId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
        showToast('Price drop alert removed');
      }
    } catch {
      showToast('Error removing alert');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Bell className="w-10 h-10 text-neutral-400 mx-auto" />
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Price Drop Monitors</h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Sign in to view your active price drop trackers across Amazon, Flipkart, and Croma.
        </p>
        <Link
          to="/account"
          className="inline-block px-6 py-3 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs tracking-wide transition shadow-xs"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 mb-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>Automated Price Crawler</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Active Price Alerts ({alerts.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            We monitor retailer pricing sweeps and alert you when verified retailer APIs meet your ceiling.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="h-28 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800 animate-pulse" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-12 text-center border border-black/[0.08] dark:border-white/[0.08] space-y-3">
          <Bell className="w-10 h-10 text-neutral-300 dark:text-neutral-600 mx-auto" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">No active price trackers</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Visit any product page and click "Price Alert" to set a target price below current retail.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs transition"
          >
            Explore Earbuds Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(a => {
            const prod = a.product;
            if (!prod) return null;
            const currentLowest = prod.offers && prod.offers.length > 0
              ? Math.min(...prod.offers.map((o) => o.current_price))
              : 0;

            const targetMet = currentLowest <= a.target_price;

            return (
              <div
                key={a.id}
                className="bg-white dark:bg-[#111216] rounded-2xl p-5 border border-black/[0.08] dark:border-white/[0.08] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-contain bg-[#f5f5f7] dark:bg-neutral-800 shrink-0 p-1"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold">
                      {prod.brand}
                    </span>
                    <Link
                      to={`/products/${prod.id}`}
                      className="font-bold text-base text-neutral-900 dark:text-white hover:text-neutral-600 block"
                    >
                      {prod.name}
                    </Link>
                    <div className="flex items-center gap-3 mt-1 text-xs font-mono tabular-nums">
                      <span className="text-neutral-500">
                        Current: <strong className="text-neutral-900 dark:text-white">₹{currentLowest.toLocaleString('en-IN')}</strong>
                      </span>
                      <span>·</span>
                      <span className="text-neutral-900 dark:text-white font-semibold">
                        Alert Threshold: ₹{a.target_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {targetMet ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Target Price Reached
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-400 font-mono">
                      Waiting for ₹{(currentLowest - a.target_price).toLocaleString('en-IN')} drop
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-600 transition"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Trust Notice */}
      <div className="p-4 bg-neutral-100/70 dark:bg-neutral-850 rounded-2xl border border-black/[0.05] dark:border-white/[0.05] text-xs text-neutral-500 flex items-start gap-2.5 font-mono">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          Data Privacy Commitment: We store your alert criteria to trigger notifications when retailer APIs report discounts. We never sell your wishlist or budget preferences to third-party advertising brokers.
        </span>
      </div>
    </div>
  );
};
