import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// GET: List all partners
export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json({ error: 'Failed to fetch partners' }, { status: 500 });
  }
}

// POST: Create a new partner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, imageUrl, order } = body;

    if (!name || !imageUrl) {
      return NextResponse.json({ error: 'name and imageUrl are required' }, { status: 400 });
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        imageUrl,
        order: order ?? 0,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json({ error: 'Failed to create partner' }, { status: 500 });
  }
}
