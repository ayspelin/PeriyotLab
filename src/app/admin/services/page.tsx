import prisma from "@/lib/prisma";
import { normalizeServiceStatus } from "@/lib/serviceTracking";
import ServicesAdminClient, { type ServiceRequestSummary, type ServiceSummary } from "./ServicesAdminClient";

export const dynamic = "force-dynamic";

async function getServiceManagementData() {
  try {
    const [services, requests] = await Promise.all([
      prisma.serviceRecord.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          trackingCode: true,
          customerName: true,
          companyName: true,
          deviceType: true,
          brand: true,
          model: true,
          receivedDate: true,
          status: true,
        },
      }),
      prisma.serviceRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          serviceRecord: {
            select: {
              id: true,
              trackingCode: true,
            },
          },
        },
      }),
    ]);

    return {
      loaded: true,
      services: services.map((service) => ({
        ...service,
        receivedDate: service.receivedDate.toISOString(),
        status: normalizeServiceStatus(service.status),
      })) satisfies ServiceSummary[],
      requests: requests.map((request) => ({
        id: request.id,
        customerName: request.customerName,
        companyName: request.companyName,
        phone: request.phone,
        email: request.email,
        deviceType: request.deviceType,
        brand: request.brand,
        model: request.model,
        createdAt: request.createdAt.toISOString(),
        status: request.status,
        serviceRecord: request.serviceRecord,
      })) satisfies ServiceRequestSummary[],
    };
  } catch {
    return {
      loaded: false,
      services: [] satisfies ServiceSummary[],
      requests: [] satisfies ServiceRequestSummary[],
    };
  }
}

export default async function AdminServicesPage() {
  const data = await getServiceManagementData();
  return <ServicesAdminClient initialServices={data.services} initialRequests={data.requests} initiallyLoaded={data.loaded} />;
}
