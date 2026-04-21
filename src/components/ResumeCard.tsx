import Link from 'next/link';
import { getLocalizedField } from '@/lib/utils';

interface ResumeCardProps {
  resume: {
    id: string;
    titleTj: string;
    titleRu: string;
    experience: string | null;
    phone: string;
    status: string;
    user: {
      username: string;
      name: string | null;
    };
  };
  locale: string;
}

export default function ResumeCard({ resume, locale }: ResumeCardProps) {
  const title = getLocalizedField(resume, 'title', locale);

  return (
    <Link href={`/${locale}/resumes/${resume.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100 h-full">
        <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">{title}</h3>
        <span className="inline-block bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded-full mb-3">
          Резюме
        </span>
        {resume.experience && (
          <p className="text-xs text-gray-500">Опыт: {resume.experience}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">📞 {resume.phone}</p>
      </div>
    </Link>
  );
}
