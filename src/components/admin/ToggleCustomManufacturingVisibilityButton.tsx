'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToggleCustomManufacturingVisibilityButton({ id, title, published }: { id: string; title: string; published: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const message = published
      ? `"${title}" kaydını sitede gizlemek istiyor musunuz?`
      : `"${title}" kaydını tekrar yayına almak istiyor musunuz?`;

    if (!confirm(message)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/custom-manufacturing/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        alert('Yayın durumu güncellenemedi.');
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
        published
          ? 'border-slate-300 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      }`}
    >
      {loading ? 'Güncelleniyor...' : published ? 'Gizle' : 'Yayına Al'}
    </button>
  );
}
