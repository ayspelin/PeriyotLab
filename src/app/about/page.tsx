import prisma from "@/lib/prisma";

export const revalidate = 0; // Disable static caching so it updates immediately when changed in admin

export default async function AboutPage() {
  let settingsMap: Record<string, string> = {};

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: ['about_title', 'about_description', 'about_mission', 'about_vision', 'about_quality']
        }
      }
    });

    settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
  } catch {
    settingsMap = {};
  }

  const title = settingsMap.about_title || 'Hakkımızda';
  const description = settingsMap.about_description || 'PeriyotLab olarak, endüstrinin ihtiyaç duyduğu en yüksek kaliteli kimyasal bileşenleri sağlıyoruz. Güvenilirlik ve bilimsel mükemmeliyet temel vizyonumuzdur.';
  const mission = settingsMap.about_mission || 'Laboratuvar ortamında yenilikçi ve yüksek güvenlik standartlarına sahip ürünler sunarak, bilimsel araştırmaların hız kazanmasına destek olmak.';
  const vision = settingsMap.about_vision || 'Sektördeki kimyasal analiz süreçlerini en güvenilir referans materyaller ile standartlaştırıp, küresel çapta öncü bir bilimsel tedarik platformu haline gelmek.';
  const quality = settingsMap.about_quality || 'Sağladığımız her kimyasal madde, katı kalite kontrol prosedürlerinden geçmektedir. Uluslararası standartlara uygun sertifikasyonlarımız ile süreçlerimizi daima şeffaf tutarız.';

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{title}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="p-8 border border-gray-200 dark:border-gray-800 hover:border-foreground dark:hover:border-foreground transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4">Misyonumuz</h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {mission}
          </p>
        </div>
        <div className="p-8 border border-gray-200 dark:border-gray-800 hover:border-foreground dark:hover:border-foreground transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4">Vizyonumuz</h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {vision}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-16">
        <h3 className="text-2xl font-bold mb-6">Kalite Politikamız</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
          {quality}
        </p>
      </div>
    </div>
  );
}
