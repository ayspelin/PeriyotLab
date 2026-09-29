import ServiceRecordDetailClient from "./ServiceRecordDetailClient";
import prisma from "@/lib/prisma";
import { normalizeServiceHistory } from "@/lib/serviceStatus";
import { normalizeServiceImages, normalizeServiceStatus } from "@/lib/serviceTracking";

export const dynamic = "force-dynamic";

async function getServiceDetail(id: string) {
  try {
    const service = await prisma.serviceRecord.findUnique({
      where: { id },
      include: {
        sourceRequest: {
          select: {
            id: true,
            customerName: true,
            companyName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!service) {
      return { service: null, error: "Servis kaydı bulunamadı." };
    }

    return {
      service: {
        ...service,
        receivedDate: service.receivedDate.toISOString(),
        estimatedCompletionDate: service.estimatedCompletionDate?.toISOString() || null,
        status: normalizeServiceStatus(service.status),
        images: normalizeServiceImages(service.images),
        serviceHistory: normalizeServiceHistory(service.serviceHistory),
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString(),
        sourceRequest: service.sourceRequest
          ? {
              ...service.sourceRequest,
              createdAt: service.sourceRequest.createdAt.toISOString(),
            }
          : null,
      },
      error: "",
    };
  } catch {
    return { service: null, error: "Servis kaydı alınamadı." };
  }
}

export default async function ServiceRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getServiceDetail(id);
  return <ServiceRecordDetailClient serviceId={id} initialService={detail.service} initialError={detail.error} />;
}
