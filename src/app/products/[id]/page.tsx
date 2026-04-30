import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const FILE_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pdf:   { label: 'PDF',   color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '📄' },
  xlsx:  { label: 'Excel', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '📊' },
  docx:  { label: 'Word',  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '📝' },
  pptx:  { label: 'PPT',   color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: '📋' },
  other: { label: 'Dosya', color: '#71717a', bg: '#f4f4f5', border: '#d4d4d8', icon: '📎' },
};

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();

  const docConfig = product.documentType
    ? FILE_TYPE_CONFIG[product.documentType] ?? FILE_TYPE_CONFIG['other']
    : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-foreground mb-8 transition-colors"
      >
        ← Ürünlere Dön
      </Link>

      <div className="border border-gray-200 dark:border-gray-800 p-8 md:p-12 group">
        {/* Category */}
        <div className="mb-6">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
        </div>

        {/* Product Image */}
        {product.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <img src={product.imageUrl} alt={product.name} className="w-full max-h-[400px] object-cover" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{product.name}</h1>

        {/* Description */}
        <div className="mb-12">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {product.description}
          </p>
        </div>

        {/* Document Download */}
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
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
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

        {/* System Info */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sistem Bilgileri</h3>
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
            <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
              <span>Sistem ID Kodu</span>
              <span className="font-mono text-foreground">{product.id.split('-')[0].toUpperCase()}</span>
            </li>
            <li className="flex justify-between border-b border-gray-100 dark:border-gray-900 pb-2">
              <span>Kayıt Tarihi</span>
              <span className="font-mono text-foreground">{product.createdAt.toLocaleDateString('tr-TR')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
