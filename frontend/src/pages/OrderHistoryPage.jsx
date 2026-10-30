import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  RotateCw,
  Printer,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  MapPin,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const OrderHistoryPage = () => {
  const { orders, addToCart, showToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // all | processing | delivered

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1);
    });
    showToast(`Added ${order.items.length} items from ${order.id} back to cart!`);
    navigate('/cart');
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'delivered') return o.status === 'Delivered';
    if (activeTab === 'processing') return o.status !== 'Delivered';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider mb-1">
            <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition">Home</Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Account</span>
            <span>/</span>
            <span className="text-neutral-900 dark:text-white font-semibold">Orders</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Order History & Tracking
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track package delivery statuses, print certified tax invoices, and manage past purchases.
          </p>
        </div>

        <Link
          to="/products"
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs self-start sm:self-auto hover:opacity-90 shadow-2xs transition"
        >
          Explore Catalog
        </Link>
      </div>

      {/* Orders Filter Tabs */}
      {orders.length > 0 && (
        <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4 text-xs font-semibold">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'processing', label: 'Processing & In Transit' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-850 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No Orders Placed Yet</h3>
            <p className="text-xs text-neutral-500">
              When you order verified tech gadgets, your tracking history, invoices, and dispatch details will appear right here.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-white dark:bg-[#111216] border border-neutral-200/90 dark:border-neutral-800 shadow-xs overflow-hidden"
              >
                {/* Order Card Header */}
                <div className="p-5 sm:p-6 bg-neutral-50/70 dark:bg-neutral-850/40 border-b border-neutral-200/70 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        Order Placed
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white font-mono">
                        {formattedDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        Total Amount
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white font-mono tabular-nums">
                        ₹{(order.totals?.grandTotal || order.total_amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-bold">
                        Ship To
                      </span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {order.shipping_address?.name || 'Customer'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-500">
                      ID: <span className="text-neutral-900 dark:text-white">{order.id}</span>
                    </span>
                    <Link
                      to={`/order-success/${order.id}`}
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-1 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </Link>
                  </div>
                </div>

                {/* Tracking Stepper Bar */}
                <div className="p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between max-w-2xl">
                    {[
                      { step: 'Confirmed', label: 'Order Confirmed', completed: true },
                      { step: 'Dispatched', label: 'Dispatched', completed: true },
                      { step: 'Out for Delivery', label: 'Out for Delivery', completed: order.status === 'Delivered' },
                      { step: 'Delivered', label: 'Delivered', completed: order.status === 'Delivered' },
                    ].map((s, idx) => (
                      <div key={s.step} className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            s.completed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {s.completed ? '✓' : idx + 1}
                        </div>
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hidden sm:inline">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Line Items */}
                <div className="p-5 sm:p-6 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-2 flex items-center justify-center shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/images/products/placeholder.svg';
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">
                            {item.brand} • {item.category}
                          </span>
                          <Link
                            to={`/products/${item.product_id}`}
                            className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-neutral-500 font-mono mt-0.5">
                            Quantity: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white font-mono tabular-nums">
                          ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/products/${item.product_id}`}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="p-4 sm:p-5 bg-neutral-50/50 dark:bg-neutral-850/20 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Eligible for 7-day hassle-free replacement</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 flex items-center gap-1.5 transition"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
