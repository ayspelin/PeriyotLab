'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchSlides = async () => {
    setLoading(true);
    const res = await fetch('/api/slides');
    const data = await res.json();
    setSlides(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Lütfen bir görsel seçin.');
    
    // 1. Upload image
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
    const uploadData = await uploadRes.json();
    
    if (!uploadData.success) return alert('Görsel yüklenemedi.');

    // 2. Create slide record
    const res = await fetch('/api/slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: uploadData.url,
        title,
        description
      })
    });

    if (res.ok) {
      setFile(null);
      setTitle('');
      setDescription('');
      fetchSlides();
    } else {
      alert('Slayt kaydedilemedi.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu slaytı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/slides/${id}`, { method: 'DELETE' });
    fetchSlides();
  };

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hero Slider Yönetimi</h1>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 border border-slate-200 rounded-lg shadow-sm mb-12">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Yeni Slayt Ekle</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Görsel Dosyası</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full p-2 border border-slate-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Başlık (İsteğe Bağlı)</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama (İsteğe Bağlı)</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors">
            + Yeni Slayt Ekle
          </button>
        </form>
      </div>

      {/* Slides Grid matching WeLab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="text-slate-500">Yükleniyor...</div>
        ) : slides.map(slide => (
          <div key={slide.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="relative h-48 w-full bg-slate-100">
              <Image src={slide.imageUrl} alt="Slide" fill className="object-cover" />
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
              <div>
                {slide.title && <h3 className="font-bold text-slate-800 mb-1">{slide.title}</h3>}
                {slide.description && <p className="text-sm text-slate-500 line-clamp-3 mb-4">{slide.description}</p>}
                {!slide.title && !slide.description && <p className="text-sm text-slate-400 italic mb-4">Metin yok</p>}
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Düzenle</button>
                <button onClick={() => handleDelete(slide.id)} className="flex-1 py-2 border border-red-200 text-red-600 rounded text-sm font-medium hover:bg-red-50 transition-colors">Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
