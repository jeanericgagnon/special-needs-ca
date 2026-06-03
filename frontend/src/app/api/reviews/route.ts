import { NextRequest, NextResponse } from 'next/server';
import { navigatorDb } from '@/lib/db';

// GET /api/reviews?entityId=...&entityType=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType');
    const countyId = searchParams.get('countyId');

    let reviews;
    if (entityId && entityType) {
      reviews = navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE entity_id = ? AND entity_type = ? ORDER BY created_at DESC LIMIT 50')
        .all(entityId, entityType);
    } else if (countyId) {
      reviews = navigatorDb
        .prepare('SELECT * FROM directory_reviews WHERE county_id = ? ORDER BY created_at DESC LIMIT 100')
        .all(countyId);
    } else {
      reviews = navigatorDb
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

    // Sanitize: strip any HTML tags
    const sanitizeStr = (s: string) => String(s).replace(/<[^>]*>/g, '').trim().slice(0, 1000);

    const result = navigatorDb
      .prepare(`
        INSERT INTO directory_reviews 
          (entity_type, entity_id, entity_name, county_id, rating, comment, reviewer_label, experience_type, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    const body = await request.json();
    const { review_id } = body;
    if (!review_id) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });
    navigatorDb.prepare('UPDATE directory_reviews SET helpful_count = helpful_count + 1 WHERE id = ?').run(review_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking helpful:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
