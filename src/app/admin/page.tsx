import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import Link from 'next/link';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ürün Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki tüm kimyasal ürünlerinizi buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin/products/new" className="px-5 py-2.5 bg-blue-500 text-white font-semibold text-sm rounded hover:bg-blue-600 transition-colors shadow-sm">
          + Yeni Ürün Ekle
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Ürün Adı</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Kategori</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Tehlike Seviyesi</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-slate-500">{product.category}</td>
                <td className="px-6 py-4">
                  {product.hazardLevel && (
                    <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-md">{product.hazardLevel}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <DeleteProductButton id={product.id} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  Henüz ürün eklemediniz. Sağ üstten yeni ürün ekleyebilirsiniz.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
