import { getProgramsForDiagnosis, getCountyDetails, getIepAdvocates } from '@/lib/db';
import { Metadata } from 'next';
import { CheckCircle2, MapPin, Activity, Phone, Globe, Landmark, ShieldCheck, FileCheck, Mail, Award } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyButton from '@/components/copy-button';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';


type Props = {
  params: Promise<{ diagnosis: string; county: string }>;
};

// Formatting helpers
function formatParam(val: string): string {
  return val
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bca\b/i, 'CA');
}

// Generate high-relevance organic Titles and Descriptions for Search Engines
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);

  return {
    title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, CA (2026)`,
    description: `Access California state support, Regional Center intake, IHSS caregiver wages, and school IEP assistance for ${diagnosisFormatted} in ${countyFormatted} County.`,
    alternates: {
      canonical: `/benefits/${p.diagnosis}/${p.county}`
    }
  };
}

export default async function SEOLandingPage({ params }: Props) {
  const p = await params;
  
  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);

  // 1. Fetch County Details (offices, regional centers, districts)
  const countyData = getCountyDetails(p.county);
  if (!countyData) {
    notFound();
  }

  // 1.5. Fetch local IEP advocates serving this county
  const localAdvocates = getIepAdvocates(p.county);

  // 2. Fetch matched programs from crawler database
  const programs = getProgramsForDiagnosis(diagnosisFormatted);

  // 3. Compile JSON-LD Schema objects
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the Regional Center serving ${countyFormatted} County for ${diagnosisFormatted}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: countyData.regionalCenters?.[0]
            ? `Families in ${countyFormatted} County are served by ${countyData.regionalCenters[0].name}. You can reach their intake line at ${countyData.regionalCenters[0].intake_phone}.`
            : `California Regional Centers coordinate Lanterman Act developmental services. Contact the California Department of Developmental Services to find your catchment center.`
        }
      },
      {
        '@type': 'Question',
        name: `How do I apply for In-Home Supportive Services (IHSS) in ${countyFormatted} County?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: countyData.countyOffices?.find((o: any) => o.program_id === 'ihss-for-children')
            ? `You can apply for IHSS wages by contacting the ${countyData.countyOffices.find((o: any) => o.program_id === 'ihss-for-children').office_name} located at ${countyData.countyOffices.find((o: any) => o.program_id === 'ihss-for-children').address}. Phone: ${countyData.countyOffices.find((o: any) => o.program_id === 'ihss-for-children').phone}.`
            : `Apply for IHSS through your local county department of social services. IHSS pays parents to provide protective safety supervision.`
        }
      }
    ]
  };

  const medicalConditionSchema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    name: diagnosisFormatted,
    possibleTreatment: [
      { '@type': 'MedicalTherapy', name: 'Speech Therapy' },
      { '@type': 'MedicalTherapy', name: 'Occupational Therapy' },
      { '@type': 'MedicalTherapy', name: 'Behavioral Intervention (ABA)' }
    ]
  };

  const schoolDistrictsSchema = {
    '@context': 'https://schema.org',
    '@graph': (countyData.schoolDistricts || []).map((sd: any) => ({
      '@type': 'EducationalOrganization',
      'name': sd.name,
      'telephone': sd.spec_ed_contact_phone,
      'email': sd.spec_ed_contact_email,
      'url': sd.website,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': countyFormatted,
        'addressRegion': 'CA',
        'addressCountry': 'US'
      },
      'description': `${sd.name} Special Education department in ${countyFormatted} County. Inclusion rate: ${sd.inclusion_rate_pct}%. SDC self-contained rate: ${sd.self_contained_rate_pct}%.`
    }))
  };

  const localAdvocatesSchema = {
    '@context': 'https://schema.org',
    '@graph': (localAdvocates || []).map((adv: any) => ({
      '@type': 'ProfessionalService',
      'name': adv.name,
      'telephone': adv.phone,
      'email': adv.email,
      'url': adv.website,
      'image': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
      'description': `${adv.name} is a professional special education IEP advocate serving ${countyFormatted} County. Credentials: ${adv.credentials}. Rate: ${adv.price_rate}. Experience: ${adv.experience_years} years.`,
      'priceRange': adv.price_rate,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': countyFormatted,
        'addressRegion': 'CA',
        'addressCountry': 'US'
      }
    }))
  };

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      
      {/* Dynamic JSON-LD Structured Data Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolDistrictsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localAdvocatesSchema) }}
      />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {diagnosisFormatted} Benefits in {countyFormatted} County
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Navigating developmental care in {countyFormatted} County. If you have a child with {diagnosisFormatted}, your family may qualify for Medi-Cal waivers, safety supervision wages, and educational services.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <ShareButton />
          <PrintButton label="Print PDF Directory Guide" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        {/* Local Routing Information */}
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.03)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Directory ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center Catchment */}
            {countyData.regionalCenters && countyData.regionalCenters.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <Landmark size={16} /> Regional Center
                </strong>
                <strong>{countyData.regionalCenters[0].name}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{countyData.regionalCenters[0].catchment_boundaries}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                  Intake: 
                  <a href={`tel:${countyData.regionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countyData.regionalCenters[0].intake_phone}</a>
                  <CopyButton text={countyData.regionalCenters[0].intake_phone} size={11} />
                </span>
                <span><strong>Languages:</strong> {countyData.regionalCenters[0].languages}</span>
              </div>
            )}

            {/* School District IEPs */}
            {countyData.schoolDistricts && countyData.schoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {countyData.schoolDistricts.map((district: any) => (
                  <div key={district.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{district.name}</strong>
                      <ContributionModal suggestionType="district" targetId={district.id} targetName={district.name} buttonLabel="Suggest Update" />
                    </div>
                    
                    {district.total_enrollment && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                        Enrollment: ~{district.total_enrollment.toLocaleString()} students ({district.special_ed_pct}% SpEd)
                      </span>
                    )}

                    {district.inclusion_rate_pct && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Inclusion Rate (Gen-Ed &gt;80%)</span>
                          <strong style={{ color: '#10b981' }}>{district.inclusion_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${district.inclusion_rate_pct}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}

                    {district.self_contained_rate_pct && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Self-Contained SDC Classroom</span>
                          <strong style={{ color: '#8b5cf6' }}>{district.self_contained_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${district.self_contained_rate_pct}%`, backgroundColor: '#8b5cf6', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Phone size={13} style={{ flexShrink: 0 }} /> 
                        Helpline: 
                        <a href={`tel:${district.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{district.spec_ed_contact_phone}</a>
                        <CopyButton text={district.spec_ed_contact_phone} size={11} />
                      </span>
                      {district.spec_ed_contact_email && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Mail size={13} style={{ flexShrink: 0 }} /> 
                          Email: 
                          <a href={`mailto:${district.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{district.spec_ed_contact_email}</a>
                          <CopyButton text={district.spec_ed_contact_email} size={11} />
                        </span>
                      )}
                      <a href={district.website} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.2rem' }}>
                        <Globe size={11} /> SpEd Department Website
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* County Office Contacts */}
            {countyData.countyOffices && countyData.countyOffices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <FileCheck size={16} /> County Service Office
                </strong>
                {countyData.countyOffices.map((office: any) => (
                  <div key={office.id} style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <strong>{office.office_name}</strong>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                      <strong>Address:</strong> {office.address}
                      <CopyButton text={office.address} size={11} />
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Phone size={13} style={{ flexShrink: 0 }} /> 
                      Phone: 
                      <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a>
                      <CopyButton text={office.phone} size={11} />
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ display: 'inline-flex', width: 'auto' }}>
                <Activity size={18} /> Run the Dynamic Eligibility Wizard
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* Local IEP Advocates Section */}
      {localAdvocates && localAdvocates.length > 0 && (
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.02)', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <Award color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Vetted IEP Advocates serving {countyFormatted} County</h2>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Special education advisors and legal advocates serving families in {countyFormatted} County. Advocates help caregivers request assessments, attend IEP meetings, and review placements.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {localAdvocates.map((adv: any) => (
              <div 
                key={adv.id} 
                style={{ 
                  background: 'white', 
                  padding: '1.25rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      {adv.name}
                    </strong>
                    <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Update" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                    {adv.credentials}
                  </span>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span><strong>Experience:</strong> {adv.experience_years} years</span>
                    <span><strong>Rate:</strong> {adv.price_rate}</span>
                    <span><strong>Languages:</strong> {adv.languages_spoken}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Phone size={12} style={{ flexShrink: 0 }} /> 
                    <a href={`tel:${adv.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.phone}</a>
                    <CopyButton text={adv.phone} size={11} />
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <Mail size={12} style={{ flexShrink: 0 }} /> 
                    <a href={`mailto:${adv.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.email}</a>
                    <CopyButton text={adv.email} size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
            <Link 
              href={`/advocates?county=${p.county}`} 
              style={{ 
                fontSize: '0.9rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              View Full Advocates Directory for {countyFormatted} County →
            </Link>
          </div>
        </div>
      )}

      {/* Matched Programs Grid */}
      <h2 style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        State and Federal Programs for {diagnosisFormatted}
      </h2>
      
      <div className="grid">
        {programs.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            <p>No program rules explicitly indexed for this diagnosis yet. Use our Wizard to map general disability services.</p>
          </div>
        ) : (
          programs.map((program) => (
            <div key={program.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '230px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 color="var(--primary-color)" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{program.program_name}</h3>
                </div>
                
                <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span><strong>Demographic:</strong> {program.target_demographic}</span>
                  <span><strong>Age limits:</strong> {program.age_limit_min} to {program.age_limit_max} years</span>
                  <span><strong>Income rule:</strong> {program.income_limit}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <span className="program-tag" style={{ marginTop: 0 }}>{diagnosisFormatted} Eligible</span>
                <a 
                  href={program.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  <Globe size={12} /> Source Doc
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
