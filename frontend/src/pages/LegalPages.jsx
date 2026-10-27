/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  HelpCircle,
  Mail,
  AlertTriangle,
  Send,
  CheckCircle2,
  Lock,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

/**
 * 1. Dedicated Affiliate Disclosure Page
 */
export const AffiliateDisclosurePage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Commercial Transparency
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Affiliate Disclosure</h1>
        <p className="text-xs text-slate-500">Last updated: May 2025</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/40 p-6 rounded-2xl border border-blue-200 dark:border-blue-900 text-sm text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
        “We may earn a commission if you purchase through certain retailer links. This does not affect our
        recommendation process. The final price, availability, shipping, returns, and refunds are controlled by the
        retailer.”
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">How SmartPick Monetizes</h2>
        <p>
          SmartPick is completely free for consumers to browse, consult the AI advisor, and compare products. To keep
          our laboratory research and crawler infrastructure running without displaying intrusive popups or sponsored banner ads,
          we participate in verified affiliate partnership programs with authorized retailers including Amazon India, Flipkart,
          and Croma.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Zero Influence on Ranking Logic</h2>
        <p>
          Our recommendation algorithm does not factor in affiliate commission percentages. When the AI ranks products for
          a user's query, it considers exclusively:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Acoustic fit with intended usage (calls, music, gym, gaming)</li>
          <li>Value for money based on actual price and specifications</li>
          <li>Specification completeness and independent verification confidence</li>
          <li>Verified purchaser sentiment</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Transactions and Customer Support</h2>
        <p>
          SmartPick is an informational decision-support platform. We do not process payments, store credit card details,
          warehouse stock, or fulfill shipments. All product warranties, order status inquiries, returns, and refunds are
          governed by the respective retailer from which you complete your checkout.
        </p>
      </div>
    </div>
  );
};

/**
 * 2. Privacy Policy Page
 */
export const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Data Governance
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Effective: May 2025</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <p>
          At SmartPick, privacy is a fundamental engineering tenet. We practice minimal data retention and strict opt-in
          personalization.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
        <p>
          - <strong>Anonymous Browsing:</strong> You can use SmartPick completely anonymously without registering an
          account.
        </p>
        <p>
          - <strong>Registered Accounts (Optional):</strong> If you create an account to save a wishlist or track price alerts,
          we store your name, email address, hashed password (using bcrypt), and target price thresholds.
        </p>
        <p>
          - <strong>Shopping Requirements:</strong> Natural-language queries entered in the AI Advisor are processed in
          real-time to compute product matches.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. What We Never Do</h2>
        <p>
          We do NOT sell, rent, or trade your search queries, wishlist items, or personal contact information to third-party
          advertising networks, brokerages, or tracking platforms.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Your Right to Erasure</h2>
        <p>
          You retain total control over your data. You may request permanent deletion of your account and all associated
          records at any time from your Account Settings page or by contacting our data protection officer.
        </p>
      </div>
    </div>
  );
};

/**
 * 3. Terms of Use Page
 */
export const TermsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Platform Agreement
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms of Use</h1>
        <p className="text-xs text-slate-500">Effective: May 2025</p>
      </div>

      <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Informational Service Only</h2>
        <p>
          SmartPick provides recommendation services and price aggregation for consumer electronics in India. All technical
          specifications and prices are gathered from verified brand spec sheets and retailer feeds. While we audit our data
          regularly, manufacturers may update specifications or firmware without notice.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. No Financial or Commercial Warranties</h2>
        <p>
          SmartPick does not guarantee that retailer stock will remain available or that a listed discount will not expire.
          Always confirm the final cart price and seller reputation on the retailer’s website before placing an order.
        </p>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Acceptable Use</h2>
        <p>
          Users agree not to scrape, reverse-engineer, or attempt denial-of-service attacks against our API infrastructure.
        </p>
      </div>
    </div>
  );
};

/**
 * 4. FAQ Page
 */
export const FAQPage = () => {
  const faqs = [
    {
      q: 'Why does SmartPick only recommend 3 to 5 products instead of hundreds?',
      a: 'Choice overload creates buyer fatigue. Marketplaces intentionally display hundreds of products because brands pay them for ad clicks. SmartPick acts as a fiduciary shopping advisor: we eliminate 95% of inferior or irrelevant options to leave you with only the best vetted contenders.'
    },
    {
      q: 'How do you verify whether Active Noise Cancellation (ANC) is real?',
      a: 'Many cheap earbuds use confusing marketing acronyms like "ENC" (Environmental Noise Cancellation for microphone only) to trick buyers into believing they have active speaker cancellation. SmartPick separates hardware microphone isolation from true acoustic ANC in dB and flags passive noise isolation clearly.'
    },
    {
      q: 'Do retailers pay you to rank higher in search results?',
      a: 'No. Our ranking formula is completely deterministic and runs independently of affiliate partnerships. A product with zero affiliate relationship ranks identically to an affiliate product if its specifications and price are identical.'
    },
    {
      q: 'How frequently are prices checked?',
      a: 'Our automated crawler checks Amazon India, Flipkart, and Croma catalogs twice daily to keep price drop alerts and comparisons accurate.'
    },
    {
      q: 'What if I find an error in a specification?',
      a: 'Every product page has a "Report Discrepancy" button. Our data team reviews crowdsourced corrections within 24 hours.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="space-y-2 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-500">Everything you need to know about SmartPick V1</p>
      </div>

      <div className="space-y-4 pt-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2"
          >
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">Q:</span>
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 5. Contact Page
 */
export const ContactPage = () => {
  const { showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    showToast('Your message has been sent to our editorial desk.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Editorial Inquiries
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact the Team</h1>
        <p className="text-sm text-slate-500">
          Have questions about our testing methodology, partnership guidelines, or product audits?
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        {sent ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Message Received</h3>
            <p className="text-xs text-slate-500">
              Our engineering team responds to all inquiries within 1 business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="How can we help you?"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/**
 * 6. Report Issue Standalone Page
 */
export const ReportIssuePage = () => {
  const { showToast } = useApp();
  const [productName, setProductName] = useState('');
  const [issueType, setIssueType] = useState('wrong_specification');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide details for the report.');
      return;
    }

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_type: issueType,
          description: `Product: ${productName || 'Unspecified'} - ${description.trim()}`
        })
      });

      if (res.ok) {
        setSubmitted(true);
        showToast('Report submitted for editorial review');
      }
    } catch {
      showToast('Error submitting report');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Crowdsourced Accuracy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Report Inaccurate Data</h1>
        <p className="text-sm text-slate-500">
          Help us maintain the highest standard of technical accuracy in consumer electronics in India.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Received</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Thank you for keeping SmartPick honest. Our engineering and verification team audits reports within 24
              hours.
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2 rounded-xl bg-blue-600 text-white font-medium text-xs mt-2"
            >
              Return Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product Name / Model Number
              </label>
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. boAt Airdopes 141 or Realme Buds Air 5"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category of Discrepancy
              </label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="wrong_specification">Wrong Technical Specification</option>
                <option value="wrong_price">Expired Price / Incorrect Discount</option>
                <option value="broken_link">Broken Retailer Link</option>
                <option value="misleading_recommendation">Misleading Recommendation Logic</option>
                <option value="other">Other Data Issue</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Explanation & Proof Link
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what was listed vs what is true based on manufacturer documentation..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
            >
              Submit Discrepancy Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
