import Link from 'next/link';
import prisma from "@/lib/prisma";

import DeleteProductButton from '@/components/admin/DeleteProductButton';

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return { products, loaded: true };
  } catch {
    return { products: [], loaded: false };
  }
}

export default async function AdminProductsPage() {
  const { products, loaded } = await getProducts();

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Ürünler</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Ürün Yönetimi</h1>
          <p className="mt-2 max-w-2xl text-lg leading-8 text-slate-600">
            Ürünleri buradan düzenleyebilir, öne çıkarabilir veya yeni ürün ekleyebilirsiniz.
          </p>
        </div>
        <Link href="/admin/products/new" className="inline-flex justify-center rounded-lg bg-cyan-600 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-950">
          Yeni Ürün Ekle
        </Link>
      </div>

      {!loaded && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-5 text-base leading-7 text-amber-800">
          Ürün listesi şu anda alınamadı. Veritabanı bağlantısı düzeldiğinde bu alan kendiliğinden çalışacaktır.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div key={product.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-[72px_1fr_auto] md:items-center">
              <div className="h-[72px] w-[72px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-sm font-semibold text-slate-400">Görsel yok</div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{product.name}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{product.category}</span>
                  {product.isFeatured && (
                    <span className="rounded-lg bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-800">Ana sayfada görünür</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
                <Link href={`/admin/products/${product.id}/edit`} className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white transition hover:bg-cyan-700">
                  Düzenle
                </Link>
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          </div>
        ))}

        {loaded && products.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-xl font-black text-slate-950">Henüz ürün eklenmemiş.</h2>
            <p className="mt-2 text-base text-slate-600">İlk ürünü eklemek için aşağıdaki düğmeyi kullanabilirsiniz.</p>
            <Link href="/admin/products/new" className="mt-5 inline-flex rounded-lg bg-cyan-600 px-6 py-4 text-base font-bold text-white transition hover:bg-slate-950">
              Yeni Ürün Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
