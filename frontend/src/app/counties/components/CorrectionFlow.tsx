'use client';

import React, { useState, useTransition } from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, ExternalLink, HelpCircle, Send } from 'lucide-react';
import { submitSuggestionAction } from '@/app/actions';

interface TrustBadgeProps {
  status?: string | null;
  lastVerifiedDate?: string | null;
  sourceUrl?: string | null;
  sourceType?: string | null;
  confidenceScore?: number | null;
  entityId: string;
  entityName: string;
  entityType: string;
}

export function TrustBadge({
  status,
  lastVerifiedDate,
  sourceUrl,
  sourceType,
  confidenceScore,
  entityId,
  entityName,
  entityType
}: TrustBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Normalize last verified date text
  let dateText = 'Unknown';
  if (lastVerifiedDate) {
    try {
      const date = new Date(lastVerifiedDate);
      dateText = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } catch {
      dateText = lastVerifiedDate;
    }
  }

  // Get status badge configuration
  let badgeColor = '#64748b'; // Gray
  let badgeBg = 'rgba(100, 116, 139, 0.08)';
  let badgeLabel = entityType === 'advocate' 
    ? 'Unverified directory listing — verify credentials locally (not an endorsement)' 
    : 'Unverified directory listing';
  let badgeIcon = <HelpCircle size={14} color="#64748b" />;

  const normStatus = (status || '').toLowerCase().trim();
  const hasReviewableSource = Boolean(String(sourceUrl || '').trim());
  const normSourceType = String(sourceType || '').toLowerCase().trim();
  const isOfficialSourceType = normSourceType.startsWith('official');

  if (hasReviewableSource && (normStatus === 'official_verified' || normStatus === 'human_verified' || normStatus === 'verified')) {
    badgeColor = '#0f766e'; // Teal
    badgeBg = 'rgba(15, 118, 110, 0.08)';
    badgeLabel = entityType === 'advocate'
      ? 'Source-backed professional listing — confirm fit and credentials locally'
      : isOfficialSourceType
      ? 'Source-backed official contact'
      : 'Source-backed contact listing';
    badgeIcon = <ShieldCheck size={14} color="#0f766e" />;
  } else if (hasReviewableSource && normStatus === 'source_listed') {
    badgeColor = '#3b82f6'; // Blue
    badgeBg = 'rgba(59, 130, 246, 0.08)';
    badgeLabel = isOfficialSourceType
      ? 'Official source linked, not human verified'
      : 'Public source linked, not human verified';
    badgeIcon = <Shield size={14} color="#3b82f6" />;
  } else if (normStatus === 'generated_county_fallback') {
    badgeColor = '#d97706'; // Amber
    badgeBg = 'rgba(217, 119, 6, 0.08)';
    badgeLabel = 'County fallback record — verify locally';
    badgeIcon = <AlertTriangle size={14} color="#d97706" />;
  } else if (normStatus === 'stale_needs_review') {
    badgeColor = '#ef4444'; // Red
    badgeBg = 'rgba(239, 68, 68, 0.08)';
    badgeLabel = 'Stale — Needs verification review';
    badgeIcon = <ShieldAlert size={14} color="#ef4444" />;
  }

  const normalizedSourceType = String(sourceType || '').trim();
  const sourceTypeLabel = normalizedSourceType
    ? normalizedSourceType.replace(/_/g, ' ')
    : '';
  const confidenceLabel = typeof confidenceScore === 'number' && Number.isFinite(confidenceScore)
    ? `${Math.round(confidenceScore * 100)}% confidence`
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.4rem', marginBottom: '0.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Trust status label */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: badgeColor,
            background: badgeBg,
            border: `1px solid ${badgeColor}30`,
            padding: '0.25rem 0.6rem',
            borderRadius: '20px',
            textTransform: 'none'
          }}
        >
          {badgeIcon}
          {badgeLabel}
        </div>

        {/* Source link */}
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: 'var(--primary-color)',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Source Website <ExternalLink size={12} />
          </a>
        )}

        {/* Suggest update trigger */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '0.75rem',
            color: 'var(--text-light)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Suggest update
        </button>
      </div>

      {/* Date reviewed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.72rem', color: 'var(--text-light)' }}>
        <span>Last reviewed: {dateText}</span>
        {(sourceTypeLabel || confidenceLabel) && (
          <span>
            {[sourceTypeLabel ? `Source type: ${sourceTypeLabel}` : null, confidenceLabel].filter(Boolean).join(' • ')}
          </span>
        )}
      </div>

      {/* Suggestion Modal overlay */}
      {isOpen && (
        <SuggestionModal
          entityId={entityId}
          entityName={entityName}
          entityType={entityType}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

interface SuggestionModalProps {
  entityId: string;
  entityName: string;
  entityType: string;
  onClose: () => void;
}

export function SuggestionModal({
  entityId,
  entityName,
  entityType,
  onClose
}: SuggestionModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('general_correction');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !details.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    startTransition(async () => {
      try {
        const res = await submitSuggestionAction({
          suggestion_type: `${entityType}:${type}`,
          target_id: entityId,
          submitter_name: name,
          submitter_email: email,
          details: `Entity: ${entityName} | ${details}`
        });

        if (res.success) {
          setMessage({ type: 'success', text: 'Suggestion submitted successfully' });
          setTimeout(() => {
            onClose();
          }, 2000);
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
      }
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'var(--glass-bg)',
          borderRadius: '20px',
          boxShadow: 'var(--glass-shadow)',
          border: '1px solid var(--glass-border)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Suggest Correction
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-light)',
              lineHeight: 1
            }}
          >
            &times;
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
          Help us maintain the accuracy of resources for <strong>{entityName}</strong>. Submissions are reviewed against public source evidence before we update what appears on the site.
        </p>

        {message && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? '#10b98130' : '#ef444430'}`
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Your Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              disabled={isPending}
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Your Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              disabled={isPending}
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Correction Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isPending}
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px' }}
            >
              <option value="general_correction">General Correction</option>
              <option value="outdated_contact">Report Outdated Phone/Address</option>
              <option value="claim_profile">Claim Provider Profile</option>
              <option value="missing_resource">Submit Missing Resource Details</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Details & Context *</label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please provide the correct website, phone number, address, or billing details..."
              disabled={isPending}
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={{
                flex: 1,
                padding: '0.65rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: '1px solid #ccc',
                background: '#fafafa',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                flex: 1,
                padding: '0.65rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--primary-color)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              {isPending ? 'Sending...' : 'Submit'} <Send size={12} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
