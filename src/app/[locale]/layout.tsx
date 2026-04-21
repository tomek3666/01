import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const session = await getServerSession(authOptions);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Navbar locale={locale} session={session} />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
