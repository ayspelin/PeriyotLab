import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { normalizeGalleryImages, normalizeTechnicalSpecifications } from "@/lib/customManufacturing";
import CustomManufacturingForm from "../../CustomManufacturingForm";

export const dynamic = "force-dynamic";

export default async function EditCustomManufacturingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.customManufacturingItem.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  const formItem = {
    id: item.id,
    title: item.title,
    slug: item.slug,
    shortDescription: item.shortDescription,
    description: item.description,
    usageArea: item.usageArea,
    applicationArea: item.applicationArea,
    technicalSpecifications: normalizeTechnicalSpecifications(item.technicalSpecifications),
    projectNotes: item.projectNotes,
    coverImage: item.coverImage,
    galleryImages: normalizeGalleryImages(item.galleryImages),
    videoUrl: item.videoUrl,
    featured: item.featured,
    published: item.published,
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/custom-manufacturing" className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-black">
          ← Özel İmalata Dön
        </Link>
        <p className="mt-5 text-base font-semibold text-cyan-700">Özel İmalat</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{item.title}</h1>
      </div>

      <CustomManufacturingForm mode="edit" item={formItem} />
    </div>
  );
}
