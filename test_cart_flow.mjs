import {
  calculateCartTotals,
  validateCoupon,
  checkPincodeDelivery,
  COUPONS,
  DELIVERY_THRESHOLD,
  STANDARD_DELIVERY_FEE,
} from './frontend/src/utils/cartUtils.js';

import {
  validateLuhn,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateExpiry,
  validateUPI,
  calculateEMIPlans,
  lookupPincode,
} from './frontend/src/utils/checkoutUtils.js';

console.log('🧪 Starting Unit & Logic Tests for Cart & Checkout Utilities...\n');

let failed = 0;
const assert = (condition, msg) => {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
};

// 1. Test Cart Totals & Delivery Fee
const testItems = [
  { id: 'p1', unit_price: 200, original_price: 300, quantity: 2 }, // 400
];
const totalsBelow = calculateCartTotals(testItems);
assert(totalsBelow.subtotal === 400, 'Subtotal for 2 items @ 200 is 400');
assert(totalsBelow.deliveryFee === STANDARD_DELIVERY_FEE, 'Delivery fee is 40 below threshold of 499');
assert(totalsBelow.grandTotal === 440, 'Grand total below threshold is 440');

const testItemsAbove = [
  { id: 'p2', unit_price: 500, original_price: 800, quantity: 1 },
];
const totalsAbove = calculateCartTotals(testItemsAbove);
assert(totalsAbove.subtotal === 500, 'Subtotal is 500');
assert(totalsAbove.isFreeDelivery === true, 'Delivery is free above 499');
assert(totalsAbove.deliveryFee === 0, 'Delivery fee is 0');
assert(totalsAbove.grandTotal === 500, 'Grand total is 500');

// 2. Test Coupons
const c1 = validateCoupon('SAVE10', 5000);
assert(c1.valid === true && c1.discount === 500, 'SAVE10 gives 10% (500 on 5000)');

const c1Max = validateCoupon('SAVE10', 25000);
assert(c1Max.valid === true && c1Max.discount === 1000, 'SAVE10 caps at 1000');

const cFlatFail = validateCoupon('FLAT200', 500);
assert(cFlatFail.valid === false, 'FLAT200 fails below min order 999');

const cFlatSuccess = validateCoupon('FLAT200', 1500);
assert(cFlatSuccess.valid === true && cFlatSuccess.discount === 200, 'FLAT200 gives 200 off above 999');

const cInvalid = validateCoupon('INVALID_CODE', 1000);
assert(cInvalid.valid === false, 'INVALID_CODE fails gracefully');

// 3. Test Pincode
const pinDelhi = checkPincodeDelivery('110001');
assert(pinDelhi.valid === true && pinDelhi.days === 1, 'Delhi 110001 has 1-day express delivery');

const pinBlr = checkPincodeDelivery('560001');
assert(pinBlr.valid === true && pinBlr.days === 2, 'Bengaluru 560001 has 2-day delivery');

const pinInvalid = checkPincodeDelivery('123');
assert(pinInvalid.valid === false, 'Short pincode fails validation');

// 4. Test Luhn & Card Detection
assert(validateLuhn('4242424242424242') === true, 'Test card 4242 passes Luhn');
assert(validateLuhn('4242424242420002') === true, 'Decline test card 0002 passes Luhn');
assert(validateLuhn('1234567812345670') === false, 'Invalid checksum card fails Luhn');

assert(detectCardBrand('4242424242424242') === 'visa', 'Visa card detected');
assert(detectCardBrand('5100000000000000') === 'mastercard', 'Mastercard detected');
assert(detectCardBrand('6011000000000000') === 'rupay', 'RuPay card detected');

// 5. Test Expiry Validation
assert(validateExpiry('12/28') === true, 'Future expiry 12/28 is valid');
assert(validateExpiry('01/20') === false, 'Past expiry 01/20 is invalid');
assert(validateExpiry('15/28') === false, 'Month 15 is invalid');

// 6. Test UPI Validation
assert(validateUPI('user@okhdfcbank') === true, 'Valid UPI ID passes');
assert(validateUPI('test@fail') === true, 'Decline test UPI passes format check');
assert(validateUPI('invalid_upi_without_at') === false, 'Invalid UPI fails format check');

// 7. Test EMI Calculations
const emiPlans = calculateEMIPlans(12000);
assert(emiPlans.length === 4, '4 EMI tenure plans returned for 12000');
assert(emiPlans[0].months === 3 && emiPlans[0].emi > 0, '3-month EMI calculated');

const emiTooLow = calculateEMIPlans(2000);
assert(emiTooLow.length === 0, 'No EMI plans for orders < 3000');

// 8. Test Pincode Lookup
const matchBlr = lookupPincode('560001');
assert(matchBlr.city === 'Bengaluru' && matchBlr.state === 'Karnataka', 'Pincode 560001 resolves to Bengaluru, Karnataka');

console.log(`\n============================`);
console.log(`Completed with ${failed} failures.`);
if (failed > 0) process.exit(1);

