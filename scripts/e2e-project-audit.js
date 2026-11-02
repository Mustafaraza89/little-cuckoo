const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

function req(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const r = http.request(url, reqOptions, (res) => {
      let data = '';
      let cookies = res.headers['set-cookie'] || [];
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies,
          body: data,
          json,
        });
      });
    });

    r.on('error', reject);
    if (options.body) {
      r.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    r.end();
  });
}

async function run() {
  console.log('=== LITTLE CUCKOO LIVE END-TO-END AUDIT SUITE ===\n');

  let adminCookie = '';

  // 1. Admin Login & Cookie Extraction
  const loginRes = await req('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@littlecuckoo.com', password: 'admin123' },
  });
  
  if (loginRes.cookies.length > 0) {
    adminCookie = loginRes.cookies[0].split(';')[0];
  }
  console.log('1. Admin Auth:', loginRes.status === 200 ? 'PASS (Token Issued)' : 'FAIL');

  // 1b. Fetch real category ID
  const catRes = await req('/api/categories');
  const realCategoryId = catRes.json?.categories?.[0]?.id || 'cmvxn9cf40004ju790po3jz7f';

  // 2. Add New Product via API (Admin)
  const testSku = `TEST-AUDIT-${Date.now().toString().slice(-4)}`;
  const prodRes = await req('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: {
      title: 'Audit Verification Romper',
      slug: `audit-verification-romper-${Date.now()}`,
      sku: testSku,
      categoryId: realCategoryId,
      regularPrice: 799,
      salePrice: 599,
      description: 'Test product created by live audit suite.',
      status: 'PUBLISHED',
      primaryImageUrl: '/images/products/cloudsoft_ribbed_romper.jpg',
      variants: [
        { size: '3-6M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 15, sku: `${testSku}-36M` },
      ],
    },
  });
  const createdProduct = prodRes.json?.product;
  console.log('2. Product Create (Admin):', prodRes.status === 200 && createdProduct?.id ? `PASS (ID: ${createdProduct.id})` : 'FAIL');

  // 3. Storefront Visibility Check
  let storefrontFound = false;
  if (createdProduct?.slug) {
    const storeRes = await req(`/product/${createdProduct.slug}`);
    storefrontFound = storeRes.status === 200 && storeRes.body.includes('Audit Verification Romper');
  }
  console.log('3. Storefront Live Sync:', storefrontFound ? 'PASS (Visible on Storefront)' : 'FAIL');

  // 4. Update Price via API
  let priceUpdated = false;
  if (createdProduct?.id) {
    const updateRes = await req(`/api/products/${createdProduct.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie,
      },
      body: {
        salePrice: 549,
      },
    });
    priceUpdated = updateRes.status === 200 && updateRes.json?.product?.salePrice === 549;
  }
  console.log('4. Price Update & Persistence:', priceUpdated ? 'PASS (Price updated to ₹549)' : 'FAIL');

  // 5. Checkout & Stock Deduction
  let orderCreated = false;
  let stockDecremented = false;
  if (createdProduct?.variants?.[0]?.id) {
    const variantId = createdProduct.variants[0].id;
    const checkoutRes = await req('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        items: [{ variantId, quantity: 2, sku: `${testSku}-36M` }],
        shippingAddress: {
          fullName: 'Audit Tester',
          email: 'audit@example.com',
          phone: '9876543210',
          street: '123 Ring Road',
          city: 'Rajkot',
          postalCode: '360002',
        },
        paymentMethod: 'COD',
      },
    });
    orderCreated = checkoutRes.status === 200 && checkoutRes.json?.orderNumber;

    // Verify stock decremented from 15 to 13
    const checkVariant = await req(`/api/products/${createdProduct.slug}`);
    const v = checkVariant.json?.product?.variants?.find((x) => x.id === variantId);
    stockDecremented = v?.stock === 13;
  }
  console.log('5. Checkout Order Creation:', orderCreated ? 'PASS' : 'FAIL');
  console.log('6. Atomic Inventory Deduction:', stockDecremented ? 'PASS (Stock decremented 15 -> 13)' : 'FAIL');

  // 7. Clean up test product
  if (createdProduct?.id) {
    const delRes = await req(`/api/products/${createdProduct.id}`, {
      method: 'DELETE',
      headers: { Cookie: adminCookie },
    });
    console.log('7. Clean up test product:', delRes.status === 200 ? 'PASS (Deleted)' : 'FAIL');
  }

  // 8. Test All Informational and Legal Routes
  console.log('\n--- Informational & Legal Routes ---');
  const routes = [
    '/', '/shop', '/collections', '/about', '/contact', '/faqs', '/faq',
    '/size-guide', '/track-order', '/blog',
    '/privacy-policy', '/terms-of-service', '/terms',
    '/shipping-policy', '/return-policy', '/refund-policy',
    '/cancellation-policy', '/cookie-policy', '/sitemap.xml', '/robots.txt'
  ];
  let allRoutesPass = true;
  for (const r of routes) {
    const res = await req(r);
    const pass = res.status === 200 || res.status === 307;
    if (!pass) allRoutesPass = false;
    console.log(`Route ${r}: ${res.status} ${pass ? 'OK' : 'ERR'}`);
  }
  console.log('All Public Routes Status:', allRoutesPass ? '100% PASS' : 'FAIL');
}

run().catch((e) => console.error(e));
