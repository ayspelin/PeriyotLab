export type TechnicalSpecification = {
  key: string;
  value: string;
};

export type GalleryImage = {
  url: string;
  alt?: string;
};

const turkishChars: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  i: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  Ç: "c",
  Ğ: "g",
  İ: "i",
  I: "i",
  Ö: "o",
  Ş: "s",
  Ü: "u",
};

export function createSlug(value: string) {
  return value
    .trim()
    .replace(/[çğıiöşüÇĞİIÖŞÜ]/g, (char) => turkishChars[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function normalizeTechnicalSpecifications(value: unknown): TechnicalSpecification[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const key = typeof candidate.key === "string" ? candidate.key.trim() : "";
      const val = typeof candidate.value === "string" ? candidate.value.trim() : "";

      if (!key || !val) {
        return null;
      }

      return { key, value: val };
    })
    .filter((item): item is TechnicalSpecification => Boolean(item));
}

export function normalizeGalleryImages(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        const url = item.trim();
        return url ? { url } : null;
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const url = typeof candidate.url === "string" ? candidate.url.trim() : "";
      const alt = typeof candidate.alt === "string" ? candidate.alt.trim() : "";

      if (!url) {
        return null;
      }

      return alt ? { url, alt } : { url };
    })
    .filter((item): item is GalleryImage => Boolean(item));
}
