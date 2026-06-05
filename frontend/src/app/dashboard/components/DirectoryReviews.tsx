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
  isSpanish?: boolean;
}

const EXPERIENCE_TYPES_EN = [
  'IEP Meeting',
  'Assessment Process',
  'Service Access',
  'Staff Responsiveness',
  'Appeal Process',
  'Intake Process',
  'Resource Navigation',
  'General Experience'
];

const EXPERIENCE_TYPES_ES = [
  'Reunión del IEP',
  'Proceso de Evaluación',
  'Acceso a Servicios',
  'Sensibilidad del Personal',
  'Proceso de Apelación',
  'Proceso de Admisión',
  'Navegación de Recursos',
  'Experiencia General'
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

export default function DirectoryReviews({ entityType, entityId, entityName, countyId, isSpanish: propIsSpanish = false }: DirectoryReviewsProps) {
  const [isSpanish] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('caregiver_lang');
      if (savedLang) return savedLang === 'es';
    }
    return propIsSpanish;
  });
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

  const t = {
    parentReviews: isSpanish ? 'Opiniones de Padres' : 'Parent Reviews',
    noReviewsExpanded: isSpanish ? 'Aún no hay opiniones — ¡sea el primero!' : 'No reviews yet — be the first!',
    loadingReviews: isSpanish ? 'Cargando opiniones...' : 'Loading reviews...',
    helpful: isSpanish ? 'Útil' : 'Helpful',
    noReviewsYet: isSpanish ? 'Aún no hay opiniones. Su experiencia podría ayudar a otra familia.' : 'No reviews yet. Your experience could help another family.',
    writeReview: isSpanish ? 'Escribir una Opinión' : 'Write a Review',
    shareExperience: isSpanish ? 'Comparta su Experiencia' : 'Share Your Experience',
    yourRating: isSpanish ? 'Su Calificación *' : 'Your Rating *',
    youAreA: isSpanish ? 'Usted es...' : 'You are a...',
    experienceType: isSpanish ? 'Tipo de Experiencia (opcional)' : 'Experience Type (optional)',
    selectOption: isSpanish ? '— Seleccionar —' : '— Select —',
    commentLabel: isSpanish ? 'Su Opinión *' : 'Your Review *',
    commentPlaceholder: isSpanish 
      ? 'Describa su experiencia: qué funcionó, qué fue difícil, qué deberían saber otras familias...'
      : 'Describe your experience — what worked, what was challenging, what other families should know...',
    submitting: isSpanish ? 'Enviando...' : 'Submitting...',
    submitReview: isSpanish ? 'Enviar Opinión' : 'Submit Review',
    cancel: isSpanish ? 'Cancelar' : 'Cancel',
    disclaimer: isSpanish 
      ? 'Las opiniones se comparten de forma anónima. No incluya información de identificación personal. Las opiniones que identifiquen a personas o contengan contenido inapropiado pueden ser eliminadas.'
      : 'Reviews are shared anonymously. Do not include personally identifying information. Reviews that identify individuals or contain inappropriate content may be removed.',
    successMessage: isSpanish ? '✓ ¡Gracias! Su opinión ha sido enviada.' : '✓ Thank you! Your review has been submitted.',
    starRatingError: isSpanish ? 'Por favor, seleccione una calificación de estrellas.' : 'Please select a star rating.',
    commentLengthError: isSpanish ? 'Por favor, escriba al menos 20 caracteres en su opinión.' : 'Please write at least 20 characters in your review.',
    submitError: isSpanish ? 'Error al enviar. Por favor, intente de nuevo.' : 'Failed to submit. Please try again.',
    networkError: isSpanish ? 'Error de red. Por favor, intente de nuevo.' : 'Network error. Please try again.'
  };

  const getExperienceTypeLabel = (type: string | null) => {
    if (!type) return '';
    if (!isSpanish) return type;
    const idx = EXPERIENCE_TYPES_EN.indexOf(type);
    if (idx !== -1) return EXPERIENCE_TYPES_ES[idx];
    return type;
  };

  const getReviewerLabel = (label: string) => {
    if (!isSpanish) return label;
    const map: Record<string, string> = {
      'Parent': 'Padre/Madre',
      'Caregiver': 'Cuidador',
      'Parent of Adult with Disability': 'Padre de Adulto con Discapacidad',
      'Self-Advocate': 'Autogestor',
      'Professional (Advocate/Therapist)': 'Profesional (Defensor/Terapeuta)'
    };
    return map[label] || label;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (newRating === 0) { setSubmitError(t.starRatingError); return; }
    if (newComment.trim().length < 20) { setSubmitError(t.commentLengthError); return; }

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
        setSubmitError(err.error || t.submitError);
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
      setSubmitError(t.networkError);
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
    try { return new Date(iso).toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { month: 'short', year: 'numeric' }); }
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
            {t.parentReviews}
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
          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{t.noReviewsExpanded}</span>
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
              {t.successMessage}
            </div>
          )}

          {/* Review list */}
          {isLoading && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontStyle: 'italic' }}>{t.loadingReviews}</p>
          )}

          {!isLoading && reviews.map(review => (
            <div key={review.id} style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.015)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.4rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StarRating rating={review.rating} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-light)' }}>{getReviewerLabel(review.reviewer_label)}</span>
                    {review.experience_type && (
                      <span style={{ fontSize: '0.65rem', background: 'rgba(99,102,241,0.08)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.15)', padding: '0.05rem 0.4rem', borderRadius: '999px', fontWeight: 600 }}>
                        {getExperienceTypeLabel(review.experience_type)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{formatDate(review.created_at)}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{review.comment}</p>
              <button
                onClick={() => handleHelpful(review.id)}
                style={{ background: 'none', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '6px', padding: '0.2rem 0.55rem', fontSize: '0.68rem', cursor: 'pointer', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <ThumbsUp size={11} /> {t.helpful} {review.helpful_count > 0 && `(${review.helpful_count})`}
              </button>
            </div>
          ))}

          {!isLoading && reviews.length === 0 && (
            <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(0,0,0,0.01)', borderRadius: '8px', border: '1px dashed rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>{t.noReviewsYet}</p>
            </div>
          )}

          {/* Write review toggle */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid var(--primary-color)', borderRadius: '8px', padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Star size={13} /> {t.writeReview}
            </button>
          )}

          {/* Write review form */}
          {showForm && (
            <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h5 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>{t.shareExperience}</h5>

              {/* Star picker */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>{t.yourRating}</label>
                <StarRating rating={newRating} onRate={setNewRating} interactive />
              </div>

              {/* Reviewer type */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>{t.youAreA}</label>
                <select
                  value={reviewerLabel}
                  onChange={e => setReviewerLabel(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option value="Parent">{isSpanish ? 'Padre/Madre' : 'Parent'}</option>
                  <option value="Caregiver">{isSpanish ? 'Cuidador' : 'Caregiver'}</option>
                  <option value="Parent of Adult with Disability">{isSpanish ? 'Padre de Adulto con Discapacidad' : 'Parent of Adult of Adult with Disability'}</option>
                  <option value="Self-Advocate">{isSpanish ? 'Autogestor' : 'Self-Advocate'}</option>
                  <option value="Professional (Advocate/Therapist)">{isSpanish ? 'Profesional (Defensor/Terapeuta)' : 'Professional (Advocate/Therapist)'}</option>
                </select>
              </div>

              {/* Experience type */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>{t.experienceType}</label>
                <select
                  value={newExperienceType}
                  onChange={e => setNewExperienceType(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.82rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <option value="">{t.selectOption}</option>
                  {EXPERIENCE_TYPES_EN.map((type, idx) => (
                    <option key={type} value={type}>
                      {isSpanish ? EXPERIENCE_TYPES_ES[idx] : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  {t.commentLabel} <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>({newComment.length}/1000)</span>
                </label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value.slice(0, 1000))}
                  placeholder={t.commentPlaceholder}
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
                  <Send size={13} /> {isSubmitting ? t.submitting : t.submitReview}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setSubmitError(''); }}
                  style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem', cursor: 'pointer', color: 'var(--text-light)' }}
                >
                  {t.cancel}
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.68rem', color: 'var(--text-light)', lineHeight: 1.4 }}>
                {t.disclaimer}
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
