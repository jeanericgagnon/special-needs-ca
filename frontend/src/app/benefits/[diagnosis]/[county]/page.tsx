import { getProgramsForDiagnosis, getCountyDetails } from '@/lib/db';
import { Metadata } from 'next';
import { CheckCircle2, MapPin, Activity, Phone, Globe, Landmark, ShieldCheck, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {diagnosisFormatted} Benefits in {countyFormatted} County
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Navigating developmental care in {countyFormatted} County. If you have a child with {diagnosisFormatted}, your family may qualify for Medi-Cal waivers, safety supervision wages, and educational services.
        </p>
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
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> Intake: {countyData.regionalCenters[0].intake_phone}</span>
                <span><strong>Languages:</strong> {countyData.regionalCenters[0].languages}</span>
              </div>
            )}

            {/* School District IEPs */}
            {countyData.schoolDistricts && countyData.schoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Education Contacts
                </strong>
                <strong>{countyData.schoolDistricts[0].name}</strong>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> SpecEd Helpline: {countyData.schoolDistricts[0].spec_ed_contact_phone}</span>
                {countyData.schoolDistricts[0].spec_ed_contact_email && <span><strong>Email:</strong> {countyData.schoolDistricts[0].spec_ed_contact_email}</span>}
              </div>
            )}

            {/* County Office Contacts */}
            {countyData.countyOffices && countyData.countyOffices.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <FileCheck size={16} /> County Service Office
                </strong>
                {countyData.countyOffices.map((office: any) => (
                  <div key={office.id} style={{ marginBottom: '0.5rem' }}>
                    <strong>{office.office_name}</strong>
                    <span style={{ display: 'block', fontSize: '0.85rem' }}>{office.address}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={14} /> Phone: {office.phone}</span>
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
