const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:3000';

function request(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
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
  console.log('====================================================');
  console.log('LITTLE CUCKOO — LIFESTYLE & MOBILE CART QA SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`[PASS] ${name} ${details ? '— ' + details : ''}`);
      passed++;
    } else {
      console.log(`[FAIL] ${name} ${details ? '— ' + details : ''}`);
      failed++;
    }
  }

  // TEST 1: HOMEPAGE LIFESTYLE MOMENTS HTML
  console.log('--- TEST 1: Homepage Lifestyle Moments Section ---');
  try {
    const homeRes = await request('/');
    assert('Homepage responds with 200 OK', homeRes.statusCode === 200, `Status: ${homeRes.statusCode}`);
    
    const html = homeRes.body;
    assert('Section title "Little Looks, Big Smiles" present', html.includes('Little Looks, Big Smiles'));
    assert('Subtitle / Eyebrow present', html.includes('LITTLE LOOKS, BIG SMILES') || html.includes('Lifestyle Moments'));
    assert('Shop The Looks link present', html.includes('Shop The Looks'));
    assert('Shop The Look product action CTA present', html.includes('Shop The Look'));
    
    // Check Badges
    assert('Badge "EVERYDAY LITTLE JOYS" present', html.includes('EVERYDAY LITTLE JOYS'));
    assert('Badge "SOFTNESS IN EVERY MOMENT" present', html.includes('SOFTNESS IN EVERY MOMENT'));
    assert('Badge "DREAMY NAPTIMES" present', html.includes('DREAMY NAPTIMES'));
    assert('Badge "MADE WITH LOVE" present', html.includes('MADE WITH LOVE'));
    assert('Badge "PURE ORGANIC GOTS" present', html.includes('PURE ORGANIC GOTS'));

    // Check Image URLs
    assert('Hero baby lifestyle image referenced', html.includes('hero_baby_lifestyle.jpg'));
    assert('Ribbed romper image referenced', html.includes('cloudsoft_ribbed_romper.jpg'));
    assert('Gift set image referenced', html.includes('newborn_welcome_gift_set.jpg'));
    assert('Sleepsuit image referenced', html.includes('buttercup_zip_sleepsuit.jpg'));
    assert('Heirloom dress image referenced', html.includes('heirloom_baby_dress.jpg'));
  } catch (err) {
    assert('Homepage Lifestyle Moments Section', false, err.message);
  }

  // TEST 2: CART DRAWER SOURCE CODE ARCHITECTURE
  console.log('\n--- TEST 2: Cart Drawer Mobile Responsive Architecture ---');
  try {
    const drawerPath = path.join(process.cwd(), 'src', 'components', 'cart', 'CartDrawer.tsx');
    const drawerContent = fs.readFileSync(drawerPath, 'utf8');

    assert('Fixed full viewport height (h-[100dvh])', drawerContent.includes('h-[100dvh]'));
    assert('Max viewport height constraint (max-h-[100dvh])', drawerContent.includes('max-h-[100dvh]'));
    assert('Fixed top header with shrink-0', drawerContent.includes('shrink-0') && drawerContent.includes('Your Shopping Bag'));
    assert('Scrollable item area with min-h-0 and overscroll-contain', drawerContent.includes('flex-1 min-h-0 overflow-y-auto overscroll-contain'));
    assert('Fixed bottom checkout container with shrink-0', drawerContent.includes('shrink-0 bg-white border-t border-cocoa-500/10'));
    assert('Safe area inset bottom applied to footer', drawerContent.includes('pb-[max(1rem,env(safe-area-inset-bottom))]'));
    assert('Full-width accessible checkout CTA button', drawerContent.includes('w-full min-h-[48px]'));
    assert('Strawberry Pink CTA with active states', drawerContent.includes('bg-strawberry-400 hover:bg-strawberry-500 active:bg-strawberry-600'));
    assert('Accessible mobile padding without offscreen offset (pl-0 sm:pl-10)', drawerContent.includes('pl-0 sm:pl-10'));
  } catch (err) {
    assert('Cart Drawer Architecture Verification', false, err.message);
  }

  // TEST 3: TAILWIND ASPECT RATIOS
  console.log('\n--- TEST 3: Tailwind Aspect Ratio Config ---');
  try {
    const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
    const tailwindContent = fs.readFileSync(tailwindPath, 'utf8');
    assert('aspectRatio 4/5 configured', tailwindContent.includes("'4/5': '4 / 5'"));
    assert('aspectRatio 3/4 configured', tailwindContent.includes("'3/4': '3 / 4'"));
    assert('aspectRatio 4/3 configured', tailwindContent.includes("'4/3': '4 / 3'"));
    assert('aspectRatio 16/10 configured', tailwindContent.includes("'16/10': '16 / 10'"));
  } catch (err) {
    assert('Tailwind Aspect Ratio Config', false, err.message);
  }

  // TEST 4: CMS SECTION DB SYNC
  console.log('\n--- TEST 4: SQLite Database CMS Lifestyle Section ---');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const section = await prisma.cMSSection.findUnique({ where: { sectionKey: 'lifestyle' } });
    assert('CMS section "lifestyle" exists in DB', !!section, section ? `Title: ${section.title}` : 'Not found');
    if (section && section.extraData) {
      const items = JSON.parse(section.extraData);
      assert('CMS lifestyle contains 5 looks', Array.isArray(items) && items.length === 5, `Count: ${items.length}`);
    }
    await prisma.$disconnect();
  } catch (err) {
    assert('CMS Section DB Verification', false, err.message);
  }

  // TEST 5: STATIC ASSET ACCESSIBILITY
  console.log('\n--- TEST 5: Static Image HTTP 200 Verification ---');
  const assetPaths = [
    '/images/hero/hero_baby_lifestyle.jpg',
    '/images/products/cloudsoft_ribbed_romper.jpg',
    '/images/products/newborn_welcome_gift_set.jpg',
    '/images/products/buttercup_zip_sleepsuit.jpg',
    '/images/products/muslin_swaddle_duo.jpg',
    '/images/products/heirloom_baby_dress.jpg',
  ];

  for (const p of assetPaths) {
    try {
      const res = await request(p);
      assert(`Static image served: ${p}`, res.statusCode === 200 && res.headers['content-type']?.includes('image'), `Status ${res.statusCode}`);
    } catch (err) {
      assert(`Static image served: ${p}`, false, err.message);
    }
  }

  console.log(`\n====================================================`);
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`====================================================`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error('Test execution failed:', e);
  process.exit(1);
});
