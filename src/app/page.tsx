import HeroSlider from "@/components/home/HeroSlider";
import prisma from "@/lib/prisma";
import Link from "next/link";
import PartnersSection from "@/components/home/PartnersSection";
import { CONTACT_SETTING_KEYS, resolveContactInfo } from "@/lib/contactInfo";
import { absoluteUrl, LOGO_IMAGE_PATH, SITE_NAME, SITE_URL, homeMetadata } from "@/lib/seo";

export const metadata = homeMetadata;

type HomeHeroSlide = {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
};

type HomePartner = {
  id: string;
  name: string;
  imageUrl: string;
};

type HomeCustomManufacturingItem = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  coverImage: string | null;
  createdAt: Date;
};

type FeaturedContent = {
  type: "CUSTOM_MANUFACTURING";
  title: string;
  image: string | null;
  description: string;
  badge: string;
  href: string;
  createdAt: Date;
};

function buildOrganizationJsonLd(settings: Record<string, string>) {
  const contactInfo = resolveContactInfo(settings);
  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_IMAGE_PATH),
  };

  if (contactInfo.email) {
    organization.email = contactInfo.email;
  }

  if (contactInfo.phone) {
    organization.telephone = contactInfo.phone;
  }

  if (contactInfo.address) {
    organization.address = contactInfo.address.replace(/\s+/g, " ");
  }

  return organization;
}

const settingKeys = [
  "home_hero_badge",
  "home_hero_title",
  "home_hero_desc",
  "home_vision_title",
  "home_vision_desc",
  "home_stat_1_value",
  "home_stat_1_label",
  "home_stat_2_value",
  "home_stat_2_label",
  "home_stat_3_value",
  "home_stat_3_label",
  "home_stat_4_value",
  "home_stat_4_label",
  "home_solution_1_image",
  "home_solution_2_image",
  "home_solution_3_image",
  ...CONTACT_SETTING_KEYS,
];

const serviceCards = [
  {
    title: "Ürün Tedariki",
    description: "Analitik reaktifler, sarf malzemeleri ve laboratuvar ihtiyaçları için seçilmiş tedarik ağı.",
    icon: "M20 7.5 12 3 4 7.5m16 0v9L12 21l-8-4.5v-9m16 0-8 4.5m-8-4.5 8 4.5m0 0V21",
  },
  {
    title: "Teknik Destek",
    description: "Ürün seçimi, servis yönlendirmesi ve kullanım sürecinde net, ulaşılabilir destek.",
    icon: "M12 3v3m0 12v3m9-9h-3M6 12H3m15.36-6.36-2.12 2.12M7.76 16.24l-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64",
  },
  {
    title: "Metot & Uygulama",
    description: "Laboratuvar süreçlerine uygun ürün eşleştirme, alternatif ve uygulama yönlendirmesi.",
    icon: "M10 2v7.31a2 2 0 0 1-.59 1.42L4.59 15.55A2 2 0 0 0 4 16.96V19a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2.04a2 2 0 0 0-.59-1.41l-4.82-4.82A2 2 0 0 1 14 9.31V2M8 2h8M7 17h10",
  },
  {
    title: "Bakım Onarım",
    description: "Laboratuvar cihazları için bakım planı, arıza tespiti ve servis yönlendirmesi.",
    icon: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3ZM16 2l6 6",
  },
];

const solutionCards = [
  {
    title: "Bakım ve Onarım Servisi",
    description: "Laboratuvar cihazları için arıza tespiti, bakım planı, onarım ve servis talebi tek akışta yönetilir.",
    imageKey: "home_solution_1_image",
    fallbackImage: "/mock/prod4.png",
    href: "/bakim-onarim",
    featured: true,
  },
  {
    title: "Teknik Destek",
    description: "Cihaz durumu, parça ihtiyacı ve süreç yönlendirmesi için ulaşılabilir destek.",
    imageKey: "home_solution_2_image",
    fallbackImage: "/mock/prod3.png",
    href: "/bakim-onarim",
  },
  {
    title: "Ürün Tedariki",
    description: "Servis ve laboratuvar süreçlerini destekleyen ürün ve sarf tedariki.",
    imageKey: "home_solution_3_image",
    fallbackImage: "/mock/prod1.png",
    href: "/products",
  },
];

export default async function Home() {
  let featuredCustomItems: HomeCustomManufacturingItem[] = [];
  let heroSlides: HomeHeroSlide[] = [];
  let partners: HomePartner[] = [];
  const settings: Record<string, string> = {};
  try {
    featuredCustomItems = await prisma.customManufacturingItem.findMany({
      where: {
        featured: true,
        published: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        coverImage: true,
        createdAt: true,
      },
    });
    heroSlides = await prisma.heroSlide.findMany({
      orderBy: { order: 'asc' }
    });
    partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    });
    const siteSettings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: settingKeys
        }
      }
    });
    siteSettings.forEach(s => {
      settings[s.key] = s.value;
    });
  } catch {}

  const featuredContent: FeaturedContent[] = [
    ...featuredCustomItems.map((item) => ({
      type: "CUSTOM_MANUFACTURING" as const,
      title: item.title,
      image: item.coverImage,
      description: item.shortDescription,
      badge: "Özel İmalat",
      href: `/ozel-imalat/${item.slug}`,
      createdAt: item.createdAt,
    })),
  ].slice(0, 6);

  const stats = [
    {
      value: settings.home_stat_1_value || "Çoklu",
      label: settings.home_stat_1_label || "ürün kategorisi",
    },
    {
      value: settings.home_stat_2_value || "Hızlı",
      label: settings.home_stat_2_label || "teklif akışı",
    },
    {
      value: settings.home_stat_3_value || "Belgeli",
      label: settings.home_stat_3_label || "tedarik süreci",
    },
    {
      value: settings.home_stat_4_value || "Uçtan uca",
      label: settings.home_stat_4_label || "laboratuvar desteği",
    },
  ];
  const homeSolutionCards = solutionCards.map((card) => ({
    ...card,
    image: settings[card.imageKey] || card.fallbackImage,
  }));
  const organizationJsonLd = buildOrganizationJsonLd(settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col w-full bg-[#f5f7f8] text-zinc-950">
      <section className="relative w-full h-[82vh] min-h-[620px] lg:h-[88vh] overflow-hidden bg-black">
        <HeroSlider
          slides={heroSlides}
          badge={settings.home_hero_badge || "Laboratuvar Çözümleri"}
          title={settings.home_hero_title || "Endüstriyel laboratuvarlar için güvenilir kimyasal çözüm ortağı"}
          description={
            settings.home_hero_desc ||
            "PeriyotLab; kimyasal ürün tedariki, teknik destek ve bakım onarım ihtiyaçları için hızlı, düzenli ve güven veren bir çalışma alanı sunar."
          }
        />
      </section>

      <section className="relative -mt-16 z-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl border border-white/50 bg-white/90 shadow-2xl shadow-cyan-950/10 backdrop-blur overflow-hidden">
            {stats.map((stat) => (
              <div key={stat.label} className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r last:border-r-0 border-zinc-200/70">
                <div className="text-2xl md:text-3xl font-black tracking-tight text-zinc-950">{stat.value}</div>
                <div className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f5f7f8]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
              Çözüm Ekosistemi
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-zinc-950">
              Laboratuvar ihtiyacını tek bir akışta toparlayan yapı.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-600">
              Ürün seçimi, bakım onarım, teknik yönlendirme ve tedarik planını aynı marka deneyimi içinde sunan yalın bir sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {serviceCards.map((card) => (
              <div key={card.title} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-zinc-900 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d={card.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-zinc-950">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Çözümlerimiz</span>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-zinc-950 tracking-tight">Katalogdan daha fazlası.</h2>
              <p className="mt-4 text-zinc-600 text-lg leading-relaxed">
              Laboratuvarın günlük akışında servis, teknik destek ve gerekli ürün bilgilerine hızlı ulaşmak için sadeleştirilmiş başlıklar.
            </p>
          </div>
            <Link href="/bakim-onarim" className="inline-flex items-center gap-3 rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-cyan-700">
              Servis Talebi Oluştur
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {homeSolutionCards.map((card) => (
              <Link key={card.title} href={card.href} className={`group relative overflow-hidden rounded-2xl bg-zinc-950 text-white shadow-xl shadow-zinc-950/10 ${card.featured ? "min-h-[430px] lg:col-span-2" : "min-h-[360px]"}`}>
                <img src={card.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
                <div className={`relative z-10 flex flex-col justify-end p-7 ${card.featured ? "min-h-[430px] md:p-9" : "min-h-[360px]"}`}>
                  <h3 className={`font-black tracking-tight ${card.featured ? "text-3xl md:text-5xl" : "text-2xl"}`}>{card.title}</h3>
                  <p className={`mt-3 leading-6 text-white/80 ${card.featured ? "max-w-2xl text-base md:text-lg md:leading-8" : "text-sm"}`}>{card.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                    Detayları Gör <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featuredContent.length > 0 && (
        <section className="py-24 bg-[#f5f7f8] relative border-t border-zinc-200/60">
          <div className="container mx-auto px-4">
            <div className="mb-16 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Öne Çıkanlar</span>
              <h2 className="mt-3 text-3xl md:text-5xl font-black text-zinc-950 mb-4 tracking-tight">Öne Çıkan Özel Çalışmalar</h2>
              <p className="text-zinc-600 text-lg leading-relaxed">
                Özel imalat çalışmalarımızı ve laboratuvar süreçlerine göre hazırlanan çözümleri keşfedin.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredContent.map((item) => (
                <Link key={`${item.type}-${item.href}`} href={item.href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-950/10">
                  <div className="h-64 overflow-hidden bg-zinc-950">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-8 text-center text-sm font-bold text-zinc-400">Görsel eklenmedi</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="mb-5 inline-flex w-fit rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-800">
                      {item.badge}
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-zinc-950 transition-colors group-hover:text-cyan-800">{item.title}</h3>
                    <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-zinc-600">{item.description}</p>
                    <div className="mt-8 border-t border-zinc-100 pt-4 text-xs font-bold uppercase tracking-widest text-zinc-950">
                      İncele <span className="ml-2 transition-transform group-hover:translate-x-2" aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-zinc-950 p-8 text-white shadow-2xl shadow-cyan-950/10 md:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl">Cihazınız için servis desteği mi gerekiyor?</h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
                  Bakım, arıza tespiti ve onarım ihtiyacınızı bize iletin; teknik ekip süreci net bir şekilde değerlendirsin.
                </p>
              </div>
              <Link href="/bakim-onarim#servis-talep-formu" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-base font-black text-zinc-950 transition hover:bg-white">
                Servis Talebi Oluştur
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection partners={partners} />

      <section className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.14),transparent_30%)]" />
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px]" />

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-100 text-xs font-bold uppercase tracking-[0.2em] mb-8">
              Vizyonumuz
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight text-white leading-tight">
              {settings.home_vision_title || 'Laboratuvar Standartlarını Yükseltiyoruz'}
            </h2>
            <p className="text-xl text-zinc-300 leading-relaxed mb-10 max-w-3xl">
              {settings.home_vision_desc || 'PeriyotLab olarak, endüstriyel ve analitik laboratuvarların ihtiyaç duyduğu ürünleri daha düzenli, belgeli ve sürdürülebilir bir tedarik yaklaşımıyla sunuyoruz.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/about" className="inline-flex justify-center px-7 py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-cyan-100 hover:-translate-y-0.5 transition-all">
                Hakkımızda
              </Link>
              <Link href="/contact" className="inline-flex justify-center px-7 py-4 border border-white/20 text-white rounded-full font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                Uzmanla Görüş
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 md:p-8 backdrop-blur">
            <h3 className="text-2xl font-black tracking-tight mb-6">Neden PeriyotLab?</h3>
            <div className="space-y-4">
              {[
                "Ürün ve servis bilgilerini aynı akışta yönetme",
                "Servis taleplerini anlaşılır şekilde yönlendirme",
                "Bakım onarım anlatımını kolayca güncelleme",
                "İletişim ve kurumsal metinleri hızlıca düzenleme",
              ].map((item) => (
                <div key={item} className="flex gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-300 text-black">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5">
                      <path d="m5 10 3 3 7-7" />
                    </svg>
                  </span>
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
