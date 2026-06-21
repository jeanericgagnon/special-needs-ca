'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Wand2, 
  UserCheck, 
  Target, 
  BookOpen, 
  Clock, 
  DollarSign, 
  PiggyBank, 
  FileText, 
  MapPin, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { stateConfigs } from '@/lib/stateConfigs';

export default function FindHelpClient() {
  const [stateId, setStateId] = useState('california');
  const [hydrated, setHydrated] = useState(false);

  React.useEffect(() => {
    const savedState = localStorage.getItem('selected_state');
    const timer = setTimeout(() => {
      if (savedState) {
        setStateId(savedState);
      }
      setHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleStateChange = (val: string) => {
    setStateId(val);
    localStorage.setItem('selected_state', val);
  };

  const statesList = Object.keys(stateConfigs).map(key => ({
    id: key,
    name: stateConfigs[key].name
  })).sort((a, b) => a.name.localeCompare(b.name));

  const stateConfig = stateConfigs[stateId] || stateConfigs['california'];

  // Categories helper to style badges
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Benefits':
        return { bg: 'rgba(15, 118, 110, 0.08)', text: '#0f766e', border: 'rgba(15, 118, 110, 0.2)' };
      case 'IEP & Education':
        return { bg: 'rgba(59, 130, 246, 0.08)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.2)' };
      case 'Caregiving':
        return { bg: 'rgba(139, 92, 246, 0.08)', text: '#7c3aed', border: 'rgba(139, 92, 246, 0.2)' };
      case 'Financial':
        return { bg: 'rgba(217, 119, 6, 0.08)', text: '#d97706', border: 'rgba(217, 119, 6, 0.2)' };
      case 'County Resources':
        return { bg: 'rgba(236, 72, 153, 0.08)', text: '#db2777', border: 'rgba(236, 72, 153, 0.2)' };
      default:
        return { bg: 'rgba(100, 116, 139, 0.08)', text: '#475569', border: 'rgba(100, 116, 139, 0.2)' };
    }
  };

  const tools = [
    {
      title: 'State Benefits Wizard',
      category: 'Benefits',
      icon: <Wand2 size={24} color="#0f766e" />,
      description: `Answer questions to find matching state-level programs like the ${stateConfig.waiverProgram} waiver and ${stateConfig.medicaidName} intake options.`,
      href: '/',
      actionText: 'Start Quiz'
    },
    {
      title: 'IEP Advocates & Attorneys',
      category: 'IEP & Education',
      icon: <UserCheck size={24} color="#2563eb" />,
      description: `Browse the county-mapped directories of special education advocates and special needs attorneys in ${stateConfig.name} to help secure school accommodations.`,
      href: '/advocates',
      actionText: 'Find Advocates'
    },
    {
      title: 'IEP Goal Generator',
      category: 'IEP & Education',
      icon: <Target size={24} color="#2563eb" />,
      description: 'Create measurable, developmental milestone-aligned IEP goals and accommodations for your child\'s IEP team.',
      href: '/iep-goals',
      actionText: 'Build IEP Goals'
    },
    {
      title: 'Behavior Log & Tracker',
      category: 'Caregiving',
      icon: <BookOpen size={24} color="#7c3aed" />,
      description: stateConfig.code === 'CA'
        ? `Record behavior patterns, triggers, and duration details supporting ${stateConfig.personalCareProgram} (IHSS) Protective Supervision applications.`
        : `Record behavioral episodes, triggers, and protective supervision logs to construct supporting records for IEPs or medical assessments.`,
      href: '/ihss-behavior-log',
      actionText: 'Log Behaviors'
    },
    {
      title: 'IEP Timelines Calculator',
      category: 'IEP & Education',
      icon: <Clock size={24} color="#2563eb" />,
      description: stateConfig.code === 'CA'
        ? 'Calculate assessment plan (15 days) and IEP initial meeting (60 days) statutory deadlines under California Education Code § 56321.'
        : stateConfig.code === 'FL'
        ? 'Calculate Florida special education assessment and eligibility timelines (60 school days) under FAC Rule 6A-6.0331.'
        : stateConfig.code === 'TX'
        ? 'Calculate Texas school district evaluation (45 school days) and ARD/IEP meeting (30 days) timelines under TEA guidelines.'
        : 'Calculate statutory timelines for school district evaluations, consent plans, and initial IEP meetings based on state and federal IDEA rules.',
      href: stateConfig.code === 'FL' ? '/deadlines/fl-ibudget-appeal' : '/deadlines/california-iep-timeline',
      actionText: 'Calculate Dates'
    },
    {
      title: 'Regional Center Funding Guides',
      category: 'Benefits',
      icon: <DollarSign size={24} color="#0f766e" />,
      description: stateConfig.code === 'CA'
        ? 'Search California DDS Purchase of Service (POS) funding reports, respite eligibility hours, and regional center vendor codes.'
        : `Purchase of service (POS) and respite funding guides (California specific).`,
      href: '/regional-center-funding',
      actionText: 'Check Funding'
    },
    {
      title: 'Special Needs Trust & ABLE accounts',
      category: 'Financial',
      icon: <PiggyBank size={24} color="#d97706" />,
      description: `Explore structural paths for Special Needs Trusts, legal guardianship, and saving up to $100k cap-free in a ${stateConfig.ableProgram || 'state ABLE'} account.`,
      href: '/financial-planning',
      actionText: 'Plan Finances'
    },
    {
      title: 'State Benefits Forms Database',
      category: 'Benefits',
      icon: <FileText size={24} color="#0f766e" />,
      description: `Download official state agency PDF application forms and parent request templates for ${stateConfig.medicaidName}, ECI, and state appeals.`,
      href: `/forms?state=${stateId}`,
      actionText: 'Get State Forms'
    },
    {
      title: 'County Resources Directory',
      category: 'County Resources',
      icon: <MapPin size={24} color="#db2777" />,
      description: `Locate local ${stateConfig.catchmentName} intake offices, health departments, and school district special education contacts in ${stateConfig.name}'s counties.`,
      href: `/counties/${stateId}`,
      actionText: 'Explore Counties'
    }
  ];

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-color)10', padding: '0.5rem 1rem', borderRadius: '30px', border: '1px solid var(--primary-color)20', marginBottom: '1rem' }}>
          <Compass size={18} color="var(--primary-color)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ablefull Guidance Center</span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
          Parent Support & Tools Hub
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-light)', maxWidth: '750px', margin: '0 auto', lineHeight: '1.6' }}>
          Avoid denials, calculate timelines, and search national advocate lists. Personalize descriptions and local directories using the state selector below.
        </p>
      </div>

      {/* Glassmorphic State Selector Section */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.75rem 2rem', 
          borderRadius: '24px', 
          marginBottom: '3.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Select Your State Context</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
            Adapts all tools below with local state agencies, timelines, and forms.
          </p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <select 
            value={hydrated ? stateId : 'california'} 
            onChange={(e) => handleStateChange(e.target.value)}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              cursor: 'pointer'
            }}
          >
            {statesList.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Dynamic Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {tools.map((tool, idx) => {
          const badge = getCategoryStyles(tool.category);
          return (
            <div 
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: '24px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.5rem',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.75)',
                border: '1px solid var(--glass-border)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: badge.text,
                      backgroundColor: badge.bg,
                      border: `1px solid ${badge.border}`,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {tool.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${badge.text}10` }}>
                    {tool.icon}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0.25rem 0 0 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  {tool.title}
                </h3>
                
                <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.55 }}>
                  {tool.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1.25rem' }}>
                <Link 
                  href={tool.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    backgroundColor: badge.text,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 14px -4px ${badge.text}`
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLElement).style.filter = 'brightness(0.95)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLElement).style.filter = 'none';
                    (e.currentTarget as HTMLElement).style.transform = 'none';
                  }}
                >
                  <span>{tool.actionText}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
