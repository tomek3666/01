import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import JobCard from '@/components/JobCard';
import ResumeCard from '@/components/ResumeCard';

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { locale } = await params;
  const { tab: tabParam } = await searchParams;
  const tab = tabParam === 'resumes' ? 'resumes' : 'vacancies';
  const t = await getTranslations('jobs');

  const [jobs, resumes] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }).catch(() => []),
    prisma.resume.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }).catch(() => []),
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/jobs/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            {t('createVacancy')}
          </Link>
          <Link
            href={`/${locale}/resumes/new`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
          >
            {t('createResume')}
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <Link
          href={`/${locale}/jobs`}
          className={`px-4 py-2 font-medium border-b-2 transition -mb-px ${
            tab === 'vacancies'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('vacancies')} ({jobs.length})
        </Link>
        <Link
          href={`/${locale}/jobs?tab=resumes`}
          className={`px-4 py-2 font-medium border-b-2 transition -mb-px ${
            tab === 'resumes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('resumes')} ({resumes.length})
        </Link>
      </div>

      {tab === 'vacancies' ? (
        jobs.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">{t('noJobs')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} locale={locale} />
            ))}
          </div>
        )
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl">{t('noResumes')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
