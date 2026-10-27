import React from 'react';
import {
  SearchX,
  SlidersHorizontal,
  Sparkles,
  Link2Off,
  ServerCrash,
  RefreshCw,
  RotateCcw,
  Flag,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  type,
  title,
  description,
  details,
  actionText,
  onAction,
  actionHref,
  secondaryActionText,
  onSecondaryAction,
  secondaryActionHref,
  onReport,
  className = ''
}) => {
  const configs = {
    'no-results': {
      icon: <SearchX className="w-7 h-7 text-neutral-700 dark:text-neutral-300" />,
      defaultTitle: 'No Matching Products Found',
      defaultDescription:
        'No models in our audited laboratory database match your active combination of filters and keyword search.',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-black/[0.06] dark:border-white/[0.06]',
      accentColor: 'text-neutral-500',
      badgeText: 'Zero Catalog Matches'
    },
    'no-exact-match': {
      icon: <SlidersHorizontal className="w-7 h-7 text-neutral-900 dark:text-white" />,
      defaultTitle: 'No Exact Hardware Match',
      defaultDescription:
        'Your strict constraints (e.g. tight budget ceiling paired with mandatory certified ANC or 50h+ battery) eliminated all 20 tested models.',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-black/[0.06] dark:border-white/[0.06]',
      accentColor: 'text-neutral-500',
      badgeText: 'Constraint Conflict'
    },
    'ai-failure': {
      icon: <Sparkles className="w-7 h-7 text-neutral-900 dark:text-white" />,
      defaultTitle: 'AI Advisor Interrupted',
      defaultDescription:
        'The synthesis reasoning service encountered a temporary latency or schema parse issue. Our deterministic specification filters remain fully operational.',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-black/[0.06] dark:border-white/[0.06]',
      accentColor: 'text-neutral-500',
      badgeText: 'AI Service Notice'
    },
    'broken-link': {
      icon: <Link2Off className="w-7 h-7 text-neutral-900 dark:text-white" />,
      defaultTitle: 'Retailer Offer Unavailable or Expired',
      defaultDescription:
        'The retailer product page may have moved, gone out of stock, or changed SKU URL since our last scheduled audit.',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-black/[0.06] dark:border-white/[0.06]',
      accentColor: 'text-neutral-500',
      badgeText: 'Store Link Issue'
    },
    'server-error': {
      icon: <ServerCrash className="w-7 h-7 text-neutral-900 dark:text-white" />,
      defaultTitle: 'Server Communication Error',
      defaultDescription:
        'Unable to communicate with the SmartPick local service or database. Please check your network connection and retry.',
      iconBg: 'bg-neutral-100 dark:bg-neutral-800 border-black/[0.06] dark:border-white/[0.06]',
      accentColor: 'text-neutral-500',
      badgeText: 'Network / Database Issue'
    }
  };

  const current = configs[type] || configs['server-error'];
  const finalTitle = title || current.defaultTitle;
  const finalDesc = description || current.defaultDescription;

  return (
    <div
      className={`bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-10 border border-black/[0.08] dark:border-white/[0.08] shadow-xs text-center max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200 ${className}`}
    >
      {/* Icon Badge */}
      <div className="flex flex-col items-center">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xs mb-3 ${current.iconBg}`}
        >
          {current.icon}
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-semibold text-neutral-400">
          {current.badgeText}
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          {finalTitle}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {finalDesc}
        </p>
      </div>

      {/* Helpful Details / Troubleshooting Notes */}
      {details && (
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-4 text-xs text-neutral-600 dark:text-neutral-300 border border-black/[0.05] dark:border-white/[0.05] text-left space-y-2 max-w-lg mx-auto">
          <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Recommended Next Steps:</span>
          </div>
          {typeof details === 'string' ? (
            <p className="leading-relaxed whitespace-pre-line">{details}</p>
          ) : (
            details
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
        {actionHref ? (
          <Link
            to={actionHref}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition shadow-2xs"
          >
            <span>{actionText || 'Proceed'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{actionText || 'Retry'}</span>
          </button>
        ) : null}

        {secondaryActionHref ? (
          <Link
            to={secondaryActionHref}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>{secondaryActionText || 'Cancel'}</span>
          </Link>
        ) : onSecondaryAction ? (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{secondaryActionText || 'Reset'}</span>
          </button>
        ) : null}

        {onReport && (
          <button
            type="button"
            onClick={onReport}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-black/[0.1] dark:border-white/[0.1] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Issue to Team</span>
          </button>
        )}
      </div>
    </div>
  );
};
