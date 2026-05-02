import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function ContactPage() {
  let settings: Record<string, string> = {};
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'contact_email',
            'contact_phone',
            'contact_address',
            'contact_office_name',
            'contact_working_hours',
          ],
        },
      },
    });
    rows.forEach((r) => { settings[r.key] = r.value; });
  } catch {}

  return <ContactClient settings={settings} />;
}

