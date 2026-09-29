export const PHONE_VALIDATION_MESSAGE = "Geçerli bir cep telefonu numarası giriniz. Örn: 5321234567";

export const CONTACT_SUCCESS_MESSAGE =
  "Talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Merhaba, laboratuvar cihazım için bakım/onarım hizmeti hakkında bilgi almak istiyorum.";

export const FLOATING_WHATSAPP_MESSAGE =
  "Merhaba, PeriyotLab laboratuvar cihazları bakım ve onarım hizmetleri hakkında bilgi almak istiyorum.";

export const CONTACT_SETTING_KEYS = [
  "contact_email",
  "contact_phone",
  "contact_whatsapp",
  "contact_address",
  "contact_office_name",
  "contact_working_hours",
] as const;

export type ContactSettingKey = (typeof CONTACT_SETTING_KEYS)[number];
export type ContactSettings = Partial<Record<ContactSettingKey, string>>;

export type ContactInfo = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  officeName: string;
  workingHours: string;
  mapsQuery: string;
};

export const defaultContactInfo: ContactInfo = {
  email: "info@periyotlab.com",
  phone: "",
  whatsapp: "",
  address: "ANITTEPE MAH. IŞIK SOKAK NO:25/A\nÇANKAYA / ANKARA",
  officeName: "PeriyotLab",
  workingHours: "Pazartesi - Cumartesi\n09:00 - 18:00\nPazar Kapalı",
  mapsQuery: "ANITTEPE MAH. IŞIK SOKAK NO:25/A, ÇANKAYA, ANKARA",
};

function cleanSetting(value: string | undefined) {
  return value?.trim() || "";
}

export function resolveContactInfo(settings: ContactSettings = {}): ContactInfo {
  const phone = cleanSetting(settings.contact_phone) || defaultContactInfo.phone;
  const whatsapp = cleanSetting(settings.contact_whatsapp) || phone || defaultContactInfo.whatsapp;
  const address = cleanSetting(settings.contact_address) || defaultContactInfo.address;

  return {
    email: cleanSetting(settings.contact_email) || defaultContactInfo.email,
    phone,
    whatsapp,
    address,
    officeName: cleanSetting(settings.contact_office_name) || defaultContactInfo.officeName,
    workingHours: cleanSetting(settings.contact_working_hours) || defaultContactInfo.workingHours,
    mapsQuery: address.replace(/\s+/g, " ").replace("ÇANKAYA / ANKARA", "ÇANKAYA, ANKARA"),
  };
}

export function normalizeTrMobilePhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("0090")) {
    digits = digits.slice(2);
  }

  if (/^90(5\d{9})$/.test(digits)) {
    return digits.slice(2);
  }

  if (/^0(5\d{9})$/.test(digits)) {
    return digits.slice(1);
  }

  if (/^5\d{9}$/.test(digits)) {
    return digits;
  }

  return null;
}

export function getWhatsappNumber(phone: string) {
  const normalizedPhone = normalizeTrMobilePhone(phone);
  return normalizedPhone ? `90${normalizedPhone}` : "";
}

export function getWhatsappHref(phone: string, message = DEFAULT_WHATSAPP_MESSAGE) {
  const whatsappNumber = getWhatsappNumber(phone);

  if (!whatsappNumber) {
    return "/contact";
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function getGoogleMapsHref(query: string) {
  const encodedQuery = encodeURIComponent(query || defaultContactInfo.mapsQuery);
  return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
}

export function getGoogleMapsEmbedHref(query: string) {
  const encodedQuery = encodeURIComponent(query || defaultContactInfo.mapsQuery);
  return `https://www.google.com/maps?q=${encodedQuery}&output=embed`;
}
