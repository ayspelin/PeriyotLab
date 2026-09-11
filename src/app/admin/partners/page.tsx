'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
}

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [imageDeleting, setImageDeleting] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (active) setPartners(data);
      })
      .catch((e) => console.error(e))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı çalışma ortağını silmek istediğinizden emin misiniz?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPartners(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteImage = async (id: string, name: string) => {
    if (!confirm(`"${name}" adlı çalışma ortağının görselini silmek istediğinizden emin misiniz? Ortak kaydı silinmez.`)) return;
    setImageDeleting(id);
    try {
      const res = await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: '' }),
      });

      if (res.ok) {
        setPartners(prev => prev.map(p => p.id === id ? { ...p, imageUrl: '' } : p));
      } else {
        alert('Görsel silinemedi.');
      }
    } catch {
      alert('Bir hata oluştu.');
    } finally {
      setImageDeleting(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Çalışma Ortaklarımız</h1>
          <p className="text-sm text-slate-500 mt-1">Ana sayfada görüntülenecek iş ortaklarını yönetin.</p>
        </div>
        <Link
          href="/admin/partners/new"
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Yeni Ortak Ekle
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            <span className="text-sm font-medium">Yükleniyor...</span>
          </div>
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-24 text-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p className="font-medium text-slate-600">Henüz çalışma ortağı eklenmemiş.</p>
            <p className="text-sm">Yeni bir ortak eklemek için yukarıdaki butonu kullanın.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Logo Preview */}
              <div className="relative h-36 bg-slate-50 flex items-center justify-center p-4">
                {partner.imageUrl ? (
                  <>
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(partner.id, partner.name)}
                      disabled={imageDeleting === partner.id}
                      className="absolute right-3 top-3 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50"
                      title="Görseli Sil"
                    >
                      {imageDeleting === partner.id ? 'Siliniyor...' : 'Görseli Sil'}
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm font-semibold text-slate-400">
                    Görsel yok
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm truncate">{partner.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Sıra: {partner.order}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/partners/${partner.id}/edit`}
                      className="p-1.5 rounded-md text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Düzenle"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(partner.id, partner.name)}
                      disabled={deleting === partner.id}
                      className="p-1.5 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Sil"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
