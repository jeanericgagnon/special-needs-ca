'use client';

import { useDeferredValue, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Calculator, Landmark, ArrowRight } from 'lucide-react';
import type { County } from '@/lib/db';
import { trackDirectoryAnalyticsEvent } from '@/lib/directoryAnalytics';
import { getIhssWageDisclosure } from '@/lib/ihssWageDisclosure';

interface CountiesClientProps {
  counties: County[];
  stateCode: string;
  stateName: string;
}

export default function CountiesClient({ counties, stateCode, stateName }: CountiesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const hasMountedRef = useRef(false);

  const filteredCounties = counties.filter(county =>
    county.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const trimmedQuery = deferredSearchQuery.trim();

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (!trimmedQuery) return;
    }

    const timeout = window.setTimeout(() => {
      trackDirectoryAnalyticsEvent({
        event: 'directory_search',
        stateId: stateCode.toLowerCase(),
        pageType: 'county',
        searchQuery: trimmedQuery || undefined,
        resultCount: filteredCounties.length,
      });

      if (filteredCounties.length === 0) {
        trackDirectoryAnalyticsEvent({
          event: 'directory_no_results',
          stateId: stateCode.toLowerCase(),
          pageType: 'county',
          searchQuery: trimmedQuery || undefined,
          resultCount: 0,
        });

        if (trimmedQuery) {
          trackDirectoryAnalyticsEvent({
            event: 'directory_dead_end',
            stateId: stateCode.toLowerCase(),
            pageType: 'county',
            searchQuery: trimmedQuery,
            resultCount: 0,
          });
        }
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [deferredSearchQuery, filteredCounties.length, stateCode]);

  return (
    <div>
      {/* Search Filter Panel */}
      <div 
        className="glass-panel animate-fade-in" 
        style={{ 
          padding: '1.5rem 2rem', 
          borderRadius: '20px', 
          background: 'rgba(255, 255, 255, 0.75)',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>
          <Search size={18} color="var(--primary-color)" />
          Search Counties:
        </div>
        
        <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Type county name (e.g. Los Angeles, Orange, Sacramento...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.75rem 1rem 0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              width: '100%',
              background: 'white'
            }}
          />
        </div>
        
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>
          Showing {filteredCounties.length} of {counties.length} {stateName} Counties
        </div>
      </div>

      {/* Grid Card Layout */}
      {filteredCounties.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.6)' }}>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-light)' }}>
            No counties match your search query. Please try another search.
          </p>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}
        >
          {filteredCounties.map((county) => {
            const wageDisclosure = getIhssWageDisclosure(stateCode.toLowerCase(), county.name, county.ihss_wage_rate ?? null);
            return (
              <div 
                key={county.id}
                className="glass-panel" 
                style={{ 
                  padding: '1.5rem', 
                  borderRadius: '20px', 
                  background: 'rgba(255, 255, 255, 0.75)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '220px',
                  border: '1px solid var(--glass-border)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <MapPin size={20} color="var(--primary-color)" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                      {county.name} County
                    </h3>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '1.25rem', lineHeight: '1.4' }}>
                    Access localized administrative offices, school district IEP numbers, and {
                      stateCode.toLowerCase() === 'ca' ? 'Lanterman Act service coordinators' :
                      stateCode.toLowerCase() === 'tx' ? 'LIDDA service coordinators' :
                      stateCode.toLowerCase() === 'fl' ? 'APD service coordinators' :
                      stateCode.toLowerCase() === 'ny' ? 'OPWDD Front Door coordinators' :
                      'local service coordinators'
                    } for families in {county.name} County.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    {wageDisclosure?.hourlyRate ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-light)' }}>
                          <Calculator size={14} color="var(--primary-color)" />
                          IHSS Pay Estimate:
                        </span>
                        <strong style={{ color: '#10b981' }}>${wageDisclosure.hourlyRate.toFixed(2)}/hr</strong>
                      </div>
                    ) : null}
                    {wageDisclosure ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.45 }}>
                        Estimate only. Confirm the current county pay rate with the local IHSS office before relying on it.
                      </span>
                    ) : null}
                    {county.medi_cal_plans && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-light)' }}>
                          <Landmark size={14} color="var(--primary-color)" />
                          {stateCode.toLowerCase() === 'ca' ? 'Medi-Cal Plan:' : 'Medicaid Plan:'}
                        </span>
                        <strong style={{ fontSize: '0.8rem', color: 'var(--text-main)', textAlign: 'right', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {county.medi_cal_plans}
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div 
                  style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    borderTop: '1px solid rgba(0,0,0,0.05)', 
                    paddingTop: '1rem' 
                  }}
                >
                  <Link 
                    href={`/benefits/${stateCode.toLowerCase()}/${county.id}`} 
                    style={{ 
                      flex: 1, 
                      textDecoration: 'none' 
                    }}
                    onClick={() => trackDirectoryAnalyticsEvent({
                      event: 'directory_resource_click',
                      stateId: stateCode.toLowerCase(),
                      countyId: county.id,
                      pageType: 'county',
                      recordId: county.id,
                    })}
                  >
                    <button 
                      className="btn-primary" 
                      style={{ 
                        fontSize: '0.82rem', 
                        height: '38px', 
                        marginTop: 0,
                        background: 'rgba(99, 102, 241, 0.08)',
                        color: 'var(--primary-color)',
                        border: '1px solid rgba(99, 102, 241, 0.15)',
                        fontWeight: 600
                      }}
                    >
                      View Contacts
                    </button>
                  </Link>

                  <Link 
                    href={`/benefits/${stateCode.toLowerCase()}?county=${county.id}`} 
                    style={{ 
                      flex: 1, 
                      textDecoration: 'none' 
                    }}
                    onClick={() => trackDirectoryAnalyticsEvent({
                      event: 'directory_next_step_click',
                      stateId: stateCode.toLowerCase(),
                      countyId: county.id,
                      pageType: 'county',
                      recordId: county.id,
                    })}
                  >
                    <button 
                      className="btn-primary" 
                      style={{ 
                        fontSize: '0.82rem', 
                        height: '38px', 
                        marginTop: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      Benefits Finder <ArrowRight size={12} />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
