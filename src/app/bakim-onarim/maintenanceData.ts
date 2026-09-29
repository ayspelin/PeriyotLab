export type MaintenanceService = {
  title: string;
  description: string;
  icon: string;
};

export type MaintenanceServiceProject = {
  image: string;
  deviceType: string;
  brand: string;
  model: string;
  serviceType: string;
  description: string;
  status: string;
  serviceDate?: string;
  title?: string;
  process?: string;
};

export type MaintenanceProcessStep = {
  title: string;
  description: string;
};

export type MaintenanceFaqItem = {
  question: string;
  answer: string;
};

export type MaintenanceBeforeAfterItem = {
  label: string;
  image: string;
};

export const defaultMaintenanceText = {
  badge: "Teknik Servis",
  title: "Laboratuvar Cihazları Bakım & Onarım",
  intro: "Laboratuvar cihazlarınız için arıza tespiti, bakım, onarım ve teknik servis çözümleri sunuyoruz.",
  heroImage: "/mock/hero2.png",
  requestTitle: "Cihazınız Arızalı mı?",
  requestText: "Cihazınız çalışmıyor, hata veriyor veya beklenen performansı göstermiyor mu? Cihaz bilgilerini ve yaşadığınız problemi bize iletin. Teknik ekibimiz servis süreci hakkında sizinle iletişime geçsin.",
  requestTipTitle: "Talep için faydalı bilgiler",
  servicesTitle: "Bakım ve onarım ihtiyacını net bir servis akışına dönüştürüyoruz.",
  servicesText: "Arıza tespitinden bakım sonrası kontrole kadar her adımda cihazın durumu, yapılacak işlem ve sonraki aşama anlaşılır şekilde paylaşılır.",
  deviceTitle: "Servis Verdiğimiz Cihazlar",
  deviceText: "Servis kapsamı cihazın teknik durumuna göre değerlendirilir. Aşağıdaki gruplar ilk değerlendirme için kullanılabilir.",
  projectTitle: "Servis Uygulamalarımız",
  projectText: "Bakım ve onarım sürecinden geçen cihazlardan örnek uygulamalar. Kart yapısı ileride gerçek servis fotoğraflarıyla kolayca güncellenebilir.",
  comparisonTitle: "Bakım Öncesi / Bakım Sonrası",
  comparisonText: "Servis kayıtları için iki görselli karşılaştırma alanı hazırlandı. Gerçek cihaz fotoğrafları eklendiğinde yapılan işlemler aynı alanda listelenebilir.",
  processTitle: "Sade ve anlaşılır servis süreci",
  processText: "Bakım onarım taleplerinde karmaşık teknik anlatımlar yerine, yapılacak işlemi ve sonraki adımı açık şekilde paylaşırız.",
  processNote: "Servis talebiniz için cihaz adı, marka-model ve yaşanan sorunu paylaşmanız yeterlidir. Ekibimiz sizinle en uygun adımı planlar.",
  prioritiesTitle: "Servis Sürecinde Neye Önem Veriyoruz?",
  prioritiesText: "Teknik servis ihtiyacında cihazın gerçek durumu, yapılacak işlem ve süreç iletişimi aynı ölçüde önemlidir.",
  faqTitle: "Sık Sorulan Sorular",
  finalCtaTitle: "Laboratuvar cihazınız için teknik destek mi gerekiyor?",
  finalCtaText: "Cihaz bilgilerinizi bize iletin, servis ihtiyacınızı birlikte değerlendirelim.",
};

export const defaultRequestTips = [
  "Cihaz markası, modeli ve ürün türü",
  "Hata mesajı, ses, ısıtma veya çalışma belirtisi",
  "Varsa cihaz etiketi veya arıza ekranı görseli",
];

export const defaultServices: MaintenanceService[] = [
  {
    title: "Arıza Tespiti",
    description: "Cihazdaki problemin kaynağını teknik kontroller ile belirliyoruz.",
    icon: "M21 21l-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z",
  },
  {
    title: "Bakım",
    description: "Cihazların performansını ve kullanım sürekliliğini korumaya yönelik bakım işlemleri.",
    icon: "M12 2v3M12 19v3M4.9 4.9 7 7M17.1 17.1l2 2M2 12h3M19 12h3M4.9 19.1l2-2M17.1 6.9l2-2",
  },
  {
    title: "Onarım",
    description: "Arızalı veya çalışmayan laboratuvar cihazlarının teknik müdahale ile yeniden kullanılabilir hale getirilmesi.",
    icon: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-3 3ZM16 2l6 6",
  },
  {
    title: "Parça Kontrolü / Değişimi",
    description: "Gerekli durumlarda arızalı veya kullanım ömrünü tamamlamış parçaların kontrolü ve değişimi.",
    icon: "M6 7h12M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 7l1 13h12l1-13M10 11v5M14 11v5",
  },
  {
    title: "Performans Kontrolü",
    description: "Bakım veya onarım sonrasında cihazın çalışma durumu kontrol edilir.",
    icon: "M4 18V6M4 18h16M8 15l3-4 3 2 4-7",
  },
  {
    title: "Özel Teknik Çözümler",
    description: "Standart servis işlemlerinin yeterli olmadığı durumlarda cihaz ve ihtiyaca özel teknik çözümler değerlendirilir.",
    icon: "M12 3l1.7 3.4 3.8.6-2.7 2.7.6 3.8L12 12.9 8.6 15l.6-3.8L6.5 8.5l3.8-.6L12 3ZM12 13v8M8 21h8",
  },
];

export const defaultDeviceCategories = [
  "Etüvler",
  "İnkübatörler",
  "Fırınlar",
  "Santrifüjler",
  "Çalkalayıcılar",
  "Isıtıcılar",
  "Laboratuvar terazileri",
  "Numune hazırlama cihazları",
  "Analiz cihazları",
  "Diğer laboratuvar ekipmanları",
];

export const defaultServiceProjects: MaintenanceServiceProject[] = [
  {
    image: "/mock/prod4.png",
    deviceType: "Laboratuvar Etüvü",
    brand: "Memmert",
    model: "UN Serisi",
    serviceType: "Isıtma problemi tespiti ve bakım",
    description: "Isıtma davranışı, bağlantılar ve genel çalışma durumu kontrol edilerek servis süreci tamamlanır.",
    status: "Servis Tamamlandı",
  },
  {
    image: "/mock/prod2.png",
    deviceType: "İnkübatör",
    brand: "Nüve",
    model: "EN Serisi",
    serviceType: "Genel bakım ve performans kontrolü",
    description: "Cihazın çalışma sürekliliğini etkileyen noktalar incelenir, bakım sonrası kontrol adımları uygulanır.",
    status: "Bakım Tamamlandı",
  },
  {
    image: "/mock/prod3.png",
    deviceType: "Santrifüj",
    brand: "Hettich",
    model: "Universal",
    serviceType: "Mekanik bakım",
    description: "Hareketli parçalar, çalışma dengesi ve güvenli kullanım için gerekli kontroller değerlendirilir.",
    status: "Onarım Tamamlandı",
  },
];

export const defaultBeforeAfterItems: MaintenanceBeforeAfterItem[] = [
  { label: "Bakım Öncesi", image: "/mock/prod1.png" },
  { label: "Bakım Sonrası", image: "/mock/prod4.png" },
];

export const defaultComparisonActions = [
  "Arıza tespiti",
  "Genel bakım",
  "Parça kontrolü",
  "Performans kontrolü",
];

export const defaultProcessSteps: MaintenanceProcessStep[] = [
  {
    title: "Servis Talebi",
    description: "Cihaz bilgilerini ve yaşadığınız problemi bize iletin.",
  },
  {
    title: "Ön Değerlendirme",
    description: "Cihaz ve arıza bilgilerini inceleyerek uygun servis yönlendirmesini planlarız.",
  },
  {
    title: "Arıza Tespiti",
    description: "Cihaz üzerinde gerekli teknik kontroller gerçekleştirilir.",
  },
  {
    title: "Bilgilendirme",
    description: "Gerekli işlem, parça ve tahmini servis süreci hakkında bilgi verilir.",
  },
  {
    title: "Bakım / Onarım",
    description: "Onaylanan servis işlemleri uygulanır.",
  },
  {
    title: "Kontrol ve Teslim",
    description: "İşlem sonrası cihaz kontrol edilir ve servis süreci tamamlanır.",
  },
];

export const defaultPriorities = [
  "Arızanın doğru tespit edilmesi",
  "Yapılacak işlemin açık şekilde paylaşılması",
  "Cihazın gereksiz işlem görmemesi",
  "Bakım ve onarım sürecinin kayıt altına alınması",
  "İşlem sonrası cihazın kontrol edilmesi",
  "Müşteri ile süreç boyunca iletişim",
];

export const defaultFaqItems: MaintenanceFaqItem[] = [
  {
    question: "Hangi cihazlara servis veriyorsunuz?",
    answer: "Laboratuvarlarda kullanılan farklı cihaz grupları için arıza tespiti, bakım, onarım ve teknik değerlendirme desteği sunuyoruz. Cihaz türünü ve yaşanan problemi paylaştığınızda uygun yönlendirmeyi birlikte netleştiririz.",
  },
  {
    question: "Cihazı servis merkezine göndermem gerekiyor mu?",
    answer: "Bu ihtiyaç cihaz türüne, arıza durumuna ve yapılacak kontrole göre değişebilir. Ön değerlendirme sonrasında cihazın yerinde mi yoksa servis sürecinde mi inceleneceği hakkında bilgi verilir.",
  },
  {
    question: "Servis öncesinde fiyat bilgisi veriliyor mu?",
    answer: "Arıza ve işlem kapsamı netleştirildikten sonra yapılacak işlem ve varsa parça ihtiyacı hakkında bilgilendirme yapılır. Kesin olmayan süre veya fiyat taahhüdü verilmeden önce teknik değerlendirme tamamlanır.",
  },
  {
    question: "Arıza tespiti nasıl yapılıyor?",
    answer: "Cihazın çalışma durumu, kullanıcıdan alınan arıza bilgisi ve gerekli teknik kontroller birlikte değerlendirilir. Amaç, problemin kaynağını doğru biçimde belirlemektir.",
  },
  {
    question: "Servis süresi ne kadar?",
    answer: "Servis süresi cihazın durumu, gerekli işlem kapsamı ve parça ihtiyacına göre değişir. Ön değerlendirme ve arıza tespiti sonrasında süreç hakkında daha net bilgi paylaşılır.",
  },
  {
    question: "Cihazın fotoğrafını göndererek ön bilgi alabilir miyim?",
    answer: "Evet. Cihaz etiketi, genel görünüm ve hata ekranı gibi görseller ön değerlendirme için yardımcı olabilir. Gerekli görüldüğünde ek bilgi talep edilebilir.",
  },
  {
    question: "Bakım ve onarım sonrası cihaz kontrol ediliyor mu?",
    answer: "Servis işlemi sonrasında cihazın çalışma durumu kontrol edilir ve tamamlanan işlem hakkında kullanıcı bilgilendirilir.",
  },
];

export function parseSettingJson<T>(value: string | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function compactLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
