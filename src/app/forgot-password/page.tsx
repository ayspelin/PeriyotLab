"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Bir hata oluştu.");
      }

      setMessage("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

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
        
        <h1 className="text-xl font-extrabold text-black mb-4 text-center tracking-tight">Şifremi Unuttum</h1>
        <p className="text-sm text-zinc-500 text-center mb-8">E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.</p>
        
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
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">E-Posta</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-black text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? 'Gönderiliyor...' : 'BAĞLANTI GÖNDER'}
          </button>
          
          <div className="mt-8 text-center text-sm text-zinc-500 pt-4 border-t border-zinc-100">
            <Link href="/login" className="text-black font-bold hover:underline transition-all">Giriş Ekranına Dön</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
