import prisma from "@/lib/prisma";

const HIDDEN_PRODUCTS_KEY = "hidden_product_ids";

function parseHiddenProductIds(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is string => typeof item === "string" && item.length > 0);
  } catch {
    return [];
  }
}

export async function getHiddenProductIds() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: HIDDEN_PRODUCTS_KEY },
    select: { value: true },
  });

  return parseHiddenProductIds(setting?.value);
}

export async function isProductHidden(id: string) {
  const hiddenIds = await getHiddenProductIds();
  return hiddenIds.includes(id);
}

export async function setProductHidden(id: string, hidden: boolean) {
  const hiddenIds = new Set(await getHiddenProductIds());

  if (hidden) {
    hiddenIds.add(id);
  } else {
    hiddenIds.delete(id);
  }

  await prisma.siteSetting.upsert({
    where: { key: HIDDEN_PRODUCTS_KEY },
    update: { value: JSON.stringify([...hiddenIds]) },
    create: { key: HIDDEN_PRODUCTS_KEY, value: JSON.stringify([...hiddenIds]) },
  });
}
