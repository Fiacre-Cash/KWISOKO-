// NOTE: Run this seed from the backend folder:
// cd backend && npx ts-node ../database/prisma/seed.ts
// bcrypt is installed in backend/node_modules

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple hash without bcrypt for seed — use backend/seed-quick.ts for real seeding
async function hashPassword(password: string): Promise<string> {
  // This is a placeholder — actual seeding uses backend/seed-quick.ts
  // which has access to bcrypt via backend/node_modules
  return `$2b$10$placeholder_${Buffer.from(password).toString('base64')}`;
}

async function main() {
  console.log('⚠️  Use backend/seed-quick.ts for seeding with proper bcrypt hashing.');
  console.log('Run: cd backend && npx ts-node seed-quick.ts');
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
