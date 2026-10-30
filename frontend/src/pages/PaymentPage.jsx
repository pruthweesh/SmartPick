import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Building,
  Wallet,
  Calendar,
  Banknote,
  ArrowRight,
} from 'lucide-react';

export const PaymentPage = () => {
  const { cartItems } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">Home</Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white font-semibold">Payment Methods</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
          Certified Payment Methods & UPI
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          SmartPick supports all major Indian payment gateways, zero-cost EMI plans, and NPCI Unified Payments Interface (UPI).
        </p>
      </div>

      {/* Grid of supported modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: 'Unified Payments Interface (UPI)',
            desc: 'Google Pay, PhonePe, Paytm, BHIM, CRED with instant authorization.',
            icon: Smartphone,
            tag: 'Zero Surcharge',
          },
          {
            title: 'Credit & Debit Cards',
            desc: 'Visa, Mastercard, RuPay, and American Express with 3D Secure OTP.',
            icon: CreditCard,
            tag: 'Tokenized Security',
          },
          {
            title: 'Net Banking',
            desc: 'Direct account debit across 50+ Indian commercial & public sector banks.',
            icon: Building,
            tag: '50+ Banks',
          },
          {
            title: 'Digital Wallets',
            desc: 'Paytm, Amazon Pay balance, and MobiKwik 1-click checkout.',
            icon: Wallet,
            tag: 'Instant Checkout',
          },
          {
            title: 'Low-Cost & No-Cost EMI',
            desc: '3 to 12 months installment plans on eligible orders above ₹3,000.',
            icon: Calendar,
            tag: 'Flexible Tenures',
          },
          {
            title: 'Cash on Delivery (COD)',
            desc: 'Pay upon delivery at your doorstep across 19,000+ Indian PIN codes.',
            icon: Banknote,
            tag: 'Doorstep Verification',
          },
        ].map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.title}
              className="p-5 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/90 dark:border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-600 dark:text-neutral-400">
                  {method.tag}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  {method.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  {method.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Guarantee */}
      <div className="p-6 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
              PCI-DSS Level 1 Compliant Encryption
            </h4>
            <p className="text-xs text-neutral-500">
              Your sensitive card numbers and CVV codes are never stored on SmartPick servers or in your browser storage.
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 shrink-0 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
