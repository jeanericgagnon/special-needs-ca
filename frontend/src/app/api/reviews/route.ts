import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { navigatorDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// In-memory rate limiter map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();

// Rate limit helper: maximum 5 requests per 10 minutes per IP
function isRateLimited(ip: string, limit = 5, windowMs = 600000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(time => now - time < windowMs);
  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return validTimestamps.length > limit;
}

// GET /api/reviews?entityId=...&entityType=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');
    const countyId = searchParams.get('countyId');

    let reviews;
    if (entityId && entityType) {
      reviews = await navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE entity_id = ? AND entity_type = ? ORDER BY created_at DESC LIMIT 50')
        .all(entityId, entityType);
    } else if (countyId) {
      reviews = await navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE county_id = ? ORDER BY created_at DESC LIMIT 100')
        .all(countyId);
    } else {
      reviews = await navigatorDb
        .prepare('SELECT * FROM directory_reviews ORDER BY created_at DESC LIMIT 50')
        .all();
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    // Write safety block for serverless Vercel environments without active PG
    const isVercel = process.env.VERCEL === '1';
    const usePg = !!process.env.DATABASE_URL;
    if (isVercel && !usePg) {
      console.warn('Write safety block: database writes disabled on Vercel without active PG pool.');
      return NextResponse.json(
        { error: 'Database writes are unavailable in serverless mode without a PostgreSQL instance.' },
        { status: 503 }
      );
    }

    // Rate limit check
    const ipHeader = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const ip = ipHeader.split(',')[0].trim();
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // Authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { entity_type, entity_id, entity_name, county_id, rating, comment, reviewer_label, experience_type } = body;

    // Validation
    if (!entity_type || !entity_id || !entity_name || !county_id || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }
    if (comment.trim().length < 20) {
      return NextResponse.json({ error: 'Comment must be at least 20 characters' }, { status: 400 });
    }
    if (comment.trim().length > 1000) {
      return NextResponse.json({ error: 'Comment must be under 1000 characters' }, { status: 400 });
    }

    // Enforce review submission constraints: verify that user hasn't already reviewed this provider
    const existingReview = await navigatorDb
      .prepare('SELECT id FROM directory_reviews WHERE user_id = ? AND entity_id = ? AND entity_type = ? LIMIT 1')
      .get(session.userId, entity_id, entity_type);
    if (existingReview) {
      return NextResponse.json({ error: 'You have already submitted a review for this provider.' }, { status: 400 });
    }

    // Sanitize: strip any HTML tags
    const sanitizeStr = (s: string) => String(s).replace(/<[^>]*>/g, '').trim().slice(0, 1000);

    const result = await navigatorDb
      .prepare(`
        INSERT INTO directory_reviews 
          (entity_type, entity_id, entity_name, county_id, rating, comment, reviewer_label, experience_type, user_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        sanitizeStr(entity_type),
        sanitizeStr(entity_id),
        sanitizeStr(entity_name),
        sanitizeStr(county_id),
        Math.round(rating),
        sanitizeStr(comment),
        sanitizeStr(reviewer_label || 'Parent'),
        experience_type ? sanitizeStr(experience_type) : null,
        session.userId,
        new Date().toISOString()
      );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

// POST /api/reviews/helpful (increment helpful_count)
export async function PATCH(request: NextRequest) {
  try {
    // Write safety block for serverless Vercel environments without active PG
    const isVercel = process.env.VERCEL === '1';
    const usePg = !!process.env.DATABASE_URL;
    if (isVercel && !usePg) {
      console.warn('Write safety block: database writes disabled on Vercel without active PG pool.');
      return NextResponse.json(
        { error: 'Database writes are unavailable in serverless mode without a PostgreSQL instance.' },
        { status: 503 }
      );
    }

    // Rate limit check
    const ipHeader = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const ip = ipHeader.split(',')[0].trim();
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // Authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    const session = token ? verifyToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    const body = await request.json();
    const { review_id } = body;
    if (!review_id) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });
    
    await navigatorDb
      .prepare('UPDATE directory_reviews SET helpful_count = helpful_count + 1 WHERE id = ?')
      .run(review_id);
      
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking helpful:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
