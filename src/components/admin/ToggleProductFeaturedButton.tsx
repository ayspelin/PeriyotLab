'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ToggleProductFeaturedButton({ id, name, featured }: { id: string; name: string; featured: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const message = featured
      ? `"${name}" ürününü ana sayfadaki öne çıkanlardan kaldırmak istiyor musunuz?`
      : `"${name}" ürününü ana sayfada öne çıkarmak istiyor musunuz? Ürün gizliyse tekrar yayına alınır.`;

    if (!confirm(message)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featured ? { isFeatured: false } : { isFeatured: true, hidden: false }),
      });

      if (!response.ok) {
        alert('Öne çıkarma durumu güncellenemedi.');
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
      className="inline-flex justify-center rounded-lg border border-cyan-200 bg-cyan-50 px-5 py-3 text-base font-bold text-cyan-800 transition hover:bg-cyan-100 disabled:opacity-50"
    >
      {loading ? 'Güncelleniyor...' : featured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
    </button>
  );
}
