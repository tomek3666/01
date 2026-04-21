import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/ListingCard';

export default async function ListingsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('listings');

  const listings = await prisma.listing.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: { category: true, user: true },
  }).catch(() => []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
        <Link
          href={`/${locale}/listings/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {t('createListing')}
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">{t('noListings')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
