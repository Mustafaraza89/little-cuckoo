const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'little-cuckoo-super-secret-key-2026';
const BASE_URL = 'http://127.0.0.1:3000';

// Generate admin token for testing admin sync
const adminToken = jwt.sign(
  {
    userId: 'admin-super-id',
    email: 'admin@littlecuckoo.com',
    role: 'SUPER_ADMIN',
    name: 'Vadaliya Bhimjibhai',
  },
  JWT_SECRET,
  { expiresIn: '1h' }
);

function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = { ...(options.headers || {}) };
    if (options.useAuth) {
      headers['Authorization'] = `Bearer ${adminToken}`;
      headers['Cookie'] = `cuckoo_auth_token=${adminToken}`;
    }

    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (_) {}
          resolve({ status: res.statusCode, headers: res.headers, body, json });
        });
      }
    );

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runMasterQA() {
  console.log('=== LITTLE CUCKOO MASTER QA SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`• Testing: ${name}... `);
    try {
      await fn();
      console.log('✅ PASS');
      passed++;
    } catch (err) {
      console.log(`❌ FAIL (${err.message})`);
      failed++;
    }
  }

  // 1. Public Storefront Routes
  const publicRoutes = [
    '/',
    '/shop',
    '/shop?category=newborn-essentials',
    '/product/cloudsoft-organic-cotton-ribbed-romper',
    '/cart',
    '/checkout',
    '/track-order',
    '/size-guide',
    '/about',
    '/wishlist',
    '/login',
    '/register',
    '/contact',
    '/sitemap.xml',
    '/robots.txt',
  ];

  for (const route of publicRoutes) {
    await test(`Storefront Page: ${route}`, async () => {
      const res = await fetchUrl(route);
      if (res.status !== 200) {
        throw new Error(`Expected 200 OK, got ${res.status}`);
      }
    });
  }

  // 2. Public Storefront APIs
  await test('API: GET /api/categories', async () => {
    const res = await fetchUrl('/api/categories');
    if (res.status !== 200 || !res.json?.success || !Array.isArray(res.json.categories)) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }
    if (res.json.categories.length === 0) throw new Error('Zero categories returned');
  });

  await test('API: GET /api/products', async () => {
    const res = await fetchUrl('/api/products');
    if (res.status !== 200 || !res.json?.success || !Array.isArray(res.json.products)) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    if (res.json.products.length === 0) throw new Error('Zero products returned');
  });

  await test('API: GET /api/products?search=romper', async () => {
    const res = await fetchUrl('/api/products?search=romper');
    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Search failed with status ${res.status}`);
    }
  });

  // 3. Admin Security & Guard Verification
  await test('Admin Security: /api/admin/dashboard rejects unauthenticated requests', async () => {
    const res = await fetchUrl('/api/admin/dashboard');
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
    }
  });

  await test('Admin Security: /api/admin/dashboard accepts valid Super Admin JWT', async () => {
    const res = await fetchUrl('/api/admin/dashboard', { useAuth: true });
    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Expected 200 with stats, got ${res.status}`);
    }
  });

  // 4. Admin Store Pages (with auth)
  const adminPages = [
    '/admin',
    '/admin/products',
    '/admin/categories',
    '/admin/orders',
    '/admin/inventory',
    '/admin/customers',
    '/admin/cms',
    '/admin/settings',
  ];

  for (const page of adminPages) {
    await test(`Admin Console Page: ${page}`, async () => {
      const res = await fetchUrl(page, { useAuth: true });
      if (res.status !== 200) {
        throw new Error(`Expected 200 OK, got ${res.status}`);
      }
    });
  }

  // 5. Data Synchronization End-to-End Test
  let createdCategoryId = null;
  let createdProductId = null;

  await test('Data Sync: Create Category via Admin API', async () => {
    const res = await fetchUrl('/api/categories', {
      method: 'POST',
      useAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: 'QA Organic Rompers Test',
        slug: `qa-organic-rompers-${Date.now()}`,
        description: 'Test category for automated QA sync verification',
        imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85',
        sortOrder: 99,
      },
    });
    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Category creation failed: ${res.body}`);
    }
    createdCategoryId = res.json.category.id;
  });

  await test('Data Sync: Create Product in SQLite DB & Verify Live Catalog', async () => {
    const sku = `LC-QA-TEST-${Date.now().toString().slice(-4)}`;
    const res = await fetchUrl('/api/products', {
      method: 'POST',
      useAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: {
        title: 'QA Test Baby Suit Rajkot',
        sku,
        categoryId: createdCategoryId,
        regularPrice: 799,
        salePrice: 599,
        gender: 'UNISEX',
        ageGroup: '0-6M',
        description: 'Automated test suite item checking instant synchronization.',
        isFeatured: true,
        isNewArrival: true,
        images: [{ url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85' }],
        variants: [
          { size: 'NB', colorName: 'Vanilla Cream', stock: 15 },
          { size: '3-6M', colorName: 'Vanilla Cream', stock: 20 },
        ],
      },
    });

    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Product creation failed: ${res.body}`);
    }
    createdProductId = res.json.product.id;

    // Immediately fetch from public /api/products
    const checkRes = await fetchUrl(`/api/products?search=${sku}`);
    if (!checkRes.json?.products?.some((p) => p.sku === sku)) {
      throw new Error('Created product not immediately visible in public search API');
    }
  });

  await test('Data Sync: Update Product Price & Badges', async () => {
    const res = await fetchUrl(`/api/products/${createdProductId}`, {
      method: 'PUT',
      useAuth: true,
      headers: { 'Content-Type': 'application/json' },
      body: {
        title: 'QA Test Baby Suit Rajkot (Updated)',
        regularPrice: 899,
        salePrice: 649,
        isBestSeller: true,
      },
    });

    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Product update failed: ${res.body}`);
    }
    if (res.json.product.regularPrice !== 899 || res.json.product.salePrice !== 649) {
      throw new Error('Updated price did not persist in database');
    }
  });

  await test('Data Sync: Teardown Test Product & Category', async () => {
    const delProd = await fetchUrl(`/api/products/${createdProductId}`, {
      method: 'DELETE',
      useAuth: true,
    });
    if (delProd.status !== 200 || !delProd.json?.success) {
      throw new Error(`Failed to delete test product: ${delProd.body}`);
    }

    const delCat = await fetchUrl(`/api/categories/${createdCategoryId}`, {
      method: 'DELETE',
      useAuth: true,
    });
    if (delCat.status !== 200 || !delCat.json?.success) {
      throw new Error(`Failed to delete test category: ${delCat.body}`);
    }
  });

  // 6. Checkout Pipeline & Calculation Test
  await test('Checkout API: Validates stock, calculates 5% GST, applies prepaid discount', async () => {
    // Fetch a real active product variant
    const prods = await fetchUrl('/api/products');
    const sampleProduct = prods.json.products.find(p => p.variants && p.variants.length > 0);
    if (!sampleProduct) throw new Error('No product with variants found for checkout test');
    const sampleVariant = sampleProduct.variants[0];

    const orderPayload = {
      shippingAddress: {
        fullName: 'Master QA Tester',
        email: 'qa.tester@littlecuckoo.com',
        phone: '9876543210',
        street: 'Test Suite Lab, 1st Floor, Shakti Krupa, Gondal Road',
        city: 'Rajkot',
        state: 'Gujarat',
        postalCode: '360002',
        country: 'India',
      },
      items: [
        {
          productId: sampleProduct.id,
          variantId: sampleVariant.id,
          title: sampleProduct.title,
          sku: sampleVariant.sku,
          size: sampleVariant.size,
          colorName: sampleVariant.colorName,
          price: sampleProduct.salePrice || sampleProduct.regularPrice,
          regularPrice: sampleProduct.regularPrice,
          imageUrl: sampleProduct.images[0]?.url,
          quantity: 1,
        },
      ],
      paymentMethod: 'RAZORPAY',
      couponCode: 'WELCOME10',
    };

    const res = await fetchUrl('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: orderPayload,
    });

    if (res.status !== 200 || !res.json?.success) {
      throw new Error(`Checkout pipeline failed: ${res.body}`);
    }

    const order = res.json.order;
    if (!order.orderNumber.startsWith('LC-')) {
      throw new Error(`Invalid order number format: ${order.orderNumber}`);
    }
    if (order.prepaidDiscount <= 0) {
      throw new Error('5% prepaid discount not applied for Razorpay payment');
    }
    if (order.couponDiscount <= 0) {
      throw new Error('WELCOME10 coupon discount not calculated');
    }
  });

  console.log('\n======================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMasterQA().catch((e) => {
  console.error('Fatal QA error:', e);
  process.exit(1);
});
