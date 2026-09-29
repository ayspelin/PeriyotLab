export const SERVICE_STATUSES = [
  "RECEIVED",
  "DIAGNOSIS",
  "WAITING_APPROVAL",
  "IN_REPAIR",
  "TESTING",
  "COMPLETED",
  "DELIVERED",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export type ServiceHistoryItem = {
  status: ServiceStatus;
  date: string;
  note?: string;
};

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  RECEIVED: "Cihaz Kabul Edildi",
  DIAGNOSIS: "Arıza Tespiti Yapılıyor",
  WAITING_APPROVAL: "Onay Bekleniyor",
  IN_REPAIR: "Bakım / Onarım Yapılıyor",
  TESTING: "Kontrol ve Test Aşamasında",
  COMPLETED: "Servis Tamamlandı",
  DELIVERED: "Teslim Edildi",
};

export const SERVICE_TIMELINE_LABELS: Record<ServiceStatus, string> = {
  RECEIVED: "Cihaz Kabul Edildi",
  DIAGNOSIS: "Arıza Tespiti",
  WAITING_APPROVAL: "Onay",
  IN_REPAIR: "Bakım / Onarım",
  TESTING: "Test",
  COMPLETED: "Servis Tamamlandı",
  DELIVERED: "Teslim",
};

export function isServiceStatus(value: unknown): value is ServiceStatus {
  return typeof value === "string" && SERVICE_STATUSES.includes(value as ServiceStatus);
}

export function getServiceStatusLabel(status: string) {
  return isServiceStatus(status) ? SERVICE_STATUS_LABELS[status] : status;
}

export function getServiceTimelineLabel(status: string) {
  return isServiceStatus(status) ? SERVICE_TIMELINE_LABELS[status] : status;
}

export function getServiceStatusIndex(status: string) {
  const index = SERVICE_STATUSES.indexOf(status as ServiceStatus);
  return index >= 0 ? index : 0;
}

export function getDefaultStatusNote(status: ServiceStatus) {
  const notes: Record<ServiceStatus, string> = {
    RECEIVED: "Cihaz servis merkezimize kabul edildi.",
    DIAGNOSIS: "Teknik inceleme ve arıza tespiti başladı.",
    WAITING_APPROVAL: "Servis işlemleri için müşteri onayı bekleniyor.",
    IN_REPAIR: "Bakım / onarım işlemleri devam ediyor.",
    TESTING: "Cihaz kontrol ve test aşamasında.",
    COMPLETED: "Servis işlemi tamamlandı.",
    DELIVERED: "Cihaz müşteriye teslim edildi.",
  };

  return notes[status];
}

export function normalizeServiceHistory(value: unknown): ServiceHistoryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const items = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Record<string, unknown>;
      if (!isServiceStatus(candidate.status)) {
        return null;
      }

      const historyItem: ServiceHistoryItem = {
        status: candidate.status,
        date: typeof candidate.date === "string" ? candidate.date : new Date().toISOString(),
      };

      if (typeof candidate.note === "string") {
        historyItem.note = candidate.note;
      }

      return historyItem;
    })
    .filter((item): item is ServiceHistoryItem => Boolean(item));

  return items;
}

export function buildServiceTimeline(currentStatus: string, history: unknown) {
  const activeIndex = getServiceStatusIndex(currentStatus);
  const normalizedHistory = normalizeServiceHistory(history);

  return SERVICE_STATUSES.map((status, index) => {
    const historyItem = [...normalizedHistory].reverse().find((item) => item.status === status);

    return {
      status,
      label: SERVICE_TIMELINE_LABELS[status],
      fullLabel: SERVICE_STATUS_LABELS[status],
      date: historyItem?.date,
      note: historyItem?.note,
      state: index < activeIndex ? "done" : index === activeIndex ? "current" : "next",
    };
  });
}
