"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  CONTACT_SUCCESS_MESSAGE,
  PHONE_VALIDATION_MESSAGE,
  normalizeTrMobilePhone,
} from "@/lib/contactInfo";

type SubmitStatus = "idle" | "loading" | "success" | "error";
type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const maxImageCount = 5;
const maxImageSize = 5 * 1024 * 1024;
const maxTotalImageSize = 15 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const inputClass = "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-base text-zinc-950 outline-none transition hover:border-zinc-300 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100";
const labelClass = "text-xs font-bold uppercase tracking-[0.18em] text-zinc-500";

function getValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function getImageId(file: File) {
  const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  return `${file.name}-${file.lastModified}-${randomId}`;
}

function validateImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    return "Yalnızca jpg, jpeg, png veya webp formatında fotoğraf yükleyebilirsiniz.";
  }

  if (file.size > maxImageSize) {
    return "Her fotoğraf en fazla 5 MB olabilir.";
  }

  return "";
}

export default function ServiceRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedImagesRef = useRef<SelectedImage[]>([]);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);

  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const resetImages = () => {
    selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setSelectedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setSelectedImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    setErrorMessage("");
    setStatus((current) => (current === "error" ? "idle" : current));

    if (files.length === 0) {
      return;
    }

    if (selectedImages.length + files.length > maxImageCount) {
      setStatus("error");
      setErrorMessage(`En fazla ${maxImageCount} fotoğraf yükleyebilirsiniz.`);
      return;
    }

    const validationMessage = files.map(validateImage).find(Boolean);
    if (validationMessage) {
      setStatus("error");
      setErrorMessage(validationMessage);
      return;
    }

    const currentTotalSize = selectedImages.reduce((total, image) => total + image.file.size, 0);
    const nextTotalSize = files.reduce((total, file) => total + file.size, currentTotalSize);
    if (nextTotalSize > maxTotalImageSize) {
      setStatus("error");
      setErrorMessage("Fotoğrafların toplam boyutu 15 MB'ı geçmemelidir.");
      return;
    }

    const nextImages = files.map((file) => ({
      id: getImageId(file),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setSelectedImages((current) => [...current, ...nextImages]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    const sourceFormData = new FormData(event.currentTarget);
    const phone = getValue(sourceFormData, "phone");
    const normalizedPhone = normalizeTrMobilePhone(phone);

    if (!normalizedPhone) {
      setStatus("error");
      setErrorMessage(PHONE_VALIDATION_MESSAGE);
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    const payload = new FormData();
    [
      "name",
      "company",
      "email",
      "deviceType",
      "brand",
      "model",
      "serialNumber",
      "fault",
      "notes",
    ].forEach((key) => {
      payload.append(key, getValue(sourceFormData, key));
    });
    payload.append("phone", normalizedPhone);
    selectedImages.forEach((image) => payload.append("images", image.file));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setStatus("error");
        setErrorMessage(data.error || "Servis talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
        return;
      }

      setStatus("success");
      resetImages();
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
          {CONTACT_SUCCESS_MESSAGE}
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
          <input id="service-phone" name="phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="5321234567" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-email" className={labelClass}>E-posta</label>
          <input id="service-email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-device-type" className={labelClass}>Cihaz Türü</label>
          <input id="service-device-type" name="deviceType" type="text" required className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-brand" className={labelClass}>Marka</label>
          <input id="service-brand" name="brand" type="text" required className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-model" className={labelClass}>Model</label>
          <input id="service-model" name="model" type="text" required className={inputClass} />
        </div>
        <div className="space-y-2.5">
          <label htmlFor="service-serial-number" className={labelClass}>Seri Numarası</label>
          <input id="service-serial-number" name="serialNumber" type="text" className={inputClass} />
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <label htmlFor="service-fault" className={labelClass}>Arıza / Problem Açıklaması</label>
        <textarea id="service-fault" name="fault" rows={5} required className={`${inputClass} resize-none`} />
      </div>

      <div className="mt-5 space-y-2.5">
        <label htmlFor="service-notes" className={labelClass}>Ek Not</label>
        <textarea id="service-notes" name="notes" rows={3} className={`${inputClass} resize-none`} />
      </div>

      <div className="mt-5 space-y-2.5">
        <span className={labelClass}>Fotoğraf Yükleme</span>
        <label htmlFor="service-images" className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center transition hover:border-cyan-400 hover:bg-cyan-50">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-cyan-700 shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
              <path d="M12 16V4M7 9l5-5 5 5M4 20h16" />
            </svg>
          </span>
          <span className="mt-4 text-sm font-black text-zinc-950">
            {selectedImages.length > 0 ? `${selectedImages.length} fotoğraf seçildi` : "Fotoğraf seçin"}
          </span>
          <span className="mt-1 text-xs font-semibold text-zinc-500">JPG, PNG veya WEBP - en fazla 5 fotoğraf</span>
        </label>
        <input
          ref={fileInputRef}
          id="service-images"
          name="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={handleImageChange}
        />

        {selectedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {selectedImages.map((image) => (
              <div key={image.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                <div className="relative aspect-square bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.previewUrl} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-bold text-zinc-700">{image.file.name}</p>
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="w-full rounded-full border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-700 transition hover:bg-red-50"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
