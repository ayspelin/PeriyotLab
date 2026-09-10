import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_SETTING_KEYS = [
  'footer_text',
  'contact_email',
  'contact_phone',
  'contact_address',
  'contact_office_name',
  'contact_working_hours',
  'home_hero_badge',
  'home_hero_title',
  'home_hero_desc',
  'home_vision_title',
  'home_vision_desc',
  'home_stat_1_value',
  'home_stat_1_label',
  'home_stat_2_value',
  'home_stat_2_label',
  'home_stat_3_value',
  'home_stat_3_label',
  'home_stat_4_value',
  'home_stat_4_label',
  'maintenance_badge',
  'maintenance_title',
  'maintenance_intro',
  'maintenance_step_1',
  'maintenance_step_2',
  'maintenance_step_3',
  'maintenance_note',
];

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ALLOWED_SETTING_KEYS } },
    });
    const settingsObj = settings.reduce<Record<string, string>>((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settingsObj);
  } catch {
    return NextResponse.json({});
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_SETTING_KEYS.includes(key) && typeof value === 'string') {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 });
  }
}
