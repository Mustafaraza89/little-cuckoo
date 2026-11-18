const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://umohaykjkpyshlrcdeqx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtb2hheWtqa3B5c2hscmNkZXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5OTMxNTMsImV4cCI6MjExMDU2OTE1M30.36H1ZeGUcYtXGygwXkdYJCFzoXfyi96hxI-wYdwGLF4';

const filesToUpload = [
  {
    local: path.join(__dirname, '..', 'public', 'images', 'products', 'buttercup_zip_sleepsuit.jpg'),
    remote: 'products/buttercup_zip_sleepsuit.jpg',
    contentType: 'image/jpeg'
  },
  {
    local: path.join(__dirname, '..', 'public', 'images', 'products', 'cloudsoft_ribbed_romper.jpg'),
    remote: 'products/cloudsoft_ribbed_romper.jpg',
    contentType: 'image/jpeg'
  },
  {
    local: path.join(__dirname, '..', 'public', 'images', 'products', 'heirloom_baby_dress.jpg'),
    remote: 'products/heirloom_baby_dress.jpg',
    contentType: 'image/jpeg'
  },
  {
    local: path.join(__dirname, '..', 'public', 'images', 'products', 'muslin_swaddle_duo.jpg'),
    remote: 'products/muslin_swaddle_duo.jpg',
    contentType: 'image/jpeg'
  },
  {
    local: path.join(__dirname, '..', 'public', 'images', 'products', 'newborn_welcome_gift_set.jpg'),
    remote: 'products/newborn_welcome_gift_set.jpg',
    contentType: 'image/jpeg'
  },
  {
    local: path.join(__dirname, '..', 'public', 'images', 'hero', 'hero_baby_lifestyle.jpg'),
    remote: 'hero/hero_baby_lifestyle.jpg',
    contentType: 'image/jpeg'
  }
];

async function uploadAll() {
  for (const item of filesToUpload) {
    if (!fs.existsSync(item.local)) {
      console.warn(`File not found: ${item.local}`);
      continue;
    }
    const fileBuffer = fs.readFileSync(item.local);
    const url = `${SUPABASE_URL}/storage/v1/object/product-media/${item.remote}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': item.contentType,
        'x-upsert': 'true'
      },
      body: fileBuffer
    });

    if (res.ok) {
      console.log(`Successfully uploaded: ${item.remote} -> ${SUPABASE_URL}/storage/v1/object/public/product-media/${item.remote}`);
    } else {
      const errText = await res.text();
      console.error(`Failed ${item.remote} (${res.status}): ${errText}`);
    }
  }
}

uploadAll().catch(console.error);
