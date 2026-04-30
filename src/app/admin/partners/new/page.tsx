'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', order: '0' });

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
    if (!imageFile) {
      alert('Lütfen bir logo görseli seçin.');
      return;
    }
    setLoading(true);

    try {
      // Upload image
      const uploadData = new FormData();
      uploadData.append('file', imageFile);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (!uploadRes.ok) {
        alert('Görsel yüklenirken hata oluştu.');
        setLoading(false);
        return;
      }
      const { url: imageUrl } = await uploadRes.json();

      // Create partner record
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, imageUrl, order: parseInt(formData.order) }),
      });

      if (res.ok) {
        router.push('/admin/partners');
        router.refresh();
      } else {
        alert('Ortak eklenirken bir sunucu hatası oluştu.');
      }
    } catch (err) {
      alert('Bir hata oluştu. Bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/partners" className="text-sm font-semibold text-slate-500 hover:text-black transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Çalışma Ortakları
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Yeni Çalışma Ortağı Ekle</h1>
        <p className="text-sm text-slate-500 mt-1">Logo görseli yükleyin ve firma adını girin.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
        {/* Logo Upload */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-700">Logo Görseli <span className="text-red-500">*</span></label>
          
          {/* Preview Area */}
          <div className={`relative w-full h-40 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${imagePreview ? 'border-slate-300 bg-slate-50' : 'border-slate-300 hover:border-black bg-slate-50 cursor-pointer'}`}>
            {imagePreview ? (
              <img src={imagePreview} alt="Önizleme" className="max-h-full max-w-full object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span className="text-sm font-medium">Görsel seçmek için tıklayın</span>
                <span className="text-xs">PNG, JPG, SVG — Max 5MB</span>
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
            <button
              type="button"
              onClick={() => { setImagePreview(null); setImageFile(null); }}
              className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Görseli Kaldır
            </button>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Firma / Ortak Adı <span className="text-red-500">*</span></label>
          <input
            required
            type="text"
            placeholder="örn. AGILENT Technologies"
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
            placeholder="0"
            className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-slate-900 text-sm"
            value={formData.order}
            onChange={e => setFormData({ ...formData, order: e.target.value })}
          />
          <p className="text-xs text-slate-400">Küçük sayı önce gösterilir. Birden fazla ortak için sıralama belirler.</p>
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
            ) : 'Ortağı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
