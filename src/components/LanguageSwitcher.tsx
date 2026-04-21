'use client';

import { usePathname, useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale(newLocale: string) {
    // Replace the current locale segment in the path
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => switchLocale('tj')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
          locale === 'tj'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        TJ
      </button>
      <button
        onClick={() => switchLocale('ru')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
          locale === 'ru'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        RU
      </button>
    </div>
  );
}
