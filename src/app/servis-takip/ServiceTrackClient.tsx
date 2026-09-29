"use client";

import { useState } from "react";

type TimelineItem = {
  status: string;
  label: string;
  fullLabel: string;
  date?: string;
  note?: string;
  state: "done" | "current" | "next";
};

type PublicService = {
  trackingCode: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber?: string | null;
  receivedDate: string;
  estimatedCompletionDate?: string | null;
  status: string;
  statusLabel: string;
  customerNote?: string | null;
  images?: Array<{ url: string; name: string }>;
  timeline: TimelineItem[];
  updatedAt: string;
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function StepIcon({ state }: { state: TimelineItem["state"] }) {
  if (state === "done") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4" aria-hidden="true">
          <path d="m5 10 3 3 7-7" />
        </svg>
      </span>
    );
  }

  if (state === "current") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-4 border-cyan-100 bg-cyan-600 shadow-sm">
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </span>
    );
  }

  return <span className="h-8 w-8 rounded-full border-2 border-slate-300 bg-white" />;
}

export default function ServiceTrackClient() {
  const [trackingCode, setTrackingCode] = useState("");
  const [service, setService] = useState<PublicService | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = trackingCode.trim().toUpperCase();

    if (!code) {
      setError("Lütfen servis takip kodunuzu giriniz.");
      setService(null);
      return;
    }

    setLoading(true);
    setError("");
    setService(null);

    try {
      const response = await fetch(`/api/service-track/${encodeURIComponent(code)}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Servis takip bilgisi alınamadı.");
        return;
      }

      setService(result.service);
    } catch {
      setError("Servis takip bilgisi şu anda alınamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-zinc-950">
      <section className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
              Servis Takip
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">
              Servis Durumunuzu Takip Edin
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600 md:text-xl">
              Servis takip kodunuzu girerek cihazınızın güncel durumunu görüntüleyebilirsiniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 grid max-w-3xl grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-3 shadow-sm md:grid-cols-[1fr_auto]">
            <label className="sr-only" htmlFor="trackingCode">
              Servis Takip Kodu
            </label>
            <input
              id="trackingCode"
              type="text"
              value={trackingCode}
              onChange={(event) => setTrackingCode(event.target.value.toUpperCase())}
              placeholder="PL-2026-00001"
              className="min-h-14 rounded-xl border border-zinc-200 bg-white px-5 text-base font-bold tracking-wide text-zinc-950 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-14 rounded-xl bg-zinc-950 px-6 text-base font-black text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sorgulanıyor..." : "Servis Durumunu Görüntüle"}
            </button>
          </form>

          {error && (
            <div className="mt-5 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-base font-semibold leading-7 text-amber-900">
              {error}
            </div>
          )}
        </div>
      </section>

      {service && (
        <section className="py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-cyan-950/5">
              <div className="border-b border-zinc-200 bg-zinc-950 p-6 text-white md:p-8">
                <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Servis No</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">{service.trackingCode}</h2>
                  </div>
                  <div className="inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-black uppercase tracking-wide text-zinc-950">
                    {service.statusLabel}
                  </div>
                </div>
              </div>

              <div className="grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                    <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Cihaz</p>
                      <p className="mt-2 text-lg font-black text-zinc-950">{service.deviceType}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Marka / Model</p>
                      <p className="mt-2 text-lg font-black text-zinc-950">
                        {service.brand} / {service.model}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Servise Kabul</p>
                      <p className="mt-2 text-lg font-black text-zinc-950">{formatDate(service.receivedDate)}</p>
                    </div>
                    {service.estimatedCompletionDate && (
                      <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Tahmini Tamamlanma</p>
                        <p className="mt-2 text-lg font-black text-zinc-950">{formatDate(service.estimatedCompletionDate)}</p>
                      </div>
                    )}
                  </div>

                  {service.customerNote && (
                    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-800">Servis Açıklaması</p>
                      <p className="mt-3 text-base leading-7 text-zinc-700">{service.customerNote}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-black tracking-tight text-zinc-950">Servis Geçmişi</h3>
                  <div className="mt-6 grid gap-3 md:grid-cols-7">
                    {service.timeline.map((item) => (
                      <div
                        key={item.status}
                        className={`rounded-2xl border p-4 ${
                          item.state === "current"
                            ? "border-cyan-300 bg-cyan-50"
                            : item.state === "done"
                              ? "border-emerald-200 bg-emerald-50/70"
                              : "border-zinc-200 bg-zinc-50"
                        }`}
                      >
                        <StepIcon state={item.state} />
                        <p className={`mt-4 text-sm font-black leading-snug ${item.state === "next" ? "text-zinc-400" : "text-zinc-950"}`}>
                          {item.label}
                        </p>
                        {item.date && (
                          <p className="mt-2 text-xs font-semibold text-zinc-500">{formatDate(item.date)}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {service.timeline.some((item) => item.note && item.state !== "next") && (
                    <div className="mt-6 space-y-3">
                      {service.timeline
                        .filter((item) => item.note && item.state !== "next")
                        .map((item) => (
                          <div key={`${item.status}-note`} className="rounded-2xl border border-zinc-200 bg-white p-4">
                            <p className="text-sm font-black text-zinc-950">{item.fullLabel}</p>
                            <p className="mt-1 text-sm leading-6 text-zinc-600">{item.note}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {service.images && service.images.length > 0 && (
                <div className="border-t border-zinc-200 p-6 md:p-8">
                  <h3 className="text-xl font-black text-zinc-950">Paylaşılan Görseller</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {service.images.map((image) => (
                      <a
                        key={image.url}
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50"
                      >
                        <img src={image.url} alt={image.name} className="h-48 w-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
