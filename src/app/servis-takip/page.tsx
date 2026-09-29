import ServiceTrackClient from "./ServiceTrackClient";

export const metadata = {
  title: "Servis Takip | PeriyotLab",
  description: "PeriyotLab servis takip kodunuzla cihazınızın güncel servis durumunu görüntüleyin.",
};

export default function ServiceTrackPage() {
  return <ServiceTrackClient />;
}
