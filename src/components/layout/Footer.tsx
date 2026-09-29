import Link from 'next/link';
import prisma from "@/lib/prisma";
import {
  CONTACT_SETTING_KEYS,
  getWhatsappHref,
  resolveContactInfo,
  type ContactSettings,
} from "@/lib/contactInfo";

export default async function Footer() {
  let footerText = "Modern Endüstri İçin Gelişmiş Kimyasal Çözümler";
  const contactSettings: ContactSettings = {};

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["footer_text", ...CONTACT_SETTING_KEYS] } },
    });

    settings.forEach((setting) => {
      if (setting.key === "footer_text" && setting.value) {
        footerText = setting.value;
        return;
      }

      contactSettings[setting.key as keyof ContactSettings] = setting.value;
    });
  } catch {}

  const contactInfo = resolveContactInfo(contactSettings);
  const whatsappHref = getWhatsappHref(contactInfo.whatsapp || contactInfo.phone);
  const whatsappProps = whatsappHref.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 py-16 mt-auto border-t border-zinc-900">
      <div className="container mx-auto px-4 text-center flex flex-col items-center">
        {/* Brand */}
        <h2 className="text-2xl font-extrabold mb-4 tracking-tight text-white flex items-center gap-2">
          PERİYOT<span className="text-zinc-500 font-medium">LAB</span>
        </h2>
        
        {/* Slogan */}
        <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">{footerText}</p>
        
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-12">
          <Link href="/about" className="hover:text-white transition-colors">Hakkımızda</Link>
          <Link href="/products" className="hover:text-white transition-colors">Ürünler</Link>
          <Link href="/bakim-onarim" className="hover:text-white transition-colors">Bakım Onarım</Link>
          <Link href="/contact" className="hover:text-white transition-colors">İletişim</Link>
        </div>

        <div className="mb-12 grid w-full max-w-4xl grid-cols-1 gap-6 text-sm leading-6 text-zinc-400 md:grid-cols-3">
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Adres</h3>
            <p className="whitespace-pre-line">{contactInfo.address}</p>
          </div>
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">İletişim</h3>
            <p>
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
              {contactInfo.phone ? (
                <>
                  <br />
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`} className="hover:text-white transition-colors">{contactInfo.phone}</a>
                  <br />
                  <a href={whatsappHref} {...whatsappProps} className="hover:text-white transition-colors">WhatsApp</a>
                </>
              ) : null}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500">Çalışma Saatleri</h3>
            <p className="whitespace-pre-line">{contactInfo.workingHours}</p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="w-full max-w-lg border-t border-zinc-900 pt-8 text-xs text-zinc-600 flex justify-center items-center">
          <span>&copy; {new Date().getFullYear()} PeriyotLab. Tüm hakları saklıdır.</span>
        </div>
      </div>
    </footer>
  );
}
