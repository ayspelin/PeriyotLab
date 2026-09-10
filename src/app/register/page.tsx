'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Kayıt başarılı! Lütfen giriş yapın.");
        router.push('/login');
      } else {
        setError(data.error || 'Kayıt sırasında bir hata oluştu');
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md p-8 bg-white border border-zinc-200 shadow-sm rounded-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Yeni Yönetici Ekle</h1>
          <p className="text-zinc-500 text-sm mt-2">Bu işlem için mevcut bir yönetici oturumu gerekir.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Ad Soyad</label>
            <input
              type="text"
              required
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-black"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">E-Posta Adresi</label>
            <input
              type="email"
              required
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-black"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors text-black"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white font-bold tracking-wider uppercase text-sm rounded hover:bg-zinc-800 transition-colors mt-2"
          >
            {loading ? 'Kaydediliyor...' : 'Yöneticiyi Ekle'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link href="/admin/settings" className="text-zinc-500 hover:text-black transition-colors">
            Site ayarlarına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
