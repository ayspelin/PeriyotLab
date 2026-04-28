'use client';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      router.refresh();
    } catch (e) {
      alert("Silme işlemi başarısız.");
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 font-bold hover:underline uppercase text-xs tracking-wider">
      Sil
    </button>
  );
}
