import { getCounties, getIepAdvocates } from '@/lib/db';
import { Metadata } from 'next';
import { ShieldCheck, Phone, Mail, Globe, MapPin, Award, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import CopyButton from '@/components/copy-button';


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
              // @ts-ignore
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

      {/* Directory Cards Grid */}
      {advocates.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            borderRadius: '20px', 
            background: 'rgba(255,255,255,0.6)' 
          }}
        >
          <p style={{ fontSize: '1.05rem', color: 'var(--text-light)' }}>
            No advocates are currently registered serving {selectedCountyName} in our database. We are continually verifying and adding new advocates.
          </p>
          <Link href="/advocates" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: 'auto' }}>Show All Advocates</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {advocates.map(adv => (
            <div 
              key={adv.id} 
              className="glass-panel" 
              style={{ 
                padding: '2rem', 
                borderRadius: '24px', 
                background: 'rgba(255, 255, 255, 0.75)',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem',
                border: '1px solid var(--glass-border)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Main details */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div 
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '12px', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary-color)',
                      flexShrink: 0
                    }}
                  >
                    <Award size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {adv.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{adv.credentials}</span>
                      <span>•</span>
                      <span><strong>{adv.experience_years} years</strong> experience</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Sparkles size={12} color="var(--primary-color)" /> Rates: <strong>{adv.price_rate}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rates badge */}
                <div 
                  style={{ 
                    padding: '0.4rem 1rem', 
                    borderRadius: '999px', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    color: '#10b981', 
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  Hourly Rate: {adv.price_rate.split(' / ')[0]}
                </div>
              </div>

              {/* Specific info breakdown */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.01)',
                  border: '1px solid rgba(0,0,0,0.03)',
                  fontSize: '0.88rem'
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>🌍 Counties Served:</strong>
                  <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                    <MapPin size={12} color="var(--primary-color)" /> 
                    {adv.counties_served.split(',').map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>🗣️ Languages Spoken:</strong>
                  <span style={{ color: 'var(--text-light)' }}>{adv.languages_spoken}</span>
                </div>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem' }}>📞 Contact Details:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Phone size={13} style={{ flexShrink: 0 }} /> 
                      <a href={`tel:${adv.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.phone}</a>
                      <CopyButton text={adv.phone} size={11} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Mail size={13} style={{ flexShrink: 0 }} /> 
                      <a href={`mailto:${adv.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.email}</a>
                      <CopyButton text={adv.email} size={11} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <a 
                  href={adv.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--primary-color)', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.3rem', 
                    textDecoration: 'none', 
                    fontWeight: 600 
                  }}
                >
                  <Globe size={14} /> Visit Website & Contact Advisor
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

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
