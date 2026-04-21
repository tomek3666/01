export function formatPrice(price: number | null | undefined): string {
  if (price == null) return '';
  return new Intl.NumberFormat('ru-RU').format(price) + ' сом';
}

export function getLocalizedField(
  obj: Record<string, any>,
  field: string,
  locale: string
): string {
  const localeField = `${field}${locale === 'tj' ? 'Tj' : 'Ru'}`;
  return obj[localeField] || obj[`${field}Tj`] || '';
}

export const locales = ['tj', 'ru'] as const;
export type Locale = (typeof locales)[number];
