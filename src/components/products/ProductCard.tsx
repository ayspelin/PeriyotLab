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
  return (
    <Link href={`/products/${product.id}`} className="block group h-full">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 h-full flex flex-col hover:border-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-black relative overflow-hidden">
        {/* Image */}
        {product.imageUrl && (
          <div className="mb-6 -mx-6 -mt-6">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Top Badges */}
        <div className="flex justify-between items-start mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Content */}
        <h2 className="text-xl font-extrabold mb-3 group-hover:text-zinc-600 transition-colors tracking-tight">{product.name}</h2>
        <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3 mb-8 flex-grow">{product.description}</p>
        
        {/* Bottom CTA */}
        <div className="mt-auto pt-4 border-t border-zinc-100 text-xs font-bold uppercase tracking-widest text-black flex items-center">
          Ürünü İncele <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
