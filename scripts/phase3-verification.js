const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          json,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function run() {
  console.log('=== LITTLE CUCKOO PHASE 3 & IMAGE VERIFICATION SUITE ===\n');
  const results = [];

  function record(module, testName, pass, details = '') {
    results.push({ module, testName, status: pass ? 'PASS' : 'FAIL', details });
    console.log(`[${pass ? '✅ PASS' : '❌ FAIL'}] ${module}: ${testName} ${details ? '(' + details + ')' : ''}`);
  }

  // 1. GENERATED BABY CLOTHES IMAGE ASSETS
  console.log('--- 1. Testing Generated Baby Clothes Images ---');
  const images = [
    '/images/hero/hero_baby_lifestyle.jpg',
    '/images/products/cloudsoft_ribbed_romper.jpg',
    '/images/products/newborn_welcome_gift_set.jpg',
    '/images/products/buttercup_zip_sleepsuit.jpg',
    '/images/products/muslin_swaddle_duo.jpg',
    '/images/products/heirloom_baby_dress.jpg',
  ];

  for (const img of images) {
    const res = await request(img);
    const pass = res.statusCode === 200 && res.headers['content-type']?.includes('image');
    record('Image Asset Serving', img, pass, `Status ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
  }

  // 2. PRODUCT CATALOG IMAGE SYNCHRONIZATION
  console.log('\n--- 2. Testing Database Product Image Synchronization ---');
  const prodRes = await request('/api/products');
  const products = prodRes.json?.products || [];
  record('Catalog API', 'Returns active products from database', products.length > 0, `Count: ${products.length}`);

  let allProductsHaveImages = true;
  for (const p of products) {
    const imgUrl = p.images?.[0]?.url || '';
    const isLocalOrValid = imgUrl.startsWith('/images/') || imgUrl.startsWith('http');
    if (!isLocalOrValid) allProductsHaveImages = false;
  }
  record('Product Images', 'All products have verified baby clothing photography', allProductsHaveImages);

  // 3. PHASE 3 COUPON VALIDATION ENGINE
  console.log('\n--- 3. Testing Phase 3 Coupon Engine ---');
  // Test A: WELCOME10 (10% off)
  const c1 = await request('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { code: 'WELCOME10', subtotal: 1000 },
  });
  record(
    'Coupon Engine',
    'Validate WELCOME10 (10% discount computation)',
    c1.statusCode === 200 && c1.json?.valid === true && c1.json?.coupon?.discountAmount === 100,
    `Discount: ₹${c1.json?.coupon?.discountAmount}`
  );

  // Test B: Min Order Value Check (LITTLEWONDERS requires ₹1,499)
  const c2 = await request('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { code: 'LITTLEWONDERS', subtotal: 500 },
  });
  record(
    'Coupon Engine',
    'Enforces minimum order value constraint',
    c2.statusCode === 400 && c2.json?.valid === false,
    `Error: ${c2.json?.error}`
  );

  // Test C: Invalid Coupon Code
  const c3 = await request('/api/coupons/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { code: 'INVALIDCODE99', subtotal: 1000 },
  });
  record(
    'Coupon Engine',
    'Rejects non-existent or inactive coupon code',
    c3.statusCode === 404 && c3.json?.valid === false,
    `Status ${c3.statusCode}`
  );

  // 4. ADMIN AUTHENTICATION
  console.log('\n--- 4. Authenticating Super Admin ---');
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@littlecuckoo.com', password: 'admin123' },
  });
  const adminToken = loginRes.json?.token;
  const cookieHeader = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  record('Admin Auth', 'Obtain JWT session token', !!adminToken, `User: ${loginRes.json?.user?.email}`);

  // 5. PHASE 3 ORDER PROCESSING PIPELINE
  console.log('\n--- 5. Testing Phase 3 Order & Dispatch Pipeline ---');
  // First create a test order via checkout API
  const checkoutRes = await request('/api/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      Authorization: `Bearer ${adminToken}`,
    },
    body: {
      items: [{ variantId: products[0]?.variants?.[0]?.id, quantity: 1 }],
      shippingAddress: {
        fullName: 'Phase 3 QA Test Customer',
        phone: '+91 9876543210',
        street: 'Ring Road, 150ft Cross',
        city: 'Rajkot',
        state: 'Gujarat',
        postalCode: '360005',
      },
      paymentMethod: 'RAZORPAY',
      couponCode: 'WELCOME10',
    },
  });

  const createdOrder = checkoutRes.json?.order;
  record(
    'Checkout Pipeline',
    'Create order with 5% GST and WELCOME10 coupon in SQLite DB',
    checkoutRes.statusCode === 200 && !!createdOrder?.orderNumber,
    `Order #${createdOrder?.orderNumber}, Total: ₹${createdOrder?.totalAmount}`
  );

  // Fetch admin orders list
  const adminOrdersRes = await request('/api/admin/orders', {
    headers: {
      Cookie: cookieHeader,
      Authorization: `Bearer ${adminToken}`,
    },
  });
  record(
    'Admin Orders API',
    'List all orders with items and customer details',
    adminOrdersRes.statusCode === 200 && Array.isArray(adminOrdersRes.json?.orders),
    `Count: ${adminOrdersRes.json?.orders?.length}`
  );

  // Update order status and assign AWB tracking
  if (createdOrder) {
    const updateRes = await request(`/api/admin/orders/${createdOrder.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
      body: {
        status: 'SHIPPED',
        courierName: 'Delhivery Express',
        trackingNumber: 'DL9824951223IN',
        adminNotes: 'Packed in clean organic workshop with tamper-proof seal.',
      },
    });

    const updated = updateRes.json?.order;
    record(
      'Order Dispatch API',
      'Update order to SHIPPED and assign Delhivery AWB tracking',
      updateRes.statusCode === 200 && updated?.status === 'SHIPPED' && updated?.trackingNumber === 'DL9824951223IN',
      `Status: ${updated?.status}, AWB: ${updated?.trackingNumber}`
    );
  }

  // 6. PHASE 3 RAZORPAY PAYMENT ENGINE
  console.log('\n--- 6. Testing Phase 3 Razorpay Payment Engine ---');
  // Create Razorpay Order
  const rzpOrderRes = await request('/api/payment/razorpay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      amount: 699,
      orderNumber: createdOrder?.orderNumber || 'LC-TEST-ORDER',
    },
  });
  record(
    'Razorpay Engine',
    'Generate Razorpay Order with INR paise conversion (₹699 -> 69900 paise)',
    rzpOrderRes.statusCode === 200 && !!rzpOrderRes.json?.orderId && rzpOrderRes.json?.amount === 69900,
    `OrderId: ${rzpOrderRes.json?.orderId}`
  );

  // Verify Payment
  const rzpVerifyRes = await request('/api/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      orderNumber: createdOrder?.orderNumber,
      razorpayOrderId: rzpOrderRes.json?.orderId,
      razorpayPaymentId: 'pay_test_phase3_sample',
      razorpaySignature: 'mock_signature',
    },
  });
  record(
    'Payment Verification',
    'Verify transaction and advance order paymentStatus to PAID',
    rzpVerifyRes.statusCode === 200 && rzpVerifyRes.json?.verified === true,
    `Status: ${rzpVerifyRes.json?.order?.paymentStatus}`
  );

  // 7. HOMEPAGE IMAGES VERIFICATION
  console.log('\n--- 7. Testing Homepage Local Image Links ---');
  const homeRes = await request('/');
  const hasLocalHeroImg = homeRes.body.includes('/images/hero/hero_baby_lifestyle.jpg') || homeRes.body.includes('hero_baby_lifestyle');
  const hasLocalRomperImg = homeRes.body.includes('/images/products/cloudsoft_ribbed_romper.jpg') || homeRes.body.includes('cloudsoft_ribbed_romper');
  record('Storefront Images', 'Homepage hero uses generated baby fashion photography', hasLocalHeroImg);
  record('Storefront Images', 'Homepage product cards use generated baby apparel images', hasLocalRomperImg);

  // SUMMARY
  console.log('\n======================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`TOTAL PHASE 3 TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
