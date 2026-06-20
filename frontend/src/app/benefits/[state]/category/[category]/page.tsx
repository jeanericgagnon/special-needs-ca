import React from 'react';
import { notFound } from 'next/navigation';
import { getStateByIdOrCode, getAllStates, navigatorDb, Program } from '@/lib/db';
import { getDynamicStateConfig } from '@/lib/stateConfigs';
import { constructMetadata, generateBreadcrumbsSchema, CATEGORY_LABELS } from '@/lib/seo-helpers';
import Link from 'next/link';
import { ArrowLeft, Landmark, Heart, ShieldAlert } from 'lucide-react';
import SeoSchema from '@/app/components/seo-schema';
import EditorialDisclosure from '@/components/editorial-disclosure';
import { evaluateSeoPolicy, robotsForPolicy, assertNoPlaceholderData, normalizeConfidenceScore } from '@/lib/seo-policy';


type Props = {
  params: Promise<{ state: string; category: string }>;
};

// Pre-render categories for all states
export async function generateStaticParams() {
  const states = await getAllStates();
  const categories = Object.keys(CATEGORY_LABELS);
  const paramsList: { state: string; category: string }[] = [];

  for (const s of states) {
    for (const cat of categories) {
      paramsList.push({
        state: s.id,
        category: cat,
      });
    }
  }
  return paramsList;
}

// Generate organic SEO metadata
export async function generateMetadata({ params }: Props) {
  const { state, category } = await params;
  const stateData = await getStateByIdOrCode(state);
  const categoryLabel = CATEGORY_LABELS[category];

  if (!stateData || !categoryLabel) {
    return {
      title: 'Category Page Not Found',
    };
  }

  const programs = await getProgramsForCategory(stateData.id, category);

  const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
  const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
  const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;
  const hasOfficialSource = programs.length > 0 && programs.some(p => !!p.official_source_url);
  const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

  const policy = evaluateSeoPolicy({
    routeType: 'category-hub',
    stateId: stateData.id,
    entityCount: programs.length,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData
  });

  return constructMetadata({
    title: `${categoryLabel} Programs in ${stateData.name} | Ablefull`,
    description: policy.index
      ? `Browse verified guides, application procedures, and local resources for ${categoryLabel.toLowerCase()} programs in ${stateData.name}.`
      : `Browse available program records for ${categoryLabel.toLowerCase()} in ${stateData.name}. Listings are pending official verification.`,
    canonicalUrl: `/benefits/${stateData.id}/category/${category}`,
    robots: robotsForPolicy(policy),
  });
}

interface CategoryProgram {
  id: string | number;
  name: string;
  description: string | null;
  who_it_is_for: string | null;
  who_might_qualify: string | null;
  official_source_url?: string | null;
  confidence_score?: number | null;
  last_verified_date?: string | null;
}

// Fetch programs for a specific state and category
async function getProgramsForCategory(stateId: string, category: string): Promise<CategoryProgram[]> {
  try {
    const rows = await navigatorDb.prepare(`
      SELECT * FROM programs 
      WHERE state_id = ? AND LOWER(category) = ?
    `).all(stateId, category.toLowerCase()) as CategoryProgram[];
    return rows;
  } catch (err) {
    console.error('Error querying programs by category:', err);
    return [];
  }
}

export default async function BenefitCategoryPage({ params }: Props) {
  const { state, category } = await params;
  const stateData = await getStateByIdOrCode(state);
  const categoryLabel = CATEGORY_LABELS[category];

  if (!stateData || !categoryLabel) {
    notFound();
  }

  const stateConfig = getDynamicStateConfig(stateData.id, stateData.name, stateData.code);
  const programs = await getProgramsForCategory(stateData.id, category);

  const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
  const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
  const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
  const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;
  const hasOfficialSource = programs.length > 0 && programs.some(p => !!p.official_source_url);
  const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

  const policy = evaluateSeoPolicy({
    routeType: 'category-hub',
    stateId: stateData.id,
    entityCount: programs.length,
    confidenceScore,
    hasOfficialSource,
    lastVerifiedDate,
    hasNoPlaceholderData
  });

  // Generate structured schemas
  const breadcrumbList = generateBreadcrumbsSchema([
    { name: 'Home', item: '/' },
    { name: 'Guides', item: `/benefits` },
    { name: stateData.name, item: `/benefits/${stateData.id}` },
    { name: categoryLabel, item: `/benefits/${stateData.id}/category/${category}` },
  ]);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <SeoSchema data={[breadcrumbList]} />

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
          background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.04) 0%, rgba(var(--primary-rgb), 0.01) 100%)',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
          Resource Category Directory
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
          {categoryLabel} in {stateData.name}
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '0.75rem', maxWidth: '850px', lineHeight: '1.6' }}>
          {policy.index ? (
            `Explore state-verified eligibility guidelines, pediatric diagnostic requirements, and application procedures for ${categoryLabel.toLowerCase()} programs in ${stateData.name}.`
          ) : (
            `Browse available program records for this category. Pages are indexed only after official source verification and completeness checks pass.`
          )}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'flex-start' }} className="answer-grid-layout">
        
        {/* Left Column: Programs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {programs.length === 0 ? (
              <div
                className="glass-panel"
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '16px',
                }}
              >
                <ShieldAlert size={40} color="var(--primary-color)" style={{ margin: '0 auto 1rem auto' }} />
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.95rem' }}>
                  No programs currently listed in the {categoryLabel.toLowerCase()} category for {stateData.name} in our database.
                </p>
              </div>
            ) : (
              programs.map((prog) => (
                <div
                  key={prog.id}
                  className="glass-panel animate-hover"
                  style={{
                    padding: '2rem',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                        <Link href={`/benefits/${stateData.id}/program/${String(prog.id).toLowerCase()}`} style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
                          {prog.name}
                        </Link>
                      </h2>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-color)', display: 'block', marginTop: '0.25rem' }}>
                        ID: {String(prog.id).toUpperCase()}
                      </span>
                    </div>

                    <Link href={`/benefits/${stateData.id}/program/${String(prog.id).toLowerCase()}`} style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          background: 'var(--primary-color)',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1.25rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(var(--primary-rgb), 0.15)',
                        }}
                      >
                        View Guide →
                      </button>
                    </Link>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0, lineHeight: '1.5' }}>
                    {prog.description || 'Verified developmental wavier program.'}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', background: '#fafafa', padding: '1rem', borderRadius: '12px', border: '1px solid #f0f0f0', fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-light)', display: 'block' }}>Who It Is For:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{prog.who_it_is_for || 'Eligible kids & teens'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)', display: 'block' }}>Clinical Path:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{prog.who_might_qualify || 'Required diagnosis'}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Evaluate policy for rendering EditorialDisclosure */}
          {(() => {
            const dates = programs.map(p => p.last_verified_date).filter((d): d is string => !!d);
            const lastVerifiedDate = dates.length > 0 ? dates.reduce((min, d) => d < min ? d : min, dates[0]) : null;
            const scores = programs.map(p => normalizeConfidenceScore(p.confidence_score)).filter((s): s is number => s !== null);
            const confidenceScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : null;
            const hasOfficialSource = programs.length > 0 && programs.some(p => !!p.official_source_url);
            const hasNoPlaceholderData = programs.every(p => assertNoPlaceholderData(JSON.stringify(p)));

            const policy = evaluateSeoPolicy({
              routeType: 'category-hub',
              stateId: stateData.id,
              entityCount: programs.length,
              confidenceScore,
              hasOfficialSource,
              lastVerifiedDate,
              hasNoPlaceholderData
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
                  'Locate your county intake contacts using our directory search.',
                  'Schedule a screening assessment with the local office.',
                ]}
              />
            );
          })()}
        </div>

        {/* Right Column: Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <Heart size={16} color="var(--primary-color)" /> Trusted Directory
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: 0 }}>
              Ablefull is a community-driven special needs navigator. We do not charge families for directory access. All listings are curated against official public directories.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.75rem 0', color: 'var(--text-main)' }}>Waiver Programs</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
              Want to see all waiver programs compared side-by-side? Review rules, ages, and income ceilings.
            </p>
            <Link href={`/benefits/${stateData.id}/compare`} style={{ textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  fontSize: '0.8rem',
                  height: '36px',
                  background: 'white',
                  color: 'var(--primary-color)',
                  border: '1px solid var(--primary-color)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Compare Waivers Matrix →
              </button>
            </Link>
          </div>

        </div>

      </div>
    </main>
  );
}
