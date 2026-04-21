import Link from 'next/link';
import { getLocalizedField } from '@/lib/utils';

interface JobCardProps {
  job: {
    id: string;
    titleTj: string;
    titleRu: string;
    salary: string | null;
    location: string;
    phone: string;
    status: string;
    user: {
      username: string;
      name: string | null;
    };
  };
  locale: string;
}

export default function JobCard({ job, locale }: JobCardProps) {
  const title = getLocalizedField(job, 'title', locale);

  return (
    <Link href={`/${locale}/jobs/${job.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100 h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{title}</h3>
          {job.salary && (
            <span className="text-green-600 font-bold text-sm ml-2 whitespace-nowrap">{job.salary}</span>
          )}
        </div>
        <span className="inline-block bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full mb-3">
          Вакансия
        </span>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {job.location}
        </p>
      </div>
    </Link>
  );
}
