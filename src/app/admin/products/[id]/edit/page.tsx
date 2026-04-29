'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: null as string | null
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name,
            description: data.description,
            category: data.category,
            imageUrl: data.imageUrl
          });
        } else {
          alert("Ürün bulunamadı");
          router.push('/admin');
        }
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchProduct();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData
        });
        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json();
          finalImageUrl = uploadResult.url;
        } else {
          alert("Resim yüklenirken hata oluştu.");
          setLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl: finalImageUrl })
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        alert("Ürün güncellenirken sunucu hatası oluştu.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8">Yükleniyor...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm font-semibold text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2">
          ← Geri Dön
        </Link>
        <h1 className="text-2xl font-bold mt-4 text-slate-900">Ürünü Düzenle</h1>
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
            <label className="text-sm font-medium text-slate-700">Ürün Görseli (Değiştirmek isterseniz seçin)</label>
            {formData.imageUrl && !imageFile && (
               <img src={formData.imageUrl} alt="Mevcut Görsel" className="h-12 w-12 object-cover rounded mb-2" />
            )}
            <input type="file" accept="image/*" className="w-full p-2 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Açıklama</label>
          <textarea required rows={5} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4">
          {loading ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
