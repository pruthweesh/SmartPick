import React, { useState } from 'react';
import { TrendingDown, Calendar, ShieldCheck } from 'lucide-react';

export const PriceHistoryChart = ({ data, productName }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
        No price history recorded yet for this product.
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = prices[prices.length - 1];

  // SVG dimensions
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingY = 30;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const priceRange = maxPrice - minPrice || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(1, data.length - 1)) * chartW;
    const y = height - paddingY - ((d.price - minPrice) / priceRange) * chartH;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60 gap-2">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Verified Price History (Last 6 Months)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recorded by SmartPick daily crawler across major Indian marketplaces.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
            Lowest Ever: ₹{minPrice.toLocaleString('en-IN')}
          </div>
          <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
            Current: ₹{currentPrice.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
          />

          {/* Y Axis labels */}
          <text
            x={paddingX - 8}
            y={paddingY + 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono"
          >
            ₹{maxPrice.toLocaleString('en-IN')}
          </text>
          <text
            x={paddingX - 8}
            y={height - paddingY + 4}
            textAnchor="end"
            className="text-[10px] fill-slate-400 font-mono"
          >
            ₹{minPrice.toLocaleString('en-IN')}
          </text>

          {/* Fill area */}
          <path d={areaD} fill="url(#priceGradient)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p) => (
            <g
              key={p.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.id === p.id ? 6 : 4}
                className={`transition-all ${
                  p.price === minPrice
                    ? 'fill-emerald-500 stroke-white dark:stroke-slate-900'
                    : 'fill-blue-600 stroke-white dark:stroke-slate-900'
                }`}
                strokeWidth="2"
              />
              {/* Date label at bottom */}
              <text
                x={p.x}
                y={height - paddingY + 16}
                textAnchor="middle"
                className="text-[9px] fill-slate-400"
              >
                {new Date(p.recorded_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              marginTop: '-10px'
            }}
          >
            <div className="font-bold text-sm">₹{hoveredPoint.price.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-300">{hoveredPoint.notes || 'Recorded offer'}</div>
            <div className="text-[9px] text-slate-400">
              {new Date(hoveredPoint.recorded_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Zero speculative forecasting: SmartPick does not claim future prices will rise or fall.
        </span>
        <span>Source: Store API snapshots</span>
      </div>
    </div>
  );
};
