import { redirect } from "next/navigation";
import { SITE_NAME } from "@/lib/seo";

export const metadata = {
  title: `Servis Takip | ${SITE_NAME}`,
  description: "PeriyotLAB bakım onarım ve teknik servis talepleri.",
};

export default function ServiceTrackPage() {
  redirect("/bakim-onarim");
}
