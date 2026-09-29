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

async function isSlugAvailable(slug: string) {
  const existing = await prisma.customManufacturingItem.findUnique({
    where: { slug },
    select: { id: true },
  });

  return !existing;
}

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const items = await prisma.customManufacturingItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[Custom Manufacturing API] List failed:", error);
    return NextResponse.json({ error: "Özel imalat kayıtları alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = getString(body.title);
    const slug = createSlug(getString(body.slug) || title);
    const shortDescription = getString(body.shortDescription);
    const description = getString(body.description);

    if (!title) return validationError("Başlık zorunludur.", "title");
    if (!slug) return validationError("Slug oluşturulamadı.", "slug");
    if (!shortDescription) return validationError("Kısa açıklama zorunludur.", "shortDescription");
    if (!description) return validationError("Detaylı açıklama zorunludur.", "description");

    if (!(await isSlugAvailable(slug))) {
      return validationError("Bu slug kullanılıyor. Lütfen farklı bir slug girin.", "slug");
    }

    const item = await prisma.customManufacturingItem.create({
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

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("[Custom Manufacturing API] Create failed:", error);
    return NextResponse.json({ error: "Özel imalat kaydı oluşturulamadı." }, { status: 500 });
  }
}
