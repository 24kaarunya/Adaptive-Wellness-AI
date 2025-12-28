export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/goals/:path*',
    '/monitoring/:path*',
    '/insights/:path*',
    '/onboarding/:path*',
  ],
};
