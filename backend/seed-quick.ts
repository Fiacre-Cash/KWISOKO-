import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminHash = await bcrypt.hash('Admin@1234', 10);
  await prisma.user.upsert({
    where: { email: 'admin@kwisoko.rw' },
    update: {},
    create: {
      email: 'admin@kwisoko.rw',
      phone: '+250780000001',
      passwordHash: adminHash,
      firstName: 'Kwisoko',
      lastName: 'Admin',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // Buyer
  const buyerHash = await bcrypt.hash('Buyer@1234', 10);
  await prisma.user.upsert({
    where: { email: 'buyer@kwisoko.rw' },
    update: {},
    create: {
      email: 'buyer@kwisoko.rw',
      phone: '+250780000003',
      passwordHash: buyerHash,
      firstName: 'Alice',
      lastName: 'Uwase',
      role: 'BUYER',
      isVerified: true,
    },
  });

  // Seller user
  const sellerHash = await bcrypt.hash('Seller@1234', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@kwisoko.rw' },
    update: {},
    create: {
      email: 'seller@kwisoko.rw',
      phone: '+250780000002',
      passwordHash: sellerHash,
      firstName: 'Jean',
      lastName: 'Pierre',
      role: 'SELLER',
      isVerified: true,
    },
  });

  // Seller profile
  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      businessName: 'JP Electronics',
      description: 'Quality electronics at fair prices',
      location: 'Kigali, Rwanda',
      status: 'APPROVED',
    },
  });

  // Categories
  const cats = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Garden', slug: 'home-garden' },
    { name: 'Vehicles', slug: 'vehicles' },
    { name: 'Food & Agriculture', slug: 'food-agriculture' },
    { name: 'Services', slug: 'services' },
  ];
  const createdCats: any[] = [];
  for (const cat of cats) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    createdCats.push(c);
  }

  // Demo products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      { sellerId: seller.id, categoryId: createdCats[0].id, title: 'Samsung Galaxy A54', description: 'Brand new Samsung Galaxy A54 5G, 128GB', priceRwf: 450000, priceUsd: 320, stock: 5, location: 'Kigali', status: 'ACTIVE' },
      { sellerId: seller.id, categoryId: createdCats[0].id, title: 'HP Laptop 15 i5', description: 'HP 15-inch laptop, Intel Core i5, 8GB RAM, 256GB SSD', priceRwf: 850000, priceUsd: 600, stock: 3, location: 'Kigali', status: 'ACTIVE' },
      { sellerId: seller.id, categoryId: createdCats[1].id, title: 'Nike Air Max Shoes', description: 'Original Nike Air Max, size 42', priceRwf: 120000, priceUsd: 85, stock: 10, location: 'Kigali', status: 'ACTIVE' },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('Admin:  admin@kwisoko.rw / Admin@1234');
  console.log('Seller: seller@kwisoko.rw / Seller@1234');
  console.log('Buyer:  buyer@kwisoko.rw / Buyer@1234');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
