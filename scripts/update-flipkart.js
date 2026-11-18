const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const result = await prisma.product.updateMany({
    where: { sku: 'LC-RMP-001' },
    data: {
      flipkartUrl: 'https://www.flipkart.com/little-cuckoo-cloudsoft-organic-romper',
      flipkartListingLabel: 'Buy on Flipkart',
      flipkartLastVerifiedAt: new Date(),
    },
  });
  console.log('Sample Flipkart URL added to LC-RMP-001:', result);
  await prisma.$disconnect();
}

run().catch(console.error);
