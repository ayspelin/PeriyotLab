/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { CONTACT_SETTING_KEYS, getWhatsappHref, resolveContactInfo } from "@/lib/contactInfo";
import ServiceRequestForm from "./ServiceRequestForm";
import {
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
} from "./maintenanceData";

export const dynamic = "force-dynamic";

const settingKeys = [
  "maintenance_badge",
  "maintenance_title",
  "maintenance_intro",
  "maintenance_hero_image",
  "maintenance_request_title",
  "maintenance_request_text",
  "maintenance_request_tip_title",
  "maintenance_request_tips",
  "maintenance_services_title",
  "maintenance_services_text",
  "maintenance_services",
  "maintenance_device_title",
  "maintenance_device_text",
  "maintenance_device_categories",
  "maintenance_project_title",
  "maintenance_project_text",
  "maintenance_service_projects",
  "maintenance_comparison_title",
  "maintenance_comparison_text",
  "maintenance_before_after_items",
  "maintenance_comparison_actions",
  "maintenance_process_title",
  "maintenance_process_text",
  "maintenance_process_steps",
  "maintenance_step_1",
  "maintenance_step_2",
  "maintenance_step_3",
  "maintenance_note",
  "maintenance_priorities_title",
  "maintenance_priorities_text",
  "maintenance_priorities",
  "maintenance_faq_title",
  "maintenance_faq_items",
  "maintenance_final_cta_title",
  "maintenance_final_cta_text",
  ...CONTACT_SETTING_KEYS,
];

async function getMaintenanceSettings() {
  const map: Record<string, string> = {};

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: settingKeys } },
    });

    rows.forEach((row) => {
      map[row.key] = row.value;
    });
  } catch {
    return map;
  }

  return map;
}

function LineIcon({ path, className = "h-6 w-6" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

function FillImage({ src, alt, className, priority = false, sizes }: { src: string; alt: string; className: string; priority?: boolean; sizes: string }) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
  }

  return <img src={src} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
}

export const metadata = {
  title: "Bakım Onarım | PeriyotLab",
  description: "Laboratuvar cihazları için arıza tespiti, bakım, onarım ve teknik servis çözümleri.",
};

export default async function MaintenancePage() {
  const settings = await getMaintenanceSettings();
  const contactInfo = resolveContactInfo(settings);
  const whatsappHref = getWhatsappHref(contactInfo.whatsapp || contactInfo.phone);
  const whatsappProps = whatsappHref.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};
  const heroImage = settings.maintenance_hero_image || defaultMaintenanceText.heroImage;
  const services = parseSettingJson(settings.maintenance_services, defaultServices);
  const requestTips = parseSettingJson(settings.maintenance_request_tips, defaultRequestTips);
  const deviceCategories = parseSettingJson(settings.maintenance_device_categories, defaultDeviceCategories);
  const serviceProjects = parseSettingJson(settings.maintenance_service_projects, defaultServiceProjects);
  const beforeAfterItems = parseSettingJson(settings.maintenance_before_after_items, defaultBeforeAfterItems);
  const comparisonActions = parseSettingJson(settings.maintenance_comparison_actions, defaultComparisonActions);
  const priorities = parseSettingJson(settings.maintenance_priorities, defaultPriorities);
  const faqItems = parseSettingJson(settings.maintenance_faq_items, defaultFaqItems);

  const processSteps = settings.maintenance_process_steps
    ? parseSettingJson(settings.maintenance_process_steps, defaultProcessSteps)
    : defaultProcessSteps.map((step, index) => {
        const settingValue = settings[`maintenance_step_${index + 1}`];
        return settingValue ? { ...step, description: settingValue } : step;
      });

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-zinc-950">
      <section className="relative overflow-hidden bg-black text-white">
        <FillImage src={heroImage} alt="" priority sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/25" />
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-cyan-100">
              {settings.maintenance_badge || defaultMaintenanceText.badge}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">
              {settings.maintenance_title || defaultMaintenanceText.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-200 md:text-xl">
              {settings.maintenance_intro || defaultMaintenanceText.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#servis-talep-formu" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-base font-black text-zinc-950 transition hover:bg-white">
                Servis Talebi Oluştur
              </a>
              <a href={whatsappHref} {...whatsappProps} className="inline-flex justify-center rounded-full border border-white/25 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/20">
                WhatsApp ile İletişime Geç
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
              Hizmetlerimiz
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_services_title || defaultMaintenanceText.servicesTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-zinc-600">
              {settings.maintenance_services_text || defaultMaintenanceText.servicesText}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-zinc-900 to-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 transition-colors group-hover:border-cyan-200 group-hover:bg-cyan-50 group-hover:text-cyan-700">
                  <LineIcon path={service.icon || defaultServices[0].icon} />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-zinc-950">{service.title}</h3>
                <p className="mt-4 text-sm leading-6 text-zinc-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="servis-talep-formu" className="scroll-mt-28 bg-white py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Servis Talebi</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_request_title || defaultMaintenanceText.requestTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              {settings.maintenance_request_text || defaultMaintenanceText.requestText}
            </p>
            <div className="mt-8 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 md:p-7">
              <h3 className="text-xl font-black text-zinc-950">{settings.maintenance_request_tip_title || defaultMaintenanceText.requestTipTitle}</h3>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-zinc-700">
                {requestTips.map((tip) => (
                  <li key={tip} className="flex gap-3"><span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-cyan-600" />{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <ServiceRequestForm />
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Ürün Grupları</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_device_title || defaultMaintenanceText.deviceTitle}</h2>
              <p className="mt-4 text-lg leading-relaxed text-zinc-600">
                {settings.maintenance_device_text || defaultMaintenanceText.deviceText}
              </p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-950 transition-colors hover:text-cyan-700">
              Ürünleri İncele <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {deviceCategories.map((category) => (
              <div key={category} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-950/5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-cyan-800">
                  <LineIcon path="M10 2v7.3a2 2 0 0 1-.6 1.4L4.6 15.5A2 2 0 0 0 4 17v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2a2 2 0 0 0-.6-1.4l-4.8-4.9A2 2 0 0 1 14 9.3V2M8 2h8M7 17h10" className="h-5 w-5" />
                </div>
                <h3 className="text-base font-extrabold leading-snug tracking-tight text-zinc-950">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Uygulamalar</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_project_title || defaultMaintenanceText.projectTitle}</h2>
            <p className="mt-4 text-lg leading-relaxed text-zinc-600">
              {settings.maintenance_project_text || defaultMaintenanceText.projectText}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {serviceProjects.map((project, index) => {
              const deviceType = project.deviceType || project.title || "Servis Uygulaması";
              const serviceType = project.serviceType || project.process || "Servis işlemi";
              const brandModel = [project.brand, project.model].filter(Boolean).join(" / ");

              return (
              <article key={`${deviceType}-${project.brand || ""}-${project.model || ""}-${index}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-[#f5f7f8] shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-950/10">
                <div className="relative h-64 overflow-hidden bg-zinc-900">
                  <FillImage src={project.image} alt={`${deviceType} servis fotoğraf alanı`} sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover opacity-85 transition-transform duration-500 hover:scale-105" />
                  <div className="absolute left-4 top-4 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                    {project.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black tracking-tight text-zinc-950">{deviceType}</h3>
                  {brandModel && <p className="mt-2 text-sm font-semibold text-zinc-500">{brandModel}</p>}
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-cyan-700">İşlem: {serviceType}</p>
                  {project.serviceDate && <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">Servis Tarihi: {project.serviceDate}</p>}
                  <p className="mt-4 text-sm leading-6 text-zinc-600">{project.description}</p>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Karşılaştırma</span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_comparison_title || defaultMaintenanceText.comparisonTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              {settings.maintenance_comparison_text || defaultMaintenanceText.comparisonText}
            </p>
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-zinc-950">Yapılan işlemler</h3>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-zinc-700 sm:grid-cols-2">
                {comparisonActions.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-800">
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="m5 10 3 3 7-7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {beforeAfterItems.map((item) => (
              <div key={item.label} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="relative h-72 overflow-hidden bg-zinc-900">
                  <FillImage src={item.image} alt={`${item.label} görsel alanı`} sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Nasıl İlerliyoruz?</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{settings.maintenance_process_title || defaultMaintenanceText.processTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-zinc-600">
                {settings.maintenance_process_text || defaultMaintenanceText.processText}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {processSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-zinc-200 bg-[#f5f7f8] p-6 shadow-sm">
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-cyan-100 text-lg font-black text-cyan-800">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-zinc-950">{step.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-cyan-200 bg-cyan-50 p-6 md:p-8">
            <h3 className="text-2xl font-black text-zinc-950">Kısa Not</h3>
            <p className="mt-3 text-lg leading-8 text-zinc-700">
              {settings.maintenance_note || defaultMaintenanceText.processNote}
            </p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black py-20 text-white md:py-24">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="container relative mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">
              Neden PeriyotLab?
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">{settings.maintenance_priorities_title || defaultMaintenanceText.prioritiesTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-300">
              {settings.maintenance_priorities_text || defaultMaintenanceText.prioritiesText}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {priorities.map((item) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-300 text-black">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m5 10 3 3 7-7" />
                  </svg>
                </span>
                <p className="text-sm font-semibold leading-6 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">SSS</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 md:text-5xl">{settings.maintenance_faq_title || defaultMaintenanceText.faqTitle}</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-base font-black tracking-tight text-zinc-950">
                  {item.question}
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition group-open:rotate-45 group-open:bg-cyan-100 group-open:text-cyan-800">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-20 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-zinc-950 p-8 text-white shadow-2xl shadow-cyan-950/10 md:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight md:text-5xl">{settings.maintenance_final_cta_title || defaultMaintenanceText.finalCtaTitle}</h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
                  {settings.maintenance_final_cta_text || defaultMaintenanceText.finalCtaText}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a href="#servis-talep-formu" className="inline-flex justify-center rounded-full bg-cyan-300 px-7 py-4 text-base font-black text-zinc-950 transition hover:bg-white">
                  Servis Talebi Oluştur
                </a>
                <a href={whatsappHref} {...whatsappProps} className="inline-flex justify-center rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white/20">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
