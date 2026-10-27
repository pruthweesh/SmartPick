import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
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
  const { toastMessage } = useApp();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-mono font-medium border border-neutral-800 animate-in slide-in-from-bottom-4 duration-200 flex items-center gap-2.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      <span>{toastMessage}</span>
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
                <Route path="/alerts" element={<PriceAlertsPage />} />
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
