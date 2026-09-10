import Link from 'next/link';

const quickActions = [
  {
    href: "/admin/products",
    title: "Ürünleri Düzenle",
    description: "Sitedeki ürünleri görün, düzenleyin veya silin.",
    icon: ["M4 7h16M4 12h16M4 17h16"],
  },
  {
    href: "/admin/products/new",
    title: "Yeni Ürün Ekle",
    description: "Yeni ürün adı, açıklaması, görseli ve belgesini ekleyin.",
    icon: ["M12 5v14", "M5 12h14"],
  },
  {
    href: "/admin/hero-slides",
    title: "Vitrin Resimleri",
    description: "Ana sayfadaki büyük görselleri ve başlıkları değiştirin.",
    icon: ["M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z", "m8 13 2.5-2.5L14 14l2-2 2 2"],
  },
  {
    href: "/admin/maintenance",
    title: "Bakım Onarım",
    description: "Bakım onarım sayfasındaki metinleri sade biçimde güncelleyin.",
    icon: ["M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.4 2.4-2.6-2.6 2-2.8Z"],
  },
  {
    href: "/admin/about",
    title: "Hakkımızda",
    description: "Firma tanıtım yazılarını düzenleyin.",
    icon: ["M5 4h14v16H5z", "M8 8h8M8 12h8M8 16h5"],
  },
  {
    href: "/admin/partners",
    title: "Ortaklar",
    description: "Çalışma ortaklarını ekleyin veya güncelleyin.",
    icon: ["M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM3 21a5 5 0 0 1 10 0M11 21a5 5 0 0 1 10 0"],
  },
  {
    href: "/admin/settings",
    title: "Site Ayarları",
    description: "Telefon, adres, ana sayfa yazıları ve genel bilgileri değiştirin.",
    icon: ["M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z", "M4 12h2M18 12h2M12 4v2M12 18v2"],
  },
];

export default function AdminHomePage() {
  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="text-base font-semibold text-cyan-700">Yönetim Paneli</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">Ne yapmak istiyorsunuz?</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Sitedeki önemli alanlara buradan kolayca ulaşabilirsiniz. Büyük kutulardan birini seçmeniz yeterli.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                {action.icon.map((path) => <path key={path} d={path} />)}
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-black text-slate-950 group-hover:text-cyan-800">{action.title}</h2>
            <p className="mt-2 text-base leading-7 text-slate-600">{action.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-cyan-200 bg-cyan-50 p-6">
        <h2 className="text-xl font-black text-slate-950">Kısa hatırlatma</h2>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Yaptığınız değişiklikler kaydet düğmesine bastıktan sonra sitede görünür. Emin olmadığınız alanları boş bırakabilirsiniz; site kendi hazır metinlerini kullanır.
        </p>
      </div>
    </div>
  );
}
