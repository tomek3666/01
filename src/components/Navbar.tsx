'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  locale: string;
  session: any;
}

export default function Navbar({ locale, session }: NavbarProps) {
  const t = useTranslations('nav');
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="text-xl font-bold text-blue-600">
          Ашт
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}`} className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
            {t('home')}
          </Link>
          <Link href={`/${locale}/listings`} className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
            {t('marketplace')}
          </Link>
          <Link href={`/${locale}/jobs`} className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
            {t('jobs')}
          </Link>
          {session?.user && (
            <Link href={`/${locale}/profile`} className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              {t('profile')}
            </Link>
          )}
          {isAdmin && (
            <Link href={`/${locale}/admin`} className="text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              {t('admin')}
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">{session.user.name || session.user.username}</span>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/auth/login`}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              {t('login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
