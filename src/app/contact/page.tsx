import ContactClient from './ContactClient';
import prisma from "@/lib/prisma";
import { CONTACT_SETTING_KEYS, type ContactSettings } from "@/lib/contactInfo";


export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const settings: ContactSettings = {};
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [...CONTACT_SETTING_KEYS],
        },
      },
    });
    rows.forEach((r) => { settings[r.key as keyof ContactSettings] = r.value; });
  } catch {}

  return <ContactClient settings={settings} />;
}
