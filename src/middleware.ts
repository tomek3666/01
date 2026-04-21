import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['tj', 'ru'],
  defaultLocale: 'tj',
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
