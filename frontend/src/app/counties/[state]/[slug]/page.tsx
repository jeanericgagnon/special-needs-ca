import { notFound } from 'next/navigation';
import { getCountyDetails, getCounties, getStateByIdOrCode, getAllStates } from '@/lib/db';
import { MapPin, Phone, Landmark, Globe, ArrowLeft, BookOpen, ShieldCheck, Calculator } from 'lucide-react';
import Link from 'next/link';
import DirectoryReviews from '@/app/dashboard/components/DirectoryReviews';
import SeoSchema from '@/app/components/seo-schema';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';

type Props = {
  params: Promise<{ state: string; slug: string }>;
};

export async function generateStaticParams() {
  const counties = await getCounties();
  const states = await getAllStates();
  const paramsList: { state: string; slug: string }[] = [];
  
  for (const c of counties) {
    const s = states.find(st => st.id === c.state_id);
    if (s) {
      paramsList.push({
        state: s.id,
        slug: c.id
      });
    }
  }
  return paramsList;
}

export async function generateMetadata({ params }: Props) {
  const { state, slug } = await params;
  const stateData = await getStateByIdOrCode(state);
  const countyDetails = await getCountyDetails(slug);
  
  if (stateData && countyDetails && countyDetails.state_id === stateData.id) {
    return {
      title: `${countyDetails.name} County Special Needs Benefits & Resources (${stateData.code})`,
      description: `Find local service helpline numbers, school district offices, and catchment boundaries for ${countyDetails.name} County, ${stateData.name}.`,
      alternates: {
        canonical: `/counties/${stateData.id}/${countyDetails.id}`
      }
    };
  }

  return {
    title: 'County Resources Not Found',
  };
}

const stateCatchments: Record<string, string> = {
  'california': 'Regional Center',
  'texas': 'LIDDA',
  'florida': 'APD Office',
  'new-york': 'OPWDD Front Door'
};

const educationLabels: Record<string, string> = {
  'california': 'Special Education Local Plan Areas (SELPAs)',
  'new-york': 'Boards of Cooperative Educational Services (BOCES)',
  'default': 'Regional Special Education Agencies'
};

export default async function CountyPage({ params }: Props) {
  const { state, slug } = await params;
  const stateData = await getStateByIdOrCode(state);
  const countyDetails = await getCountyDetails(slug);

  if (!stateData || !countyDetails || countyDetails.state_id !== stateData.id) {
    notFound();
  }

  const countiesList = (await getCounties(stateData.id)).map(c => ({ id: c.id, name: c.name }));
  const countyWage = countyDetails.ihss_wage_rate || 18.00;

  const countyName = countyDetails.name;
  const catchmentLabel = stateCatchments[stateData.id] || 'Developmental Disability Agency';
  const educationLabel = educationLabels[stateData.id] || educationLabels.default;
  const insuranceLabel = stateData.id === 'california' ? 'Medi-Cal' : 'Medicaid';
  
  const rcName = countyDetails.regionalCenters?.[0]?.name || `Local ${catchmentLabel}`;
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the local ${stateData.id === 'california' ? 'IHSS' : 'Medicaid waiver'} hourly wage in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The current ${stateData.id === 'california' ? 'In-Home Supportive Services (IHSS) provider' : 'Medicaid waiver provider'} wage in ${countyName} is $${countyWage.toFixed(2)} per hour.`
        }
      },
      {
        '@type': 'Question',
        name: `Which ${catchmentLabel} serves families in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Families in ${countyName} are served by ${rcName}, which manages developmental assessments, support resources, and service coordination.`
        }
      },
      {
        '@type': 'Question',
        name: `How long does the school district have to respond to an IEP assessment request in ${countyName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: stateData.id === 'california' 
            ? `Under California Education Code, school districts in ${countyName} have 15 calendar days to provide an Assessment Plan once a parent submits a written request. After the plan is signed, they have 60 calendar days to complete evaluations and hold the initial IEP meeting.`
            : `Under local state rules, school districts in ${countyName} must respond to a parent request for an IEP assessment within standard state timelines (typically 15 to 30 days depending on the state).`
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
      'addressRegion': stateData.code,
      'addressCountry': 'US'
    },
    'areaServed': {
      '@type': 'AdministrativeArea',
      'name': `${countyName} County, ${stateData.code}`
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <SeoSchema data={[faqSchema, governmentOrganizationSchema]} />
      
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/benefits/${stateData.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to Guides & Resources
        </Link>
      </div>

      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.04) 0%, rgba(var(--primary-rgb), 0.01) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'scale(1.5)' }}>
          <MapPin size={200} color="var(--primary-color)" />
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          {stateData.name} County Resource Directory
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          {countyDetails.name} County Disability Benefits Guide
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.5rem', maxWidth: '800px', lineHeight: '1.5' }}>
          If you live in {countyDetails.name} County, {stateData.name}, your child is eligible for specialized local services. The local waiver/caregiver hourly wage is <strong>${countyWage.toFixed(2)}/hour</strong>. Use this directory to contact intake offices, look up school districts, check {catchmentLabel} boundary coverage, and read community reviews.
        </p>
      </div>

      {/* 2-Column Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'flex-start' }} className="answer-grid-layout">
        
        {/* LEFT COLUMN: Local resource categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Developmental Catchment Agency */}
          <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Landmark color="var(--primary-color)" size={20} /> {catchmentLabel} Coverage
            </h2>
            {countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {countyDetails.regionalCenters.map((rc) => (
                  <div key={rc.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{rc.name}</h3>
                    <p style={{ color: 'var(--text-light)', margin: 0 }}><strong>Catchment Boundary:</strong> {rc.catchment_boundaries}</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div style={{ background: '#fafafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Early Intervention Intake:</span>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{rc.early_start_contact || 'N/A'}</span>
                      </div>
                      <div style={{ background: '#fafafa', padding: '0.75rem', borderRadius: '8px', border: '1px solid #eee' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>Intake & Family Services Contact:</span>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>{rc.lanterman_intake_contact || 'N/A'}</span>
                      </div>
                    </div>
                    {rc.intake_phone && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong>Intake Phone:</strong> <a href={`tel:${rc.intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{rc.intake_phone}</a>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <a href={rc.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                        <Globe size={14} /> Visit Website
                      </a>
                    </div>

                    <TrustBadge
                      status={rc.verification_status}
                      lastVerifiedDate={rc.last_verified_date}
                      sourceUrl={rc.source_url || rc.website}
                      entityId={rc.id}
                      entityName={rc.name}
                      entityType="regional_center"
                    />

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
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>No {catchmentLabel} contacts in database.</p>
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
                  <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{office.office_name}</h3>
                    <span><strong>Address:</strong> {office.address}</span>
                    <span><strong>Phone Intake:</strong> <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a></span>
                    {office.email && <span><strong>Email:</strong> {office.email}</span>}
                    {office.website && (
                      <a href={office.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem' }}>
                        <Globe size={14} /> Visit Office Webpage
                      </a>
                    )}
                    <TrustBadge
                      status={office.verification_status}
                      lastVerifiedDate={office.last_verified_date}
                      sourceUrl={office.source_url || office.website}
                      entityId={office.id}
                      entityName={office.office_name}
                      entityType="county_office"
                    />
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
              <BookOpen color="var(--primary-color)" size={20} /> Special Education & school Districts
            </h2>
            
            {/* School Districts */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Local School Districts</h3>
              {countyDetails.schoolDistricts && countyDetails.schoolDistricts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {countyDetails.schoolDistricts.map((dist) => (
                    <div key={dist.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fafafa', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #eee', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{dist.name}</span>
                        {dist.spec_ed_contact_phone && (
                          <a href={`tel:${dist.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none' }}>
                            <Phone size={12} /> {dist.spec_ed_contact_phone}
                          </a>
                        )}
                      </div>
                      <TrustBadge
                        status={dist.verification_status}
                        lastVerifiedDate={dist.last_verified_date}
                        sourceUrl={dist.source_url || dist.website}
                        entityId={dist.id}
                        entityName={dist.name}
                        entityType="school_district"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No school district records in database.</p>
              )}
            </div>

            {/* SELPAs / Education Boards */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>{educationLabel}</h3>
              {countyDetails.selpas && countyDetails.selpas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {countyDetails.selpas.map((selpa) => (
                    <div key={selpa.id} style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '0.75rem' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{selpa.name}</strong>
                      <span style={{ color: 'var(--text-light)' }}>Counties Served: {selpa.counties_served}</span>
                      {selpa.website && (
                        <a href={selpa.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Globe size={12} /> Visit Portal
                        </a>
                      )}
                      <TrustBadge
                        status={selpa.verification_status}
                        lastVerifiedDate={selpa.last_verified_date}
                        sourceUrl={selpa.source_url || selpa.website}
                        entityId={selpa.id}
                        entityName={selpa.name}
                        entityType="selpa"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No local special education boundaries listed in DB.</p>
              )}
            </div>

            {/* Local Nonprofits & Support Organizations */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Local Nonprofit Support Organizations</h3>
              {countyDetails.localOrganizations && countyDetails.localOrganizations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {countyDetails.localOrganizations.map((org) => (
                    <div key={org.id} style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.75rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{org.name}</strong>
                      {org.focus_condition && org.focus_condition !== 'any' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                          Focus: {org.focus_condition.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}
                      <span><strong>Phone:</strong> <a href={`tel:${org.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{org.phone}</a></span>
                      {org.website && (
                        <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline', marginTop: '0.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Globe size={12} /> Visit Support Site
                        </a>
                      )}
                      <TrustBadge
                        status={org.verification_status}
                        lastVerifiedDate={org.last_verified_date}
                        sourceUrl={org.source_url || org.website}
                        entityId={org.id}
                        entityName={org.name}
                        entityType="nonprofit"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No local support organizations listed in DB.</p>
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
                <span>{stateData.id === 'california' ? 'IHSS' : 'Waiver'} Wage Rate:</span>
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
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>Other {stateData.name} Counties</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {countiesList.map(c => (
                <Link key={c.id} href={`/counties/${stateData.id}/${c.id}`} style={{ fontSize: '0.8rem', color: c.id === slug ? 'var(--primary-color)' : 'var(--text-light)', textDecoration: 'none', fontWeight: c.id === slug ? 700 : 500 }}>
                  {c.name} County {c.id === slug && '📍'}
                </Link>
              ))}
            </div>
          </div>

          {/* Onboarding Wizard bridge */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.3' }}>
              <ShieldCheck size={16} /> Run Eligibility Wizard
            </h4>
            <p style={{ fontSize: '0.72rem', opacity: 0.9, marginBottom: '0.85rem', lineHeight: '1.3' }}>
              Answer questions about your child&apos;s age and diagnosis to build a personalized care plan for {countyDetails.name} County.
            </p>
            <Link href={`/benefits/${stateData.id}`} style={{ textDecoration: 'none' }}>
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

      <SourceFreshnessDisclosure sources={[
        { name: 'California Department of Developmental Services', url: 'https://www.dds.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' },
        { name: 'California Department of Social Services', url: 'https://www.cdss.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' },
        { name: 'California Department of Health Care Services', url: 'https://www.dhcs.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' }
      ]} />

    </div>
  );
}
