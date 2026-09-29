import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { isServiceStatus, type ServiceStatus } from "@/lib/serviceStatus";
import {
  buildInitialServiceHistory,
  generateUniqueTrackingCode,
  normalizeServiceImages,
} from "@/lib/serviceTracking";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalDate(value: unknown) {
  const raw = getString(value);
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getValidationError(body: Record<string, unknown>) {
  const requiredFields: Array<[string, string]> = [
    ["customerName", "Müşteri adı zorunludur."],
    ["companyName", "Firma alanı zorunludur."],
    ["phone", "Telefon alanı zorunludur."],
    ["email", "E-posta alanı zorunludur."],
    ["deviceType", "Cihaz türü zorunludur."],
    ["brand", "Marka alanı zorunludur."],
    ["model", "Model alanı zorunludur."],
    ["problemDescription", "Şikayet / arıza açıklaması zorunludur."],
  ];

  for (const [field, message] of requiredFields) {
    if (!getString(body[field])) {
      return { field, message };
    }
  }

  if (!emailRegex.test(getString(body.email))) {
    return { field: "email", message: "Geçerli bir e-posta adresi giriniz." };
  }

  const receivedDate = parseOptionalDate(body.receivedDate);
  if (body.receivedDate && !receivedDate) {
    return { field: "receivedDate", message: "Geçerli bir kabul tarihi giriniz." };
  }

  const estimatedCompletionDate = parseOptionalDate(body.estimatedCompletionDate);
  if (body.estimatedCompletionDate && !estimatedCompletionDate) {
    return { field: "estimatedCompletionDate", message: "Geçerli bir tahmini tamamlanma tarihi giriniz." };
  }

  if (body.status !== undefined && !isServiceStatus(body.status)) {
    return { field: "status", message: "Geçerli bir servis durumu seçiniz." };
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const services = await prisma.serviceRecord.findMany({
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
        createdAt: true,
      },
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("[Admin Services API] List failed:", error);
    return NextResponse.json({ error: "Servis kayıtları alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validationError = getValidationError(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError.message, fieldErrors: { [validationError.field]: validationError.message } },
        { status: 400 }
      );
    }

    const status = (isServiceStatus(body.status) ? body.status : "RECEIVED") as ServiceStatus;
    const receivedDate = parseOptionalDate(body.receivedDate) || new Date();
    const estimatedCompletionDate = parseOptionalDate(body.estimatedCompletionDate);
    const trackingCode = await generateUniqueTrackingCode(receivedDate);

    const service = await prisma.serviceRecord.create({
      data: {
        trackingCode,
        customerName: getString(body.customerName),
        companyName: getString(body.companyName),
        phone: getString(body.phone),
        email: getString(body.email),
        deviceType: getString(body.deviceType),
        brand: getString(body.brand),
        model: getString(body.model),
        serialNumber: getString(body.serialNumber) || null,
        problemDescription: getString(body.problemDescription),
        receivedDate,
        estimatedCompletionDate,
        status,
        technicianNote: getString(body.technicianNote) || null,
        customerNote: getString(body.customerNote) || null,
        images: normalizeServiceImages(body.images),
        serviceHistory: buildInitialServiceHistory(status),
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error("[Admin Services API] Create failed:", error);
    return NextResponse.json({ error: "Servis kaydı oluşturulamadı." }, { status: 500 });
  }
}
