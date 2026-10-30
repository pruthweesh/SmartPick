import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Lock,
  Phone,
  Home,
  Briefcase,
  Check,
  Sparkles,
  Smartphone,
  Building,
  Wallet,
  Calendar,
  Banknote,
  RotateCw,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import {
  calculateCartTotals,
  DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from '../utils/cartUtils.js';
import {
  validateLuhn,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateExpiry,
  validateUPI,
  calculateEMIPlans,
  lookupPincode,
} from '../utils/checkoutUtils.js';

// Pre-seeded Indian addresses if user hasn't created any
const INITIAL_SAVED_ADDRESSES = [
  {
    id: 'addr_1',
    name: 'Pruthweesh Kumar',
    phone: '9876543210',
    pincode: '560001',
    flat: '#402, Prestige Tower',
    area: 'MG Road, Ashok Nagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'addr_2',
    name: 'Pruthweesh K (Tech Labs)',
    phone: '9876543211',
    pincode: '400051',
    flat: 'Level 5, Platina Building',
    area: 'Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'Work',
    isDefault: false,
  },
];

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' },
];

export const CheckoutPage = () => {
  const {
    cartItems,
    buyNowItem,
    clearBuyNow,
    clearCart,
    saveOrder,
    user,
    showToast,
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Check if this checkout is for "Buy Now" (single item)
  const isBuyNow = new URLSearchParams(location.search).get('buyNow') === 'true';
  const checkoutItems = isBuyNow && buyNowItem ? [buyNowItem] : cartItems;

  // Stepper: 1 = Address, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Address state (persisted in localStorage)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('smartpick_saved_addresses');
      return stored ? JSON.parse(stored) : INITIAL_SAVED_ADDRESSES;
    } catch {
      return INITIAL_SAVED_ADDRESSES;
    }
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    return savedAddresses[0]?.id || null;
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // New Address Form fields & validation errors
  const [addressForm, setAddressForm] = useState({
    name: user?.full_name || '',
    phone: '',
    pincode: '',
    flat: '',
    area: '',
    city: '',
    state: '',
    type: 'Home',
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Payment state (Strictly held in React memory, never stored in localStorage!)
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking | wallet | emi | cod

  // UPI inputs
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedUpiApp, setSelectedUpiApp] = useState('');

  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCardForFuture, setSaveCardForFuture] = useState(false);

  // Net banking & Wallets & EMI
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const [selectedEmiTenure, setSelectedEmiTenure] = useState(6);

  // Review & Terms
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // Mock Payment Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('');
  const [paymentErrorModal, setPaymentErrorModal] = useState(null); // { title, message }

  // Save addresses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smartpick_saved_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error('Failed to save addresses:', e);
    }
  }, [savedAddresses]);

  // Route Guard: If cart is empty and not buyNow, redirect to cart
  useEffect(() => {
    if (!isBuyNow && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isBuyNow, cartItems.length, navigate]);

  // Financial calculations
  const codFee = paymentMethod === 'cod' ? 50 : 0;
  const totals = calculateCartTotals(checkoutItems, null, codFee);

  // ---------------- Address Functions ----------------

  const handlePincodeChange = (pincodeVal) => {
    const clean = pincodeVal.replace(/\D/g, '').substring(0, 6);
    setAddressForm((prev) => ({ ...prev, pincode: clean }));

    if (clean.length === 6) {
      const match = lookupPincode(clean);
      if (match) {
        setAddressForm((prev) => ({
          ...prev,
          pincode: clean,
          city: match.city,
          state: match.state,
        }));
        setAddressErrors((prev) => ({ ...prev, pincode: null }));
      }
    }
  };

  const validateAddressForm = () => {
    const errors = {};
    if (!addressForm.name.trim() || addressForm.name.trim().length < 3) {
      errors.name = 'Please enter a valid full name (at least 3 characters)';
    }
    if (!/^[6-9]\d{9}$/.test(addressForm.phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }
    if (!/^\d{6}$/.test(addressForm.pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit PIN code';
    }
    if (!addressForm.flat.trim()) {
      errors.flat = 'House/Flat number and building are required';
    }
    if (!addressForm.area.trim()) {
      errors.area = 'Street, area, or locality is required';
    }
    if (!addressForm.city.trim()) {
      errors.city = 'City is required';
    }
    if (!addressForm.state.trim()) {
      errors.state = 'State is required';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    if (editingAddressId) {
      setSavedAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingAddressId
            ? { ...addressForm, id: editingAddressId }
            : addr
        )
      );
      setSelectedAddressId(editingAddressId);
    } else {
      const newAddr = {
        ...addressForm,
        id: `addr_${Date.now()}`,
        isDefault: savedAddresses.length === 0,
      };
      setSavedAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
    }

    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({
      name: user?.full_name || '',
      phone: '',
      pincode: '',
      flat: '',
      area: '',
      city: '',
      state: '',
      type: 'Home',
    });
  };

  const handleEditAddress = (addr) => {
    setAddressForm({ ...addr });
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (id) => {
    if (savedAddresses.length <= 1) {
      showToast('You must keep at least one delivery address.');
      return;
    }
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = savedAddresses.filter((a) => a.id !== id);
      setSelectedAddressId(remaining[0]?.id || null);
    }
  };

  // ---------------- Payment Validation ----------------

  const cardBrand = detectCardBrand(cardNumber);
  const isCardNumberValid = validateLuhn(cardNumber);
  const isExpiryValid = validateExpiry(cardExpiry);
  const isCvvValid = /^\d{3,4}$/.test(cardCvv);
  const isCardNameValid = cardHolder.trim().length >= 3;

  const canProceedToReview = () => {
    if (paymentMethod === 'upi') {
      return validateUPI(upiId);
    }
    if (paymentMethod === 'card') {
      return isCardNumberValid && isExpiryValid && isCvvValid && isCardNameValid;
    }
    if (paymentMethod === 'netbanking') {
      return Boolean(selectedBank);
    }
    if (paymentMethod === 'wallet') {
      return Boolean(selectedWallet);
    }
    if (paymentMethod === 'emi') {
      return totals.grandTotal >= 3000 && Boolean(selectedEmiTenure);
    }
    if (paymentMethod === 'cod') {
      return totals.grandTotal <= 50000;
    }
    return false;
  };

  // ---------------- Mock Payment Processing ----------------

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    if (!agreedToTerms) {
      showToast('Please accept the terms and conditions to proceed.');
      return;
    }

    const selectedAddr = savedAddresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddr) {
      showToast('Please select a delivery address');
      setCurrentStep(1);
      return;
    }

    setIsProcessing(true);
    setProcessingStatusText('Connecting to Reserve Bank & Payment Gateway...');

    // Multi-phase simulated loading animation
    setTimeout(() => {
      setProcessingStatusText('Securing 256-bit Tokenized Authentication...');
    }, 1000);

    setTimeout(() => {
      setProcessingStatusText('Verifying merchant settlement & fraud filters...');
    }, 1800);

    // Final outcome check after 2.6 seconds
    setTimeout(() => {
      const cleanCard = cardNumber.replace(/\D/g, '');
      const cleanUpi = upiId.trim().toLowerCase();

      // FAILURE TEST CONDITIONS (Cart must remain intact)
      if (paymentMethod === 'card' && cleanCard.endsWith('0002')) {
        setIsProcessing(false);
        setPaymentErrorModal({
          title: 'Transaction Declined by Issuing Bank',
          message:
            'Your bank rejected this card charge (Error Code: 0002 - Insufficient Funds / Bank Security Policy). Please verify card details or choose an alternate payment method.',
        });
        return;
      }

      if (paymentMethod === 'upi' && cleanUpi.endsWith('@fail')) {
        setIsProcessing(false);
        setPaymentErrorModal({
          title: 'UPI Transaction Declined',
          message:
            'The test VPA address "@fail" returned a PSP authorization decline. Please verify your UPI ID or choose Google Pay / Card.',
        });
        return;
      }

      // SUCCESS PATH
      // Format masked payment summary
      let maskedPayment = {};
      if (paymentMethod === 'card') {
        maskedPayment = {
          method: 'Credit/Debit Card',
          brand: cardBrand.toUpperCase(),
          summary: `Card ending in ${cleanCard.slice(-4) || '4242'}`,
          holder: cardHolder.toUpperCase(),
        };
      } else if (paymentMethod === 'upi') {
        maskedPayment = {
          method: 'UPI Instant Transfer',
          summary: upiId,
        };
      } else if (paymentMethod === 'netbanking') {
        maskedPayment = {
          method: 'Net Banking',
          summary: POPULAR_BANKS.find((b) => b.id === selectedBank)?.name || 'Direct Bank Debit',
        };
      } else if (paymentMethod === 'wallet') {
        maskedPayment = {
          method: 'Digital Wallet',
          summary: `${selectedWallet.toUpperCase()} Wallet`,
        };
      } else if (paymentMethod === 'emi') {
        maskedPayment = {
          method: 'No-Cost / Low-Cost EMI',
          summary: `${selectedEmiTenure} Months Easy Installments`,
        };
      } else {
        maskedPayment = {
          method: 'Cash on Delivery (COD)',
          summary: 'Pay upon delivery at your doorstep',
        };
      }

      // Save order
      const newOrder = saveOrder({
        items: checkoutItems,
        shipping_address: selectedAddr,
        payment_method: paymentMethod.toUpperCase(),
        payment_details: maskedPayment,
        totals: totals,
        customer_email: user?.email || 'customer@smartpick.in',
        customer_name: selectedAddr.name,
      });

      // Clear the appropriate store
      if (isBuyNow) {
        clearBuyNow();
      } else {
        clearCart();
      }

      setIsProcessing(false);
      navigate(`/order-success/${newOrder.id}`);
    }, 2600);
  };

  const selectedAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 3-Step Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-neutral-200 dark:bg-neutral-800 -z-10" />

          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
              currentStep === 1
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-4 ring-neutral-200 dark:ring-neutral-800'
                : currentStep > 1
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : <span>1</span>}
            <span className="hidden sm:inline">Delivery Address</span>
          </button>

          {/* Step 2 Pill */}
          <button
            type="button"
            disabled={!selectedAddress}
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
              currentStep === 2
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-4 ring-neutral-200 dark:ring-neutral-800'
                : currentStep > 2
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : <span>2</span>}
            <span className="hidden sm:inline">Payment Method</span>
          </button>

          {/* Step 3 Pill */}
          <button
            type="button"
            disabled={!canProceedToReview()}
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs ${
              currentStep === 3
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 ring-4 ring-neutral-200 dark:ring-neutral-800'
                : 'bg-white dark:bg-neutral-900 text-neutral-400 border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            <span>3</span>
            <span className="hidden sm:inline">Review & Place Order</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Flow (col-span-8) + Persistent Summary (col-span-4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Flow Container */}
        <div className="lg:col-span-8 space-y-6">
          {/* ==================== STEP 1: ADDRESS ==================== */}
          {currentStep === 1 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-neutral-900 dark:text-white">
                      Select Delivery Address
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Where should we deliver your audited electronics?
                    </p>
                  </div>
                </div>

                {!isAddingAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddressId(null);
                      setAddressForm({
                        name: user?.full_name || '',
                        phone: '',
                        pincode: '',
                        flat: '',
                        area: '',
                        city: '',
                        state: '',
                        type: 'Home',
                      });
                      setIsAddingAddress(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards Grid */}
              {!isAddingAddress ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 relative ${
                          isSelected
                            ? 'border-neutral-900 dark:border-white bg-neutral-50/50 dark:bg-neutral-850/50'
                            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-neutral-900 dark:text-white">
                              {addr.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                              {addr.type}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                            {addr.flat}, {addr.area}
                            <br />
                            {addr.city}, {addr.state} - <span className="font-mono font-semibold">{addr.pincode}</span>
                          </p>

                          <p className="text-xs text-neutral-500 font-mono pt-1">
                            Phone: +91 {addr.phone}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={isSelected}
                              onChange={() => setSelectedAddressId(addr.id)}
                              className="accent-neutral-900 dark:accent-white"
                            />
                            <span>Deliver to this Address</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAddress(addr);
                              }}
                              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-1"
                              title="Edit address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="text-neutral-400 hover:text-red-500 p-1"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Add/Edit Address Form */
                <form onSubmit={handleSaveAddress} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-200 dark:border-neutral-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Name */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      {addressErrors.name && <p className="text-[10px] text-red-500 mt-1">{addressErrors.name}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        10-Digit Mobile Number *
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, '') })}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                      />
                      {addressErrors.phone && <p className="text-[10px] text-red-500 mt-1">{addressErrors.phone}</p>}
                    </div>

                    {/* PIN Code */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        6-Digit PIN Code * (Auto-fills City & State)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addressForm.pincode}
                        onChange={(e) => handlePincodeChange(e.target.value)}
                        placeholder="e.g. 560001"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                      />
                      {addressErrors.pincode && <p className="text-[10px] text-red-500 mt-1">{addressErrors.pincode}</p>}
                    </div>

                    {/* Address Type */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Address Type
                      </label>
                      <div className="flex gap-2">
                        {['Home', 'Work'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setAddressForm({ ...addressForm, type: t })}
                            className={`flex-1 py-2 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                              addressForm.type === t
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900'
                                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                            }`}
                          >
                            {t === 'Home' ? <Home className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                            <span>{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Flat/Building */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Flat, House No., Building, Apartment *
                      </label>
                      <input
                        type="text"
                        value={addressForm.flat}
                        onChange={(e) => setAddressForm({ ...addressForm, flat: e.target.value })}
                        placeholder="e.g. Flat 302, Green Glen Orchid"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      {addressErrors.flat && <p className="text-[10px] text-red-500 mt-1">{addressErrors.flat}</p>}
                    </div>

                    {/* Area/Street */}
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Area, Street, Sector, Village *
                      </label>
                      <input
                        type="text"
                        value={addressForm.area}
                        onChange={(e) => setAddressForm({ ...addressForm, area: e.target.value })}
                        placeholder="e.g. Outer Ring Road, Bellandur"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      {addressErrors.area && <p className="text-[10px] text-red-500 mt-1">{addressErrors.area}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="e.g. Bengaluru"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      {addressErrors.city && <p className="text-[10px] text-red-500 mt-1">{addressErrors.city}</p>}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="e.g. Karnataka"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                      />
                      {addressErrors.state && <p className="text-[10px] text-red-500 mt-1">{addressErrors.state}</p>}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs hover:opacity-90 transition"
                    >
                      Save & Use This Address
                    </button>
                  </div>
                </form>
              )}

              {/* Step 1 Footer Action */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="button"
                  disabled={!selectedAddress}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 2: PAYMENT ==================== */}
          {currentStep === 2 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-neutral-900 dark:text-white">
                      Select Payment Method
                    </h2>
                    <p className="text-xs text-neutral-500">
                      All transactions are 256-bit encrypted and tokenized.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Address</span>
                </button>
              </div>

              {/* Payment Methods Layout: Tabs on Left, Details on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                {/* Method Tabs (col-span-4) */}
                <div className="sm:col-span-4 space-y-1.5 border-r border-neutral-100 dark:border-neutral-800 pr-2">
                  {[
                    { id: 'upi', label: 'UPI / QR Code', icon: Smartphone, tag: 'Instant' },
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, tag: 'Visa/MC' },
                    { id: 'netbanking', label: 'Net Banking', icon: Building, tag: 'All Banks' },
                    { id: 'wallet', label: 'Wallets', icon: Wallet, tag: 'Paytm/Amazon' },
                    { id: 'emi', label: 'EMI Installments', icon: Calendar, tag: totals.grandTotal >= 3000 ? 'Available' : 'Min ₹3k' },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, tag: '+₹50 fee' },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = paymentMethod === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setPaymentMethod(tab.id)}
                        className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between group ${
                          isActive
                            ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 opacity-80" />
                          <span>{tab.label}</span>
                        </span>
                        <span
                          className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded ${
                            isActive
                              ? 'bg-white/20 dark:bg-black/10 text-white dark:text-neutral-900'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {tab.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Details Pane (col-span-8) */}
                <div className="sm:col-span-8 space-y-4">
                  {/* TAB 1: UPI */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                          Instant UPI Apps
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {['Google Pay', 'PhonePe', 'Paytm UPI', 'CRED'].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => {
                                setSelectedUpiApp(app);
                                if (!upiId) setUpiId(`shopper@${app.toLowerCase().replace(/\s+/g, '')}`);
                              }}
                              className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                                selectedUpiApp === app
                                  ? 'border-neutral-900 dark:border-white bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                                  : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                              }`}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-neutral-900 dark:text-white">
                          Or Enter UPI ID / VPA
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            placeholder="username@okhdfcbank or user@paytm"
                            className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (validateUPI(upiId)) {
                                setUpiVerified(true);
                                showToast('UPI ID Verified Successfully');
                              } else {
                                showToast('Invalid UPI format. Use name@bank');
                              }
                            }}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition shrink-0"
                          >
                            Verify
                          </button>
                        </div>

                        {upiVerified && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified: SmartPick Customer (NPCI Switch Active)</span>
                          </p>
                        )}

                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                          <p className="font-semibold">💡 Testing UPI decline case:</p>
                          <p>Enter any ID ending with <code className="font-bold">@fail</code> (e.g. <code className="font-bold">test@fail</code>) to simulate a bank decline.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CREDIT / DEBIT CARD */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      {/* Card Number */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-semibold text-neutral-900 dark:text-white">
                            Card Number
                          </label>
                          <span className="text-[10px] font-mono uppercase text-neutral-500 font-bold">
                            Brand: {cardBrand.toUpperCase()}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="4242 •••• •••• 4242"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs">
                            {cardNumber && (
                              isCardNumberValid ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <span className="text-[10px] text-red-500 font-mono">Invalid Checksum</span>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Name on Card */}
                      <div>
                        <label className="block text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="e.g. PRUTHWEESH KUMAR"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono uppercase"
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                            Valid Thru (MM/YY)
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
                          />
                          {cardExpiry.length === 5 && !isExpiryValid && (
                            <p className="text-[10px] text-red-500 mt-1">Expiry must be a future date</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                            CVV (Masked)
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono tracking-widest"
                          />
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                        <p className="font-semibold">💡 Testing Mock Payment:</p>
                        <p>Card ending in <code className="font-bold">4242</code> = SUCCESS. Card ending in <code className="font-bold">0002</code> = DECLINED.</p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: NET BANKING */}
                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        Popular Banks
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {POPULAR_BANKS.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`p-3 rounded-xl border text-xs font-semibold text-center transition ${
                              selectedBank === b.id
                                ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-850 text-neutral-900 dark:text-white shadow-xs'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                            }`}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                          All Other Banks
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none"
                        >
                          <option value="hdfc">HDFC Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                          <option value="pnb">Punjab National Bank</option>
                          <option value="bob">Bank of Baroda</option>
                          <option value="canara">Canara Bank</option>
                          <option value="indusind">IndusInd Bank</option>
                          <option value="yes">Yes Bank</option>
                          <option value="federal">Federal Bank</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: WALLETS */}
                  {paymentMethod === 'wallet' && (
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                        Select Digital Wallet
                      </span>
                      <div className="space-y-2">
                        {[
                          { id: 'paytm', name: 'Paytm Wallet', desc: 'Link mobile & OTP' },
                          { id: 'phonepe', name: 'PhonePe Wallet', desc: 'Instant debit' },
                          { id: 'amazonpay', name: 'Amazon Pay Balance', desc: 'Fast 1-click checkout' },
                          { id: 'mobikwik', name: 'MobiKwik / ZIP', desc: 'Pay later & wallet' },
                        ].map((w) => (
                          <div
                            key={w.id}
                            onClick={() => setSelectedWallet(w.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                              selectedWallet === w.id
                                ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-850'
                                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-xs text-neutral-900 dark:text-white block">
                                {w.name}
                              </span>
                              <span className="text-[11px] text-neutral-500">{w.desc}</span>
                            </div>
                            <input
                              type="radio"
                              name="walletSelection"
                              checked={selectedWallet === w.id}
                              onChange={() => setSelectedWallet(w.id)}
                              className="accent-neutral-900 dark:accent-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: EMI */}
                  {paymentMethod === 'emi' && (
                    <div className="space-y-3">
                      {totals.grandTotal < 3000 ? (
                        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
                          EMI is only available on orders of ₹3,000 and above. Your current grand total is ₹{totals.grandTotal.toLocaleString('en-IN')}.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                            Choose Installment Tenure (15% p.a.)
                          </span>
                          <div className="space-y-2">
                            {calculateEMIPlans(totals.grandTotal).map((plan) => (
                              <div
                                key={plan.months}
                                onClick={() => setSelectedEmiTenure(plan.months)}
                                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                                  selectedEmiTenure === plan.months
                                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-850'
                                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'
                                }`}
                              >
                                <div>
                                  <span className="font-bold text-xs text-neutral-900 dark:text-white">
                                    ₹{plan.emi.toLocaleString('en-IN')} / month
                                  </span>
                                  <p className="text-[11px] text-neutral-500">
                                    for {plan.months} months • Total interest: ₹{plan.interest.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">
                                  Total: ₹{plan.totalPayable.toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 6: CASH ON DELIVERY */}
                  {paymentMethod === 'cod' && (
                    <div className="space-y-3">
                      {totals.grandTotal > 50000 ? (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300">
                          Cash on Delivery is unavailable for orders exceeding ₹50,000 in accordance with RBI logistics guidelines. Please select UPI, Net Banking, or Card.
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-neutral-900 dark:text-white">
                              Cash / UPI on Delivery
                            </span>
                            <span className="text-[11px] font-mono font-bold text-neutral-700 dark:text-neutral-300">
                              +₹50 Handling Fee
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed">
                            Pay via Cash or QR code directly to the courier executive upon arrival. Please keep exact change ready.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2 Footer Navigation */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  disabled={!canProceedToReview()}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-40 flex items-center gap-2 transition"
                >
                  <span>Review Order</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: REVIEW & PLACE ORDER ==================== */}
          {currentStep === 3 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h2 className="font-bold text-base text-neutral-900 dark:text-white">
                      Review & Confirm Order
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Verify your delivery address, chosen payment method, and items.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Payment</span>
                </button>
              </div>

              {/* Delivery Address Summary */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200 dark:border-neutral-800 flex justify-between items-start gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-neutral-900 dark:text-white">
                      Delivering to: {selectedAddress.name} ({selectedAddress.type})
                    </span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                      {selectedAddress.flat}, {selectedAddress.area}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500 mt-1">
                      Contact: +91 {selectedAddress.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-neutral-900 dark:text-white underline shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Payment Method Summary */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/60 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-neutral-500 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-neutral-900 dark:text-white block uppercase">
                      Payment Method: {paymentMethod}
                    </span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {paymentMethod === 'card' && `Card ending in ${cardNumber.replace(/\D/g, '').slice(-4) || '••••'} (${cardBrand.toUpperCase()})`}
                      {paymentMethod === 'upi' && `UPI ID: ${upiId}`}
                      {paymentMethod === 'netbanking' && `Net Banking: ${POPULAR_BANKS.find((b) => b.id === selectedBank)?.name || selectedBank}`}
                      {paymentMethod === 'wallet' && `Digital Wallet: ${selectedWallet.toUpperCase()}`}
                      {paymentMethod === 'emi' && `Easy Installments (${selectedEmiTenure} Months)`}
                      {paymentMethod === 'cod' && 'Cash on Delivery (+₹50 fee included)'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-semibold text-neutral-900 dark:text-white underline shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Item List Preview */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Items Ordered ({checkoutItems.length})
                </span>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between gap-4 bg-white dark:bg-[#111216]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1 flex items-center justify-center shrink-0">
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
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-neutral-500 font-mono">
                            Qty: {item.quantity} × ₹{item.unit_price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white tabular-nums shrink-0">
                        ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850/40 border border-neutral-200 dark:border-neutral-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="checkoutTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 accent-neutral-900 dark:accent-white"
                />
                <label htmlFor="checkoutTerms" className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed cursor-pointer">
                  I agree to SmartPick’s <Link to="/terms" className="underline font-semibold text-neutral-900 dark:text-white">Terms of Sale</Link>, 7-day hassle-free replacement guarantee, and authorize payment of <strong className="font-mono text-neutral-900 dark:text-white">₹{totals.grandTotal.toLocaleString('en-IN')}</strong>.
                </label>
              </div>

              {/* Place Order CTA with Double-Click Guard */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={!agreedToTerms || isProcessing}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 px-6 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-extrabold text-sm uppercase tracking-wider hover:opacity-95 disabled:opacity-40 shadow-xl flex items-center justify-center gap-2 transition"
                >
                  <Lock className="w-4 h-4" />
                  <span>Place Order & Pay ₹{totals.grandTotal.toLocaleString('en-IN')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Order Summary on Desktop (col-span-4) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111216] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Order Summary
              </h3>
              <span className="text-xs font-mono text-neutral-500">
                {checkoutItems.reduce((acc, i) => acc + i.quantity, 0)} Items
              </span>
            </div>

            <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-neutral-900 dark:text-white">
                  ₹{totals.subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {totals.mrpDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>MRP Discount</span>
                  <span className="font-mono tabular-nums">
                    -₹{totals.mrpDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-mono tabular-nums">
                  {totals.isFreeDelivery ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${totals.deliveryFee}`
                  )}
                </span>
              </div>

              {codFee > 0 && (
                <div className="flex justify-between text-neutral-900 dark:text-white">
                  <span>COD Handling Fee</span>
                  <span className="font-mono tabular-nums">₹{codFee}</span>
                </div>
              )}

              <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                <span>Inclusive GST (18%)</span>
                <span className="font-mono tabular-nums">
                  ₹{totals.gstAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-extrabold text-neutral-900 dark:text-white block">
                  Grand Total
                </span>
                <span className="text-[10px] text-neutral-400">Final amount to be charged</span>
              </div>
              <span className="text-2xl font-black text-neutral-900 dark:text-white font-mono tabular-nums">
                ₹{totals.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {totals.totalSavings > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                You save ₹{totals.totalSavings.toLocaleString('en-IN')} on this order
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/80 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SmartPick Trust Guarantee</span>
            </div>
            <p>100% genuine audited products, 7-day manufacturer DOA replacement, direct brand warranty.</p>
          </div>
        </div>
      </div>

      {/* ==================== MOCK PAYMENT LOADING OVERLAY ==================== */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#111216] rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-neutral-200 dark:border-neutral-800 border-t-neutral-900 dark:border-t-white animate-spin" />
              <Lock className="w-6 h-6 text-neutral-900 dark:text-white absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">
                Securing Your Payment
              </h3>
              <p className="text-xs font-mono text-neutral-500 animate-pulse">
                {processingStatusText}
              </p>
            </div>

            <p className="text-[11px] text-neutral-400">
              Please do not refresh this window or click back button while the payment gateway handshakes with your bank.
            </p>
          </div>
        </div>
      )}

      {/* ==================== PAYMENT DECLINE / FAILURE MODAL ==================== */}
      {paymentErrorModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#111216] rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-900/50 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
                {paymentErrorModal.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {paymentErrorModal.message}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
              Notice: Your shopping cart and selected products are completely preserved and safe.
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentErrorModal(null);
                  setCurrentStep(2); // take them back to choose another payment method
                }}
                className="w-full py-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition"
              >
                Choose Another Payment Method
              </button>

              <button
                type="button"
                onClick={() => setPaymentErrorModal(null)}
                className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                Retry Same Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
