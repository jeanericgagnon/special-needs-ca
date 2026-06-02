'use client';

import { useState } from 'react';
import { 
  ShieldCheck, Phone, Mail, Globe, MapPin, Award, Search, Sparkles, 
  SlidersHorizontal, Star, ChevronDown, ChevronUp, Send, FileText, Check 
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import ContributionModal from '@/components/contribution-modal';

interface Advocate {
  id: string;
  name: string;
  credentials: string;
  experience_years: number;
  price_rate: string;
  counties_served: string;
  languages_spoken: string;
  phone: string;
  email: string;
  website: string;
}

interface AdvocateDirectoryClientProps {
  initialAdvocates: Advocate[];
}

interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

const ADVOCATE_REVIEWS: Record<string, Review[]> = {
  'adv-sarah': [
    { author: 'Emily R. (Caregiver)', rating: 5, text: 'Sarah was incredible. She helped us secure a 1:1 behavioral aide for my autistic son in LAUSD in just one meeting. Highly recommended!', date: '2026-03-12' },
    { author: 'Marcus V. (Parent)', rating: 5, text: 'Very knowledgeable about IEP timelines and safety goals. She helped rewrite our goals so they are actually measurable.', date: '2026-05-01' }
  ],
  'adv-marisol': [
    { author: 'Sofia H. (Mother)', rating: 5, text: 'Marisol habla español y nos ayudó muchísimo con el IEP de mi hija. Consiguió terapia de lenguaje adicional.', date: '2026-04-18' },
    { author: 'David K. (Caregiver)', rating: 4, text: 'Excellent coach. Helped me understand my rights under the Lanterman Act and prepare for the IEP transition.', date: '2026-02-28' }
  ],
  'adv-david': [
    { author: 'Jian W. (Parent)', rating: 5, text: 'David’s legal knowledge was key. When the school district tried to cut OT hours, he cited the administrative codes and got it reversed.', date: '2026-05-20' },
    { author: 'Brenda L. (Caregiver)', rating: 5, text: 'Outstanding advocate for dyslexia accommodations. Secured assistive technology and 1.5x writing time.', date: '2026-01-15' }
  ],
  'adv-elena': [
    { author: 'Katarina S. (Caregiver)', rating: 5, text: 'Elena knows both Regional Centers and IEPs. She helped us coordinate Respite care and school speech services together.', date: '2026-04-05' },
    { author: 'James D. (Parent)', rating: 5, text: 'Helped us navigate Sacramento City Unified. Very responsive and affordable coach.', date: '2026-05-14' }
  ],
  'adv-katelyn': [
    { author: 'Ryan T. (Parent)', rating: 5, text: 'As a BCBA, Katelyn was perfect for dealing with our child’s school behavior plan. Safe, structured, and focused.', date: '2026-03-24' },
    { author: 'Elena G. (Caregiver)', rating: 5, text: 'Helped us get behavior therapist hours at school. Very detailed and supportive throughout the process.', date: '2026-05-09' }
  ]
};

export default function AdvocateDirectoryClient({ initialAdvocates }: AdvocateDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'experience' | 'price_asc' | 'price_desc' | 'default'>('default');
  
  // Accordion toggle states
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const [expandedIntakeId, setExpandedIntakeId] = useState<string | null>(null);

  // Intake Form parameters (shared/mapped for rendering)
  const [intakeChildName, setIntakeChildName] = useState('Liam');
  const [intakeChildAge, setIntakeChildAge] = useState('6');
  const [intakeDistrict, setIntakeDistrict] = useState('Los Angeles Unified');
  const [intakeGoal, setIntakeGoal] = useState('Request 1:1 behavioral aide safety supervision');

  const filteredAdvocates = initialAdvocates.filter(adv => {
    const q = searchQuery.toLowerCase();
    return (
      adv.name.toLowerCase().includes(q) ||
      adv.credentials.toLowerCase().includes(q) ||
      adv.languages_spoken.toLowerCase().includes(q) ||
      adv.counties_served.toLowerCase().includes(q)
    );
  });

  const getNumericPrice = (rateString: string) => {
    const cleanStr = rateString.replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr);
    return isNaN(num) ? 9999 : num;
  };

  const sortedAdvocates = [...filteredAdvocates].sort((a, b) => {
    if (sortBy === 'experience') return b.experience_years - a.experience_years;
    if (sortBy === 'price_asc') return getNumericPrice(a.price_rate) - getNumericPrice(b.price_rate);
    if (sortBy === 'price_desc') return getNumericPrice(b.price_rate) - getNumericPrice(a.price_rate);
    return 0;
  });

  // Intake email compiler
  const compileIntakeEmail = (advName: string) => {
    return `Dear ${advName},

I am writing to inquire about your special education advocacy and consulting services. I would like to schedule an initial consultation to discuss my child's educational needs.

Here is a summary of our current situation:
- Child's Nickname: ${intakeChildName}
- Child's Age: ${intakeChildAge} years old
- School District: ${intakeDistrict}
- Key IEP Objective: ${intakeGoal}

We are looking for support to review our current IEP draft, prepare for upcoming meetings, and ensure my child has the correct classroom accommodations. 

Please let me know your availability for a brief call and what intake materials we should prepare.

Best regards,
[Your Name]
[Your Phone Number]`;
  };

  const handleEmailTrigger = (email: string, advName: string) => {
    const subject = `IEP Advocacy Consultation Request - ${intakeChildName}`;
    const body = compileIntakeEmail(advName);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      {/* Search and Sort controls panel */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.5rem', 
          borderRadius: '20px', 
          background: 'rgba(255, 255, 255, 0.75)',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.25rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
        }}
      >
        <div style={{ display: 'flex', flex: '1', minWidth: '280px', position: 'relative' }}>
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search advocates by name, credentials, language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              fontSize: '0.92rem',
              borderRadius: '10px',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>
            <SlidersHorizontal size={14} />
            Sort By:
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '0.5rem 2rem 0.5rem 1rem',
              fontSize: '0.85rem',
              borderRadius: '8px',
              width: 'auto',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}
          >
            <option value="default">Default Match</option>
            <option value="experience">Most Experienced (Years)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <ContributionModal suggestionType="advocate" targetId={null} buttonLabel="Add New Advocate" />
        </div>
      </div>

      {/* Grid of Results */}
      {sortedAdvocates.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.6)' }}>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
            No advocates match your search criteria. Try typing a different keyword or resetting filters.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setSortBy('default'); }}
            className="btn-primary" 
            style={{ width: 'auto', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedAdvocates.map(adv => {
            const reviews = ADVOCATE_REVIEWS[adv.id] || [];
            const isReviewsExpanded = expandedReviewsId === adv.id;
            const isIntakeExpanded = expandedIntakeId === adv.id;
            
            // Calculate rating average
            const avgRating = reviews.length > 0 
              ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
              : '5.0';

            return (
              <div 
                key={adv.id} 
                className="glass-panel animate-fade-in" 
                style={{ 
                  padding: '2rem', 
                  borderRadius: '24px', 
                  background: 'rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {/* 1. Header Card Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div 
                      style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '12px', 
                        background: 'var(--accent-gradient)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'white',
                        flexShrink: 0
                      }}
                    >
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {adv.name}
                      </h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{adv.credentials}</span>
                        <span>•</span>
                        <span><strong>{adv.experience_years} years</strong> experience</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 600 }}>
                          <Star size={12} fill="#f59e0b" /> {avgRating} ({reviews.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div 
                      style={{ 
                        padding: '0.4rem 0.85rem', 
                        borderRadius: '999px', 
                        backgroundColor: 'rgba(99, 102, 241, 0.08)', 
                        color: 'var(--primary-color)', 
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {adv.price_rate}
                    </div>
                    <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Suggest Update" />
                  </div>
                </div>

                {/* 2. Demographic specifications grid */}
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(0,0,0,0.01)',
                    border: '1px solid rgba(0,0,0,0.03)',
                    fontSize: '0.88rem'
                  }}
                >
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>🌍 Counties Served:</strong>
                    <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
                      <MapPin size={12} color="var(--primary-color)" /> 
                      {adv.counties_served.split(',').map(s => s.trim().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}
                    </span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.25rem' }}>🗣️ Languages Spoken:</strong>
                    <span style={{ color: 'var(--text-light)' }}>{adv.languages_spoken}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.35rem' }}>📞 Contact Details:</strong>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Phone size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`tel:${adv.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.phone}</a>
                        <CopyButton text={adv.phone} size={11} />
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Mail size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`mailto:${adv.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.email}</a>
                        <CopyButton text={adv.email} size={11} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Interactive Accordion Expanders */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setExpandedReviewsId(isReviewsExpanded ? null : adv.id);
                      setExpandedIntakeId(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>Read Parent Reviews ({reviews.length})</span>
                    {isReviewsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    onClick={() => {
                      setExpandedIntakeId(isIntakeExpanded ? null : adv.id);
                      setExpandedReviewsId(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--primary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <span>Request Intake Consultation</span>
                    {isIntakeExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <a 
                    href={adv.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--primary-color)', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.3rem', 
                      textDecoration: 'none', 
                      fontWeight: 600,
                      marginLeft: 'auto'
                    }}
                  >
                    <Globe size={13} /> Visit Official Website
                  </a>
                </div>

                {/* 4. Parent Reviews Section */}
                {isReviewsExpanded && (
                  <div style={{ background: 'rgba(0,0,0,0.01)', border: '1px solid rgba(0,0,0,0.03)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                    {reviews.length === 0 ? (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', margin: 0 }}>No written reviews registered for this advisor yet.</p>
                    ) : (
                      reviews.map((rev, idx) => (
                        <div key={idx} style={{ borderBottom: idx < reviews.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', paddingBottom: idx < reviews.length - 1 ? '0.75rem' : 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <strong style={{ fontSize: '0.88rem' }}>{rev.author}</strong>
                            <div style={{ display: 'flex', gap: '0.1rem', color: '#f59e0b' }}>
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} size={11} fill="#f59e0b" stroke="none" />
                              ))}
                            </div>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: '0.2rem 0', lineHeight: 1.4 }}>"{rev.text}"</p>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)' }}>Verified care review: {rev.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. Intake Request Form Builder */}
                {isIntakeExpanded && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.02)', border: '1px dashed var(--primary-color)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }} className="iep-grid-layout">
                    
                    {/* Left Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        1. Intake Form Questions
                      </span>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>Child Nickname</label>
                        <input type="text" value={intakeChildName} onChange={(e) => setIntakeChildName(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '6px' }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>Child Age (Years)</label>
                        <input type="number" value={intakeChildAge} onChange={(e) => setIntakeChildAge(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '6px' }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>School District Name</label>
                        <input type="text" value={intakeDistrict} onChange={(e) => setIntakeDistrict(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '6px' }} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>Primary Consultation Goal</label>
                        <select value={intakeGoal} onChange={(e) => setIntakeGoal(e.target.value)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '6px' }}>
                          <option value="Request 1:1 behavioral aide safety supervision">Request 1:1 behavioral/safety aide</option>
                          <option value="Increase school speech or occupational therapy hours">Increase Speech / OT service hours</option>
                          <option value="Request initial comprehensive assessment for IEP eligibility">Request initial IEP assessment</option>
                          <option value="Appeal a placement decision or SDC self-contained recommendation">Appeal placement/SDC placement</option>
                          <option value="Rewrite vague IEP goals to be specific and measurable (SMART)">Rewrite vague IEP goals</option>
                        </select>
                      </div>
                    </div>

                    {/* Right letter preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>
                          2. Generated Consultation Email
                        </span>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <CopyButton text={compileIntakeEmail(adv.name)} size={14} />
                          <button
                            onClick={() => handleEmailTrigger(adv.email, adv.name)}
                            style={{
                              background: 'var(--primary-color)',
                              border: 'none',
                              color: 'white',
                              borderRadius: '6px',
                              padding: '0.2rem 0.5rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <Send size={10} /> Email
                          </button>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)', padding: '1rem', borderRadius: '8px', fontSize: '0.78rem', whiteSpace: 'pre-wrap', lineHeight: 1.5, maxHeight: '200px', overflowY: 'auto', fontStyle: 'italic' }}>
                        {compileIntakeEmail(adv.name)}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
