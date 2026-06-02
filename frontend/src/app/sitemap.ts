import { MetadataRoute } from 'next';
import { getCounties } from '@/lib/db';

const DIAGNOSES_SLUGS = [
  'autism', 'down-syndrome', 'cerebral-palsy', 'epilepsy', 
  'intellectual-disability', 'visual-impairment', 'hearing-loss', 
  'adhd', 'dyslexia', 'congenital-heart-disease', 'cystic-fibrosis'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Config site base URL (fallback to standard domain for production crawlers)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://california-navigator.org';
  
  // 1. Static high-level routes
  const staticRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    }
  ];

  // 2. Load counties from database
  let counties: any[] = [];
  try {
    counties = getCounties();
  } catch (err) {
    console.error('Sitemap counties fetch failed:', err);
    // Fallback static list in case of db query error during static compilation
    counties = [
      { id: 'los-angeles' },
      { id: 'orange' },
      { id: 'alameda' },
      { id: 'san-francisco' }
    ];
  }

  // 3. Programmatic SEO routes: mapping 11 diagnoses x 58 counties (638 unique landing pages!)
  const seoRoutes = counties.flatMap(county => {
    return DIAGNOSES_SLUGS.map(diagnosis => ({
      url: `${baseUrl}/benefits/${diagnosis}/${county.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  });

  return [...staticRoutes, ...seoRoutes];
}
