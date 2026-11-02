const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Little Cuckoo database...');

  // 1. Clear existing data in correct order
  await prisma.auditLog.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryTransaction.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.cMSSection.deleteMany();
  await prisma.websiteSetting.deleteMany();
  await prisma.user.deleteMany();

  console.log('Existing tables cleared.');

  // 2. Create Users
  const adminHash = await bcrypt.hash('Admin@LittleCuckoo2026', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@littlecuckoo.com',
      passwordHash: adminHash,
      name: 'Vadaliya Bhimjibhai',
      phone: '+91 9824951223',
      role: 'SUPER_ADMIN',
    },
  });

  const managerHash = await bcrypt.hash('Manager@Cuckoo2026', 10);
  await prisma.user.create({
    data: {
      email: 'manager@littlecuckoo.com',
      passwordHash: managerHash,
      name: 'Pooja Sharma',
      phone: '+91 9824951224',
      role: 'PRODUCT_MANAGER',
    },
  });

  const customerHash = await bcrypt.hash('Parent@Cuckoo2026', 10);
  const customer = await prisma.user.create({
    data: {
      email: 'priya.patel@example.com',
      passwordHash: customerHash,
      name: 'Priya Patel',
      phone: '+91 9876543210',
      role: 'CUSTOMER',
      addresses: {
        create: [
          {
            fullName: 'Priya Patel',
            phone: '+91 9876543210',
            street: '402, Shivalik Heights, 150 Feet Ring Road',
            apartment: 'Opp. Imperial Palace',
            city: 'Rajkot',
            state: 'Gujarat',
            postalCode: '360005',
            country: 'India',
            isDefault: true,
            type: 'SHIPPING',
          },
        ],
      },
    },
  });

  console.log('Users created.');

  // 3. Categories
  const catRompers = await prisma.category.create({
    data: {
      name: 'Organic Rompers & Bodysuits',
      slug: 'rompers-and-bodysuits',
      description: 'Super-soft 100% GOTS organic cotton one-pieces with two-way zips and nickel-free snaps.',
      imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 1,
    },
  });

  const catSleepwear = await prisma.category.create({
    data: {
      name: 'Sleepwear & Swaddles',
      slug: 'sleepwear-and-swaddles',
      description: 'Dreamy bedtime essentials crafted from breathable organic cotton for restful sleep.',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 2,
    },
  });

  const catDresses = await prisma.category.create({
    data: {
      name: 'Baby Dresses & Sets',
      slug: 'dresses-and-sets',
      description: 'Charming pastel frocks, coordinated two-piece sets, and delicate bloomers.',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 3,
    },
  });

  const catNewborn = await prisma.category.create({
    data: {
      name: 'Newborn Essentials',
      slug: 'newborn-essentials',
      description: 'Ultra-gentle flat-seam essentials designed specifically for delicate newborn skin (0-3M).',
      imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 4,
    },
  });

  const catGifts = await prisma.category.create({
    data: {
      name: 'Gift Hampers & Bundles',
      slug: 'gift-hampers-and-bundles',
      description: 'Thoughtfully curated luxury baby shower gift boxes with keepsake boxes and greeting cards.',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 5,
    },
  });

  console.log('Categories created.');

  // 4. Products with Variants and Images
  const productsData = [
    {
      title: 'CloudSoft Organic Cotton Ribbed Romper',
      slug: 'cloudsoft-organic-cotton-ribbed-romper',
      sku: 'LC-RMP-001',
      categoryId: catRompers.id,
      regularPrice: 899,
      salePrice: 699,
      description: 'Crafted from 100% GOTS certified organic ribbed cotton. Features a 2-way YKK zipper for midnight diaper changes with chin-guard protection and fold-over scratch mittens for sizes under 6 months.',
      shortDescription: '100% GOTS organic ribbed cotton with 2-way zip.',
      fabricDetails: '100% GOTS Certified Organic Combed Cotton Rib (210 GSM). Hypoallergenic non-toxic dyes.',
      careInstructions: 'Machine wash delicate at 30°C. Do not bleach. Tumble dry low.',
      ageGroup: '0-24 Months',
      gender: 'UNISEX',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 38,
      images: [
        { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'CloudSoft Romper Strawberry Pink' },
        { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'CloudSoft Romper detail' },
        { url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'CloudSoft Romper fabric texture' },
      ],
      variants: [
        { size: '0-3M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 24, sku: 'LC-RMP-001-SP-03' },
        { size: '3-6M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 18, sku: 'LC-RMP-001-SP-36' },
        { size: '6-12M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 15, sku: 'LC-RMP-001-SP-612' },
        { size: '0-3M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 30, sku: 'LC-RMP-001-VC-03' },
        { size: '3-6M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 20, sku: 'LC-RMP-001-VC-36' },
        { size: '0-3M', colorName: 'Baby Blue', colorHex: '#3689BA', stock: 25, sku: 'LC-RMP-001-BB-03' },
        { size: '3-6M', colorName: 'Baby Blue', colorHex: '#3689BA', stock: 16, sku: 'LC-RMP-001-BB-36' },
      ],
    },
    {
      title: 'Sweet Dreams Bamboo & Organic Cotton Sleepsuit',
      slug: 'sweet-dreams-bamboo-organic-cotton-sleepsuit',
      sku: 'LC-SLP-002',
      categoryId: catSleepwear.id,
      regularPrice: 1199,
      salePrice: 949,
      description: 'Silky smooth blend of organic bamboo rayon and cotton. Naturally thermal regulating and breathable to keep babies at ideal sleeping temperature all night. Non-slip grips on feet for walkers.',
      shortDescription: 'Thermal regulating bamboo & organic cotton sleepsuit.',
      fabricDetails: '70% Organic Bamboo Rayon, 30% GOTS Organic Cotton (200 GSM).',
      careInstructions: 'Machine wash cool with gentle liquid detergent. Air dry flat.',
      ageGroup: '0-24 Months',
      gender: 'UNISEX',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 42,
      images: [
        { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'Sweet Dreams Sleepsuit Mint' },
        { url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'Sleepsuit folded' },
      ],
      variants: [
        { size: '0-3M', colorName: 'Mint Green', colorHex: '#C8E6D5', stock: 20, sku: 'LC-SLP-002-MG-03' },
        { size: '3-6M', colorName: 'Mint Green', colorHex: '#C8E6D5', stock: 15, sku: 'LC-SLP-002-MG-36' },
        { size: '6-12M', colorName: 'Mint Green', colorHex: '#C8E6D5', stock: 12, sku: 'LC-SLP-002-MG-612' },
        { size: '0-3M', colorName: 'Butter Yellow', colorHex: '#F8E5A6', stock: 18, sku: 'LC-SLP-002-BY-03' },
        { size: '3-6M', colorName: 'Butter Yellow', colorHex: '#F8E5A6', stock: 14, sku: 'LC-SLP-002-BY-36' },
      ],
    },
    {
      title: 'Little Flora Heirloom Embroidered Dress Set',
      slug: 'little-flora-heirloom-embroidered-dress-set',
      sku: 'LC-DRS-003',
      categoryId: catDresses.id,
      regularPrice: 1499,
      salePrice: 1199,
      description: 'A timeless heirloom piece featuring hand-smocked floral embroidery, gentle flutter sleeves, and a matching cotton bloomer. Lined with ultra-soft organic voile for zero irritation.',
      shortDescription: 'Hand-smocked heirloom frock with matching bloomer.',
      fabricDetails: '100% Combed Cotton Voile exterior and lining with cotton embroidery.',
      careInstructions: 'Hand wash recommended or gentle machine cycle in mesh bag.',
      ageGroup: '3-24 Months',
      gender: 'GIRL',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 26,
      images: [
        { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'Little Flora Dress Set' },
        { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'Dress embroidery close-up' },
      ],
      variants: [
        { size: '3-6M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 12, sku: 'LC-DRS-003-SP-36' },
        { size: '6-12M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 14, sku: 'LC-DRS-003-SP-612' },
        { size: '12-18M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 10, sku: 'LC-DRS-003-SP-1218' },
        { size: '3-6M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 15, sku: 'LC-DRS-003-VC-36' },
      ],
    },
    {
      title: 'Newborn Welcome to the World 5-Piece Organic Set',
      slug: 'newborn-welcome-5-piece-organic-set',
      sku: 'LC-NWB-004',
      categoryId: catNewborn.id,
      regularPrice: 1899,
      salePrice: 1499,
      description: 'The definitive hospital-bag essential set. Includes kimono wrap top, footed pant, knot beanie hat, scratch mittens, and a matching muslin swaddle. Kimono tie front avoids pulling over delicate heads.',
      shortDescription: 'Complete 5-piece newborn hospital kit in organic cotton.',
      fabricDetails: '100% GOTS Certified Interlock Organic Cotton (190 GSM).',
      careInstructions: 'Machine wash warm, tumble dry low.',
      ageGroup: 'Newborn (0-3M)',
      gender: 'UNISEX',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      rating: 5.0,
      reviewCount: 64,
      images: [
        { url: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'Newborn 5-piece set' },
        { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'Set items flatlay' },
      ],
      variants: [
        { size: 'Newborn', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 35, sku: 'LC-NWB-004-VC-NB' },
        { size: '0-3M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 28, sku: 'LC-NWB-004-VC-03' },
        { size: 'Newborn', colorName: 'Mint Green', colorHex: '#C8E6D5', stock: 22, sku: 'LC-NWB-004-MG-NB' },
        { size: 'Newborn', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 25, sku: 'LC-NWB-004-SP-NB' },
        { size: 'Newborn', colorName: 'Baby Blue', colorHex: '#3689BA', stock: 25, sku: 'LC-NWB-004-BB-NB' },
      ],
    },
    {
      title: 'Little Wonders Luxury Baby Shower Keepsake Hamper',
      slug: 'little-wonders-luxury-baby-shower-keepsake-hamper',
      sku: 'LC-GFT-005',
      categoryId: catGifts.id,
      regularPrice: 2799,
      salePrice: 2299,
      description: 'An unforgettable gift presented in an embossed reusable keepsake storage box with satin ribbon. Contains 2 organic rompers, a hand-crocheted bunny rattle, soft swaddle blanket, and a personalized welcome card.',
      shortDescription: 'Luxury keepsake gift hamper with rompers and crochet rattle.',
      fabricDetails: '100% GOTS Organic Cotton garments with natural beechwood & cotton toy.',
      careInstructions: 'Spot clean toy, garments machine wash.',
      ageGroup: '0-6 Months',
      gender: 'UNISEX',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 19,
      images: [
        { url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'Luxury Keepsake Hamper' },
        { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=85', isPrimary: false, altText: 'Hamper unboxed' },
      ],
      variants: [
        { size: '0-3M', colorName: 'Vanilla Cream', colorHex: '#FFF8ED', stock: 15, sku: 'LC-GFT-005-VC-03' },
        { size: '0-3M', colorName: 'Strawberry Pink', colorHex: '#F3848F', stock: 12, sku: 'LC-GFT-005-SP-03' },
        { size: '0-3M', colorName: 'Baby Blue', colorHex: '#3689BA', stock: 14, sku: 'LC-GFT-005-BB-03' },
      ],
    },
    {
      title: 'Waffle Knit Organic Loungewear Co-ord Set',
      slug: 'waffle-knit-organic-loungewear-co-ord-set',
      sku: 'LC-TOP-006',
      categoryId: catRompers.id,
      regularPrice: 1099,
      salePrice: 849,
      description: 'Chunky yet breathable waffle knit crewneck top with matching elastic drawstring joggers. Designed for relaxed playtime and casual daytime outings.',
      shortDescription: '2-piece breathable waffle knit top and jogger set.',
      fabricDetails: '100% Organic Waffle Weave Cotton (230 GSM).',
      careInstructions: 'Machine wash gentle. Reshape while damp.',
      ageGroup: '6-24 Months',
      gender: 'UNISEX',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      rating: 4.7,
      reviewCount: 15,
      images: [
        { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=85', isPrimary: true, altText: 'Waffle Knit Co-ord' },
      ],
      variants: [
        { size: '6-12M', colorName: 'Butter Yellow', colorHex: '#F8E5A6', stock: 16, sku: 'LC-TOP-006-BY-612' },
        { size: '12-18M', colorName: 'Butter Yellow', colorHex: '#F8E5A6', stock: 12, sku: 'LC-TOP-006-BY-1218' },
        { size: '18-24M', colorName: 'Butter Yellow', colorHex: '#F8E5A6', stock: 10, sku: 'LC-TOP-006-BY-1824' },
        { size: '6-12M', colorName: 'Baby Blue', colorHex: '#3689BA', stock: 18, sku: 'LC-TOP-006-BB-612' },
      ],
    },
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        shortDescription: p.shortDescription,
        fabricDetails: p.fabricDetails,
        careInstructions: p.careInstructions,
        ageGroup: p.ageGroup,
        gender: p.gender,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        rating: p.rating,
        reviewCount: p.reviewCount,
        categoryId: p.categoryId,
        images: {
          create: p.images.map((img, idx) => ({
            url: img.url,
            altText: img.altText,
            isPrimary: img.isPrimary,
            sortOrder: idx,
          })),
        },
        variants: {
          create: p.variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            colorName: v.colorName,
            colorHex: v.colorHex,
            stock: v.stock,
          })),
        },
      },
    });

    // Add initial inventory transactions for each variant
    const variants = await prisma.productVariant.findMany({ where: { productId: createdProduct.id } });
    for (const v of variants) {
      await prisma.inventoryTransaction.create({
        data: {
          variantId: v.id,
          type: 'RESTOCK',
          quantityChange: v.stock,
          notes: 'Initial production batch from Rajkot factory (Anant Garments)',
        },
      });
    }

    // Add sample reviews
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        customerName: 'Ananya Sharma',
        rating: 5,
        title: 'Heavenly softness for my baby girl!',
        comment: 'Ordered the 0-3M romper. The fabric is unbelievably soft and breathes so well in warm weather. Love the two-way zipper and the ice cream pastel colors!',
        isVerified: true,
        isApproved: true,
      },
    });
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        customerName: 'Rahul Verma',
        rating: 5,
        title: 'Zero rashes, premium packaging.',
        comment: 'So glad I found Little Cuckoo. You can tell immediately it is made from real combed organic cotton. Flat stitching means no marks on babys sensitive skin.',
        isVerified: true,
        isApproved: true,
      },
    });
  }

  console.log('Products, variants, images, and reviews seeded.');

  // 5. Discount Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% discount on first order for new parents',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 499,
        maxDiscount: 300,
        isActive: true,
      },
      {
        code: 'CUCKOO5',
        description: 'Extra 5% instant discount on UPI prepaid payments',
        discountType: 'PERCENTAGE',
        discountValue: 5,
        minOrderValue: 0,
        maxDiscount: 200,
        isActive: true,
      },
      {
        code: 'LITTLEWONDERS',
        description: 'Flat ₹200 off on festive orders above ₹1,499',
        discountType: 'FIXED',
        discountValue: 200,
        minOrderValue: 1499,
        isActive: true,
      },
    ],
  });

  console.log('Coupons created.');

  // 6. Homepage CMS Sections
  const cmsSections = [
    {
      sectionKey: 'announcement',
      title: 'Pan-India Free Shipping',
      subtitle: 'Free Shipping on orders above ₹999 | Extra 5% off on Prepaid UPI orders | 7-day easy exchange',
      isEnabled: true,
    },
    {
      sectionKey: 'hero',
      title: 'Made for Little Wonders',
      subtitle: 'Delicately soft, 100% combed organic cotton baby apparel. Hypoallergenic, kind to sensitive skin, and crafted with conscious love.',
      ctaText: 'Explore Collection',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1600&q=85',
      isEnabled: true,
    },
    {
      sectionKey: 'brandStory',
      title: 'Born from Pure Love in Rajkot',
      subtitle: 'Our In-House Craftsmanship & Promise',
      content: 'At Little Cuckoo, we believe baby clothes should feel like a tender embrace. Manufactured in our own clean textile unit in Rajkot, Gujarat (Anant Garments), every single stitch, nickel-free snap, and organic fiber is inspected by experienced hands. No harmful azo dyes, no scratchy tags, only cloud-like softness for your precious newborn.',
      ctaText: 'Read Our Story',
      ctaLink: '/about',
      imageUrl: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=1000&q=85',
      isEnabled: true,
    },
  ];

  for (const s of cmsSections) {
    await prisma.cMSSection.create({ data: s });
  }

  // 7. Website Settings
  const settings = [
    { key: 'STORE_NAME', value: 'Little Cuckoo' },
    { key: 'TAGLINE', value: 'Made for Little Wonders' },
    { key: 'LEGAL_ENTITY', value: 'ANANT GARMENTS' },
    { key: 'GSTIN', value: '24AETPV0153J1Z4' },
    { key: 'UDYAM', value: 'UDYAM-GJ-20-0300095' },
    { key: 'SUPPORT_EMAIL', value: 'Anantnewborn@gmail.com' },
    { key: 'SUPPORT_PHONE', value: '+91 9824951223' },
    { key: 'ADDRESS', value: 'First Floor, Shakti Krupa, Nr. Lathiya Garage, Gondal Road, Rajkot, Gujarat, 360002, India' },
    { key: 'FREE_SHIPPING_THRESHOLD', value: '999' },
    { key: 'STANDARD_SHIPPING_FEE', value: '99' },
    { key: 'PREPAID_DISCOUNT_PERCENT', value: '5' },
    { key: 'CURRENCY_SYMBOL', value: '₹' },
  ];

  for (const st of settings) {
    await prisma.websiteSetting.create({ data: st });
  }

  // 8. Sample Completed Order for Admin analytics verification
  const sampleProduct = await prisma.product.findFirst({ include: { variants: true } });
  if (sampleProduct && sampleProduct.variants.length > 0) {
    const v = sampleProduct.variants[0];
    const order = await prisma.order.create({
      data: {
        orderNumber: 'LC-202611-1001',
        userId: customer.id,
        customerName: 'Priya Patel',
        phone: '+91 9876543210',
        shippingAddress: JSON.stringify({
          fullName: 'Priya Patel',
          phone: '+91 9876543210',
          street: '402, Shivalik Heights, 150 Feet Ring Road',
          city: 'Rajkot',
          state: 'Gujarat',
          postalCode: '360005',
        }),
        subtotal: sampleProduct.salePrice || sampleProduct.regularPrice,
        discount: 0,
        shippingFee: 0,
        taxAmount: Math.round(((sampleProduct.salePrice || sampleProduct.regularPrice) * 0.05) * 100) / 100,
        totalAmount: sampleProduct.salePrice || sampleProduct.regularPrice,
        status: 'DELIVERED',
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'PAID',
        razorpayOrderId: 'order_demo_1001',
        razorpayPaymentId: 'pay_demo_1001',
        trackingNumber: 'DEL184920491',
        courierName: 'Delhivery',
        invoiceNumber: 'INV-2026-0001',
        items: {
          create: [
            {
              productId: sampleProduct.id,
              variantId: v.id,
              productTitle: sampleProduct.title,
              variantTitle: `${v.size} / ${v.colorName}`,
              sku: v.sku,
              unitPrice: sampleProduct.salePrice || sampleProduct.regularPrice,
              quantity: 1,
              totalPrice: sampleProduct.salePrice || sampleProduct.regularPrice,
            },
          ],
        },
      },
    });

    console.log('Sample order seeded:', order.orderNumber);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
