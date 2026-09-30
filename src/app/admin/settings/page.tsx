'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SettingsState = {
  footer_text: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  contact_office_name: string;
  contact_working_hours: string;
  home_hero_badge: string;
  home_hero_title: string;
  home_hero_desc: string;
  home_vision_title: string;
  home_vision_desc: string;
  home_stat_1_value: string;
  home_stat_1_label: string;
  home_stat_2_value: string;
  home_stat_2_label: string;
  home_stat_3_value: string;
  home_stat_3_label: string;
  home_stat_4_value: string;
  home_stat_4_label: string;
  home_solution_1_image: string;
  home_solution_2_image: string;
  home_solution_3_image: string;
};

const defaultSettings: SettingsState = {
  footer_text: '',
  contact_email: '',
  contact_phone: '',
  contact_whatsapp: '',
  contact_address: '',
  contact_office_name: '',
  contact_working_hours: '',
  home_hero_badge: '',
  home_hero_title: '',
  home_hero_desc: '',
  home_vision_title: '',
  home_vision_desc: '',
  home_stat_1_value: '',
  home_stat_1_label: '',
  home_stat_2_value: '',
  home_stat_2_label: '',
  home_stat_3_value: '',
  home_stat_3_label: '',
  home_stat_4_value: '',
  home_stat_4_label: '',
  home_solution_1_image: '',
  home_solution_2_image: '',
  home_solution_3_image: '',
};

const inputClass = "w-full rounded-lg border border-slate-300 bg-white p-4 text-base text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
const smallInputClass = "w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
const labelClass = "mb-2 block text-base font-semibold text-slate-700";
const sectionClass = "rounded-lg border border-slate-200 bg-white p-6 shadow-sm";

function ImageSettingField({
  label,
  value,
  fallback,
  uploading,
  onChange,
  onUpload,
  onClear,
}: {
  label: string;
  value: string;
  fallback: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
  onClear: () => void;
}) {
  const preview = value || fallback;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <label className={labelClass}>{label}</label>
      <div className="grid gap-4 md:grid-cols-[180px_1fr]">
        <div className="h-32 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Görsel yok</div>
          )}
        </div>
        <div className="space-y-3">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={smallInputClass}
            placeholder={fallback}
          />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-cyan-400 hover:text-cyan-800">
              {uploading ? "Yükleniyor..." : "Görsel Yükle"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onUpload(file);
                }}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
              >
                Varsayılana Dön
              </button>
            )}
          </div>
          <p className="text-xs font-semibold leading-5 text-slate-500">
            Boş bırakılırsa hazır görsel kullanılır. Değişikliği yayınlamak için alttaki Kaydet düğmesine basın.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {
        setSettings(defaultSettings);
      });
  }, []);

  const updateSetting = (key: keyof SettingsState, value: string) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const uploadImage = async (file: File, key: keyof SettingsState) => {
    setUploadingKey(key);
    setSaved(false);

    const data = new FormData();
    data.append('file', file);

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await response.json();

      if (!response.ok || !result.success || !result.url) {
        alert(result.error || 'Görsel yüklenemedi.');
        return;
      }

      updateSetting(key, result.url);
    } catch {
      alert('Görsel yüklenemedi.');
    } finally {
      setUploadingKey("");
    }
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
      alert("Ayarlar kaydedilemedi. Lütfen tekrar giriş yapıp deneyin.");
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Genel Ayarlar</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Site Ayarları</h1>
          <p className="mt-2 max-w-2xl text-lg leading-8 text-slate-600">
            Ana sayfa yazıları, iletişim bilgileri ve genel site metinlerini buradan güncelleyebilirsiniz.
          </p>
        </div>
        {saved && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-700">
            Değişiklikler kaydedildi.
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className={sectionClass}>
          <div className="mb-6">
            <span className="text-sm font-bold text-cyan-700">Ana Sayfa</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">Vitrin Alanı</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Üst Etiket</label>
              <input
                type="text"
                className={inputClass}
                value={settings.home_hero_badge}
                onChange={(e) => updateSetting('home_hero_badge', e.target.value)}
                placeholder="Laboratuvar Çözümleri"
              />
            </div>
            <div>
              <label className={labelClass}>Ana Başlık</label>
              <input
                type="text"
                className={inputClass}
                value={settings.home_hero_title}
                onChange={(e) => updateSetting('home_hero_title', e.target.value)}
                placeholder="Endüstriyel laboratuvarlar için güvenilir çözüm ortağı"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Kısa Açıklama</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={settings.home_hero_desc}
                onChange={(e) => updateSetting('home_hero_desc', e.target.value)}
                placeholder="PeriyotLab; ürün tedariki, servis desteği ve laboratuvar ihtiyaçları için yanınızdadır."
              />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <span className="text-sm font-bold text-cyan-700">Ana Sayfa</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">Çözümlerimiz Kart Görselleri</h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Ana sayfada görünen “Bakım ve Onarım Servisi”, “Teknik Destek” ve “Ürün Tedariki” kartlarının görselleri.
            </p>
          </div>

          <div className="space-y-4">
            <ImageSettingField
              label="Bakım ve Onarım Servisi Görseli"
              value={settings.home_solution_1_image}
              fallback="/mock/prod4.png"
              uploading={uploadingKey === 'home_solution_1_image'}
              onChange={(value) => updateSetting('home_solution_1_image', value)}
              onUpload={(file) => uploadImage(file, 'home_solution_1_image')}
              onClear={() => updateSetting('home_solution_1_image', '')}
            />
            <ImageSettingField
              label="Teknik Destek Görseli"
              value={settings.home_solution_2_image}
              fallback="/mock/prod3.png"
              uploading={uploadingKey === 'home_solution_2_image'}
              onChange={(value) => updateSetting('home_solution_2_image', value)}
              onUpload={(file) => uploadImage(file, 'home_solution_2_image')}
              onClear={() => updateSetting('home_solution_2_image', '')}
            />
            <ImageSettingField
              label="Ürün Tedariki Görseli"
              value={settings.home_solution_3_image}
              fallback="/mock/prod1.png"
              uploading={uploadingKey === 'home_solution_3_image'}
              onChange={(value) => updateSetting('home_solution_3_image', value)}
              onUpload={(file) => uploadImage(file, 'home_solution_3_image')}
              onClear={() => updateSetting('home_solution_3_image', '')}
            />
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <span className="text-sm font-bold text-cyan-700">Güven Bandı</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">Ana Sayfa Sayıları</h2>
            <p className="mt-2 text-base leading-7 text-slate-600">
              Gerçek şirket rakamları netleşene kadar bu alanları daha genel ifadelerle kullanabilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              ['home_stat_1_value', 'home_stat_1_label', '1. Değer', '1. Açıklama'],
              ['home_stat_2_value', 'home_stat_2_label', '2. Değer', '2. Açıklama'],
              ['home_stat_3_value', 'home_stat_3_label', '3. Değer', '3. Açıklama'],
              ['home_stat_4_value', 'home_stat_4_label', '4. Değer', '4. Açıklama'],
            ].map(([valueKey, labelKey, valueLabel, descLabel]) => (
              <div key={valueKey} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <label className={labelClass}>{valueLabel}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={settings[valueKey as keyof SettingsState]}
                    onChange={(e) => updateSetting(valueKey as keyof SettingsState, e.target.value)}
                    placeholder="Çoklu"
                  />
                </div>
                <div>
                  <label className={labelClass}>{descLabel}</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={settings[labelKey as keyof SettingsState]}
                    onChange={(e) => updateSetting(labelKey as keyof SettingsState, e.target.value)}
                    placeholder="ürün kategorisi"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <span className="text-sm font-bold text-cyan-700">Ana Sayfa</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">Vizyon Bölümü</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Başlık</label>
              <input
                type="text"
                className={inputClass}
                value={settings.home_vision_title}
                onChange={(e) => updateSetting('home_vision_title', e.target.value)}
                placeholder="Laboratuvar Standartlarını Yükseltiyoruz"
              />
            </div>
            <div>
              <label className={labelClass}>Açıklama</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={settings.home_vision_desc}
                onChange={(e) => updateSetting('home_vision_desc', e.target.value)}
                placeholder="PeriyotLab olarak güvenilir ürün ve anlaşılır hizmet sunmayı hedefliyoruz."
              />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-6">
            <span className="text-sm font-bold text-cyan-700">İletişim</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">İletişim Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>E-Posta</label>
              <input
                type="email"
                className={inputClass}
                value={settings.contact_email}
                onChange={(e) => updateSetting('contact_email', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Telefon</label>
              <input
                type="text"
                className={inputClass}
                value={settings.contact_phone}
                onChange={(e) => updateSetting('contact_phone', e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp</label>
              <input
                type="text"
                className={inputClass}
                value={settings.contact_whatsapp}
                onChange={(e) => updateSetting('contact_whatsapp', e.target.value)}
                placeholder="+90 5XX XXX XX XX"
              />
            </div>
            <div>
              <label className={labelClass}>Ofis veya Şube Adı</label>
              <input
                type="text"
                className={inputClass}
                value={settings.contact_office_name}
                onChange={(e) => updateSetting('contact_office_name', e.target.value)}
                placeholder="PeriyotLab Genel Merkez"
              />
            </div>
            <div>
              <label className={labelClass}>Çalışma Saatleri</label>
              <textarea
                rows={3}
                className={`${inputClass} resize-none`}
                value={settings.contact_working_hours}
                onChange={(e) => updateSetting('contact_working_hours', e.target.value)}
                placeholder={"Pazartesi - Cumartesi\n09:00 - 18:00\nPazar Kapalı"}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Adres</label>
              <textarea
                rows={2}
                className={`${inputClass} resize-none`}
                value={settings.contact_address}
                onChange={(e) => updateSetting('contact_address', e.target.value)}
                placeholder={"ANITTEPE MAH. IŞIK SOKAK NO:25/A\nÇANKAYA / ANKARA"}
              />
            </div>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-sm font-bold text-cyan-700">Bakım Onarım</span>
              <h2 className="mt-2 text-xl font-black text-slate-950">Bakım onarım yazıları</h2>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Bakım onarım sayfasındaki başlık, açıklama ve servis adımları ayrı ve daha sade bir ekrandan düzenlenir.
              </p>
            </div>
            <Link
              href="/admin/maintenance"
              className="inline-flex justify-center rounded-lg bg-white px-5 py-3 text-base font-bold text-cyan-800 ring-1 ring-cyan-200 transition hover:bg-cyan-50"
            >
              Bakım Onarım Alanını Aç
            </Link>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="text-sm font-bold text-cyan-700">Yönetici Girişi</span>
              <h2 className="mt-2 text-xl font-black text-slate-950">Yönetici e-posta ve şifre</h2>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Ana yönetici bilgileri gizli ortam ayarlarından gelir. Şifre bu ekranda gösterilmez ve açık metin olarak saklanmaz.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex justify-center rounded-lg bg-slate-950 px-5 py-3 text-base font-bold text-white transition hover:bg-cyan-700"
            >
              Yeni Yönetici Ekle
            </Link>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="mb-5">
            <span className="text-sm font-bold text-cyan-700">Genel</span>
            <h2 className="mt-2 text-xl font-black text-slate-950">Alt Kısım</h2>
          </div>
          <div>
            <label className={labelClass}>Alt Kısım Sloganı veya Metni</label>
            <input
              type="text"
              className={inputClass}
              value={settings.footer_text}
              onChange={(e) => updateSetting('footer_text', e.target.value)}
              placeholder="Modern Endüstri İçin Gelişmiş Çözümler"
            />
          </div>
        </section>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving || Boolean(uploadingKey)}
            className="rounded-lg bg-cyan-600 px-8 py-4 text-lg font-black text-white shadow-xl shadow-cyan-900/20 transition hover:-translate-y-0.5 hover:bg-slate-950 disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}
