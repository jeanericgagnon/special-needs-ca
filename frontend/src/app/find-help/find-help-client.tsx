'use client';

import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
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
  Search,
  ArrowRight,
  Compass,
  CheckCircle2,
  Shield,
  Languages,
  ClipboardList,
  Bookmark,
  Trash2
} from 'lucide-react';
import { stateConfigs } from '@/lib/stateConfigs';
import { DirectoryFoundationSnapshot } from '@/lib/db';
import SourceFreshnessDisclosure, { type DisclosureSource } from '@/app/components/SourceFreshnessDisclosure';
import {
  getDirectoryFieldCoverage,
  getDirectoryAvailabilityDisplayLabel,
  getStalenessLabel,
  hasDirectorySampleAccessibilitySummary,
  hasDirectorySampleNextStepSummary,
  isMeaningfulDirectoryEmail,
  isMeaningfulDirectoryPhone,
  isRenderableDirectoryFoundationRecord,
  parseDirectoryList,
} from '@/lib/directoryFoundation';
import { getSavedDirectoryResources, removeSavedDirectoryResource, type SavedDirectoryResource } from '@/lib/savedResources';
import { trackDirectoryAnalyticsEvent } from '@/lib/directoryAnalytics';
import { CORE_CA_LAUNCH_REVIEWED_DATE } from '@/lib/launchSurfaceReviewDates';

type FindHelpClientProps = {
  foundationSnapshot: DirectoryFoundationSnapshot;
};

const FIND_HELP_SOURCE_CONFIDENCE = 0.95;

const FIND_HELP_CORE_SOURCES: DisclosureSource[] = [
  {
    name: 'California Department of Developmental Services regional center information',
    url: 'https://www.dds.ca.gov/rc/',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: FIND_HELP_SOURCE_CONFIDENCE,
    lastReviewedDate: CORE_CA_LAUNCH_REVIEWED_DATE,
  },
  {
    name: 'California Department of Education special education information',
    url: 'https://www.cde.ca.gov/sp/se/',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: FIND_HELP_SOURCE_CONFIDENCE,
    lastReviewedDate: CORE_CA_LAUNCH_REVIEWED_DATE,
  },
  {
    name: 'California Department of Social Services IHSS program information',
    url: 'https://www.cdss.ca.gov/in-home-supportive-services',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: FIND_HELP_SOURCE_CONFIDENCE,
    lastReviewedDate: CORE_CA_LAUNCH_REVIEWED_DATE,
  },
  {
    name: 'California Department of Health Care Services Medi-Cal for Kids & Teens',
    url: 'https://www.dhcs.ca.gov/services/medi-cal/eligibility/Pages/Children.aspx',
    verificationStatus: 'official_verified',
    sourceType: 'official_state',
    confidenceScore: FIND_HELP_SOURCE_CONFIDENCE,
    lastReviewedDate: CORE_CA_LAUNCH_REVIEWED_DATE,
  },
];

function formatTag(tag: string) {
  return tag
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRecordReviewedDate(record: DirectoryFoundationSnapshot['samples']['providers'][number] | DirectoryFoundationSnapshot['samples']['nonprofits'][number] | DirectoryFoundationSnapshot['samples']['advocates'][number]) {
  const lastVerifiedAt = 'last_verified_at' in record ? record.last_verified_at : null;
  const checkedAt = 'checked_at' in record ? record.checked_at : null;
  return record.last_verified_date || lastVerifiedAt || record.last_scraped_at || checkedAt || null;
}

export default function FindHelpClient({ foundationSnapshot }: FindHelpClientProps) {
  const [stateId, setStateId] = useState('california');
  const [hubSearchQuery, setHubSearchQuery] = useState('');
  const [savedResources, setSavedResources] = useState<SavedDirectoryResource[]>(() => (
    typeof window === 'undefined' ? [] : getSavedDirectoryResources()
  ));
  const deferredHubSearchQuery = useDeferredValue(hubSearchQuery);
  const hasMountedSearchRef = useRef(false);

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
      title: 'Benefits Matcher Guide',
      category: 'Benefits',
      icon: <Wand2 size={24} color="#0f766e" />,
      description: 'Review the public benefits-matcher landing page to see how diagnosis, age, county, and support needs turn into source-backed programs, forms, deadlines, and appeal paths before you save a private plan.',
      href: '/benefits-matcher',
      actionText: 'Review Matcher'
    },
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
      description: `Browse the county-mapped directories of special education advocates and disability-focused attorneys in ${stateConfig.name} to help prepare school accommodation requests.`,
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
        ? 'Estimate California assessment-plan and initial-IEP timing, then confirm the current district or state special-education timeline before relying on a deadline.'
        : stateConfig.code === 'FL'
        ? 'Calculate Florida special education assessment and eligibility timelines (60 school days) under FAC Rule 6A-6.0331.'
        : stateConfig.code === 'TX'
        ? 'Calculate Texas school district evaluation (45 school days) and ARD/IEP meeting (30 days) timelines under TEA guidelines.'
        : 'Estimate school-district evaluation and initial-IEP timing, then confirm the current state or district rules before relying on a deadline.',
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
      description: stateConfig.code === 'CA'
        ? `Review source-backed California forms, state portal PDFs, and parent request templates tied to ${stateConfig.medicaidName}, early intervention, and appeal workflows.`
        : `Review the current verification-hold forms hub for ${stateConfig.name}. We only publish a full public forms directory after we confirm source URLs, signer requirements, and submission routes from the publishing agency.`,
      href: `/forms?state=${stateId}`,
      actionText: 'Get State Forms'
    },
    {
      title: 'County Resources Directory',
      category: 'County Resources',
      icon: <MapPin size={24} color="#db2777" />,
      description: stateConfig.code === 'CA'
        ? `Review currently published county intake offices, school district routing, and local disability support contacts across ${stateConfig.name}.`
        : `Open the county directory surface for ${stateConfig.name}. Some states still keep county pages gated while local office, district, or routing evidence is being reverified.`,
      href: `/counties/${stateId}`,
      actionText: 'Explore Counties'
    }
  ];

  const sampleRecords = [
    ...foundationSnapshot.samples.providers.map((record) => ({ kind: 'Provider', record })),
    ...foundationSnapshot.samples.nonprofits.map((record) => ({ kind: 'Nonprofit', record })),
    ...foundationSnapshot.samples.advocates.map((record) => ({ kind: 'Advocate', record })),
  ].filter(({ record }) => isRenderableDirectoryFoundationRecord(record));

  const trimmedHubSearchQuery = deferredHubSearchQuery.trim().toLowerCase();
  const filteredTools = tools.filter((tool) => {
    if (!trimmedHubSearchQuery) return true;
    return [
      tool.title,
      tool.category,
      tool.description,
      tool.actionText,
    ].some((value) => value.toLowerCase().includes(trimmedHubSearchQuery));
  });

  const filteredSampleRecords = sampleRecords.filter(({ kind, record }) => {
    if (!trimmedHubSearchQuery) return true;

    const serviceTags = parseDirectoryList(record.service_tags).join(' ');
    const servingTags = parseDirectoryList(record.serving_tags).join(' ');
    const languages = 'languages' in record ? record.languages : ('languages_spoken' in record ? record.languages_spoken : '');

    return [
      kind,
      record.name,
      record.next_step_label,
      record.next_step_type,
      record.accessibility_notes,
      serviceTags,
      servingTags,
      languages,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(trimmedHubSearchQuery));
  });

  const disclosureSources: DisclosureSource[] = Array.from(
    new Map(
      [
        ...FIND_HELP_CORE_SOURCES.map((source) => [`${source.url}|${source.name}`, source] as const),
        ...sampleRecords
          .filter(({ record }) => Boolean(record.source_url))
          .map(({ kind, record }) => [
            `${record.source_url}|${record.name}`,
            {
              name: `${kind}: ${record.name}`,
              url: record.source_url || undefined,
              lastReviewedDate: getRecordReviewedDate(record),
              verificationStatus: record.verification_status || 'unverified',
              sourceType: record.source_type || record.data_origin || 'directory_record',
              confidenceScore: typeof record.confidence_score === 'number' ? record.confidence_score : null,
            } satisfies DisclosureSource,
          ] as const),
      ]
    ).values()
  ).slice(0, 8);

  const hubSearchResultCount = filteredTools.length + filteredSampleRecords.length;

  useEffect(() => {
    if (!hasMountedSearchRef.current) {
      hasMountedSearchRef.current = true;
      if (!trimmedHubSearchQuery) return;
    }

    const timeout = window.setTimeout(() => {
      trackDirectoryAnalyticsEvent({
        event: 'directory_search',
        stateId,
        pageType: 'find_help',
        searchQuery: trimmedHubSearchQuery || undefined,
        resultCount: hubSearchResultCount,
      });

      if (hubSearchResultCount === 0) {
        trackDirectoryAnalyticsEvent({
          event: 'directory_no_results',
          stateId,
          pageType: 'find_help',
          searchQuery: trimmedHubSearchQuery || undefined,
          resultCount: 0,
        });

        if (trimmedHubSearchQuery) {
          trackDirectoryAnalyticsEvent({
            event: 'directory_dead_end',
            stateId,
            pageType: 'find_help',
            searchQuery: trimmedHubSearchQuery,
            resultCount: 0,
          });
        }
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [hubSearchResultCount, stateId, trimmedHubSearchQuery]);

  const handleRemoveSavedResource = (resource: SavedDirectoryResource) => {
    removeSavedDirectoryResource(resource.id, resource.recordType);
    setSavedResources(getSavedDirectoryResources());
  };

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
          Review source-backed tools, timeline helpers, and structured directory examples. Local directory depth still varies by state and county, so confirm details against the cited source before relying on them.
        </p>
      </div>

      <section
        className="glass-panel"
        style={{
          padding: '1.5rem 1.75rem',
          borderRadius: '20px',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.18)',
          marginBottom: '1.5rem',
        }}
      >
        <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#92400e' }}>Important note</strong>
        <p style={{ margin: 0, lineHeight: 1.6, color: '#92400e' }}>
          This hub stays <strong>noindex</strong> while we keep verifying local directory depth, contact routes, accessibility details, and next-step instructions. We only show reviewed public listings here, and you should still confirm the current source, county coverage, and intake path before relying on a local resource.
        </p>
      </section>

      <div
        className="glass-panel"
        style={{
          padding: '1.75rem 2rem',
          borderRadius: '24px',
          marginBottom: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.35rem' }}>Directory Records</div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800 }}>{(foundationSnapshot.totals.providers + foundationSnapshot.totals.nonprofits + foundationSnapshot.totals.advocates).toLocaleString()}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>providers, nonprofits, and advocates in the current model</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700 }}><CheckCircle2 size={16} color="var(--primary-color)" /> Availability</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{foundationSnapshot.structuredCoverage.availability.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>records carrying availability, waitlist, funding, or checked freshness signals</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700 }}><ClipboardList size={16} color="var(--primary-color)" /> Next Steps</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{foundationSnapshot.structuredCoverage.nextSteps.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>records with intake or action routing fields</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700 }}><Languages size={16} color="var(--primary-color)" /> Accessibility</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{foundationSnapshot.structuredCoverage.accessibility.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>records with language, modality, or access notes</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700 }}><Shield size={16} color="var(--primary-color)" /> Access Gaps</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{foundationSnapshot.trustFlags.trustedRowsMissingAccessibility.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>trusted public rows still missing all accessibility signals</div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 700 }}><Shield size={16} color="var(--primary-color)" /> Trust Flags</div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.2rem' }}>{foundationSnapshot.trustFlags.manualReviewRequired.toLocaleString()}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>records explicitly marked for manual review</div>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: '1.2rem 1.35rem',
          borderRadius: '20px',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ minWidth: '180px' }}>
          <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-light)', marginBottom: '0.3rem' }}>
            Search This Hub
          </div>
          <div style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
            Filter parent tools and live directory samples without touching private data.
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '0.95rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={hubSearchQuery}
            onChange={(e) => setHubSearchQuery(e.target.value)}
            placeholder="Search tools, supports, tags, and sample resources"
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.7rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              background: 'white',
            }}
          />
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', minWidth: '140px', textAlign: 'right' }}>
          {hubSearchResultCount.toLocaleString()} visible matches
        </div>
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
            Updates labels and guidance below using the currently published state agencies, timelines, and forms.
          </p>
        </div>
        
        <div style={{ width: '100%', maxWidth: '300px' }}>
          <select 
            value={stateId} 
            onChange={(e) => setStateId(e.target.value)}
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

      <section style={{ marginBottom: '3.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Saved Resources</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', margin: '0.45rem 0 0 0', maxWidth: '760px', lineHeight: 1.6 }}>
              Resources saved from public directory cards stay in this browser only. No child profile or private case data is attached to this list.
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
            {savedResources.length.toLocaleString()} saved locally
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '0.95rem 1.1rem',
            borderRadius: '18px',
            marginBottom: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          <div style={{ fontSize: '0.88rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--text-main)' }}>Saved from county and diagnosis pages:</strong> use the
            {' '}<span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Save resource</span>{' '}
            button on public directory cards, then come back here for quick return visits.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
            <Link
              href={`/counties/${stateId}`}
              style={{
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary-color)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.14)',
                borderRadius: '999px',
                padding: '0.45rem 0.75rem',
              }}
            >
              Browse county pages
            </Link>
            <Link
              href={`/benefits/${stateId}`}
              style={{
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--primary-color)',
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.14)',
                borderRadius: '999px',
                padding: '0.45rem 0.75rem',
              }}
            >
              Browse diagnosis pages
            </Link>
          </div>
        </div>

        {savedResources.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bookmark size={18} color="var(--text-light)" />
            <span style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
              Save a provider, nonprofit, or advocate from a county or diagnosis directory card and it will show up here for quick return visits.
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {savedResources.map((resource) => (
              <article
                key={`${resource.recordType}-${resource.id}`}
                className="glass-panel"
                style={{ padding: '1.1rem 1.15rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {formatTag(resource.recordType)}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>{resource.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSavedResource(resource)}
                    style={{
                      border: '1px solid rgba(220, 38, 38, 0.14)',
                      background: 'rgba(255,255,255,0.96)',
                      color: '#b91c1c',
                      borderRadius: '999px',
                      padding: '0.32rem 0.55rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
                  {resource.stateId && <div><strong style={{ color: 'var(--text-main)' }}>State:</strong> {formatTag(resource.stateId)}</div>}
                  {resource.countyId && <div><strong style={{ color: 'var(--text-main)' }}>County:</strong> {formatTag(resource.countyId)}</div>}
                  {resource.verificationStatus && <div><strong style={{ color: 'var(--text-main)' }}>Trust:</strong> {formatTag(resource.verificationStatus)}</div>}
                </div>

                {(resource.phone || resource.email || resource.website || resource.sourceUrl) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
                    {resource.phone && <span>{resource.phone}</span>}
                    {resource.email && <span>{resource.email}</span>}
                    {resource.originPath && (
                      <Link href={resource.originPath} style={{ color: 'var(--primary-color)', textDecoration: 'underline', fontWeight: 600 }}>
                        Back to this page
                      </Link>
                    )}
                    {resource.website && (
                      <a href={resource.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                        Visit website
                      </a>
                    )}
                    {!resource.website && !resource.originPath && resource.sourceUrl && (
                      <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                        View source
                      </a>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>
                  Saved {new Date(resource.savedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: '3.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Live Directory Foundation</h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', margin: '0.45rem 0 0 0', maxWidth: '760px', lineHeight: 1.6 }}>
              This section only shows structured fields that already exist on sourced records. Empty, unsupported, or synthetic fields stay hidden.
            </p>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
            Missing source URLs: {foundationSnapshot.trustFlags.recordsMissingSourceUrl.toLocaleString()} | Unsupported claim flags: {foundationSnapshot.trustFlags.unsupportedClaimsFlagged.toLocaleString()} | Trusted rows missing accessibility: {foundationSnapshot.trustFlags.trustedRowsMissingAccessibility.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredSampleRecords.length === 0 && (
            <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px' }}>
              <strong style={{ display: 'block', marginBottom: '0.4rem' }}>
                {trimmedHubSearchQuery ? 'No live directory samples match this search yet' : 'No public-safe structured samples yet'}
              </strong>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
                {trimmedHubSearchQuery
                  ? 'Try a broader term like respite, autism, education, or advocacy to surface matching structured examples.'
                  : 'The model now supports availability, intake, tags, accessibility, and claim groundwork. This section stays sparse until sourced records carry those fields.'}
              </span>
            </div>
          )}
          {filteredSampleRecords.map(({ kind, record }) => {
            const coverage = getDirectoryFieldCoverage(record);
            const serviceTags = parseDirectoryList(record.service_tags).slice(0, 4);
            const servingTags = parseDirectoryList(record.serving_tags).slice(0, 3);
            const lastChecked = getStalenessLabel(record);
            const languages = 'languages' in record ? record.languages : ('languages_spoken' in record ? record.languages_spoken : null);
            const availabilityLabel = getDirectoryAvailabilityDisplayLabel(record);
            const showNextStepSummary = hasDirectorySampleNextStepSummary(record);
            const showAccessibilitySummary = hasDirectorySampleAccessibilitySummary(record);
            const publicNextStepPhone = isMeaningfulDirectoryPhone(record.next_step_phone) ? record.next_step_phone : null;
            const publicNextStepEmail = isMeaningfulDirectoryEmail(record.next_step_email) ? record.next_step_email : null;

            return (
              <article
                key={`${kind}-${record.id}`}
                className="glass-panel"
                style={{ padding: '1.25rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kind}</div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0.2rem 0 0 0' }}>{record.name}</h3>
                  </div>
                  {availabilityLabel && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.55rem', borderRadius: '999px', background: 'rgba(15, 118, 110, 0.08)', color: '#0f766e' }}>
                      {availabilityLabel}
                    </span>
                  )}
                </div>

                {serviceTags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {serviceTags.map((tag) => (
                      <span key={tag} style={{ fontSize: '0.74rem', padding: '0.25rem 0.45rem', borderRadius: '999px', background: 'rgba(59, 130, 246, 0.08)', color: '#2563eb' }}>
                        {formatTag(tag)}
                      </span>
                    ))}
                  </div>
                )}

                {servingTags.length > 0 && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--text-main)' }}>Serves:</strong> {servingTags.map(formatTag).join(', ')}
                  </div>
                )}

                {showNextStepSummary && (
                  <div style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>
                    <strong>Next step:</strong>{' '}
                    {record.next_step_label || (record.next_step_type ? formatTag(record.next_step_type) : null)}
                    {publicNextStepPhone ? ` • ${publicNextStepPhone}` : ''}
                    {publicNextStepEmail ? ` • ${publicNextStepEmail}` : ''}
                  </div>
                )}

                {showAccessibilitySummary && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', lineHeight: 1.55 }}>
                    {languages && <div><strong style={{ color: 'var(--text-main)' }}>Languages:</strong> {languages}</div>}
                    {record.accessibility_notes && <div><strong style={{ color: 'var(--text-main)' }}>Access:</strong> {record.accessibility_notes}</div>}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                  {coverage.hasAvailability && <span>Availability tracked</span>}
                  {coverage.hasTags && <span>Tagged</span>}
                  {coverage.hasClaimGroundwork && <span>Claim groundwork present</span>}
                  {lastChecked && <span>Freshness: {lastChecked}</span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <SourceFreshnessDisclosure
        sources={disclosureSources}
        correctionSuggestionType="other"
        correctionTargetId={`find-help-${stateId}`}
        correctionTargetName={`${stateConfig.name} find help hub`}
        correctionButtonLabel="Report a directory or source issue"
      />

      {/* Grid of Dynamic Cards */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {filteredTools.length === 0 ? (
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
            <strong style={{ display: 'block', marginBottom: '0.45rem' }}>No tools match that hub search</strong>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-light)', lineHeight: 1.6 }}>
              Try a broader keyword like waiver, IEP, forms, county, behavior, or trust.
            </span>
          </div>
        ) : filteredTools.map((tool, idx) => {
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
