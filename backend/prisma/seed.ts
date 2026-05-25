import { PrismaClient, Role, SellerStatus, ProductStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kwisoko.rw' },
    update: {},
    create: {
      email: 'admin@kwisoko.rw',
      phone: '+250780000001',
      passwordHash: adminPassword,
      firstName: 'Kwisoko',
      lastName: 'Admin',
      role: Role.ADMIN,
      isVerified: true,
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops, gadgets' } }),
    prisma.category.upsert({ where: { slug: 'fashion' }, update: {}, create: { name: 'Fashion', slug: 'fashion', description: 'Clothes, shoes, accessories' } }),
    prisma.category.upsert({ where: { slug: 'home-garden' }, update: {}, create: { name: 'Home & Garden', slug: 'home-garden', description: 'Furniture, decor, tools' } }),
    prisma.category.upsert({ where: { slug: 'vehicles' }, update: {}, create: { name: 'Vehicles', slug: 'vehicles', description: 'Cars, motorcycles, spare parts' } }),
    prisma.category.upsert({ where: { slug: 'food-agriculture' }, update: {}, create: { name: 'Food & Agriculture', slug: 'food-agriculture', description: 'Fresh produce, livestock' } }),
    prisma.category.upsert({ where: { slug: 'services' }, update: {}, create: { name: 'Services', slug: 'services', description: 'Freelance, repairs, consulting' } }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Demo seller user
  const sellerPassword = await bcrypt.hash('Seller@1234', 10);
  const sellerUser = await prisma.user.upsert({
    where: { email: 'seller@kwisoko.rw' },
    update: {},
    create: {
      email: 'seller@kwisoko.rw',
      phone: '+250780000002',
      passwordHash: sellerPassword,
      firstName: 'Jean',
      lastName: 'Pierre',
      role: Role.SELLER,
      isVerified: true,
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      businessName: 'JP Electronics',
      description: 'Quality electronics at fair prices',
      location: 'Kigali, Rwanda',
      status: SellerStatus.APPROVED,
    },
  });
  console.log('✅ Demo seller created:', sellerUser.email);

  // Demo buyer
  const buyerPassword = await bcrypt.hash('Buyer@1234', 10);
  await prisma.user.upsert({
    where: { email: 'buyer@kwisoko.rw' },
    update: {},
    create: {
      email: 'buyer@kwisoko.rw',
      phone: '+250780000003',
      passwordHash: buyerPassword,
      firstName: 'Alice',
      lastName: 'Uwase',
      role: Role.BUYER,
      isVerified: true,
    },
  });
  console.log('✅ Demo buyer created');

  // Demo products
  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        sellerId: seller.id,
        categoryId: categories[0].id,
        title: 'Samsung Galaxy A54',
        description: 'Brand new Samsung Galaxy A54 5G, 128GB storage, 8GB RAM',
        priceRwf: 450000,
        priceUsd: 320,
        stock: 5,
        location: 'Kigali',
        status: ProductStatus.ACTIVE,
      },
      {
        sellerId: seller.id,
        categoryId: categories[0].id,
        title: 'HP Laptop 15',
        description: 'HP 15-inch laptop, Intel Core i5, 8GB RAM, 256GB SSD',
        priceRwf: 850000,
        priceUsd: 600,
        stock: 3,
        location: 'Kigali',
        status: ProductStatus.ACTIVE,
      },
    ],
  });
  console.log('✅ Demo products created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
