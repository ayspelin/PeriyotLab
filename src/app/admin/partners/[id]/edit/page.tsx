'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  imageUrl: string;
  order: number;
}

export default function EditPartnerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', order: '0' });

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const res = await fetch('/api/partners');
        const partners: Partner[] = await res.json();
        const partner = partners.find((p) => p.id === id);
        if (partner) {
          setFormData({ name: partner.name, order: String(partner.order) });
          setCurrentImageUrl(partner.imageUrl);
        } else {
          alert('Ortak bulunamadı.');
          router.push('/admin/partners');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setFetching(false);
      }
    };
    fetchPartner();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentImageUrl;

      // Upload new image if selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
        if (!uploadRes.ok) {
          alert('Görsel yüklenirken hata oluştu.');
          setLoading(false);
          return;
        }
        const result = await uploadRes.json();
        imageUrl = result.url;
      }

      const res = await fetch(`/api/partners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, imageUrl, order: parseInt(formData.order) }),
      });

      if (res.ok) {
        router.push('/admin/partners');
        router.refresh();
      } else {
        alert('Güncelleme sırasında bir sunucu hatası oluştu.');
      }
    } catch {
      alert('Bir hata oluştu. Bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
          <span className="text-sm font-medium">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const displayImage = imagePreview || currentImageUrl;

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/partners" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Çalışma Ortakları
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Ortağı Düzenle</h1>
        <p className="text-sm text-slate-500 mt-1">Bilgileri güncelleyin. Görsel seçmezseniz mevcut görsel korunur.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Logo Görseli</label>
          <div className="relative w-full h-40 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 cursor-pointer hover:border-black transition-colors">
            {displayImage ? (
              <img src={displayImage} alt="Önizleme" className="max-h-full max-w-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-sm font-medium">Yeni görsel seçin</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </div>
          {imagePreview && (
            <p className="text-xs text-green-600 font-medium">✓ Yeni görsel seçildi. Kaydettiğinizde güncellenecek.</p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Firma / Ortak Adı <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Sıra Numarası</label>
          <input
            type="number"
            min="0"
            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
            value={formData.order}
            onChange={e => setFormData({ ...formData, order: e.target.value })}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/admin/partners"
            className="flex-1 text-center py-3 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Kaydediliyor...
              </span>
            ) : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
