const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const addresses = await prisma.address.findMany();
  const categories = await prisma.category.findMany();
  const products = await prisma.product.findMany();
  const productImages = await prisma.productImage.findMany();
  const productVariants = await prisma.productVariant.findMany();
  const cmsSections = await prisma.cMSSection.findMany();
  const reviews = await prisma.review.findMany();

  const dump = {
    users,
    addresses,
    categories,
    products,
    productImages,
    productVariants,
    cmsSections,
    reviews
  };

  fs.writeFileSync(path.join(__dirname, 'sqlite_dump.json'), JSON.stringify(dump, null, 2));
  console.log('Successfully dumped:');
  console.log(`- Users: ${users.length}`);
  console.log(`- Addresses: ${addresses.length}`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Product Images: ${productImages.length}`);
  console.log(`- Product Variants: ${productVariants.length}`);
  console.log(`- CMS Sections: ${cmsSections.length}`);
  console.log(`- Reviews: ${reviews.length}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
