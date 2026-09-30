import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  createSlug,
  normalizeGalleryImages,
  normalizeTechnicalSpecifications,
} from "@/lib/customManufacturing";

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validationError(message: string, field: string) {
  return NextResponse.json({ error: message, fieldErrors: { [field]: message } }, { status: 400 });
}

async function isSlugAvailable(slug: string, id: string) {
  const existing = await prisma.customManufacturingItem.findUnique({
    where: { slug },
    select: { id: true },
  });

  return !existing || existing.id === id;
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const item = await prisma.customManufacturingItem.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json({ error: "Özel imalat kaydı bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("[Custom Manufacturing API] Detail failed:", error);
    return NextResponse.json({ error: "Özel imalat kaydı alınamadı." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = getString(body.title);
    const slug = createSlug(getString(body.slug) || title);
    const shortDescription = getString(body.shortDescription);
    const description = getString(body.description);

    if (!title) return validationError("Başlık zorunludur.", "title");
    if (!slug) return validationError("Sayfa adresi oluşturulamadı.", "slug");
    if (!shortDescription) return validationError("Kısa açıklama zorunludur.", "shortDescription");
    if (!description) return validationError("Detaylı açıklama zorunludur.", "description");

    if (!(await isSlugAvailable(slug, id))) {
      return validationError("Bu sayfa adresi kullanılıyor. Lütfen farklı bir sayfa adresi girin.", "slug");
    }

    const item = await prisma.customManufacturingItem.update({
      where: { id },
      data: {
        title,
        slug,
        shortDescription,
        description,
        usageArea: getString(body.usageArea) || null,
        applicationArea: getString(body.applicationArea) || null,
        technicalSpecifications: normalizeTechnicalSpecifications(body.technicalSpecifications),
        projectNotes: getString(body.projectNotes) || null,
        coverImage: getString(body.coverImage) || null,
        galleryImages: normalizeGalleryImages(body.galleryImages),
        videoUrl: getString(body.videoUrl) || null,
        featured: body.featured === true,
        published: body.published === true,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("[Custom Manufacturing API] Update failed:", error);
    return NextResponse.json({ error: "Özel imalat kaydı güncellenemedi." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data: { published?: boolean; featured?: boolean } = {};

    if (body.published !== undefined) data.published = body.published === true;
    if (body.featured !== undefined) data.featured = body.featured === true;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Güncellenecek alan bulunamadı." }, { status: 400 });
    }

    const item = await prisma.customManufacturingItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("[Custom Manufacturing API] Patch failed:", error);
    return NextResponse.json({ error: "Özel imalat kaydı güncellenemedi." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.customManufacturingItem.delete({ where: { id } });
    return NextResponse.json({ message: "Özel imalat kaydı silindi." });
  } catch (error) {
    console.error("[Custom Manufacturing API] Delete failed:", error);
    return NextResponse.json({ error: "Özel imalat kaydı silinemedi." }, { status: 500 });
  }
}
