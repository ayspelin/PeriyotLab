import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 w-full font-sans">
      {/* Sidebar - EXACT WeLab Replica */}
      <aside className="w-full md:w-[250px] bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex items-center justify-center">
          <Link href="/admin">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <svg className="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              PERİYOT<span className="text-zinc-500 font-medium">LAB</span> ADMIN
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-0 space-y-1">
          <Link href="/admin" className="flex items-center px-6 py-3 bg-zinc-800 border-l-4 border-white text-white text-sm font-medium transition-colors">
            📊 Ürünler
          </Link>
          <Link href="/admin/products/new" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            ➕ Yeni Ürün Ekle
          </Link>
          <Link href="/admin/hero-slides" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            🖼️ Banner Yönetimi
          </Link>
          <Link href="/admin/about" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            📝 Hakkımızda Yönetimi
          </Link>
          <Link href="/admin/partners" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            🤝 Çalışma Ortakları
          </Link>
          <Link href="/admin/documents" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            📁 Dökümanlar
          </Link>
          <Link href="/admin/settings" className="flex items-center px-6 py-3 text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent transition-colors text-sm font-medium">
            ⚙️ Site Ayarları
          </Link>

        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="mb-4 text-sm">
            <span className="block text-slate-400 mb-1 text-xs">Oturum açan:</span>
            <strong className="text-white">{session.user?.email}</strong>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b border-zinc-200 flex items-center justify-end px-8 flex-shrink-0 shadow-sm z-10">
          <Link href="/" target="_blank" className="bg-black text-white px-4 py-2 text-sm font-semibold rounded hover:bg-zinc-800 transition-colors flex items-center gap-2">
            🌍 Ana Sayfaya Git
          </Link>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
