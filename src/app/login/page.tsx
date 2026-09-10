"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Hatalı e-posta veya şifre.");
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
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
        
        <h1 className="text-xl font-extrabold text-black mb-8 text-center tracking-tight">PeriyotLab&apos;a Hoşgeldiniz</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-6 text-sm text-center font-medium">
            {error}
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
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-2">Şifre</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right mt-1">
              <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-black font-semibold transition-colors">Şifremi Unuttum?</Link>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-black text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? 'Giriş Yapılıyor...' : 'GİRİŞ YAP'}
          </button>
          
          <div className="mt-8 text-center text-sm text-zinc-500 pt-4">
            Yönetici hesabı, yetkili kurulum bilgileriyle oluşturulur.
          </div>
        </form>
      </div>
    </div>
  );
}
