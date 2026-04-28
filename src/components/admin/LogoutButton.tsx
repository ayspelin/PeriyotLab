"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/login' })} 
      className="w-full py-3 px-4 bg-transparent border border-slate-600 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded text-sm font-semibold"
    >
      Çıkış Yap
    </button>
  );
}
