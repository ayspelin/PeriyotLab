"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCustomManufacturingItemButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${title}" kaydını silmek istediğinize emin misiniz?`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/custom-manufacturing/${id}`, { method: "DELETE" });

      if (!response.ok) {
        alert("Özel imalat kaydı silinemedi.");
        return;
      }

      router.refresh();
    } catch {
      alert("Özel imalat kaydı silinemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex justify-center rounded-lg border border-rose-200 bg-white px-5 py-3 text-base font-bold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Siliniyor..." : "Sil"}
    </button>
  );
}
