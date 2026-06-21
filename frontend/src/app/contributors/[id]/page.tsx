import { getWritingStyleById, getWritingStyles } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Award, BookOpen, CheckCircle, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const styles = await getWritingStyles();
  return styles.map((style) => ({
    id: style.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const contributor = await getWritingStyleById(p.id);
  if (!contributor) {
    return {
      title: 'Contributor Profile Not Found',
    };
  }

  return {
    title: `${contributor.name} - Special Education Editorial Contributor (2026)`,
    description: `Learn about ${contributor.name}, ${contributor.credentials}. Read about their writing style guidelines, verified advocacy credentials, and publications.`,
  };
}

export default async function ContributorPage({ params }: Props) {
  const p = await params;
  const contributor = await getWritingStyleById(p.id);

  if (!contributor) {
    notFound();
  }

  const signatureVocab = contributor.signature_phrases
    ? (JSON.parse(contributor.signature_phrases) as string[]).slice(0, 6)
    : [];

  const vocabFreq = contributor.vocab_frequency
    ? (JSON.parse(contributor.vocab_frequency) as Record<string, number>)
    : {};

  return (
    <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          href="/" 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: 'var(--text-light)', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', alignItems: 'start' }} className="responsive-grid">
        {/* Main Info Card */}
        <div>
          <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div 
                style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '50%', 
                  background: 'rgba(var(--primary-rgb), 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--primary)'
                }}
              >
                <Award size={32} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{contributor.name}</h1>
                  <CheckCircle size={20} style={{ color: '#10b981' }} />
                </div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', margin: '0.25rem 0 0 0' }}>{contributor.credentials}</p>
              </div>
            </div>

            <p style={{ lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '2rem' }}>
              This editorial profile highlights the stylometric writing parameters and credential verification details for <strong>{contributor.name}</strong>. Their expert guides, legal breakdowns, and resource templates are integrated into Ablefull to support localized parent advocacy.
            </p>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={18} /> Writing Style Analysis & Guidelines
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We programmatically structure our guides using this contributor&apos;s unique writing footprint to match their level of compliance, clarity, and readability.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="responsive-grid">
              <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)' }}>Emotional Tone</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem', textTransform: 'capitalize' }}>
                  {contributor.emotional_tone.replace('-', ' ')}
                </div>
              </div>
              <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.02)', padding: '1.25rem', borderRadius: '16px' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-light)' }}>Avg. Sentence Length</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {contributor.avg_sentence_length} words
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={18} /> Sample Editorial Insight
            </h3>
            <div 
              style={{ 
                fontStyle: 'italic', 
                borderLeft: '4px solid var(--primary)', 
                paddingLeft: '1.5rem', 
                margin: '1rem 0 2rem 0',
                color: 'var(--text-main)',
                lineHeight: '1.6'
              }}
            >
              &ldquo;{contributor.sample_corpus}&rdquo;
            </div>

            {contributor.source_url && (
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Verified Reference Source:</span>
                  <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>{new URL(contributor.source_url).hostname}</p>
                </div>
                <a 
                  href={contributor.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', height: '40px', padding: '0 1.25rem', textDecoration: 'none' }}
                >
                  Visit Publication <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div>
          <div className="glass-panel" style={{ background: 'white', padding: '1.75rem', borderRadius: '24px', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> Signature Vocabulary
            </h3>
            {signatureVocab.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {signatureVocab.map((vocab, idx) => (
                  <span 
                    key={idx} 
                    style={{ 
                      background: 'rgba(var(--primary-rgb), 0.05)', 
                      color: 'var(--primary)', 
                      padding: '0.4rem 0.8rem', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      textTransform: 'capitalize'
                    }}
                  >
                    {vocab}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>No vocabulary signatures loaded yet.</p>
            )}

            {Object.keys(vocabFreq).length > 0 && (
              <>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2rem', marginBottom: '1rem' }}>
                  Word Frequency Analysis
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(vocabFreq).slice(0, 5).map(([word, freq], idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>{word}</span>
                        <span style={{ color: 'var(--text-light)' }}>{freq} instances</span>
                      </div>
                      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            background: 'var(--primary)', 
                            width: `${Math.min(100, (freq / 25) * 100)}%`, 
                            borderRadius: '3px' 
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
