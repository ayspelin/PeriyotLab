"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent scrolling when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="md:hidden flex items-center">
      <button 
        onClick={toggleMenu}
        className="p-2 text-zinc-600 hover:text-black focus:outline-none"
        aria-label="Toggle mobile menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Full Screen Overlay Menu */}
      {isOpen && (
        <div 
          className="fixed left-0 top-[80px] w-screen h-[calc(100dvh-80px)] z-40 bg-white border-t border-zinc-100"
        >
          <div className="flex flex-col p-8 space-y-8 text-lg font-bold uppercase tracking-widest text-zinc-500 h-full overflow-y-auto">
            <Link href="/" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === '/' ? 'text-black' : ''}`}>Ana Sayfa</Link>
            <Link href="/about" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === '/about' ? 'text-black' : ''}`}>Hakkımızda</Link>
            <Link href="/products" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === '/products' ? 'text-black' : ''}`}>Ürünler</Link>
            <Link href="/documents" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === '/documents' ? 'text-black' : ''}`}>Dökümanlar</Link>
            <Link href="/contact" onClick={closeMenu} className={`hover:text-black transition-colors ${pathname === '/contact' ? 'text-black' : ''}`}>İletişim</Link>
            
            <div className="pt-8 border-t border-zinc-100 mt-auto pb-8">
              {!session ? (
                <Link href="/login" onClick={closeMenu} className="block w-full text-center py-4 bg-zinc-100 text-black rounded-full hover:bg-zinc-200 transition-colors">
                  GİRİŞ YAP
                </Link>
              ) : (
                <Link href="/admin" onClick={closeMenu} className="block w-full text-center py-4 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-sm">
                  YÖNETİM PANELİ
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
