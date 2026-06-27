import Link from 'next/link';
import SourceFreshnessDisclosure, { type DisclosureSource } from '@/app/components/SourceFreshnessDisclosure';
import ContributionModal from '@/components/contribution-modal';

type LaunchToolLandingProps = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  disclaimer: string;
  sources: DisclosureSource[];
  correctionSuggestionType: 'program' | 'other';
};

export default function LaunchToolLanding({
  eyebrow,
  title,
  description,
  bullets,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  disclaimer,
  sources,
  correctionSuggestionType,
}: LaunchToolLandingProps) {
  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(255,255,255,0.94) 100%)',
            border: '1px solid rgba(var(--primary-rgb), 0.15)'
          }}
        >
          <span
            style={{
              display: 'inline-block',
              marginBottom: '0.75rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--primary-color)'
            }}
          >
            {eyebrow}
          </span>
          <h1 style={{ fontSize: '2.4rem', margin: '0 0 1rem 0' }}>{title}</h1>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-light)', margin: '0 0 1.5rem 0' }}>
            {description}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Link href={primaryCtaHref} className="btn-primary" style={{ width: 'auto', padding: '0.9rem 1.25rem' }}>
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.9rem 1.25rem',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: 600,
                color: 'var(--text-main)',
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.75)'
              }}
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </section>

        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'rgba(255,255,255,0.94)' }}>
          <h2 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>What this page helps you do</h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'grid', gap: '0.7rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section
          className="glass-panel"
          style={{
            padding: '1.5rem 1.75rem',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.18)'
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#92400e' }}>Important note</strong>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#92400e' }}>{disclaimer}</p>
        </section>

        <SourceFreshnessDisclosure sources={sources} />

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ContributionModal
            suggestionType={correctionSuggestionType}
            targetId={null}
            targetName={title}
            buttonLabel="Report a correction"
          />
        </div>
      </div>
    </main>
  );
}
