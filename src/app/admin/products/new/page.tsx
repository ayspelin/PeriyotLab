'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    hazardLevel: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert("Ürün eklenirken sunucu hatası oluştu.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2">
          ← Geri Dön
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Yeni Ürün Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Ürün Adı</label>
          <input required type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Kategori</label>
            <input required type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tehlike Seviyesi</label>
            <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              placeholder="Opsiyonel (Örn: Yanıcı)"
              value={formData.hazardLevel} onChange={e => setFormData({...formData, hazardLevel: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Açıklama</label>
          <textarea required rows={5} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4">
          {loading ? 'Ekleniyor...' : 'Ürünü Kaydet'}
        </button>
      </form>
    </div>
  );
}
