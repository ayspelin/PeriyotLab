import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import {
  getDefaultStatusNote,
  isServiceStatus,
  normalizeServiceHistory,
  type ServiceHistoryItem,
  type ServiceStatus,
} from "@/lib/serviceStatus";

const trackingAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type ServiceImageItem = {
  url?: string;
  name: string;
  type?: string;
  size?: number;
  isPublic?: boolean;
  source?: "request" | "admin";
};

function randomCodePart(length = 6) {
  const bytes = randomBytes(length);
  let result = "";

  for (const byte of bytes) {
    result += trackingAlphabet[byte % trackingAlphabet.length];
  }

  return result;
}

export async function generateUniqueTrackingCode(date = new Date()) {
  const year = String(date.getFullYear()).slice(-2);

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = `PL-${year}-${randomCodePart()}`;
    const existing = await prisma.serviceRecord.findUnique({
      where: { trackingCode: code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }
  }

  throw new Error("Benzersiz servis takip kodu üretilemedi.");
}

export function buildInitialServiceHistory(status: ServiceStatus = "RECEIVED", note?: string): ServiceHistoryItem[] {
  return [
    {
      status,
      date: new Date().toISOString(),
      note: note || getDefaultStatusNote(status),
    },
  ];
}

export function appendServiceHistory(history: unknown, status: ServiceStatus, note?: string) {
  return [
    ...normalizeServiceHistory(history),
    {
      status,
      date: new Date().toISOString(),
      note: note || getDefaultStatusNote(status),
    },
  ];
}

export function normalizeServiceImages(value: unknown): ServiceImageItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      const url = typeof candidate.url === "string" ? candidate.url.trim() : "";
      const name = typeof candidate.name === "string" ? candidate.name.trim() : "";

      if (!url && !name) {
        return null;
      }

      const image: ServiceImageItem = {
        name: name || url,
        isPublic: candidate.isPublic === true,
        source: candidate.source === "request" ? "request" : "admin",
      };

      if (url) image.url = url;
      if (typeof candidate.type === "string") image.type = candidate.type;
      if (typeof candidate.size === "number") image.size = candidate.size;

      return image;
    })
    .filter((item): item is ServiceImageItem => Boolean(item));
}

export function getPublicServiceImages(value: unknown) {
  return normalizeServiceImages(value).filter((image) => image.isPublic && image.url);
}

export function normalizeServiceStatus(value: unknown, fallback: ServiceStatus = "RECEIVED") {
  return isServiceStatus(value) ? value : fallback;
}

export function getRequestImagesFromFiles(files: File[]) {
  return files.map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
    isPublic: false,
    source: "request" as const,
  }));
}
