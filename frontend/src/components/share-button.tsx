'use client';

import { useState } from 'react';
import { Share2, Link as LinkIcon, MessageSquare, Check } from 'lucide-react';

interface ShareButtonProps {
  title?: string;
  url?: string;
}

export default function ShareButton({ title = 'CA Special Needs Resource Guide', url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return 'https://special-needs-ca.vercel.app';
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareText = `Check out this helpful ${title}: ${getShareUrl()}`;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className="no-print">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
        className="btn-primary"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid var(--glass-border)',
          color: 'var(--primary-color)',
          width: 'auto',
          padding: '0.6rem 1.25rem',
          fontSize: '0.88rem',
          borderRadius: '10px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.01)',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        <Share2 size={16} />
        <span>Share Guide</span>
      </button>

      {isOpen && (
        <>
          {/* Transparent overlay for dismissing popover */}
          <div 
            onClick={() => setIsOpen(false)} 
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998, background: 'transparent' }} 
          />
          
          <div
            className="glass-panel animate-fade-in"
            style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              width: '260px',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Share this Resource Guide</h4>
            
            <button
              onClick={handleCopyLink}
              type="button"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.05)',
                background: 'rgba(255,255,255,0.5)',
                color: copied ? '#10b981' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
            >
              {copied ? <Check size={14} /> : <LinkIcon size={14} />}
              <span>{copied ? 'Copied Link!' : 'Copy Direct Link'}</span>
            </button>

            <a
              href={`sms:?&body=${encodeURIComponent(shareText)}`}
              style={{ textDecoration: 'none' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  background: 'rgba(255,255,255,0.5)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                <MessageSquare size={14} color="#3b82f6" />
                <span>Share via SMS / Text</span>
              </button>
            </a>

            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  background: 'rgba(255,255,255,0.5)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                <Share2 size={14} color="#22c55e" />
                <span>Share via WhatsApp</span>
              </button>
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  background: 'rgba(255,255,255,0.5)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 500
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  width="14" 
                  height="14" 
                  fill="none" 
                  stroke="#1877f2" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span>Share on Facebook</span>
              </button>
            </a>
          </div>
        </>
      )}
    </div>
  );
}
