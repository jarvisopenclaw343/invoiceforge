'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg tracking-tight">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0">
            <rect width="22" height="22" rx="5" fill="#1e40af" />
            <rect x="5" y="5" width="12" height="2" rx="1" fill="white" />
            <rect x="5" y="9" width="8" height="2" rx="1" fill="white" opacity="0.7" />
            <rect x="5" y="13" width="10" height="2" rx="1" fill="white" opacity="0.5" />
            <rect x="13" y="13" width="4" height="4" rx="1" fill="#93c5fd" />
          </svg>
          InvoiceForge
        </Link>

        <nav className="flex items-center gap-1">
          {[
            { href: '/', label: 'Builder' },
            { href: '/templates', label: 'Templates' },
            { href: '/pricing', label: 'Pricing' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                path === href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
