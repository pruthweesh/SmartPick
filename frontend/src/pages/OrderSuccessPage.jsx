import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Printer,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const { getOrderById, orders } = useApp();
  const navigate = useNavigate();

  const order = getOrderById(orderId) || orders[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Order Record Not Found</h2>
        <p className="text-xs text-neutral-500">Could not retrieve order {orderId}. It may have expired or been placed on a different session.</p>
        <Link
          to="/products"
          className="inline-block px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const estDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Payment Verified & Dispatched to Warehouse
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Thank You! Your Order is Confirmed
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
            A confirmation receipt and GST invoice have been dispatched to{' '}
            <strong className="text-neutral-900 dark:text-white font-mono">{order.customer_email || 'shopper@smartpick.in'}</strong>.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Invoice</span>
          </button>

          <Link
            to="/order-history"
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-xs hover:opacity-90 flex items-center gap-1.5 shadow-2xs transition"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Track in Order History</span>
          </Link>

          <Link
            to="/products"
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div id="printable-order-receipt" className="rounded-3xl bg-white dark:bg-[#111216] border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8">
        {/* Top Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
              SmartPick Certified Order
            </span>
            <p className="text-lg font-black text-neutral-900 dark:text-white font-mono mt-0.5">
              {order.id}
            </p>
            <span className="text-xs text-neutral-500 font-mono">
              Placed on {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              ● {order.status}
            </span>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Estimated Delivery
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                By {estDeliveryDate}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Meta: Shipping Address & Payment Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/50 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-neutral-500" />
              <span>Shipping Address</span>
            </div>
            <p className="font-semibold text-neutral-900 dark:text-white pt-1">
              {order.shipping_address?.name} ({order.shipping_address?.type || 'Home'})
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {order.shipping_address?.flat}, {order.shipping_address?.area}
              <br />
              {order.shipping_address?.city}, {order.shipping_address?.state} - <span className="font-mono">{order.shipping_address?.pincode}</span>
            </p>
            <p className="text-neutral-500 font-mono text-[11px]">
              Mobile: +91 {order.shipping_address?.phone}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/50 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
              <span>Payment Details</span>
            </div>
            <p className="font-semibold text-neutral-900 dark:text-white pt-1">
              {order.payment_details?.method || order.payment_method}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 font-mono">
              {order.payment_details?.summary || 'Direct Verification Protocol'}
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold flex items-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Payment Authenticated & Zero Fraud Verified</span>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Ordered Line Items
          </h3>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 bg-white dark:bg-[#111216]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800 p-1.5 flex items-center justify-center shrink-0">
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
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
                      {item.name}
                    </h4>
                    <span className="text-xs text-neutral-500 font-mono">
                      Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white tabular-nums">
                  ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown Receipt */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <div className="w-full sm:w-80 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Items Subtotal</span>
              <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                ₹{(order.totals?.subtotal || order.total_amount).toLocaleString('en-IN')}
              </span>
            </div>

            {order.totals?.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Coupon Savings</span>
                <span className="font-mono tabular-nums">
                  -₹{order.totals.couponDiscount.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Delivery Charges</span>
              <span className="font-mono tabular-nums">
                {order.totals?.isFreeDelivery ? 'FREE' : `₹${order.totals?.deliveryFee || 0}`}
              </span>
            </div>

            {order.totals?.codFee > 0 && (
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>COD Handling</span>
                <span className="font-mono tabular-nums">₹{order.totals.codFee}</span>
              </div>
            )}

            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>Inclusive GST (18%)</span>
              <span className="font-mono tabular-nums">
                ₹{(order.totals?.gstAmount || Math.round((order.total_amount || 0) * 0.1525)).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline font-bold">
              <span className="text-sm text-neutral-900 dark:text-white">Total Paid</span>
              <span className="text-xl text-neutral-900 dark:text-white font-mono tabular-nums">
                ₹{(order.totals?.grandTotal || order.total_amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

