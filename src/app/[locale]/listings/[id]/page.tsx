import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getLocalizedField, formatPrice } from '@/lib/utils';

export default async function ListingDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations('listings');
  const tCommon = await getTranslations('common');

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { category: true, user: true },
  }).catch(() => null);

  if (!listing || listing.status !== 'PUBLISHED') notFound();

  const title = getLocalizedField(listing, 'title', locale);
  const desc = getLocalizedField(listing, 'desc', locale);
  const categoryName = getLocalizedField(listing.category, 'name', locale);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {listing.price && (
            <span className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</span>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {categoryName}
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {listing.location}
          </span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{desc}</p>

        <div className="border-t pt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('phone')}:</span> {listing.phone}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('location')}:</span> {listing.location}
          </p>
        </div>

        <div className="mt-6">
          <Link
            href={`/${locale}/listings`}
            className="text-blue-600 hover:underline text-sm"
          >
            ← {t('title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
