import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  // Convert array of {key, value} to an object { [key]: value }
  const settingsObj = settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
  return NextResponse.json(settingsObj);
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Expected: { key: value, key2: value2 }
    
    // Upsert each setting
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
