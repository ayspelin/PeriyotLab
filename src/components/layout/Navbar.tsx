import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MobileMenu from "./MobileMenu";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/90 backdrop-blur-md text-zinc-900 shadow-sm transition-all">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-48 h-16">
            <Image 
              src="/logo.svg" 
              alt="PeriyotLab Logo" 
              fill 
              className="object-contain group-hover:opacity-80 transition-opacity" 
              unoptimized 
            />
          </div>
        </Link>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
          <Link href="/about" className="hover:text-black transition-colors">Hakkımızda</Link>
          <Link href="/products" className="hover:text-black transition-colors">Ürünler</Link>
          <Link href="/bakim-onarim" className="hover:text-black transition-colors">Bakım Onarım</Link>
          <Link href="/contact" className="hover:text-black transition-colors">İletişim</Link>
        </nav>

        {/* Right: Login & Management Conditional (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-[13px] font-bold uppercase tracking-wider">
          {!session ? (
            <Link href="/login" className="text-zinc-500 hover:text-black transition-colors px-6 py-2.5 rounded-full border border-zinc-200 hover:bg-zinc-50">
              Giriş
            </Link>
          ) : (
            <Link href="/admin" className="px-6 py-2.5 bg-black text-white rounded-full hover:bg-zinc-800 hover:shadow-md transition-all shadow-sm">
              Yönetim
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <MobileMenu session={session} />
      </div>
    </header>
  );
}
