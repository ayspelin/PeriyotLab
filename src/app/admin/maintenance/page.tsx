'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type MaintenanceSettings = {
  maintenance_badge: string;
  maintenance_title: string;
  maintenance_intro: string;
  maintenance_step_1: string;
  maintenance_step_2: string;
  maintenance_step_3: string;
  maintenance_note: string;
};

const defaultSettings: MaintenanceSettings = {
  maintenance_badge: '',
  maintenance_title: '',
  maintenance_intro: '',
  maintenance_step_1: '',
  maintenance_step_2: '',
  maintenance_step_3: '',
  maintenance_note: '',
};

const inputClass = "w-full rounded-lg border border-slate-300 bg-white p-4 text-lg text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
const labelClass = "mb-2 block text-base font-bold text-slate-800";
const helpClass = "mt-2 text-sm leading-6 text-slate-500";

export default function MaintenanceAdminPage() {
  const [settings, setSettings] = useState<MaintenanceSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {
        setSettings(defaultSettings);
      });
  }, []);

  const updateSetting = (key: keyof MaintenanceSettings, value: string) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    setSaving(false);
    setSaved(res.ok);

    if (!res.ok) {
      alert("Bakım onarım metinleri kaydedilemedi. Lütfen tekrar giriş yapıp deneyin.");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Bakım Onarım</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Bakım Onarım Sayfası</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Bu ekrandaki alanları doldurarak bakım onarım sayfasındaki yazıları kolayca değiştirebilirsiniz.
          </p>
        </div>
        <Link href="/bakim-onarim" target="_blank" className="inline-flex justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-bold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800">
          Sayfayı Gör
        </Link>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-base font-bold text-emerald-700">
          Değişiklikler kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className={labelClass}>Küçük Üst Yazı</label>
          <input
            type="text"
            className={inputClass}
            value={settings.maintenance_badge}
            onChange={(e) => updateSetting('maintenance_badge', e.target.value)}
            placeholder="Teknik Servis"
          />
          <p className={helpClass}>Başlığın üstünde görünen kısa yazı.</p>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className={labelClass}>Ana Başlık</label>
          <input
            type="text"
            className={inputClass}
            value={settings.maintenance_title}
            onChange={(e) => updateSetting('maintenance_title', e.target.value)}
            placeholder="Bakım Onarım Hizmetleri"
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className={labelClass}>Sayfa Açıklaması</label>
          <textarea
            rows={4}
            className={`${inputClass} resize-none`}
            value={settings.maintenance_intro}
            onChange={(e) => updateSetting('maintenance_intro', e.target.value)}
            placeholder="Laboratuvar cihazlarınız için bakım, arıza tespiti, servis yönlendirmesi ve süreç takibi konusunda yanınızdayız."
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Servis Adımları</h2>
          <p className="mt-2 text-base leading-7 text-slate-600">Ziyaretçiye bakım onarım sürecinin nasıl ilerlediğini üç kısa adımda anlatır.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className={labelClass}>1. Adım</label>
              <input
                type="text"
                className={inputClass}
                value={settings.maintenance_step_1}
                onChange={(e) => updateSetting('maintenance_step_1', e.target.value)}
                placeholder="Cihazın durumunu ve yaşanan arızayı birlikte netleştiririz."
              />
            </div>
            <div>
              <label className={labelClass}>2. Adım</label>
              <input
                type="text"
                className={inputClass}
                value={settings.maintenance_step_2}
                onChange={(e) => updateSetting('maintenance_step_2', e.target.value)}
                placeholder="Uygun bakım, onarım veya servis yönlendirmesini planlarız."
              />
            </div>
            <div>
              <label className={labelClass}>3. Adım</label>
              <input
                type="text"
                className={inputClass}
                value={settings.maintenance_step_3}
                onChange={(e) => updateSetting('maintenance_step_3', e.target.value)}
                placeholder="Gerekli parça, süre ve işlem bilgisini anlaşılır şekilde paylaşırız."
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <label className={labelClass}>Kısa Not</label>
          <textarea
            rows={3}
            className={`${inputClass} resize-none`}
            value={settings.maintenance_note}
            onChange={(e) => updateSetting('maintenance_note', e.target.value)}
            placeholder="Servis talebiniz için cihaz adı, marka-model ve yaşanan sorunu paylaşmanız yeterlidir."
          />
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-cyan-600 px-8 py-4 text-lg font-black text-white shadow-xl shadow-cyan-900/15 transition hover:bg-slate-950 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
