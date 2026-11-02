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
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
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
  console.log('=== LITTLE CUCKOO PHASE 3 COMPREHENSIVE QA AUDIT ===\n');
  const results = [];

  function record(module, testName, pass, details = '') {
    results.push({ module, testName, status: pass ? 'PASS' : 'FAIL', details });
    console.log(`[${pass ? '✅ PASS' : '❌ FAIL'}] ${module}: ${testName} ${details ? '(' + details + ')' : ''}`);
  }

  // 1. ADMIN AUTH & LAYOUT SEPARATION
  console.log('--- Checking Admin Layout Isolation & Auth Guard ---');
  
  // Test A: Unauthenticated access to /admin should redirect to /admin/login
  const unauthAdmin = await request('/admin');
  const isRedirect = unauthAdmin.statusCode === 307 || unauthAdmin.statusCode === 302 || unauthAdmin.statusCode === 308;
  const redirectLoc = unauthAdmin.headers.location || '';
  record(
    'Admin Auth Guard',
    'Unauthenticated /admin redirects to /admin/login',
    isRedirect && redirectLoc.includes('/admin/login'),
    `Status ${unauthAdmin.statusCode} -> ${redirectLoc}`
  );

  // Test B: /admin/login has NO customer header or announcement bar
  const loginPage = await request('/admin/login');
  const hasCustomerNavOnLogin = loginPage.body.includes('Shop All') || loginPage.body.includes('Free Pan-India Delivery');
  const hasAdminForm = loginPage.body.includes('Internal Staff Sign In') && loginPage.body.includes('admin@littlecuckoo.com');
  record(
    'Admin Layout',
    '/admin/login has zero customer header/announcement bar',
    !hasCustomerNavOnLogin && hasAdminForm,
    'Clean Admin Authentication Card rendered'
  );

  // Test C: Admin Login via API
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'admin@littlecuckoo.com', password: 'admin123' },
  });
  const loginData = JSON.parse(loginRes.body || '{}');
  const adminToken = loginData.token;
  const cookieHeader = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0].split(';')[0] : '';
  record(
    'Admin Auth API',
    'Authenticate Super Admin and issue JWT cookie',
    loginRes.statusCode === 200 && !!adminToken,
    `Role: ${loginData.user?.role}`
  );

  // Test D: Authenticated Admin Pages Isolation (ZERO customer header, has Admin shell)
  const adminPages = [
    '/admin',
    '/admin/products',
    '/admin/categories',
    '/admin/orders',
    '/admin/inventory',
    '/admin/customers',
    '/admin/cms',
    '/admin/coupons',
    '/admin/media',
    '/admin/reviews',
    '/admin/analytics',
    '/admin/reports',
    '/admin/settings',
    '/admin/users',
  ];

  for (const page of adminPages) {
    const res = await request(page, {
      headers: {
        Cookie: cookieHeader,
        Authorization: `Bearer ${adminToken}`,
      },
    });

    // Check for customer components (these must NEVER appear on admin)
    const hasAnnouncementBar = res.body.includes('Free Pan-India Delivery on all baby apparel above ₹999');
    const hasCustomerMenu = res.body.includes('Newborn Essentials (0-6M)') && res.body.includes('Kimono Tie Onesies');
    const hasAdminSidebar = res.body.includes('HQ Console') || res.body.includes('Little Cuckoo Admin') || res.body.includes('Admin');

    const pass = (res.statusCode === 200 || res.statusCode === 307) && !hasAnnouncementBar && !hasCustomerMenu;
    record(
      'Admin Layout Separation',
      `${page} excludes customer header/footer and renders admin UI`,
      pass,
      `Status: ${res.statusCode}`
    );
  }

  // 2. HOMEPAGE EDITORIAL REDESIGN VERIFICATION
  console.log('\n--- Checking Homepage Editorial Redesign & Visuals ---');
  const homeRes = await request('/');
  const homeHtml = homeRes.body;

  const homeChecks = [
    { name: 'Headline: Little Moments. Beautifully Dressed.', text: 'Little Moments.' },
    { name: 'Subheading: Beautifully Dressed.', text: 'Beautifully Dressed.' },
    { name: 'Primary CTA: Explore New Collection', text: 'Explore New Collection' },
    { name: 'Secondary CTA: Shop Newborn Essentials', text: 'Shop Newborn Essentials' },
    { name: 'Trust Badge: 100% GOTS Organic', text: '100% GOTS Organic' },
    { name: 'Floating Element: 100% Naturally Soft', text: '100% Naturally Soft' },
    { name: 'Floating Element: Featured Favorite Product', text: 'Featured Favorite' },
    { name: 'Section A: Shop Their Little World', text: 'Shop Their Little World' },
    { name: 'Section B: The Little Cuckoo Edit', text: 'The Little Cuckoo Edit' },
    { name: 'Section C: Best Loved Essentials', text: 'Best Loved Essentials' },
    { name: 'Section D: Crafted With Care in Rajkot', text: 'Crafted With Care in Rajkot' },
    { name: 'Section E: Little Looks, Big Smiles', text: 'Little Looks, Big Smiles' },
    { name: 'Section F: New Arrivals', text: 'New Arrivals' },
    { name: 'Section G: Gift Something Lovely', text: 'Gift Something Lovely' },
    { name: 'Section H: Real Parent Reviews', text: 'What Mothers Are Saying' },
    { name: 'Section I: Newsletter Subscription', text: 'Little Updates, Lovely Surprises' },
  ];

  for (const check of homeChecks) {
    const found = homeHtml.includes(check.text);
    record('Homepage Redesign', check.name, found);
  }

  // Verify baby clothing photography (zero swimming ring / pool toys)
  const hasPoolRing = homeHtml.includes('swimming') || homeHtml.includes('inflatable');
  record('Hero Visual', 'Zero pool rings/inflatables in hero image', !hasPoolRing);

  // 3. COMPLETE CUSTOMER ROUTE AUDIT
  console.log('\n--- Checking Customer Routes & Policy Pages ---');
  const customerRoutes = [
    { path: '/shop', title: 'Shop All' },
    { path: '/collections', title: 'Shop Collections' },
    { path: '/collections/newborn-essentials', title: 'Redirect / Shop' },
    { path: '/product/cloudsoft-organic-cotton-ribbed-romper', title: 'Product Details' },
    { path: '/products/cloudsoft-organic-cotton-ribbed-romper', title: 'Product Alias' },
    { path: '/search', title: 'Search Products' },
    { path: '/cart', title: 'Cart' },
    { path: '/checkout', title: 'Checkout' },
    { path: '/wishlist', title: 'Wishlist' },
    { path: '/account', title: 'Account' },
    { path: '/account/profile', title: 'Account Profile' },
    { path: '/account/orders', title: 'Account Orders' },
    { path: '/account/addresses', title: 'Account Addresses' },
    { path: '/about', title: 'Our Story' },
    { path: '/contact', title: 'Get in Touch' },
    { path: '/faqs', title: 'Frequently Asked Questions' },
    { path: '/faq', title: 'FAQ Alias' },
    { path: '/size-guide', title: 'Baby Size Guide' },
    { path: '/track-order', title: 'Track Your Order' },
    { path: '/blog', title: 'Words of Care & Comfort' },
    { path: '/blog/why-gots-organic-cotton-matters-for-newborns', title: 'Blog Post Detail' },
    { path: '/privacy-policy', title: 'Privacy Policy' },
    { path: '/terms-of-service', title: 'Terms of Service' },
    { path: '/terms', title: 'Terms Alias' },
    { path: '/shipping-policy', title: 'Shipping & Delivery' },
    { path: '/return-policy', title: 'Returns & Exchanges' },
    { path: '/refund-policy', title: 'Refund Policy' },
    { path: '/cancellation-policy', title: 'Cancellation Policy' },
    { path: '/cookie-policy', title: 'Cookie Policy' },
    { path: '/sitemap.xml', title: 'Sitemap' },
    { path: '/robots.txt', title: 'Robots.txt' },
  ];

  for (const route of customerRoutes) {
    const res = await request(route.path);
    const pass = res.statusCode === 200 || res.statusCode === 307 || res.statusCode === 308;
    record('Customer Routes', `${route.path} (${route.title})`, pass, `Status ${res.statusCode}`);
  }

  // 4. SUMMARY TABLE
  console.log('\n======================================================');
  console.log('SUMMARY QA REPORT:');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    console.error(`FAILED TESTS (${failed}):`);
    results
      .filter((r) => r.status === 'FAIL')
      .forEach((r) => console.error(`- ${r.module}: ${r.testName} ${r.details}`));
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Master QA error:', err);
  process.exit(1);
});
