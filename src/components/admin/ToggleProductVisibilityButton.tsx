'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToggleProductVisibilityButton({ id, name, hidden }: { id: string; name: string; hidden: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const message = hidden
      ? `"${name}" ürününü tekrar sitede yayına almak istiyor musunuz?`
      : `"${name}" ürününü sitede gizlemek istiyor musunuz?`;

    if (!confirm(message)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hidden: !hidden }),
      });

      if (!response.ok) {
        alert('Görünürlük güncellenemedi.');
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
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex justify-center rounded-lg border px-5 py-3 text-base font-bold transition disabled:opacity-50 ${
        hidden
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'border-slate-300 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700'
      }`}
    >
      {loading ? 'Güncelleniyor...' : hidden ? 'Yayına Al' : 'Gizle'}
    </button>
  );
}
