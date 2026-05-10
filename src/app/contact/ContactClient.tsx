'use client';
import { useState } from 'react';

interface Props {
  settings: Record<string, string>;
}

export default function ContactClient({ settings }: Props) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const email = settings['contact_email'] || 'info@periyotlab.com';
  const phone = settings['contact_phone'] || '+90 (212) 555 0123';
  const address = settings['contact_address'] || 'Ankara, Türkiye';
  const officeName = settings['contact_office_name'] || 'PeriyotLab';
  const workingHours = settings['contact_working_hours'] || 'Pazartesi - Cuma, 09:00 - 18:00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">İletişim</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Ürünlerimiz, toptan alımlar veya teknik destek hakkında bilgi almak için bizimle iletişime geçebilirsiniz.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Contact Form */}
        <div className="w-full lg:w-2/3">
          {status === 'success' ? (
            <div className="p-8 bg-green-50 text-green-800 border border-green-200">
              <h3 className="text-xl font-bold mb-2">Mesajınız Gönderildi!</h3>
              <p>Size en kısa sürede dönüş yapacağız. Teşekkür ederiz.</p>
              <button onClick={() => setStatus('idle')} className="mt-4 underline text-sm font-bold">Yeni mesaj gönder</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {status === 'error' && (
                <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-sm">{errorMessage}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Ad Soyad</label>
                  <input required type="text" id="name"
                    className="w-full p-4 bg-gray-50 dark:bg-zinc-900 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:border-foreground dark:focus:border-foreground transition-colors"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-3">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">E-Posta</label>
                  <input required type="email" id="email"
                    className="w-full p-4 bg-gray-50 dark:bg-zinc-900 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:border-foreground dark:focus:border-foreground transition-colors"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500">Mesajınız</label>
                <textarea required id="message" rows={6}
                  className="w-full p-4 bg-gray-50 dark:bg-zinc-900 border border-transparent hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:border-foreground dark:focus:border-foreground transition-colors"
                  value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
              </div>
              <button disabled={status === 'loading'} type="submit"
                className="px-8 py-4 bg-foreground text-background font-bold text-sm uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50">
                {status === 'loading' ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          )}
        </div>

        {/* Dynamic Contact Info */}
        <div className="w-full lg:w-1/3 space-y-10">
          <div className="border-l-2 border-foreground pl-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Ofis</h3>
            <p className="font-medium text-lg leading-relaxed whitespace-pre-line">{officeName}</p>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Adres</h3>
            <p className="font-medium text-lg leading-relaxed whitespace-pre-line">{address}</p>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">İletişim Bilgileri</h3>
            <p className="font-medium text-lg leading-relaxed">
              {email}<br />{phone}
            </p>
          </div>
          <div className="border-l-2 border-foreground pl-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">Çalışma Saatleri</h3>
            <p className="font-medium text-lg leading-relaxed whitespace-pre-line">{workingHours}</p>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">Konum</h3>
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.2046808796845!2d28.986861515415714!3d41.06456097929424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab6f30a905ccb%3A0xc68297753c1afefc!2sLevent%2C%20Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1682855554444!5m2!1str!2str" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
