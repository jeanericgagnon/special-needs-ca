'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, ArrowRight, Info, Landmark } from 'lucide-react';

interface CountyPin {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  description: string;
}

const COUNTY_PINS: CountyPin[] = [
  { id: 'los-angeles', name: 'Los Angeles', x: 280, y: 390, region: 'Southern California', description: 'Home to Frank D. Lanterman, Eastern LA, Harbor, and North LA Regional Centers.' },
  { id: 'san-diego', name: 'San Diego', x: 345, y: 450, region: 'Southern California', description: 'Covers San Diego and Imperial counties catchment zones.' },
  { id: 'orange', name: 'Orange', x: 300, y: 410, region: 'Southern California', description: 'Managed by the Regional Center of Orange County (RCOC).' },
  { id: 'san-francisco', name: 'San Francisco', x: 105, y: 220, region: 'Bay Area', description: 'Served by the Golden Gate Regional Center (GGRC).' },
  { id: 'alameda', name: 'Alameda', x: 125, y: 225, region: 'Bay Area', description: 'East Bay hub served by the Regional Center of the East Bay (RCEB).' },
  { id: 'contra-costa', name: 'Contra Costa', x: 130, y: 205, region: 'Bay Area', description: 'North Bay zone served by the Regional Center of the East Bay (RCEB).' },
  { id: 'santa-clara', name: 'Santa Clara', x: 125, y: 250, region: 'Bay Area', description: 'Silicon Valley zone served by San Andreas Regional Center (SARC).' },
  { id: 'sacramento', name: 'Sacramento', x: 165, y: 170, region: 'Northern California', description: 'Capital region served by Alta California Regional Center (ACRC).' },
  { id: 'riverside', name: 'Riverside', x: 335, y: 405, region: 'Southern California', description: 'Served by the Inland Regional Center (IRC).' },
  { id: 'san-bernardino', name: 'San Bernardino', x: 335, y: 350, region: 'Southern California', description: 'Largest county land area served by the Inland Regional Center (IRC).' },
  { id: 'fresno', x: 210, y: 270, name: 'Fresno', region: 'Central Valley', description: 'Central Valley agricultural hub served by Central Valley Regional Center (CVRC).' },
  { id: 'kern', x: 260, y: 330, name: 'Kern', region: 'Central Valley', description: 'Bakersfield hub served by Kern Regional Center (KRC).' },
  { id: 'san-joaquin', x: 155, y: 195, name: 'San Joaquin', region: 'Central Valley', description: 'Stockton hub served by Valley Mountain Regional Center (VMRC).' },
  { id: 'sonoma', x: 85, y: 180, name: 'Sonoma', region: 'Northern California', description: 'Wine country zone served by North Bay Regional Center (NBRC).' },
  { id: 'santa-barbara', x: 200, y: 350, name: 'Santa Barbara', region: 'Central Coast', description: 'Coastal valley served by Tri-Counties Regional Center (TCRC).' },
  { id: 'ventura', x: 240, y: 370, name: 'Ventura', region: 'Southern California', description: 'Coastal zone served by Tri-Counties Regional Center (TCRC).' }
];

// All 58 counties list for dropdown auto-complete
const ALL_COUNTIES = [
  { id: 'alameda', name: 'Alameda County' },
  { id: 'alpine', name: 'Alpine County' },
  { id: 'amador', name: 'Amador County' },
  { id: 'butte', name: 'Butte County' },
  { id: 'calaveras', name: 'Calaveras County' },
  { id: 'colusa', name: 'Colusa County' },
  { id: 'contra-costa', name: 'Contra Costa County' },
  { id: 'del-norte', name: 'Del Norte County' },
  { id: 'el-dorado', name: 'El Dorado County' },
  { id: 'fresno', name: 'Fresno County' },
  { id: 'glenn', name: 'Glenn County' },
  { id: 'humboldt', name: 'Humboldt County' },
  { id: 'imperial', name: 'Imperial County' },
  { id: 'inyo', name: 'Inyo County' },
  { id: 'kern', name: 'Kern County' },
  { id: 'kings', name: 'Kings County' },
  { id: 'lake', name: 'Lake County' },
  { id: 'lassem', name: 'Lassen County' },
  { id: 'los-angeles', name: 'Los Angeles County' },
  { id: 'madera', name: 'Madera County' },
  { id: 'marin', name: 'Marin County' },
  { id: 'mariposa', name: 'Mariposa County' },
  { id: 'mendocino', name: 'Mendocino County' },
  { id: 'merced', name: 'Merced County' },
  { id: 'modoc', name: 'Modoc County' },
  { id: 'mono', name: 'Mono County' },
  { id: 'monterey', name: 'Monterey County' },
  { id: 'napa', name: 'Napa County' },
  { id: 'nevada', name: 'Nevada County' },
  { id: 'orange', name: 'Orange County' },
  { id: 'placer', name: 'Placer County' },
  { id: 'plumas', name: 'Plumas County' },
  { id: 'riverside', name: 'Riverside County' },
  { id: 'sacramento', name: 'Sacramento County' },
  { id: 'san-benito', name: 'San Benito County' },
  { id: 'san-bernardino', name: 'San Bernardino County' },
  { id: 'san-diego', name: 'San Diego County' },
  { id: 'san-francisco', name: 'San Francisco County' },
  { id: 'san-joaquin', name: 'San Joaquin County' },
  { id: 'san-luis-obispo', name: 'San Luis Obispo County' },
  { id: 'san-mateo', name: 'San Mateo County' },
  { id: 'santa-barbara', name: 'Santa Barbara County' },
  { id: 'santa-clara', name: 'Santa Clara County' },
  { id: 'santa-cruz', name: 'Santa Cruz County' },
  { id: 'shasta', name: 'Shasta County' },
  { id: 'sierra', name: 'Sierra County' },
  { id: 'siskiyou', name: 'Siskiyou County' },
  { id: 'solano', name: 'Solano County' },
  { id: 'sonoma', name: 'Sonoma County' },
  { id: 'stanislaus', name: 'Stanislaus County' },
  { id: 'sutter', name: 'Sutter County' },
  { id: 'tehama', name: 'Tehama County' },
  { id: 'trinity', name: 'Trinity County' },
  { id: 'tulare', name: 'Tulare County' },
  { id: 'tuolumne', name: 'Tuolumne County' },
  { id: 'ventura', name: 'Ventura County' },
  { id: 'yolo', name: 'Yolo County' },
  { id: 'yuba', name: 'Yuba County' }
];

export default function CaliforniaMap() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCounty, setHoveredCounty] = useState<CountyPin | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyPin | null>(COUNTY_PINS[0]);

  // Autocomplete suggestions
  const suggestions = searchQuery.trim()
    ? ALL_COUNTIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSelectSuggestion = (id: string) => {
    // Check if we have map coordinates for this county
    const mapPin = COUNTY_PINS.find(p => p.id === id);
    if (mapPin) {
      setSelectedCounty(mapPin);
    } else {
      // Direct redirect for non-pin counties
      router.push(`/benefits/${id}`);
    }
    setSearchQuery('');
  };

  const handleGoToDirectory = () => {
    if (selectedCounty) {
      router.push(`/benefits/${selectedCounty.id}`);
    }
  };

  return (
    <div 
      className="glass-panel iep-grid-layout"
      style={{
        background: 'rgba(255, 255, 255, 0.65)',
        border: '1px solid var(--glass-border)',
        padding: '2.5rem',
        borderRadius: '24px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2.5rem',
        alignItems: 'center',
        margin: '2rem 0'
      }}
    >
      {/* Left Column: Interactive Map Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={20} color="var(--primary-color)" />
            California Geographic Navigator
          </h3>
        </div>

        <div 
          style={{
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(var(--primary-rgb),0.02) 0%, rgba(var(--primary-rgb),0.05) 100%)',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)',
            boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.02)',
            aspectRatio: '4/5',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Tech Grid Background lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(var(--primary-rgb),0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary-rgb),0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

          <svg 
            viewBox="0 0 400 500" 
            style={{ width: '90%', height: '90%', display: 'block' }}
          >
            {/* Draw California Outline Path */}
            <path 
              d="M 100 20 L 280 20 L 280 200 L 450 480 L 380 480 Q 300 420 200 350 Q 150 280 120 230 Q 60 120 100 20 Z" 
              fill="rgba(var(--primary-rgb), 0.03)" 
              stroke="var(--primary-color)" 
              strokeWidth="2.5" 
              strokeOpacity="0.3"
              strokeDasharray="4,4"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(var(--primary-rgb),0.05))' }}
            />

            {/* Render County Pins */}
            {COUNTY_PINS.map(pin => {
              const isSelected = selectedCounty?.id === pin.id;
              const isHovered = hoveredCounty?.id === pin.id;

              return (
                <g 
                  key={pin.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedCounty(pin)}
                  onMouseEnter={() => setHoveredCounty(pin)}
                  onMouseLeave={() => setHoveredCounty(null)}
                >
                  {/* Outer glowing halo */}
                  <circle 
                    cx={pin.x} 
                    cy={pin.y} 
                    r={isSelected || isHovered ? 20 : 12} 
                    fill="var(--primary-color)" 
                    opacity={isSelected ? 0.2 : isHovered ? 0.12 : 0.03}
                    style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />

                  {/* Marker Dot */}
                  <circle 
                    cx={pin.x} 
                    cy={pin.y} 
                    r={isSelected ? 8 : 5} 
                    fill={isSelected ? 'var(--primary-color)' : 'white'} 
                    stroke="var(--primary-color)" 
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    style={{ transition: 'all 0.2s ease', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredCounty && (
            <div 
              style={{
                position: 'absolute',
                left: `${(hoveredCounty.x / 400) * 100}%`,
                top: `${(hoveredCounty.y / 500) * 100 - 6}%`,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(15, 23, 42, 0.95)',
                color: 'white',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span style={{ height: '6px', width: '6px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }} />
              <strong>{hoveredCounty.name} County</strong>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Search Autocomplete & Description Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', justifyContent: 'center' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-light)', display: 'block', marginBottom: '0.5rem' }}>
            Search Any California County (all 58)
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search 
              size={18} 
              color="var(--text-light)" 
              style={{ position: 'absolute', left: '1rem', pointerEvents: 'none' }} 
            />
            <input 
              type="text" 
              placeholder="Type county name (e.g. San Diego, Placer)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                fontSize: '0.9rem',
                borderRadius: '12px',
                border: '1px solid var(--glass-border)',
                background: 'rgba(255,255,255,0.9)',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Autocomplete Suggestions Box */}
          {suggestions.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                marginTop: '0.5rem',
                maxHeight: '220px',
                overflowY: 'auto',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                zIndex: 20
              }}
            >
              {suggestions.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectSuggestion(c.id)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(0,0,0,0.03)',
                    fontSize: '0.88rem',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--primary-rgb), 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{c.name}</span>
                  <ArrowRight size={14} color="var(--primary-color)" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected County Display Card */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {selectedCounty ? (
            <div 
              className="animate-fade-in"
              style={{
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid var(--glass-border)',
                padding: '1.5rem',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.2rem' }}>
                  {selectedCounty.region}
                </span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {selectedCounty.name} County Guide
                </h4>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.45, margin: 0 }}>
                {selectedCounty.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(var(--primary-rgb),0.02)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(var(--primary-rgb),0.05)', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                <Landmark size={14} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                <span>Provides localized school, Regional Center, and advocate matching resources.</span>
              </div>

              <button
                onClick={handleGoToDirectory}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  marginTop: '0.25rem'
                }}
              >
                <span>Open County Directory</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
              <Info size={32} color="var(--text-light)" style={{ margin: '0 auto 0.5rem' }} />
              <p style={{ fontSize: '0.88rem' }}>Hover or select a pin on the map, or use search above to select a California County directory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
