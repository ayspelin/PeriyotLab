import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['about_title', 'about_description', 'about_mission', 'about_vision', 'about_quality']
        }
      }
    });

    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch about settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Update or create each setting
    const keys = ['about_title', 'about_description', 'about_mission', 'about_vision', 'about_quality'];
    
    for (const key of keys) {
      if (body[key] !== undefined) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: body[key] },
          create: { key, value: body[key] }
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update about settings" }, { status: 500 });
  }
}
