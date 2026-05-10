import HeroSlider from "@/components/home/HeroSlider";
import prisma from "@/lib/prisma";

import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import PartnersSection from "@/components/home/PartnersSection";
export default async function Home() {
  let featuredProducts: any[] = [];
  let heroSlides: any[] = [];
  let partners: any[] = [];
  let settings: Record<string, string> = {};
  try {
    featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' }
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
          in: ['home_vision_title', 'home_vision_desc']
        }
      }
    });
    siteSettings.forEach(s => {
      if (s.key === 'home_vision_title') settings.home_vision_title = s.value;
      if (s.key === 'home_vision_desc') settings.home_vision_desc = s.value;
    });
  } catch (e) {
    console.error("Database error in Home:", e);
  }

  return (
    <div className="flex flex-col w-full bg-[#f8f9fa]">
      
      {/* Premium Full-Width Hero Section */}
      <section className="relative w-full h-[70vh] min-h-[500px] lg:h-[85vh] overflow-hidden bg-black">
        <HeroSlider slides={heroSlides} />
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-zinc-100 relative border-t border-zinc-200/60">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4 tracking-tight">Öne Çıkan Ürünler</h2>
              <p className="text-zinc-500 text-lg">
                Laboratuvarınız için en çok tercih edilen ve son eklenen yüksek saflıkta çözümlerimiz.
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-zinc-500 transition-colors">
              Tümünü Gör <span className="text-lg">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {featuredProducts.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-zinc-300 text-zinc-500 flex flex-col items-center shadow-sm">
                <span className="text-4xl mb-4 text-zinc-300">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 2v7.31M14 2v7.31M8.5 2h7M7 21h10a2 2 0 0 0 2-2v-1.72a2 2 0 0 0-.59-1.41l-4.83-4.83a2 2 0 0 1-.58-1.41V2a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v7.63a2 2 0 0 1-.58 1.41l-4.83 4.83A2 2 0 0 0 1 17.28V19a2 2 0 0 0 2 2z"/>
                  </svg>
                </span>
                <p className="font-medium text-lg text-black">Henüz sistemde ürün bulunmuyor.</p>
                <p className="text-sm mt-2">Yönetici panelinden yeni ürünler ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* Short Company Intro */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Decorative Circular Pattern */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <svg className="w-[1000px] h-[1000px] text-white animate-[spin_60s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.2">
             <path d="M50 0 A50 50 0 1 1 49.9 0" />
             <path d="M50 10 A40 40 0 1 1 49.9 10" />
             <path d="M50 20 A30 30 0 1 1 49.9 20" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-8">
            Vizyonumuz
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight text-white leading-tight">
            {settings.home_vision_title || 'Laboratuvar Standartlarını Yükseltiyoruz'}
          </h2>
          <p className="text-xl text-zinc-400 leading-relaxed mb-12 max-w-3xl mx-auto">
            {settings.home_vision_desc || 'PeriyotLab olarak, endüstriyel ve analitik laboratuvarların ihtiyaç duyduğu en yüksek saflıkta kimyasal bileşenleri sağlıyoruz. Güvenlik, kalite ve sürdürülebilirlik odaklı yaklaşımımızla sektörde fark yaratıyoruz.'}
          </p>
          <Link href="/about" className="inline-flex px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-zinc-200 hover:shadow-lg hover:-translate-y-1 transition-all">
            Hakkımızda Daha Fazla Bilgi
          </Link>
        </div>
      </section>
    </div>
  );
}
