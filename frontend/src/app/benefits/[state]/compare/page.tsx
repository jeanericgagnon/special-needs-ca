import React from 'react';
import { notFound } from 'next/navigation';
import { getStateByIdOrCode, navigatorDb, Program } from '@/lib/db';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import { constructMetadata, generateBreadcrumbsSchema } from '@/lib/seo-helpers';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Scale, FileText } from 'lucide-react';
import SeoSchema from '@/app/components/seo-schema';
import EditorialDisclosure from '@/components/editorial-disclosure';

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

  const isIndexedState = ['california', 'texas', 'florida', 'pennsylvania', 'new-york', 'ohio', 'illinois', 'georgia', 'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho', 'south-carolina', 'north-dakota', 'west-virginia', 'montana', 'colorado', 'louisiana', 'south-dakota', 'alabama', 'wisconsin', 'arkansas', 'oklahoma', 'north-carolina', 'mississippi', 'michigan', 'minnesota', 'indiana', 'nebraska', 'tennessee', 'virginia', 'arizona', 'alaska', 'connecticut', 'delaware', 'hawaii', 'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts', 'missouri', 'nevada', 'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming'].includes(stateData.id);

  return constructMetadata({
    title: `${stateData.name} Special Needs Waiver Programs Comparison (2026)`,
    description: `Compare ${stateData.name} waiver options side-by-side. Analyze income deeming, age criteria, and diagnostic rules for children's programs.`,
    canonicalUrl: `/benefits/${stateData.id}/compare`,
    noIndex: !isIndexedState,
  });
}

// Fetch programs for a specific state
async function getProgramsForState(stateId: string): Promise<any[]> {
  try {
    const rows = await navigatorDb.prepare(`
      SELECT * FROM programs 
      WHERE state_id = ?
    `).all(stateId);
    
    // For each program, query its min/max age rules
    const programsWithRules = [];
    for (const row of rows) {
      const rules = await navigatorDb.prepare(`
        SELECT MIN(min_age_years) as min_age, MAX(max_age_years) as max_age
        FROM program_eligibility_rules
        WHERE program_id = ?
      `).get(row.id);
      
      programsWithRules.push({
        ...row,
        min_age: rules && rules.min_age !== null ? Number(rules.min_age) : 0,
        max_age: rules && rules.max_age !== null ? Number(rules.max_age) : 21,
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
      <SeoSchema data={[breadcrumbList, faqSchema]} />

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
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Program Name</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Target Group</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Age Limit</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 700 }}>Income Rules</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((prog) => (
                    <tr key={prog.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                        <Link href={`/benefits/${stateData.id}/program/${prog.id.toLowerCase()}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                          {prog.name}
                        </Link>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-main)' }}>{prog.who_it_is_for || 'Any diagnosis'}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>{prog.min_age} to {prog.max_age} yrs</td>
                      <td style={{ padding: '1rem 0.5rem', color: 'var(--text-light)' }}>{prog.income_limit || 'Standard Medicaid rules'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <EditorialDisclosure
            agencyName={stateConfig.ddAgency}
            policyCitation={`${stateData.name} State Waiver Manuals`}
            lastReviewedDate="June 2026"
            nextSteps={[
              'Obtain a written pediatric developmental clinical evaluation.',
              'Submit intake applications to the respective county agencies listed in our directories.',
            ]}
          />
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
