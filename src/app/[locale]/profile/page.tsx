import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getLocalizedField } from '@/lib/utils';

export default async function ProfilePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const t = await getTranslations('profile');
  const tCommon = await getTranslations('common');

  const userId = session.user.id;

  const [listings, jobs, resumes] = await Promise.all([
    prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }).catch(() => []),
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
    prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []),
  ]);

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-700',
      PUBLISHED: 'bg-green-100 text-green-700',
      BLOCKED: 'bg-red-100 text-red-700',
    };
    const labels: Record<string, string> = {
      DRAFT: tCommon('draft'),
      PUBLISHED: tCommon('published'),
      BLOCKED: tCommon('blocked'),
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
        {labels[status] || status}
      </span>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('title')}</h1>

      {/* Listings */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">{t('myListings')}</h2>
          <Link href={`/${locale}/listings/new`} className="text-blue-600 hover:underline text-sm">
            + {tCommon('create')}
          </Link>
        </div>
        {listings.length === 0 ? (
          <p className="text-gray-500 text-sm">{tCommon('noItems')}</p>
        ) : (
          <div className="space-y-2">
            {listings.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                <div>
                  <Link href={`/${locale}/listings/${item.id}`} className="font-medium hover:text-blue-600">
                    {getLocalizedField(item, 'title', locale)}
                  </Link>
                  <p className="text-sm text-gray-500">{item.location}</p>
                </div>
                {statusBadge(item.status)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Jobs */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">{t('myJobs')}</h2>
          <Link href={`/${locale}/jobs/new`} className="text-blue-600 hover:underline text-sm">
            + {tCommon('create')}
          </Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm">{tCommon('noItems')}</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                <div>
                  <Link href={`/${locale}/jobs/${item.id}`} className="font-medium hover:text-blue-600">
                    {getLocalizedField(item, 'title', locale)}
                  </Link>
                  <p className="text-sm text-gray-500">{item.location}</p>
                </div>
                {statusBadge(item.status)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resumes */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">{t('myResumes')}</h2>
          <Link href={`/${locale}/resumes/new`} className="text-blue-600 hover:underline text-sm">
            + {tCommon('create')}
          </Link>
        </div>
        {resumes.length === 0 ? (
          <p className="text-gray-500 text-sm">{tCommon('noItems')}</p>
        ) : (
          <div className="space-y-2">
            {resumes.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
                <div>
                  <Link href={`/${locale}/resumes/${item.id}`} className="font-medium hover:text-blue-600">
                    {getLocalizedField(item, 'title', locale)}
                  </Link>
                </div>
                {statusBadge(item.status)}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
