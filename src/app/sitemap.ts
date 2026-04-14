import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://blackpepperentertainment.in';

  // Core Pages
  const coreRoutes = [
    '',
    '/the-arcade',
    '/verve-studio',
    '/spaces',
    '/pricing',
    '/contact',
    '/faq',
    '/about',
    '/events',
    '/blogs',
    '/gallery',
    '/host-an-event',
    '/legal/cancellation',
    '/legal/privacy',
    '/legal/reschedule',
    '/legal/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Local SEO Landing Pages
  const seoRoutes = [
    '/community-hall-shankar-nagar-raipur',
    '/party-hall-raipur',
    '/podcast-studio-raipur',
    '/photoshoot-studio-raipur',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...coreRoutes, ...seoRoutes];
}
