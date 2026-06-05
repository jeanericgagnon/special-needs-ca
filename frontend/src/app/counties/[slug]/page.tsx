import { notFound } from 'next/navigation';
import { getCountyDetails, getCounties } from '@/lib/db';
import { MapPin, Phone, Landmark, Globe, ArrowLeft, BookOpen, ShieldCheck, Calculator } from 'lucide-react';
import Link from 'next/link';
import DirectoryReviews from '../../dashboard/components/DirectoryReviews';
import SeoSchema from '@/app/components/seo-schema';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const counties = await getCounties();
  return counties.map((county) => ({
    slug: county.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const counties = await getCounties();
  const county = counties.find(c => c.id === slug);
  
  if (county) {
    return {
      title: `${county.name} County Special Needs Benefits & Resources`,
      description: `Find local IHSS contact numbers, school district offices, and Regional Center catchments for ${county.name} County, California.`,
    };
  }

  return {
    title: 'County Resources Not Found',
  };
}

export default async function CountyPage({ params }: Props) {
  const { slug } = await params;
  const countyDetails = await getCountyDetails(slug);

  if (!countyDetails) {
    notFound();
  }

  const countiesList = (await getCounties()).map(c => ({ id: c.id, name: c.name }));
  const countyWage = countyDetails.ihss_wage_rate || 18.00;

  const countyName = countyDetails.name;
  const rcName = countyDetails.regionalCenters?.[0]?.name || 'Local Regional Center';
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the local IHSS hourly wage in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The current In-Home Supportive Services (IHSS) provider wage in ${countyName} is $${countyWage.toFixed(2)} per hour.`
        }
      },
      {
        '@type': 'Question',
        name: `Which Regional Center serves families in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Families in ${countyName} are served by ${rcName}, which manages developmental assessments, respite care allocations, and Lanterman Act service coordination.`
        }
      },
      {
        '@type': 'Question',
        name: `How long does the school district have to respond to an IEP assessment request in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Under California Education Code, school districts in ${countyName} have 15 calendar days to provide an Assessment Plan once a parent submits a written request. After the plan is signed, they have 60 calendar days to complete evaluations and hold the initial IEP meeting.`
        }
      }
    ]
  };

  const governmentOrganizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    'name': `${countyName} County Disability Services`,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': countyName,
      'addressRegion': 'CA',
      'addressCountry': 'US'
    },
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': `${countyName} County, CA`
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <SeoSchema data={[faqSchema, governmentOrganizationSchema]} />
      
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/benefits" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Guides & Resources
        </Link>
      </div>

      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.04) 0%, rgba(var(--primary-rgb), 0.01) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'scale(1.5)' }}>
          <MapPin size={200} color="var(--primary-color)" />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          California County Resource Directory
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          {countyDetails.name} County Disability Benefits Guide
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem', maxWidth: '800px', lineHeight: '1.5' }}>
          If you live in {countyDetails.name} County, California, your child is eligible for specialized local services. The local IHSS hourly wage is <strong>${countyWage.toFixed(2)}/hour</strong>. Use this directory to contact intake offices, look up school districts, check Regional Center boundary coverage, and read community reviews.
        </p>
      </div>

      {/* 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' }} className="answer-grid-layout">
        
        {/* LEFT COLUMN: Local resource categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Regional Center */}
          <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark color="var(--primary-color)" size={20} /> Regional Center Coverage
            </h2>
            {countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {countyDetails.regionalCenters.map((rc) => (
                  <div key={rc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{rc.name}</h3>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}><strong>Catchment Boundary:</strong> {rc.catchment_boundaries}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div style={{ background: '#fafafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Early Start (Age 0-3) Intake:</span>
                        <a href={`tel:${rc.early_start_contact}`} style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'underline' }}>{rc.early_start_contact}</a>
                      </div>
                      <div style={{ background: '#fafafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Lanterman (Age 3+) Intake:</span>
                        <a href={`tel:${rc.lanterman_intake_contact}`} style={{ color: 'var(--primary-color)', fontWeight: 700, textDecoration: 'underline' }}>{rc.lanterman_intake_contact}</a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <a href={rc.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                        <Globe size={14} /> Visit RC Website
                      </a>
                    </div>

                    {/* Community Reviews Widget */}
                    <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                      <DirectoryReviews
                        entityType="regional_center"
                        entityId={rc.id}
                        entityName={rc.name}
                        countyId={countyDetails.id}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>No Regional Center contacts in database.</p>
            )}
          </div>

          {/* Section 2: County Support Offices */}
          <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin color="var(--primary-color)" size={20} /> County Admin Support Offices
            </h2>
            {countyDetails.countyOffices && countyDetails.countyOffices.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {countyDetails.countyOffices.map((office) => (
                  <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{office.office_name}</h3>
                    <span><strong>Address:</strong> {office.address}</span>
                    <span><strong>Phone Intake:</strong> <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a></span>
                    {office.email && <span><strong>Email:</strong> {office.email}</span>}
                    {office.website && (
                      <a href={office.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem' }}>
                        <Globe size={14} /> Visit Office Webpage
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>No county administrative offices listed in DB.</p>
            )}
          </div>

          {/* Section 3: School Districts & SELPAs */}
          <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen color="var(--primary-color)" size={20} /> Special Education SELPAs & Districts
            </h2>
            
            {/* School Districts */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Local School Districts</h3>
              {countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {countyDetails.schoolDistricts.map((dist) => (
                    <div key={dist.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dist.name}</span>
                      {dist.spec_ed_contact_phone && (
                        <a href={`tel:${dist.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                          <Phone size={12} /> {dist.spec_ed_contact_phone}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No school district records in database.</p>
              )}
            </div>

            {/* SELPAs */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Special Education Local Plan Areas (SELPAs)</h3>
              {countyDetails.selpas && countyDetails.selpas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {countyDetails.selpas.map((selpa) => (
                    <div key={selpa.id} style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{selpa.name}</strong>
                      <span style={{ color: 'var(--text-light)' }}>Counties Served: {selpa.counties_served}</span>
                      {selpa.website && (
                        <a href={selpa.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                          Visit SELPA Portal
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No local SELPA boundaries listed.</p>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Quick links & CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Wage details card */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <Calculator size={16} color="var(--primary-color)" /> {countyDetails.name} County Wages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>IHSS Wage Rate:</span>
                <strong style={{ color: '#10b981' }}>${countyWage.toFixed(2)}/hr</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Max Monthly Hours:</span>
                <strong>283 Hours</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span>Max Monthly Pay:</span>
                <strong style={{ color: '#10b981' }}>${(283 * countyWage).toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</strong>
              </div>
            </div>
          </div>

          {/* Quick link to other counties */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>Other California Counties</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {countiesList.map(c => (
                <Link key={c.id} href={`/counties/${c.id}`} style={{ fontSize: '0.8rem', color: c.id === slug ? 'var(--primary-color)' : 'var(--text-light)', textDecoration: 'none', fontWeight: c.id === slug ? 700 : 500 }}>
                  {c.name} County {c.id === slug && '📍'}
                </Link>
              ))}
            </div>
          </div>

          {/* Onboarding Wizard bridge */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={16} /> Run Eligibility Wizard
            </h4>
            <p style={{ fontSize: '0.72rem', opacity: 0.9, marginBottom: '0.85rem', lineHeight: '1.3' }}>
              Answer questions about your child&apos;s age and diagnosis to build a personalized care plan for {countyDetails.name} County.
            </p>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button 
                style={{
                  width: '100%', 
                  fontSize: '0.78rem', 
                  height: '34px', 
                  background: 'white', 
                  color: 'var(--primary-color)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Launch Onboarding Wizard →
              </button>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
