"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Geçersiz veya eksik token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setMessage("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bir hata oluştu.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Geçersiz Bağlantı</h1>
        <p className="mb-4">Bu şifre sıfırlama bağlantısı geçersiz veya eksik.</p>
        <Link href="/login" className="text-black font-bold hover:underline">Giriş Ekranına Dön</Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl font-extrabold text-black mb-4 text-center tracking-tight">Yeni Şifre Belirle</h1>
      <p className="text-sm text-zinc-500 text-center mb-8">Hesabınız için yeni bir şifre oluşturun.</p>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm text-center font-medium">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 rounded-xl px-4 py-3 mb-6 text-sm text-center font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Yeni Şifre</label>
          <input 
            type="password" 
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Yeni Şifre (Tekrar)</label>
          <input 
            type="password" 
            required
            className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-black text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 hover:shadow-lg transition-all disabled:opacity-50">
          {loading ? 'Güncelleniyor...' : 'ŞİFREYİ KAYDET'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[2rem] p-8 sm:p-12 shadow-xl">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="relative w-48 h-16">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" unoptimized quality={100} />
            </div>
          </Link>
        </div>
        <Suspense fallback={<div className="text-center p-4">Yükleniyor...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
