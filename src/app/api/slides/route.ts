import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl: body.imageUrl,
        title: body.title || null,
        description: body.description || null,
        order: body.order || 0,
      }
    });
    return NextResponse.json(slide, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}
