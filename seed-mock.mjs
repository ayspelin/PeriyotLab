import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Clearing old data...');
  await prisma.heroSlide.deleteMany();
  await prisma.product.deleteMany();

  console.log('Seeding Hero Slides...');
  await prisma.heroSlide.createMany({
    data: [
      {
        imageUrl: '/mock/hero1.png',
        title: 'Geleceğin Kimya Teknolojileri',
        description: 'Laboratuvarınız için en güvenilir ve yenilikçi çözümleri sunuyoruz.',
        order: 1
      },
      {
        imageUrl: '/mock/hero2.png',
        title: 'Yüksek Saflıkta Reaktifler',
        description: 'Araştırmalarınızda mükemmelliği yakalamak için global standartlarda üretim.',
        order: 2
      }
    ]
  });

  console.log('Seeding Products...');
  await prisma.product.createMany({
    data: [
      {
        name: 'HPLC Grade Metanol',
        description: 'Ultra yüksek saflıkta kromatografi çözücüsü. Kalıntı ve su oranı minimum seviyededir.',
        category: 'Solventler',
        imageUrl: '/mock/prod1.png',
        isFeatured: true
      },
      {
        name: 'Sodyum Hidroksit Peletleri',
        description: 'Analitik reaktif kalitesinde, titrasyon ve nötralizasyon işlemleri için ideal.',
        category: 'İnorganik Kimyasallar',
        imageUrl: '/mock/prod2.png',
        isFeatured: true
      },
      {
        name: 'Organik Sentez Ara Ürünleri',
        description: 'Karmaşık moleküllerin sentezi için yüksek kalitede reaktifler ve katalizörler.',
        category: 'Organik Kimyasallar',
        imageUrl: '/mock/prod3.png',
        isFeatured: true
      },
      {
        name: 'Tampon Çözelti Seti (pH 4, 7, 10)',
        description: 'pH metre kalibrasyonu için standartlaştırılmış, sertifikalı tampon çözeltiler.',
        category: 'Analitik Çözeltiler',
        imageUrl: '/mock/prod4.png',
        isFeatured: true
      }
    ]
  });

  console.log('Seeding complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
