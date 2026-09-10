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
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL ve ADMIN_PASSWORD .env içinde tanımlı olmalıdır');
  }

  if (password.length < 8) {
    throw new Error('ADMIN_PASSWORD en az 8 karakter olmalıdır');
  }

  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash, name: 'PeriyotLab Yöneticisi' },
    create: { email, password: hash, name: 'PeriyotLab Yöneticisi' },
  });

  console.log(`${email} için yönetici hesabı güncellendi`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
