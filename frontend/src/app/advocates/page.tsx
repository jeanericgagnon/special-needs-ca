import { getCounties, getIepAdvocates } from '@/lib/db';
import { Metadata } from 'next';
import { Search } from 'lucide-react';
import Link from 'next/link';
import AdvocateDirectoryClient from './advocate-directory-client';


type Props = {
  searchParams: Promise<{ county?: string }>;
};

// Generate high-relevance SEO tags for the advocates directory page
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const countyName = sp.county 
    ? sp.county.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' County' 
    : 'California';

  return {
    title: `IEP Advocates & Special Ed Advisors in ${countyName} (2026)`,
    description: `Find special education IEP advocates in ${countyName}. Compare experience, hourly rates, credentials, and languages to advocate for your child in school.`,
    alternates: {
      canonical: `/advocates`
    }
  };
}

export default async function AdvocatesDirectoryPage({ searchParams }: Props) {
  const sp = await searchParams;
  const selectedCounty = sp.county || '';

  // 1. Fetch counties for filter dropdown
  const counties = getCounties();

  // 2. Fetch advocates (filter by county if selected)
  const advocates = getIepAdvocates(selectedCounty);

  // Get name of selected county
  const selectedCountyName = selectedCounty
    ? counties.find(c => c.id === selectedCounty)?.name || selectedCounty
    : '';

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          California IEP Advocates Directory
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Vetted special education advisors, consultants, and legal advocates who help families secure accommodation services, IEP goals, and inclusion placements.
        </p>
      </div>

      {/* Filter panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem 2rem', 
          borderRadius: '20px', 
          background: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}
      >
        <form method="GET" action="/advocates" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
            <Search size={18} color="var(--primary-color)" />
            Filter by County Served:
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <select 
              name="county" 
              defaultValue={selectedCounty}
              // Automatically submit when changed to avoid extra clicks
              // We use simple inline JS to submit the parent form on change
              // @ts-expect-error: React onChange prop expects function but we use raw string for inline HTML event submission in Server Component
              onChange="this.form.submit()"
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '10px', 
                fontSize: '0.95rem',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <option value="">-- All California Counties --</option>
              {counties.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: 'auto', 
              padding: '0.75rem 1.5rem', 
              fontSize: '0.95rem', 
              height: '42px',
              marginTop: 0 
            }}
          >
            Apply Filter
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
          {selectedCountyName 
            ? `Advocates Serving ${selectedCountyName}` 
            : 'All Registered California Advocates'}
          <span style={{ fontSize: '0.95rem', color: 'var(--text-light)', fontWeight: 400, marginLeft: '0.75rem' }}>
            ({advocates.length} results)
          </span>
        </h2>

        {selectedCounty && (
          <Link 
            href="/advocates" 
            style={{ 
              fontSize: '0.85rem', 
              color: 'var(--primary-color)', 
              textDecoration: 'none', 
              fontWeight: 500 
            }}
          >
            Clear Filters
          </Link>
        )}
      </div>

      {/* Directory Cards Grid with search/sort client */}
      <AdvocateDirectoryClient initialAdvocates={advocates} />

      {/* JSON-LD ProfessionalService Schema Markup for Local SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": advocates.map(adv => ({
              "@type": "ProfessionalService",
              "name": adv.name,
              "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400",
              "telephone": adv.phone,
              "email": adv.email,
              "url": adv.website,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": adv.counties_served.split(',')[0]?.trim().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "California",
                "addressRegion": "CA",
                "addressCountry": "US"
              },
              "description": `${adv.name} is a professional special education IEP advocate with ${adv.experience_years} years of experience. Credentials: ${adv.credentials}. Hourly rate info: ${adv.price_rate}. Languages: ${adv.languages_spoken}.`,
              "priceRange": adv.price_rate,
              "areaServed": adv.counties_served.split(',').map(s => ({
                "@type": "AdministrativeArea",
                "name": s.trim().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + " County"
              }))
            }))
          })
        }}
      />
    </main>
  );
}
