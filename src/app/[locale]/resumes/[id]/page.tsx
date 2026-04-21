import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getLocalizedField } from '@/lib/utils';

export default async function ResumeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations('jobs');

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { user: true },
  }).catch(() => null);

  if (!resume || resume.status !== 'PUBLISHED') notFound();

  const title = getLocalizedField(resume, 'title', locale);
  const desc = getLocalizedField(resume, 'desc', locale);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>

        <div className="flex gap-2 mb-4">
          <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
            {t('resume')}
          </span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">{desc}</p>

        <div className="border-t pt-4 space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{t('phone')}:</span> {resume.phone}
          </p>
          {resume.experience && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">{t('experience')}:</span> {resume.experience}
            </p>
          )}
        </div>

        <div className="mt-6">
          <Link href={`/${locale}/jobs?tab=resumes`} className="text-blue-600 hover:underline text-sm">
            ← {t('resumes')}
          </Link>
        </div>
      </div>
    </div>
  );
}
