import type { FormGuide } from './db.ts';
import { getPublishedFormGuides, getPublishedFormGuideBySlug } from './db.ts';
import { isSafePublishedFormGuide as isSafePublishedFormGuideRecord } from './publishedFormGuideSafety.ts';

export function isSafePublishedFormGuide(form: FormGuide | null | undefined): form is FormGuide {
  return isSafePublishedFormGuideRecord(form);
}

export async function getSafePublishedFormGuides(stateId?: string): Promise<FormGuide[]> {
  const rows = await getPublishedFormGuides(stateId);
  return rows.filter(isSafePublishedFormGuide);
}

export async function getSafePublishedFormGuideBySlug(slug: string, stateId?: string): Promise<FormGuide | null> {
  const row = await getPublishedFormGuideBySlug(slug, stateId);
  return isSafePublishedFormGuide(row) ? row : null;
}
