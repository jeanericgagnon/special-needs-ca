'use client';

import { useState } from 'react';
import { ShieldCheck, Phone, Mail, Globe, MapPin, Award, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
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

export default function AdvocateDirectoryClient({ initialAdvocates }: AdvocateDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'experience' | 'price_asc' | 'price_desc' | 'default'>('default');

  // Filter logic
  const filteredAdvocates = initialAdvocates.filter(adv => {
    const q = searchQuery.toLowerCase();
    return (
      adv.name.toLowerCase().includes(q) ||
      adv.credentials.toLowerCase().includes(q) ||
      adv.languages_spoken.toLowerCase().includes(q) ||
      adv.counties_served.toLowerCase().includes(q)
    );
  });

  // Helper to extract numeric price from e.g. "$150 / hour" or "$120 / hour"
  const getNumericPrice = (rateString: string) => {
    const cleanStr = rateString.replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr);
    return isNaN(num) ? 9999 : num; // Fallback for unlisted/consultation rates
  };

  // Sorting logic
  const sortedAdvocates = [...filteredAdvocates].sort((a, b) => {
    if (sortBy === 'experience') {
      return b.experience_years - a.experience_years;
    }
    if (sortBy === 'price_asc') {
      return getNumericPrice(a.price_rate) - getNumericPrice(b.price_rate);
    }
    if (sortBy === 'price_desc') {
      return getNumericPrice(b.price_rate) - getNumericPrice(a.price_rate);
    }
    return 0; // Default ordering
  });

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
        <div 
          className="glass-panel" 
          style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            borderRadius: '20px', 
            background: 'rgba(255,255,255,0.6)' 
          }}
        >
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {sortedAdvocates.map(adv => (
            <div 
              key={adv.id} 
              className="glass-panel" 
              style={{ 
                padding: '1.75rem', 
                borderRadius: '24px', 
                background: 'rgba(255, 255, 255, 0.75)',
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.25rem',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                {/* Name & Title */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div 
                    style={{ 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '10px', 
                      background: 'rgba(99, 102, 241, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--primary-color)',
                      flexShrink: 0
                    }}
                  >
                    <Award size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.15rem' }}>
                      {adv.name}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{adv.credentials}</span>
                      <span>•</span>
                      <span><strong>{adv.experience_years} years</strong> experience</span>
                      <span>•</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Sparkles size={11} color="var(--primary-color)" /> Rates: <strong>{adv.price_rate}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div 
                    style={{ 
                      padding: '0.35rem 0.85rem', 
                      borderRadius: '999px', 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                      color: '#10b981', 
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    {adv.price_rate.split(' / ')[0]}
                  </div>
                  
                  <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Suggest Update" />
                </div>
              </div>

              {/* Breakdown */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '1.25rem',
                  padding: '1.25rem',
                  borderRadius: '14px',
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
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem' }}>📞 Contact Details:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-light)', fontSize: '0.85rem' }}>
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

              {/* Action Bar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
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
                    fontWeight: 600 
                  }}
                >
                  <Globe size={13} /> Visit Website & Contact Advisor
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
