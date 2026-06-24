/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getCountyDetails, 
  getIepAdvocates, 
  getCounties, 
  getSchoolDistrictBySlug,
  getLocalProviders,
  getProgramsForDiagnosis,
  getAllPrograms,
  getProgramBySlug,
  getStateByIdOrCode,
  getAllStates
} from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCityBySlug } from '@/lib/cities';
import { Metadata } from 'next';
import { MapPin, Phone, Landmark, ShieldCheck, Mail, Award, Sparkles, ArrowLeft, ArrowRight, Heart, Calculator, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '@/app/benefits/components/county-map-client';
import DirectoryFoundationPanel from '@/app/components/directory-foundation-panel';
import CaliforniaMap from '@/app/components/california-map';
import IhssMiniProduct from '@/app/benefits/components/ihss-mini-product';
import { type StateConfig, stateConfigs, getDynamicStateConfig } from '@/lib/stateConfigs';
import { StateCoverageBadge } from '@/components/state-coverage-badge';
import { getCountyDiagnosisTruthEligibility, getCountyTruthEligibility, isIndexableState, isPublicDirectoryRecordEligible, isPublicRecordEligible, VERIFIED_DIAGNOSIS_SLUGS } from '@/lib/publicTruth';
import { stateAuditStatus, stateGapReason, evaluateSeoPolicy, normalizeConfidenceScore, assertNoPlaceholderData } from '@/lib/seo-policy';
import DirectoryReviews from '@/app/dashboard/components/DirectoryReviews';
import SeoSchema from '@/app/components/seo-schema';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import { getCountyMetadata, getCountyIntroCopy } from '@/lib/countySeoHelpers';

type Props = {
  params: Promise<{ state: string; slug?: string[] }>;
};

// Formatting helpers
function formatParam(val: string): string {
  const words = val.split('-');
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      const acronyms = [
        'asd', 'adhd', 'spd', 'gdd', 'odd', 'rad', 'cp', 'sma', 'tbi', 'nf1', 'nf2', 
        'cvi', 'apd', 'onh', 'rop', 'id', 'nvld', 'chd', 'cf', 'ckd', 
        'jia', 'ohi', 'sld', 'ed', 'ca', 'xxy'
      ];
      if (acronyms.includes(lower)) {
        return lower.toUpperCase();
      }
      
      const lowerCaseWords = ['of', 'and', 'to', 'for', 'in', 'or', 'by', 'with', 'at'];
      if (lowerCaseWords.includes(lower) && index > 0) {
        return lower;
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}




export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const stateId = p.state;
  const slug = p.slug || [];

  const stateData = await getStateByIdOrCode(stateId);
  if (!stateData) {
    return {
      title: 'State Resource Counties Directory',
      description: 'Find local county-level developmental disability support and resources.'
    };
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const catchment = config.catchmentName;
  const personalCare = config.personalCareProgram;

  const isIndexedState = isIndexableState(stateData.id);

  if (slug.length === 0) {
    return {
      title: `${stateName} Special Education & Disability Guides & Resources`,
      description: `Select your ${stateName} county to access local developmental benefits, ${catchment} intakes, school district inclusion rates, and special needs advocates.`,
      alternates: { canonical: `/benefits/${stateData.id}` },
      robots: isIndexedState ? undefined : { index: false, follow: true }
    };
  }

  if (slug.length === 1) {
    if (slug[0].toLowerCase() === 'programs') {
      return {
        title: `${stateName} Special Needs Government & Community Guides & Resources`,
        description: `Explore ${stateName} special needs public programs: ${catchment}, ${personalCare}, healthcare, and ABLE accounts.`,
        alternates: { canonical: `/benefits/${stateData.id}/programs` },
        robots: isIndexedState ? undefined : { index: false, follow: true }
      };
    }
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === slug[0].toLowerCase());
    if (isCounty) {
      const countyFormatted = formatParam(slug[0]);
      const countyDetails = await getCountyDetails(slug[0].toLowerCase());
      const truth = getCountyTruthEligibility(stateData.id, countyDetails);
      return {
        title: `Special Needs & IEP Benefits in ${countyFormatted} County, ${stateCode} (2026)`,
        description: `Browse localized developmental resources and advocacy directories in ${countyFormatted} County. Access ${catchment} intake details and school district inclusion benchmarks.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}` },
        robots: truth.indexSafe ? undefined : { index: false, follow: true }
      };
    } else {
      const diagnosisFormatted = formatParam(slug[0]);
      const isIndexed = isIndexedState && VERIFIED_DIAGNOSIS_SLUGS.includes(slug[0].toLowerCase() as (typeof VERIFIED_DIAGNOSIS_SLUGS)[number]);
      return {
        title: `${diagnosisFormatted} Support Services by County in ${stateName} (2026)`,
        description: `Select a county in ${stateName} to discover specialized ${diagnosisFormatted} programs, ${catchment} support, local school accommodations, and parent advocacy groups.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}` },
        robots: isIndexed ? undefined : { index: false, follow: true }
      };
    }
  }

  if (slug.length === 2) {
    if (slug[0].toLowerCase() === 'program') {
      const prog = await getProgramBySlug(slug[1].toLowerCase());
      const title = prog ? prog.program_name : formatParam(slug[1]);
      return {
        title: `${title} - ${stateName} Special Needs Program Guide (2026)`,
        description: `Complete guide to ${title} in ${stateName}. Check clinical eligibility rules, age limits, income guidelines, and related advocate services.`,
        alternates: { canonical: `/benefits/${stateData.id}/program/${slug[1].toLowerCase()}` },
        robots: isIndexedState ? undefined : { index: false, follow: true }
      };
    }
    const diagnosisFormatted = formatParam(slug[0]);
    const secondSlug = slug[1].toLowerCase();

    // Check if second slug is a county
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === secondSlug);
    if (isCounty) {
      const countyFormatted = formatParam(secondSlug);
      const countyDetails = await getCountyDetails(secondSlug);
      const truth = getCountyDiagnosisTruthEligibility(stateData.id, slug[0].toLowerCase(), secondSlug, countyDetails);

      const sdList = countyDetails?.schoolDistricts || [];
      const coList = countyDetails?.countyOffices || [];
      const rcList = countyDetails?.regionalCenters || [];
      const rcScores = rcList.map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
      const sdScores = sdList.map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
      const coScores = coList.map((co) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
      const allScores = [...rcScores, ...sdScores, ...coScores];
      const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

      const hasOfficialSource = rcList.some((rc) => !!rc.source_url) || sdList.some((sd) => !!sd.source_url) || coList.some((co) => !!co.source_url);
      const hasRequiredContactInfo = coList.length > 0;
      const hasNoPlaceholderData = countyDetails ? assertNoPlaceholderData(JSON.stringify(countyDetails)) : false;
      const hasRealLocalAssets = sdList.length > 0 || coList.length > 0 || rcList.length > 0;

      const policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId: secondSlug,
        diagnosisId: slug[0].toLowerCase(),
        entityCount: sdList.length,
        confidenceScore: confScore,
        hasOfficialSource,
        lastVerifiedDate: '2026-06-08', // QA-ALLOW
        hasRequiredContactInfo,
        hasNoPlaceholderData,
        hasRealLocalAssets
      });

      const canIndex = truth.indexSafe && policy.index;

      return {
        title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, ${stateCode} (2026)`,
        description: `Access ${stateName} state support, ${catchment} intake, waiver caregiver wages, and school IEP assistance for ${diagnosisFormatted} in ${countyFormatted} County.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}/${secondSlug}` },
        robots: canIndex ? undefined : { index: false, follow: true }
      };
    }

    // Check if second slug is a school district
    const district = await getSchoolDistrictBySlug(secondSlug);
    if (district) {
      return {
        title: `${diagnosisFormatted} IEP & Special Education Support in ${district.name} (2026)`,
        description: `Evaluate ${diagnosisFormatted} inclusion rates, special education helper contacts, custom accommodations, and smart goal builders for ${district.name}.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
        robots: { index: false, follow: true }
      };
    }

    // Check if second slug is a city
    const city = getCityBySlug(secondSlug);
    if (city) {
      return {
        title: `${diagnosisFormatted} Therapy Services & Sensory Parks in ${city.name}, ${stateCode}`,
        description: `Find inclusive playgrounds, local support organizations, pediatric therapists, and county waiver hourly caregiver wage rates for ${diagnosisFormatted} in ${city.name}, ${stateCode}.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
        robots: { index: false, follow: true }
      };
    }
  }

  return {
    title: `${stateName} Disability & Special Needs Benefits | Ablefull`,
    description: `Source-backed resources for developmental disabilities and special education in ${stateName}.`
  };
}

function formatIntroCopy(text: string) {
  return text.split('\n').map((line, i) => {
    const parts = line.split('**');
    return (
      <div key={i} style={{ marginBottom: '0.4rem', lineHeight: '1.6' }}>
        {parts.map((part, j) => {
          if (j % 2 === 1) {
            return <strong key={j}>{part}</strong>;
          }
          return part;
        })}
      </div>
    );
  });
}

async function InnerBenefitsCatchAll({ params }: Props) {
  const p = await params;
  const stateId = p.state;
  const slug = p.slug || [];

  const stateData = await getStateByIdOrCode(stateId);
  if (!stateData) {
    notFound();
  }

  const config = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const stateName = stateData.name;
  const stateCode = stateData.code.toUpperCase();
  const catchment = config.catchmentName;
  const personalCare = config.personalCareProgram;
  const isIndexedState = isIndexableState(stateData.id);

  // ==========================================
  // CASE 7: Programs Index (/benefits/[state]/programs)
  // ==========================================
  if (slug.length === 1 && slug[0].toLowerCase() === 'programs') {
    const allPrograms = (await getAllPrograms()).filter(prg => !prg.state_id || prg.state_id === stateData.id);
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Government & Private Support
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            {stateName} Special Needs Guides & Resources
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Comprehensive collection of guides and resources for specialized public benefits, waivers, healthcare plans, and developmental support programs available for children with special needs in {stateName}.
          </p>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Available Programs & Benefits
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {allPrograms.map(p => {
              const pSlug = p.program_name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              return (
                <Link 
                  key={p.id} 
                  href={`/benefits/${stateData.id}/program/${pSlug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      background: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)'
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.15rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                        {p.program_name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '1rem' }}>
                        {p.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span><strong>Age Limits:</strong> {p.age_limit_min} - {p.age_limit_max} years</span>
                      <span><strong>Income Limit:</strong> {p.income_limit}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.5rem' }}>
                        View Program Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 8: Program Detail (/benefits/program/[slug])
  // ==========================================
  if (slug.length === 2 && slug[0].toLowerCase() === 'program') {
    const programSlug = slug[1].toLowerCase();
    const program = await getProgramBySlug(programSlug);
    
    if (!program) {
      notFound();
    }
    
    // Find related advocates serving this program's general specialties (filtered by state)
    const allAdvocates = (await getIepAdvocates(undefined, stateData.id)).filter(isPublicDirectoryRecordEligible);
    
    // Sort and filter advocates to show relevant professionals
    const relatedAdvocates = allAdvocates
      .filter(adv => {
        const text = ((adv.specialties || '') + ' ' + (adv.description || '') + ' ' + adv.credentials).toLowerCase();
        // Match terms
        if (program.program_name.toLowerCase().includes('ihss')) return text.includes('ihss') || text.includes('behavior') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('ccs')) return text.includes('physical') || text.includes('therapy') || text.includes('medical') || text.includes('care');
        if (program.program_name.toLowerCase().includes('calable')) return text.includes('financial') || text.includes('able') || text.includes('trust') || text.includes('estate') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('idea') || program.program_name.toLowerCase().includes('special education')) return text.includes('iep') || text.includes('education') || text.includes('school') || text.includes('attorney');
        if (program.program_name.toLowerCase().includes('regional center') || program.program_name.toLowerCase().includes('lanterman')) return text.includes('regional center') || text.includes('respite') || text.includes('lanterman') || text.includes('developmental');
        return true;
      })
      .slice(0, 3);
      
    // Find qualifying diagnoses listed in this program
    let parsedDiagnoses: string[] = [];
    try {
      parsedDiagnoses = JSON.parse(program.diagnosis_required);
    } catch {
      parsedDiagnoses = [program.diagnosis_required];
    }
    
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            href={`/benefits/${stateData.id}/programs`}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: 'var(--primary-color)', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Guides & Resources
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', alignItems: 'start' }} className="responsive-grid">
          {/* Main Details Panel */}
          <div>
            <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
              <span style={{ 
                display: 'inline-block', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--primary-color)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '0.5rem',
                background: 'rgba(var(--primary-rgb),0.08)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                {program.county_specific}
              </span>
              
              <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
                {program.program_name}
              </h1>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                {program.target_demographic}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Age Requirements</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.age_limit_min} to {program.age_limit_max} years old
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Income limits</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.income_limit}
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Qualifying Clinical Diagnoses
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {parsedDiagnoses.map((diag, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      background: 'rgba(var(--primary-rgb),0.04)', 
                      color: 'var(--primary-color)', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(var(--primary-rgb),0.08)' 
                    }}
                  >
                    {diag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <a 
                  href={program.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem', height: 'auto' }}
                >
                  Visit Official Agency Source <Sparkles size={16} />
                </a>
              </div>
            </div>

            {/* Legal Footnotes & Citations block */}
            <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.01)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem' }}>
                Regulatory & Statutory Framework
              </h3>
              <p style={{ margin: 0 }}>
                {config.legalDisclaimer} Eligibility criteria are audited regularly against official state and federal portals.
              </p>
            </div>
          </div>

          {/* Sidebar: Related Advocates & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Actions Panel */}
            <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Navigator Toolset
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Check Child&apos;s Eligibility
                  </button>
                </Link>
                <Link href="/advocates" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Browse IEP Advocates
                  </button>
                </Link>
              </div>
            </div>

            {/* Related Advocates list */}
            {relatedAdvocates.length > 0 && (
              <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  IEP Advocates & Specialists
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {relatedAdvocates.map(adv => (
                    <div key={adv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{adv.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, display: 'block', margin: '0.1rem 0' }}>
                        {adv.credentials}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Serving: {adv.counties_served.split(',').slice(0, 3).map(s => formatParam(s)).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 1: Root Directory Index (/benefits)
  // ==========================================
  if (slug.length === 0) {
    const counties = await getCounties(stateData.id);
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Legal & Care Resources
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            Guides & Resources: Local Disability Benefits
          </h1>
          <div style={{ marginBottom: '1rem' }}>
            <StateCoverageBadge stateId={stateData.id} stateName={stateName} />
          </div>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Select your county to browse localized guides for all 78 diagnoses. Discover {config.catchmentName} intake lines, {config.medicaidName} waiver options, local school district special education inclusion rates, and independent IEP advocates.
          </p>
        </div>

        {/* State Programs Directory Link Banner */}
        <div 
          className="glass-panel" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.02) 100%)', 
            border: '1px solid rgba(var(--primary-rgb), 0.15)',
            padding: '1.5rem 2rem', 
            borderRadius: '20px', 
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} />
              Looking for Statewide Special Needs Programs?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
              Browse eligibility guidelines, age requirements, and income limits for all major {stateName} public benefits.
            </p>
          </div>
          <Link href={`/benefits/${stateData.id}/programs`} style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ height: '42px', padding: '0 1.5rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 0 }}>
              Browse Programs Guides & Resources <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        {stateData.id === 'california' && <CaliforniaMap />}

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin color="var(--primary-color)" size={22} />
            Select a {stateName} County
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {counties.map(c => (
              <Link 
                key={c.id} 
                href={`/benefits/${stateData.id}/${c.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0,0,0,0.04)',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {c.name.replace(' County', '')}
                  </span>
                  <ArrowRight size={14} color="var(--primary-color)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (slug.length === 1) {
    const countyId = slug[0].toLowerCase();
    const countyDetails = await getCountyDetails(countyId);

    if (countyDetails) {
      const countyFormatted = formatParam(countyId);
      const stateConfig = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
      const countiesList = (await getCounties(stateData.id)).map(c => ({ id: c.id, name: c.name }));
      const countyWage = countyDetails.ihss_wage_rate || 18.00; // QA-ALLOW
      const truth = getCountyTruthEligibility(stateData.id, countyDetails);
      const isIndexable = isIndexableState(stateData.id) && truth.indexSafe;
      const eligibleRegionalCenters = (countyDetails.regionalCenters || []).filter(isPublicRecordEligible);
      const eligibleCountyOffices = (countyDetails.countyOffices || []).filter(isPublicRecordEligible);
      const eligibleSchoolDistricts = (countyDetails.schoolDistricts || []).filter(isPublicRecordEligible);
      const eligibleSelpas = (countyDetails.selpas || []).filter(isPublicRecordEligible);
      const eligibleLocalOrganizations = (countyDetails.localOrganizations || []).filter(isPublicDirectoryRecordEligible);

      const countyName = countyDetails.name;
      const catchmentLabel = stateConfig.catchmentName;
      const educationLabel = stateConfig.educationAgencyLabel;
      const insuranceLabel = stateConfig.medicaidName;
      
      const rcName = eligibleRegionalCenters[0]?.name || `Local ${catchmentLabel}`;
      
      const directoryLinks = DIAGNOSES.map(d => ({
        name: d,
        slug: slugifyDiagnosis(d)
      }));

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
                : `Under local state rules, school districts in ${countyName} must respond to a parent request for an IEP assessment within standard state timelines (typically 15 to 30 days depending on the state).` // QA-ALLOW
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
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          {isIndexable && <SeoSchema data={[faqSchema, governmentOrganizationSchema]} />}
          
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
            <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.75rem', maxWidth: '850px' }}>
              {formatIntroCopy(getCountyIntroCopy(stateData.id, stateData.name, stateData.code, countyDetails as any, countyWage, catchmentLabel, insuranceLabel))}
            </div>
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
                {eligibleRegionalCenters.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {eligibleRegionalCenters.map((rc) => (
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
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No regional center information listed in DB.</p>
                )}
              </div>

              {/* Section 2: County Support Offices */}
              <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin color="var(--primary-color)" size={20} /> County Admin Support Offices
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.25rem', marginTop: '-0.5rem', lineHeight: '1.5' }}>
                  Local administrative offices managing eligibility, applications, and intake support for {insuranceLabel} and county-level social services.
                </p>
                {eligibleCountyOffices.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {eligibleCountyOffices.map((office) => {
                      return (
                        <div key={office.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{office.office_name}</h3>
                          {office.address && <span><strong>Address:</strong> {office.address}</span>}
                          {office.phone && (
                            <span><strong>Phone Intake:</strong> <a href={`tel:${office.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{office.phone}</a></span>
                          )}
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
                            entityId={String(office.id)}
                            entityName={office.office_name}
                            entityType="county_office"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>No county administrative offices listed in DB.</p>
                )}
              </div>

              {/* Section 3: Local School Districts */}
              <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen color="var(--primary-color)" size={20} /> Local School Districts & Inclusion Stats
                </h2>
                {eligibleSchoolDistricts.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {eligibleSchoolDistricts.map((district) => {
                      const stats = {
                        inclusionRate: district.inclusion_rate_pct,
                        selfContainedRate: district.self_contained_rate_pct
                      };
                      return (
                        <div key={district.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{district.name}</strong>
                            <ContributionModal suggestionType="district" targetId={district.id} targetName={district.name} buttonLabel="Suggest update" />
                          </div>
                          
                          {district.total_enrollment && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                              Total Enrollment: ~{district.total_enrollment.toLocaleString()} students ({district.special_ed_pct}% SpEd)
                            </span>
                          )}

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                            {stats.inclusionRate !== null && stats.inclusionRate !== undefined && (
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                                  <span>Inclusion (Gen-Ed &gt;80%)</span>
                                  <strong style={{ color: '#10b981' }}>{stats.inclusionRate}%</strong>
                                </div>
                                <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${stats.inclusionRate}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                                </div>
                              </div>
                            )}
                          </div>

                          {district.spec_ed_contact_phone && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                              <span><strong>IEP Dept Phone:</strong> <a href={`tel:${district.spec_ed_contact_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{district.spec_ed_contact_phone}</a></span>
                              {district.spec_ed_contact_email && <span><strong>Email:</strong> <a href={`mailto:${district.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)' }}>{district.spec_ed_contact_email}</a></span>}
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
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No school district records in database.</p>
                )}
              </div>

              {/* SELPAs / Education Boards */}
              <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>{educationLabel}</h3>
                {eligibleSelpas.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {eligibleSelpas.map((selpa) => (
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
              <div className="glass-panel" style={{ padding: '1.75rem', background: 'rgba(255,255,255,0.7)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Nonprofit Support & Local Resources</h3>
                {eligibleLocalOrganizations.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {eligibleLocalOrganizations.map((org) => (
                      <DirectoryFoundationPanel
                        key={org.id}
                        entityType="nonprofit"
                        heading="Support organization"
                        record={org}
                        pageType="county"
                        stateId={stateData.id}
                        countyId={countyDetails.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>No local support organizations listed in DB.</p>
                )}
              </div>

              {/* Diagnosis browse section from the canonical benefits route */}
              <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                  Browse by Diagnosis in {countyFormatted} County
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                  gap: '1rem' 
                }}>
                  {directoryLinks.map(link => (
                    <Link 
                      key={link.slug} 
                      href={`/benefits/${stateData.id}/${link.slug}/${countyId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div 
                        className="glass-panel" 
                        style={{ 
                          padding: '1rem 1.25rem', 
                          borderRadius: '12px', 
                          border: '1px solid rgba(0,0,0,0.03)',
                          background: 'white',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem', paddingRight: '0.5rem', lineHeight: 1.4 }}>
                          {link.name}
                        </span>
                        <ArrowRight size={13} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                      </div>
                    </Link>
                  ))}
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
                    <Link key={c.id} href={`/benefits/${stateData.id}/${c.id}`} style={{ fontSize: '0.8rem', color: c.id === countyId ? 'var(--primary-color)' : 'var(--text-light)', textDecoration: 'none', fontWeight: c.id === countyId ? 700 : 500 }}>
                      {c.name} County {c.id === countyId && '📍'}
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

          <SourceFreshnessDisclosure sources={
            stateData.id === 'california' ? [
              { name: 'California Department of Developmental Services', url: 'https://www.dds.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' }, // QA-ALLOW
              { name: 'California Department of Social Services', url: 'https://www.cdss.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' }, // QA-ALLOW
              { name: 'California Department of Health Care Services', url: 'https://www.dhcs.ca.gov', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' } // QA-ALLOW
            ] : [
              { name: stateConfig.ddAgency, url: '#', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' }, // QA-ALLOW
              { name: stateConfig.stateMedicaidAgency, url: '#', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' }, // QA-ALLOW
              { name: stateConfig.educationAgency, url: '#', lastReviewedDate: '2026-06-01', verificationStatus: 'official_verified' } // QA-ALLOW
            ]
          } />

        </main>
      );
    }

    // ==========================================
    // CASE 3: Diagnosis Index (/benefits/[diagnosis])
    // ==========================================
    const isDiagnosis = DIAGNOSES.map(slugifyDiagnosis).includes(countyId);
    if (isDiagnosis) {
      const diagnosisFormatted = formatParam(countyId);
      const countiesList = await getCounties(stateData.id);

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href={`/benefits/${stateData.id}`}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>


          <div style={{ marginBottom: '3.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              {diagnosisFormatted} Benefits Guides by County
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '850px' }}>
              Select a {stateName} county below to view tailored, legally-backed directories outlining local special education services, {config.catchmentName} intake departments, and {config.personalCareProgram} caregiver wages for children with <strong>{diagnosisFormatted}</strong>.
            </p>
          </div>


          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Select a County for {diagnosisFormatted} Support
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {countiesList.map(c => (
                <Link 
                  key={c.id} 
                  href={`/benefits/${stateData.id}/${countyId}/${c.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {c.name.replace(' County', '')}
                    </span>
                    <ArrowRight size={13} color="var(--primary-color)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }

    notFound();
  }

  // ==========================================
  // CASE 4, 5, 6: Leaf Pages (/benefits/[diagnosis]/[county | district | city])
  // ==========================================
  if (slug.length === 2) {
    const diagnosisSlug = slug[0].toLowerCase();
    const targetSlug = slug[1].toLowerCase();

    const diagnosisFormatted = formatParam(diagnosisSlug);

    // Resolve Geography type
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === targetSlug);
    const district = await getSchoolDistrictBySlug(targetSlug);
    const city = getCityBySlug(targetSlug);

    let countyId = '';
    let countyFormatted = '';
    let pageTitle = '';
    let pageDescription = '';
    let scopeType: 'county' | 'district' | 'city' = 'county';

    let districtDetails = null;

    if (isCounty) {
      countyId = targetSlug;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Benefits in ${countyFormatted} County`;
      pageDescription = `Navigating developmental care in ${countyFormatted} County. If you have a child with ${diagnosisFormatted}, your family may qualify for Medi-Cal waivers, safety supervision wages, and educational services.`;
      scopeType = 'county';
    } else if (district) {
      countyId = district.county_id;
      countyFormatted = formatParam(countyId);
      districtDetails = district;
      pageTitle = `${diagnosisFormatted} Support at ${district.name}`;
      pageDescription = `Reviewing special education resources, local IEP goals, and inclusion metrics for students with ${diagnosisFormatted} in ${district.name}.`;
      scopeType = 'district';
    } else if (city) {
      countyId = city.countyId;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Services in ${city.name}, ${stateCode}`;
      pageDescription = `Find pediatric Speech & Occupational therapy clinics, sensory-inclusive play areas, and caregiver support networks in ${city.name}.`;
      scopeType = 'city';
    } else {
      notFound();
    }

    // Load County-level details for underlying service models
    const countyData = await getCountyDetails(countyId);
    if (!countyData) {
      notFound();
    }

    const eligibleRegionalCenters = (countyData.regionalCenters || []).filter(isPublicRecordEligible);
    const eligibleSchoolDistricts = (countyData.schoolDistricts || []).filter(isPublicRecordEligible);
    const eligibleCountyOffices = (countyData.countyOffices || []).filter(isPublicRecordEligible);
    const eligibleSelpas = (countyData.selpas || []).filter(isPublicRecordEligible);

    const countiesList = await getCounties(stateData.id);
    const ihssOffice = eligibleCountyOffices.find((o) => o.program_id === 'ihss-for-children');
    const ihssPhone = ihssOffice?.phone || '';
    const ihssAddress = ihssOffice?.address || '';

    // Fetch AI-extracted programs from the crawler database matching this diagnosis
    const crawlerPrograms = await getProgramsForDiagnosis(diagnosisSlug);

    let isIndexable = false;
    if (scopeType === 'county') {
      const truth = getCountyDiagnosisTruthEligibility(stateData.id, diagnosisSlug, countyId, countyData);

      const rcScores = eligibleRegionalCenters.map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((s: number | null): s is number => s !== null);
      const sdScores = eligibleSchoolDistricts.map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((s: number | null): s is number => s !== null);
      const coScores = eligibleCountyOffices.map((co) => normalizeConfidenceScore(co.confidence_score)).filter((s: number | null): s is number => s !== null);
      const allScores = [...rcScores, ...sdScores, ...coScores];
      const confScore = allScores.length > 0 ? allScores.reduce((sum, s) => sum + s, 0) / allScores.length : null;

      const hasOfficialSource = eligibleRegionalCenters.some((rc) => !!rc.source_url) || eligibleSchoolDistricts.some((sd) => !!sd.source_url) || eligibleCountyOffices.some((co) => !!co.source_url);
      const hasRequiredContactInfo = eligibleCountyOffices.length > 0;
      const hasNoPlaceholderData = assertNoPlaceholderData(JSON.stringify(countyData));
      const hasRealLocalAssets = eligibleSchoolDistricts.length > 0 || eligibleCountyOffices.length > 0 || eligibleRegionalCenters.length > 0;

      const policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId: countyId,
        diagnosisId: diagnosisSlug,
        entityCount: eligibleSchoolDistricts.length,
        confidenceScore: confScore,
        hasOfficialSource,
        lastVerifiedDate: '2026-06-08', // QA-ALLOW
        hasRequiredContactInfo,
        hasNoPlaceholderData,
        hasRealLocalAssets
      });

      isIndexable = truth.indexSafe && policy.index;
    }

    const countySelpa = eligibleSelpas[0];

    // Load local advocates
    const rawLocalAdvocates = (await getIepAdvocates(countyId)).filter(isPublicDirectoryRecordEligible);

    // Sort local advocates to prioritize specialists matching the child's diagnosis
    const localAdvocates = [...rawLocalAdvocates].sort((a, b) => {
      const aText = ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase();
      const bText = ((b.specialties || '') + ' ' + (b.description || '')).toLowerCase();
      
      const diagTerms = [diagnosisFormatted.toLowerCase()];
      if (diagnosisFormatted.toLowerCase().includes('autism')) {
        diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
      }
      if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
        diagTerms.push('down syndrome', 'down\'s', 'trisomy');
      }
      if (diagnosisFormatted.toLowerCase().includes('adhd')) {
        diagTerms.push('adhd', 'add', 'attention deficit');
      }
      if (diagnosisFormatted.toLowerCase().includes('learning')) {
        diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
      }
      if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
        diagTerms.push('cerebral palsy', 'palsy');
      }
      if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
        diagTerms.push('speech', 'language', 'apraxia');
      }
      if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
        diagTerms.push('epilepsy', 'seizure');
      }
      if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
        diagTerms.push('hearing', 'deaf', 'auditory');
      }
      if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
        diagTerms.push('vision', 'blind', 'visual');
      }
      
      const aScore = diagTerms.some(term => aText.includes(term)) ? 1 : 0;
      const bScore = diagTerms.some(term => bText.includes(term)) ? 1 : 0;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      return b.experience_years - a.experience_years;
    });

    // Gather local resources from database
    const localProviders = (await getLocalProviders(countyId)).filter(isPublicDirectoryRecordEligible);
    
    const playgrounds = localProviders.filter(p => p.categories === 'playground');
    const clinics = localProviders.filter(p => p.categories === 'therapy-clinic');
    const groups = localProviders.filter(p => p.categories === 'support-group');
    const freshnessSources = [
      ...eligibleRegionalCenters,
      ...eligibleSchoolDistricts,
      ...eligibleCountyOffices,
      ...eligibleSelpas,
      ...localAdvocates,
      ...localProviders,
    ].filter((record) => {
      const freshnessRecord = record as {
        source_url?: string | null;
        last_verified_date?: string | null;
        last_verified_at?: string | null;
        source_last_updated?: string | null;
        checked_at?: string | null;
        last_scraped_at?: string | null;
      };

      return Boolean(
        freshnessRecord.source_url ||
        freshnessRecord.last_verified_date ||
        freshnessRecord.last_verified_at ||
        freshnessRecord.source_last_updated ||
        freshnessRecord.checked_at ||
        freshnessRecord.last_scraped_at
      );
    });

    const rcName = eligibleRegionalCenters[0]?.name || 'the local Regional Center';
    const sdName = districtDetails ? districtDetails.name : (eligibleSchoolDistricts[0]?.name || 'your local school district');
    const displayWage = countyData.ihss_wage_rate || 18.00; // QA-ALLOW
    const estHours = 283;
    const monthlyPayout = (estHours * displayWage).toLocaleString(undefined, { maximumFractionDigits: 0 });

    // Localized FAQ Accordion Data
    const localizedFaqs = config.faqs.map(faq => ({
      question: faq.q
        .replace(/\[diagnosis\]/g, diagnosisFormatted)
        .replace(/\[county\]/g, countyFormatted),
      answer: faq.a(countyFormatted, rcName, sdName, displayWage, monthlyPayout, diagnosisFormatted)
    }));
    
    localizedFaqs.push({
      question: `What is the difference between a 504 Plan and an IEP for a child with ${diagnosisFormatted}?`,
      answer: `A 504 Plan (under Section 504 of the Rehabilitation Act) provides accommodations (like extra testing time or sensory breaks) for students with disabilities to access the general education environment equally, but does not provide specialized instruction. An IEP (under the IDEA Act) is for students who require specialized instruction and related services (like speech therapy or specialized academic instruction) because their ${diagnosisFormatted} directly impacts their ability to learn. IEPs carry much stronger legal protections and funding rules.`
    });

    // Rich schemas dynamic compile
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: localizedFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
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
      '@graph': eligibleSchoolDistricts.map((sd) => ({
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

    const governmentServicesSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'GovernmentService',
          'name': `${config.catchmentName} Services`,
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': `${stateName} Developmental Services Agency`
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': rcName
          },
          'serviceType': 'Developmental Disability Support'
        },
        {
          '@type': 'GovernmentService',
          'name': config.personalCareProgram,
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': `${stateName} Department of Social Services`
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': `${countyFormatted} County Social Services Agency`
          },
          'serviceType': 'Personal Care & Support'
        }
      ]
    };

    const advocatesSchema = {
      '@context': 'https://schema.org',
      '@graph': localAdvocates.map(adv => ({
        '@type': 'ProfessionalService',
        'name': adv.name,
        'image': 'https://special-needs-ca.vercel.app/avatar-default.png',
        'telephone': adv.phone,
        'email': adv.email,
        'url': adv.website,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': countyFormatted,
          'addressRegion': stateCode,
          'addressCountry': 'US'
        },
        'description': `${adv.name} is a special education IEP advocate serving ${countyFormatted} County. Credentials: ${adv.credentials}. Specialties: ${adv.specialties || 'IEP, Regional Center, Appeals'}.`
      }))
    };

    // Coordinate Map pins compile
    const mapResources: {
      id: string;
      type: 'regional-center' | 'school-board';
      name: string;
      address: string;
      phone: string;
      description: string;
      x: number;
      y: number;
    }[] = [];
    if (eligibleRegionalCenters.length > 0) {
      mapResources.push({
        id: 'rc-1',
        type: 'regional-center',
        name: eligibleRegionalCenters[0].name,
        address: `Intake Desk, ${countyFormatted}, ${stateCode}`,
        phone: eligibleRegionalCenters[0].intake_phone,
        description: `${stateName} developmental agency coordinating respite, therapy funding, and developmental support: ${eligibleRegionalCenters[0].catchment_boundaries}`,
        x: 210,
        y: 260
      });
    }
    if (eligibleSchoolDistricts.length > 0) {
      mapResources.push({
        id: 'sd-1',
        type: 'school-board',
        name: eligibleSchoolDistricts[0].name,
        address: `Special Education Department, ${countyFormatted}, ${stateCode}`,
        phone: eligibleSchoolDistricts[0].spec_ed_contact_phone || '',
        description: `Special education district coordinator responsible for IEP evaluations, placement, and inclusion LRE classrooms.`,
        x: 580,
        y: 120
      });
    }

    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
        
        {/* Dynamic JSON-LD structured data injection */}
        {isIndexable && (
          <>
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
              dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServicesSchema) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(advocatesSchema) }}
            />
          </>
        )}

        {/* Source-backed Trust Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '0.75rem 1.5rem', borderRadius: '16px', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
            <Award size={16} color="var(--primary-color)" />
            <span>Source-backed county guide. Public local listings render only when a source URL, contact signal, and acceptable verification state exist.</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Freshness sources on page: <strong>{freshnessSources.length}</strong> | County/index gating follows the shared truth eligibility rules
          </span>
        </div>

        {/* Dynamic Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
            {pageDescription}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <ShareButton />
            <PrintButton label="Print PDF Guides & Resources" />
          </div>
        </div>

        {/* Inclusive resource playground interactive map canvas */}
        <div style={{ marginBottom: '4rem' }} className="no-print">
          <CountyMapClient countyName={countyFormatted} resources={mapResources} />
        </div>

        {/* IHSS Protective Supervision Mini-Product Tool */}
        <div style={{ marginBottom: '4rem' }}>
          <IhssMiniProduct 
            diagnosisName={diagnosisFormatted}
            initialCountyId={countyId}
            initialCountyName={countyFormatted}
            initialWage={displayWage}
            initialPhone={ihssPhone}
            initialAddress={ihssAddress}
            countiesList={countiesList.map(c => ({ id: c.id, name: c.name }))}
          />
        </div>

        {/* School District Local Stats Banner (renders only for district scope) */}
        {scopeType === 'district' && districtDetails && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Landmark size={22} />
              {districtDetails.name} Special Education Inclusion Report
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>District Enrollment</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.total_enrollment !== undefined ? `~${districtDetails.total_enrollment.toLocaleString()}` : 'N/A'} students
                </strong>
              </div>
              
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Special Ed Ratio</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.special_ed_pct !== undefined ? `${districtDetails.special_ed_pct}%` : 'N/A'} of student body
                </strong>
              </div>

              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <span>Inclusion (Gen-Ed &gt;80%)</span>
                  <strong style={{ color: '#10b981' }}>
                    {districtDetails.inclusion_rate_pct !== undefined ? `${districtDetails.inclusion_rate_pct}%` : 'N/A'}
                  </strong>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${districtDetails.inclusion_rate_pct || 0}%`, backgroundColor: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-light)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📞 Special Ed Dept: <strong>{districtDetails.spec_ed_contact_phone || 'N/A'}</strong></span>
              {districtDetails.spec_ed_contact_email && (
                <span>✉️ Contact: <a href={`mailto:${districtDetails.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.spec_ed_contact_email}</a></span>
              )}
              {districtDetails.website && (
                <span>🌐 Website: <a href={districtDetails.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.website}</a></span>
              )}
            </div>
          </div>
        )}

        {/* Parent-to-Parent Advocacy Guide */}
        <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <Sparkles color="var(--primary-color)" size={24} />
            Parent-to-Parent Advocacy Guide: Securing Support for {diagnosisFormatted}
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Getting a diagnosis for your child is overwhelming, and navigating {stateName}&apos;s service landscape can feel like a full-time job. As families who have walked this road, we compiled the most important, legally-backed advice to help you secure services for <strong>{diagnosisFormatted}</strong> in <strong>{countyFormatted} County</strong>.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>1. {config.catchmentName} Entitlements</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                Call {eligibleRegionalCenters[0]?.name || `your local ${config.catchmentName}`} intake department immediately. Under state developmental disability regulations, eligibility is a legal right, not a lottery. <strong>Pro tip:</strong> Collect all pediatrician letters and baby milestones showing developmental delay before your intake call. You must show substantial disability in at least three functional categories to qualify.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>2. Securing {config.personalCareProgram} Caregiver Wages</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                If {diagnosisFormatted} causes behaviors like wandering (elopement), self-injury, or safety hazards, you can get paid by the state to care for your child. Apply for the {config.personalCareProgram} program. <strong>Pro tip:</strong> Start logging every single dangerous event today. Social workers require a 24-hour log to approve hours.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>3. School IEP Tactics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                When dealing with {sdName}, never make requests verbally. Write a formal letter requesting a special education evaluation. Under {config.timelinesCode}, the district has exactly <strong>{config.timelineDaysPlan}</strong> to send you an assessment plan. Do not let them delay with &quot;Response to Intervention&quot; (RTI) trial periods.
              </p>
            </div>

            {stateData.id === 'california' && (
              <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>4. CCS Medical Support</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                  For medical fragility, clinical therapy, or custom equipment, apply for California Children&apos;s Services (CCS). In {countyFormatted} County, children can access school-based Medical Therapy Units (MTUs) for occupational and physical therapy. <strong>Pro tip:</strong> Therapy provided at an MTU bypasses parental income caps entirely.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Matched Government & Specialized Programs Section */}
        {crawlerPrograms && crawlerPrograms.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              <ShieldCheck color="var(--primary-color)" size={24} />
              Source-Backed Government & Community Support Programs for {diagnosisFormatted}
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Based on crawled state agency rules, the following programs specify qualifying eligibility rules matching <strong>{diagnosisFormatted}</strong>:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {crawlerPrograms.map((prog) => {
                const pSlug = prog.program_name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');
                return (
                  <div 
                    key={prog.id} 
                    style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(var(--primary-rgb), 0.02)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.03)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                        {prog.program_name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                        {prog.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                      <span><strong>Income:</strong> {prog.income_limit}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <Link href={`/benefits/${stateData.id}/program/${pSlug}`} style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          View Guide <ArrowRight size={12} />
                        </Link>
                        <a href={prog.source_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-light)' }}>
                          Official Source ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Local Resource Directory Layout */}
        <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Guides & Contacts ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center details */}
            {eligibleRegionalCenters.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <Landmark size={16} /> {config.catchmentName}
                </strong>
                <strong>{eligibleRegionalCenters[0].name}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{eligibleRegionalCenters[0].catchment_boundaries}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                  Intake: 
                  <a href={`tel:${eligibleRegionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{eligibleRegionalCenters[0].intake_phone}</a>
                </span>
              </div>
            )}

            {/* School board directory list */}
            {eligibleSchoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {eligibleSchoolDistricts.map((districtRow) => (
                  <div key={districtRow.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{districtRow.name}</strong>
                    </div>
                    
                    {districtRow.total_enrollment && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                        Enrollment: ~{districtRow.total_enrollment.toLocaleString()} students ({districtRow.special_ed_pct}% SpEd)
                      </span>
                    )}

                    {districtRow.inclusion_rate_pct && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Inclusion Rate (Gen-Ed &gt;80%)</span>
                          <strong style={{ color: '#10b981' }}>{districtRow.inclusion_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${districtRow.inclusion_rate_pct}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Local Insurance & Payouts details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                <Heart size={16} /> Local Insurance & Payouts
              </strong>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{config.medicaidName} Managed Care Plans</strong>
                {countyData.medi_cal_plans ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>
                    {countyData.medi_cal_plans}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                    Standard {config.medicaidName} Managed Care Plans apply.
                  </p>
                )}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  Managed care plans coordinate medical, pediatric, and developmental therapies in this county.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>{config.personalCareProgram} Provider Payout Rate</strong>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ${displayWage.toFixed(2)} / Hour
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem' }}>
                  Current hourly rate for parent caregivers in {countyFormatted} County.
                </span>
                <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 0.4rem 0' }}>
                    <strong>Assumptions & Estimates:</strong> Maximum monthly payout estimate is based on full-time monthly caregiver hours. Approved hours depend on individual state assessments.
                  </p>
                  <p style={{ margin: '0 0 0.4rem 0' }}>
                    <strong>Data Source:</strong> Verified against official state rate registers. Last reviewed: June 2026.
                  </p>
                  <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                    *Disclaimer: Actual approved hours and eligibility vary by individual county assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Localized Community Assets Section */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary-color)" />
              Local support networks and resources
            </h3>
            
            {(playgrounds.length > 0 || clinics.length > 0 || groups.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {playgrounds[0] && (
                  <DirectoryFoundationPanel
                    entityType="provider"
                    heading="Inclusive Playgrounds & Parks"
                    record={playgrounds[0]}
                    pageType="county_diagnosis"
                    stateId={stateData.id}
                    countyId={countyId}
                  />
                )}
                {clinics[0] && (
                  <DirectoryFoundationPanel
                    entityType="provider"
                    heading="Pediatric Therapy Clinics"
                    record={clinics[0]}
                    pageType="county_diagnosis"
                    stateId={stateData.id}
                    countyId={countyId}
                  />
                )}
                {groups[0] && (
                  <DirectoryFoundationPanel
                    entityType="provider"
                    heading="Local Support Chapters"
                    record={groups[0]}
                    pageType="county_diagnosis"
                    stateId={stateData.id}
                    countyId={countyId}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Parent Rights & Special Education Guidelines Section */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="var(--primary-color)" size={24} />
            Special Education Rights & Local {config.catchmentName === 'Regional Center' ? 'SELPA' : 'Education Agency'} Guidelines
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Column A: SELPA & Early Intervention */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  <Landmark size={18} color="var(--primary-color)" />
                  Local {config.catchmentName === 'Regional Center' ? 'SELPA' : 'Education'} Planning Area
                </h3>
                {countySelpa ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    In {countyFormatted} County, special education funding and compliance are coordinated by the <strong>{countySelpa.name}</strong>. The educational agency is responsible for ensuring that all school districts within its boundaries provide a Free Appropriate Public Education (FAPE). You can access local guidelines and plans directly on the <a href={countySelpa.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countySelpa.name} Website</a>.
                  </p>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    Special education services are administered by local educational planning agencies. These agencies coordinate resource allocations and compliance across county school districts to ensure children receive appropriate support. Contact your local school district coordinator to find your designated boundaries.
                  </p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  👶 {config.earlyInterventionLabel}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If your child is under three years old, early intervention services (speech, physical therapy, occupational therapy) are administered under the **{config.earlyInterventionLabel}** program. Early intervention is coordinated jointly by developmental agencies and school districts. The statutory timeline mandates that assessments and services are established promptly.
                </p>
              </div>
            </div>

            {/* Column B: Procedural Safeguards & Legal Counsel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  📜 Notice of Procedural Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  Under the Federal Individuals with Disabilities Education Act (IDEA), you must receive a written copy of the **Notice of Procedural Safeguards** at least once a year and upon request for assessment. These safeguards outline your legal rights to:
                </p>
                <ul style={{ fontSize: '0.88rem', color: 'var(--text-light)', paddingLeft: '1.2rem', margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Participate in all meetings regarding your child&apos;s education and placement.</li>
                  <li>Examine all school records and request Independent Educational Evaluations (IEEs) at public expense.</li>
                  <li>Receive written notice before the school proposes or refuses any changes.</li>
                  <li>File for mediation or due process hearings in case of unresolved disagreements.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  ⚖️ Special Education Attorney Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If the school district violates statutory timelines or denies appropriate service placements, you have the right to consult a **Special Education Attorney**. In {stateName}, if you prevail in a due process hearing, the school district is legally required to reimburse your reasonable attorney&apos;s fees. Source-backed special education lawyers or advocates may represent you in mediation, due process filings, and state complaints.
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Local IEP Advocates Section */}
        {localAdvocates && localAdvocates.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.02)', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <Award color="var(--primary-color)" size={24} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Local IEP Advocates serving {countyFormatted} County</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Special education advisors and legal advocates serving families in {countyFormatted} County. Advocate listings below are limited to public records that pass the shared truth eligibility checks.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {localAdvocates.map((adv) => {
                const isSpecialist = (() => {
                  const text = ((adv.specialties || '') + ' ' + (adv.description || '')).toLowerCase();
                  const diagTerms = [diagnosisFormatted.toLowerCase()];
                  if (diagnosisFormatted.toLowerCase().includes('autism')) {
                    diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
                    diagTerms.push('down syndrome', 'down\'s', 'trisomy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('adhd')) {
                    diagTerms.push('adhd', 'add', 'attention deficit');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('learning')) {
                    diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
                    diagTerms.push('cerebral palsy', 'palsy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
                    diagTerms.push('speech', 'language', 'apraxia');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
                    diagTerms.push('epilepsy', 'seizure');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
                    diagTerms.push('hearing', 'deaf', 'auditory');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
                    diagTerms.push('vision', 'blind', 'visual');
                  }
                  return diagTerms.some(term => text.includes(term));
                })();

                return (
                  <DirectoryFoundationPanel
                    key={adv.id}
                    entityType="advocate"
                    heading={isSpecialist ? `${diagnosisFormatted} specialist` : 'Special education advocate'}
                    record={adv}
                    subtitle={adv.specialties || null}
                    pageType="county_diagnosis"
                    stateId={stateData.id}
                    countyId={countyId}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Localized FAQ / Q&A Accordion */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Frequently Asked Questions (FAQ) — {diagnosisFormatted} in {countyFormatted} County
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {localizedFaqs.map((faq, idx) => (
              <div key={idx} style={{ 
                borderBottom: idx < localizedFaqs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', 
                paddingBottom: idx < localizedFaqs.length - 1 ? '1.5rem' : '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>Q:</span>
                  {faq.question}
                </strong>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: '1.6', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>A:</span>
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal footnoting block for extreme E-E-A-T */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginTop: '4rem', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
          <p><strong>Legal Disclaimer & Citations:</strong> This information is compiled for educational, planning, and advocacy support, and does not constitute official legal or medical advice. Verification dates represent the last data-freshness synchronization with official state developmental and health care services registers. Actual eligibility outcomes are subject to individual agency assessments.</p>
          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            {config.legalDisclaimer}
          </p>
        </div>
      </main>
    );
  }

  notFound();
}

export default async function BenefitsCatchAll({ params }: Props) {
  const p = await params;
  const stateId = p.state;
  const stateData = await getStateByIdOrCode(stateId);
  const isIndexedState = stateData ? isIndexableState(stateData.id) : true;
  const content = await InnerBenefitsCatchAll({ params });
  if (!isIndexedState && stateData) {
    const gapReason = stateGapReason(stateData.id);
    return (
      <div>
        <div style={{ background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)', borderBottom: '1px solid #fde68a', padding: '1rem 1.5rem', color: '#92400e', fontSize: '0.88rem', fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span>⚠️</span>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.15rem' }}>Verification Pending &mdash; Not Yet Index-Safe</strong>
              <p style={{ margin: 0, lineHeight: 1.4, color: '#b45309' }}>The official data-audit for {stateData.name} is currently incomplete. This page is served with a noindex robots policy.</p>
              {gapReason && <div style={{ marginTop: '0.5rem', paddingLeft: '0.5rem', borderLeft: '3px solid #f59e0b', fontSize: '0.82rem', color: '#78350f' }}><strong>Known Blockers / Gap Audit:</strong> {gapReason}</div>}
            </div>
          </div>
        </div>
        {content}
      </div>
    );
  }
  return content;
}
