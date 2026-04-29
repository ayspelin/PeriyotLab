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
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs">Görsel</th>
              <th className="px-6 py-4 font-semibold text-slate-500 uppercase tracking-wider text-xs text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                <td className="px-6 py-4 text-slate-500">{product.category}</td>
                <td className="px-6 py-4">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded border border-slate-200" />
                  ) : (
                    <span className="text-slate-400 text-xs italic">Yok</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-blue-500 font-bold hover:underline uppercase text-xs tracking-wider">Düzenle</Link>
                    <DeleteProductButton id={product.id} />
                  </div>
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
