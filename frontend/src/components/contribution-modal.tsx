'use client';

import { useState } from 'react';
import { submitSuggestionAction } from '@/app/actions';
import { X, Send, CheckCircle, MessageSquare } from 'lucide-react';

interface ContributionModalProps {
  suggestionType: 'advocate' | 'district' | 'program' | 'other';
  targetId: string | null;
  targetName?: string;
  buttonLabel?: string;
}

export default function ContributionModal({
  suggestionType,
  targetId,
  targetName,
  buttonLabel = 'Suggest Correction'
}: ContributionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await submitSuggestionAction({
        suggestion_type: suggestionType,
        target_id: targetId,
        submitter_name: name,
        submitter_email: email,
        details
      });

      setStatus(res);
      if (res.success) {
        setDetails('');
      }
    } catch (err) {
      console.error(err);
      setStatus({ success: false, message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStatus(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid var(--glass-border)',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          fontSize: '0.85rem',
          borderRadius: '8px',
          fontWeight: 600,
          color: 'var(--primary-color)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <MessageSquare size={14} />
        <span>{buttonLabel}</span>
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div
            className="modal-content animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
              borderRadius: '24px'
            }}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              type="button"
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-light)',
                padding: '0.2rem'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
              <MessageSquare color="var(--primary-color)" size={20} />
              Suggest an Update
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
              Help keep the Special Needs Navigator accurate. Suggest corrections or additions for {targetName || 'this page'}.
            </p>

            {status?.success ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Suggestion Received!</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>{status.message}</p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.6rem 2rem', margin: '0 auto', fontSize: '0.9rem' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {status && (
                  <div style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                    {status.message}
                  </div>
                )}

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="contrib-name" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Name</label>
                  <input
                    type="text"
                    id="contrib-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    required
                    style={{ padding: '0.65rem 0.85rem', fontSize: '0.92rem', borderRadius: '8px' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="contrib-email" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Email</label>
                  <input
                    type="email"
                    id="contrib-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    required
                    style={{ padding: '0.65rem 0.85rem', fontSize: '0.92rem', borderRadius: '8px' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="contrib-details" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Suggested Correction / Addition Details</label>
                  <textarea
                    id="contrib-details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Provide specific details (e.g. 'Sarah Jenkins hourly rate is now $160', 'New school district spec ed helpline is ...')"
                    required
                    style={{ padding: '0.65rem 0.85rem', fontSize: '0.92rem', borderRadius: '8px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{ height: '42px', fontSize: '0.95rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
                >
                  {loading ? 'Submitting...' : (
                    <>
                      <Send size={15} />
                      <span>Submit Suggestion</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
