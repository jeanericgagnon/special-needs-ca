import React from 'react';
import { notFound } from 'next/navigation';
import { getStateByIdOrCode, navigatorDb, Program } from '@/lib/db';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import { constructMetadata, generateBreadcrumbsSchema } from '@/lib/seo-helpers';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Scale, FileText } from 'lucide-react';
import SeoSchema from '@/app/components/seo-schema';
import EditorialDisclosure from '@/components/editorial-disclosure';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData, normalizeConfidenceScore } from '@/lib/seo-policy';


type Props = {
  params: Promise<{ state: string }>;
};

// Generate organic SEO metadata
export async function generateMetadata({ params }: Props) {
  const { state } = await params;
  const stateData = await getStateByIdOrCode(state);
  if (!stateData) {
    return {
      title: 'State Comparison Page Not Found',
    };
  }

  const programs = await getProgramsForState(stateData.id);

  const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
  const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
  const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

  const hasOfficialSource = programs.length >= 2 && programs.filter(p => !!p.official_source_url).length >= 2;
  const hasEligibilityRules = programs.filter(p => p.rules_count > 0).length >= 2;
  const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

  const policy = evaluateSeoPolicy({
    routeType: 'comparison',
    stateId: stateData.id,
    entityCount: programs.length,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData,
    hasEligibilityRules
  });

  return constructMetadata({
    title: `${stateData.name} Special Needs Waiver Programs Comparison (2026)`,
    description: `Compare ${stateData.name} waiver options side-by-side. Analyze income deeming, age criteria, and diagnostic rules for children's programs.`,
    canonicalUrl: `/benefits/${stateData.id}/compare`,
    robots: robotsForPolicy(policy),
  });
}

interface ProgramWithRules {
  id: string | number;
  name: string;
  description: string | null;
  who_it_is_for: string | null;
  who_might_qualify: string | null;
  income_limit: string | null;
  official_source_url?: string | null;
  min_age: number;
  max_age: number;
  last_verified_date: string | null;
  confidence_score: number | null;
  rules_count: number;
}

// Fetch programs for a specific state
async function getProgramsForState(stateId: string): Promise<ProgramWithRules[]> {
  try {
    const rows = await navigatorDb.prepare(`
      SELECT * FROM programs 
      WHERE state_id = ?
    `).all(stateId) as Record<string, unknown>[];
    
    // For each program, query its min/max age rules
    const programsWithRules: ProgramWithRules[] = [];
    for (const row of rows) {
      const rules = await navigatorDb.prepare(`
        SELECT COUNT(*) as count, MIN(min_age_years) as min_age, MAX(max_age_years) as max_age
        FROM program_eligibility_rules
        WHERE program_id = ?
      `).get(row.id as string | number) as { count: number; min_age: number | null; max_age: number | null } | undefined;
      
      programsWithRules.push({
        id: row.id as string | number,
        name: row.name as string,
        description: row.description as string | null,
        who_it_is_for: row.who_it_is_for as string | null,
        who_might_qualify: row.who_might_qualify as string | null,
        income_limit: (row.income_limit || 'None specified') as string,
        official_source_url: row.official_source_url as string | null,
        min_age: rules && rules.min_age !== null ? Number(rules.min_age) : 0,
        max_age: rules && rules.max_age !== null ? Number(rules.max_age) : 21,
        last_verified_date: row.last_verified_date as string | null,
        confidence_score: row.confidence_score !== undefined && row.confidence_score !== null ? Number(row.confidence_score) : null,
        rules_count: rules?.count || 0,
      });
    }
    return programsWithRules;
  } catch (err) {
    console.error('Error querying programs by state:', err);
    return [];
  }
}

export default async function StateComparisonPage({ params }: Props) {
  const { state } = await params;
  const stateData = await getStateByIdOrCode(state);
  if (!stateData) {
    notFound();
  }

  const stateConfig = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const programs = await getProgramsForState(stateData.id);

  // Evaluate policy in component body
  const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
  const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
  const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

  const hasOfficialSource = programs.length >= 2 && programs.filter(p => !!p.official_source_url).length >= 2;
  const hasEligibilityRules = programs.filter(p => p.rules_count > 0).length >= 2;
  const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

  const policy = evaluateSeoPolicy({
    routeType: 'comparison',
    stateId: stateData.id,
    entityCount: programs.length,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData,
    hasEligibilityRules
  });

  // Generate structured schemas
  const breadcrumbList = generateBreadcrumbsSchema([
    { name: 'Home', item: '/' },
    { name: 'Guides', item: `/benefits` },
    { name: stateData.name, item: `/benefits/${stateData.id}` },
    { name: 'Program Comparison', item: `/benefits/${stateData.id}/compare` },
  ]);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the difference between waiver programs in ${stateData.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Waiver programs in ${stateData.name} serve different developmental needs. Some are designed specifically for clinical intellectual/developmental delays (e.g., Home and Community-Based Services), while others cover physical care or mental health needs. Income limits and eligibility criteria vary based on the specific waiver.`,
        },
      },
    ],
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <SeoSchema data={policy.index ? [breadcrumbList, faqSchema] : [breadcrumbList]} />

      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href={`/benefits/${stateData.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--primary-color)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to {stateData.name} Guides
        </Link>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: '2.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, rgba(99, 102, 241, 0.01) 100%)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          Waiver Analysis Tools
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          {stateData.name} Waiver Programs Side-by-Side Comparison
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.75rem', maxWidth: '850px', lineHeight: '1.6' }}>
          Compare developmental disability waivers, protective supervision caregiver wages, and special needs programs in {stateData.name}. Use this guide to review age limits, income guidelines, and target diagnostic criteria.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }} className="answer-grid-layout">
        
        {/* Left Column: Comparison Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Scale color="var(--primary-color)" size={20} /> Program Side-by-Side Matrix
            </h2>
            
            {programs.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No waiver programs indexed for {stateData.name} yet.</p>
            ) : (
              <table className="responsive-matrix-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Program Name</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Target Group</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Age Limit</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Income Rules</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Official Source</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Last Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((prog) => (
                    <tr key={prog.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td data-label="Program Name" style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                        <Link href={`/benefits/${stateData.id}/program/${String(prog.id).toLowerCase()}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                          {prog.name}
                        </Link>
                      </td>
                      <td data-label="Target Group" style={{ padding: '1rem 0.5rem', color: 'var(--text-main)' }}>{prog.who_it_is_for || 'Any diagnosis'}</td>
                      <td data-label="Age Limit" style={{ padding: '1rem 0.5rem' }}>{prog.min_age} to {prog.max_age} yrs</td>
                      <td data-label="Income Rules" style={{ padding: '1rem 0.5rem', color: 'var(--text-light)' }}>{prog.income_limit || 'None specified'}</td>
                      <td data-label="Official Source" style={{ padding: '1rem 0.5rem' }}>
                        {prog.official_source_url ? (
                          <a href={prog.official_source_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                            Link
                          </a>
                        ) : (
                          'None'
                        )}
                      </td>
                      <td data-label="Last Verified" style={{ padding: '1rem 0.5rem', color: 'var(--text-light)' }}>
                        {prog.last_verified_date || 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Evaluate policy for rendering EditorialDisclosure */}
          {(() => {
            const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
            const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
            const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
            const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;

            const hasOfficialSource = programs.length >= 2 && programs.filter(p => !!p.official_source_url).length >= 2;
            const hasEligibilityRules = programs.filter(p => p.rules_count > 0).length >= 2;
            const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

            const policy = evaluateSeoPolicy({
              routeType: 'comparison',
              stateId: stateData.id,
              entityCount: programs.length,
              confidenceScore,
              hasOfficialSource,
              lastVerifiedDate,
              hasNoPlaceholderData,
              hasEligibilityRules
            });
            const sourceUrl = programs.find(p => !!p.official_source_url)?.official_source_url || undefined;
            const verificationState = policy.index && sourceUrl ? 'official-verified' : 'unverified';
            return (
              <EditorialDisclosure
                verificationState={verificationState}
                agencyName={stateConfig.ddAgency}
                sourceUrl={sourceUrl}
                lastVerifiedDate={policy.index ? lastVerifiedDate : null}
                nextSteps={[
                  'Obtain a written pediatric developmental clinical evaluation.',
                  'Submit intake applications to the respective county agencies listed in our directories.',
                ]}
              />
            );
          })()}
        </div>

        {/* Right Column: Key Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <ShieldCheck size={16} color="var(--primary-color)" /> Deeming Rule Warning
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
              Many Medicaid waivers waiver parental income deeming rules. This means only the <strong>child&apos;s income</strong> (which is typically $0) is evaluated, making them financially eligible regardless of parental wages.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <FileText size={16} color="var(--primary-color)" /> Application Checklist
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Specialist clinical diagnostic report</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Pediatric occupational/speech therapy evaluations</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Current school district IEP document</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
