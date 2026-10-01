import Link from "next/link";
import prisma from "@/lib/prisma";
import { SITE_NAME } from "@/lib/seo";
import CustomManufacturingRequestForm from "./CustomManufacturingRequestForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Özel İmalat | ${SITE_NAME}`,
  description: "PeriyotLAB özel laboratuvar cihazı ve sistem çözümlerini inceleyin.",
  alternates: {
    canonical: "/ozel-imalat",
  },
};

async function getPublishedItems() {
  try {
    return await prisma.customManufacturingItem.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

const processItems = [
  "Kullanım amacının belirlenmesi",
  "Teknik gereksinimlerin değerlendirilmesi",
  "Uygun tasarımın oluşturulması",
  "İmalat / montaj",
  "Kontrol ve test",
  "Teslim",
];

export default async function CustomManufacturingPage() {
  const items = await getPublishedItems();

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">
              Özel İmalat
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              İhtiyacınıza Özel Laboratuvar Çözümleri
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-200 md:text-xl">
              Standart ürünlerin yeterli olmadığı uygulamalarda, kullanım ihtiyacına ve teknik gereksinimlere göre özel cihaz ve sistem çözümleri geliştiriyoruz.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#ozel-imalat-talep" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-base font-black text-zinc-950 transition hover:bg-white">
                Özel İmalat Talebi Oluştur
              </a>
              <Link href="/contact" className="inline-flex justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/20">
                Bizimle İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Yaklaşım</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              İhtiyaca Göre Tasarım ve Üretim
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Özel imalat süreci, kullanım senaryosunu ve teknik gereksinimleri netleştirerek ilerler. Uygun görülen projelerde tasarım, imalat, montaj, kontrol ve teslim adımları planlanır.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {processItems.map((item, index) => (
              <div key={item} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-black text-cyan-800">
                    {index + 1}
                  </span>
                  <p className="text-base font-black leading-6 text-zinc-950">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Çalışmalar</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              Özel İmalat Çalışmalarımız
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              Admin panelden yayına alınan özel imalat cihaz ve sistem çalışmalarını burada inceleyebilirsiniz.
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <Link key={item.id} href={`/ozel-imalat/${item.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-[#f5f7f8] shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10">
                  <div className="h-64 overflow-hidden bg-zinc-900">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center text-sm font-bold text-zinc-400">Kapak görseli eklenmedi</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-4 inline-flex w-fit rounded-full bg-cyan-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-cyan-800">
                      Özel İmalat
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-zinc-950 group-hover:text-cyan-800">{item.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-zinc-600">{item.shortDescription}</p>
                    {item.usageArea && (
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Kullanım Alanı: {item.usageArea}</p>
                    )}
                    <div className="mt-auto pt-6 text-xs font-bold uppercase tracking-[0.2em] text-zinc-950">
                      Detayları Gör <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-[#f5f7f8] p-10 text-center">
              <h3 className="text-2xl font-black text-zinc-950">Özel imalat çalışmalarımız yakında burada yer alacak.</h3>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Bu alan admin panelden yayına alınan özel imalat kayıtlarıyla otomatik dolacaktır.
              </p>
            </div>
          )}
        </div>
      </section>

      <section id="ozel-imalat-talep" className="scroll-mt-28 py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Proje Talebi</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">
              Uygulamanızı birlikte netleştirelim.
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Teknik gereksinimler, çalışma koşulları ve kullanım amacı netleştikçe uygun çözüm kapsamı değerlendirilebilir.
            </p>
          </div>
          <CustomManufacturingRequestForm />
        </div>
      </section>
    </div>
  );
}
