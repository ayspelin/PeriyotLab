import prisma from "@/lib/prisma";
import {
  CONTACT_SETTING_KEYS,
  FLOATING_WHATSAPP_MESSAGE,
  getWhatsappHref,
  resolveContactInfo,
  type ContactSettings,
} from "@/lib/contactInfo";

async function getContactSettings() {
  const settings: ContactSettings = {};

  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [...CONTACT_SETTING_KEYS] } },
    });

    rows.forEach((row) => {
      settings[row.key as keyof ContactSettings] = row.value;
    });
  } catch {}

  return settings;
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6 flex-shrink-0 md:h-7 md:w-7">
      <path
        fill="currentColor"
        d="M16.03 4C9.4 4 4 9.35 4 15.93c0 2.1.56 4.16 1.62 5.97L4.1 27.9l6.17-1.48A12.1 12.1 0 0 0 16.03 28C22.66 28 28 22.65 28 16.07 28 9.49 22.66 4 16.03 4Zm0 21.9c-1.82 0-3.6-.49-5.14-1.42l-.37-.22-3.66.88.9-3.55-.24-.38a9.93 9.93 0 0 1-1.5-5.28c0-5.43 4.48-9.84 10-9.84 5.5 0 9.97 4.5 9.97 9.98 0 5.43-4.47 9.83-9.96 9.83Zm5.48-7.36c-.3-.15-1.78-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.18-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.12 3.2 5.14 4.49.72.3 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
      />
    </svg>
  );
}

export default async function FloatingWhatsAppButton() {
  const settings = await getContactSettings();
  const contactInfo = resolveContactInfo(settings);
  const href = getWhatsappHref(contactInfo.whatsapp || contactInfo.phone, FLOATING_WHATSAPP_MESSAGE);

  if (!href.startsWith("https://wa.me/")) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="group fixed bottom-4 right-4 z-[70] inline-flex items-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-emerald-900/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:bottom-6 sm:right-6 md:p-4"
    >
      <WhatsAppIcon />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 transition-all duration-200 md:inline-block md:group-hover:ml-2 md:group-hover:max-w-64 md:group-hover:opacity-100">
        WhatsApp ile iletişime geçin
      </span>
    </a>
  );
}
