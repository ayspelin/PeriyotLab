'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSliderProps {
  slides: {
    id: string;
    imageUrl: string;
    title: string | null;
    description: string | null;
  }[];
  badge: string;
  title: string;
  description: string;
}

export default function HeroSlider({ slides, badge, title, description }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  const defaultSlides = [
    {
      id: 'default-1',
      imageUrl: '/mock/hero1.png',
      title: 'Laboratuvar tedarik süreci daha düzenli',
      description: 'Ürünler, servis ihtiyaçları ve iletişim akışı tek çatı altında.',
    },
    {
      id: 'default-2',
      imageUrl: '/mock/hero2.png',
      title: 'Teknik ürün seçimi için güçlü vitrin',
      description: 'Öne çıkan çözümleri ve bakım onarım bilgisini yönetim panelinden güncelleyin.',
    },
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={slide.title || `Laboratuvar Görseli ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover scale-105"
            priority={index === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.28),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.66)_48%,rgba(0,0,0,0.22))]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
        <div className="max-w-4xl pt-20">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />
            {badge}
          </div>

          <h1 className="mt-7 text-4xl md:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight text-white max-w-4xl">
            {title}
          </h1>

          <p className="mt-7 max-w-2xl text-base md:text-xl leading-8 text-zinc-200">
            {description}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-sm font-black text-zinc-950 transition-all hover:-translate-y-0.5 hover:bg-white">
              Ürünleri İncele
            </Link>
            <Link href="/contact" className="inline-flex justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20">
              Uzmanla Görüş
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-3">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current ? "w-10 bg-cyan-300" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slayt ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-24 z-20 hidden max-w-sm rounded-2xl border border-white/15 bg-black/35 p-5 text-white shadow-2xl backdrop-blur-xl lg:block">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Vitrin</div>
        <h2 className="mt-3 text-2xl font-black tracking-tight">
          {activeSlides[current]?.title || "Laboratuvar çözümleri"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          {activeSlides[current]?.description || "PeriyotLab vitrininden öne çıkan başlıkları inceleyin."}
        </p>
      </div>
    </div>
  );
}
