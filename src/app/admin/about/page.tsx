'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    about_title: '',
    about_description: '',
    about_mission: '',
    about_vision: '',
    about_quality: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/about');
        if (res.ok) {
          const data = await res.json();
          setFormData({
            about_title: data.about_title || 'Hakkımızda',
            about_description: data.about_description || 'PeriyotLab olarak, endüstrinin ihtiyaç duyduğu en yüksek kaliteli kimyasal bileşenleri sağlıyoruz. Güvenilirlik ve bilimsel mükemmeliyet temel vizyonumuzdur.',
            about_mission: data.about_mission || 'Laboratuvar ortamında yenilikçi ve yüksek güvenlik standartlarına sahip ürünler sunarak, bilimsel araştırmaların hız kazanmasına destek olmak.',
            about_vision: data.about_vision || 'Sektördeki kimyasal analiz süreçlerini en güvenilir referans materyaller ile standartlaştırıp, küresel çapta öncü bir bilimsel tedarik platformu haline gelmek.',
            about_quality: data.about_quality || 'Sağladığımız her kimyasal madde, katı kalite kontrol prosedürlerinden geçmektedir. Uluslararası standartlara uygun sertifikasyonlarımız ile süreçlerimizi daima şeffaf tutarız.',
          });
        }
      } catch (error) {
        console.error("Hakkımızda verileri çekilemedi.", error);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/settings/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Değişiklikler başarıyla kaydedildi.");
        router.refresh();
      } else {
        alert("Kaydedilirken sunucu hatası oluştu.");
      }
    } catch (error) {
      alert("Bir hata oluştu. Bağlantınızı kontrol edin.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-slate-500">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Hakkımızda Sayfası Yönetimi</h1>
        <p className="text-slate-500 text-sm mt-1">Sitenizin hakkımızda sayfasındaki metinleri buradan değiştirebilirsiniz.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Ana Başlık</label>
          <input required type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.about_title} onChange={e => setFormData({...formData, about_title: e.target.value})} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Ana Açıklama Metni</label>
          <textarea required rows={4} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.about_description} onChange={e => setFormData({...formData, about_description: e.target.value})} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Misyonumuz</label>
            <textarea required rows={4} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              value={formData.about_mission} onChange={e => setFormData({...formData, about_mission: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Vizyonumuz</label>
            <textarea required rows={4} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
              value={formData.about_vision} onChange={e => setFormData({...formData, about_vision: e.target.value})} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Kalite Politikamız</label>
          <textarea required rows={3} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors text-slate-900"
            value={formData.about_quality} onChange={e => setFormData({...formData, about_quality: e.target.value})} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4">
          {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}
