import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  try {
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ message: "Slide deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
