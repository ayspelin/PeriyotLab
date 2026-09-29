import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { buildInitialServiceHistory, generateUniqueTrackingCode, normalizeServiceImages } from "@/lib/serviceTracking";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { serviceRecord: true },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Servis talebi bulunamadı." }, { status: 404 });
    }

    if (serviceRequest.serviceRecord) {
      return NextResponse.json({ service: serviceRequest.serviceRecord, alreadyConverted: true });
    }

    const receivedDate = new Date();
    const trackingCode = await generateUniqueTrackingCode(receivedDate);
    const images = normalizeServiceImages(serviceRequest.images).map((image) => ({
      ...image,
      isPublic: false,
      source: "request" as const,
    }));

    const service = await prisma.$transaction(async (tx) => {
      const created = await tx.serviceRecord.create({
        data: {
          trackingCode,
          customerName: serviceRequest.customerName,
          companyName: serviceRequest.companyName,
          phone: serviceRequest.phone,
          email: serviceRequest.email,
          deviceType: serviceRequest.deviceType,
          brand: serviceRequest.brand,
          model: serviceRequest.model,
          serialNumber: serviceRequest.serialNumber,
          problemDescription: serviceRequest.problemDescription,
          receivedDate,
          status: "RECEIVED",
          technicianNote: serviceRequest.note,
          images,
          serviceHistory: buildInitialServiceHistory("RECEIVED", "Servis talebinden servis kaydı oluşturuldu."),
          sourceRequestId: serviceRequest.id,
        },
      });

      await tx.serviceRequest.update({
        where: { id: serviceRequest.id },
        data: { status: "CONVERTED" },
      });

      return created;
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("[Admin Service Request API] Convert failed:", error);
    return NextResponse.json({ error: "Servis talebi kayda dönüştürülemedi." }, { status: 500 });
  }
}
