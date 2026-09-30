import { redirect } from "next/navigation";

export const metadata = {
  title: "Bakım Onarım | PeriyotLab",
  description: "PeriyotLab bakım onarım ve teknik servis talepleri.",
};

export default function ServiceTrackPage() {
  redirect("/bakim-onarim");
}
