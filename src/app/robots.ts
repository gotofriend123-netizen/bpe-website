import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/dashboard/', 
        '/booking/', 
        '/api/', 
        '/check-in/',
        '/availability', 
        '/calendar', 
        '/demo', 
        '/scan-qr', 
        '/login', 
        '/signup', 
        '/forgot-password', 
        '/update-password'
      ],
    },
    sitemap: 'https://blackpepperentertainment.in/sitemap.xml',
  };
}
