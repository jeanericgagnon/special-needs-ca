'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Star, ThumbsUp, MessageSquare, Send, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface Review {
  id: number;
  entity_type: string;
  entity_id: string;
  entity_name: string;
  county_id: string;
  rating: number;
  comment: string;
  reviewer_label: string;
  experience_type: string | null;
  helpful_count: number;
  created_at: string;
}

interface DirectoryReviewsProps {
  entityType: 'school_district' | 'regional_center' | 'county_office' | 'nonprofit';
  entityId: string;
  entityName: string;
  countyId: string;
}

const EXPERIENCE_TYPES = [
  'IEP Meeting',
  'Assessment Process',
  'Service Access',
  'Staff Responsiveness',
  'Appeal Process',
  'Intake Process',
  'Resource Navigation',
  'General Experience'
];

function StarRating({ rating, onRate, interactive }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? (hovered || rating) : rating;

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            padding: '1px',
            cursor: interactive ? 'pointer' : 'default',
            color: star <= display ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.1s',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Star size={16} fill={star <= display ? '#f59e0b' : 'none'} stroke={star <= display ? '#f59e0b' : '#d1d5db'} />
        </button>
      ))}
    </div>
  );
}

export default function DirectoryReviews({ entityType, entityId, entityName, countyId }: DirectoryReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Form state
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newExperienceType, setNewExperienceType] = useState('');
  const [reviewerLabel, setReviewerLabel] = useState('Parent');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reviews?entityId=${encodeURIComponent(entityId)}&entityType=${encodeURIComponent(entityType)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      // silently fail — reviews are a nice-to-have
    } finally {
      setIsLoading(false);
    }
  }, [entityId, entityType]);

  // Trigger fetch when panel first expands
  const prevExpandedRef = useRef(false);
  useEffect(() => {
    if (expanded && !prevExpandedRef.current) {
      prevExpandedRef.current = true;
      void fetchReviews();
    }
    if (!expanded) prevExpandedRef.current = false;
  }, [expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (newRating === 0) { setSubmitError('Please select a star rating.'); return; }
    if (newComment.trim().length < 20) { setSubmitError('Please write at least 20 characters in your review.'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          entity_name: entityName,
          county_id: countyId,
          rating: newRating,
          comment: newComment.trim(),
          reviewer_label: reviewerLabel,
          experience_type: newExperienceType || null
        })
      });
      if (!res.ok) {
        const err = await res.json();
        setSubmitError(err.error || 'Failed to submit. Please try again.');
      } else {
        setSubmitSuccess(true);
        setNewRating(0);
        setNewComment('');
        setNewExperienceType('');
        setShowForm(false);
        fetchReviews();
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: number) => {
    await fetch('/api/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: reviewId })
    });
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r));
  };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); }
    catch { return ''; }
  };

  return (
    <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '0.75rem' }}>
      {/* Summary header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageSquare size={13} color="var(--text-light)" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
            Parent Reviews
          </span>
        </div>

        {avgRating !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <StarRating rating={Math.round(avgRating)} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
              {avgRating.toFixed(1)} ({reviews.length})
            </span>
          </div>
        )}

        {reviews.length === 0 && !isLoading && expanded && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontStyle: 'italic' }}>No reviews yet — be the first!</span>
        )}

        <span style={{ marginLeft: 'auto', color: 'var(--text-light)' }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Success banner */}
          {submitSuccess && (
            <div style={{ padding: '0.6rem 0.85rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
              ✓ Thank you! Your review has been submitted.
            </div>
          )}

          {/* Review list */}
          {isLoading && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic' }}>Loading reviews...</p>
          )}

          {!isLoading && reviews.map(review => (
            <div key={review.id} style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.4rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StarRating rating={review.rating} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-light)' }}>{review.reviewer_label}</span>
                    {review.experience_type && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)', padding: '0.05rem 0.4rem', borderRadius: '999px', fontWeight: 600 }}>
                        {review.experience_type}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{formatDate(review.created_at)}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{review.comment}</p>
              <button
                onClick={() => handleHelpful(review.id)}
                style={{ background: 'none', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '6px', padding: '0.2rem 0.55rem', fontSize: '0.68rem', cursor: 'pointer', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ThumbsUp size={11} /> Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
              </button>
            </div>
          ))}

          {!isLoading && reviews.length === 0 && (
            <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(0,0,0,0.01)', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>No reviews yet. Your experience could help another family.</p>
            </div>
          )}

          {/* Write review toggle */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid var(--primary-color)', borderRadius: '8px', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Star size={13} /> Write a Review
            </button>
          )}

          {/* Write review form */}
          {showForm && (
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Share Your Experience</h5>

              {/* Star picker */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Your Rating *</label>
                <StarRating rating={newRating} onRate={setNewRating} interactive />
              </div>

              {/* Reviewer type */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>You are a...</label>
                <select
                  value={reviewerLabel}
                  onChange={e => setReviewerLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option>Parent</option>
                  <option>Caregiver</option>
                  <option>Parent of Adult with Disability</option>
                  <option>Self-Advocate</option>
                  <option>Professional (Advocate/Therapist)</option>
                </select>
              </div>

              {/* Experience type */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Experience Type (optional)</label>
                <select
                  value={newExperienceType}
                  onChange={e => setNewExperienceType(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option value="">— Select —</option>
                  {EXPERIENCE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Comment */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  Your Review * <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>({newComment.length}/1000)</span>
                </label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value.slice(0, 1000))}
                  placeholder="Describe your experience — what worked, what was challenging, what other families should know..."
                  required
                  rows={4}
                  style={{ width: '100%', padding: '0.5rem 0.7rem', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', resize: 'vertical', lineHeight: 1.5, fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
              </div>

              {submitError && (
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.78rem', color: '#dc2626' }}>
                  <AlertCircle size={13} /> {submitError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  <Send size={13} /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(''); }}
                  style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-light)' }}
                >
                  Cancel
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                Reviews are shared anonymously. Do not include personally identifying information. Reviews that identify individuals or contain inappropriate content may be removed.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
