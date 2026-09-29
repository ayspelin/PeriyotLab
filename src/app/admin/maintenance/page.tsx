/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import {
  compactLines,
  defaultBeforeAfterItems,
  defaultComparisonActions,
  defaultDeviceCategories,
  defaultFaqItems,
  defaultMaintenanceText,
  defaultPriorities,
  defaultProcessSteps,
  defaultRequestTips,
  defaultServiceProjects,
  defaultServices,
  parseSettingJson,
  type MaintenanceBeforeAfterItem,
  type MaintenanceFaqItem,
  type MaintenanceProcessStep,
  type MaintenanceService,
  type MaintenanceServiceProject,
} from "@/app/bakim-onarim/maintenanceData";

type MaintenanceAdminState = {
  badge: string;
  title: string;
  intro: string;
  heroImage: string;
  requestTitle: string;
  requestText: string;
  requestTipTitle: string;
  requestTips: string[];
  servicesTitle: string;
  servicesText: string;
  services: MaintenanceService[];
  deviceTitle: string;
  deviceText: string;
  deviceCategories: string[];
  projectTitle: string;
  projectText: string;
  serviceProjects: MaintenanceServiceProject[];
  comparisonTitle: string;
  comparisonText: string;
  beforeAfterItems: MaintenanceBeforeAfterItem[];
  comparisonActions: string[];
  processTitle: string;
  processText: string;
  processSteps: MaintenanceProcessStep[];
  processNote: string;
  prioritiesTitle: string;
  prioritiesText: string;
  priorities: string[];
  faqTitle: string;
  faqItems: MaintenanceFaqItem[];
  finalCtaTitle: string;
  finalCtaText: string;
};

const defaultState: MaintenanceAdminState = {
  badge: defaultMaintenanceText.badge,
  title: defaultMaintenanceText.title,
  intro: defaultMaintenanceText.intro,
  heroImage: defaultMaintenanceText.heroImage,
  requestTitle: defaultMaintenanceText.requestTitle,
  requestText: defaultMaintenanceText.requestText,
  requestTipTitle: defaultMaintenanceText.requestTipTitle,
  requestTips: defaultRequestTips,
  servicesTitle: defaultMaintenanceText.servicesTitle,
  servicesText: defaultMaintenanceText.servicesText,
  services: defaultServices,
  deviceTitle: defaultMaintenanceText.deviceTitle,
  deviceText: defaultMaintenanceText.deviceText,
  deviceCategories: defaultDeviceCategories,
  projectTitle: defaultMaintenanceText.projectTitle,
  projectText: defaultMaintenanceText.projectText,
  serviceProjects: defaultServiceProjects,
  comparisonTitle: defaultMaintenanceText.comparisonTitle,
  comparisonText: defaultMaintenanceText.comparisonText,
  beforeAfterItems: defaultBeforeAfterItems,
  comparisonActions: defaultComparisonActions,
  processTitle: defaultMaintenanceText.processTitle,
  processText: defaultMaintenanceText.processText,
  processSteps: defaultProcessSteps,
  processNote: defaultMaintenanceText.processNote,
  prioritiesTitle: defaultMaintenanceText.prioritiesTitle,
  prioritiesText: defaultMaintenanceText.prioritiesText,
  priorities: defaultPriorities,
  faqTitle: defaultMaintenanceText.faqTitle,
  faqItems: defaultFaqItems,
  finalCtaTitle: defaultMaintenanceText.finalCtaTitle,
  finalCtaText: defaultMaintenanceText.finalCtaText,
};

const emptyService: MaintenanceService = {
  title: "Yeni Hizmet",
  description: "Hizmet açıklaması",
  icon: defaultServices[0].icon,
};

const emptyProject: MaintenanceServiceProject = {
  title: "Yeni Servis Uygulaması",
  process: "Yapılan işlem",
  description: "Kısa açıklama",
  status: "Servis Tamamlandı",
  image: "/mock/prod4.png",
};

const emptyFaq: MaintenanceFaqItem = {
  question: "Yeni soru",
  answer: "Yanıt metni",
};

const inputClass = "w-full rounded-lg border border-slate-300 bg-white p-4 text-base text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
const smallInputClass = "w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100";
const labelClass = "mb-2 block text-sm font-bold text-slate-800";
const helpClass = "mt-2 text-sm leading-6 text-slate-500";

function buildState(data: Record<string, string>): MaintenanceAdminState {
  return {
    badge: data.maintenance_badge || defaultState.badge,
    title: data.maintenance_title || defaultState.title,
    intro: data.maintenance_intro || defaultState.intro,
    heroImage: data.maintenance_hero_image || defaultState.heroImage,
    requestTitle: data.maintenance_request_title || defaultState.requestTitle,
    requestText: data.maintenance_request_text || defaultState.requestText,
    requestTipTitle: data.maintenance_request_tip_title || defaultState.requestTipTitle,
    requestTips: parseSettingJson(data.maintenance_request_tips, defaultState.requestTips),
    servicesTitle: data.maintenance_services_title || defaultState.servicesTitle,
    servicesText: data.maintenance_services_text || defaultState.servicesText,
    services: parseSettingJson(data.maintenance_services, defaultState.services),
    deviceTitle: data.maintenance_device_title || defaultState.deviceTitle,
    deviceText: data.maintenance_device_text || defaultState.deviceText,
    deviceCategories: parseSettingJson(data.maintenance_device_categories, defaultState.deviceCategories),
    projectTitle: data.maintenance_project_title || defaultState.projectTitle,
    projectText: data.maintenance_project_text || defaultState.projectText,
    serviceProjects: parseSettingJson(data.maintenance_service_projects, defaultState.serviceProjects),
    comparisonTitle: data.maintenance_comparison_title || defaultState.comparisonTitle,
    comparisonText: data.maintenance_comparison_text || defaultState.comparisonText,
    beforeAfterItems: parseSettingJson(data.maintenance_before_after_items, defaultState.beforeAfterItems),
    comparisonActions: parseSettingJson(data.maintenance_comparison_actions, defaultState.comparisonActions),
    processTitle: data.maintenance_process_title || defaultState.processTitle,
    processText: data.maintenance_process_text || defaultState.processText,
    processSteps: data.maintenance_process_steps
      ? parseSettingJson(data.maintenance_process_steps, defaultState.processSteps)
      : defaultState.processSteps.map((step, index) => ({
          ...step,
          description: data[`maintenance_step_${index + 1}`] || step.description,
        })),
    processNote: data.maintenance_note || defaultState.processNote,
    prioritiesTitle: data.maintenance_priorities_title || defaultState.prioritiesTitle,
    prioritiesText: data.maintenance_priorities_text || defaultState.prioritiesText,
    priorities: parseSettingJson(data.maintenance_priorities, defaultState.priorities),
    faqTitle: data.maintenance_faq_title || defaultState.faqTitle,
    faqItems: parseSettingJson(data.maintenance_faq_items, defaultState.faqItems),
    finalCtaTitle: data.maintenance_final_cta_title || defaultState.finalCtaTitle,
    finalCtaText: data.maintenance_final_cta_text || defaultState.finalCtaText,
  };
}

function ImageUploadField({
  label,
  value,
  uploading,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="space-y-3">
      <label className={labelClass}>{label}</label>
      <div className="grid gap-4 md:grid-cols-[160px_1fr]">
        <div className="relative h-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">Görsel yok</div>
          )}
        </div>
        <div className="space-y-3">
          <input value={value} onChange={(event) => onChange(event.target.value)} className={smallInputClass} placeholder="/uploads/ornek.png" />
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
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100">
      Sil
    </button>
  );
}

export default function MaintenanceAdminPage() {
  const [settings, setSettings] = useState<MaintenanceAdminState>(defaultState);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(buildState(data)))
      .catch(() => {
        setSettings(defaultState);
      });
  }, []);

  const updateSetting = <K extends keyof MaintenanceAdminState>(key: K, value: MaintenanceAdminState[K]) => {
    setSaved(false);
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const uploadImage = async (file: File, key: string, onUrl: (url: string) => void) => {
    setUploadingKey(key);
    setSaved(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        alert(data.error || "Görsel yüklenemedi.");
        return;
      }

      onUrl(data.url);
    } catch {
      alert("Görsel yüklenemedi.");
    } finally {
      setUploadingKey("");
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const payload = {
      maintenance_badge: settings.badge,
      maintenance_title: settings.title,
      maintenance_intro: settings.intro,
      maintenance_hero_image: settings.heroImage,
      maintenance_request_title: settings.requestTitle,
      maintenance_request_text: settings.requestText,
      maintenance_request_tip_title: settings.requestTipTitle,
      maintenance_request_tips: JSON.stringify(settings.requestTips),
      maintenance_services_title: settings.servicesTitle,
      maintenance_services_text: settings.servicesText,
      maintenance_services: JSON.stringify(settings.services),
      maintenance_device_title: settings.deviceTitle,
      maintenance_device_text: settings.deviceText,
      maintenance_device_categories: JSON.stringify(settings.deviceCategories),
      maintenance_project_title: settings.projectTitle,
      maintenance_project_text: settings.projectText,
      maintenance_service_projects: JSON.stringify(settings.serviceProjects),
      maintenance_comparison_title: settings.comparisonTitle,
      maintenance_comparison_text: settings.comparisonText,
      maintenance_before_after_items: JSON.stringify(settings.beforeAfterItems),
      maintenance_comparison_actions: JSON.stringify(settings.comparisonActions),
      maintenance_process_title: settings.processTitle,
      maintenance_process_text: settings.processText,
      maintenance_process_steps: JSON.stringify(settings.processSteps),
      maintenance_step_1: settings.processSteps[0]?.description || "",
      maintenance_step_2: settings.processSteps[1]?.description || "",
      maintenance_step_3: settings.processSteps[2]?.description || "",
      maintenance_note: settings.processNote,
      maintenance_priorities_title: settings.prioritiesTitle,
      maintenance_priorities_text: settings.prioritiesText,
      maintenance_priorities: JSON.stringify(settings.priorities),
      maintenance_faq_title: settings.faqTitle,
      maintenance_faq_items: JSON.stringify(settings.faqItems),
      maintenance_final_cta_title: settings.finalCtaTitle,
      maintenance_final_cta_text: settings.finalCtaText,
    };

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    setSaved(res.ok);

    if (!res.ok) {
      alert("Bakım onarım ayarları kaydedilemedi. Lütfen tekrar giriş yapıp deneyin.");
    }
  };

  const updateService = (index: number, patch: Partial<MaintenanceService>) => {
    updateSetting("services", settings.services.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updateProject = (index: number, patch: Partial<MaintenanceServiceProject>) => {
    updateSetting("serviceProjects", settings.serviceProjects.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updateBeforeAfter = (index: number, patch: Partial<MaintenanceBeforeAfterItem>) => {
    updateSetting("beforeAfterItems", settings.beforeAfterItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updateStep = (index: number, patch: Partial<MaintenanceProcessStep>) => {
    updateSetting("processSteps", settings.processSteps.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const updateFaq = (index: number, patch: Partial<MaintenanceFaqItem>) => {
    updateSetting("faqItems", settings.faqItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const handleLinesChange = (key: "requestTips" | "deviceCategories" | "comparisonActions" | "priorities") => (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateSetting(key, compactLines(event.target.value));
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-base font-semibold text-cyan-700">Bakım Onarım</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Bakım Onarım Sayfası</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
            Sayfadaki başlıkları, kartları, servis uygulamalarını, SSS alanını ve görselleri buradan düzenleyebilirsiniz.
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

      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Üst Başlık / Hero" description="Sayfanın ilk ekrandaki başlık, açıklama ve arka plan görseli.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Küçük Üst Yazı</label>
              <input type="text" className={inputClass} value={settings.badge} onChange={(event) => updateSetting("badge", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Ana Başlık</label>
              <input type="text" className={inputClass} value={settings.title} onChange={(event) => updateSetting("title", event.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Sayfa Açıklaması</label>
            <textarea rows={3} className={`${inputClass} resize-none`} value={settings.intro} onChange={(event) => updateSetting("intro", event.target.value)} />
          </div>
          <div className="mt-5">
            <ImageUploadField
              label="Hero Görseli"
              value={settings.heroImage}
              uploading={uploadingKey === "hero"}
              onChange={(value) => updateSetting("heroImage", value)}
              onUpload={(file) => uploadImage(file, "hero", (url) => updateSetting("heroImage", url))}
            />
          </div>
        </SectionCard>

        <SectionCard title="Servis Talebi Alanı" description="Formun yanındaki çağrı metni ve kısa bilgi listesi.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Başlık</label>
              <input type="text" className={inputClass} value={settings.requestTitle} onChange={(event) => updateSetting("requestTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bilgi Kutusu Başlığı</label>
              <input type="text" className={inputClass} value={settings.requestTipTitle} onChange={(event) => updateSetting("requestTipTitle", event.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Açıklama</label>
            <textarea rows={4} className={`${inputClass} resize-none`} value={settings.requestText} onChange={(event) => updateSetting("requestText", event.target.value)} />
          </div>
          <div className="mt-5">
            <label className={labelClass}>Bilgi Maddeleri</label>
            <textarea rows={4} className={`${inputClass} resize-none`} value={settings.requestTips.join("\n")} onChange={handleLinesChange("requestTips")} />
            <p className={helpClass}>Her satıra bir madde yazın.</p>
          </div>
        </SectionCard>

        <SectionCard title="Hizmetlerimiz" description="Hizmet kartlarının başlık ve açıklamaları.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.servicesTitle} onChange={(event) => updateSetting("servicesTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.servicesText} onChange={(event) => updateSetting("servicesText", event.target.value)} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {settings.services.map((service, index) => (
              <div key={`${service.title}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-950">Hizmet {index + 1}</h3>
                  <RemoveButton onClick={() => updateSetting("services", settings.services.filter((_, itemIndex) => itemIndex !== index))} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={smallInputClass} value={service.title} onChange={(event) => updateService(index, { title: event.target.value })} placeholder="Başlık" />
                  <textarea rows={2} className={`${smallInputClass} resize-none`} value={service.description} onChange={(event) => updateService(index, { description: event.target.value })} placeholder="Açıklama" />
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => updateSetting("services", [...settings.services, emptyService])} className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
            Hizmet Ekle
          </button>
        </SectionCard>

        <SectionCard title="Servis Verdiğimiz Cihazlar" description="Kategori kartları ve bölüm metni.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.deviceTitle} onChange={(event) => updateSetting("deviceTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.deviceText} onChange={(event) => updateSetting("deviceText", event.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Cihaz Kategorileri</label>
            <textarea rows={8} className={`${inputClass} resize-none`} value={settings.deviceCategories.join("\n")} onChange={handleLinesChange("deviceCategories")} />
            <p className={helpClass}>Her satıra bir cihaz kategorisi yazın.</p>
          </div>
        </SectionCard>

        <SectionCard title="Servis Uygulamaları" description="Kartlarda görünen servis uygulaması içerikleri ve fotoğrafları.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.projectTitle} onChange={(event) => updateSetting("projectTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.projectText} onChange={(event) => updateSetting("projectText", event.target.value)} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {settings.serviceProjects.map((project, index) => (
              <div key={`${project.title}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-950">Uygulama {index + 1}</h3>
                  <RemoveButton onClick={() => updateSetting("serviceProjects", settings.serviceProjects.filter((_, itemIndex) => itemIndex !== index))} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className={smallInputClass} value={project.title} onChange={(event) => updateProject(index, { title: event.target.value })} placeholder="Cihaz adı" />
                  <input className={smallInputClass} value={project.status} onChange={(event) => updateProject(index, { status: event.target.value })} placeholder="Durum" />
                  <input className={smallInputClass} value={project.process} onChange={(event) => updateProject(index, { process: event.target.value })} placeholder="Yapılan işlem" />
                  <textarea rows={3} className={`${smallInputClass} resize-none`} value={project.description} onChange={(event) => updateProject(index, { description: event.target.value })} placeholder="Kısa açıklama" />
                </div>
                <div className="mt-4">
                  <ImageUploadField
                    label="Kart Görseli"
                    value={project.image}
                    uploading={uploadingKey === `project-${index}`}
                    onChange={(value) => updateProject(index, { image: value })}
                    onUpload={(file) => uploadImage(file, `project-${index}`, (url) => updateProject(index, { image: url }))}
                  />
                </div>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => updateSetting("serviceProjects", [...settings.serviceProjects, emptyProject])} className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
            Servis Uygulaması Ekle
          </button>
        </SectionCard>

        <SectionCard title="Bakım Öncesi / Sonrası" description="Karşılaştırma görselleri ve yapılan işlem listesi.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.comparisonTitle} onChange={(event) => updateSetting("comparisonTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.comparisonText} onChange={(event) => updateSetting("comparisonText", event.target.value)} />
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {settings.beforeAfterItems.map((item, index) => (
              <div key={`${item.label}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className={labelClass}>Etiket</label>
                <input className={smallInputClass} value={item.label} onChange={(event) => updateBeforeAfter(index, { label: event.target.value })} />
                <div className="mt-4">
                  <ImageUploadField
                    label="Görsel"
                    value={item.image}
                    uploading={uploadingKey === `before-after-${index}`}
                    onChange={(value) => updateBeforeAfter(index, { image: value })}
                    onUpload={(file) => uploadImage(file, `before-after-${index}`, (url) => updateBeforeAfter(index, { image: url }))}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label className={labelClass}>Yapılan İşlemler</label>
            <textarea rows={5} className={`${inputClass} resize-none`} value={settings.comparisonActions.join("\n")} onChange={handleLinesChange("comparisonActions")} />
          </div>
        </SectionCard>

        <SectionCard title="Servis Süreci" description="Süreç adımları ve kısa not.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.processTitle} onChange={(event) => updateSetting("processTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.processText} onChange={(event) => updateSetting("processText", event.target.value)} />
            </div>
          </div>
          <div className="mt-5 space-y-4">
            {settings.processSteps.map((step, index) => (
              <div key={`${step.title}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr]">
                  <input className={smallInputClass} value={step.title} onChange={(event) => updateStep(index, { title: event.target.value })} placeholder="Adım başlığı" />
                  <textarea rows={2} className={`${smallInputClass} resize-none`} value={step.description} onChange={(event) => updateStep(index, { description: event.target.value })} placeholder="Adım açıklaması" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <label className={labelClass}>Kısa Not</label>
            <textarea rows={3} className={`${inputClass} resize-none`} value={settings.processNote} onChange={(event) => updateSetting("processNote", event.target.value)} />
          </div>
        </SectionCard>

        <SectionCard title="Neden PeriyotLab?" description="Koyu renk avantaj alanındaki metinler.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Bölüm Başlığı</label>
              <input type="text" className={inputClass} value={settings.prioritiesTitle} onChange={(event) => updateSetting("prioritiesTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Bölüm Açıklaması</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.prioritiesText} onChange={(event) => updateSetting("prioritiesText", event.target.value)} />
            </div>
          </div>
          <div className="mt-5">
            <label className={labelClass}>Maddeler</label>
            <textarea rows={7} className={`${inputClass} resize-none`} value={settings.priorities.join("\n")} onChange={handleLinesChange("priorities")} />
          </div>
        </SectionCard>

        <SectionCard title="Sık Sorulan Sorular" description="Accordion içinde görünen soru-cevaplar.">
          <div>
            <label className={labelClass}>Bölüm Başlığı</label>
            <input type="text" className={inputClass} value={settings.faqTitle} onChange={(event) => updateSetting("faqTitle", event.target.value)} />
          </div>
          <div className="mt-6 space-y-4">
            {settings.faqItems.map((item, index) => (
              <div key={`${item.question}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="font-black text-slate-950">Soru {index + 1}</h3>
                  <RemoveButton onClick={() => updateSetting("faqItems", settings.faqItems.filter((_, itemIndex) => itemIndex !== index))} />
                </div>
                <div className="space-y-4">
                  <input className={smallInputClass} value={item.question} onChange={(event) => updateFaq(index, { question: event.target.value })} placeholder="Soru" />
                  <textarea rows={3} className={`${smallInputClass} resize-none`} value={item.answer} onChange={(event) => updateFaq(index, { answer: event.target.value })} placeholder="Cevap" />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => updateSetting("faqItems", [...settings.faqItems, emptyFaq])} className="mt-5 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-700">
            Soru Ekle
          </button>
        </SectionCard>

        <SectionCard title="Sayfa Sonu CTA" description="En alttaki teknik destek çağrısı.">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>Başlık</label>
              <input type="text" className={inputClass} value={settings.finalCtaTitle} onChange={(event) => updateSetting("finalCtaTitle", event.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Açıklama</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={settings.finalCtaText} onChange={(event) => updateSetting("finalCtaText", event.target.value)} />
            </div>
          </div>
        </SectionCard>

        <div className="sticky bottom-4 z-10 flex justify-end">
          <button
            type="submit"
            disabled={saving || Boolean(uploadingKey)}
            className="rounded-lg bg-cyan-600 px-8 py-4 text-lg font-black text-white shadow-xl shadow-cyan-900/15 transition hover:bg-slate-950 disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
}
