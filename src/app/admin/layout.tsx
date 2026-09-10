import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

const adminLinks = [
  { href: "/admin", label: "Başlangıç", icon: ["M4 10.5 12 4l8 6.5", "M6.5 10v9h11v-9", "M10 19v-5h4v5"] },
  { href: "/admin/products", label: "Ürünler", icon: ["M4 7h16M4 12h16M4 17h16"] },
  { href: "/admin/products/new", label: "Yeni Ürün", icon: ["M12 5v14", "M5 12h14"] },
  { href: "/admin/hero-slides", label: "Vitrin Resimleri", icon: ["M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z", "m8 13 2.5-2.5L14 14l2-2 2 2"] },
  { href: "/admin/maintenance", label: "Bakım Onarım", icon: ["M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-2.6 2-2.8Z"] },
  { href: "/admin/about", label: "Hakkımızda", icon: ["M5 4h14v16H5z", "M8 8h8M8 12h8M8 16h5"] },
  { href: "/admin/partners", label: "Ortaklar", icon: ["M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 21a5 5 0 0 1 10 0M11 21a5 5 0 0 1 10 0"] },
  { href: "/admin/settings", label: "Site Ayarları", icon: ["M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z", "M4 12h2M18 12h2M12 4v2M12 18v2"] },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 text-slate-900 md:flex-row">
      <aside className="z-20 flex w-full flex-shrink-0 flex-col bg-slate-950 text-white shadow-xl md:w-[290px]">
        <div className="border-b border-white/10 p-6">
          <Link href="/admin" className="flex items-center justify-center">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <svg className="h-5 w-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.3" />
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              PERİYOT<span className="font-medium text-zinc-500">LAB</span> Yönetim
            </h2>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-4 text-base font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg className="h-5 w-5 flex-shrink-0 text-cyan-200/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon.map((path) => <path key={path} d={path} />)}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-6">
          <div className="mb-4 text-sm">
            <span className="mb-1 block text-xs text-slate-400">Oturum açan:</span>
            <strong className="break-all text-white">{session.user?.email}</strong>
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-10 flex h-[72px] flex-shrink-0 items-center justify-end border-b border-zinc-200 bg-white px-5 shadow-sm md:px-8">
          <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-cyan-700">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 1 7.07 0l1.41 1.41a5 5 0 0 1-7.07 7.07L10 20.07" />
              <path d="M14 11a5 5 0 0 1-7.07 0L5.52 9.59a5 5 0 0 1 7.07-7.07L14 3.93" />
            </svg>
            Ana Sayfaya Git
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
