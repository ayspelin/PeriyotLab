'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProductImageButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${name}" ürününün görselini silmek istediğinize emin misiniz? Ürün kaydı silinmez.`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: null }),
      });

      if (!res.ok) {
        alert('Görsel silinemedi.');
        return;
      }

      router.refresh();
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex justify-center rounded-lg border border-amber-200 bg-white px-5 py-3 text-base font-bold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
    >
      {loading ? 'Siliniyor...' : 'Görseli Sil'}
    </button>
  );
}
