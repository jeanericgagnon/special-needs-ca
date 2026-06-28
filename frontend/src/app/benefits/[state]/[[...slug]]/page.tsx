/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  getCountyDetails, 
  getBulkCountyDetails,
  getIepAdvocates, 
  getCounties, 
  getSchoolDistrictBySlug,
  getLocalProviders,
  getProgramsForDiagnosis,
  getAllPrograms,
  getProgramBySlug,
  getStateByIdOrCode,
  navigatorDb,
  Program
} from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCityBySlug } from '@/lib/cities';
import { Metadata } from 'next';
import { MapPin, Phone, Landmark, ShieldCheck, Award, Sparkles, ArrowLeft, ArrowRight, Heart, Calculator, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '@/app/benefits/components/county-map-client';
import DirectoryFoundationPanel from '@/app/components/directory-foundation-panel';
import CaliforniaMap from '@/app/components/california-map';
import IhssMiniProduct from '@/app/benefits/components/ihss-mini-product';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import { StateCoverageBadge } from '@/components/state-coverage-badge';
import { getCountyDiagnosisTruthEligibility, getCountyTruthEligibility, isIndexableState, isPublicCountyOfficeEligible, isPublicDirectoryRecordEligible, isPublicRecordEligible, VERIFIED_DIAGNOSIS_SLUGS } from '@/lib/publicTruth';
import { stateGapReason, evaluateSeoPolicy, getSeoPolicyForRoute, normalizeConfidenceScore, assertNoPlaceholderData } from '@/lib/seo-policy';
import { getPartialStatePolicy, isLaunchSurfaceSuppressed } from '@/lib/launchStatePolicy';
import { CANONICAL_SITE_URL } from '@/lib/site-url';
import DirectoryReviews from '@/app/dashboard/components/DirectoryReviews';
import SeoSchema from '@/app/components/seo-schema';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import { getCountyIntroCopy } from '@/lib/countySeoHelpers';
import { getIhssWageDisclosure } from '@/lib/ihssWageDisclosure';

type Props = {
  params: Promise<{ state: string; slug?: string[] }>;
};

const SITE_URL = CANONICAL_SITE_URL;

function LocalVerificationNotice({
  label,
  targetName,
  suggestionType = 'other',
}: {
  label: string;
  targetName: string;
  suggestionType?: 'other' | 'district' | 'program';
}) {
  const targetId = targetName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: 0 }}>
        We are still verifying local entries for {label} before showing them publicly on this page.
      </p>
      <div>
        <ContributionModal
          suggestionType={suggestionType}
          targetId={targetId}
          targetName={targetName}
          buttonLabel="Suggest a local source to review"
        />
      </div>
    </div>
  );
}

function CountyVerificationPendingBanner({
  countyName,
}: {
  countyName: string;
}) {
  return (
    <div style={{ background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid #fde68a', borderRadius: '16px', padding: '1rem 1.1rem', color: '#92400e', fontSize: '0.9rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span>⚠️</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' }}>We are still verifying local entries</strong>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Some local routing or office details for {countyName} County are still under review. We keep thin local sections noindexed and only show public records that pass the current source and trust checks.
            </p>
          </div>
          <div>
            <ContributionModal
              suggestionType="other"
              targetId={`${countyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-county-verification`}
              targetName={`${countyName} County local verification`}
              buttonLabel="Suggest a local source to review"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function pickCountyPolicyDetails<T extends {
  schoolDistricts?: unknown[];
  countyOffices?: unknown[];
  regionalCenters?: unknown[];
}>(primary: T | null | undefined, fallback: T | null | undefined): T | null {
  if (!primary && !fallback) return null;
  if (!primary) return fallback || null;
  if (!fallback) return primary;

  const primaryScore =
    (primary.schoolDistricts?.length || 0) +
    (primary.countyOffices?.length || 0) +
    (primary.regionalCenters?.length || 0);
  const fallbackScore =
    (fallback.schoolDistricts?.length || 0) +
    (fallback.countyOffices?.length || 0) +
    (fallback.regionalCenters?.length || 0);

  return fallbackScore > primaryScore ? fallback : primary;
}

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

function formatFamilyLabel(family: string): string {
  const labels: Record<string, string> = {
    county_local_disability_resources: 'County and local routing',
    district_or_county_education_routing: 'District and county education routing',
    medicaid_state_health_coverage: 'State Medicaid coverage',
    medicaid_waiver_hcbs_disability_services: 'Waiver and HCBS services',
    developmental_disability_idd_authority: 'Developmental disability authority',
    early_intervention_part_c: 'Early intervention',
    special_education_idea_part_b: 'Special education IDEA Part B',
    vocational_rehabilitation_pre_ets: 'Vocational rehabilitation and Pre-ETS',
    protection_and_advocacy: 'Protection and advocacy',
    parent_training_information_center: 'Parent training and information',
    legal_aid: 'Legal aid',
    able_program: 'ABLE program',
    ssi_ssa_federal_reference: 'SSI and SSA reference'
  };
  return labels[family] || family.replace(/_/g, ' ');
}

function PartialStateGate({
  stateName,
  stateId,
  heading,
  body,
  gapReason,
  unavailableMessage,
  suppressedFamilies,
}: {
  stateName: string;
  stateId: string;
  heading: string;
  body: string;
  gapReason?: string | null;
  unavailableMessage: string;
  suppressedFamilies: string[];
}) {
  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
      <div style={{ maxWidth: '920px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <StateCoverageBadge stateId={stateId} stateName={stateName} />
        </div>
        <div
          className="glass-panel"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.10) 0%, rgba(245, 158, 11, 0.04) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            padding: '2rem',
            borderRadius: '24px'
          }}
        >
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.75rem 0' }}>{heading}</h1>
          <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6, color: 'var(--text-main)' }}>{body}</p>
          <p style={{ margin: '0 0 1rem 0', lineHeight: 1.6, color: '#92400e' }}>{unavailableMessage}</p>
          {gapReason ? (
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
              Audit gap reason: <strong>{gapReason}</strong>
            </p>
          ) : null}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {suppressedFamilies.map((family) => (
              <span
                key={family}
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#92400e',
                  borderRadius: '999px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {formatFamilyLabel(family)}
              </span>
            ))}
          </div>
        </div>
        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.94)', padding: '1.5rem 1.75rem', borderRadius: '20px' }}>
          <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-light)' }}>
            This state remains available only in a partial, gated mode. Statewide audit context may remain visible, but county, district, city, and other local surfaces that rely on unresolved evidence are intentionally suppressed until the official public proof is reviewable.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <ContributionModal
              suggestionType="other"
              targetId={`${stateId}-local-proof-gap`}
              targetName={`${stateName} local routing evidence`}
              buttonLabel="Suggest a local source to review"
            />
          </div>
        </div>
      </div>
    </main>
  );
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
  const partialStatePolicy = getPartialStatePolicy(stateData.id);
  const catchment = config.catchmentName;
  const personalCare = config.personalCareProgram;
  let statePrograms: Program[] = [];
  try {
    statePrograms = await navigatorDb.prepare(`
      SELECT * FROM programs
      WHERE state_id = ?
        AND COALESCE(display_status, 'published') = 'published'
    `).all(stateData.id) as Program[];
  } catch {
    statePrograms = [];
  }
  const stateProgramDates = statePrograms.map((program) => program.last_verified_date).filter(Boolean) as string[];
  const stateProgramsLastVerifiedDate = stateProgramDates.length > 0
    ? stateProgramDates.reduce((min, date) => (date < min ? date : min), stateProgramDates[0])
    : null;
  const stateProgramScores = statePrograms
    .map((program) => normalizeConfidenceScore(program.confidence_score))
    .filter((score): score is number => score !== null);
  const stateProgramsConfidenceScore = stateProgramScores.length > 0
    ? stateProgramScores.reduce((sum, score) => sum + score, 0) / stateProgramScores.length
    : null;

  const stateHubPolicy = getSeoPolicyForRoute('state-hub', {
    stateId: stateData.id
  }, {
    entityCount: statePrograms.length,
    confidenceScore: stateProgramsConfidenceScore,
    hasOfficialSource: statePrograms.length > 0 && statePrograms.some((program) => !!program.source_url),
    lastVerifiedDate: stateProgramsLastVerifiedDate,
    hasNoPlaceholderData: statePrograms.every((program) => assertNoPlaceholderData(JSON.stringify(program)))
  });

  if (slug.length === 0) {
    if (partialStatePolicy) {
      return {
        title: `${stateName} Disability Resource Verification Status`,
        description: `${stateName} remains available in a partial, noindex mode while local county and district evidence is still being verified.`,
        alternates: { canonical: `/benefits/${stateData.id}` },
        robots: { index: false, follow: true }
      };
    }
    return {
      title: `${stateName} Disability Benefits, School, and Support Guides`,
      description: `Select your ${stateName} county to review local developmental benefits, ${catchment} intake paths, school district support, and currently published advocacy links.`,
      alternates: { canonical: `/benefits/${stateData.id}` },
      robots: stateHubPolicy.index ? undefined : { index: false, follow: true }
    };
  }

  if (slug.length === 1) {
    if (slug[0].toLowerCase() === 'programs') {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'programs-index')) {
        return {
          title: `${stateName} statewide program guides are being verified`,
          description: `${stateName} program guide pages are temporarily suppressed while the statewide launch surface stays in partial verification mode.`,
          alternates: { canonical: `/benefits/${stateData.id}/programs` },
          robots: { index: false, follow: true }
        };
      }
      const programsPolicy = getSeoPolicyForRoute('static-page', {
        path: `/benefits/${stateData.id}/programs`
      }, {
        hasNoPlaceholderData: true
      });
      return {
        title: `${stateName} Disability Program and Benefits Guides`,
        description: `Explore ${stateName} public disability programs, including ${catchment}, ${personalCare}, healthcare pathways, and ABLE accounts.`,
        alternates: { canonical: `/benefits/${stateData.id}/programs` },
        robots: programsPolicy.index ? undefined : { index: false, follow: true }
      };
    }
    const countyId = slug[0].toLowerCase();
    const countyDetails = await getCountyDetails(countyId);
    if (countyDetails) {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'county-hub')) {
        return {
          title: `${formatParam(countyId)} County local routing is being verified in ${stateName}`,
          description: `${stateName} county-level local routing remains gated until the remaining official evidence gap is closed.`,
          alternates: { canonical: `/benefits/${stateData.id}/${countyId}` },
          robots: { index: false, follow: true }
        };
      }
      const bulkCountyDetails = (await getBulkCountyDetails(stateData.id)).get(countyId);
      const policyCountyDetails = pickCountyPolicyDetails(countyDetails, bulkCountyDetails) || countyDetails;
      const countyFormatted = formatParam(slug[0]);
      const sdList = ((policyCountyDetails.schoolDistricts || []) as Array<any>).filter(isPublicRecordEligible);
      const coList = ((policyCountyDetails.countyOffices || []) as Array<any>).filter(isPublicCountyOfficeEligible);
      const rcList = ((policyCountyDetails.regionalCenters || []) as Array<any>).filter(isPublicRecordEligible);
      const rcScores = rcList.map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((score): score is number => score !== null);
      const sdScores = sdList.map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((score): score is number => score !== null);
      const coScores = coList.map((co) => normalizeConfidenceScore(co.confidence_score)).filter((score): score is number => score !== null);
      const allScores = [...rcScores, ...sdScores, ...coScores];
      const confidenceScore = allScores.length > 0 ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length : null;
      const lastVerifiedDate = [
        ...rcList.map((rc) => rc.last_verified_date).filter(Boolean),
        ...sdList.map((sd) => sd.last_verified_date).filter(Boolean),
        ...coList.map((co) => co.last_verified_date).filter(Boolean)
      ].sort().at(-1) || null;
      const countyPolicy = getSeoPolicyForRoute('county-hub', {
        stateId: stateData.id,
        countyId
      }, {
        entityCount: sdList.length,
        hasOfficialSource: rcList.some((rc) => !!rc.source_url) || sdList.some((sd) => !!sd.source_url) || coList.some((co) => !!co.source_url),
        hasRequiredContactInfo: coList.length > 0,
        hasRealLocalAssets: sdList.length > 0 || coList.length > 0 || rcList.length > 0,
        hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(policyCountyDetails)),
        lastVerifiedDate,
        confidenceScore
      });
      return {
        title: `Special Needs & IEP Benefits in ${countyFormatted} County, ${stateCode}`,
        description: `Browse localized developmental resources and advocacy directories in ${countyFormatted} County. Access ${catchment} intake details and school district inclusion benchmarks.`,
        alternates: { canonical: `/benefits/${stateData.id}/${countyId}` },
        robots: countyPolicy.index ? undefined : { index: false, follow: true }
      };
    } else {
      const diagnosisFormatted = formatParam(slug[0]);
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'condition-hub')) {
        return {
          title: `${diagnosisFormatted} county guides are being verified in ${stateName}`,
          description: `${stateName} diagnosis-by-county surfaces remain gated until local county and district evidence is reverified.`,
          alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}` },
          robots: { index: false, follow: true }
        };
      }
      const diagnosisPolicy = getSeoPolicyForRoute('condition-hub', {
        stateId: stateData.id,
        diagnosisId: slug[0].toLowerCase()
      }, {
        hasNoPlaceholderData: true
      });
      const isIndexed = diagnosisPolicy.index && VERIFIED_DIAGNOSIS_SLUGS.includes(slug[0].toLowerCase() as (typeof VERIFIED_DIAGNOSIS_SLUGS)[number]);
      return {
        title: `${diagnosisFormatted} Support Services by County in ${stateName}`,
        description: `Select a county in ${stateName} to discover specialized ${diagnosisFormatted} programs, ${catchment} support, local school accommodations, and parent advocacy groups.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}` },
        robots: isIndexed ? undefined : { index: false, follow: true }
      };
    }
  }

  if (slug.length === 2) {
    if (slug[0].toLowerCase() === 'program') {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'program-guide')) {
        return {
          title: `${stateName} program guides are being verified`,
          description: `${stateName} program guide pages are temporarily suppressed while the statewide launch surface stays in partial verification mode.`,
          alternates: { canonical: `/benefits/${stateData.id}/program/${slug[1].toLowerCase()}` },
          robots: { index: false, follow: true }
        };
      }
      const prog = await getProgramBySlug(slug[1].toLowerCase());
      const title = prog ? prog.program_name : formatParam(slug[1]);
      const programPolicy = getSeoPolicyForRoute('program-guide', {
        stateId: stateData.id,
        programId: slug[1].toLowerCase(),
        path: `/benefits/${stateData.id}/program/${slug[1].toLowerCase()}`
      }, {
        programStateId: stateData.id,
        hasOfficialSource: !!prog?.source_url,
        lastVerifiedDate: prog?.last_verified_date || null,
        confidenceScore: prog ? normalizeConfidenceScore(prog.confidence_score) : null,
        hasNoPlaceholderData: prog ? assertNoPlaceholderData(JSON.stringify(prog)) : false,
        verificationStatus: prog?.verification_status || null
      });
      return {
        title: `${title} - ${stateName} Special Needs Program Guide`,
        description: `Source-backed overview of ${title} in ${stateName}. Check eligibility rules, age limits, income guidelines, and related support options.`,
        alternates: { canonical: `/benefits/${stateData.id}/program/${slug[1].toLowerCase()}` },
        robots: programPolicy.index ? undefined : { index: false, follow: true }
      };
    }
    const diagnosisFormatted = formatParam(slug[0]);
    const secondSlug = slug[1].toLowerCase();

    // Check if second slug is a county
    const isCounty = (await getCounties(stateData.id)).some(c => c.id === secondSlug);
    if (isCounty) {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'county-condition')) {
        return {
          title: `${diagnosisFormatted} local guides are being verified in ${formatParam(secondSlug)} County, ${stateCode}`,
          description: `${stateName} diagnosis-specific county guides remain gated until local county and district evidence is reverified.`,
          alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}/${secondSlug}` },
          robots: { index: false, follow: true }
        };
      }
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
      const lastVerifiedDate = [
        ...rcList.map((rc) => rc.last_verified_date).filter(Boolean),
        ...sdList.map((sd) => sd.last_verified_date).filter(Boolean),
        ...coList.map((co) => co.last_verified_date).filter(Boolean)
      ].sort().at(-1) || null;

      const policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId: secondSlug,
        diagnosisId: slug[0].toLowerCase(),
        entityCount: sdList.length,
        confidenceScore: confScore,
        hasOfficialSource,
        lastVerifiedDate,
        hasRequiredContactInfo,
        hasNoPlaceholderData,
        hasRealLocalAssets
      });

      const canIndex = truth.indexSafe && policy.index;

      return {
        title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, ${stateCode}`,
        description: `Review ${stateName} public support paths, ${catchment} intake links, caregiver pay estimates, and school support guidance for ${diagnosisFormatted} in ${countyFormatted} County.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0].toLowerCase()}/${secondSlug}` },
        robots: canIndex ? undefined : { index: false, follow: true }
      };
    }

    // Check if second slug is a school district
    const district = await getSchoolDistrictBySlug(secondSlug);
    if (district) {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'school-district')) {
        return {
          title: `${district.name} local education routing is being verified`,
          description: `${stateName} district-specific local routing remains gated until the remaining official local evidence is reverified.`,
          alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
          robots: { index: false, follow: true }
        };
      }
      return {
        title: `${diagnosisFormatted} IEP & Special Education Support in ${district.name}`,
        description: `Evaluate ${diagnosisFormatted} inclusion rates, special education helper contacts, custom accommodations, and smart goal builders for ${district.name}.`,
        alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
        robots: { index: false, follow: true }
      };
    }

    // Check if second slug is a city
    const city = getCityBySlug(secondSlug);
    if (city) {
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'city')) {
        return {
          title: `${city.name} local guides are being verified in ${stateName}`,
          description: `${stateName} city-level local guides remain gated until the remaining official local evidence is reverified.`,
          alternates: { canonical: `/benefits/${stateData.id}/${slug[0]}/${secondSlug}` },
          robots: { index: false, follow: true }
        };
      }
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
  const partialStatePolicy = getPartialStatePolicy(stateData.id);
  const gapReason = stateGapReason(stateData.id);
  const softenedLegalDisclaimer = `${stateName} program, education, and dispute rules can change. Use the linked public sources on this page${
    config.timelinesCode ? ` and ${config.timelinesCode}` : ''
  } to confirm the current eligibility, assessment, appeal, and timeline rules before relying on any summary here.`;

  // ==========================================
  // CASE 7: Programs Index (/benefits/[state]/programs)
  // ==========================================
  if (slug.length === 1 && slug[0].toLowerCase() === 'programs') {
    if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'programs-index')) {
      return (
        <PartialStateGate
          stateName={stateName}
          stateId={stateData.id}
          heading={`${stateName} statewide program guides are not yet launch-safe`}
          body={`This state stays available only through its statewide audit surface right now. Program-guide pages are suppressed until the statewide data layer is verified enough to support them truthfully.`}
          gapReason={gapReason}
          unavailableMessage={partialStatePolicy.unavailableMessage}
          suppressedFamilies={partialStatePolicy.suppressedFamilies}
        />
      );
    }
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
            {stateName} Disability Guides & Resources
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Source-backed guides for public benefits, waivers, healthcare pathways, and developmental support programs currently published for families in {stateName}.
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
    if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'program-guide')) {
      return (
        <PartialStateGate
          stateName={stateName}
          stateId={stateData.id}
          heading={`${stateName} program details are not yet launch-safe`}
          body={`We are not rendering state-specific program detail pages for ${stateName} until the statewide source layer is complete enough to support them truthfully.`}
          gapReason={gapReason}
          unavailableMessage={partialStatePolicy.unavailableMessage}
          suppressedFamilies={partialStatePolicy.suppressedFamilies}
        />
      );
    }
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
                  Visit Source Page <Sparkles size={16} />
                </a>
              </div>
            </div>

            {/* Legal Footnotes & Citations block */}
            <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.01)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem' }}>
                Regulatory & Statutory Framework
              </h3>
              <p style={{ margin: 0 }}>
                {softenedLegalDisclaimer}
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
    if (partialStatePolicy) {
      return (
        <PartialStateGate
          stateName={stateName}
          stateId={stateData.id}
          heading={`${stateName} is live only in a partial verification mode`}
          body={`We are keeping the statewide ${stateName} audit surface available, but county, district, city, and other local navigation stays suppressed until the remaining official evidence is reviewable.`}
          gapReason={gapReason}
          unavailableMessage={partialStatePolicy.unavailableMessage}
          suppressedFamilies={partialStatePolicy.suppressedFamilies}
        />
      );
    }
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
            Select your county to check which localized guides are currently published. Where local proof is available, you can review {config.catchmentName} intake lines, {config.medicaidName} options, local school district routing, and advocate listings that remain visible under the current trust policy.
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
              Browse Program Guides & Resources <ArrowRight size={16} />
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
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'county-hub')) {
        return (
          <PartialStateGate
            stateName={stateName}
            stateId={stateData.id}
            heading={`${formatParam(countyId)} County is not yet verified for public local routing`}
            body={`This county page stays available only as a gated placeholder because the ${stateName} launch surface still has unresolved local-proof gaps.`}
            gapReason={gapReason}
            unavailableMessage={partialStatePolicy.unavailableMessage}
            suppressedFamilies={partialStatePolicy.suppressedFamilies}
          />
        );
      }
      const bulkCountyDetails = (await getBulkCountyDetails(stateData.id)).get(countyId);
      const policyCountyDetails = pickCountyPolicyDetails(countyDetails, bulkCountyDetails) || countyDetails;
      const countyFormatted = formatParam(countyId);
      const stateConfig = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
      const countiesList = (await getCounties(stateData.id)).map(c => ({ id: c.id, name: c.name }));
      const wageDisclosure = getIhssWageDisclosure(stateData.id, countyDetails.id, countyDetails.name, countyDetails.ihss_wage_rate ?? null);
      const countyWage = wageDisclosure?.hourlyRate ?? null;
      const countyHubLastVerifiedDate = [
        ...((policyCountyDetails.regionalCenters || []) as Array<any>).map((rc) => rc.last_verified_date).filter(Boolean),
        ...((policyCountyDetails.schoolDistricts || []) as Array<any>).map((sd) => sd.last_verified_date).filter(Boolean),
        ...((policyCountyDetails.countyOffices || []) as Array<any>).map((co) => co.last_verified_date).filter(Boolean)
      ].sort().at(-1) || null;
      const countyHubScores = [
        ...((policyCountyDetails.regionalCenters || []) as Array<any>).map((rc) => normalizeConfidenceScore(rc.confidence_score)).filter((score): score is number => score !== null),
        ...((policyCountyDetails.schoolDistricts || []) as Array<any>).map((sd) => normalizeConfidenceScore(sd.confidence_score)).filter((score): score is number => score !== null),
        ...((policyCountyDetails.countyOffices || []) as Array<any>).map((co) => normalizeConfidenceScore(co.confidence_score)).filter((score): score is number => score !== null)
      ];
      const countyHubConfidenceScore = countyHubScores.length > 0
        ? countyHubScores.reduce((sum, score) => sum + score, 0) / countyHubScores.length
        : null;
      const countyHubPolicy = getSeoPolicyForRoute('county-hub', {
        stateId: stateData.id,
        countyId
      }, {
        entityCount: policyCountyDetails.schoolDistricts?.length || 0,
        hasOfficialSource:
          ((policyCountyDetails.regionalCenters || []) as Array<any>).some((rc) => !!rc.source_url) ||
          ((policyCountyDetails.schoolDistricts || []) as Array<any>).some((sd) => !!sd.source_url) ||
          ((policyCountyDetails.countyOffices || []) as Array<any>).some((co) => !!co.source_url),
        hasRequiredContactInfo: (policyCountyDetails.countyOffices || []).length > 0,
        hasRealLocalAssets:
          (policyCountyDetails.schoolDistricts || []).length > 0 ||
          (policyCountyDetails.countyOffices || []).length > 0 ||
          (policyCountyDetails.regionalCenters || []).length > 0,
        hasNoPlaceholderData: assertNoPlaceholderData(JSON.stringify(policyCountyDetails)),
        lastVerifiedDate: countyHubLastVerifiedDate,
        confidenceScore: countyHubConfidenceScore
      });
      const countyTruth = getCountyTruthEligibility(stateData.id, policyCountyDetails);
      const isIndexable = countyTruth.indexSafe && countyHubPolicy.index;
      const eligibleRegionalCenters = ((policyCountyDetails.regionalCenters || []) as Array<any>).filter(isPublicRecordEligible);
      const eligibleCountyOffices = ((policyCountyDetails.countyOffices || []) as Array<any>).filter(isPublicCountyOfficeEligible);
      const eligibleSchoolDistricts = ((policyCountyDetails.schoolDistricts || []) as Array<any>).filter(isPublicRecordEligible);
      const eligibleSelpas = ((policyCountyDetails.selpas || []) as Array<any>).filter(isPublicRecordEligible);
      const eligibleLocalOrganizations = ((policyCountyDetails.localOrganizations || []) as Array<any>).filter(isPublicDirectoryRecordEligible);
      const publicCountyDetailsForCopy = {
        ...policyCountyDetails,
        regionalCenters: eligibleRegionalCenters,
        countyOffices: eligibleCountyOffices,
        schoolDistricts: eligibleSchoolDistricts,
        selpas: eligibleSelpas,
        localOrganizations: eligibleLocalOrganizations,
      };
      const freshnessSources = [
        ...eligibleRegionalCenters.map((rc) => ({
          name: rc.name,
          url: rc.source_url || undefined,
          lastReviewedDate: rc.last_verified_date,
          verificationStatus: rc.verification_status,
          sourceType: rc.source_type,
          confidenceScore: rc.confidence_score ?? null
        })),
        ...eligibleCountyOffices.map((office) => ({
          name: office.office_name,
          url: office.source_url || undefined,
          lastReviewedDate: office.last_verified_date,
          verificationStatus: office.verification_status,
          sourceType: office.source_type,
          confidenceScore: office.confidence_score ?? null
        })),
        ...eligibleSchoolDistricts.map((district) => ({
          name: district.name,
          url: district.source_url || undefined,
          lastReviewedDate: district.last_verified_date,
          verificationStatus: district.verification_status,
          sourceType: district.source_type,
          confidenceScore: district.confidence_score ?? null
        })),
        ...eligibleSelpas.map((selpa) => ({
          name: selpa.name,
          url: selpa.source_url || undefined,
          lastReviewedDate: selpa.last_verified_date,
          verificationStatus: selpa.verification_status,
          sourceType: selpa.source_type,
          confidenceScore: selpa.confidence_score ?? null
        }))
      ];

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
            name: `Where can I verify the local ${stateData.id === 'california' ? 'IHSS' : 'Medicaid waiver'} provider pay rate in ${countyName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Check the relevant ${stateData.id === 'california' ? 'county social services office and current IHSS materials' : 'state Medicaid waiver materials or local service coordinator'} for the latest provider pay rate information in ${countyName}.`
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
                ? `California families in ${countyName} County should confirm the current Assessment Plan and meeting timelines on the district or California special-education source that applies to their case before relying on a deadline.`
                : `School district response timelines vary by state. Families in ${countyName} should confirm the current evaluation-request deadline and dispute timeline on the official state or district special education source before relying on a date.`
            }
          }
        ]
      };

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          {isIndexable && <SeoSchema data={[faqSchema]} />}
          
          {/* Back button */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link href={`/benefits/${stateData.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>

          {/* Hero Section */}
          <div className="glass-panel" style={{ padding: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.04) 0%, rgba(var(--primary-rgb), 0.01) 100%)', position: 'relative', overflow: 'hidden' }}>
            <div
              className="county-hero-ornament"
              style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, transform: 'scale(1.5)', pointerEvents: 'none' }}
            >
              <MapPin size={200} color="var(--primary-color)" />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
              {stateData.name} County Resource Directory
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {countyDetails.name} County Disability Benefits Guide
            </h1>
            <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.75rem', maxWidth: '850px' }}>
              {formatIntroCopy(getCountyIntroCopy(stateData.id, stateData.name, stateData.code, publicCountyDetailsForCopy as any, countyWage, catchmentLabel))}
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <ContributionModal
                suggestionType="other"
                targetId={countyDetails.id}
                targetName={`${countyDetails.name} County page`}
                buttonLabel="Suggest update"
              />
            </div>
          </div>

          {!countyTruth.publicSafe && (
            <div style={{ marginBottom: '2rem' }}>
              <CountyVerificationPendingBanner countyName={countyDetails.name} />
            </div>
          )}

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
                          sourceUrl={rc.source_url}
                          sourceType={rc.source_type}
                          confidenceScore={rc.confidence_score}
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
                  <LocalVerificationNotice label={`${catchmentLabel} routing`} targetName={`${countyDetails.name} County regional center routing`} />
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
                            sourceUrl={office.source_url}
                            sourceType={office.source_type}
                            confidenceScore={office.confidence_score}
                            entityId={String(office.id)}
                            entityName={office.office_name}
                            entityType="county_office"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <LocalVerificationNotice label="county office contacts" targetName={`${countyDetails.name} County office contacts`} />
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
                            sourceUrl={district.source_url}
                            sourceType={district.source_type}
                            confidenceScore={district.confidence_score}
                            entityId={district.id}
                            entityName={district.name}
                            entityType="school_district"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <LocalVerificationNotice label="district special education routing" targetName={`${countyDetails.name} County school district routing`} suggestionType="district" />
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
                          sourceUrl={selpa.source_url}
                          sourceType={selpa.source_type}
                          confidenceScore={selpa.confidence_score}
                          entityId={selpa.id}
                          entityName={selpa.name}
                          entityType="selpa"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <LocalVerificationNotice label={educationLabel} targetName={`${countyDetails.name} County ${educationLabel}`} suggestionType="district" />
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
                  <LocalVerificationNotice label="local nonprofit support listings" targetName={`${countyDetails.name} County nonprofit support`} />
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
              {wageDisclosure ? (
              <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                  <Calculator size={16} color="var(--primary-color)" /> {countyDetails.name} County IHSS Pay Estimate
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {wageDisclosure.hourlyRate ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Estimated hourly pay:</span>
                      <strong style={{ color: '#10b981' }}>${wageDisclosure.hourlyRate.toFixed(2)}/hour estimate</strong>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-light)' }}>Current county estimate unavailable</div>
                  )}
                  <div style={{ color: 'var(--text-light)', lineHeight: 1.5, borderTop: '1px solid #eee', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                    {wageDisclosure.explanation}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: 1.45 }}>
                    Source: <a href={wageDisclosure.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>{wageDisclosure.sourceLabel}</a><br />
                    Confirm with: <a href={wageDisclosure.officialConfirmUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>{wageDisclosure.officialConfirmLabel.toLowerCase()}</a><br />
                    Last checked: {wageDisclosure.lastVerifiedDate}
                  </div>
                </div>
              </div>
              ) : null}

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

          <SourceFreshnessDisclosure
            sources={
              freshnessSources.length > 0
                ? freshnessSources
                : [
                    {
                      name: `${stateName} local county evidence`,
                      lastReviewedDate: countyHubLastVerifiedDate || null,
                      verificationStatus: 'needs_review'
                    }
                  ]
            }
            correctionSuggestionType="other"
            correctionTargetId={`${stateData.id}-${countyId}-local-surface`}
            correctionTargetName={`${countyFormatted} County benefits surface`}
            correctionButtonLabel="Report a source or routing issue"
          />

        </main>
      );
    }

    // ==========================================
    // CASE 3: Diagnosis Index (/benefits/[diagnosis])
    // ==========================================
    const isDiagnosis = DIAGNOSES.map(slugifyDiagnosis).includes(countyId);
    if (isDiagnosis) {
      const diagnosisFormatted = formatParam(countyId);
      if (partialStatePolicy && isLaunchSurfaceSuppressed(stateData.id, 'condition-hub')) {
        return (
          <PartialStateGate
            stateName={stateName}
            stateId={stateData.id}
            heading={`${diagnosisFormatted} county guides are still being verified in ${stateName}`}
            body={`The statewide ${stateName} audit surface remains visible, but diagnosis-by-county navigation is suppressed until the blocked local evidence families are reverified.`}
            gapReason={gapReason}
            unavailableMessage={partialStatePolicy.unavailableMessage}
            suppressedFamilies={partialStatePolicy.suppressedFamilies}
          />
        );
      }
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
              Select a {stateName} county below to review currently published local special education contacts, {config.catchmentName} intake departments, and {config.personalCareProgram} wage estimates for children with <strong>{diagnosisFormatted}</strong>.
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
      pageDescription = `Navigating developmental care in ${countyFormatted} County. Review currently published Medi-Cal waiver pathways, safety supervision rate estimates, and educational routing for families supporting a child with ${diagnosisFormatted}.`;
      scopeType = 'county';
    } else if (district) {
      countyId = district.county_id;
      countyFormatted = formatParam(countyId);
      districtDetails = district;
      pageTitle = `${diagnosisFormatted} Support at ${district.name}`;
      pageDescription = `Review district special education routing, planning prompts, and current public school-support links for students with ${diagnosisFormatted} in ${district.name}.`;
      scopeType = 'district';
    } else if (city) {
      countyId = city.countyId;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Services in ${city.name}, ${stateCode}`;
      pageDescription = `Review gated local guidance for ${diagnosisFormatted} in ${city.name}, including current county-linked public benefit and school-support routes when they are available.`;
      scopeType = 'city';
    } else {
      notFound();
    }

    if (partialStatePolicy) {
      const blockedSurface =
        (scopeType === 'county' && isLaunchSurfaceSuppressed(stateData.id, 'county-condition')) ||
        (scopeType === 'district' && isLaunchSurfaceSuppressed(stateData.id, 'school-district')) ||
        (scopeType === 'city' && isLaunchSurfaceSuppressed(stateData.id, 'city'));

      if (blockedSurface) {
        const surfaceLabel =
          scopeType === 'district'
            ? `${district?.name || 'This district'} local education routing`
            : scopeType === 'city'
              ? `${city?.name || 'This city'} local guide`
              : `${countyFormatted} County local guide`;

        return (
          <PartialStateGate
            stateName={stateName}
            stateId={stateData.id}
            heading={`${surfaceLabel} is not yet verified`}
            body={`This ${scopeType}-level surface is intentionally suppressed while ${stateName} remains in a partial launch mode. We only reopen local pages after the blocked official evidence families are reverified.`}
            gapReason={gapReason}
            unavailableMessage={partialStatePolicy.unavailableMessage}
            suppressedFamilies={partialStatePolicy.suppressedFamilies}
          />
        );
      }
    }

    // Load County-level details for underlying service models
    const countyData = await getCountyDetails(countyId);
    if (!countyData) {
      notFound();
    }

    const eligibleRegionalCenters = (countyData.regionalCenters || []).filter(isPublicRecordEligible);
    const eligibleSchoolDistricts = (countyData.schoolDistricts || []).filter(isPublicRecordEligible);
    const eligibleCountyOffices = (countyData.countyOffices || []).filter(isPublicCountyOfficeEligible);
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
      const lastVerifiedDate = [
        ...eligibleRegionalCenters.map((rc) => rc.last_verified_date).filter(Boolean),
        ...eligibleSchoolDistricts.map((sd) => sd.last_verified_date).filter(Boolean),
        ...eligibleCountyOffices.map((co) => co.last_verified_date).filter(Boolean)
      ].sort().at(-1) || null;

      const policy = evaluateSeoPolicy({
        routeType: 'county-condition',
        stateId: stateData.id,
        countyId: countyId,
        diagnosisId: diagnosisSlug,
        entityCount: eligibleSchoolDistricts.length,
        confidenceScore: confScore,
        hasOfficialSource,
        lastVerifiedDate,
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
    const ihssWageDisclosure = stateData.id === 'california'
      ? getIhssWageDisclosure(stateData.id, countyData.id, countyData.name, countyData.ihss_wage_rate ?? null)
      : null;
    const displayWage = ihssWageDisclosure?.hourlyRate ?? null;
    const estHours = 283;
    const monthlyPayout = displayWage !== null
      ? (estHours * displayWage).toLocaleString(undefined, { maximumFractionDigits: 0 })
      : null;

    // Localized FAQ Accordion Data
    const localizedFaqs = config.faqs.map(faq => ({
      question: faq.q
        .replace(/\[diagnosis\]/g, diagnosisFormatted)
        .replace(/\[county\]/g, countyFormatted),
      answer: faq.a(countyFormatted, rcName, sdName, displayWage ?? 0, monthlyPayout ?? 'still being verified', diagnosisFormatted)
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
        'image': `${SITE_URL}/avatar-default.png`,
        'telephone': adv.phone,
        'email': adv.email,
        'url': adv.website,
        'areaServed': adv.counties_served || undefined,
        'description': `${adv.name} is a special education IEP advocate with public routing evidence for ${countyFormatted} County. Credentials: ${adv.credentials}. Specialties: ${adv.specialties || 'IEP, Regional Center, Appeals'}.`
      }))
    };

    // Coordinate Map pins compile
    const mapResources: {
      id: string;
      type: 'regional-center' | 'school-board';
      name: string;
      address?: string;
      phone?: string;
      description: string;
      x: number;
      y: number;
    }[] = [];
    if (eligibleRegionalCenters.length > 0) {
      mapResources.push({
        id: 'rc-1',
        type: 'regional-center',
        name: eligibleRegionalCenters[0].name,
        address: eligibleRegionalCenters[0].office_locations || undefined,
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
        address: undefined,
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
            initialWage={displayWage ?? undefined}
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
            Getting a diagnosis for your child is overwhelming, and navigating {stateName}&apos;s service landscape can feel like a full-time job. We compiled practical, source-backed guidance to help you prepare for services for <strong>{diagnosisFormatted}</strong> in <strong>{countyFormatted} County</strong>.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>1. {config.catchmentName} Entitlements</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                Call {eligibleRegionalCenters[0]?.name || `your local ${config.catchmentName}`} intake department to ask about the current intake process and evidence they review. <strong>Pro tip:</strong> Collect pediatrician letters, evaluations, and developmental-history records before your intake call. The agency may ask for evidence of substantial functional impact before it decides eligibility.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>2. Securing {config.personalCareProgram} Caregiver Wages</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                If {diagnosisFormatted} causes wandering (elopement), self-injury, or other safety hazards, your family may be able to request {config.personalCareProgram} support. <strong>Pro tip:</strong> Start logging dangerous events and caregiver interventions today so you can show the county why supervision or care hours are being requested.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>3. School IEP Tactics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                When dealing with {sdName}, put important requests in writing so you have a dated record. Under {config.timelinesCode}, the district generally has <strong>{config.timelineDaysPlan}</strong> to send an assessment plan. If staff suggest delaying the request, compare that advice against your current state procedural safeguards before relying on it.
              </p>
            </div>

            {stateData.id === 'california' && (
              <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>4. CCS Medical Support</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                  For medical fragility, clinical therapy, or custom equipment, review California Children&apos;s Services (CCS). In {countyFormatted} County, children may be able to access school-based Medical Therapy Units (MTUs) for occupational and physical therapy when they meet the local CCS criteria. <strong>Pro tip:</strong> Confirm the current financial and clinical rules with your county CCS office before relying on a funding assumption.
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
              The following programs include source-backed eligibility or routing details that may be relevant for <strong>{diagnosisFormatted}</strong>. Final eligibility still depends on the current agency review.
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
                          Source Page ↗
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

              {ihssWageDisclosure ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{config.personalCareProgram} Rate Estimate</strong>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {displayWage !== null ? `$${displayWage.toFixed(2)}/hour estimate` : 'Still being verified'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.4rem' }}>
                    {ihssWageDisclosure.explanation}
                  </span>
                  <div style={{ background: 'rgba(0,0,0,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.72rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                    <p style={{ margin: '0 0 0.4rem 0' }}>
                      <strong>Assumptions & Estimates:</strong> Any monthly payout estimate is based on a full-hour ceiling and should be treated as an estimate only. Approved hours depend on the county assessment and the individual care plan.
                    </p>
                    <p style={{ margin: '0 0 0.4rem 0' }}>
                      <strong>Source:</strong>{' '}
                      <a href={ihssWageDisclosure.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        {ihssWageDisclosure.sourceLabel}
                      </a>.
                      {' '}Confirm with the{' '}
                      <a href={ihssWageDisclosure.officialConfirmUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                        {ihssWageDisclosure.officialConfirmLabel.toLowerCase()}
                      </a>.
                      {' '}Last checked: {ihssWageDisclosure.lastVerifiedDate}.
                    </p>
                    {monthlyPayout ? (
                      <p style={{ margin: '0 0 0.4rem 0' }}>
                        <strong>Max monthly estimate at 283 hours:</strong> about ${monthlyPayout}.
                      </p>
                    ) : null}
                    <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 600 }}>
                      {ihssWageDisclosure.fallbackUsed
                        ? 'We do not yet have a verified county-specific rate in this dataset. Confirm the current county rate before relying on it.'
                        : 'Actual approved hours, provider setup, and eligibility vary by family and county assessment.'}
                    </p>
                  </div>
                </div>
              ) : null}
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
                  If your child is under three years old, early intervention services (speech, physical therapy, occupational therapy) are administered under the **{config.earlyInterventionLabel}** program. Early intervention is coordinated jointly by developmental agencies and school districts. Families should confirm the current intake, assessment, and service-start timeline on the official program source that applies to their county.
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
                  If the school district violates statutory timelines or denies services you believe are required, you may want to consult a special education attorney or qualified advocate. In some IDEA due process cases, hearing officers or courts may award reasonable attorney&apos;s fees to a prevailing parent under the current law, but families should confirm the present rule, scope, and local procedure before relying on that possibility. Any lawyer or advocate listing here should still be confirmed directly for fit, credentials, fees, and current availability.
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
          <p><strong>Legal Disclaimer & Citations:</strong> This information is compiled for educational, planning, and advocacy support, and does not constitute legal or medical advice. Verification dates reflect the latest source or database review dates shown on this page. Actual eligibility outcomes remain subject to individual agency assessments.</p>
          <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            {softenedLegalDisclaimer}
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
              <p style={{ margin: 0, lineHeight: 1.4, color: '#b45309' }}>The current public-data audit for {stateData.name} is still incomplete. This page is served with a noindex robots policy.</p>
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
