'use client';
import { useState, useEffect } from 'react';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState({
    footer_text: '',
    contact_email: '',
    contact_phone: '',
    contact_address: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaving(false);
    alert("Ayarlar kaydedildi.");
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Site Ayarları</h1>
      
      <form onSubmit={handleSave} className="bg-white p-8 border border-slate-200 rounded-lg shadow-sm space-y-6">
        <h2 className="text-lg font-semibold border-b border-slate-200 pb-2 mb-4 text-slate-800">Alt Kısım (Footer) Ayarları</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Footer Sloganı / Metni</label>
          <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900"
            value={settings.footer_text} onChange={e => setSettings({...settings, footer_text: e.target.value})} 
            placeholder="Modern Endüstri İçin Gelişmiş Kimyasal Çözümler" />
        </div>

        <h2 className="text-lg font-semibold border-b border-slate-200 pb-2 mb-4 mt-8 text-slate-800">İletişim Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">E-Posta</label>
            <input type="email" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900"
              value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
            <input type="text" className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900"
              value={settings.contact_phone} onChange={e => setSettings({...settings, contact_phone: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Adres</label>
          <textarea rows={3} className="w-full p-3 bg-white border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-slate-900"
            value={settings.contact_address} onChange={e => setSettings({...settings, contact_address: e.target.value})} />
        </div>

        <button type="submit" disabled={saving} className="w-full py-3 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors disabled:opacity-50 mt-4">
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </button>
      </form>
    </div>
  );
}
