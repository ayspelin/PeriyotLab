import Link from "next/link";
import CustomManufacturingForm from "../CustomManufacturingForm";

export default function NewCustomManufacturingPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/custom-manufacturing" className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-black">
          ← Özel İmalata Dön
        </Link>
        <p className="mt-5 text-base font-semibold text-cyan-700">Yeni Özel İmalat</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Özel İmalat Çalışması Ekle</h1>
      </div>

      <CustomManufacturingForm mode="create" />
    </div>
  );
}
