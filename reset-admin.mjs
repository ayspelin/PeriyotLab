import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function run() {
  const hash = await bcrypt.hash('123456', 10);
  await prisma.user.updateMany({ data: { password: hash } });
  console.log('All users passwords updated to 123456');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
