import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ablefull.org';

interface BreadcrumbItem {
  name: string;
  item: string; // The URL path relative to domain
}

/**
 * Generates JSON-LD BreadcrumbList structured data.
 */
export function generateBreadcrumbsSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.item.startsWith('/') ? '' : '/'}${item.item}`,
    })),
  };
}

/**
 * Standardizes metadata configuration for standard pages, including OG and Twitter.
 */
export function constructMetadata({
  title,
  description,
  image = '/images/og-default.png',
  canonicalUrl,
  noIndex = false,
}: {
  title: string;
  description: string;
  image?: string;
  canonicalUrl: string;
  noIndex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`,
      siteName: 'Ablefull',
      images: [
        {
          url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${BASE_URL}${image}`],
      creator: '@AblefullOrg',
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

/**
 * Mapping conditions to related programs for high-utility internal linking.
 */
export const CONDITION_PROGRAM_LINKS: Record<string, string[]> = {
  'down-syndrome': ['ihss-for-children', 'calable', 'medi-cal-for-kids-and-teens'],
  'autism-spectrum-disorder': ['ihss-for-children', 'calable', 'medi-cal-for-kids-and-teens'],
  'cerebral-palsy': ['ihss-for-children', 'calable', 'california-childrens-services'],
  'epilepsy': ['ihss-for-children', 'calable', 'medi-cal-for-kids-and-teens'],
  'speech-or-language-delay': ['california-childrens-services', 'medi-cal-for-kids-and-teens'],
  'adhd': ['medi-cal-for-kids-and-teens'],
};

/**
 * Mapping program categories to direct display names for Category Pages.
 */
export const CATEGORY_LABELS: Record<string, string> = {
  'financial-aid': 'Financial Assistance & Savings Plans',
  'iep-support': 'Special Education & IEP Advocacy',
  'healthcare': 'Healthcare & Medical Therapy Services',
  'caregiver-support': 'In-Home Caregiver Support & Wages',
};
