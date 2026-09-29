"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const inputClass = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-950 outline-none transition hover:border-zinc-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100";
const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-zinc-500";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export default function ServiceRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileLabel, setFileLabel] = useState("Görsel seçin");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const name = getValue(formData, "name");
    const email = getValue(formData, "email");
    const company = getValue(formData, "company");
    const phone = getValue(formData, "phone");
    const brand = getValue(formData, "brand");
    const model = getValue(formData, "model");
    const deviceType = getValue(formData, "deviceType");
    const fault = getValue(formData, "fault");

    const files = formData.getAll("images").filter((file): file is File => file instanceof File && file.name.length > 0);
    const fileNames = files.map((file) => file.name).join(", ") || "Görsel eklenmedi";

    const message = [
      "Yeni servis talebi:",
      "",
      `Ad Soyad: ${name}`,
      `Firma: ${company}`,
      `Telefon: ${phone}`,
      `E-posta: ${email}`,
      `Cihaz Markası: ${brand}`,
      `Cihaz Modeli: ${model}`,
      `Cihaz / Ürün Türü: ${deviceType}`,
      `Görsel Dosyaları: ${fileNames}`,
      "",
      "Arıza Açıklaması:",
      fault,
    ].join("\n");

    try {
      // TODO: Servis talebi ve görsel yükleme için ayrı backend endpoint'i hazırlandığında bu gönderim o endpoint'e taşınacak.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Servis talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }

      setStatus("success");
      setFileLabel("Görsel seçin");
      formRef.current?.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Servis talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-cyan-950/10 md:p-7">
      {status === "success" && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">
          Servis talebiniz alındı. Ekibimiz sizinle iletişime geçecektir.
        </div>
      )}

      {status === "error" && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-800">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <label htmlFor="service-name" className={labelClass}>Ad Soyad</label>
          <input id="service-name" name="name" type="text" required autoComplete="name" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-company" className={labelClass}>Firma</label>
          <input id="service-company" name="company" type="text" required autoComplete="organization" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-phone" className={labelClass}>Telefon</label>
          <input id="service-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-email" className={labelClass}>E-posta</label>
          <input id="service-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-brand" className={labelClass}>Cihaz Markası</label>
          <input id="service-brand" name="brand" type="text" required className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-model" className={labelClass}>Cihaz Modeli</label>
          <input id="service-model" name="model" type="text" required className={inputClass} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <label htmlFor="service-device-type" className={labelClass}>Cihaz / Ürün Türü</label>
        <input id="service-device-type" name="deviceType" type="text" required className={inputClass} />
      </div>

      <div className="mt-5 space-y-2.5">
        <label htmlFor="service-fault" className={labelClass}>Arıza Açıklaması</label>
        <textarea id="service-fault" name="fault" rows={5} required className={`${inputClass} resize-none`} />
      </div>

      <div className="mt-5 space-y-2.5">
        <span className={labelClass}>Görsel Yükleme</span>
        <label htmlFor="service-images" className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-cyan-700 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
            </svg>
          </span>
          <span className="mt-4 text-sm font-black text-zinc-950">{fileLabel}</span>
          <span className="mt-1 text-xs font-semibold text-zinc-500">JPG veya PNG</span>
        </label>
        <input
          id="service-images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => {
            const count = event.target.files?.length || 0;
            setFileLabel(count > 0 ? `${count} görsel seçildi` : "Görsel seçin");
          }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-7 inline-flex w-full justify-center rounded-full bg-zinc-950 px-7 py-4 text-base font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Gönderiliyor..." : "Servis Talebi Gönder"}
      </button>
    </form>
  );
}
