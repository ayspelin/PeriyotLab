import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const FILE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: JSX.Element }> = {
  pdf: {
    label: 'PDF',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M9 15h6M9 11h6M9 13h3"/>
      </svg>
    ),
  },
  xlsx: {
    label: 'Excel',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <path d="M8 13l2 2 4-4"/>
      </svg>
    ),
  },
  docx: {
    label: 'Word',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
      </svg>
    ),
  },
  pptx: {
    label: 'PPT',
    color: '#ea580c',
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <rect x="8" y="11" width="8" height="5" rx="1"/>
      </svg>
    ),
  },
  other: {
    label: 'Dosya',
    color: '#71717a',
    bg: '#f4f4f5',
    border: '#d4d4d8',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
};

export const metadata = {
  title: 'Dökümanlar | PeriyotLab',
  description: 'PeriyotLab teknik dökümanları, kataloglar ve belgeler.',
};

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['docs_page_badge', 'docs_page_title', 'docs_page_description'] } },
    });
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return map;
  } catch {
    return {};
  }
}

export default async function DocumentsPage() {
  let documents: any[] = [];
  try {
    documents = await prisma.document.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  } catch (e) {
    console.error('Error fetching documents:', e);
  }

  const settings = await getSettings();
  const badge = settings['docs_page_badge'] || 'Kaynaklar';
  const title = settings['docs_page_title'] || 'Dökümanlar';
  const description = settings['docs_page_description'] || 'Teknik dökümanlar, ürün katalogları ve belgelerimizi inceleyip indirebilirsiniz.';

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero Header */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-end">
          <svg className="w-[600px] h-[600px]" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="0.3">
            <path d="M50 0 A50 50 0 1 1 49.9 0"/>
            <path d="M50 15 A35 35 0 1 1 49.9 15"/>
            <path d="M50 30 A20 20 0 1 1 49.9 30"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
            {badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {title}
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl">
            {description}
          </p>
        </div>
      </section>

      {/* Documents Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {documents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-zinc-300 py-28 text-center">
              <div className="flex flex-col items-center gap-4 text-zinc-400">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                <p className="font-semibold text-zinc-600 text-xl">Henüz döküman eklenmemiş.</p>
                <p className="text-sm text-zinc-400">Yakında yeni belgeler burada yer alacak.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.map((doc) => {
                const config = FILE_TYPE_CONFIG[doc.fileType] || FILE_TYPE_CONFIG['other'];
                return (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* Cover / Icon */}
                    <div className="relative h-44 overflow-hidden flex-shrink-0">
                      {doc.coverImageUrl ? (
                        <img
                          src={doc.coverImageUrl}
                          alt={doc.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: config.bg }}
                        >
                          <div className="w-16 h-16" style={{ color: config.color }}>
                            {config.icon}
                          </div>
                        </div>
                      )}
                      {/* File type badge */}
                      <div
                        className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border"
                        style={{ background: config.bg, color: config.color, borderColor: config.border }}
                      >
                        {config.label}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-zinc-900 text-base leading-snug group-hover:text-black mb-2 line-clamp-2">
                        {doc.title}
                      </h3>
                      {doc.description && (
                        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 flex-1">
                          {doc.description}
                        </p>
                      )}
                      {/* Download CTA */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-zinc-900 group-hover:gap-3 transition-all">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        İndir / Görüntüle
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
