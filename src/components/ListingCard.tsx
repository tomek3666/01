import Link from 'next/link';
import { getLocalizedField, formatPrice } from '@/lib/utils';

interface ListingCardProps {
  listing: {
    id: string;
    titleTj: string;
    titleRu: string;
    price: number | null;
    location: string;
    phone: string;
    status: string;
    category: {
      nameTj: string;
      nameRu: string;
    };
    user: {
      username: string;
      name: string | null;
    };
  };
  locale: string;
}

export default function ListingCard({ listing, locale }: ListingCardProps) {
  const title = getLocalizedField(listing, 'title', locale);
  const categoryName = getLocalizedField(listing.category, 'name', locale);

  return (
    <Link href={`/${locale}/listings/${listing.id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100 h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">{title}</h3>
          {listing.price && (
            <span className="text-blue-600 font-bold text-sm ml-2 whitespace-nowrap">
              {formatPrice(listing.price)}
            </span>
          )}
        </div>
        <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full mb-3">
          {categoryName}
        </span>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.location}
        </p>
      </div>
    </Link>
  );
}
