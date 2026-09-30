import Link from 'next/link';
import prisma from "@/lib/prisma";

import { notFound } from 'next/navigation';
import { CONTACT_SETTING_KEYS, getWhatsappHref, resolveContactInfo, type ContactSettings } from "@/lib/contactInfo";
import { isProductHidden } from "@/lib/productVisibility";

const FILE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pdf:   { label: 'PDF',   color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'PDF' },
  xlsx:  { label: 'Excel', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: 'XLS' },
  docx:  { label: 'Word',  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: 'DOC' },
  pptx:  { label: 'PPT',   color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: 'PPT' },
  other: { label: 'Dosya', color: '#71717a', bg: '#f4f4f5', border: '#d4d4d8', icon: 'DOSYA' },
};

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    return await prisma.product.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

async function getContactSettings() {
  const settings: ContactSettings = {};

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...CONTACT_SETTING_KEYS] } },
    });

    rows.forEach((row) => {
      settings[row.key as keyof ContactSettings] = row.value;
    });
  } catch {}

  return settings;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product || await isProductHidden(id)) notFound();

  const docConfig = product.documentType
    ? FILE_TYPE_CONFIG[product.documentType] ?? FILE_TYPE_CONFIG['other']
    : null;
  const contactInfo = resolveContactInfo(await getContactSettings());
  const whatsappHref = getWhatsappHref(
    contactInfo.whatsapp || contactInfo.phone,
    `Merhaba, ${product.name} için fiyat ve ürün bilgisi almak istiyorum.`
  );

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-foreground mb-8 transition-colors"
      >
        ← Ürünlere Dön
      </Link>

      <div className="border border-gray-200 dark:border-gray-800 p-8 md:p-12 group">
        <div className="mb-6">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
        </div>

        {product.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <img src={product.imageUrl} alt={product.name} className="w-full max-h-[400px] object-cover" />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-8">{product.name}</h1>

        <div className="mb-12">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {product.description}
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
          <h2 className="text-2xl font-black tracking-tight text-zinc-950">Fiyat Bilgisi</h2>
          <p className="mt-3 text-base leading-7 text-zinc-700">
            Güncel fiyat ve temin bilgisi için ürün adını belirterek bizimle iletişime geçebilirsiniz.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex justify-center rounded-full bg-zinc-950 px-7 py-4 text-base font-black text-white transition hover:bg-cyan-700"
            >
              Fiyat İçin İletişime Geçin
            </a>
            <Link
              href="/contact"
              className="inline-flex justify-center rounded-full border border-cyan-200 bg-white px-7 py-4 text-base font-bold text-zinc-950 transition hover:border-cyan-400 hover:text-cyan-800"
            >
              İletişim Formu
            </Link>
          </div>
        </div>

        {product.documentUrl && docConfig && (
          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Ürün Belgesi</h3>
            <a
              href={product.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 group/doc"
              style={{ borderColor: docConfig.border, background: docConfig.bg }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: '#fff', border: `1.5px solid ${docConfig.border}` }}
              >
                {docConfig.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 truncate">
                  {product.documentTitle || 'Belgeyi İndir'}
                </p>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: docConfig.color }}
                >
                  {docConfig.label} Dosyası
                </span>
              </div>
              <div className="flex-shrink-0" style={{ color: docConfig.color }}>
                <svg className="w-5 h-5 group-hover/doc:translate-y-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </div>
            </a>
          </div>
        )}


      </div>
    </div>
  );
}
