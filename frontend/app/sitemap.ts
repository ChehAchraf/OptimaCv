import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://optimacv.com';
    const locales = ['en', 'fr', 'ar'];
    const pages = [
        '', '/payment', '/about', '/company', '/build-cv', '/CV_analyze', '/interview', '/dashboard', '/dashboard/history', '/dashboard/analyze'];

    const routes: MetadataRoute.Sitemap = [];

    // Generate routes for each locale
    locales.forEach((locale) => {
        pages.forEach((page) => {
            routes.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1.0 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((loc) => [loc, `${baseUrl}/${loc}${page}`])
                    ),
                },
            });
        });
    });

    return routes;
}
