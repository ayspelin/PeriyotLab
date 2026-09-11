import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    const body = await request.json();
    const data: Prisma.ProductUpdateInput = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl || null;
    if (body.documentUrl !== undefined) data.documentUrl = body.documentUrl || null;
    if (body.documentTitle !== undefined) data.documentTitle = body.documentTitle || null;
    if (body.documentType !== undefined) data.documentType = body.documentType || null;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;

    const product = await prisma.product.update({
      where: { id },
      data
    });
    return NextResponse.json(product);
  } catch (error) {
    const details = error instanceof Error ? error.message : "Unknown error";
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Failed to update product", details }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.product.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
