import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(slides);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

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
