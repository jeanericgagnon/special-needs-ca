/**
 * StateCoverageBadge
 *
 * Renders an honest public-facing coverage classification label on every
 * state hub page so users (and crawlers) understand the depth of data
 * behind each state.
 *
 * Classifications:
 *   launch_depth → States with the deepest current public launch coverage.
 *                  This still does not imply exhaustive county-by-county completeness.
 *   pilot        → All other states. Source-backed pilot coverage.
 *                  Priority states have stronger state and local routing depth.
 *                  Remaining states focus on statewide routing and high-trust guides.
 */

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

// States with the deepest current public launch coverage.
// This label is intentionally narrower than "exhaustive" because some
// local county families still remain gated while review continues.
const EXHAUSTIVE_STATES = new Set(['california']);

const PRIORITY_PILOT_STATES = new Set([
  'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia',
  'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho',
  'south-carolina', 'north-dakota', 'west-virginia', 'montana', 'colorado', 'louisiana', 'south-dakota', 'alabama', 'wisconsin', 'arkansas', 'oklahoma', 'north-carolina', 'mississippi', 'michigan', 'minnesota', 'indiana', 'nebraska', 'tennessee', 'virginia',
  'arizona', 'alaska', 'connecticut', 'delaware', 'hawaii', 'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts', 'missouri', 'nevada', 'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming'
]);

export type CoverageLevel = 'launch_depth' | 'pilot';

export function getStateCoverageLevel(stateId: string): CoverageLevel {
  return EXHAUSTIVE_STATES.has(stateId.toLowerCase()) ? 'launch_depth' : 'pilot';
}

interface StateCoverageBadgeProps {
  stateId: string;
  stateName: string;
}

export function StateCoverageBadge({ stateId, stateName }: StateCoverageBadgeProps) {
  const isPriority = PRIORITY_PILOT_STATES.has(stateId.toLowerCase());
  const isLaunchDepth = EXHAUSTIVE_STATES.has(stateId.toLowerCase());

  if (isLaunchDepth) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          color: '#16a34a',
          borderRadius: '20px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <ShieldCheck size={12} />
        Deep Reviewed Coverage
      </div>
    );
  }

  // All 49 non-CA states are pilot states
  const subLabel = isPriority
    ? `Priority counties in ${stateName} include source-backed agency routing, waiver guidance, and school district or regional education records. Some local needs still route through statewide locator pages instead of direct office listings.`
    : `${stateName} currently emphasizes statewide DD or Medicaid routing, federal program guides, and early intervention references. Local county needs may still route through statewide locator pages while local evidence is being expanded.`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          color: '#2563eb',
          borderRadius: '20px',
          padding: '0.3rem 0.75rem',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        <Sparkles size={12} />
        Source-Backed Pilot Coverage
      </div>
      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', maxWidth: '540px', lineHeight: 1.4 }}>
        {subLabel}
      </span>
    </div>
  );
}
