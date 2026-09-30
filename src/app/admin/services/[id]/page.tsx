import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ServiceRecordDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await params;
  redirect("/admin/maintenance");
}
