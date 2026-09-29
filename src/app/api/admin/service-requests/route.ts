import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const requests = await prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        serviceRecord: {
          select: {
            id: true,
            trackingCode: true,
          },
        },
      },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[Admin Service Requests API] List failed:", error);
    return NextResponse.json({ error: "Servis talepleri alınamadı." }, { status: 500 });
  }
}
