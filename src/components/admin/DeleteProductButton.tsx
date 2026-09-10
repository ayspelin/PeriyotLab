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
    <button onClick={handleDelete} className="inline-flex justify-center rounded-lg border border-red-200 bg-white px-5 py-3 text-base font-bold text-red-600 transition hover:bg-red-50">
      Sil
    </button>
  );
}
