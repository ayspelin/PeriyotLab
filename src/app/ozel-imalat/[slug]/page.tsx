import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { normalizeGalleryImages, normalizeTechnicalSpecifications } from "@/lib/customManufacturing";

export const dynamic = "force-dynamic";

async function getItem(slug: string) {
  try {
    return await prisma.customManufacturingItem.findFirst({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) {
    return {
      title: "Özel İmalat | PeriyotLab",
    };
  }

  return {
    title: `${item.title} | Özel İmalat | PeriyotLab`,
    description: item.shortDescription,
    alternates: {
      canonical: `/ozel-imalat/${item.slug}`,
    },
  };
}

export default async function CustomManufacturingDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) {
    notFound();
  }

  const specs = normalizeTechnicalSpecifications(item.technicalSpecifications);
  const gallery = normalizeGalleryImages(item.galleryImages);

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-zinc-950">
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link href="/ozel-imalat" className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-950">
            ← Özel İmalata Dön
          </Link>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-xl shadow-cyan-950/5">
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} className="h-full max-h-[520px] min-h-[320px] w-full object-cover" />
              ) : (
                <div className="flex min-h-[360px] items-center justify-center p-8 text-center text-sm font-bold text-zinc-400">
                  Kapak görseli eklenmedi
                </div>
              )}
            </div>

            <div>
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
                Özel İmalat
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-950 md:text-6xl">{item.title}</h1>
              <p className="mt-6 text-lg leading-8 text-zinc-600">{item.shortDescription}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/ozel-imalat#ozel-imalat-talep" className="inline-flex justify-center rounded-full bg-zinc-950 px-7 py-4 text-base font-black text-white transition hover:bg-cyan-700">
                  Bilgi / Teklif Talebi
                </Link>
                <Link href="/contact" className="inline-flex justify-center rounded-full border border-zinc-300 bg-white px-7 py-4 text-base font-bold text-zinc-950 transition hover:border-cyan-300 hover:text-cyan-800">
                  Bizimle İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-black tracking-tight text-zinc-950">Açıklama</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8 text-zinc-600">{item.description}</p>

            {(item.usageArea || item.applicationArea) && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {item.usageArea && (
                  <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Kullanım Amacı</p>
                    <p className="mt-2 text-base font-black text-zinc-950">{item.usageArea}</p>
                  </div>
                )}
                {item.applicationArea && (
                  <div className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Uygulama Alanı</p>
                    <p className="mt-2 text-base font-black text-zinc-950">{item.applicationArea}</p>
                  </div>
                )}
              </div>
            )}

            {item.projectNotes && (
              <div className="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <h3 className="text-xl font-black text-zinc-950">Üretim / Proje Notları</h3>
                <p className="mt-3 whitespace-pre-line text-base leading-7 text-zinc-700">{item.projectNotes}</p>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            {specs.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black tracking-tight text-zinc-950">Teknik Özellikler</h2>
                <dl className="mt-5 divide-y divide-zinc-100">
                  {specs.map((spec) => (
                    <div key={`${spec.key}-${spec.value}`} className="grid grid-cols-[0.85fr_1.15fr] gap-4 py-4 text-sm">
                      <dt className="font-bold text-zinc-500">{spec.key}</dt>
                      <dd className="font-semibold text-zinc-950">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {item.videoUrl && (
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-cyan-300 hover:text-cyan-800">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Video</p>
                <p className="mt-2 text-lg font-black text-zinc-950">Video bağlantısını aç</p>
              </a>
            )}
          </aside>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-black tracking-tight text-zinc-950">Galeri</h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image, index) => (
                <a key={`${image.url}-${index}`} href={image.url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
                  <img src={image.url} alt={image.alt || `${item.title} galeri görseli`} className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
