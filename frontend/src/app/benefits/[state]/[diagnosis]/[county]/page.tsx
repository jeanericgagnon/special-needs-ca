import { getProgramsForDiagnosis, getCountyDetails, getIepAdvocates, getStateByIdOrCode, getLocalProviders, CountyOffice, SchoolDistrict, IepAdvocate, NonprofitOrganization } from '@/lib/db';
import { Metadata } from 'next';
import { CheckCircle2, MapPin, Activity, Phone, Globe, Landmark, ShieldCheck, FileCheck, Mail, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CopyButton from '@/components/copy-button';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '@/app/benefits/components/county-map-client';
import { stateConfigs, getDynamicStateConfig } from '@/lib/stateConfigs';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData } from '@/lib/seo-policy';

type Props = {
  params: Promise<{ state: string; diagnosis: string; county: string }>;
};

// Formatting helpers
function formatParam(val: string): string {
  return val
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\bca\b/i, 'CA');
}

// Generate organic Titles and Descriptions for Search Engines
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  const stateId = stateData ? stateData.id : 'california';
  const stateName = stateData ? stateData.name : 'California';
  const stateCode = stateData ? stateData.code.toUpperCase() : 'CA';
  const config = getDynamicStateConfig(stateId, stateName, stateCode);
  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);

  const countyData = await getCountyDetails(p.county);
  const localProviders = await getLocalProviders(p.county);
  const playgrounds = localProviders.filter(prov => prov.categories === 'playground');
  const clinics = localProviders.filter(prov => prov.categories === 'therapy-clinic');
  const groups = localProviders.filter(prov => prov.categories === 'support-group');
  
  const hasRealLocalAssets = playgrounds.length > 0 || clinics.length > 0 || groups.length > 0;
  const hasRequiredContactInfo = !!(countyData?.countyOffices && countyData.countyOffices.length > 0);
  const hasNoPlaceholderData = countyData ? assertNoPlaceholderData(JSON.stringify(countyData)) : false;

  const rcDates = (countyData?.regionalCenters || []).map(rc => rc.last_verified_date).filter(Boolean) as string[];
  const sdDates = (countyData?.schoolDistricts || []).map(sd => sd.last_verified_date).filter(Boolean) as string[];
  const coDates = (countyData?.countyOffices || []).map(co => co.last_verified_date).filter(Boolean) as string[];
  const allDates = [...rcDates, ...sdDates, ...coDates];
  const lastVerifiedDate = allDates.length > 0 ? allDates.reduce((min, d) => d < min ? d : min, allDates[0]) : null;

  const rcScores = (countyData?.regionalCenters || []).map(rc => rc.confidence_score).filter(s => s !== null && s !== undefined);
  const sdScores = (countyData?.schoolDistricts || []).map(sd => sd.confidence_score !== null && sd.confidence_score !== undefined ? sd.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const coScores = (countyData?.countyOffices || []).map(co => co.confidence_score !== null && co.confidence_score !== undefined ? co.confidence_score / 5.0 : null).filter((s): s is number => s !== null);
  const allScores = [...rcScores, ...sdScores, ...coScores];
  const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

  let hasOfficialSource = false;
  if (countyData) {
    if (countyData.website) {
      hasOfficialSource = true;
    }
    if ((countyData.regionalCenters || []).some(rc => !!rc.source_url) ||
        (countyData.schoolDistricts || []).some(sd => !!sd.source_url) ||
        (countyData.countyOffices || []).some(co => !!co.source_url)) {
      hasOfficialSource = true;
    }
  }

  const policy = evaluateSeoPolicy({
    routeType: 'county-condition',
    stateId,
    countyId: p.county,
    diagnosisId: p.diagnosis,
    hasRealLocalAssets,
    hasRequiredContactInfo,
    hasNoPlaceholderData,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate
  });

  return {
    title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, ${stateCode} (2026)`,
    description: `Find ${stateName} eligibility, ${config.catchmentName} intake, and IEP assistance for ${diagnosisFormatted} in ${countyFormatted} County.`,
    alternates: {
      canonical: policy.canonicalPath
    },
    robots: robotsForPolicy(policy)
  };
}

export default async function SEOLandingPage({ params }: Props) {
  const p = await params;
  const stateData = await getStateByIdOrCode(p.state);
  if (!stateData) {
    notFound();
  }

  const stateId = stateData.id;
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const config = getDynamicStateConfig(stateId, stateName, stateCode);

  const diagnosisFormatted = formatParam(p.diagnosis);
  const countyFormatted = formatParam(p.county);

  // 1. Fetch County Details
  const countyData = await getCountyDetails(p.county);
  if (!countyData) {
    notFound();
  }

  // 1.5. Fetch local IEP advocates serving this county
  const localAdvocates = await getIepAdvocates(p.county);

  // 2. Fetch matched programs from crawler database
  const programs = await getProgramsForDiagnosis(diagnosisFormatted);

  // 3. Compile sources for SourceFreshnessDisclosure
  const freshnessSources = [];
  if (countyData.regionalCenters && countyData.regionalCenters.length > 0) {
    const rc = countyData.regionalCenters[0];
    freshnessSources.push({
      name: rc.name,
      url: rc.source_url || rc.website || undefined,
      lastReviewedDate: rc.last_verified_date,
      verificationStatus: rc.verification_status
    });
  }
  if (countyData.schoolDistricts && countyData.schoolDistricts.length > 0) {
    countyData.schoolDistricts.forEach((sd: SchoolDistrict) => {
      freshnessSources.push({
        name: sd.name,
        url: sd.source_url || sd.website || undefined,
        lastReviewedDate: sd.last_verified_date,
        verificationStatus: sd.verification_status
      });
    });
  }
  if (countyData.countyOffices && countyData.countyOffices.length > 0) {
    countyData.countyOffices.forEach((office: CountyOffice) => {
      freshnessSources.push({
        name: office.office_name,
        url: office.source_url || office.website || undefined,
        lastReviewedDate: office.last_verified_date,
        verificationStatus: office.verification_status
      });
    });
  }

  // ----------------------------------------------------
  // Dynamic Local Assets Dataset
  // ----------------------------------------------------
  // Load real local providers
  const localProviders = await getLocalProviders(p.county);
  const playgrounds = localProviders.filter(prov => prov.categories === 'playground');
  const clinics = localProviders.filter(prov => prov.categories === 'therapy-clinic');
  const groups = localProviders.filter(prov => prov.categories === 'support-group');
  interface LocalAsset {
    name: string;
    address: string;
    phone: string;
    description: string;
    x: number;
    y: number;
  }

  let playground: LocalAsset | null = null;
  let supportGroup: LocalAsset | null = null;
  let therapyClinic: LocalAsset | null = null;

  // Use DB records if present
  if (playgrounds.length > 0) {
    playground = {
      name: playgrounds[0].name,
      address: playgrounds[0].address,
      phone: playgrounds[0].phone || 'N/A',
      description: 'Inclusive playground.',
      x: 480,
      y: 320
    };
  }

  if (clinics.length > 0) {
    therapyClinic = {
      name: clinics[0].name,
      address: clinics[0].address,
      phone: clinics[0].phone || 'N/A',
      description: 'Pediatric therapy services.',
      x: 390,
      y: 220
    };
  }

  if (groups.length > 0) {
    supportGroup = {
      name: groups[0].name,
      address: groups[0].address,
      phone: groups[0].phone || 'N/A',
      description: 'Parent chapter/support group.',
      x: 300,
      y: 130
    };
  }

  // Dynamically load real local nonprofits if available in database
  const nonprofitsToUse = countyData.localOrganizations || [];
  if (nonprofitsToUse.length > 0) {
    const matchedNonprofit = nonprofitsToUse.find(org => 
      org.focus_condition?.toLowerCase() === p.diagnosis.toLowerCase() ||
      org.name.toLowerCase().includes(p.diagnosis.toLowerCase().replace(/-/g, ' '))
    ) || nonprofitsToUse[0];

    supportGroup = {
      name: matchedNonprofit.name,
      address: matchedNonprofit.website || `Serving ${countyFormatted} County, ${stateCode}`,
      phone: matchedNonprofit.phone || '',
      description: `Vetted parent training and resource network serving ${countyFormatted} County.`,
      x: 300,
      y: 130
    };
  }

  interface MapResource {
    id: string;
    type: 'regional-center' | 'school-board' | 'clinic' | 'park' | 'support';
    name: string;
    address: string;
    phone: string;
    description: string;
    x: number;
    y: number;
  }

  // Compile Map resources list
  const mapResources: MapResource[] = [];
  
  if (countyData.regionalCenters && countyData.regionalCenters.length > 0) {
    mapResources.push({
      id: 'rc-1',
      type: 'regional-center',
      name: countyData.regionalCenters[0].name,
      address: `Intake Desk, ${countyFormatted}, ${stateCode}`,
      phone: countyData.regionalCenters[0].intake_phone,
      description: `${config.catchmentName} coordinating ${config.waiverProgram} developmental support: ${countyData.regionalCenters[0].catchment_boundaries}`,
      x: 210,
      y: 260
    });
  }

  if (countyData.schoolDistricts && countyData.schoolDistricts.length > 0) {
    mapResources.push({
      id: 'sd-1',
      type: 'school-board',
      name: countyData.schoolDistricts[0].name,
      address: `Special Education Department, ${countyFormatted}, ${stateCode}`,
      phone: countyData.schoolDistricts[0].spec_ed_contact_phone || '',
      description: `Special education district coordinator responsible for IEP evaluations, placement, and inclusion LRE classrooms.`,
      x: 580,
      y: 120
    });
  }

  if (playground) mapResources.push({ id: 'play-1', type: 'park', ...playground });
  if (supportGroup) mapResources.push({ id: 'supp-1', type: 'support', ...supportGroup });
  if (therapyClinic) mapResources.push({ id: 'clinic-1', type: 'clinic', ...therapyClinic });

  const ihssOffice = countyData.countyOffices?.find((o: CountyOffice) => o.program_id === 'ihss-for-children');

  // ----------------------------------------------------
  // Dynamic JSON-LD Structured Data
  // ----------------------------------------------------
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
          text: ihssOffice
            ? `You can apply for IHSS wages by contacting the ${ihssOffice.office_name} located at ${ihssOffice.address}. Phone: ${ihssOffice.phone}.`
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
    '@graph': (countyData.schoolDistricts || []).map((sd: SchoolDistrict) => ({
      '@type': 'EducationalOrganization',
      'name': sd.name,
      'telephone': sd.spec_ed_contact_phone,
      'email': sd.spec_ed_contact_email,
      'url': sd.website,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      },
      'description': `${sd.name} Special Education department in ${countyFormatted} County. Inclusion rate: ${sd.inclusion_rate_pct}%. SDC self-contained rate: ${sd.self_contained_rate_pct}%.`
    }))
  };

  const localAdvocatesSchema = {
    '@context': 'https://schema.org',
    '@graph': (localAdvocates || []).map((adv: IepAdvocate) => ({
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
        'addressRegion': stateCode,
        'addressCountry': 'US'
      }
    }))
  };

  // Add the clinics, support groups, and parks structured data
  const communityAssets: Record<string, unknown>[] = [];
  if (therapyClinic) {
    communityAssets.push({
      '@type': 'MedicalBusiness',
      'name': therapyClinic.name,
      'telephone': therapyClinic.phone,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': (therapyClinic.address || '').split(',')[0],
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      },
      'description': therapyClinic.description
    });
  }
  if (playground) {
    communityAssets.push({
      '@type': 'Park',
      'name': playground.name,
      'telephone': playground.phone,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': (playground.address || '').split(',')[0],
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      },
      'description': playground.description
    });
  }
  if (supportGroup) {
    communityAssets.push({
      '@type': 'NGO',
      'name': supportGroup.name,
      'telephone': supportGroup.phone,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': (supportGroup.address || '').split(',')[0],
        'addressLocality': countyFormatted,
        'addressRegion': stateCode,
        'addressCountry': 'US'
      },
      'description': supportGroup.description
    });
  }

  const communityAssetsSchema = {
    '@context': 'https://schema.org',
    '@graph': communityAssets
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(communityAssetsSchema) }}
      />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {diagnosisFormatted} Benefits in {countyFormatted} County
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Navigating developmental care in {countyFormatted} County. If you have a child with {diagnosisFormatted}, your family may qualify for {config.medicaidName} waivers, safety supervision wages, and educational services.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <ShareButton />
          <PrintButton label="Print PDF Directory Guide" />
        </div>
      </div>

      {/* NEW: Interactive Coordinates Map Canvas */}
      <div style={{ marginBottom: '4rem' }} className="no-print">
        <CountyMapClient countyName={countyFormatted} resources={mapResources} />
      </div>

      {/* Local Routing Information */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        
        <div className="glass-panel" style={{ background: 'rgba(99, 102, 241, 0.03)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Directory ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center */}
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
                <TrustBadge
                  status={countyData.regionalCenters[0].verification_status}
                  lastVerifiedDate={countyData.regionalCenters[0].last_verified_date}
                  sourceUrl={countyData.regionalCenters[0].source_url || countyData.regionalCenters[0].website}
                  entityId={countyData.regionalCenters[0].id}
                  entityName={countyData.regionalCenters[0].name}
                  entityType="regional_center"
                />
              </div>
            )}

            {/* School District IEPs */}
            {countyData.schoolDistricts && countyData.schoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {countyData.schoolDistricts.map((district: SchoolDistrict) => (
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

                    {district.spec_ed_contact_phone && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <Phone size={13} style={{ flexShrink: 0 }} /> 
                          Helpline: 
                          <a href={`tel:${district.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{district.spec_ed_contact_phone}</a>
                          <CopyButton text={district.spec_ed_contact_phone} size={11} />
                        </span>
                      </div>
                    )}
                    <TrustBadge
                      status={district.verification_status}
                      lastVerifiedDate={district.last_verified_date}
                      sourceUrl={district.source_url || district.website}
                      entityId={district.id}
                      entityName={district.name}
                      entityType="school_district"
                    />
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
                {countyData.countyOffices.map((office: CountyOffice) => (
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
            )}

          </div>

          {/* Localized Community Assets Section (Clinics, Parks, Support Groups) */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary-color)" />
              Caregiver Assets & Local Inclusive Networks
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              
              {playground ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🛝 Inclusive Playgrounds & Parks</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{playground.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{playground.address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>{playground.description}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛝</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Inclusive Playgrounds Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local playground.</p>
                  <ContributionModal suggestionType="other" targetId={p.county} targetName={`${countyFormatted} County Playground`} buttonLabel="Submit Park" />
                </div>
              )}

              {therapyClinic ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🏥 Pediatric Therapy Clinics</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{therapyClinic.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{therapyClinic.address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>{therapyClinic.description}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🏥</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Pediatric Clinics Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local clinic.</p>
                  <ContributionModal suggestionType="other" targetId={p.county} targetName={`${countyFormatted} County Clinic`} buttonLabel="Submit Clinic" />
                </div>
              )}

              <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>👥 Local Parent Chapters & Support Groups</strong>
                {nonprofitsToUse.length > 0 ? (
                  nonprofitsToUse.slice(0, 3).map((org, idx) => (
                    <div key={org.id || idx} style={{ borderBottom: idx < Math.min(nonprofitsToUse.length, 3) - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', paddingBottom: idx < Math.min(nonprofitsToUse.length, 3) - 1 ? '0.5rem' : 0 }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{org.name}</h4>
                      {org.website && (
                        <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary-color)', textDecoration: 'underline', display: 'block', margin: '0.1rem 0', wordBreak: 'break-all' }}>
                          {org.website}
                        </a>
                      )}
                      {org.phone && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block' }}>
                          Phone: <a href={`tel:${org.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{org.phone}</a>
                        </span>
                      )}
                    </div>
                  ))
                ) : supportGroup ? (
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{supportGroup.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{supportGroup.address}</span>
                    <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>{supportGroup.description}</p>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                    <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>👥</span>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Support Chapters Indexed</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a local support group.</p>
                    <ContributionModal suggestionType="other" targetId={p.county} targetName={`${countyFormatted} County Support Group`} buttonLabel="Submit Group" />
                  </div>
                )}
              </div>

            </div>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.5rem' }} className="no-print">
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
            {localAdvocates.map((adv: IepAdvocate) => (
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

      <SourceFreshnessDisclosure sources={freshnessSources} />
    </main>
  );
}
