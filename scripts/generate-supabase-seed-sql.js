const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sqlite_dump.json'), 'utf8'));

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val;
  if (val instanceof Date) return `'${val.toISOString()}'`;
  // string: escape single quote with two single quotes
  return `'${String(val).replace(/'/g, "''")}'`;
}

function dateEsc(val) {
  if (!val) return 'NOW()';
  return `'${new Date(val).toISOString()}'`;
}

const lines = [];

// 1. Users
lines.push('-- Users');
for (const u of data.users) {
  lines.push(`INSERT INTO "users" ("id", "email", "passwordHash", "name", "phone", "role", "isActive", "createdAt", "updatedAt") VALUES (${esc(u.id)}, ${esc(u.email)}, ${esc(u.passwordHash)}, ${esc(u.name)}, ${esc(u.phone)}, ${esc(u.role)}, ${esc(u.isActive)}, ${dateEsc(u.createdAt)}, ${dateEsc(u.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 2. Addresses
lines.push('\n-- Addresses');
for (const a of data.addresses) {
  lines.push(`INSERT INTO "addresses" ("id", "user_id", "full_name", "phone", "street", "apartment", "city", "state", "postal_code", "country", "is_default", "type", "created_at", "updated_at") VALUES (${esc(a.id)}, ${esc(a.userId)}, ${esc(a.fullName)}, ${esc(a.phone)}, ${esc(a.street)}, ${esc(a.apartment)}, ${esc(a.city)}, ${esc(a.state)}, ${esc(a.postalCode)}, ${esc(a.country)}, ${esc(a.isDefault)}, ${esc(a.type)}, ${dateEsc(a.createdAt)}, ${dateEsc(a.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 3. Categories
lines.push('\n-- Categories');
for (const c of data.categories) {
  lines.push(`INSERT INTO "categories" ("id", "name", "slug", "description", "image_url", "banner_url", "parent_id", "sort_order", "is_active", "created_at", "updated_at") VALUES (${esc(c.id)}, ${esc(c.name)}, ${esc(c.slug)}, ${esc(c.description)}, ${esc(c.imageUrl)}, ${esc(c.bannerUrl)}, ${esc(c.parentId)}, ${esc(c.sortOrder)}, ${esc(c.isActive)}, ${dateEsc(c.createdAt)}, ${dateEsc(c.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 4. Products
lines.push('\n-- Products');
for (const p of data.products) {
  lines.push(`INSERT INTO "products" ("id", "title", "slug", "sku", "description", "short_description", "fabric_details", "care_instructions", "age_group", "gender", "regular_price", "sale_price", "is_featured", "is_new_arrival", "is_best_seller", "status", "hsn_code", "tax_percent", "rating", "review_count", "flipkart_url", "flipkart_listing_label", "flipkart_last_verified_at", "created_at", "updated_at", "category_id") VALUES (${esc(p.id)}, ${esc(p.title)}, ${esc(p.slug)}, ${esc(p.sku)}, ${esc(p.description)}, ${esc(p.shortDescription)}, ${esc(p.fabricDetails)}, ${esc(p.careInstructions)}, ${esc(p.ageGroup)}, ${esc(p.gender)}, ${esc(p.regularPrice)}, ${esc(p.salePrice)}, ${esc(p.isFeatured)}, ${esc(p.isNewArrival)}, ${esc(p.isBestSeller)}, ${esc(p.status)}, ${esc(p.hsnCode)}, ${esc(p.taxPercent)}, ${esc(p.rating)}, ${esc(p.reviewCount)}, ${esc(p.flipkartUrl)}, ${esc(p.flipkartListingLabel)}, ${p.flipkartLastVerifiedAt ? dateEsc(p.flipkartLastVerifiedAt) : 'NULL'}, ${dateEsc(p.createdAt)}, ${dateEsc(p.updatedAt)}, ${esc(p.categoryId)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 5. Product Images
lines.push('\n-- Product Images');
for (const img of data.productImages) {
  lines.push(`INSERT INTO "product_images" ("id", "product_id", "url", "alt_text", "is_primary", "sort_order", "created_at") VALUES (${esc(img.id)}, ${esc(img.productId)}, ${esc(img.url)}, ${esc(img.altText)}, ${esc(img.isPrimary)}, ${esc(img.sortOrder)}, ${dateEsc(img.createdAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 6. Product Variants
lines.push('\n-- Product Variants');
for (const v of data.productVariants) {
  lines.push(`INSERT INTO "product_variants" ("id", "product_id", "sku", "size", "color_name", "color_hex", "stock", "low_stock_threshold", "price_adjustment", "created_at", "updated_at") VALUES (${esc(v.id)}, ${esc(v.productId)}, ${esc(v.sku)}, ${esc(v.size)}, ${esc(v.colorName)}, ${esc(v.colorHex)}, ${esc(v.stock)}, ${esc(v.lowStockThreshold)}, ${esc(v.priceAdjustment)}, ${dateEsc(v.createdAt)}, ${dateEsc(v.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 7. CMS Sections
lines.push('\n-- CMS Sections');
for (const s of data.cmsSections) {
  lines.push(`INSERT INTO "cms_sections" ("id", "section_key", "title", "subtitle", "content", "cta_text", "cta_link", "image_url", "extra_data", "sort_order", "is_enabled", "updated_at") VALUES (${esc(s.id)}, ${esc(s.sectionKey)}, ${esc(s.title)}, ${esc(s.subtitle)}, ${esc(s.content)}, ${esc(s.ctaText)}, ${esc(s.ctaLink)}, ${esc(s.imageUrl)}, ${esc(s.extraData)}, ${esc(s.sortOrder)}, ${esc(s.isEnabled)}, ${dateEsc(s.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

// 8. Reviews
lines.push('\n-- Reviews');
for (const r of data.reviews) {
  lines.push(`INSERT INTO "reviews" ("id", "product_id", "user_id", "customer_name", "rating", "title", "comment", "is_verified", "is_approved", "created_at", "updated_at") VALUES (${esc(r.id)}, ${esc(r.productId)}, ${esc(r.userId)}, ${esc(r.customerName)}, ${esc(r.rating)}, ${esc(r.title)}, ${esc(r.comment)}, ${esc(r.isVerified)}, ${esc(r.isApproved)}, ${dateEsc(r.createdAt)}, ${dateEsc(r.updatedAt)}) ON CONFLICT ("id") DO NOTHING;`);
}

const outPath = path.join(__dirname, 'supabase_seed.sql');
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`Generated SQL seed script at: ${outPath} (${lines.length} statements)`);
