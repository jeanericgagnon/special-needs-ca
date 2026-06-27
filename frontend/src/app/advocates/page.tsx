import { getCounties, getIepAdvocates } from '@/lib/db';
import { isPublicDirectoryRecordEligible } from '@/lib/publicTruth';
import { Metadata } from 'next';
import { Search } from 'lucide-react';
import Link from 'next/link';
import AdvocateDirectoryClient from './advocate-directory-client';
import SourceFreshnessDisclosure, { type DisclosureSource } from '@/app/components/SourceFreshnessDisclosure';


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
    title: `California IEP Advocate Listings in ${countyName}`,
    description: `Review source-backed California special education advocate listings in ${countyName}, including contact details, counties served, and public source notes.`,
    alternates: {
      canonical: `/advocates`
    },
    robots: {
      index: false,
      follow: true
    }
  };
}

export default async function AdvocatesDirectoryPage({ searchParams }: Props) {
  const sp = await searchParams;
  const selectedCounty = sp.county || '';

  // 1. Fetch counties for filter dropdown
  const counties = await getCounties('california');

  // 2. Fetch advocates (filter by county if selected, defaulting to California statewide if not)
  const advocates = (await getIepAdvocates(selectedCounty, 'california')).filter(isPublicDirectoryRecordEligible);
  const disclosureSources: DisclosureSource[] = advocates
    .filter((advocate) => advocate.source_url)
    .map((advocate) => ({
      name: advocate.name,
      url: advocate.source_url || undefined,
      lastReviewedDate: advocate.last_verified_date || null,
      verificationStatus: advocate.verification_status || 'unverified',
      sourceType: advocate.source_type || 'public_listing',
      confidenceScore: advocate.confidence_score ?? null,
    }))
    .filter((source, index, arr) => arr.findIndex((candidate) => candidate.url === source.url) === index)
    .slice(0, 8);
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
          Publicly listed California special education advocates and advisor organizations with source notes, freshness dates, and contact details. Families should still verify fit, credentials, and availability before relying on a listing.
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
              {...{ onchange: 'this.form.submit()' }}
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
            : 'California Advocate Listings'}
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
      <AdvocateDirectoryClient initialAdvocates={advocates} selectedCounty={selectedCounty} />

      {disclosureSources.length > 0 ? (
        <SourceFreshnessDisclosure
          sources={disclosureSources}
          correctionSuggestionType="other"
          correctionTargetId={`advocates-${selectedCounty || 'california'}`}
          correctionTargetName={selectedCountyName ? `California advocates serving ${selectedCountyName}` : 'California advocates directory'}
          correctionButtonLabel="Report an advocate listing issue"
        />
      ) : null}
    </main>
  );
}
