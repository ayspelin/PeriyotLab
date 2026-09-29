import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { isServiceStatus } from "@/lib/serviceStatus";
import { appendServiceHistory } from "@/lib/serviceTracking";

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const status = body.status;

    if (!isServiceStatus(status)) {
      return NextResponse.json({ error: "Geçerli bir servis durumu seçiniz." }, { status: 400 });
    }

    const current = await prisma.serviceRecord.findUnique({
      where: { id },
      select: { serviceHistory: true },
    });

    if (!current) {
      return NextResponse.json({ error: "Servis kaydı bulunamadı." }, { status: 404 });
    }

    const service = await prisma.serviceRecord.update({
      where: { id },
      data: {
        status,
        serviceHistory: appendServiceHistory(current.serviceHistory, status, getString(body.note) || undefined),
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error("[Admin Service API] Status update failed:", error);
    return NextResponse.json({ error: "Servis durumu güncellenemedi." }, { status: 500 });
  }
}
