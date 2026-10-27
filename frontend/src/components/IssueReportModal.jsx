import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const IssueReportModal = ({ productId, productName, offerId, isOpen, onClose }) => {
  const { showToast } = useApp();
  const [issueType, setIssueType] = useState('wrong_specification');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a brief explanation of the issue.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId || null,
          offer_id: offerId || null,
          issue_type: issueType,
          description: description.trim()
        })
      });

      if (res.ok) {
        setSubmitted(true);
        showToast('Report submitted for editorial review');
      } else {
        showToast('Failed to submit report. Please try again.');
      }
    } catch {
      showToast('Network error submitting report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Report Logged</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Thank you for keeping SmartPick honest. Our engineering and verification team audits reports within 24
              hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setDescription('');
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Inaccurate Data</h3>
            </div>
            {productName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Target Product: <span className="font-semibold text-slate-700 dark:text-slate-300">{productName}</span>
              </p>
            )}

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  What kind of issue did you notice?
                </label>
                <select
                  value={issueType}
                  onChange={e => setIssueType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="wrong_specification">Wrong or outdated technical specification</option>
                  <option value="wrong_price">Outdated price or expired discount</option>
                  <option value="broken_link">Broken retailer destination link</option>
                  <option value="misleading_recommendation">Misleading or biased AI recommendation logic</option>
                  <option value="other">Other feedback</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Details & Evidence (e.g. correct spec, retailer link)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the discrepancy with as much detail as possible..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                Reports directly update our audit log and trigger manual review before data corrections are deployed.
              </div>
            </div>

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
                <Send className="w-4 h-4" />
                {submitting ? 'Submitting...' : 'Send Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
