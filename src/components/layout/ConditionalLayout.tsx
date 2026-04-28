'use client';
import { usePathname } from 'next/navigation';

export function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return null;
  return <>{children}</>;
}

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/login')) return null;
  return <>{children}</>;
}
