import Link from 'next/link';
import prisma from "@/lib/prisma";

export default async function Footer() {
  let footerText = "Modern Endüstri İçin Gelişmiş Kimyasal Çözümler";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: 'footer_text' } });
    if (setting && setting.value) {
      footerText = setting.value;
    }
  } catch(e) {}

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 py-16 mt-auto border-t border-zinc-900">
      <div className="container mx-auto px-4 text-center flex flex-col items-center">
        {/* Brand */}
        <h2 className="text-2xl font-extrabold mb-4 tracking-tight text-white flex items-center gap-2">
          PERİYOT<span className="text-zinc-500 font-medium">LAB</span>
        </h2>
        
        {/* Slogan */}
        <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">{footerText}</p>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-12">
          <Link href="/about" className="hover:text-white transition-colors">Hakkımızda</Link>
          <Link href="/products" className="hover:text-white transition-colors">Ürünler</Link>
          <Link href="/bakim-onarim" className="hover:text-white transition-colors">Bakım Onarım</Link>
          <Link href="/contact" className="hover:text-white transition-colors">İletişim</Link>
        </div>
        
        {/* Copyright */}
        <div className="w-full max-w-lg border-t border-zinc-900 pt-8 text-xs text-zinc-600 flex justify-center items-center">
          <span>&copy; {new Date().getFullYear()} PeriyotLab. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
}
