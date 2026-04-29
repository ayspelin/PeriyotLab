import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import ProductCard from '@/components/products/ProductCard';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function ProductsPage() {
  let products: any[] = [];
  let dbError = false;

  try {
    // Attempt to fetch from DB
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    dbError = true;
    console.error("Database connection error:", error);
    // Mock data for UI presentation until DB is successfully connected
    products = [
      { id: '1', name: 'Sodyum Klorür', description: 'Laboratuvar analizi için yüksek saflıkta sodyum klorür. Standart referans materyali.', category: 'Tuzlar', imageUrl: null },
      { id: '2', name: 'Hidroklorik Asit %37', description: 'Analitik reaktif kalite hidroklorik asit. Titrasyon ve genel asit-baz reaksiyonları için.', category: 'Asitler', imageUrl: null },
      { id: '3', name: 'Etanol Mutlak', description: '%99.9 saflıkta etil alkol. Çözücü olarak ve kromatografik analizlerde kullanıma uygundur.', category: 'Çözücüler', imageUrl: null },
      { id: '4', name: 'Potasyum Permanganat', description: 'Güçlü oksitleyici ajan. Su arıtma analizleri ve redoks titrasyonları için.', category: 'Oksitleyiciler', imageUrl: null },
    ];
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Ürün Kataloğu</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
          Tüm kimyasal ürünlerimizi inceleyebilir, kategorilere göre filtreleyebilir ve detaylı teknik özelliklerine ulaşabilirsiniz.
        </p>
      </div>

      {dbError && (
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-900 border-l-4 border-foreground text-sm">
          <strong>Bağlantı Bekleniyor:</strong> Veritabanı bağlantısı henüz kurulmadığı için örnek (mock) veriler gösterilmektedir. 
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && !dbError && (
        <div className="text-center py-20 text-gray-500">
          Henüz hiç ürün eklenmemiş.
        </div>
      )}
    </div>
  );
}
