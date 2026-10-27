import React, { useState } from 'react';
import { X, BellRing, Check } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const PriceAlertModal = ({ productId, productName, currentPrice, isOpen, onClose }) => {
  const { user, token, showToast } = useApp();
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.9));
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast('Please sign in to set a price alert');
      return;
    }

    if (targetPrice >= currentPrice) {
      showToast('Target price should be lower than current price ₹' + currentPrice.toLocaleString('en-IN'));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/price-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: productId,
          target_price: targetPrice
        })
      });

      if (res.ok) {
        showToast(`Alert set: we'll notify you when price reaches ₹${targetPrice.toLocaleString('en-IN')}`);
        onClose();
      } else {
        showToast('Failed to create alert');
      }
    } catch {
      showToast('Network error creating alert');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
            <BellRing className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Price Drop Alert</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">{productName}</p>

          <div className="bg-slate-50 dark:bg-slate-700/50 p-3.5 rounded-xl mb-4 text-xs">
            <div className="flex justify-between mb-1 text-slate-600 dark:text-slate-300">
              <span>Current Best Price:</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{currentPrice.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">
              Our automated price crawler checks Amazon, Flipkart, and Croma every 12 hours.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Notify me when price drops to:
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-medium">₹</span>
              <input
                type="number"
                min={500}
                max={currentPrice - 1}
                step={50}
                value={targetPrice}
                onChange={e => setTargetPrice(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentPrice * 0.95))}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                -5% (₹{Math.round(currentPrice * 0.95).toLocaleString('en-IN')})
              </button>
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentPrice * 0.9))}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                -10% (₹{Math.round(currentPrice * 0.9).toLocaleString('en-IN')})
              </button>
              <button
                type="button"
                onClick={() => setTargetPrice(Math.round(currentPrice * 0.85))}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                -15% (₹{Math.round(currentPrice * 0.85).toLocaleString('en-IN')})
              </button>
            </div>
          </div>

          {!user && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg">
              Note: You need to be signed in so we know which account to attach this alert to.
            </p>
          )}

          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Setting Alert...' : 'Set Price Alert'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
