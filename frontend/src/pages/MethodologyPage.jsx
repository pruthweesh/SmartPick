/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Cpu,
  HeartHandshake,
  FileCheck2,
  XCircle,
  Layers
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState.jsx';

export const MethodologyPage = () => {
  const [activeEmptyState, setActiveEmptyState] = useState('no-results');
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] font-mono uppercase tracking-wider border border-black/[0.06] dark:border-white/[0.06]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Algorithmic Constitution & Independence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Trust & Evaluation Methodology
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          SmartPick exists because traditional marketplaces are flooded with paid placements, unverified claims, and sponsored badges. Here is how our acoustic evaluation engine operates.
        </p>
      </div>

      {/* 1. Transparent 2-Phase Recommendation Pipeline */}
      <section className="bg-white dark:bg-[#111216] p-7 sm:p-10 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center font-mono font-bold text-xs">
            01
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Phase 1: Deterministic Hard Filters
            </h2>
            <p className="text-xs font-mono text-neutral-400">Zero AI hallucination in candidate filtering</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Before any scoring or AI synthesis occurs, user queries pass through rigid mathematical filters. A product is immediately disqualified if:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-black/[0.04] dark:border-white/[0.04]">
            <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span className="text-neutral-700 dark:text-neutral-300">Its lowest price exceeds your ceiling by even ₹1.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-black/[0.04] dark:border-white/[0.04]">
            <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span className="text-neutral-700 dark:text-neutral-300">It claims passive silicone isolation when hardware ANC was marked mandatory.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-black/[0.04] dark:border-white/[0.04]">
            <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span className="text-neutral-700 dark:text-neutral-300">Essential hardware specifications cannot be verified via official data sheets.</span>
          </li>
          <li className="flex items-start gap-2.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-black/[0.04] dark:border-white/[0.04]">
            <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
            <span className="text-neutral-700 dark:text-neutral-300">Product status in our database is marked "incomplete" or "delisted".</span>
          </li>
        </ul>
      </section>

      {/* 2. Transparent Scoring Formula */}
      <section className="bg-white dark:bg-[#111216] p-7 sm:p-10 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center font-mono font-bold text-xs">
            02
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Phase 2: Transparent 6-Factor Deterministic Formula
            </h2>
            <p className="text-xs font-mono text-neutral-400">Every match score (0–100) is strictly auditable</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs sm:text-sm font-mono">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              35% · Intended Use-Case Alignment
            </span>
            <span className="text-neutral-500 text-xs">Mic ENC for calls, low latency for gaming, drivers for music</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              25% · Value for Money & Headroom
            </span>
            <span className="text-neutral-500 text-xs">Price headroom under ceiling + verified retailer discount %</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              15% · Specification Completeness
            </span>
            <span className="text-neutral-500 text-xs">Percentage of laboratory attributes independently confirmed</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              10% · BIS & Evidence Quality
            </span>
            <span className="text-neutral-500 text-xs">Bureau of Indian Standards compliance + manufacturer whitepapers</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              10% · User Priority Weight
            </span>
            <span className="text-neutral-500 text-xs">Weights assigned to user-specified priority (calls, endurance, sound)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 flex items-center justify-between border border-black/[0.04] dark:border-white/[0.04]">
            <span className="font-semibold text-neutral-900 dark:text-white">
              5% · Verified Review Sentiment
            </span>
            <span className="text-neutral-500 text-xs">Verified purchaser feedback themes and return incidence</span>
          </div>
        </div>
      </section>

      {/* 3. Role of AI */}
      <section className="bg-white dark:bg-[#111216] p-7 sm:p-10 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <Cpu className="w-7 h-7 text-neutral-900 dark:text-white shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Anti-Hallucination Guardrails
            </h2>
            <p className="text-xs font-mono text-neutral-400">Strict natural language synthesis boundaries</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <p>
            AI is used solely for natural language parsing and writing grounded trade-off summaries strictly derived from verified database records.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-850 p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] text-xs text-neutral-800 dark:text-neutral-200 space-y-1.5 font-mono">
            <strong>Mandatory System Guardrails:</strong>
            <p>1. The model cannot invent specs, battery hours, or prices. Missing attributes must be output as "Not available".</p>
            <p>2. The model cannot claim any single model is universally the "best earbud".</p>
            <p>3. The model cannot fabricate future price drops or sales urgency.</p>
          </div>
        </div>
      </section>

      {/* 4. Commercial Independence */}
      <section className="bg-white dark:bg-[#111216] p-7 sm:p-10 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-7 h-7 text-neutral-900 dark:text-white shrink-0" />
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">Commercial Independence Policy</h2>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          We may earn a commission when you purchase through certified retailer links. This never impacts product ranking calculations. The final price, availability, shipping, and returns are controlled entirely by the retailer.
        </p>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Our recommendation code executes server-side with zero programmatic awareness of affiliate compensation rates. A ₹1,499 earbud with zero affiliate commission will score identically to one with a 4% commission if its specifications and suitability are equal.
        </p>
      </section>

      {/* 5. Graceful Failure & Transparent Empty States Showcase */}
      <section className="bg-white dark:bg-[#111216] p-7 sm:p-10 rounded-3xl border border-black/[0.08] dark:border-white/[0.08] shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <Layers className="w-7 h-7 text-neutral-900 dark:text-white shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white tracking-tight">
              Transparent Empty & Failure States
            </h2>
            <p className="text-xs font-mono text-neutral-400">
              Clear recovery paths for all 5 error conditions
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          SmartPick never masks errors with placeholder prices or fake products. Below you can audit our exact empty and error states:
        </p>

        {/* State Selector Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'no-results', label: '1. No Results' },
            { id: 'no-exact-match', label: '2. No Exact Match' },
            { id: 'ai-failure', label: '3. AI Failure' },
            { id: 'broken-link', label: '4. Broken Retailer Link' },
            { id: 'server-error', label: '5. Server Error' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEmptyState(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                activeEmptyState === tab.id
                  ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/[0.06]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Empty State Render */}
        <div className="pt-2">
          {activeEmptyState === 'no-results' && (
            <EmptyState
              type="no-results"
              title="No Products Matched Your Filters"
              description="No earbuds in our audited database match your active search terms or strict hardware parameters."
              details="Try raising the maximum price ceiling, choosing 'All Brands', or unchecking specialized filters like certified ANC or marathon battery."
              actionText="Reset All Filters"
              onAction={() => {}}
              secondaryActionText="Ask AI Advisor"
              secondaryActionHref="/advisor"
            />
          )}

          {activeEmptyState === 'no-exact-match' && (
            <EmptyState
              type="no-exact-match"
              title="No Exact Hardware Match in Catalog"
              description="Your strict constraints (e.g. Budget ceiling under ₹1,500 paired with mandatory hardware ANC) eliminated all 20 tested models."
              details="SmartPick Guarantee: We never silently drop your requirements or fabricate fake specs to force a purchase. Adjust constraints to view nearby alternatives."
              actionText="Adjust Filter Criteria"
              onAction={() => {}}
              secondaryActionText="Reset Ceiling to ₹5,000"
              onSecondaryAction={() => {}}
            />
          )}

          {activeEmptyState === 'ai-failure' && (
            <EmptyState
              type="ai-failure"
              title="AI Advisor Reasoning Service Timed Out"
              description="The reasoning service encountered high latency while synthesizing fit rationale. Our deterministic lab specification engine remains 100% operational."
              details="You can click Retry below to query the reasoning service again, or browse models directly using manual specification filters."
              actionText="Retry AI Advisor"
              onAction={() => {}}
              secondaryActionText="Browse All Tested Earbuds"
              secondaryActionHref="/products"
            />
          )}

          {activeEmptyState === 'broken-link' && (
            <EmptyState
              type="broken-link"
              title="Retailer Offer Unavailable or Expired"
              description="The retailer product page may have moved, gone out of stock, or changed SKU URL since our last scheduled audit."
              details="SmartPick runs automated store availability sweeps. If a link has expired, click below to alert our audit queue or check alternative verified retailers."
              actionText="Browse Available Earbuds"
              actionHref="/products"
              onReport={() => {}}
            />
          )}

          {activeEmptyState === 'server-error' && (
            <EmptyState
              type="server-error"
              title="Server Communication Error (500)"
              description="Unable to communicate with the SmartPick local service or database. Please check your network connection and retry."
              details="SmartPick local API endpoint returned an unexpected HTTP error. Verify that the server process is running on port 3000."
              actionText="Retry Connection"
              onAction={() => {}}
              secondaryActionText="Return to Homepage"
              secondaryActionHref="/"
            />
          )}
        </div>
      </section>

      {/* 6. Error Reporting Mechanism */}
      <section className="bg-neutral-100 dark:bg-neutral-900 p-8 rounded-3xl border border-black/[0.06] dark:border-white/[0.06] text-center space-y-3">
        <FileCheck2 className="w-8 h-8 text-neutral-900 dark:text-white mx-auto" />
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Spot an Incorrect Spec or Price?</h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          We invite community audits. Every product page has a direct "Report Discrepancy" action that alerts our laboratory engineers.
        </p>
        <Link
          to="/report-issue"
          className="inline-block px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 font-medium text-xs transition"
        >
          Submit a Correction Report
        </Link>
      </section>
    </div>
  );
};
