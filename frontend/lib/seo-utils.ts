// SEO and Performance Optimization Utilities

/**
 * Robots.txt content for SEO
 */
export const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: https://optimacv.com

# Sitemaps
Sitemap: https://optimacv.com/sitemap.xml
`;

/**
 * Generate structured data for SEO
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'OptimaCv',
        url: 'https://optimacv.com',
        logo: 'https://optimacv.com/logo.png',
        description: 'AI-powered CV optimization and analysis platform',
        sameAs: [
            // Add social media links here
        ],
    };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
