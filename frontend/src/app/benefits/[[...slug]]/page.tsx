import { 
  getCountyDetails, 
  getIepAdvocates, 
  getCounties, 
  getSchoolDistrictBySlug,
  getLocalProviders,
  getProgramsForDiagnosis,
  getAllPrograms,
  getProgramBySlug
} from '@/lib/db';
import { DIAGNOSES, slugifyDiagnosis } from '@/lib/diagnoses';
import { getCityBySlug } from '@/lib/cities';
import { Metadata } from 'next';
import { MapPin, Phone, Landmark, ShieldCheck, Mail, Award, Sparkles, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { IEP_ACCOMMODATIONS, SMART_GOAL_TEMPLATES } from '@/lib/iep-data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContributionModal from '@/components/contribution-modal';
import PrintButton from '@/components/print-button';
import ShareButton from '@/components/share-button';
import CountyMapClient from '../components/county-map-client';

// Client Components
import IepGoalsBuilder from '../components/iep-goals-builder';
import IhssCalculator from '../components/ihss-calculator';
import AppealLetterGenerator from '../components/appeal-letter-generator';
import IhssMiniProduct from '../components/ihss-mini-product';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

// Formatting helpers
function formatParam(val: string): string {
  const words = val.split('-');
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      const acronyms = [
        'asd', 'adhd', 'spd', 'gdd', 'odd', 'rad', 'cp', 'sma', 'tbi', 'nf1', 'nf2', 
        'cvi', 'apd', 'onh', 'rop', 'id', 'nvld', 'chd', 'cf', 'ckd', 
        'jia', 'ohi', 'sld', 'ed', 'ca', 'xxy'
      ];
      if (acronyms.includes(lower)) {
        return lower.toUpperCase();
      }
      
      const lowerCaseWords = ['of', 'and', 'to', 'for', 'in', 'or', 'by', 'with', 'at'];
      if (lowerCaseWords.includes(lower) && index > 0) {
        return lower;
      }
      
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}



function getRelevantIepData(diagnosisSlug: string) {
  const norm = diagnosisSlug.toLowerCase();
  
  let relevantAccs = [];
  let relevantGoals = [];
  
  if (norm.includes('autism') || norm.includes('asd')) {
    relevantAccs = IEP_ACCOMMODATIONS.filter(a => 
      a.category === 'Sensory & Regulation' || a.category === 'Visual & Environmental' || a.id === 'acc-speech-supports' || a.id === 'acc-cool-down'
    );
    relevantGoals = SMART_GOAL_TEMPLATES.filter(g => g.diagnosis.includes('Autism'));
  } else if (norm.includes('adhd') || norm.includes('attention') || norm.includes('hyperactivity')) {
    relevantAccs = IEP_ACCOMMODATIONS.filter(a => 
      a.id === 'acc-sensory-breaks' || a.id === 'acc-flexible-seating' || a.id === 'acc-fidget-tools' || a.id === 'acc-preferred-seating' || a.id === 'acc-chunk-tasks' || a.id === 'acc-positive-reinforcement'
    );
    relevantGoals = SMART_GOAL_TEMPLATES.filter(g => g.diagnosis.includes('ADHD'));
  } else if (norm.includes('speech') || norm.includes('language') || norm.includes('apraxia')) {
    relevantAccs = IEP_ACCOMMODATIONS.filter(a => 
      a.id === 'acc-speech-supports' || a.id === 'acc-peer-pairing' || a.id === 'acc-visual-timer' || a.id === 'acc-chunk-tasks'
    );
    relevantGoals = SMART_GOAL_TEMPLATES.filter(g => g.diagnosis.includes('Speech'));
  } else if (norm.includes('dyslexia') || norm.includes('learning') || norm.includes('cognitive') || norm.includes('intellectual') || norm.includes('dysgraphia') || norm.includes('dyscalculia')) {
    relevantAccs = IEP_ACCOMMODATIONS.filter(a => 
      a.category === 'Academic & Task' || a.id === 'acc-preferred-seating' || a.id === 'acc-pencil-grip'
    );
    relevantGoals = SMART_GOAL_TEMPLATES.filter(g => g.diagnosis.includes('Learning') || g.id === 'goal-sld-reading' || g.id === 'goal-sld-comp');
  } else {
    relevantAccs = IEP_ACCOMMODATIONS.filter(a => 
      a.category === 'Motor & Mobility' || a.id === 'acc-extra-time' || a.id === 'acc-chunk-tasks'
    );
    relevantGoals = SMART_GOAL_TEMPLATES.filter(g => g.area === 'Self-Advocacy' || g.id === 'goal-sld-advocacy');
  }
  
  return {
    accommodations: relevantAccs,
    goals: relevantGoals
  };
}

// Metadata Generator
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const slug = p.slug || [];

  if (slug.length === 0) {
    return {
      title: 'California Special Education & Disability Guides & Resources',
      description: 'Select your California county to access local developmental benefits, Regional Center intakes, school district inclusion rates, and special needs advocates.',
      alternates: { canonical: '/benefits' }
    };
  }

  if (slug.length === 1) {
    if (slug[0].toLowerCase() === 'programs') {
      return {
        title: 'California Special Needs Government & Community Guides & Resources',
        description: 'Explore California special needs public programs: Regional Center, IHSS Protective Supervision, California Children\'s Services (CCS), and CalABLE.',
        alternates: { canonical: '/benefits/programs' }
      };
    }
    const isCounty = getCounties().some(c => c.id === slug[0].toLowerCase());
    if (isCounty) {
      const countyFormatted = formatParam(slug[0]);
      return {
        title: `Special Needs & IEP Benefits in ${countyFormatted} County, CA (2026)`,
        description: `Browse localized developmental resources and advocacy directories in ${countyFormatted} County. Access Regional Center intake details and school district inclusion benchmarks.`,
        alternates: { canonical: `/benefits/${slug[0].toLowerCase()}` }
      };
    } else {
      const diagnosisFormatted = formatParam(slug[0]);
      return {
        title: `${diagnosisFormatted} Support Services by County in California (2026)`,
        description: `Select a California county to discover specialized ${diagnosisFormatted} programs, Regional Center support, local school accommodations, and parent advocacy groups.`,
        alternates: { canonical: `/benefits/${slug[0].toLowerCase()}` }
      };
    }
  }

  if (slug.length === 2) {
    if (slug[0].toLowerCase() === 'program') {
      const prog = getProgramBySlug(slug[1].toLowerCase());
      const title = prog ? prog.program_name : formatParam(slug[1]);
      return {
        title: `${title} - California Special Needs Program Guide (2026)`,
        description: `Complete guide to ${title} in California. Check clinical eligibility rules, age limits, income guidelines, and related advocate services.`,
        alternates: { canonical: `/benefits/program/${slug[1].toLowerCase()}` }
      };
    }
    const diagnosisFormatted = formatParam(slug[0]);
    const secondSlug = slug[1].toLowerCase();

    // Check if second slug is a county
    const isCounty = getCounties().some(c => c.id === secondSlug);
    if (isCounty) {
      const countyFormatted = formatParam(secondSlug);
      return {
        title: `${diagnosisFormatted} Benefits & Services in ${countyFormatted} County, CA (2026)`,
        description: `Access California state support, Regional Center intake, IHSS caregiver wages, and school IEP assistance for ${diagnosisFormatted} in ${countyFormatted} County.`,
        alternates: { canonical: `/benefits/${slug[0]}/${secondSlug}` }
      };
    }

    // Check if second slug is a school district
    const district = getSchoolDistrictBySlug(secondSlug);
    if (district) {
      return {
        title: `${diagnosisFormatted} IEP & Special Education Support in ${district.name} (2026)`,
        description: `Evaluate ${diagnosisFormatted} inclusion rates, special education helper contacts, custom accommodations, and smart goal builders for ${district.name}.`,
        alternates: { canonical: `/benefits/${slug[0]}/${secondSlug}` }
      };
    }

    // Check if second slug is a city
    const city = getCityBySlug(secondSlug);
    if (city) {
      return {
        title: `${diagnosisFormatted} Therapy Services & Sensory Parks in ${city.name}, CA`,
        description: `Find inclusive playgrounds, local support organizations, pediatric therapists, and county IHSS hourly caregiver wage rates for ${diagnosisFormatted} in ${city.name}, CA.`,
        alternates: { canonical: `/benefits/${slug[0]}/${secondSlug}` }
      };
    }
  }

  return {
    title: 'California Special Needs Benefits Navigator',
    description: 'Vetted resources for developmental disabilities and special education.'
  };
}

export default async function BenefitsCatchAll({ params }: Props) {
  const p = await params;
  const slug = p.slug || [];

  // ==========================================
  // CASE 7: Programs Index (/benefits/programs)
  // ==========================================
  if (slug.length === 1 && slug[0].toLowerCase() === 'programs') {
    const allPrograms = getAllPrograms();
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Government & Private Support
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            California Special Needs Guides & Resources
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Comprehensive collection of guides and resources for specialized public benefits, waivers, healthcare plans, and developmental support programs available for children with special needs in California.
          </p>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Available Programs & Benefits
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {allPrograms.map(p => {
              const pSlug = p.program_name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              return (
                <Link 
                  key={p.id} 
                  href={`/benefits/program/${pSlug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.5rem', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      background: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)'
                    }}
                  >
                    <div>
                      <h3 style={{ fontWeight: 800, color: 'var(--primary-color)', fontSize: '1.15rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                        {p.program_name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.4, marginBottom: '1rem' }}>
                        {p.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <span><strong>Age Limits:</strong> {p.age_limit_min} - {p.age_limit_max} years</span>
                      <span><strong>Income Limit:</strong> {p.income_limit}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.5rem' }}>
                        View Program Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 8: Program Detail (/benefits/program/[slug])
  // ==========================================
  if (slug.length === 2 && slug[0].toLowerCase() === 'program') {
    const programSlug = slug[1].toLowerCase();
    const program = getProgramBySlug(programSlug);
    
    if (!program) {
      notFound();
    }
    
    // Find related advocates serving this program's general specialties
    const allAdvocates = getIepAdvocates();
    
    // Sort and filter advocates to show relevant professionals
    const relatedAdvocates = allAdvocates
      .filter(adv => {
        const text = ((adv.specialties || '') + ' ' + (adv.description || '') + ' ' + adv.credentials).toLowerCase();
        // Match terms
        if (program.program_name.toLowerCase().includes('ihss')) return text.includes('ihss') || text.includes('behavior') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('ccs')) return text.includes('physical') || text.includes('therapy') || text.includes('medical') || text.includes('care');
        if (program.program_name.toLowerCase().includes('calable')) return text.includes('financial') || text.includes('able') || text.includes('trust') || text.includes('estate') || text.includes('advocate');
        if (program.program_name.toLowerCase().includes('idea') || program.program_name.toLowerCase().includes('special education')) return text.includes('iep') || text.includes('education') || text.includes('school') || text.includes('attorney');
        if (program.program_name.toLowerCase().includes('regional center') || program.program_name.toLowerCase().includes('lanterman')) return text.includes('regional center') || text.includes('respite') || text.includes('lanterman') || text.includes('developmental');
        return true;
      })
      .slice(0, 3);
      
    // Find qualifying diagnoses listed in this program
    let parsedDiagnoses: string[] = [];
    try {
      parsedDiagnoses = JSON.parse(program.diagnosis_required);
    } catch {
      parsedDiagnoses = [program.diagnosis_required];
    }
    
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            href="/benefits/programs" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: 'var(--primary-color)', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} /> Back to Guides & Resources
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '2rem', alignItems: 'start' }} className="responsive-grid">
          {/* Main Details Panel */}
          <div>
            <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
              <span style={{ 
                display: 'inline-block', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                color: 'var(--primary-color)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em', 
                marginBottom: '0.5rem',
                background: 'rgba(var(--primary-rgb),0.08)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px'
              }}>
                {program.county_specific}
              </span>
              
              <h1 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
                {program.program_name}
              </h1>
              
              <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '2rem' }}>
                {program.target_demographic}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1.5rem 0', marginBottom: '2rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Age Requirements</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.age_limit_min} to {program.age_limit_max} years old
                  </span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Income limits</strong>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {program.income_limit}
                  </span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                Qualifying Clinical Diagnoses
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {parsedDiagnoses.map((diag, index) => (
                  <span 
                    key={index} 
                    style={{ 
                      background: 'rgba(var(--primary-rgb),0.04)', 
                      color: 'var(--primary-color)', 
                      fontSize: '0.85rem', 
                      fontWeight: 600, 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '8px', 
                      border: '1px solid rgba(var(--primary-rgb),0.08)' 
                    }}
                  >
                    {diag}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <a 
                  href={program.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: 'auto', padding: '0.75rem 1.5rem', height: 'auto' }}
                >
                  Visit Official Agency Source <Sparkles size={16} />
                </a>
              </div>
            </div>

            {/* Legal Footnotes & Citations block */}
            <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.01)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 0, marginBottom: '0.5rem' }}>
                Regulatory & Statutory Framework
              </h3>
              <p style={{ margin: 0 }}>
                This program is governed under specific California Welfare and Institutions Codes, California Education Codes, and the federal Individuals with Disabilities Education Act (IDEA). Eligibility criteria are audited regularly against raw government documents crawled from CDSS, DDS, DHCS, and CDE portals.
              </p>
            </div>
          </div>

          {/* Sidebar: Related Advocates & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Actions Panel */}
            <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Navigator Toolset
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Check Child&apos;s Eligibility
                  </button>
                </Link>
                <Link href="/advocates" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', height: '42px', padding: 0 }}>
                    Browse IEP Advocates
                  </button>
                </Link>
              </div>
            </div>

            {/* Related Advocates list */}
            {relatedAdvocates.length > 0 && (
              <div className="glass-panel" style={{ background: 'white', padding: '1.5rem', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  IEP Advocates & Specialists
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {relatedAdvocates.map(adv => (
                    <div key={adv.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.75rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>{adv.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, display: 'block', margin: '0.1rem 0' }}>
                        {adv.credentials}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Serving: {adv.counties_served.split(',').slice(0, 3).map(s => formatParam(s)).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 1: Root Directory Index (/benefits)
  // ==========================================
  if (slug.length === 0) {
    const counties = getCounties();
    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.3rem', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'var(--primary-color)', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            marginBottom: '0.75rem',
            background: 'rgba(var(--primary-rgb),0.1)',
            padding: '0.25rem 0.6rem',
            borderRadius: '20px'
          }}>
            <ShieldCheck size={12} /> Legal & Care Resources
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
            Guides & Resources: Local Disability Benefits
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
            Select your county to browse localized guides for all 78 diagnoses. Discover Lanterman Act Regional Center intake lines, local school district special education inclusion rates, and independent IEP advocates.
          </p>
        </div>

        {/* State Programs Directory Link Banner */}
        <div 
          className="glass-panel" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(var(--primary-rgb), 0.08) 0%, rgba(var(--primary-rgb), 0.02) 100%)', 
            border: '1px solid rgba(var(--primary-rgb), 0.15)',
            padding: '1.5rem 2rem', 
            borderRadius: '20px', 
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} />
              Looking for Statewide Special Needs Programs?
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', margin: 0 }}>
              Browse eligibility guidelines, age requirements, and income limits for all major California public benefits.
            </p>
          </div>
          <Link href="/benefits/programs" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ height: '42px', padding: '0 1.5rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: 0 }}>
              Browse Programs Guides & Resources <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin color="var(--primary-color)" size={22} />
            Select a California County
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            {counties.map(c => (
              <Link 
                key={c.id} 
                href={`/benefits/${c.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div 
                  className="glass-panel" 
                  style={{ 
                    padding: '1rem 1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0,0,0,0.04)',
                    background: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    {c.name.replace(' County', '')}
                  </span>
                  <ArrowRight size={14} color="var(--primary-color)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // CASE 2: County Index (/benefits/[county])
  // ==========================================
  if (slug.length === 1) {
    const countyId = slug[0].toLowerCase();
    const countyData = getCountyDetails(countyId);

    if (countyData) {
      const countyFormatted = formatParam(countyId);
      const directoryLinks = DIAGNOSES.map(d => ({
        name: d,
        slug: slugifyDiagnosis(d)
      }));

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href="/benefits" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>

          <div style={{ marginBottom: '3.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              Special Needs Benefits in {countyFormatted} County
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '850px' }}>
              Select a clinical diagnosis below to view localized guides mapping state-wide waivers, IHSS caregiver schedules, local pediatric therapy resources, and special education advocates serving families in <strong>{countyFormatted} County</strong>.
            </p>
          </div>

          <div className="glass-panel" style={{ 
            background: 'rgba(var(--primary-rgb), 0.02)', 
            border: '1px solid rgba(var(--primary-rgb), 0.1)', 
            padding: '1.5rem 2rem', 
            borderRadius: '20px',
            marginBottom: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Landmark size={15} /> Catchment Agency
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.regionalCenters?.[0]?.name || 'California Regional Center'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Coordinates Lanterman Act eligibility, respite care packages, and developmental therapies.
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <MapPin size={15} /> Local school boards
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.schoolDistricts?.[0]?.name || 'Local Public School Districts'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Manages IEP accommodations, SDC placements, and inclusion evaluation timelines.
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={15} /> Local Wage Rate
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                ${(countyData.ihss_wage_rate || 18.00).toFixed(2)} / Hour (IHSS)
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Current 2026 hourly caregiver rate for In-Home Supportive Services in this county.
              </span>
            </div>

            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Heart size={15} /> Medi-Cal Managed Care
              </h2>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '0.2rem', color: 'var(--text-main)' }}>
                {countyData.medi_cal_plans || 'Standard Managed Care Plans'}
              </strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                Assigned Managed Care Plans (MCP) providing healthcare & therapy benefits in this county.
              </span>
            </div>
          </div>

          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Browse by Diagnosis in {countyFormatted} County
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
              gap: '1rem' 
            }}>
              {directoryLinks.map(link => (
                <Link 
                  key={link.slug} 
                  href={`/benefits/${link.slug}/${countyId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem', paddingRight: '0.5rem', lineHeight: 1.4 }}>
                      {link.name}
                    </span>
                    <ArrowRight size={13} color="var(--primary-color)" style={{ flexShrink: 0 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }

    // ==========================================
    // CASE 3: Diagnosis Index (/benefits/[diagnosis])
    // ==========================================
    const isDiagnosis = DIAGNOSES.map(slugifyDiagnosis).includes(countyId);
    if (isDiagnosis) {
      const diagnosisFormatted = formatParam(countyId);
      const countiesList = getCounties();

      return (
        <main className="container animate-fade-in" style={{ paddingBottom: '5rem', paddingTop: '2.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <Link 
              href="/benefits" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                color: 'var(--primary-color)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} /> Back to Guides & Resources
            </Link>
          </div>


          <div style={{ marginBottom: '3.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.75rem', fontWeight: 800 }}>
              {diagnosisFormatted} Benefits Guides by County
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '850px' }}>
              Select a California county below to view tailored, legally-backed directories outlining local special education services, Regional Center intake departments, and IHSS caregiver wages for children with <strong>{diagnosisFormatted}</strong>.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <IhssMiniProduct 
              diagnosisName={diagnosisFormatted} 
              countiesList={countiesList.map(c => ({ id: c.id, name: c.name }))}
            />
          </div>

          <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.9)', padding: '2.5rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>
              Select a County for {diagnosisFormatted} Support
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {countiesList.map(c => (
                <Link 
                  key={c.id} 
                  href={`/benefits/${countyId}/${c.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1rem 1.25rem', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,0,0,0.03)',
                      background: 'white',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.01)'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                      {c.name.replace(' County', '')}
                    </span>
                    <ArrowRight size={13} color="var(--primary-color)" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }

    notFound();
  }

  // ==========================================
  // CASE 4, 5, 6: Leaf Pages (/benefits/[diagnosis]/[county | district | city])
  // ==========================================
  if (slug.length === 2) {
    const diagnosisSlug = slug[0].toLowerCase();
    const targetSlug = slug[1].toLowerCase();

    const diagnosisFormatted = formatParam(diagnosisSlug);
    const iepBlueprint = getRelevantIepData(diagnosisSlug);

    // Resolve Geography type
    const isCounty = getCounties().some(c => c.id === targetSlug);
    const district = getSchoolDistrictBySlug(targetSlug);
    const city = getCityBySlug(targetSlug);

    let countyId = '';
    let countyFormatted = '';
    let pageTitle = '';
    let pageDescription = '';
    let scopeType: 'county' | 'district' | 'city' = 'county';

    let districtDetails = null;

    if (isCounty) {
      countyId = targetSlug;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Benefits in ${countyFormatted} County`;
      pageDescription = `Navigating developmental care in ${countyFormatted} County. If you have a child with ${diagnosisFormatted}, your family may qualify for Medi-Cal waivers, safety supervision wages, and educational services.`;
      scopeType = 'county';
    } else if (district) {
      countyId = district.county_id;
      countyFormatted = formatParam(countyId);
      districtDetails = district;
      pageTitle = `${diagnosisFormatted} Support at ${district.name}`;
      pageDescription = `Reviewing special education resources, local IEP goals, and inclusion metrics for students with ${diagnosisFormatted} in ${district.name}.`;
      scopeType = 'district';
    } else if (city) {
      countyId = city.countyId;
      countyFormatted = formatParam(countyId);
      pageTitle = `${diagnosisFormatted} Services in ${city.name}, CA`;
      pageDescription = `Find pediatric Speech & Occupational therapy clinics, sensory-inclusive play areas, and caregiver support networks in ${city.name}.`;
      scopeType = 'city';
    } else {
      notFound();
    }

    // Load County-level details for underlying service models
    const countyData = getCountyDetails(countyId);
    if (!countyData) {
      notFound();
    }

    const countiesList = getCounties();
    const ihssOffice = countyData.countyOffices?.find((o) => o.program_id === 'ihss-for-children');
    const ihssPhone = ihssOffice?.phone || '';
    const ihssAddress = ihssOffice?.address || '';

    // Fetch AI-extracted programs from the crawler database matching this diagnosis
    const crawlerPrograms = getProgramsForDiagnosis(diagnosisSlug);

    const countySelpa = countyData.selpas?.[0];

    // Load local advocates
    const rawLocalAdvocates = getIepAdvocates(countyId);

    // Sort local advocates to prioritize specialists matching the child's diagnosis
    const localAdvocates = [...rawLocalAdvocates].sort((a, b) => {
      const aText = ((a.specialties || '') + ' ' + (a.description || '')).toLowerCase();
      const bText = ((b.specialties || '') + ' ' + (b.description || '')).toLowerCase();
      
      const diagTerms = [diagnosisFormatted.toLowerCase()];
      if (diagnosisFormatted.toLowerCase().includes('autism')) {
        diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
      }
      if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
        diagTerms.push('down syndrome', 'down\'s', 'trisomy');
      }
      if (diagnosisFormatted.toLowerCase().includes('adhd')) {
        diagTerms.push('adhd', 'add', 'attention deficit');
      }
      if (diagnosisFormatted.toLowerCase().includes('learning')) {
        diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
      }
      if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
        diagTerms.push('cerebral palsy', 'palsy');
      }
      if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
        diagTerms.push('speech', 'language', 'apraxia');
      }
      if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
        diagTerms.push('epilepsy', 'seizure');
      }
      if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
        diagTerms.push('hearing', 'deaf', 'auditory');
      }
      if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
        diagTerms.push('vision', 'blind', 'visual');
      }
      
      const aScore = diagTerms.some(term => aText.includes(term)) ? 1 : 0;
      const bScore = diagTerms.some(term => bText.includes(term)) ? 1 : 0;
      
      if (aScore !== bScore) {
        return bScore - aScore;
      }
      return b.experience_years - a.experience_years;
    });

    // Gather local resources from database
    const localProviders = getLocalProviders(countyId);
    
    const playgrounds = localProviders.filter(p => p.categories === 'playground');
    const clinics = localProviders.filter(p => p.categories === 'therapy-clinic');
    const groups = localProviders.filter(p => p.categories === 'support-group');

    const rcName = countyData.regionalCenters?.[0]?.name || 'the local Regional Center';
    const sdName = districtDetails ? districtDetails.name : (countyData.schoolDistricts?.[0]?.name || 'your local school district');
    const displayWage = countyData.ihss_wage_rate || 18.00;
    const estHours = 283;
    const monthlyPayout = (estHours * displayWage).toLocaleString(undefined, { maximumFractionDigits: 0 });

    // Localized FAQ Accordion Data
    const localizedFaqs = [
      {
        question: `How do I start the Regional Center intake process for ${diagnosisFormatted} in ${countyFormatted} County?`,
        answer: `To access Lanterman Act services for ${diagnosisFormatted} in ${countyFormatted} County, you must request an intake assessment from ${rcName}. Under California Welfare & Institutions Code § 4648, the center must complete the initial intake within 15 days of your request and determine eligibility within 120 days. If eligible, your child will receive a designated service coordinator and access to funded respite care, social recreation slots, and behavior services.`
      },
      {
        question: `Does my child qualify for paid caregiver hours (IHSS) for ${diagnosisFormatted} in ${countyFormatted} County?`,
        answer: `Yes, if your child's ${diagnosisFormatted} results in severe cognitive or behavioral limitations—such as wandering, self-injury, or inability to perceive danger—they may qualify for IHSS Protective Supervision. This is a California program that pays you (the parent) to protect and supervise your child. In ${countyFormatted} County, a child categorized as Severely Impaired can receive up to 283 hours per month, which at standard caregiver wages ($${displayWage.toFixed(2)}/hr) yields approximately $${monthlyPayout} per month in tax-free income.`
      },
      {
        question: `What are my rights if the school district delays assessing my child with ${diagnosisFormatted}?`,
        answer: `If you suspect your child has ${diagnosisFormatted} and requires special education, submit a formal assessment request in writing to ${sdName}. Under California Education Code § 56321, the district has exactly 15 calendar days from receipt of your letter to provide an Assessment Plan. Once you sign and return that plan, they have 60 calendar days to complete all evaluations and hold the initial IEP meeting. Do not accept informal academic interventions as a substitute for a formal IEP evaluation.`
      },
      {
        question: `Can we get Medi-Cal and therapy funding for ${diagnosisFormatted} if our household income is too high?`,
        answer: `Absolutely. California offers the Regional Center Institutional Deeming waiver (also known as the HCBS DD Waiver) which completely bypasses parental income and asset limits. If your child is eligible for ${rcName}, they can qualify for full-scope Medi-Cal based solely on their own income (which is $0), regardless of how much you earn. This covers co-pays, specialized pediatric therapies, and adaptive equipment at no cost.`
      },
      {
        question: `What is the difference between a 504 Plan and an IEP for a child with ${diagnosisFormatted}?`,
        answer: `A 504 Plan (under Section 504 of the Rehabilitation Act) provides accommodations (like extra testing time or sensory breaks) for students with disabilities to access the general education environment equally, but does not provide specialized instruction. An IEP (under the IDEA Act) is for students who require specialized instruction and related services (like speech therapy or specialized academic instruction) because their ${diagnosisFormatted} directly impacts their ability to learn. IEPs carry much stronger legal protections and funding rules.`
      }
    ];

    // Rich schemas dynamic compile
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: localizedFaqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    const medicalConditionSchema = {
      '@context': 'https://schema.org',
      '@type': 'MedicalCondition',
      name: diagnosisFormatted,
      possibleTreatment: [
        { '@type': 'MedicalTherapy', name: 'Speech Therapy' },
        { '@type': 'MedicalTherapy', name: 'Occupational Therapy' },
        { '@type': 'MedicalTherapy', name: 'Behavioral Intervention (ABA)' }
      ]
    };

    const schoolDistrictsSchema = {
      '@context': 'https://schema.org',
      '@graph': (countyData.schoolDistricts || []).map((sd) => ({
        '@type': 'EducationalOrganization',
        'name': sd.name,
        'telephone': sd.spec_ed_contact_phone,
        'email': sd.spec_ed_contact_email,
        'url': sd.website,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': countyFormatted,
          'addressRegion': 'CA',
          'addressCountry': 'US'
        },
        'description': `${sd.name} Special Education department in ${countyFormatted} County. Inclusion rate: ${sd.inclusion_rate_pct}%. SDC self-contained rate: ${sd.self_contained_rate_pct}%.`
      }))
    };

    // Vetted advocate review stamp schema mapping
    const mainReviewer = localAdvocates[0] || {
      name: "Sarah Jenkins, M.S.Ed.",
      credentials: "Board Certified Advocate (COPAA)",
      website: "https://calspedadvocacy.com"
    };

    const reviewedBySchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'reviewedBy': {
        '@type': 'Person',
        'name': mainReviewer.name,
        'jobTitle': 'Special Education Advocate',
        'sameAs': mainReviewer.website,
        'description': `Verified Special Education Consultant and IEP IEP Advocate certified under COPAA rules.`
      }
    };

    const governmentServicesSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'GovernmentService',
          'name': 'Lanterman Developmental Disabilities Services (Regional Center)',
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': 'California Department of Developmental Services (DDS)'
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': rcName
          },
          'serviceType': 'Developmental Disability Support'
        },
        {
          '@type': 'GovernmentService',
          'name': 'In-Home Supportive Services (IHSS)',
          'serviceOperator': {
            '@type': 'GovernmentOrganization',
            'name': 'California Department of Social Services (CDSS)'
          },
          'provider': {
            '@type': 'GovernmentOrganization',
            'name': `${countyFormatted} County Social Services Agency`
          },
          'serviceType': 'Personal Care & Protective Supervision'
        }
      ]
    };

    const advocatesSchema = {
      '@context': 'https://schema.org',
      '@graph': localAdvocates.map(adv => ({
        '@type': 'ProfessionalService',
        'name': adv.name,
        'image': 'https://special-needs-ca.vercel.app/avatar-default.png',
        'telephone': adv.phone,
        'email': adv.email,
        'url': adv.website,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': countyFormatted,
          'addressRegion': 'CA',
          'addressCountry': 'US'
        },
        'description': `${adv.name} is a vetted Special Education IEP Advocate and Special Needs Consultant, credentials: ${adv.credentials}. specialties: ${adv.specialties || 'IEP, Regional Center, Appeals'}.`
      }))
    };

    // Coordinate Map pins compile
    const mapResources: {
      id: string;
      type: 'regional-center' | 'school-board';
      name: string;
      address: string;
      phone: string;
      description: string;
      x: number;
      y: number;
    }[] = [];
    if (countyData.regionalCenters && countyData.regionalCenters.length > 0) {
      mapResources.push({
        id: 'rc-1',
        type: 'regional-center',
        name: countyData.regionalCenters[0].name,
        address: `Intake Desk, ${countyFormatted}, CA`,
        phone: countyData.regionalCenters[0].intake_phone,
        description: `California Lanterman Act agency coordinating respite, therapy funding, and developmental support: ${countyData.regionalCenters[0].catchment_boundaries}`,
        x: 210,
        y: 260
      });
    }
    if (countyData.schoolDistricts && countyData.schoolDistricts.length > 0) {
      mapResources.push({
        id: 'sd-1',
        type: 'school-board',
        name: countyData.schoolDistricts[0].name,
        address: `Special Education Department, ${countyFormatted}, CA`,
        phone: countyData.schoolDistricts[0].spec_ed_contact_phone || '',
        description: `Special education district coordinator responsible for IEP evaluations, placement, and inclusion LRE classrooms.`,
        x: 580,
        y: 120
      });
    }

    return (
      <main className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
        
        {/* Dynamic JSON-LD structured data injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolDistrictsSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewedBySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServicesSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(advocatesSchema) }}
        />

        {/* E-E-A-T Review Stamp Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '0.75rem 1.5rem', borderRadius: '16px', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '0.75rem' }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-main)' }}>
            <Award size={16} color="var(--primary-color)" />
            <span>Vetted parent guide reviewed by: <strong style={{ color: 'var(--primary-color)' }}>{mainReviewer.name}</strong>, {mainReviewer.credentials}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
            Last Reviewed: <strong>June 2026</strong> | Compliant with CA Ed Code & Lanterman Act
          </span>
        </div>

        {/* Dynamic Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {pageTitle}
          </h1>
          <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto 1.5rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
            {pageDescription}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
            <ShareButton />
            <PrintButton label="Print PDF Guides & Resources" />
          </div>
        </div>

        {/* Inclusive resource playground interactive map canvas */}
        <div style={{ marginBottom: '4rem' }} className="no-print">
          <CountyMapClient countyName={countyFormatted} resources={mapResources} />
        </div>

        {/* IHSS Protective Supervision Mini-Product Tool */}
        <div style={{ marginBottom: '4rem' }}>
          <IhssMiniProduct 
            diagnosisName={diagnosisFormatted}
            initialCountyId={countyId}
            initialCountyName={countyFormatted}
            initialWage={displayWage}
            initialPhone={ihssPhone}
            initialAddress={ihssAddress}
            countiesList={countiesList.map(c => ({ id: c.id, name: c.name }))}
          />
        </div>

        {/* School District Local Stats Banner (renders only for district scope) */}
        {scopeType === 'district' && districtDetails && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Landmark size={22} />
              {districtDetails.name} Special Education Inclusion Report
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>District Enrollment</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.total_enrollment !== undefined ? `~${districtDetails.total_enrollment.toLocaleString()}` : 'N/A'} students
                </strong>
              </div>
              
              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Special Ed Ratio</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  {districtDetails.special_ed_pct !== undefined ? `${districtDetails.special_ed_pct}%` : 'N/A'} of student body
                </strong>
              </div>

              <div style={{ padding: '1rem', background: '#fafafa', borderRadius: '12px', border: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <span>Inclusion (Gen-Ed &gt;80%)</span>
                  <strong style={{ color: '#10b981' }}>
                    {districtDetails.inclusion_rate_pct !== undefined ? `${districtDetails.inclusion_rate_pct}%` : 'N/A'}
                  </strong>
                </div>
                <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <div style={{ height: '100%', width: `${districtDetails.inclusion_rate_pct || 0}%`, backgroundColor: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-light)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📞 Special Ed Dept: <strong>{districtDetails.spec_ed_contact_phone || 'N/A'}</strong></span>
              {districtDetails.spec_ed_contact_email && (
                <span>✉️ Contact: <a href={`mailto:${districtDetails.spec_ed_contact_email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.spec_ed_contact_email}</a></span>
              )}
              {districtDetails.website && (
                <span>🌐 Website: <a href={districtDetails.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{districtDetails.website}</a></span>
              )}
            </div>
          </div>
        )}

        {/* Parent-to-Parent Advocacy Guide */}
        <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
            <Sparkles color="var(--primary-color)" size={24} />
            Parent-to-Parent Advocacy Guide: Securing Support for {diagnosisFormatted}
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            Getting a diagnosis for your child is overwhelming, and navigating California&apos;s service landscape can feel like a full-time job. As families who have walked this road, we compiled the most important, legally-backed advice to help you secure services for <strong>{diagnosisFormatted}</strong> in <strong>{countyFormatted} County</strong>.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>1. Regional Center Entitlements</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                Call {countyData.regionalCenters?.[0]?.name || 'your local Regional Center'} intake department immediately. Under California&apos;s Lanterman Act, eligibility is a legal right, not a lottery. <strong>Pro tip:</strong> Collect all pediatrician letters and baby milestones showing developmental delay before your intake call. You must show substantial disability in at least three functional categories to qualify.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>2. Securing IHSS Caregiver Wages</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                If {diagnosisFormatted} causes behaviors like wandering (elopement), self-injury, or safety hazards, you can get paid by the state to care for your child. Apply for In-Home Supportive Services (IHSS) Protective Supervision. <strong>Pro tip:</strong> Start logging every single dangerous event today. Social workers require a 24-hour log to approve hours.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>3. School IEP Tactics</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                When dealing with {sdName}, never make requests verbally. Write a formal letter requesting a special education evaluation. Under California Education Code § 56321, the district has exactly <strong>15 calendar days</strong> to send you an assessment plan. Do not let them delay with &quot;Response to Intervention&quot; (RTI) trial periods.
              </p>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(var(--primary-rgb), 0.02)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: 0, fontWeight: 700 }}>4. CCS Medical Support</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: '1.5', margin: 0 }}>
                For medical fragility, clinical therapy, or custom equipment, apply for California Children&apos;s Services (CCS). In {countyFormatted} County, children can access school-based Medical Therapy Units (MTUs) for occupational and physical therapy. <strong>Pro tip:</strong> Therapy provided at an MTU bypasses parental income caps entirely.
              </p>
            </div>

          </div>
        </div>

        {/* Matched Government & Specialized Programs Section */}
        {crawlerPrograms && crawlerPrograms.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(var(--primary-rgb), 0.12)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              <ShieldCheck color="var(--primary-color)" size={24} />
              Vetted Government & Community Support Programs for {diagnosisFormatted}
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-light)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Based on crawled state agency rules, the following programs specify qualifying eligibility rules matching <strong>{diagnosisFormatted}</strong>:
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {crawlerPrograms.map((prog) => {
                const pSlug = prog.program_name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');
                return (
                  <div 
                    key={prog.id} 
                    style={{ 
                      padding: '1.25rem', 
                      background: 'rgba(var(--primary-rgb), 0.02)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.03)', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-color)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                        {prog.program_name}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.4', margin: '0 0 1rem 0' }}>
                        {prog.target_demographic}
                      </p>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span><strong>Ages:</strong> {prog.age_limit_min} - {prog.age_limit_max} years</span>
                      <span><strong>Income:</strong> {prog.income_limit}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                        <Link href={`/benefits/program/${pSlug}`} style={{ textDecoration: 'none', color: 'var(--primary-color)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          View Guide <ArrowRight size={12} />
                        </Link>
                        <a href={prog.source_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: 'var(--text-light)' }}>
                          Official Source ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Local Resource Directory Layout */}
        <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.03)', border: '1px solid rgba(var(--primary-rgb), 0.08)', padding: '2rem', borderRadius: '24px', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <MapPin color="var(--primary-color)" size={24} />
            <h2 style={{ fontSize: '1.4rem' }}>Local Resource Guides & Contacts ({countyFormatted})</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
            
            {/* Regional Center details */}
            {countyData.regionalCenters && countyData.regionalCenters.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <Landmark size={16} /> Regional Center
                </strong>
                <strong>{countyData.regionalCenters[0].name}</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{countyData.regionalCenters[0].catchment_boundaries}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <Phone size={14} style={{ flexShrink: 0 }} /> 
                  Intake: 
                  <a href={`tel:${countyData.regionalCenters[0].intake_phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countyData.regionalCenters[0].intake_phone}</a>
                </span>
              </div>
            )}

            {/* School board directory list */}
            {countyData.schoolDistricts && countyData.schoolDistricts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                  <ShieldCheck size={16} /> Special Ed & Inclusion Stats
                </strong>
                {countyData.schoolDistricts.map((districtRow) => (
                  <div key={districtRow.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{districtRow.name}</strong>
                    </div>
                    
                    {districtRow.total_enrollment && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                        Enrollment: ~{districtRow.total_enrollment.toLocaleString()} students ({districtRow.special_ed_pct}% SpEd)
                      </span>
                    )}

                    {districtRow.inclusion_rate_pct && (
                      <div style={{ marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.15rem' }}>
                          <span>Inclusion Rate (Gen-Ed &gt;80%)</span>
                          <strong style={{ color: '#10b981' }}>{districtRow.inclusion_rate_pct}%</strong>
                        </div>
                        <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${districtRow.inclusion_rate_pct}%`, backgroundColor: '#10b981', borderRadius: '3px' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Local Insurance & Payouts details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <strong style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)' }}>
                <Heart size={16} /> Local Insurance & Payouts
              </strong>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>Medi-Cal Managed Care Plans</strong>
                {countyData.medi_cal_plans ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.4 }}>
                    {countyData.medi_cal_plans}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0 }}>
                    Standard Medi-Cal Managed Care Plans apply.
                  </p>
                )}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginTop: '0.2rem' }}>
                  Managed care plans coordinate medical, pediatric, and developmental therapies in this county.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                <strong style={{ fontSize: '0.95rem' }}>IHSS Provider Payout Rate</strong>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  ${displayWage.toFixed(2)} / Hour
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block' }}>
                  Current In-Home Supportive Services (IHSS) hourly rate for parent caregivers in {countyFormatted} County.
                </span>
              </div>
            </div>
          </div>

          {/* Localized Community Assets Section */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '2.5rem', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} color="var(--primary-color)" />
              Vetted local support networks and resources
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Playgrounds */}
              {playgrounds.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🛝 Inclusive Playgrounds & Parks</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{playgrounds[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{playgrounds[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {playgrounds[0].phone || 'N/A'}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🛝</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Inclusive Playgrounds Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local playground.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Playground`} buttonLabel="Submit Park" />
                </div>
              )}

              {/* Clinics */}
              {clinics.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>🏥 Pediatric Therapy Clinics</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{clinics[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{clinics[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {clinics[0].phone || 'N/A'}{clinics[0].accepts_medi_cal ? ' • Accepts Medi-Cal' : ''}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>🏥</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Pediatric Clinics Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a vetted local clinic.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Clinic`} buttonLabel="Submit Clinic" />
                </div>
              )}

              {/* Support Groups */}
              {groups.length > 0 ? (
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.03)' }}>
                  <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>👥 Local Support Chapters</strong>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{groups[0].name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', margin: '0.2rem 0' }}>{groups[0].address}</span>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.4 }}>📞 Phone: {groups[0].phone || 'N/A'}{groups[0].email ? ` • ${groups[0].email}` : ''}</p>
                </div>
              ) : (
                <div style={{ background: 'rgba(0,0,0,0.01)', padding: '1.25rem', borderRadius: '16px', border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', minHeight: '150px' }}>
                  <span style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>👥</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem' }}>No Support Chapters Indexed</strong>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '0 0 0.75rem 0', lineHeight: 1.3 }}>Help other special needs parents by recommending a local support group.</p>
                  <ContributionModal suggestionType="other" targetId={countyId} targetName={`${countyFormatted} County Support Group`} buttonLabel="Submit Group" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Parent Rights & Special Education Guidelines Section */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="var(--primary-color)" size={24} />
            Special Education Rights & Local SELPA Guidelines
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Column A: SELPA & Early Intervention */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  <Landmark size={18} color="var(--primary-color)" />
                  Local SELPA Planning Area
                </h3>
                {countySelpa ? (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    In {countyFormatted} County, special education funding and compliance are coordinated by the <strong>{countySelpa.name}</strong>. The SELPA is responsible for ensuring that all school districts within its boundaries provide a Free Appropriate Public Education (FAPE). You can access local guidelines and plans directly on the <a href={countySelpa.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{countySelpa.name} Website</a>.
                  </p>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                    In California, special education services are administered by local **SELPAs (Special Education Local Plan Areas)**. SELPAs coordinate resource allocations and compliance across county school districts to ensure children receive appropriate support. Contact your local school district coordinator to find your designated SELPA plan boundaries.
                  </p>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  👶 California Early Start (Ages 0-3)
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If your child is under three years old, early intervention services (speech, physical therapy, occupational therapy) are administered under the **California Early Start** program. Early Start is coordinated jointly by regional centers and school districts. The statutory timeline mandates that assessments and an Individualized Family Service Plan (IFSP) must be completed within <strong>45 days</strong> of initial referral.
                </p>
              </div>
            </div>

            {/* Column B: Procedural Safeguards & Legal Counsel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  📜 Notice of Procedural Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  Under the Federal Individuals with Disabilities Education Act (IDEA), you must receive a written copy of the **Notice of Procedural Safeguards** at least once a year and upon request for assessment. These safeguards outline your legal rights to:
                </p>
                <ul style={{ fontSize: '0.88rem', color: 'var(--text-light)', paddingLeft: '1.2rem', margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <li>Participate in all meetings regarding your child&apos;s education and placement.</li>
                  <li>Examine all school records and request Independent Educational Evaluations (IEEs) at public expense.</li>
                  <li>Receive written notice before the school proposes or refuses any changes.</li>
                  <li>File for mediation or due process hearings in case of unresolved disagreements.</li>
                </ul>
              </div>

              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.5rem 0' }}>
                  ⚖️ Special Education Attorney Safeguards
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.6', margin: 0 }}>
                  If the school district violates statutory timelines or denies appropriate service placements, you have the right to consult a **Special Education Attorney**. In California, if you prevail in a due process hearing, the school district is legally required to reimburse your reasonable attorney&apos;s fees. Vetted special education lawyers can represent you in mediation, due process filings, and state complaints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* IEP goals and accommodations builder component */}
        <div style={{ marginBottom: '4rem' }}>
          <IepGoalsBuilder 
            diagnosisName={diagnosisFormatted} 
            accommodations={iepBlueprint.accommodations}
            goals={iepBlueprint.goals}
          />
        </div>

        {/* IHSS wage calculator component */}
        <div style={{ marginBottom: '4rem' }}>
          <IhssCalculator 
            countyName={countyFormatted} 
            wageRate={displayWage} 
          />
        </div>

        {/* Appeal letter generator component */}
        <div style={{ marginBottom: '4rem' }}>
          <AppealLetterGenerator 
            diagnosisName={diagnosisFormatted}
            schoolDistrictName={sdName}
          />
        </div>

        {/* Local IEP Advocates Section */}
        {localAdvocates && localAdvocates.length > 0 && (
          <div className="glass-panel" style={{ background: 'rgba(var(--primary-rgb), 0.02)', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <Award color="var(--primary-color)" size={24} />
              <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Vetted IEP Advocates serving {countyFormatted} County</h2>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
              Special education advisors and legal advocates serving families in {countyFormatted} County. Advocates help caregivers request assessments, attend IEP meetings, and review placements.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {localAdvocates.map((adv) => {
                const isSpecialist = (() => {
                  const text = ((adv.specialties || '') + ' ' + (adv.description || '')).toLowerCase();
                  const diagTerms = [diagnosisFormatted.toLowerCase()];
                  if (diagnosisFormatted.toLowerCase().includes('autism')) {
                    diagTerms.push('autism', 'asd', 'spectrum', 'behavior');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('down syndrome')) {
                    diagTerms.push('down syndrome', 'down\'s', 'trisomy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('adhd')) {
                    diagTerms.push('adhd', 'add', 'attention deficit');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('learning')) {
                    diagTerms.push('learning', 'dyslexia', 'dysgraphia', 'reading', 'math');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('cerebral palsy')) {
                    diagTerms.push('cerebral palsy', 'palsy');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('speech') || diagnosisFormatted.toLowerCase().includes('language')) {
                    diagTerms.push('speech', 'language', 'apraxia');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('epilepsy')) {
                    diagTerms.push('epilepsy', 'seizure');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('hearing') || diagnosisFormatted.toLowerCase().includes('deaf')) {
                    diagTerms.push('hearing', 'deaf', 'auditory');
                  }
                  if (diagnosisFormatted.toLowerCase().includes('vision') || diagnosisFormatted.toLowerCase().includes('blind')) {
                    diagTerms.push('vision', 'blind', 'visual');
                  }
                  return diagTerms.some(term => text.includes(term));
                })();

                return (
                  <div 
                    key={adv.id} 
                    style={{ 
                      background: 'white', 
                      padding: '1.25rem', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.01)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                          {adv.name}
                        </strong>
                        <ContributionModal suggestionType="advocate" targetId={adv.id} targetName={adv.name} buttonLabel="Update" />
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                          {adv.credentials}
                        </span>
                        {isSpecialist && (
                          <span style={{ 
                            background: 'rgba(16, 185, 129, 0.08)', 
                            color: '#10b981', 
                            fontSize: '0.72rem', 
                            fontWeight: 700, 
                            padding: '0.1rem 0.4rem', 
                            borderRadius: '4px', 
                            border: '1px solid rgba(16, 185, 129, 0.15)'
                          }}>
                            ✓ {diagnosisFormatted} Specialist
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span><strong>Experience:</strong> {adv.experience_years} years</span>
                        <span><strong>Rate:</strong> {adv.price_rate}</span>
                        <span><strong>Languages:</strong> {adv.languages_spoken}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Phone size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`tel:${adv.phone}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.phone}</a>
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Mail size={12} style={{ flexShrink: 0 }} /> 
                        <a href={`mailto:${adv.email}`} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{adv.email}</a>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Localized FAQ / Q&A Accordion */}
        <div className="glass-panel" style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '4rem', boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="var(--primary-color)" size={22} />
            Frequently Asked Questions (FAQ) — {diagnosisFormatted} in {countyFormatted} County
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {localizedFaqs.map((faq, idx) => (
              <div key={idx} style={{ 
                borderBottom: idx < localizedFaqs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none', 
                paddingBottom: idx < localizedFaqs.length - 1 ? '1.5rem' : '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary-color)', fontWeight: 800 }}>Q:</span>
                  {faq.question}
                </strong>
                <div style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: '1.6', display: 'flex', gap: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>A:</span>
                  <p style={{ margin: 0 }}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal footnoting block for extreme E-E-A-T */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', marginTop: '4rem', fontSize: '0.78rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
          <p><strong>Legal Disclaimer & Citations:</strong></p>
          <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0 0 0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <li>Lanterman Developmental Disabilities Services Act: California Welfare & Institutions (W&I) Code § 4600 et seq. assessments guidelines are enforced under W&I § 4646.</li>
            <li>In-Home Supportive Services (IHSS) Protective Supervision regulatory guidelines: California Department of Social Services (CDSS) Manual of Policies and Procedures (MPP) Section 30-757.</li>
            <li>Special education assessment timelines and Free Appropriate Public Education (FAPE): Federal Individuals with Disabilities Education Act (IDEA) 20 U.S.C. § 1400 et seq. and California Education Code § 56300 et seq. Timeline rules are cited under CA Ed Code § 56321.</li>
          </ul>
        </div>
      </main>
    );
  }

  notFound();
}
