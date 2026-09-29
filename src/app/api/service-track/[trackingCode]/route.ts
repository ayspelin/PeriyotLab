import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildServiceTimeline, getServiceStatusLabel } from "@/lib/serviceStatus";
import { getPublicServiceImages } from "@/lib/serviceTracking";

export async function GET(_request: Request, { params }: { params: Promise<{ trackingCode: string }> }) {
  const { trackingCode } = await params;
  const normalizedCode = decodeURIComponent(trackingCode || "").trim().toUpperCase();

  if (!normalizedCode) {
    return NextResponse.json(
      { success: false, error: "Servis takip kodu gereklidir." },
      { status: 400 }
    );
  }

  try {
    const service = await prisma.serviceRecord.findUnique({
      where: { trackingCode: normalizedCode },
      select: {
        trackingCode: true,
        deviceType: true,
        brand: true,
        model: true,
        serialNumber: true,
        receivedDate: true,
        estimatedCompletionDate: true,
        status: true,
        customerNote: true,
        images: true,
        serviceHistory: true,
        updatedAt: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: "Bu takip koduyla eşleşen bir servis kaydı bulunamadı. Lütfen kodunuzu kontrol edin veya bizimle iletişime geçin.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      service: {
        trackingCode: service.trackingCode,
        deviceType: service.deviceType,
        brand: service.brand,
        model: service.model,
        serialNumber: service.serialNumber,
        receivedDate: service.receivedDate,
        estimatedCompletionDate: service.estimatedCompletionDate,
        status: service.status,
        statusLabel: getServiceStatusLabel(service.status),
        customerNote: service.customerNote,
        images: getPublicServiceImages(service.images),
        timeline: buildServiceTimeline(service.status, service.serviceHistory),
        updatedAt: service.updatedAt,
      },
    });
  } catch (error) {
    console.error("[Service Track API] Failed to fetch service record:", error);
    return NextResponse.json(
      { success: false, error: "Servis takip bilgisi şu anda alınamadı. Lütfen daha sonra tekrar deneyin." },
      { status: 500 }
    );
  }
}
