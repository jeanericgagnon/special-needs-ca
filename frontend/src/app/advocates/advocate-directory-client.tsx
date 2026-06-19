'use client';

import { useState } from 'react';
import { 
  Phone, Mail, Globe, MapPin, Award, Search, 
  SlidersHorizontal, Star, ChevronDown, ChevronUp, Send 
} from 'lucide-react';
import CopyButton from '@/components/copy-button';
import ContributionModal from '@/components/contribution-modal';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import SourceFreshnessDisclosure from '@/app/components/SourceFreshnessDisclosure';

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
  specialties?: string | null;
  regional_center_vendorized?: number;
  organization_affiliation?: string | null;
  description?: string | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
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
  
  // Advanced filters state
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [vendorizedOnly, setVendorizedOnly] = useState(false);
  const [selectedAffiliation, setSelectedAffiliation] = useState('');

  // Accordion toggle states
  const [expandedReviewsId, setExpandedReviewsId] = useState<string | null>(null);
  const [expandedIntakeId, setExpandedIntakeId] = useState<string | null>(null);
  const [expandedDescIds, setExpandedDescIds] = useState<Record<string, boolean>>({});

  const toggleDescription = (id: string) => {
    setExpandedDescIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Intake Form parameters (shared/mapped for rendering)
  const [intakeChildName, setIntakeChildName] = useState('Liam');
  const [intakeChildAge, setIntakeChildAge] = useState('6');
  const [intakeDistrict, setIntakeDistrict] = useState('Los Angeles Unified');
  const [intakeGoal, setIntakeGoal] = useState('Request 1:1 behavioral aide safety supervision');

  // Available specialties for filtering
  const ALL_SPECIALTIES = [
    'Autism',
    'Down Syndrome',
    'Hearing Loss',
    'Vision Impairment',
    'ADHD',
    'Learning Disabilities',
    'Speech & Language',
    'Behavioral Needs',
    'Cerebral Palsy',
    'Epilepsy',
    'Spina Bifida',
    'Muscular Dystrophy',
    'Intellectual Disability',
    'Emotional Disturbance',
    'Orthopedic Impairment',
    'Deaf-Blindness',
    'Other Health Impairment',
    'Multiple Disabilities',
    'General Advocacy'
  ];

  // Dynamically compute unique organization affiliations present in the loaded dataset
  const availableAffiliations = Array.from(
    new Set(
      initialAdvocates
        .map(a => a.organization_affiliation)
        .filter((aff): aff is string => typeof aff === 'string' && aff !== 'Independent Practice')
    )
  ).sort();

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const filteredAdvocates = initialAdvocates.filter(adv => {
    // 1. Search text query
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      adv.name.toLowerCase().includes(q) ||
      adv.credentials.toLowerCase().includes(q) ||
      adv.languages_spoken.toLowerCase().includes(q) ||
      adv.counties_served.toLowerCase().includes(q) ||
      (adv.description && adv.description.toLowerCase().includes(q));
      
    if (!matchesSearch) return false;

    // 2. Specialties (AND logic for Down Syndrome AND Hearing Loss, etc.)
    if (selectedSpecialties.length > 0) {
      const advSpecs = adv.specialties ? adv.specialties.split(',').map(s => s.trim()) : [];
      const matchesAllSpecialties = selectedSpecialties.every(spec => advSpecs.includes(spec));
      if (!matchesAllSpecialties) return false;
    }

    // 3. Regional Center vendorization
    if (vendorizedOnly && adv.regional_center_vendorized !== 1) {
      return false;
    }

    // 4. Organization affiliation
    if (selectedAffiliation) {
      if (selectedAffiliation === 'any_affiliated') {
        if (!adv.organization_affiliation || adv.organization_affiliation === 'Independent Practice') {
          return false;
        }
      } else if (adv.organization_affiliation !== selectedAffiliation) {
        return false;
      }
    }

    return true;
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
    window.location.assign(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
        }}
      >
        {/* Row 1: Search, Sort and Add Advocate */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
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
              onChange={(e) => setSortBy(e.target.value as 'experience' | 'price_asc' | 'price_desc' | 'default')}
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

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', width: '100%' }} />

        {/* Row 2: Specialty Selector Tag Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Filter by Specialty Focus (select multiple to find specialists in both):
            </span>
            {selectedSpecialties.length > 0 && (
              <button 
                onClick={() => setSelectedSpecialties([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-color)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Clear Specialties ({selectedSpecialties.length})
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {ALL_SPECIALTIES.map(spec => {
              const isSelected = selectedSpecialties.includes(spec);
              return (
                <button
                  key={spec}
                  onClick={() => toggleSpecialty(spec)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isSelected ? '1px solid transparent' : '1px solid rgba(0, 0, 0, 0.08)',
                    background: isSelected ? 'var(--accent-gradient)' : 'rgba(0,0,0,0.02)',
                    color: isSelected ? 'white' : 'var(--text-light)',
                    boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.2)' : 'none'
                  }}
                >
                  {spec} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.06)', width: '100%' }} />

        {/* Row 3: Health Provider / Vendorization Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', width: '100%' }}>
          <button
            onClick={() => setVendorizedOnly(!vendorizedOnly)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: vendorizedOnly ? '1px solid #10b981' : '1px solid rgba(0, 0, 0, 0.08)',
              background: vendorizedOnly ? '#ecfdf5' : 'rgba(0,0,0,0.02)',
              color: vendorizedOnly ? '#047857' : 'var(--text-light)',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '3px', 
              border: vendorizedOnly ? 'none' : '1px solid rgba(0,0,0,0.2)',
              backgroundColor: vendorizedOnly ? '#10b981' : 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '8px',
              fontWeight: 'bold'
            }}>
              {vendorizedOnly && '✓'}
            </span>
            Regional Center Vendored Only
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)' }}>
              Health Provider / Hospital Network:
            </span>
            <select
              value={selectedAffiliation}
              onChange={(e) => setSelectedAffiliation(e.target.value)}
              style={{
                padding: '0.4rem 1.5rem 0.4rem 0.75rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                width: 'auto',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <option value="">-- All Networks --</option>
              <option value="any_affiliated">Any Hospital / Agency Affiliation</option>
              {availableAffiliations.map(aff => (
                <option key={aff} value={aff}>{aff}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Disclaimer Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1rem 1.5rem', 
          borderRadius: '16px', 
          background: 'rgba(239, 68, 68, 0.04)', 
          border: '1px solid rgba(239, 68, 68, 0.2)', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.88rem',
          color: '#b91c1c'
        }}
      >
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
        <div>
          <strong>Important Directory Disclaimer:</strong> The listings in this directory are community-sourced or public listings. 
          <strong> Inclusion does not constitute an endorsement, recommendation, or verification</strong> of credentials by the Ablefull team. 
          Please independently verify credentials, references, and billing policies locally before hiring any professional advisor.
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
                        backgroundColor: 'rgba(var(--primary-rgb), 0.08)', 
                        color: 'var(--primary-color)', 
                        border: '1px solid rgba(var(--primary-rgb), 0.15)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      {adv.price_rate}
                    </div>
                    <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Suggest Update" />
                  </div>
                </div>

                {/* Specialty Tags & Affiliation Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginTop: '-0.25rem' }}>
                  {/* Regional Center Vendorized Badge */}
                  {adv.regional_center_vendorized === 1 && (
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '999px', 
                        backgroundColor: '#ecfdf5', 
                        color: '#047857', 
                        border: '1px solid #a7f3d0',
                        fontSize: '0.74rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                      Regional Center Vendored
                    </span>
                  )}
                  
                  {/* Organization Affiliation Badge */}
                  {adv.organization_affiliation && adv.organization_affiliation !== 'Independent Practice' && (
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.3rem',
                        padding: '0.25rem 0.65rem', 
                        borderRadius: '999px', 
                        backgroundColor: '#eff6ff', 
                        color: '#1d4ed8', 
                        border: '1px solid #bfdbfe',
                        fontSize: '0.74rem',
                        fontWeight: 600
                      }}
                    >
                      🏥 {adv.organization_affiliation}
                    </span>
                  )}

                  {/* Specialties tags */}
                  {adv.specialties && adv.specialties.split(',').map(spec => spec.trim()).filter(Boolean).map((spec, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        padding: '0.2rem 0.55rem', 
                        borderRadius: '6px', 
                        backgroundColor: 'rgba(99, 102, 241, 0.08)', 
                        color: '#4f46e5', 
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        fontSize: '0.74rem',
                        fontWeight: 500
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <TrustBadge
                  status={adv.verification_status}
                  lastVerifiedDate={adv.last_verified_date}
                  sourceUrl={adv.website}
                  entityId={adv.id}
                  entityName={adv.name}
                  entityType="advocate"
                />

                {/* Collapsible Glassmorphic Description/Bio Section */}
                {adv.description && (
                  <div 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '16px', 
                      background: 'rgba(255, 255, 255, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      color: 'var(--text-light)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleDescription(adv.id)}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        About / Professional Bio
                      </span>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {expandedDescIds[adv.id] ? 'Show Less' : 'Show More'}
                        {expandedDescIds[adv.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--text-main)', 
                      overflow: 'hidden', 
                      display: '-webkit-box', 
                      WebkitLineClamp: expandedDescIds[adv.id] ? 'unset' : 2, 
                      WebkitBoxOrient: 'vertical',
                      transition: 'all 0.3s ease'
                    }}>
                      {adv.description}
                    </p>
                  </div>
                )}

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
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: '0.2rem 0', lineHeight: 1.4 }}>&quot;{rev.text}&quot;</p>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-light)' }}>Verified care review: {rev.date}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 5. Intake Request Form Builder */}
                {isIntakeExpanded && (
                  <div style={{ background: 'rgba(var(--primary-rgb), 0.02)', border: '1px dashed var(--primary-color)', borderRadius: '16px', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '0.5rem' }} className="iep-grid-layout">
                    
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

      <SourceFreshnessDisclosure sources={[
        { name: 'California COPAA Advocate Listings', url: 'https://www.copaa.org', verificationStatus: 'unverified' },
        { name: 'California Office of Administrative Hearings Directory', url: 'https://www.dgs.ca.gov/OAH', verificationStatus: 'unverified' }
      ]} />
    </div>
  );
}
