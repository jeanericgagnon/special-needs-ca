'use client';

import { useState } from 'react';
import { MapPin, Info, Phone, Globe, Navigation, Sparkles } from 'lucide-react';

interface MapResource {
  id: string;
  type: 'regional-center' | 'school-board' | 'clinic' | 'park' | 'support';
  name: string;
  address: string;
  phone: string;
  description: string;
  x: number; // SVG X coord
  y: number; // SVG Y coord
}

interface CountyMapClientProps {
  countyName: string;
  resources: MapResource[];
}

export default function CountyMapClient({ countyName, resources }: CountyMapClientProps) {
  const [selectedRes, setSelectedRes] = useState<MapResource | null>(resources[0] || null);
  const [hoveredRes, setHoveredRes] = useState<MapResource | null>(null);

  // Map category colors
  const typeColors: Record<string, { bg: string; border: string; icon: string }> = {
    'regional-center': { bg: 'rgba(99, 102, 241, 0.1)', border: 'var(--primary-color)', icon: '#6366f1' },
    'school-board': { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: '#10b981' },
    'clinic': { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', icon: '#ef4444' },
    'park': { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: '#f59e0b' },
    'support': { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6', icon: '#8b5cf6' }
  };

  const getMarkerLabel = (type: string) => {
    return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div 
      className="glass-panel iep-grid-layout" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.75)',
        display: 'grid', 
        gridTemplateColumns: '1fr 320px', 
        gap: '2rem',
        alignItems: 'center',
        padding: '2rem'
      }}
    >
      {/* Left: SVG Map Canvas */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={18} color="var(--primary-color)" />
            Interactive Resource Coordinates Map
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
            Hover or click pins to inspect county assets
          </span>
        </div>

        {/* Map wrapper */}
        <div 
          style={{ 
            position: 'relative', 
            background: 'var(--bg-gradient)', 
            borderRadius: '20px', 
            border: '1px solid var(--glass-border)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.03)',
            aspectRatio: '16/9',
            overflow: 'hidden'
          }}
        >
          {/* Grid lines to make it look technical and dashboard-like */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '25px 25px', pointerEvents: 'none' }} />

          <svg 
            viewBox="0 0 800 450" 
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            {/* Draw county border shape (representation) */}
            <path 
              d="M 150 100 Q 300 80 450 120 T 650 180 Q 700 300 620 380 T 400 400 Q 250 420 180 340 T 150 100 Z" 
              fill="rgba(99, 102, 241, 0.02)" 
              stroke="rgba(99, 102, 241, 0.12)" 
              strokeWidth="3" 
              strokeDasharray="5,5"
            />
            
            {/* Draw connectors or roads */}
            <path 
              d="M 150 200 Q 400 180 650 250 M 350 100 Q 420 280 400 400" 
              fill="none" 
              stroke="rgba(0,0,0,0.03)" 
              strokeWidth="2"
            />

            {/* Pins */}
            {resources.map((res) => {
              const colors = typeColors[res.type];
              const isSelected = selectedRes?.id === res.id;
              const isHovered = hoveredRes?.id === res.id;

              return (
                <g 
                  key={res.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedRes(res)}
                  onMouseEnter={() => setHoveredRes(res)}
                  onMouseLeave={() => setHoveredRes(null)}
                >
                  {/* Outer breathing halo */}
                  <circle 
                    cx={res.x} 
                    cy={res.y} 
                    r={isSelected || isHovered ? 24 : 14} 
                    fill={colors.icon} 
                    opacity={isSelected ? 0.15 : isHovered ? 0.1 : 0.03}
                    style={{ transition: 'all 0.3s ease' }}
                  />

                  {/* Pin Circle */}
                  <circle 
                    cx={res.x} 
                    cy={res.y} 
                    r={isSelected ? 10 : 7} 
                    fill={isSelected ? colors.icon : 'white'} 
                    stroke={colors.icon} 
                    strokeWidth={isSelected ? 3 : 2}
                    style={{ transition: 'all 0.2s ease', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  />
                  
                  {/* Inner dot */}
                  {!isSelected && (
                    <circle 
                      cx={res.x} 
                      cy={res.y} 
                      r="2" 
                      fill={colors.icon} 
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Mini tooltip popup on hover */}
          {hoveredRes && (
            <div 
              style={{
                position: 'absolute',
                // Map percentages from coordinates
                left: `${(hoveredRes.x / 800) * 100}%`,
                top: `${(hoveredRes.y / 450) * 100 - 15}%`,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(15, 23, 42, 0.95)',
                color: 'white',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span style={{ height: '8px', width: '8px', borderRadius: '50%', backgroundColor: typeColors[hoveredRes.type].icon }} />
              <strong>{hoveredRes.name}</strong>
            </div>
          )}
        </div>
      </div>

      {/* Right: Selected Node Contact Card */}
      <div 
        style={{
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          paddingLeft: '1.5rem',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1rem'
        }}
        className="print-expand"
      >
        {selectedRes ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span 
              style={{ 
                background: typeColors[selectedRes.type].bg, 
                color: typeColors[selectedRes.type].icon, 
                border: `1px solid ${typeColors[selectedRes.type].border}`,
                padding: '0.2rem 0.6rem', 
                borderRadius: '6px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'inline-block',
                width: 'fit-content'
              }}
            >
              {getMarkerLabel(selectedRes.type)}
            </span>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{selectedRes.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>{selectedRes.description}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <MapPin size={14} style={{ marginTop: '2px', color: 'var(--primary-color)' }} />
                <span>{selectedRes.address}</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={14} style={{ color: 'var(--primary-color)' }} />
                <a href={`tel:${selectedRes.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{selectedRes.phone}</a>
              </span>
            </div>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedRes.name + ' ' + selectedRes.address)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary no-print"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.82rem',
                borderRadius: '8px',
                marginTop: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <Navigation size={12} />
              <span>Get Directions</span>
            </a>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>
            <Info size={24} style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.85rem' }}>Select a map marker on the left to display local contact routes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
