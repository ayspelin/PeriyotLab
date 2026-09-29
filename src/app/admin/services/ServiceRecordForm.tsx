"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ServiceImage = {
  url?: string;
  name: string;
  type?: string;
  size?: number;
  isPublic?: boolean;
  source?: "request" | "admin";
};

export type ServiceFormRecord = {
  id?: string;
  trackingCode?: string;
  customerName?: string;
  companyName?: string;
  phone?: string;
  email?: string;
  deviceType?: string;
  brand?: string;
  model?: string;
  serialNumber?: string | null;
  problemDescription?: string;
  receivedDate?: string;
  estimatedCompletionDate?: string | null;
  technicianNote?: string | null;
  customerNote?: string | null;
  images?: ServiceImage[];
};

type Props = {
  mode: "create" | "edit";
  serviceId?: string;
  initialService?: ServiceFormRecord;
  onSaved?: (service: ServiceFormRecord) => void;
};

function formatInputDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function getInitialForm(initialService?: ServiceFormRecord) {
  return {
    customerName: initialService?.customerName || "",
    companyName: initialService?.companyName || "",
    phone: initialService?.phone || "",
    email: initialService?.email || "",
    deviceType: initialService?.deviceType || "",
    brand: initialService?.brand || "",
    model: initialService?.model || "",
    serialNumber: initialService?.serialNumber || "",
    problemDescription: initialService?.problemDescription || "",
    receivedDate: formatInputDate(initialService?.receivedDate) || todayInputDate(),
    estimatedCompletionDate: formatInputDate(initialService?.estimatedCompletionDate),
    technicianNote: initialService?.technicianNote || "",
    customerNote: initialService?.customerNote || "",
  };
}

export default function ServiceRecordForm({ mode, serviceId, initialService, onSaved }: Props) {
  const [formData, setFormData] = useState(() => getInitialForm(initialService));
  const [images, setImages] = useState<ServiceImage[]>(initialService?.images || []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createdTrackingCode, setCreatedTrackingCode] = useState(initialService?.trackingCode || "");

  const endpoint = useMemo(() => {
    return mode === "create" ? "/api/admin/services" : `/api/admin/services/${serviceId}`;
  }, [mode, serviceId]);

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const uploadedImages: ServiceImage[] = [];

      for (const file of Array.from(files)) {
        const data = new FormData();
        data.append("file", file);

        const response = await fetch("/api/upload", { method: "POST", body: data });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Fotoğraf yüklenemedi.");
        }

        uploadedImages.push({
          url: result.url,
          name: file.name,
          type: file.type,
          size: file.size,
          isPublic: false,
          source: "admin",
        });
      }

      setImages((current) => [...current, ...uploadedImages]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Fotoğraf yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  function toggleImagePublic(index: number) {
    setImages((current) =>
      current.map((image, imageIndex) =>
        imageIndex === index ? { ...image, isPublic: !image.isPublic } : image
      )
    );
  }

  function removeImage(index: number) {
    setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }

  async function copyTrackingCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setMessage("Takip kodu kopyalandı.");
    } catch {
      setMessage("Takip kodu kopyalanamadı; elle seçip kopyalayabilirsiniz.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Servis kaydı kaydedilemedi.");
      }

      const savedService = result.service;
      setCreatedTrackingCode(savedService.trackingCode || "");
      setMessage(mode === "create" ? "Servis kaydı oluşturuldu." : "Servis kaydı güncellendi.");
      onSaved?.(savedService);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Servis kaydı kaydedilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {createdTrackingCode && (
        <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-800">
            {mode === "create" ? "Servis kaydı oluşturuldu" : "Takip Kodu"}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <strong className="text-2xl font-black text-slate-950">{createdTrackingCode}</strong>
            <button
              type="button"
              onClick={() => copyTrackingCode(createdTrackingCode)}
              className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700"
            >
              Kopyala
            </button>
            {initialService?.id && (
              <Link
                href={`/admin/services/${initialService.id}`}
                className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800"
              >
                Kaydı Görüntüle
              </Link>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Müşteri Bilgileri</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Müşteri Adı</span>
              <input required value={formData.customerName} onChange={(event) => updateField("customerName", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Firma</span>
              <input required value={formData.companyName} onChange={(event) => updateField("companyName", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Telefon</span>
              <input required value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">E-posta</span>
              <input required type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Cihaz Bilgileri</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Cihaz Türü</span>
              <input required value={formData.deviceType} onChange={(event) => updateField("deviceType", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Marka</span>
              <input required value={formData.brand} onChange={(event) => updateField("brand", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Model</span>
              <input required value={formData.model} onChange={(event) => updateField("model", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Seri Numarası</span>
              <input value={formData.serialNumber} onChange={(event) => updateField("serialNumber", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-slate-700">Şikayet / Arıza</span>
            <textarea required rows={4} value={formData.problemDescription} onChange={(event) => updateField("problemDescription", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Servis Bilgileri</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Kabul Tarihi</span>
              <input required type="date" value={formData.receivedDate} onChange={(event) => updateField("receivedDate", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-bold text-slate-700">Tahmini Tamamlanma</span>
              <input type="date" value={formData.estimatedCompletionDate} onChange={(event) => updateField("estimatedCompletionDate", event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
          </div>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-slate-700">Müşteriye Gösterilecek Not</span>
            <textarea rows={3} value={formData.customerNote} onChange={(event) => updateField("customerNote", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>

          <label className="mt-4 block space-y-2">
            <span className="text-sm font-bold text-slate-700">Internal Teknik Not</span>
            <textarea rows={3} value={formData.technicianNote} onChange={(event) => updateField("technicianNote", event.target.value)} className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Cihaz Fotoğrafları</h2>
              <p className="mt-1 text-sm text-slate-500">Public takip ekranında yalnızca “müşteriye göster” seçili görseller görünür.</p>
            </div>
            <label className="inline-flex cursor-pointer justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
              {uploading ? "Yükleniyor..." : "Fotoğraf Ekle"}
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(event) => handleUpload(event.target.files)} />
            </label>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${image.url || image.name}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <div className="h-36 bg-white">
                  {image.url ? (
                    <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center p-4 text-center text-sm font-semibold text-slate-400">
                      {image.name}
                    </div>
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <p className="truncate text-sm font-bold text-slate-800" title={image.name}>{image.name}</p>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={Boolean(image.isPublic)} onChange={() => toggleImagePublic(index)} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" />
                    Müşteriye göster
                  </label>
                  <button type="button" onClick={() => removeImage(index)} className="text-sm font-bold text-rose-700 hover:text-rose-900">
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm font-semibold text-slate-500">
              Henüz fotoğraf eklenmedi.
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || uploading} className="w-full rounded-lg bg-slate-950 px-6 py-4 text-base font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Kaydediliyor..." : mode === "create" ? "Servis Kaydını Oluştur" : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}
