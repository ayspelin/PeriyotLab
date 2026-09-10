import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const settingKeys = [
  "maintenance_badge",
  "maintenance_title",
  "maintenance_intro",
  "maintenance_step_1",
  "maintenance_step_2",
  "maintenance_step_3",
  "maintenance_note",
];

async function getMaintenanceSettings() {
  const map: Record<string, string> = {};

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: settingKeys } },
    });

    rows.forEach((row) => {
      map[row.key] = row.value;
    });
  } catch {
    return map;
  }

  return map;
}

export const metadata = {
  title: "Bakım Onarım | PeriyotLab",
  description: "PeriyotLab bakım onarım, servis yönlendirme ve teknik destek hizmetleri.",
};

export default async function MaintenancePage() {
  const settings = await getMaintenanceSettings();

  const steps = [
    settings.maintenance_step_1 || "Cihazın durumunu ve yaşanan arızayı birlikte netleştiririz.",
    settings.maintenance_step_2 || "Uygun bakım, onarım veya servis yönlendirmesini planlarız.",
    settings.maintenance_step_3 || "Gerekli parça, süre ve işlem bilgisini anlaşılır şekilde paylaşırız.",
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-zinc-950">
      <section className="relative overflow-hidden bg-black text-white">
        <img src="/mock/hero2.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">
              {settings.maintenance_badge || "Teknik Servis"}
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-black leading-tight tracking-tight">
              {settings.maintenance_title || "Bakım Onarım Hizmetleri"}
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-8 text-zinc-200">
              {settings.maintenance_intro || "Laboratuvar cihazlarınız için bakım, arıza tespiti, servis yönlendirmesi ve süreç takibi konusunda yanınızdayız."}
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-base font-black text-zinc-950 transition hover:bg-white">
                Servis Talebi İçin İletişime Geç
              </Link>
              <Link href="/products" className="inline-flex justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/20">
                Ürünleri İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Nasıl İlerliyoruz?</span>
              <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">Sade ve anlaşılır servis süreci</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                Bakım onarım taleplerinde karmaşık teknik anlatımlar yerine, yapılacak işlemi ve sonraki adımı açık şekilde paylaşırız.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-lg font-black text-cyan-800">
                      {index + 1}
                    </div>
                    <p className="text-lg leading-8 font-semibold text-zinc-800">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 md:p-8">
            <h3 className="text-2xl font-black text-zinc-950">Kısa Not</h3>
            <p className="mt-3 text-lg leading-8 text-zinc-700">
              {settings.maintenance_note || "Servis talebiniz için cihaz adı, marka-model ve yaşanan sorunu paylaşmanız yeterlidir. Ekibimiz sizinle en uygun adımı planlar."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
