"use client";

import Link from "next/link";
import ServiceRecordForm, { type ServiceFormRecord } from "../ServiceRecordForm";

export default function NewServiceRecordPage() {
  const initialService: ServiceFormRecord = {};

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/services" className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-black">
          ← Servis Yönetimine Dön
        </Link>
        <p className="mt-5 text-base font-semibold text-cyan-700">Yeni Servis Kaydı</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Cihaz Kabul Kaydı Oluştur</h1>
        <p className="mt-2 max-w-2xl text-lg leading-8 text-slate-600">
          Kayıt kaydedildiğinde sistem otomatik olarak benzersiz bir servis takip kodu oluşturur.
        </p>
      </div>

      <ServiceRecordForm mode="create" initialService={initialService} />
    </div>
  );
}
