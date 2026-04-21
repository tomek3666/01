import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/ListingCard';
import JobCard from '@/components/JobCard';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');

  const [listings, jobs] = await Promise.all([
    prisma.listing.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { category: true, user: true },
    }),
    prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { user: true },
    }),
  ]).catch(() => [[], []]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-12 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">{t('hero')}</h1>
        <p className="text-xl mb-8 text-blue-100">{t('heroSub')}</p>
        <div className="flex gap-4 justify-center">
          <Link
            href={`/${locale}/listings/new`}
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {t('postListing')}
          </Link>
          <Link
            href={`/${locale}/jobs/new`}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-400 transition border border-blue-400"
          >
            {t('postJob')}
          </Link>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t('latestListings')}</h2>
          <Link href={`/${locale}/listings`} className="text-blue-600 hover:underline">
            {tNav('marketplace')} →
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="text-gray-500">Нет объявлений</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Latest Jobs */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{t('latestJobs')}</h2>
          <Link href={`/${locale}/jobs`} className="text-blue-600 hover:underline">
            {tNav('jobs')} →
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-500">Нет вакансий</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
