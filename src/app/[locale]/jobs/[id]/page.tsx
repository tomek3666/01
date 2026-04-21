import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getLocalizedField } from '@/lib/utils';

export default async function JobDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations('jobs');

  const job = await prisma.job.findUnique({
    where: { id },
    include: { user: true },
  }).catch(() => null);

  if (!job || job.status !== 'PUBLISHED') notFound();

  const title = getLocalizedField(job, 'title', locale);
  const desc = getLocalizedField(job, 'desc', locale);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {job.salary && (
            <span className="text-lg font-semibold text-green-600">{job.salary}</span>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {t('vacancy')}
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
            {job.location}
          </span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{desc}</p>

        <div className="border-t pt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('phone')}:</span> {job.phone}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('location')}:</span> {job.location}
          </p>
          {job.salary && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t('salary')}:</span> {job.salary}
            </p>
          )}
        </div>

        <div className="mt-6">
          <Link href={`/${locale}/jobs`} className="text-blue-600 hover:underline text-sm">
            ← {t('title')}
          </Link>
        </div>
      </div>
    </div>
  );
}
