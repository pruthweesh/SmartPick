import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b0c0f] text-neutral-400 pt-16 pb-12 border-t border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Affiliate Disclosure Notice Box (Mandatory Section 13) */}
        <div className="bg-[#13151b] rounded-2xl p-6 mb-12 border border-neutral-800 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-neutral-300 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-white tracking-tight">Commercial Disclosure & Affiliate Independence</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                We may earn an affiliate commission when you complete a purchase through retailer store links. This never impacts product evaluations or ranking calculations. Final pricing, stock availability, fulfillment, delivery, and returns are managed entirely by the retailer. SmartPick does not hold inventory or process payments.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12 text-xs">
          {/* Col 1: Brand & Commitment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-neutral-950 font-bold flex items-center justify-center text-xs tracking-tighter">
                SP
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">SMARTPICK</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              India's trust-first acoustic shopping advisor. Benchmarking 20 certified earbuds with deterministic 6-factor formulas, official BIS verification, and honest acoustic compromises.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Independent & Non-Sponsored</span>
            </div>
          </div>

          {/* Col 2: Guided Advisor & Category */}
          <div className="space-y-3">
            <h4 className="text-[10.5px] font-mono font-semibold text-white uppercase tracking-[0.18em]">Acoustic Advisor</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/advisor" className="hover:text-white transition">
                  AI Acoustic Recommendation Engine
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition">
                  Browse All 20 Audited Earbuds
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">
                  Side-by-Side Comparison Studio
                </Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-white transition">
                  Price Drop Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Methodology */}
          <div className="space-y-3">
            <h4 className="text-[10.5px] font-mono font-semibold text-white uppercase tracking-[0.18em]">Audit & Integrity</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/methodology" className="hover:text-white transition">
                  Deterministic Scoring Formula
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-white transition">
                  Affiliate Disclosure Policy
                </Link>
              </li>
              <li>
                <Link to="/report-issue" className="hover:text-white transition">
                  Report Spec or Price Discrepancy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-[10.5px] font-mono font-semibold text-white uppercase tracking-[0.18em]">Governance & Privacy</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy (No Data Brokerage)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Laboratory Editors
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition text-neutral-500">
                  Laboratory Administration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-4">
          <p>© {new Date().getFullYear()} SmartPick Technologies India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              BIS Audited Specs
            </span>
            <span>·</span>
            <span>Zero Fake Urgency</span>
            <span>·</span>
            <span>No Paid Placement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
