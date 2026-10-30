/**
 * SmartPick Cart Utilities
 * Pricing calculations, delivery fees, taxes, coupon verification, and pincode estimation
 */

export const DELIVERY_THRESHOLD = 499;
export const STANDARD_DELIVERY_FEE = 40;
export const GST_RATE = 0.18; // 18% GST (standard Indian electronics tax)

export const COUPONS = {
  SAVE10: {
    code: 'SAVE10',
    type: 'percentage',
    value: 10,
    maxDiscount: 1000,
    minOrder: 0,
    description: '10% instant discount up to ₹1,000',
  },
  FLAT200: {
    code: 'FLAT200',
    type: 'flat',
    value: 200,
    minOrder: 999,
    description: 'Flat ₹200 off on orders above ₹999',
  },
  FIRST5: {
    code: 'FIRST5',
    type: 'percentage',
    value: 5,
    maxDiscount: 500,
    minOrder: 0,
    description: '5% welcome discount up to ₹500',
  },
};

/**
 * Validates a coupon code against subtotal
 */
export const validateCoupon = (code, subtotal) => {
  if (!code) return { valid: false, message: 'Please enter a coupon code' };
  const upper = code.trim().toUpperCase();
  const coupon = COUPONS[upper];

  if (!coupon) {
    return {
      valid: false,
      message: `Coupon "${code}" is invalid or expired. Try SAVE10, FLAT200, or FIRST5.`,
    };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      message: `Coupon "${upper}" requires a minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')}`,
    };
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === 'flat') {
    discount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    code: upper,
    discount: Math.round(discount),
    coupon,
    message: `Coupon "${upper}" applied! You save ₹${Math.round(discount).toLocaleString('en-IN')}`,
  };
};

/**
 * Calculates complete cart financials
 */
export const calculateCartTotals = (items = [], appliedCoupon = null, codFee = 0) => {
  let subtotal = 0;
  let originalSubtotal = 0;

  items.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.unit_price || item.current_price || item.price || 0);
    const origPrice = Number(item.original_price || price);

    subtotal += price * qty;
    originalSubtotal += origPrice * qty;
  });

  // Calculate discount from MRP
  const mrpDiscount = Math.max(0, originalSubtotal - subtotal);

  // Delivery fee
  const isFreeDelivery = subtotal >= DELIVERY_THRESHOLD || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : STANDARD_DELIVERY_FEE;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon && subtotal > 0) {
    const couponRes = validateCoupon(appliedCoupon.code || appliedCoupon, subtotal);
    if (couponRes.valid) {
      couponDiscount = couponRes.discount;
    }
  }

  // Base price before GST: Subtotal in India for retail e-commerce already includes GST
  // We break out the inclusive GST component for transparent invoice display
  const taxableSubtotal = Math.max(0, subtotal - couponDiscount);
  const gstAmount = Math.round(taxableSubtotal - taxableSubtotal / (1 + GST_RATE));
  const baseAmount = taxableSubtotal - gstAmount;

  // Grand total
  const grandTotal = Math.max(0, taxableSubtotal + deliveryFee + (Number(codFee) || 0));

  // Total customer savings
  const totalSavings = mrpDiscount + couponDiscount + (isFreeDelivery && subtotal > 0 ? STANDARD_DELIVERY_FEE : 0);

  return {
    subtotal,
    originalSubtotal,
    mrpDiscount,
    deliveryFee,
    isFreeDelivery,
    deliveryThresholdRemaining: Math.max(0, DELIVERY_THRESHOLD - subtotal),
    couponDiscount,
    appliedCoupon: couponDiscount > 0 ? appliedCoupon : null,
    baseAmount,
    gstAmount,
    codFee: Number(codFee) || 0,
    grandTotal,
    totalSavings,
  };
};

/**
 * Pincode validation and delivery estimation (Indian 6-digit postal code)
 */
export const checkPincodeDelivery = (pincode) => {
  const clean = String(pincode || '').trim();
  if (!/^\d{6}$/.test(clean)) {
    return {
      valid: false,
      message: 'Please enter a valid 6-digit Indian PIN code.',
    };
  }

  // Known major hub pincode prefixes
  const prefix = clean.substring(0, 2);
  let days = 3;
  let hubName = 'Standard Delivery Hub';

  if (['11', '12', '13', '20'].includes(prefix)) {
    days = 1;
    hubName = 'Delhi-NCR Express Fulfillment';
  } else if (['40', '41', '42'].includes(prefix)) {
    days = 2;
    hubName = 'Mumbai & Western Express';
  } else if (['56', '57'].includes(prefix)) {
    days = 2;
    hubName = 'Bengaluru South Hub';
  } else if (['50', '51', '52', '53'].includes(prefix)) {
    days = 2;
    hubName = 'Hyderabad Deccan Hub';
  } else if (['60', '61', '62', '63', '64'].includes(prefix)) {
    days = 2;
    hubName = 'Chennai & Tamil Nadu Hub';
  } else if (['70', '71', '72', '73', '74'].includes(prefix)) {
    days = 3;
    hubName = 'Kolkata Eastern Logistics';
  } else {
    days = 4;
    hubName = 'National Express Cargo';
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + days);
  const formattedDate = estDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return {
    valid: true,
    pincode: clean,
    hubName,
    days,
    estimatedDate: formattedDate,
    message: `Delivery by ${formattedDate} (${days} business ${days === 1 ? 'day' : 'days'})`,
    isExpressAvailable: days <= 2,
  };
};

