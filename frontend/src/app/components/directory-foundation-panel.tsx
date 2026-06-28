'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Globe, Mail, Phone } from 'lucide-react';
import { TrustBadge } from '@/app/counties/components/CorrectionFlow';
import {
  getDirectoryAvailabilityDisplayLabel,
  getStalenessLabel,
  hasDirectoryAvailabilityDetails,
  hasDirectoryPanelAccessibilityDetails,
  hasDirectoryPanelNextStepDetails,
  isMeaningfulDirectoryAddress,
  isMeaningfulDirectoryEmail,
  isMeaningfulDirectoryPhone,
  isMeaningfulDirectoryWebsite,
  isRenderableDirectoryFoundationRecord,
  parseDirectoryList,
} from '@/lib/directoryFoundation';
import { trackDirectoryAnalyticsEvent, type DirectoryAnalyticsEventName } from '@/lib/directoryAnalytics';
import { getSavedDirectoryResourceAnchorId, isDirectoryResourceSaved, toggleSavedDirectoryResource } from '@/lib/savedResources';

type DirectoryPanelRecord = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  source_url?: string | null;
  source_type?: string | null;
  confidence_score?: number | null;
  verification_status?: string | null;
  last_verified_date?: string | null;
  last_verified_at?: string | null;
  service_tags?: string | null;
  serving_tags?: string | null;
  availability_status?: string | null;
  accepting_new_clients?: number | null;
  waitlist_status?: string | null;
  capacity_notes?: string | null;
  next_step_type?: string | null;
  next_step_label?: string | null;
  next_step_url?: string | null;
  next_step_phone?: string | null;
  next_step_email?: string | null;
  next_step_instructions?: string | null;
  requirements?: string | null;
  application_url?: string | null;
  referral_url?: string | null;
  walk_in_available?: number | null;
  appointment_required?: number | null;
  funding_status?: string | null;
  checked_at?: string | null;
  source_last_updated?: string | null;
  languages?: string | null;
  languages_spoken?: string | null;
  accessibility_notes?: string | null;
  interpreter_available?: number | null;
  asl_available?: number | null;
  wheelchair_accessible?: number | null;
  virtual_services?: number | null;
  in_person_services?: number | null;
  home_visits?: number | null;
  transportation_help?: number | null;
  focus_condition?: string | null;
  credentials?: string | null;
  price_rate?: string | null;
  experience_years?: number | null;
  accepts_medi_cal?: number | null;
};

type DirectoryFoundationPanelProps = {
  entityType: 'advocate' | 'county_office' | 'nonprofit' | 'regional_center' | 'school_district' | 'provider';
  heading: string;
  record: DirectoryPanelRecord;
  subtitle?: string | null;
  pageType?: 'county' | 'county_diagnosis' | 'advocates' | 'forms';
  stateId?: string;
  countyId?: string;
};

function formatTag(tag: string) {
  return tag
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getLanguages(record: DirectoryPanelRecord) {
  return record.languages || record.languages_spoken || null;
}

function getAccessFlags(record: DirectoryPanelRecord) {
  const flags: string[] = [];
  if (record.interpreter_available === 1) flags.push('Interpreter available');
  if (record.asl_available === 1) flags.push('ASL support');
  if (record.wheelchair_accessible === 1) flags.push('Wheelchair accessible');
  if (record.virtual_services === 1) flags.push('Virtual');
  if (record.in_person_services === 1) flags.push('In person');
  if (record.home_visits === 1) flags.push('Home visits');
  if (record.transportation_help === 1) flags.push('Transportation help');
  return flags;
}

function getRecordType(entityType: DirectoryFoundationPanelProps['entityType']) {
  switch (entityType) {
    case 'county_office':
      return 'office' as const;
    case 'nonprofit':
      return 'nonprofit' as const;
    case 'advocate':
      return 'advocate' as const;
    default:
      return 'provider' as const;
  }
}

function getPrimaryLinkEvent(record: DirectoryPanelRecord, primaryLink: string | null): DirectoryAnalyticsEventName {
  if (!primaryLink) {
    return 'directory_resource_click';
  }

  if (record.application_url && primaryLink === record.application_url) {
    return 'directory_application_click';
  }

  if (record.next_step_url && primaryLink === record.next_step_url) {
    return 'directory_next_step_click';
  }

  if (/\.pdf(?:$|\?)/i.test(primaryLink)) {
    return 'directory_form_download';
  }

  return 'directory_resource_click';
}

function getPrimaryLinkLabel(record: DirectoryPanelRecord, nextStepText: string | null) {
  if (record.next_step_label) return record.next_step_label;
  if (record.application_url) return 'Apply online';
  if (record.referral_url) return 'See referral details';
  if (nextStepText) return nextStepText;
  return 'Visit source website';
}

export default function DirectoryFoundationPanel({
  entityType,
  heading,
  record,
  subtitle,
  pageType,
  stateId,
  countyId,
}: DirectoryFoundationPanelProps) {
  const recordType = getRecordType(entityType);
  const [, setSaveVersion] = useState(0);
  const targetId = getSavedDirectoryResourceAnchorId(record.id);
  const initialHash = typeof window === 'undefined' ? '' : window.location.hash || '';
  const [activeHash, setActiveHash] = useState(initialHash);
  const [showReturnBadge, setShowReturnBadge] = useState(initialHash === `#${targetId}`);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const isTargeted = activeHash === `#${targetId}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const syncHash = () => {
      const nextHash = window.location.hash || '';
      setActiveHash(nextHash);
      setShowReturnBadge(nextHash === `#${targetId}`);
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, [targetId]);

  useEffect(() => {
    if (!isTargeted || !containerRef.current) return;
    containerRef.current.animate(
      [
        { transform: 'scale(1)', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.10)' },
        { transform: 'scale(1.01)', boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.18)' },
        { transform: 'scale(1)', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.10)' },
      ],
      { duration: 1100, easing: 'ease-out', iterations: 1 }
    );
  }, [isTargeted]);

  useEffect(() => {
    if (!showReturnBadge) return;
    const timeoutId = window.setTimeout(() => setShowReturnBadge(false), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [showReturnBadge]);

  if (!isRenderableDirectoryFoundationRecord(record)) {
    return null;
  }

  const serviceTags = parseDirectoryList(record.service_tags).slice(0, 4);
  const servingTags = parseDirectoryList(record.serving_tags).slice(0, 3);
  const accessFlags = getAccessFlags(record);
  const languages = getLanguages(record);
  const staleness = getStalenessLabel(record);
  const availabilityLabel = getDirectoryAvailabilityDisplayLabel(record);
  const nextStepText = record.next_step_label || (record.next_step_type ? formatTag(record.next_step_type) : null);
  const publicPhone = isMeaningfulDirectoryPhone(record.phone) ? record.phone : null;
  const publicEmail = isMeaningfulDirectoryEmail(record.email) ? record.email : null;
  const publicWebsite = isMeaningfulDirectoryWebsite(record.website) ? record.website : null;
  const publicAddress = isMeaningfulDirectoryAddress(record.address) ? record.address : null;
  const publicNextStepPhone = isMeaningfulDirectoryPhone(record.next_step_phone) ? record.next_step_phone : null;
  const publicNextStepEmail = isMeaningfulDirectoryEmail(record.next_step_email) ? record.next_step_email : null;
  const primaryLink = record.next_step_url || record.application_url || record.referral_url || publicWebsite;
  const primaryLinkLabel = getPrimaryLinkLabel(record, nextStepText);
  const saved = isDirectoryResourceSaved(record.id, recordType);
  const showAvailabilityDetails = hasDirectoryAvailabilityDetails(record);
  const showNextStepDetails = hasDirectoryPanelNextStepDetails(record);
  const showAccessibilityDetails = hasDirectoryPanelAccessibilityDetails(record);

  const trackEvent = (event: DirectoryAnalyticsEventName) => {
    trackDirectoryAnalyticsEvent({
      event,
      recordId: record.id,
      recordType,
      stateId,
      countyId,
      pageType,
      nextStepType: record.next_step_type || undefined,
    });
  };
  const handleSaveToggle = () => {
    const result = toggleSavedDirectoryResource({
      id: record.id,
      name: record.name,
      recordType,
      stateId,
      countyId,
      pageType,
      originPath: pathname ? `${pathname}#${targetId}` : undefined,
      phone: record.phone || undefined,
      email: record.email || undefined,
      website: record.website || undefined,
      sourceUrl: record.source_url || undefined,
      verificationStatus: record.verification_status || undefined,
    });
    setSaveVersion((value) => value + 1);
    if (result.saved) {
      trackEvent('directory_save_resource');
    }
  };

  return (
    <div
      id={targetId}
      ref={containerRef}
      style={{
        background: isTargeted ? 'rgba(59, 130, 246, 0.07)' : 'white',
        padding: '1.25rem',
        borderRadius: '16px',
        border: isTargeted ? '1px solid rgba(59, 130, 246, 0.28)' : '1px solid rgba(0,0,0,0.03)',
        boxShadow: isTargeted ? '0 0 0 3px rgba(59, 130, 246, 0.10)' : 'none',
        scrollMarginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
      }}
    >
      {isTargeted && showReturnBadge && (
        <div
          style={{
            alignSelf: 'flex-start',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#2563eb',
            background: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.18)',
            borderRadius: '999px',
            padding: '0.22rem 0.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span>Returned from Saved Resources</span>
          <button
            type="button"
            onClick={() => setShowReturnBadge(false)}
            aria-label="Dismiss return badge"
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563eb',
              cursor: 'pointer',
              fontSize: '0.72rem',
              fontWeight: 700,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>
      )}
      <strong style={{ display: 'block', color: 'var(--text-main)', marginBottom: '0.1rem', fontSize: '0.95rem' }}>{heading}</strong>
      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{record.name}</h4>
      {subtitle && <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-light)', lineHeight: 1.45 }}>{subtitle}</p>}
      {publicAddress && <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{publicAddress}</span>}
      <div>
        <button
          type="button"
          onClick={handleSaveToggle}
          style={{
            border: '1px solid rgba(59, 130, 246, 0.16)',
            background: saved ? 'rgba(59, 130, 246, 0.10)' : 'rgba(255,255,255,0.96)',
            color: saved ? '#2563eb' : 'var(--text-main)',
            borderRadius: '999px',
            padding: '0.28rem 0.65rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          aria-pressed={saved}
        >
          {saved ? 'Saved locally' : 'Save resource'}
        </button>
      </div>

      {(record.credentials || record.price_rate || record.experience_years) && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', flexDirection: 'column', gap: '0.18rem' }}>
          {record.credentials && <span><strong>Credentials:</strong> {record.credentials}</span>}
          {record.experience_years ? <span><strong>Experience:</strong> {record.experience_years} years</span> : null}
          {record.price_rate && <span><strong>Rate:</strong> {record.price_rate}</span>}
        </div>
      )}

      {record.focus_condition && (
        <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', fontWeight: 600 }}>
          Focus: {formatTag(record.focus_condition)}
        </span>
      )}

      {serviceTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {serviceTags.map((tag) => (
            <span key={tag} style={{ fontSize: '0.72rem', padding: '0.2rem 0.45rem', borderRadius: '999px', backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#2563eb' }}>
              {formatTag(tag)}
            </span>
          ))}
        </div>
      )}

      {servingTags.length > 0 && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
          <strong style={{ color: 'var(--text-main)' }}>Serves:</strong> {servingTags.map(formatTag).join(', ')}
        </div>
      )}

      {showAvailabilityDetails && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.45 }}>
          {availabilityLabel && <div><strong style={{ color: 'var(--text-main)' }}>Availability:</strong> {availabilityLabel}</div>}
          {record.accepting_new_clients === 1 && <div>Accepting new clients</div>}
          {record.waitlist_status && <div><strong style={{ color: 'var(--text-main)' }}>Waitlist:</strong> {formatTag(record.waitlist_status)}</div>}
          {record.capacity_notes && <div>{record.capacity_notes}</div>}
          {record.funding_status && <div><strong style={{ color: 'var(--text-main)' }}>Funding:</strong> {formatTag(record.funding_status)}</div>}
        </div>
      )}

      {showNextStepDetails && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.45 }}>
          {nextStepText && <div><strong style={{ color: 'var(--text-main)' }}>Next step:</strong> {nextStepText}</div>}
          {record.next_step_instructions && <div>{record.next_step_instructions}</div>}
          {record.requirements && <div><strong style={{ color: 'var(--text-main)' }}>Requirements:</strong> {record.requirements}</div>}
          {record.walk_in_available === 1 && <div>Walk-ins available</div>}
          {record.appointment_required === 1 && <div>Appointment required</div>}
          {publicNextStepPhone && <div><strong style={{ color: 'var(--text-main)' }}>Intake phone:</strong> {publicNextStepPhone}</div>}
          {publicNextStepEmail && <div><strong style={{ color: 'var(--text-main)' }}>Intake email:</strong> {publicNextStepEmail}</div>}
        </div>
      )}

      {showAccessibilityDetails && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: 1.45 }}>
          {languages && <div><strong style={{ color: 'var(--text-main)' }}>Languages:</strong> {languages}</div>}
          {record.accepts_medi_cal === 1 && <div>Accepts Medi-Cal</div>}
          {accessFlags.length > 0 && <div><strong style={{ color: 'var(--text-main)' }}>Access:</strong> {accessFlags.join(', ')}</div>}
          {record.accessibility_notes && <div>{record.accessibility_notes}</div>}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
        {publicPhone && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <Phone size={12} style={{ flexShrink: 0 }} />
            <a
              href={`tel:${publicPhone}`}
              style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}
              onClick={() => trackEvent('directory_phone_click')}
            >
              {publicPhone}
            </a>
          </span>
        )}
        {publicEmail && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
            <Mail size={12} style={{ flexShrink: 0 }} />
            <a
              href={`mailto:${publicEmail}`}
              style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}
              onClick={() => trackEvent('directory_email_click')}
            >
              {publicEmail}
            </a>
          </span>
        )}
        {primaryLink && (
          <a
            href={primaryLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary-color)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none', fontWeight: 600 }}
            onClick={() => trackEvent(getPrimaryLinkEvent(record, primaryLink))}
          >
            <Globe size={12} /> {primaryLinkLabel}
          </a>
        )}
      </div>

      <TrustBadge
        status={record.verification_status}
        lastVerifiedDate={record.last_verified_date || record.last_verified_at}
        sourceUrl={record.source_url}
        sourceType={record.source_type}
        confidenceScore={record.confidence_score}
        entityId={record.id}
        entityName={record.name}
        entityType={entityType}
      />

      {staleness && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
          Freshness signal: {staleness}
        </div>
      )}
    </div>
  );
}
