import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, fileUrl, fileType, coverImageUrl, order } = body;

    if (!title || !fileUrl || !fileType) {
      return NextResponse.json({ error: 'title, fileUrl and fileType are required' }, { status: 400 });
    }

    const document = await prisma.document.create({
      data: {
        title,
        description: description || null,
        fileUrl,
        fileType,
        coverImageUrl: coverImageUrl || null,
        order: order ?? 0,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}
