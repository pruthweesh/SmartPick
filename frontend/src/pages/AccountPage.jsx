/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Shield,
  Trash2,
  Lock,
  Mail,
  Sliders,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const AccountPage = () => {
  const { user, token, login, register, logout, showToast } = useApp();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // User preferences state
  const [preferences, setPreferences] = useState({
    budget_max: 3000,
    intended_use: 'calls',
    usage_priority: 'value'
  });
  const [privacyConsent, setPrivacyConsent] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('/api/user/preferences', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data && data.id) {
            setPreferences(data);
          }
        })
        .catch(console.error);
    }
  }, [token]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (isLoginTab) {
      await login(email, password);
    } else {
      await register(email, password, fullName);
    }
    setSubmitting(false);
  };

  const handleFillDemoShopper = () => {
    setEmail('shopper@smartpick.in');
    setPassword('SmartPick2025!');
    setIsLoginTab(true);
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@smartpick.in');
    setPassword('SmartPick2025!');
    setIsLoginTab(true);
  };

  const handleSavePreferences = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });
      if (res.ok) {
        showToast('Acoustic preferences saved');
      }
    } catch {
      showToast('Error saving preferences');
    }
  };

  const handleDeleteAccount = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/user/account', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Your account and all associated personal records have been permanently erased.');
        logout();
      }
    } catch {
      showToast('Error deleting account');
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold text-sm mx-auto shadow-xs">
            SP
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">SmartPick Identity</h1>
          <p className="text-xs text-neutral-500 font-mono">
            Synchronize saved models, watchlist triggers, and acoustic calibration across sessions.
          </p>
        </div>

        {/* Quick Demo Credentials Autofill Banner */}
        <div className="bg-neutral-100 dark:bg-neutral-850 p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.06] text-xs space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-neutral-500 block">
            Testing Credentials (Single-Click Autofill):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFillDemoShopper}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs transition"
            >
              Autofill Shopper
            </button>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="px-3 py-1.5 rounded-lg border border-black/[0.1] dark:border-white/[0.1] text-neutral-800 dark:text-neutral-200 font-medium text-xs transition hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              Autofill Admin
            </button>
          </div>
        </div>

        {/* Form Box */}
        <div className="bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
          {/* Tabs */}
          <div className="flex border-b border-black/[0.06] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 pb-3 text-xs font-semibold tracking-wide transition border-b-2 text-center ${
                isLoginTab
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 pb-3 text-xs font-semibold tracking-wide transition border-b-2 text-center ${
                !isLoginTab
                  ? 'border-neutral-900 text-neutral-900 dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 text-xs">
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="block font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide transition shadow-2xs disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : isLoginTab ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Profile View
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400 mb-1.5">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile & Calibration Settings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Hello, {user.full_name}
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Email: {user.email} · Role:{' '}
            <strong className="text-neutral-900 dark:text-white uppercase font-bold">{user.role}</strong>
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-full border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shopping Preferences */}
        <div className="bg-white dark:bg-[#111216] p-7 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">Default Calibration Profile</h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Pre-configures the AI Advisor whenever you launch a new acoustic curation session.
          </p>

          <div className="space-y-4 text-xs pt-2">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Typical Maximum Budget: ₹{preferences.budget_max?.toLocaleString('en-IN') || 3000}
              </label>
              <input
                type="range"
                min={1000}
                max={5000}
                step={250}
                value={preferences.budget_max || 3000}
                onChange={e => setPreferences({ ...preferences, budget_max: Number(e.target.value) })}
                className="w-full accent-neutral-900 dark:accent-white"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Primary Listening Need
              </label>
              <select
                value={preferences.intended_use || 'calls'}
                onChange={e => setPreferences({ ...preferences, intended_use: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-black/[0.1] dark:border-white/[0.1] bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-white"
              >
                <option value="calls">Work from Home & Online Classes (Calls)</option>
                <option value="music">Music & Deep Bass</option>
                <option value="gym">Gym Workouts & Running</option>
                <option value="travel">Frequent Travel & Long Shifts</option>
                <option value="gaming">Mobile Esports & Gaming</option>
              </select>
            </div>

            <button
              onClick={handleSavePreferences}
              className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs transition shadow-2xs"
            >
              Save Calibration
            </button>
          </div>
        </div>

        {/* Privacy & Governance Controls */}
        <div className="bg-white dark:bg-[#111216] p-7 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-neutral-900 dark:text-white" />
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">Privacy & Governance</h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            SmartPick practices minimum data retention. We never broker user profiles or budget histories.
          </p>

          <div className="space-y-4 text-xs pt-2">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-black/[0.04] dark:border-white/[0.04] cursor-pointer">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={e => setPrivacyConsent(e.target.checked)}
                className="w-4 h-4 text-neutral-900 rounded accent-neutral-900 dark:accent-white"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Allow anonymous recommendation quality logging to refine trade-off accuracy.
              </span>
            </label>

            <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
              <span className="font-mono text-xs uppercase tracking-wider text-red-600 block mb-1 font-semibold">Permanent Data Erasure</span>
              <p className="text-neutral-500 mb-3 text-xs leading-relaxed">
                Permanently delete your user profile, saved wishlists, and price alerts from our database.
              </p>

              {deleteConfirmOpen ? (
                <div className="p-3 bg-red-500/[0.06] rounded-xl border border-red-500/20 space-y-2">
                  <p className="text-red-700 dark:text-red-300 font-semibold text-xs">
                    Confirm complete data deletion?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteAccount}
                      className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white font-semibold text-xs"
                    >
                      Yes, Erase Everything
                    </button>
                    <button
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="px-4 py-2 rounded-full border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-semibold transition"
                >
                  Request Account Deletion
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
