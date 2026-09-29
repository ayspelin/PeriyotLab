"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICE_STATUS_LABELS, type ServiceStatus } from "@/lib/serviceStatus";

export type ServiceSummary = {
  id: string;
  trackingCode: string;
  customerName: string;
  companyName: string;
  deviceType: string;
  brand: string;
  model: string;
  receivedDate: string;
  status: ServiceStatus;
};

export type ServiceRequestSummary = {
  id: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  deviceType: string;
  brand: string;
  model: string;
  createdAt: string;
  status: string;
  serviceRecord?: {
    id: string;
    trackingCode: string;
  } | null;
};

type Props = {
  initialServices: ServiceSummary[];
  initialRequests: ServiceRequestSummary[];
  initiallyLoaded: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export default function ServicesAdminClient({ initialServices, initialRequests, initiallyLoaded }: Props) {
  const [services, setServices] = useState(initialServices);
  const [requests, setRequests] = useState(initialRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initiallyLoaded ? "" : "Servis yönetimi verileri şu anda alınamadı.");
  const [message, setMessage] = useState("");
  const [convertingId, setConvertingId] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [servicesResponse, requestsResponse] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/service-requests"),
      ]);

      if (!servicesResponse.ok || !requestsResponse.ok) {
        throw new Error("Servis yönetimi verileri alınamadı.");
      }

      const servicesResult = await servicesResponse.json();
      const requestsResult = await requestsResponse.json();
      setServices(servicesResult.services || []);
      setRequests(requestsResult.requests || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Servis yönetimi verileri alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function convertRequest(id: string) {
    setConvertingId(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/service-requests/${id}/convert`, { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Servis talebi kayda dönüştürülemedi.");
      }

      setMessage(`Servis kaydı oluşturuldu. Takip Kodu: ${result.service.trackingCode}`);
      await loadData();
    } catch (convertError) {
      setError(convertError instanceof Error ? convertError.message : "Servis talebi kayda dönüştürülemedi.");
    } finally {
      setConvertingId("");
    }
  }

  async function copyTrackingCode(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setMessage(`Takip kodu kopyalandı: ${code}`);
    } catch {
      setMessage(`Takip kodu: ${code}`);
    }
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Servis Yönetimi</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Servis Takip Kayıtları</h1>
          <p className="mt-2 max-w-3xl text-lg leading-8 text-slate-600">
            Cihaz kabul kayıtlarını oluşturun, durumlarını güncelleyin ve servis taleplerini takip koduna dönüştürün.
          </p>
        </div>
        <Link href="/admin/services/new" className="inline-flex justify-center rounded-lg bg-cyan-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-950">
          Yeni Servis Kaydı
        </Link>
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

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-black text-slate-950">Servis Kayıtları</h2>
          <button type="button" onClick={loadData} disabled={loading} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800 disabled:opacity-60">
            {loading ? "Yenileniyor..." : "Yenile"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Servis No</th>
                <th className="px-5 py-4">Müşteri</th>
                <th className="px-5 py-4">Cihaz</th>
                <th className="px-5 py-4">Marka / Model</th>
                <th className="px-5 py-4">Kabul Tarihi</th>
                <th className="px-5 py-4">Durum</th>
                <th className="px-5 py-4">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service.id} className="align-top">
                  <td className="px-5 py-4 font-black text-slate-950">{service.trackingCode}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{service.customerName}</p>
                    <p className="mt-1 text-slate-500">{service.companyName}</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">{service.deviceType}</td>
                  <td className="px-5 py-4 text-slate-700">{service.brand} / {service.model}</td>
                  <td className="px-5 py-4 text-slate-700">{formatDate(service.receivedDate)}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800">
                      {SERVICE_STATUS_LABELS[service.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/services/${service.id}`} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700">
                        Görüntüle
                      </Link>
                      <button type="button" onClick={() => copyTrackingCode(service.trackingCode)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
                        Kopyala
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && services.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-base font-semibold text-slate-500">
                    Henüz servis kaydı yok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-xl font-black text-slate-950">Web Servis Talepleri</h2>
          <p className="mt-1 text-sm text-slate-500">Bu talepler cihaz kabulü değildir; admin onayıyla servis kaydına dönüştürülür.</p>
        </div>
        <div className="grid gap-4 p-5">
          {requests.map((request) => (
            <article key={request.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-950">{request.customerName}</h3>
                    <span className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-slate-600">{formatDate(request.createdAt)}</span>
                    {request.serviceRecord && (
                      <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Dönüştürüldü: {request.serviceRecord.trackingCode}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{request.companyName} · {request.phone} · {request.email}</p>
                  <p className="mt-2 text-sm text-slate-700">{request.deviceType} · {request.brand} / {request.model}</p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {request.serviceRecord ? (
                    <Link href={`/admin/services/${request.serviceRecord.id}`} className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
                      Kaydı Aç
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => convertRequest(request.id)}
                      disabled={convertingId === request.id}
                      className="rounded-lg bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {convertingId === request.id ? "Dönüştürülüyor..." : "Servis Kaydına Dönüştür"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {!loading && requests.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-base font-semibold text-slate-500">
              Henüz web servis talebi yok.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
