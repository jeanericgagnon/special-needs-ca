'use client';

import React, { useState, useEffect } from 'react';
import { 
  Copy, FileText, MapPin, Phone, Printer, 
  Sparkles, AlertCircle, FileCheck, HelpCircle, ArrowRight, 
  Download, FileDown, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { SEOPageData, SEO_CLUSTERS } from '@/lib/seo-data';
import { fetchCountyDetailsAction } from '../actions';
import SourceFreshnessDisclosure from './SourceFreshnessDisclosure';

interface CountyDetailsType {
  id: string;
  name: string;
  website: string;
  ihss_wage_rate?: number;
  medi_cal_plans?: string;
  countyOffices?: {
    id: string;
    county_id: string;
    program_id: string;
    office_name: string;
    address: string;
    phone: string;
    email: string | null;
    website: string;
  }[];
  regionalCenters?: {
    id: string;
    name: string;
    website: string;
    counties_served: string;
    catchment_boundaries: string;
    intake_phone: string;
    early_start_contact: string;
    lanterman_intake_contact: string;
  }[];
}

interface AnswerPageProps {
  data?: SEOPageData;
  slug?: string;
  counties: { id: string; name: string }[];
}

export default function AnswerPage({ data: propData, slug, counties }: AnswerPageProps) {
  const data = propData || (slug ? SEO_CLUSTERS[slug] : null);
  if (!data) {
    throw new Error(`AnswerPage: data or slug must be provided. Slug: ${slug}`);
  }
  // Client state
  const [selectedCounty, setSelectedCounty] = useState<string>('los-angeles');
  const [countyDetails, setCountyDetails] = useState<CountyDetailsType | null>(null);
  const [loadingCounty, setLoadingCounty] = useState<boolean>(false);
  
  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  // Checklist state
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  // Script customization
  const [parentNameInput, setParentNameInput] = useState<string>('');
  const [childNameInput, setChildNameInput] = useState<string>('');
  const [childDobInput, setChildDobInput] = useState<string>('');
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Letter generator inputs
  const [letterInputs, setLetterInputs] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    if (data.letterTemplate) {
      data.letterTemplate.fields.forEach(field => {
        defaults[field.key] = field.defaultValue || '';
      });
    }
    return defaults;
  });
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);

  // React official state reset inline pattern
  const [prevSlug, setPrevSlug] = useState<string>(data.slug);
  if (data.slug !== prevSlug) {
    setPrevSlug(data.slug);
    const defaults: Record<string, string> = {};
    if (data.letterTemplate) {
      data.letterTemplate.fields.forEach(field => {
        defaults[field.key] = field.defaultValue || '';
      });
    }
    setLetterInputs(defaults);
    setGeneratedLetter('');
    setQuizAnswers({});
    setShowQuizResult(false);
    setCheckedDocs({});
  }

  // Load county details when selected county changes
  useEffect(() => {
    async function loadCounty() {
      setLoadingCounty(true);
      try {
        const details = await fetchCountyDetailsAction(selectedCounty);
        setCountyDetails(details as CountyDetailsType);
      } catch (err) {
        console.error('Failed to load county details', err);
      } finally {
        setLoadingCounty(false);
      }
    }
    loadCounty();
  }, [selectedCounty]);

  // Calculate likelihood from quiz
  const getQuizScore = () => {
    let highCount = 0;
    let medCount = 0;
    
    Object.entries(quizAnswers).forEach(([qIdx, oIdx]) => {
      const option = data.eligibilityQuiz[Number(qIdx)]?.options[oIdx];
      if (option?.score === 'high') highCount++;
      if (option?.score === 'med') medCount++;
    });

    if (highCount >= 1) return { score: 'High Likelihood', color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' };
    if (medCount >= 1) return { score: 'Moderate Likelihood', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' };
    return { score: 'Low/Incomplete Data', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' };
  };

  const handleCopyScript = () => {
    let scriptText = data.callScriptTemplate.script;
    
    // Replace script placeholders dynamically
    const pName = parentNameInput || '[Parent Name]';
    const cName = childNameInput || '[Child Name]';
    const dob = childDobInput || '[DOB]';
    const cPhone = countyDetails?.countyOffices?.[0]?.phone || '[County Phone]';

    scriptText = scriptText
      .replace(/\[Parent Name\]/g, pName)
      .replace(/\[Child Name\]/g, cName)
      .replace(/\[DOB\]/g, dob)
      .replace(/\[County Phone\]/g, cPhone);

    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleGenerateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.letterTemplate) {
      const text = data.letterTemplate.generateFn(letterInputs);
      setGeneratedLetter(text);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const toggleDocChecked = (name: string) => {
    setCheckedDocs(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Breadcrumb path navigation */}
      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link href="/benefits" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Guides & Resources</Link>
        <ChevronRight size={12} />
        <span style={{ textTransform: 'capitalize' }}>{data.category}</span>
        <ChevronRight size={12} />
        <span>{data.slug}</span>
      </div>

      {/* Structured SEO Page Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'flex-start' }} className="answer-grid-layout">
        
        {/* LEFT COLUMN: Deep content panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header section */}
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
              {data.title}
            </h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-light)', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1rem' }}>
              <span>Verified Source: <strong style={{ color: 'var(--text-main)' }}>{data.officialSources[0]?.name || 'CA State Policy'}</strong></span>
              <span>•</span>
              <span>Last Reviewed: <strong style={{ color: 'var(--text-main)' }}>{data.lastReviewedDate}</strong></span>
            </div>
          </div>

          {/* Quick Answer Callout */}
          <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.03) 0%, rgba(var(--primary-rgb), 0.01) 100%)', borderLeft: '4px solid var(--primary-color)', padding: '1.5rem', borderRadius: '16px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
              <CheckCircle2 size={18} /> Quick Answer
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {data.quickAnswer}
            </p>
          </div>

          {/* Visual TL;DR card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {data.tldrPoints.map((pt, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.5)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>{pt.label}</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{pt.value}</strong>
              </div>
            ))}
          </div>

          {/* When this matters */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>When This Matters</h2>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-light)', margin: 0 }}>
              {data.whenThisMatters}
            </p>
          </div>

          {/* Signs this may apply */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>Signs This May Apply</h2>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.signsThisMayApply.map((sign, idx) => (
                <li key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                  {sign}
                </li>
              ))}
            </ul>
          </div>

          {/* What to do first */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)' }}>What to Do First</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {data.whatToDoFirst.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '24px', height: '24px', background: 'rgba(var(--primary-rgb), 0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {idx + 1}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0, paddingTop: '2px', lineHeight: '1.4' }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Document evidence tracker */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.7)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileCheck size={18} color="var(--primary-color)" /> Documents & Evidence to Gather
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
              Check off the items you already have to build your custom document packet.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {data.documentsToGather.map((doc, idx) => (
                <label key={idx} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={!!checkedDocs[doc.name]} 
                    onChange={() => toggleDocChecked(doc.name)} 
                    style={{ marginTop: '3px', accentColor: 'var(--primary-color)' }}
                  />
                  <div>
                    <strong style={{ color: 'var(--text-main)', textDecoration: checkedDocs[doc.name] ? 'line-through' : 'none' }}>{doc.name}</strong>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-light)' }}>{doc.description}</span>
                    {doc.downloadUrl && (
                      <a href={doc.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none', marginTop: '0.2rem', fontSize: '0.75rem' }}>
                        Download Official Form <Download size={10} />
                      </a>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Common Mistakes / Parent Traps */}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={18} color="#f59e0b" /> Common Mistakes to Avoid
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.commonMistakes.map((mistake, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', background: 'rgba(245, 158, 11, 0.02)', border: '1px solid rgba(245, 158, 11, 0.08)', padding: '0.85rem', borderRadius: '8px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 800 }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
                    {mistake}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Internal related guides for authority */}
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Related Guides & Resources</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {data.relatedGuides.map((guide, idx) => (
                <Link key={idx} href={guide.url} className="nav-btn-signup" style={{ background: 'rgba(var(--primary-rgb),0.05)', color: 'var(--primary-color)', border: '1px solid rgba(var(--primary-rgb),0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                  {guide.title} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          {/* Source Footer references */}
          <SourceFreshnessDisclosure sources={data.officialSources.map(src => ({
            name: src.name,
            url: src.url,
            lastReviewedDate: data.lastReviewedDate,
            verificationStatus: 'official_verified'
          }))} />

        </div>

        {/* RIGHT COLUMN: Interactive sidebar widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }} className="answer-sidebar">
          
          {/* County Lookup Widget */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <MapPin size={16} color="var(--primary-color)" /> County Office Lookup
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>Select California County</label>
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.1)',
                    background: 'white',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {counties.map(c => (
                    <option key={c.id} value={c.id}>{c.name} County</option>
                  ))}
                </select>
              </div>

              {loadingCounty ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Querying county database...</div>
              ) : countyDetails ? (
                <div style={{ background: 'white', border: '1px solid #eee', padding: '0.85rem', borderRadius: '10px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }} className="animate-fade-in">
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>📍 Local Resources:</span>
                  
                  {countyDetails.ihss_wage_rate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f6f6f6', paddingBottom: '0.25rem' }}>
                      <span>County IHSS Wage:</span>
                      <strong style={{ color: '#10b981' }}>${countyDetails.ihss_wage_rate.toFixed(2)}/hr</strong>
                    </div>
                  )}

                  {countyDetails.countyOffices && countyDetails.countyOffices.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Office: {countyDetails.countyOffices[0].office_name}</span>
                      <span style={{ color: 'var(--text-light)' }}>Address: {countyDetails.countyOffices[0].address}</span>
                      <a href={`tel:${countyDetails.countyOffices[0].phone}`} style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600, textDecoration: 'none', marginTop: '0.1rem' }}>
                        <Phone size={11} /> {countyDetails.countyOffices[0].phone}
                      </a>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-light)' }}>No local office contacts in DB.</span>
                  )}

                  {countyDetails.regionalCenters && countyDetails.regionalCenters.length > 0 && (
                    <div style={{ borderTop: '1px solid #f6f6f6', paddingTop: '0.4rem', marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Regional Center:</span>
                      <span>{countyDetails.regionalCenters[0].name}</span>
                      <a href={`tel:${countyDetails.regionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>
                        📞 Intake: {countyDetails.regionalCenters[0].intake_phone}
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Eligibility Screener Quiz */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <HelpCircle size={16} color="var(--primary-color)" /> Mini-Screener Check
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
              Answer these questions to check likelihood.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {data.eligibilityQuiz.map((q, qIdx) => (
                <div key={qIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{q.question}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.75rem', cursor: 'pointer', background: quizAnswers[qIdx] === oIdx ? 'rgba(var(--primary-rgb),0.05)' : 'white', padding: '0.35rem 0.5rem', borderRadius: '6px', border: quizAnswers[qIdx] === oIdx ? '1px solid var(--primary-color)' : '1px solid #ddd' }}>
                        <input 
                          type="radio" 
                          name={`quiz-${qIdx}`} 
                          checked={quizAnswers[qIdx] === oIdx} 
                          onChange={() => {
                            setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                            setShowQuizResult(true);
                          }}
                          style={{ accentColor: 'var(--primary-color)' }}
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {showQuizResult && (
                <div style={{ background: getQuizScore().bg, padding: '0.75rem', borderRadius: '8px', border: '1px solid', borderColor: getQuizScore().color }} className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    <span>Estimated Likelihood:</span>
                    <span style={{ color: getQuizScore().color }}>{getQuizScore().score}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', lineHeight: '1.3' }}>
                    {quizAnswers[0] !== undefined && data.eligibilityQuiz[0]?.options[quizAnswers[0]]?.reason}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Call Script Customizer */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
              <Phone size={16} color="var(--primary-color)" /> Intake Phone Script
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input 
                type="text" 
                placeholder="Parent Name" 
                value={parentNameInput} 
                onChange={(e) => setParentNameInput(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.75rem' }}
              />
              <input 
                type="text" 
                placeholder="Child&apos;s Name" 
                value={childNameInput} 
                onChange={(e) => setChildNameInput(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.75rem' }}
              />
              <input 
                type="text" 
                placeholder="Child&apos;s DOB (e.g. 10/12/2021)" 
                value={childDobInput} 
                onChange={(e) => setChildDobInput(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.75rem' }}
              />
            </div>

            <button 
              onClick={handleCopyScript}
              className="btn-primary"
              style={{ width: '100%', fontSize: '0.75rem', height: '32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
            >
              <Copy size={12} /> {copiedScript ? 'Script Copied!' : 'Copy Filled Script'}
            </button>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', display: 'block', marginTop: '0.3rem', textAlign: 'center' }}>
              {data.callScriptTemplate.intro}
            </span>
          </div>

          {/* Letter Template Generator */}
          {data.letterTemplate && (
            <div className="glass-panel" style={{ padding: '1.25rem', background: '#fafafa', border: '1px solid #eee' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)' }}>
                <FileText size={16} color="var(--primary-color)" /> {data.letterTemplate.title}
              </h3>
              
              <form onSubmit={handleGenerateLetter} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.letterTemplate.fields.map(field => (
                  <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-light)' }}>{field.label}</label>
                    <input 
                      type="text" 
                      placeholder={field.placeholder}
                      value={letterInputs[field.key] || ''}
                      onChange={(e) => setLetterInputs(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ padding: '0.35rem 0.5rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.75rem' }}
                    />
                  </div>
                ))}

                <button 
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', fontSize: '0.75rem', height: '32px', marginTop: '0.4rem' }}
                >
                  Generate Request Letter
                </button>
              </form>

              {generatedLetter && (
                <div style={{ marginTop: '0.75rem' }} className="animate-fade-in">
                  <textarea
                    readOnly
                    value={generatedLetter}
                    style={{ width: '100%', height: '120px', fontSize: '0.7rem', fontFamily: 'monospace', padding: '0.4rem', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }}
                  />
                  <button 
                    onClick={handleCopyLetter}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '0.75rem', height: '30px', background: '#10b981', marginTop: '0.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  >
                    <Copy size={11} /> {copiedLetter ? 'Letter Copied!' : 'Copy Completed Letter'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Packet Print CTA */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <FileDown size={16} /> Saved Action Packet
            </h4>
            <p style={{ fontSize: '0.72rem', opacity: 0.9, marginBottom: '0.85rem', lineHeight: '1.3' }}>
              Save this guide, your completed letter, and your custom document checklist in a print-ready PDF packet.
            </p>
            <button 
              onClick={handlePrint}
              style={{
                width: '100%', 
                fontSize: '0.78rem', 
                height: '34px', 
                background: 'white', 
                color: 'var(--primary-color)', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem'
              }}
            >
              <Printer size={13} /> Print/Save Action Packet
            </button>
          </div>

          {/* Non-forced Onboarding Wizard CTA Bridge */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(var(--primary-rgb),0.15)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={14} color="var(--primary-color)" /> Need a full assessment?
            </h4>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginBottom: '0.75rem', lineHeight: '1.3' }}>
              Answer 5 quick questions about your child&apos;s age & diagnosis to build a personalized benefit profile and automatically map all eligibility rules.
            </p>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button 
                className="btn-primary" 
                style={{ width: '100%', fontSize: '0.72rem', height: '30px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.2' }}
              >
                Start Eligibility Wizard <ArrowRight size={12} />
              </button>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
