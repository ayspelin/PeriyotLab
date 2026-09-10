import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const href = product.id.startsWith('fallback-') ? '/products' : `/products/${product.id}`;

  return (
    <Link href={href} className="block group h-full">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 h-full flex flex-col hover:border-cyan-300 hover:shadow-2xl hover:shadow-cyan-950/10 hover:-translate-y-1 transition-all duration-300 text-black relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-zinc-950 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
        {product.imageUrl && (
          <div className="mb-6 -mx-6 -mt-6 overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 border border-cyan-100 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h2 className="text-xl font-extrabold mb-3 group-hover:text-cyan-800 transition-colors tracking-tight">{product.name}</h2>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-8 flex-grow">{product.description}</p>
        
        <div className="mt-auto pt-4 border-t border-zinc-100 text-xs font-bold uppercase tracking-widest text-zinc-950 flex items-center">
          Ürünü İncele <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
