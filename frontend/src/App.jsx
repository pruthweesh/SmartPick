import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';

// Pages
import { CartPage } from './pages/CartPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { PaymentPage } from './pages/PaymentPage.jsx';
import { OrderSuccessPage } from './pages/OrderSuccessPage.jsx';
import { OrderHistoryPage } from './pages/OrderHistoryPage.jsx';
import { AdvisorPage } from './pages/AdvisorPage.jsx';
import { ProductListPage } from './pages/ProductListPage.jsx';
import { ProductDetailPage } from './pages/ProductDetailPage.jsx';
import { ComparePage } from './pages/ComparePage.jsx';
import { WishlistPage } from './pages/WishlistPage.jsx';
import { PriceAlertsPage } from './pages/PriceAlertsPage.jsx';
import { AccountPage } from './pages/AccountPage.jsx';
import { MethodologyPage } from './pages/MethodologyPage.jsx';
import {
  AffiliateDisclosurePage,
  PrivacyPolicyPage,
  TermsPage,
  FAQPage,
  ContactPage,
  ReportIssuePage
} from './pages/LegalPages.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';

import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { EmptyState } from './components/EmptyState.jsx';

// 404 Fallback
const NotFoundPage = () => (
  <div className="max-w-2xl mx-auto px-4 py-16">
    <EmptyState
      type="server-error"
      title="Page Not Found (404)"
      description="The requested link does not exist, has expired, or has been relocated in our catalog."
      actionText="Return to Homepage"
      actionHref="/"
      secondaryActionText="Browse Catalog"
      secondaryActionHref="/products"
    />
  </div>
);

// Toast notification component
const ToastNotification = () => {
  const { toast } = useApp();
  if (!toast?.message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-950/95 dark:bg-white text-white dark:text-neutral-950 px-4 py-3 rounded-2xl shadow-2xl text-xs font-medium border border-neutral-800 dark:border-neutral-200 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-200 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
      <span className="font-mono">{toast.message}</span>
      {toast.action && (
        <Link
          to={toast.action.url}
          className="ml-1 px-2.5 py-1 rounded-lg bg-white/20 dark:bg-black/10 hover:bg-white/30 dark:hover:bg-black/20 font-bold transition uppercase text-[10px] tracking-wider"
        >
          {toast.action.label}
        </Link>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#faf9f7] dark:bg-[#0b0c0f] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-1">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/advisor" element={<AdvisorPage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/CartPage" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment/preview" element={<PaymentPage />} />
                <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                <Route path="/alerts" element={<PriceAlertsPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/methodology" element={<MethodologyPage />} />
                <Route path="/how-recommendations-work" element={<MethodologyPage />} />
                <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/help" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/report-issue" element={<ReportIssuePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </ErrorBoundary>
          </main>
          <Footer />
          <ToastNotification />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}