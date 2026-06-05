'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronDown, ChevronUp, Lightbulb,
  AlertCircle, CheckCircle2, FileText, Scale, Users, Clock,
  ArrowRight, Info, Landmark, GraduationCap, Heart
} from 'lucide-react';
import { searchArticlesAction } from '../child-actions';
import type { KnowledgeArticle } from '@/lib/db';

interface GuideStep {
  title: string;
  content: string;
  tip?: string;
  warning?: string;
  citation?: string;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'Beginner': { bg: 'rgba(16, 185, 129, 0.08)', color: '#059669', border: 'rgba(16, 185, 129, 0.15)' },
  'Intermediate': { bg: 'rgba(245, 158, 11, 0.08)', color: '#d97706', border: 'rgba(245, 158, 11, 0.15)' },
  'Advanced': { bg: 'rgba(239, 68, 68, 0.08)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.15)' },
};

interface KnowledgeBasePanelProps {
  isSpanish?: boolean;
}

export default function KnowledgeBasePanel({ isSpanish = false }: KnowledgeBasePanelProps) {
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic fetch & search from database
  useEffect(() => {
    let active = true;
    searchArticlesAction(searchQuery).then(res => {
      if (active && res.success && res.articles) {
        setArticles(res.articles);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [searchQuery]);

  const currentGuide = activeGuideId ? articles.find(g => g.id === activeGuideId) : null;

  // Render dynamic lucide icons based on article id
  const renderIcon = (id: string) => {
    switch (id) {
      case 'rc-intake': return <Landmark size={22} />;
      case 'iep-meeting': return <GraduationCap size={22} />;
      case 'ihss-apply': return <Heart size={22} />;
      case 'appeals-guide': return <Scale size={22} />;
      case 'self-determination': return <Users size={22} />;
      default: return <BookOpen size={22} />;
    }
  };

  // Translated difficulty names
  const getDifficultyLabel = (diff: string) => {
    if (isSpanish) {
      if (diff === 'Beginner') return 'Principiante';
      if (diff === 'Intermediate') return 'Intermedio';
      return 'Avanzado';
    }
    return diff;
  };

  return (
    <div className="animate-fade-in">
      {!currentGuide ? (
        <>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} color="var(--primary-color)" />
              {isSpanish ? 'Biblioteca de Guías de Autoayuda' : 'Self-Help Knowledge Base'}
            </h3>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              {isSpanish 
                ? 'Guías paso a paso para navegar los sistemas de apoyo para necesidades especiales en California, redactadas en un lenguaje claro y fundamentadas en la ley.'
                : 'Step-by-step guides on navigating California\'s special needs support systems — written in plain language, backed by law.'}
            </p>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '420px' }}>
              <input
                type="text"
                placeholder={isSpanish ? 'Buscar guías...' : 'Search guides...'}
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setLoading(true);
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 1rem 0.6rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.9rem',
                  background: 'rgba(255,255,255,0.85)',
                  outline: 'none'
                }}
              />
              <BookOpen size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          {/* Loading state indicator */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ margin: '0 auto 1rem', width: '2rem', height: '2rem', border: '3px solid rgba(var(--primary-rgb),0.1)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                {isSpanish ? 'Cargando guías...' : 'Loading guides...'}
              </p>
            </div>
          ) : (
            /* Guide Cards Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {articles.map(guide => {
                const diffStyle = DIFFICULTY_COLORS[guide.difficulty] || DIFFICULTY_COLORS['Beginner'];
                const stepsList = JSON.parse(isSpanish ? guide.steps_json_es : guide.steps_json) as GuideStep[];
                
                return (
                  <button
                    key={guide.id}
                    onClick={() => { setActiveGuideId(guide.id); setExpandedStep(null); }}
                    style={{
                      background: 'rgba(255,255,255,0.85)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px rgba(0,0,0,0.08), 0 0 0 2px ${guide.color}20`;
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Icon + title */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ background: `${guide.color}15`, color: guide.color, padding: '0.65rem', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {renderIcon(guide.id)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                          {isSpanish ? guide.title_es : guide.title}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.4, margin: 0 }}>
                          {isSpanish ? guide.subtitle_es : guide.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', background: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}`, padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                        {getDifficultyLabel(guide.difficulty)}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={11} /> {isSpanish ? guide.read_time_es : guide.read_time}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {stepsList.length} {isSpanish ? 'pasos' : 'steps'}
                      </span>
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: guide.color, fontWeight: 600, fontSize: '0.85rem', marginTop: 'auto' }}>
                      {isSpanish ? 'Leer Guía' : 'Read Guide'} <ArrowRight size={14} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && articles.length === 0 && (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <BookOpen size={36} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p>{isSpanish ? 'No hay guías que coincidan con su búsqueda. Intente con otras palabras clave.' : 'No guides match your search. Try different keywords.'}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Info size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-main)' }}>{isSpanish ? 'Aviso Legal:' : 'Legal Disclaimer:'}</strong>{' '}
              {isSpanish 
                ? 'Estas guías proporcionan información general sobre la educación especial de California y la ley de beneficios por discapacidad. No constituyen asesoría legal. Para su situación específica, consulte con un abogado de educación especial con licencia en California o con un defensor certificado. Los recursos legales gratuitos incluyen '
                : 'These guides provide general information about California special education and disability benefits law. They do not constitute legal advice. For your specific situation, consult a licensed California special education attorney or Board Certified advocate. Free legal resources include '}
              <a href="https://www.disabilityrightsca.org" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>Disability Rights California</a> {isSpanish ? ' y ' : ' and ' }
              <a href="https://www.copaa.org" target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>COPAA</a>.
            </p>
          </div>
        </>
      ) : (
        // Individual Guide View
        <div>
          {/* Back */}
          <button
            onClick={() => { setActiveGuideId(null); setExpandedStep(null); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem', padding: 0 }}
          >
            {isSpanish ? '← Volver a Todas las Guías' : '← Back to All Guides'}
          </button>

          {/* Guide Header */}
          <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.9)', borderTop: `4px solid ${currentGuide.color}` }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ background: `${currentGuide.color}15`, color: currentGuide.color, padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {renderIcon(currentGuide.id)}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {isSpanish ? currentGuide.title_es : currentGuide.title}
                </h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  {isSpanish ? currentGuide.subtitle_es : currentGuide.subtitle}
                </p>
              </div>
            </div>
            {(() => {
              const stepsList = JSON.parse(isSpanish ? currentGuide.steps_json_es : currentGuide.steps_json) as GuideStep[];
              return (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
                  <span style={{ background: DIFFICULTY_COLORS[currentGuide.difficulty].bg, color: DIFFICULTY_COLORS[currentGuide.difficulty].color, border: `1px solid ${DIFFICULTY_COLORS[currentGuide.difficulty].border}`, padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>{getDifficultyLabel(currentGuide.difficulty)}</span>
                  <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> {isSpanish ? currentGuide.read_time_es : currentGuide.read_time}</span>
                  <span style={{ color: 'var(--text-light)' }}>{stepsList.length} {isSpanish ? 'pasos en total' : 'steps total'}</span>
                </div>
              );
            })()}
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(JSON.parse(isSpanish ? currentGuide.steps_json_es : currentGuide.steps_json) as GuideStep[]).map((step, idx) => {
              const isOpen = expandedStep === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel"
                  style={{ padding: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.85)', border: isOpen ? `1px solid ${currentGuide.color}30` : '1px solid var(--glass-border)', transition: 'border 0.2s' }}
                >
                  <button
                    onClick={() => setExpandedStep(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      background: isOpen ? `${currentGuide.color}06` : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      textAlign: 'left',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isOpen ? currentGuide.color : 'rgba(0,0,0,0.05)',
                      color: isOpen ? 'white' : 'var(--text-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, transition: 'all 0.2s'
                    }}>
                      {idx + 1}
                    </div>
                    <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{step.title}</span>
                    {step.citation && (
                      <span style={{ fontSize: '0.7rem', color: currentGuide.color, fontWeight: 600, flexShrink: 0, marginRight: '0.5rem', display: 'none' }} className="citation-badge">{step.citation}</span>
                    )}
                    {isOpen ? <ChevronUp size={18} color="var(--text-light)" /> : <ChevronDown size={18} color="var(--text-light)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-main)', margin: 0 }}>{step.content}</p>

                      {step.citation && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: `${currentGuide.color}08`, border: `1px solid ${currentGuide.color}20`, borderRadius: '6px', padding: '0.3rem 0.6rem', fontSize: '0.75rem', color: currentGuide.color, fontWeight: 600, alignSelf: 'flex-start' }}>
                          <FileText size={12} />
                          {step.citation}
                        </div>
                      )}

                      {step.tip && (
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                          <Lightbulb size={16} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6366f1', display: 'block', marginBottom: '0.2rem' }}>{isSpanish ? 'CONSEJO PRÁCTICO' : 'PRO TIP'}</span>
                            <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-main)', margin: 0 }}>{step.tip}</p>
                          </div>
                        </div>
                      )}

                      {step.warning && (
                        <div style={{ display: 'flex', gap: '0.75rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
                          <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', display: 'block', marginBottom: '0.2rem' }}>{isSpanish ? 'ADVERTENCIA IMPORTANTE' : 'IMPORTANT WARNING'}</span>
                            <p style={{ fontSize: '0.83rem', lineHeight: 1.5, color: 'var(--text-main)', margin: 0 }}>{step.warning}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom nav */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button
              onClick={() => { setActiveGuideId(null); setExpandedStep(null); }}
              style={{ background: 'none', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '0.6rem 1.25rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}
            >
              {isSpanish ? '← Todas las Guías' : '← All Guides'}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
              <CheckCircle2 size={14} color="#10b981" />
              {isSpanish ? 'Revisado de acuerdo con la ley de California a partir de 2025' : 'Reviewed against California law as of 2025'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
