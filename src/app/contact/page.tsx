import ContactClient from './ContactClient';
import prisma from "@/lib/prisma";


export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings: Record<string, string> = {};
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
