import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Link href="/products" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-foreground mb-8 transition-colors">
        ← Ürünlere Dön
      </Link>
      
      <div className="border border-gray-200 dark:border-gray-800 p-8 md:p-12 group">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{product.category}</span>
          {product.hazardLevel && (
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-foreground">
              Tehlike Seviyesi: {product.hazardLevel}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-8">{product.name}</h1>
        
        <div className="mb-12">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 dark:border-gray-800 pt-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Sistem Bilgileri</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
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
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Güvenlik Notu</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 text-sm text-gray-600 dark:text-gray-400 border-l-2 border-foreground">
              Lütfen bu kimyasalı laboratuvar ortamında kullanmadan önce ilgili Malzeme Güvenlik Bilgi Formu'nu (MSDS) detaylıca inceleyiniz. Uygun kişisel koruyucu donanım (KKD) kullanımı zorunludur.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
