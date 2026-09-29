'use client';
import { usePathname } from 'next/navigation';

function shouldHidePublicChrome(pathname: string | null) {
  return (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password')
  );
}

export function ConditionalHeader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (shouldHidePublicChrome(pathname)) return null;
  return <>{children}</>;
}

export function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (shouldHidePublicChrome(pathname)) return null;
  return <>{children}</>;
}

export function ConditionalFloatingAction({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (shouldHidePublicChrome(pathname)) return null;
  return <>{children}</>;
}
