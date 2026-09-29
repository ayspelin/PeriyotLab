"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createSlug,
  normalizeGalleryImages,
  normalizeTechnicalSpecifications,
  type GalleryImage,
  type TechnicalSpecification,
} from "@/lib/customManufacturing";

export type CustomManufacturingFormItem = {
  id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  usageArea?: string | null;
  applicationArea?: string | null;
  technicalSpecifications?: TechnicalSpecification[];
  projectNotes?: string | null;
  coverImage?: string | null;
  galleryImages?: GalleryImage[];
  videoUrl?: string | null;
  featured?: boolean;
  published?: boolean;
};

type Props = {
  mode: "create" | "edit";
  item?: CustomManufacturingFormItem;
};

function getInitialForm(item?: CustomManufacturingFormItem) {
  return {
    title: item?.title || "",
    slug: item?.slug || "",
    shortDescription: item?.shortDescription || "",
    description: item?.description || "",
    usageArea: item?.usageArea || "",
    applicationArea: item?.applicationArea || "",
    projectNotes: item?.projectNotes || "",
    coverImage: item?.coverImage || "",
    videoUrl: item?.videoUrl || "",
    featured: item?.featured || false,
    published: item?.published || false,
  };
}

export default function CustomManufacturingForm({ mode, item }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState(() => getInitialForm(item));
  const [specs, setSpecs] = useState<TechnicalSpecification[]>(
    normalizeTechnicalSpecifications(item?.technicalSpecifications).length
      ? normalizeTechnicalSpecifications(item?.technicalSpecifications)
      : [{ key: "", value: "" }]
  );
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(normalizeGalleryImages(item?.galleryImages));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof formData, value: string | boolean) {
    setFormData((current) => {
      const next = { ...current, [field]: value };

      if (field === "title" && !current.slug && typeof value === "string") {
        next.slug = createSlug(value);
      }

      return next;
    });
  }

  function updateSpec(index: number, field: keyof TechnicalSpecification, value: string) {
    setSpecs((current) =>
      current.map((spec, specIndex) => (specIndex === index ? { ...spec, [field]: value } : spec))
    );
  }

  function removeSpec(index: number) {
    setSpecs((current) => current.filter((_, specIndex) => specIndex !== index));
  }

  async function uploadFile(file: File) {
    const data = new FormData();
    data.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body: data });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Görsel yüklenemedi.");
    }

    return result.url as string;
  }

  async function handleCoverUpload(file: File | null) {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const url = await uploadFile(file);
      updateField("coverImage", url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploaded = await Promise.all(
        Array.from(files).map(async (file) => ({
          url: await uploadFile(file),
          alt: file.name,
        }))
      );
      setGalleryImages((current) => [...current, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Galeri görselleri yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  function moveGalleryImage(index: number, direction: -1 | 1) {
    setGalleryImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;

      const next = [...current];
      const [image] = next.splice(index, 1);
      next.splice(target, 0, image);
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "create" ? "/api/admin/custom-manufacturing" : `/api/admin/custom-manufacturing/${item?.id}`;
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          technicalSpecifications: specs,
          galleryImages,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Özel imalat kaydı kaydedilemedi.");
      }

      router.push("/admin/custom-manufacturing");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Özel imalat kaydı kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Temel Bilgiler</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Başlık</span>
            <input required value={formData.title} onChange={(event) => updateField("title", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Slug</span>
            <input required value={formData.slug} onChange={(event) => updateField("slug", createSlug(event.target.value))} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-700">Kısa Açıklama</span>
          <textarea required rows={3} value={formData.shortDescription} onChange={(event) => updateField("shortDescription", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-700">Detaylı Açıklama</span>
          <textarea required rows={6} value={formData.description} onChange={(event) => updateField("description", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Kullanım ve Proje Bilgileri</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Kullanım Amacı</span>
            <input value={formData.usageArea} onChange={(event) => updateField("usageArea", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold text-slate-700">Uygulama Alanı</span>
            <input value={formData.applicationArea} onChange={(event) => updateField("applicationArea", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-700">Üretim / Proje Notları</span>
          <textarea rows={4} value={formData.projectNotes} onChange={(event) => updateField("projectNotes", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-bold text-slate-700">Video Linki</span>
          <input type="url" value={formData.videoUrl} onChange={(event) => updateField("videoUrl", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-slate-950">Teknik Özellikler</h2>
          <button type="button" onClick={() => setSpecs((current) => [...current, { key: "", value: "" }])} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
            Özellik Ekle
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input placeholder="Özellik adı" value={spec.key} onChange={(event) => updateSpec(index, "key", event.target.value)} className="rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
              <input placeholder="Değer" value={spec.value} onChange={(event) => updateSpec(index, "value", event.target.value)} className="rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
              <button type="button" onClick={() => removeSpec(index)} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50">
                Sil
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Görseller</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-[240px_1fr]">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">Kapak Görseli</p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {formData.coverImage ? (
                <img src={formData.coverImage} alt="" className="h-44 w-full object-cover" />
              ) : (
                <div className="flex h-44 items-center justify-center text-sm font-semibold text-slate-400">Kapak görseli yok</div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
                {uploading ? "Yükleniyor..." : "Kapak Yükle"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(event) => handleCoverUpload(event.target.files?.[0] || null)} />
              </label>
              {formData.coverImage && (
                <button type="button" onClick={() => updateField("coverImage", "")} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50">
                  Kaldır
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-slate-700">Galeri Görselleri</p>
              <label className="inline-flex cursor-pointer justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
                Galeriye Ekle
                <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(event) => handleGalleryUpload(event.target.files)} />
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {galleryImages.map((image, index) => (
                <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  <img src={image.url} alt={image.alt || ""} className="h-32 w-full object-cover" />
                  <div className="flex flex-wrap items-center gap-2 p-3">
                    <button type="button" onClick={() => moveGalleryImage(index, -1)} className="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-600">Yukarı</button>
                    <button type="button" onClick={() => moveGalleryImage(index, 1)} className="rounded border border-slate-300 px-2 py-1 text-xs font-bold text-slate-600">Aşağı</button>
                    <button type="button" onClick={() => setGalleryImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} className="rounded border border-rose-200 px-2 py-1 text-xs font-bold text-rose-700">Sil</button>
                  </div>
                </div>
              ))}
            </div>
            {galleryImages.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500">
                Henüz galeri görseli eklenmedi.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Yayın Durumu</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input type="checkbox" checked={formData.published} onChange={(event) => updateField("published", event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" />
            <span className="text-sm font-bold text-slate-700">Yayında</span>
          </label>
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input type="checkbox" checked={formData.featured} onChange={(event) => updateField("featured", event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" />
            <span className="text-sm font-bold text-slate-700">Ana sayfada öne çıkar</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" disabled={loading || uploading} className="flex-1 rounded-lg bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Kaydediliyor..." : mode === "create" ? "Özel İmalat Kaydını Oluştur" : "Değişiklikleri Kaydet"}
        </button>
        <Link href="/admin/custom-manufacturing" className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
