import type { Metadata } from "next";

export const SITE_NAME = "PeriyotLAB";
export const SITE_URL = "https://periyotlab.com.tr";
export const HOME_TITLE = "PeriyotLAB | Laboratuvar Cihazları Servis, Bakım ve Özel İmalat";
export const HOME_DESCRIPTION =
  "PeriyotLAB; laboratuvar cihazları için bakım, onarım, teknik servis, özel imalat ve laboratuvar çözümleri sunar.";
export const LOGO_IMAGE_PATH = "/logo.png";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export const homeMetadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: LOGO_IMAGE_PATH,
        width: 1254,
        height: 1254,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [LOGO_IMAGE_PATH],
  },
};
