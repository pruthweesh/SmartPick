/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  RotateCcw,
  Sliders,
  Database,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const AdminDashboardPage = () => {
  const { user, token, login, showToast } = useApp();

  const [products, setProducts] = useState([]);
  const [issueReports, setIssueReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [healthData, setHealthData] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    if (isAdmin && token) {
      loadAdminData();
    }
  }, [isAdmin, token]);

  const loadAdminData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/issue-reports', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/health', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([prods, issues, logs, health]) => {
        setProducts(prods.products || []);
        setIssueReports(issues.reports || []);
        setAuditLogs(logs.logs || []);
        setHealthData(health);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleUpdateProductStatus = async (productId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, status: newStatus } : p))
        );
        showToast(`Product status updated to ${newStatus}`);
      }
    } catch {
      showToast('Error updating status');
    }
  };

  const handleUpdateIssueStatus = async (issueId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/issue-reports/${issueId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setIssueReports(prev =>
          prev.map(i => (i.id === issueId ? { ...i, status: newStatus } : i))
        );
        showToast(`Issue status changed to ${newStatus}`);
      }
    } catch {
      showToast('Error updating issue');
    }
  };

  const handleAdminQuickLogin = async () => {
    await login('admin@smartpick.in', 'SmartPick2025!');
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500">
          This portal manages catalog approval status, crawler ingestion health, and user discrepancy reports.
        </p>
        <button
          onClick={handleAdminQuickLogin}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
        >
          Sign In as Demo Admin (admin@smartpick.in)
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Operational Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            SmartPick Administration & Data Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">Logged in as: {user?.email}</p>
        </div>

        <button
          onClick={loadAdminData}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Refresh Metrics
        </button>
      </div>

      {/* KPI Metrics Strip */}
      {healthData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-slate-500 block mb-1">Catalog Earbuds</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {healthData.metrics?.total_products}
            </span>
            <span className="text-emerald-600 block mt-1">
              {healthData.metrics?.approved_products} Approved Active
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-slate-500 block mb-1">Avg Spec Completeness</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {healthData.metrics?.average_completeness_score}%
            </span>
            <span className="text-blue-600 block mt-1">Laboratory verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-slate-500 block mb-1">Open Discrepancies</span>
            <span className="text-2xl font-black text-amber-600">
              {healthData.metrics?.open_issues}
            </span>
            <span className="text-slate-400 block mt-1">Requires human review</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-slate-500 block mb-1">Crawler Feed Status</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-4 h-4" /> Healthy & Synced
            </span>
            <span className="text-slate-400 text-[10px] block mt-1">Twice daily cycle</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Products Status ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`pb-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'issues'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Issue Reports</span>
          {issueReports.filter(i => i.status === 'open').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px]">
              {issueReports.filter(i => i.status === 'open').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 border-b-2 transition ${
            activeTab === 'logs'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Products Status Management */}
      {activeTab === 'products' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Brand</th>
                  <th className="p-3.5">Model</th>
                  <th className="p-3.5">Completeness</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-755">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white max-w-[220px] truncate">
                      {p.name}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">{p.brand}</td>
                    <td className="p-3.5 font-mono text-slate-400">{p.model_number || 'N/A'}</td>
                    <td className="p-3.5 font-semibold text-emerald-600">{p.data_completeness_score}%</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : p.status === 'incomplete'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'approved')}
                        disabled={p.status === 'approved'}
                        className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateProductStatus(p.id, 'disabled')}
                        disabled={p.status === 'disabled'}
                        className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-semibold disabled:opacity-40"
                      >
                        Disable
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Issue Reports Queue */}
      {activeTab === 'issues' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
          {issueReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No issue reports logged.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {issueReports.map(iss => (
                <div key={iss.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white capitalize">
                        {iss.issue_type.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          iss.status === 'open'
                            ? 'bg-amber-100 text-amber-800'
                            : iss.status === 'investigating'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {iss.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                      {iss.description}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Logged at: {new Date(iss.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleUpdateIssueStatus(iss.id, 'investigating')}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold"
                    >
                      Investigate
                    </button>
                    <button
                      onClick={() => handleUpdateIssueStatus(iss.id, 'resolved')}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white font-semibold"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent System Audit Events</h3>
          <div className="space-y-2 text-xs font-mono">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
              >
                <div>
                  <span className="text-blue-600 font-bold">[{log.action}]</span> by {log.actor} on{' '}
                  <span className="text-slate-500">{log.entity_type}</span> ({log.entity_id})
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.created_at).toLocaleTimeString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
