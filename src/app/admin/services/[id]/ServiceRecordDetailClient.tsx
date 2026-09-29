"use client";

import { useState } from "react";
import Link from "next/link";
import ServiceRecordForm, { type ServiceFormRecord } from "../ServiceRecordForm";
import { SERVICE_STATUSES, SERVICE_STATUS_LABELS, type ServiceStatus, type ServiceHistoryItem } from "@/lib/serviceStatus";

type ServiceDetail = ServiceFormRecord & {
  id: string;
  trackingCode: string;
  status: ServiceStatus;
  serviceHistory: ServiceHistoryItem[];
  sourceRequest?: {
    id: string;
    customerName: string;
    companyName: string;
    createdAt: string;
  } | null;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type Props = {
  serviceId: string;
  initialService: ServiceDetail | null;
  initialError: string;
};

export default function ServiceRecordDetailClient({ serviceId, initialService, initialError }: Props) {
  const [service, setService] = useState<ServiceDetail | null>(initialService);
  const [selectedStatus, setSelectedStatus] = useState<ServiceStatus>(initialService?.status || "RECEIVED");
  const [statusNote, setStatusNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState(initialError);
  const [message, setMessage] = useState("");

  async function loadService() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Servis kaydı alınamadı.");
      }

      setService(result.service);
      setSelectedStatus(result.service.status);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Servis kaydı alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatusLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/services/${serviceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus, note: statusNote }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Servis durumu güncellenemedi.");
      }

      setStatusNote("");
      setMessage("Servis durumu güncellendi.");
      await loadService();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "Servis durumu güncellenemedi.");
    } finally {
      setStatusLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <p className="text-base font-semibold text-slate-500">Servis kaydı yükleniyor...</p>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="max-w-4xl">
        <Link href="/admin/services" className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-black">
          ← Servis Yönetimine Dön
        </Link>
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-800">
          {error}
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <Link href="/admin/services" className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-black">
          ← Servis Yönetimine Dön
        </Link>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-base font-semibold text-cyan-700">Servis Kaydı</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{service.trackingCode}</h1>
            <p className="mt-2 text-lg leading-8 text-slate-600">{service.customerName} · {service.deviceType}</p>
          </div>
          <Link href="/servis-takip" target="_blank" className="inline-flex justify-center rounded-lg bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-cyan-700">
            Public Takip Sayfası
          </Link>
        </div>
      </div>

      {message && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <aside className="space-y-5">
          <form onSubmit={updateStatus} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Durum Güncelle</h2>
            <label className="mt-5 block space-y-2">
              <span className="text-sm font-bold text-slate-700">Güncel Durum</span>
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as ServiceStatus)} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600">
                {SERVICE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {SERVICE_STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block space-y-2">
              <span className="text-sm font-bold text-slate-700">Timeline Notu</span>
              <textarea rows={3} value={statusNote} onChange={(event) => setStatusNote(event.target.value)} placeholder="Boş bırakılırsa varsayılan açıklama eklenir." className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600" />
            </label>
            <button type="submit" disabled={statusLoading} className="mt-5 w-full rounded-lg bg-cyan-600 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
              {statusLoading ? "Güncelleniyor..." : "Durumu Güncelle"}
            </button>
          </form>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Servis Geçmişi</h2>
            <div className="mt-5 space-y-4">
              {service.serviceHistory.map((historyItem, index) => (
                <div key={`${historyItem.status}-${historyItem.date}-${index}`} className="border-l-4 border-cyan-500 pl-4">
                  <p className="text-sm font-black text-slate-950">{SERVICE_STATUS_LABELS[historyItem.status]}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{formatDateTime(historyItem.date)}</p>
                  {historyItem.note && <p className="mt-2 text-sm leading-6 text-slate-600">{historyItem.note}</p>}
                </div>
              ))}
            </div>
          </div>

          {service.sourceRequest && (
            <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5">
              <h2 className="text-lg font-black text-slate-950">Servis Talebinden Oluşturuldu</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {service.sourceRequest.customerName} · {service.sourceRequest.companyName}
              </p>
              <p className="mt-1 text-xs font-bold text-cyan-800">{formatDateTime(service.sourceRequest.createdAt)}</p>
            </div>
          )}
        </aside>

        <ServiceRecordForm mode="edit" serviceId={service.id} initialService={service} onSaved={(savedService) => setService((current) => current ? { ...current, ...savedService } : current)} />
      </div>
    </div>
  );
}
