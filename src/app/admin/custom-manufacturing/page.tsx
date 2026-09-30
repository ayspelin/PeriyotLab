import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteCustomManufacturingItemButton from "@/components/admin/DeleteCustomManufacturingItemButton";
import ToggleCustomManufacturingFeaturedButton from "@/components/admin/ToggleCustomManufacturingFeaturedButton";
import ToggleCustomManufacturingVisibilityButton from "@/components/admin/ToggleCustomManufacturingVisibilityButton";

export const dynamic = "force-dynamic";

async function getItems() {
  try {
    const items = await prisma.customManufacturingItem.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { items, loaded: true };
  } catch {
    return { items: [], loaded: false };
  }
}

export default async function AdminCustomManufacturingPage() {
  const { items, loaded } = await getItems();

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Özel İmalat</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Özel İmalat Yönetimi</h1>
          <p className="mt-2 max-w-2xl text-lg leading-8 text-slate-600">
            Müşteri ihtiyacına göre geliştirilen cihaz ve sistem çalışmalarını buradan yönetin.
          </p>
        </div>
        <Link href="/admin/custom-manufacturing/new" className="inline-flex justify-center rounded-lg bg-cyan-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-950">
          Yeni Özel İmalat
        </Link>
      </div>

      {!loaded && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-base leading-7 text-amber-800">
          Özel imalat listesi şu anda alınamadı.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[96px_1fr_auto] md:items-center">
              <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-sm font-semibold text-slate-400">Görsel yok</div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{item.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{item.shortDescription}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-lg px-3 py-1 text-sm font-semibold ${item.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.published ? "Yayında" : "Taslak"}
                  </span>
                  {item.featured && (
                    <span className="rounded-lg bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800">Ana sayfada görünür</span>
                  )}
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">Sayfa adresi: /{item.slug}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                {item.published && (
                  <Link href={`/ozel-imalat/${item.slug}`} target="_blank" className="inline-flex justify-center rounded-lg border border-slate-300 px-5 py-3 text-base font-bold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-800">
                    Gör
                  </Link>
                )}
                <Link href={`/admin/custom-manufacturing/${item.id}/edit`} className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white transition hover:bg-cyan-700">
                  Düzenle
                </Link>
                <ToggleCustomManufacturingVisibilityButton id={item.id} title={item.title} published={item.published} />
                <ToggleCustomManufacturingFeaturedButton id={item.id} title={item.title} featured={item.featured} />
                <DeleteCustomManufacturingItemButton id={item.id} title={item.title} />
              </div>
            </div>
          </div>
        ))}

        {loaded && items.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-950">Henüz özel imalat kaydı yok.</h2>
            <p className="mt-2 text-base text-slate-600">İlk çalışmayı eklemek için aşağıdaki düğmeyi kullanabilirsiniz.</p>
            <Link href="/admin/custom-manufacturing/new" className="mt-5 inline-flex rounded-lg bg-cyan-600 px-6 py-4 text-base font-bold text-white transition hover:bg-slate-950">
              Yeni Özel İmalat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
