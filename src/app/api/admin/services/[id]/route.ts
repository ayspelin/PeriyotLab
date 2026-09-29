import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { normalizeServiceHistory } from "@/lib/serviceStatus";
import { normalizeServiceImages } from "@/lib/serviceTracking";

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

  if (body.receivedDate && !parseOptionalDate(body.receivedDate)) {
    return { field: "receivedDate", message: "Geçerli bir kabul tarihi giriniz." };
  }

  if (body.estimatedCompletionDate && !parseOptionalDate(body.estimatedCompletionDate)) {
    return { field: "estimatedCompletionDate", message: "Geçerli bir tahmini tamamlanma tarihi giriniz." };
  }

  return null;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const service = await prisma.serviceRecord.findUnique({
      where: { id },
      include: {
        sourceRequest: {
          select: {
            id: true,
            customerName: true,
            companyName: true,
            phone: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Servis kaydı bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      service: {
        ...service,
        images: normalizeServiceImages(service.images),
        serviceHistory: normalizeServiceHistory(service.serviceHistory),
      },
    });
  } catch (error) {
    console.error("[Admin Service API] Detail failed:", error);
    return NextResponse.json({ error: "Servis kaydı alınamadı." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validationError = getValidationError(body);

    if (validationError) {
      return NextResponse.json(
        { error: validationError.message, fieldErrors: { [validationError.field]: validationError.message } },
        { status: 400 }
      );
    }

    const receivedDate = parseOptionalDate(body.receivedDate) || new Date();
    const estimatedCompletionDate = parseOptionalDate(body.estimatedCompletionDate);

    const service = await prisma.serviceRecord.update({
      where: { id },
      data: {
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
        technicianNote: getString(body.technicianNote) || null,
        customerNote: getString(body.customerNote) || null,
        images: normalizeServiceImages(body.images),
      },
    });

    return NextResponse.json({
      service: {
        ...service,
        images: normalizeServiceImages(service.images),
        serviceHistory: normalizeServiceHistory(service.serviceHistory),
      },
    });
  } catch (error) {
    console.error("[Admin Service API] Update failed:", error);
    return NextResponse.json({ error: "Servis kaydı güncellenemedi." }, { status: 500 });
  }
}
