import { SEO_CLUSTERS } from './seo-data.ts';

function getLatestReviewedDate(slugs: string[]): string | undefined {
  const dates = slugs
    .map((slug) => SEO_CLUSTERS[slug]?.lastReviewedDate)
    .filter((value): value is string => Boolean(value))
    .sort();

  return dates.at(-1);
}

export const CORE_CA_LAUNCH_REVIEWED_DATE =
  getLatestReviewedDate([
    'ihss-for-children',
    'regional-center-eligibility',
    'iep-assessment-request',
    'medi-cal-epsdt',
  ]) ?? undefined;

export const IHSS_LAUNCH_REVIEWED_DATE =
  getLatestReviewedDate([
    'ihss-for-children',
    'ihss-protective-supervision',
    'soc-873',
    'soc-295',
    'soc-821',
  ]) ?? undefined;

export const IEP_LAUNCH_REVIEWED_DATE =
  getLatestReviewedDate([
    'iep-assessment-request',
    'prior-written-notice-request',
    'cde-state-complaint',
    'due-process-complaint',
  ]) ?? undefined;

export const REGIONAL_CENTER_LAUNCH_REVIEWED_DATE =
  getLatestReviewedDate([
    'regional-center-eligibility',
    'regional-center-intake-request',
    'regional-center-service-request',
    'regional-center-appeal-request',
  ]) ?? undefined;
