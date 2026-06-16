/**
 * StateCoverageBadge
 *
 * Renders an honest public-facing coverage classification label on every
 * state hub page so users (and crawlers) understand the depth of data
 * behind each state.
 *
 * Classifications:
 *   exhaustive → California only. Full county × program × provider matrix.
 *   pilot      → All other 49 states. Source-backed pilot coverage.
 *               Priority states (TX/FL/NY/PA/IL/OH/GA) have priority-county
 *               seeding with verified agencies, waivers, and school districts.
 *               Remaining states include state DD/Medicaid agency routing,
 *               federal program guides, and early intervention resources.
 */

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

// States with full exhaustive launch-grade coverage
const EXHAUSTIVE_STATES = new Set(['california']);

const PRIORITY_PILOT_STATES = new Set([
  'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia',
  'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho',
  'south-carolina', 'north-dakota', 'west-virginia', 'montana', 'colorado', 'louisiana', 'south-dakota', 'alabama', 'wisconsin', 'arkansas', 'oklahoma', 'north-carolina', 'mississippi', 'michigan', 'minnesota', 'indiana', 'nebraska', 'tennessee', 'virginia',
  'arizona', 'alaska', 'connecticut', 'delaware', 'hawaii', 'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts', 'missouri', 'nevada', 'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming'
]);

export type CoverageLevel = 'exhaustive' | 'pilot';

export function getStateCoverageLevel(stateId: string): CoverageLevel {
  return EXHAUSTIVE_STATES.has(stateId.toLowerCase()) ? 'exhaustive' : 'pilot';
}

interface StateCoverageBadgeProps {
  stateId: string;
  stateName: string;
}

export function StateCoverageBadge({ stateId, stateName }: StateCoverageBadgeProps) {
  const isPriority = PRIORITY_PILOT_STATES.has(stateId.toLowerCase());
  const isExhaustive = EXHAUSTIVE_STATES.has(stateId.toLowerCase());

  if (isExhaustive) {
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
        Exhaustive Launch-Grade Coverage
      </div>
    );
  }

  // All 49 non-CA states are pilot states
  const subLabel = isPriority
    ? `Priority counties in ${stateName} are seeded with verified state agency data, waiver programs, and school district records. Some local resources use statewide locator routing rather than direct office listings.`
    : `${stateName} includes state DD/Medicaid agency routing, federal program guides, and early intervention resources. Local county resources route to the statewide ${stateName} service locator.`;

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
