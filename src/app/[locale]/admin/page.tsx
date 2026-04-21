'use client';

import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface Item {
  id: string;
  titleTj: string;
  titleRu: string;
  status: string;
  type: 'listing' | 'job' | 'resume';
}

export default function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');

  const [listings, setListings] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'jobs' | 'resumes'>('listings');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/login`);
      return;
    }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push(`/${locale}`);
      return;
    }
    if (status === 'authenticated') {
      fetchAll();
    }
  }, [status, session, locale, router]);

  async function fetchAll() {
    const [l, j, r] = await Promise.all([
      fetch('/api/listings?admin=1').then((r) => r.json()).catch(() => []),
      fetch('/api/jobs?admin=1').then((r) => r.json()).catch(() => []),
      fetch('/api/resumes?admin=1').then((r) => r.json()).catch(() => []),
    ]);
    setListings(l);
    setJobs(j);
    setResumes(r);
  }

  async function updateStatus(type: string, id: string, newStatus: string) {
    await fetch(`/api/${type}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAll();
  }

  function getTitle(item: any) {
    return locale === 'tj' ? item.titleTj : item.titleRu;
  }

  function statusBadge(status: string) {
    const colors: Record<string, string> = {
      DRAFT: 'bg-yellow-100 text-yellow-700',
      PUBLISHED: 'bg-green-100 text-green-700',
      BLOCKED: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[status] || 'bg-gray-100'}`}>
        {tCommon(status.toLowerCase() as any)}
      </span>
    );
  }

  function renderItems(items: any[], type: string) {
    if (items.length === 0) return <p className="text-gray-500 text-sm py-4">{tCommon('noItems')}</p>;
    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{getTitle(item)}</p>
              <p className="text-sm text-gray-500">{item.user?.username}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {statusBadge(item.status)}
              {item.status !== 'PUBLISHED' && (
                <button
                  onClick={() => updateStatus(type, item.id, 'PUBLISHED')}
                  className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700 transition"
                >
                  {tCommon('publish')}
                </button>
              )}
              {item.status !== 'BLOCKED' && (
                <button
                  onClick={() => updateStatus(type, item.id, 'BLOCKED')}
                  className="bg-red-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  {tCommon('block')}
                </button>
              )}
              {item.status !== 'DRAFT' && (
                <button
                  onClick={() => updateStatus(type, item.id, 'DRAFT')}
                  className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg hover:bg-gray-300 transition"
                >
                  {tCommon('draft')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (status === 'loading') return <div className="text-center py-8">{tCommon('loading')}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('title')}</h1>

      <div className="flex gap-2 mb-6 border-b">
        {(['listings', 'jobs', 'resumes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium border-b-2 transition -mb-px ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'listings' ? t('allListings') : tab === 'jobs' ? t('allJobs') : t('allResumes')}
            <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
              {tab === 'listings' ? listings.length : tab === 'jobs' ? jobs.length : resumes.length}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'listings' && renderItems(listings, 'listings')}
      {activeTab === 'jobs' && renderItems(jobs, 'jobs')}
      {activeTab === 'resumes' && renderItems(resumes, 'resumes')}
    </div>
  );
}
