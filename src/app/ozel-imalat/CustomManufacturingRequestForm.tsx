"use client";

import { useState } from "react";
import { PHONE_VALIDATION_MESSAGE, normalizeTrMobilePhone } from "@/lib/contactInfo";

const MAX_FILES = 5;

type FormState = {
  name: string;
  company: string;
  phone: string;
  email: string;
  projectTitle: string;
  systemDescription: string;
  technicalRequirements: string;
  notes: string;
};

const initialForm: FormState = {
  name: "",
  company: "",
  phone: "",
  email: "",
  projectTitle: "",
  systemDescription: "",
  technicalRequirements: "",
  notes: "",
};

export default function CustomManufacturingRequestForm() {
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;

    setFiles(Array.from(fileList).slice(0, MAX_FILES));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!normalizeTrMobilePhone(formData.phone)) {
      setError(PHONE_VALIDATION_MESSAGE);
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("type", "custom-manufacturing");

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      files.forEach((file) => data.append("images", file));

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Talebiniz gönderilemedi.");
      }

      setMessage("Talebiniz alındı. PeriyotLab ekibi en kısa sürede sizinle iletişime geçecek.");
      setFormData(initialForm);
      setFiles([]);
      event.currentTarget.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Talebiniz gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Talep Formu</span>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">Özel İmalat Talebi Oluştur</h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          İhtiyaç duyduğunuz cihaz veya sistem için temel proje bilgilerini paylaşabilirsiniz.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-bold text-zinc-700">Ad Soyad</span>
          <input required value={formData.name} onChange={(event) => updateField("name", event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-zinc-700">Firma</span>
          <input required value={formData.company} onChange={(event) => updateField("company", event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-zinc-700">Telefon</span>
          <input required value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-bold text-zinc-700">E-posta</span>
          <input required type="email" value={formData.email} onChange={(event) => updateField("email", event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
        </label>
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-zinc-700">İhtiyaç / Proje Başlığı</span>
        <input required value={formData.projectTitle} onChange={(event) => updateField("projectTitle", event.target.value)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-zinc-700">İstenen Cihaz veya Sistem Açıklaması</span>
        <textarea required rows={4} value={formData.systemDescription} onChange={(event) => updateField("systemDescription", event.target.value)} className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-zinc-700">Teknik Gereksinimler</span>
        <textarea required rows={4} value={formData.technicalRequirements} onChange={(event) => updateField("technicalRequirements", event.target.value)} className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-zinc-700">Dosya / Görsel Yükleme</span>
        <input type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" multiple onChange={(event) => handleFiles(event.target.files)} className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" />
        {files.length > 0 && (
          <p className="text-xs font-semibold text-zinc-500">{files.length} dosya seçildi.</p>
        )}
      </label>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-bold text-zinc-700">Ek Not</span>
        <textarea rows={3} value={formData.notes} onChange={(event) => updateField("notes", event.target.value)} className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-950 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
      </label>

      <button type="submit" disabled={loading} className="mt-6 w-full rounded-full bg-zinc-950 px-7 py-4 text-base font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
        {loading ? "Gönderiliyor..." : "Talebimi Gönder"}
      </button>
    </form>
  );
}
