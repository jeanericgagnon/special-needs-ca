export const DIRECTORY_ANALYTICS_EVENTS = [
  'directory_search',
  'directory_no_results',
  'directory_dead_end',
  'directory_resource_click',
  'directory_application_click',
  'directory_phone_click',
  'directory_email_click',
  'directory_form_download',
  'directory_save_resource',
  'directory_next_step_click',
] as const;

export type DirectoryAnalyticsEventName = (typeof DIRECTORY_ANALYTICS_EVENTS)[number];
export const DIRECTORY_ANALYTICS_RECORD_TYPES = ['provider', 'nonprofit', 'advocate', 'program', 'office'] as const;
export const DIRECTORY_ANALYTICS_PAGE_TYPES = ['find_help', 'county', 'county_diagnosis', 'advocates', 'forms'] as const;
const DIRECTORY_ANALYTICS_NEXT_STEP_TYPES = [
  'call',
  'email',
  'apply_online',
  'referral',
  'schedule',
  'walk_in',
  'download_form',
  'contact_form',
  'see_instructions',
  'unknown',
] as const;
const MAX_ANALYTICS_TEXT_LENGTH = 120;

type DirectoryAnalyticsRecordType = (typeof DIRECTORY_ANALYTICS_RECORD_TYPES)[number];
type DirectoryAnalyticsPageType = (typeof DIRECTORY_ANALYTICS_PAGE_TYPES)[number];
type DirectoryAnalyticsNextStepType = (typeof DIRECTORY_ANALYTICS_NEXT_STEP_TYPES)[number];

export type DirectoryAnalyticsPayload = {
  event: DirectoryAnalyticsEventName;
  recordId?: string;
  recordType?: DirectoryAnalyticsRecordType;
  stateId?: string;
  countyId?: string;
  pageType?: DirectoryAnalyticsPageType;
  searchQuery?: string;
  resultCount?: number;
  nextStepType?: string;
};

export const DIRECTORY_ANALYTICS_BRIDGE_EVENT = 'ablefull:directory-analytics';

declare global {
  interface Window {
    __ABLEFULL_DIRECTORY_ANALYTICS__?: DirectoryAnalyticsPayload[];
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function isDirectoryAnalyticsEventName(value: string): value is DirectoryAnalyticsEventName {
  return DIRECTORY_ANALYTICS_EVENTS.includes(value as DirectoryAnalyticsEventName);
}

function sanitizeAnalyticsId(value?: string): string | undefined {
  if (!value) return undefined;
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_ANALYTICS_TEXT_LENGTH);
  return sanitized || undefined;
}

function sanitizeAnalyticsEnum<T extends readonly string[]>(value: string | undefined, allowed: T): T[number] | undefined {
  if (!value) return undefined;
  return allowed.includes(value as T[number]) ? (value as T[number]) : undefined;
}

function redactSearchQuery(value?: string): string | undefined {
  if (!value) return undefined;

  const normalized = value
    .replace(/\s+/g, ' ')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/(?:\+?1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/g, '[redacted-phone]')
    .trim()
    .slice(0, MAX_ANALYTICS_TEXT_LENGTH);

  return normalized || undefined;
}

function sanitizeResultCount(value?: number): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(0, Math.trunc(value));
}

export function sanitizeDirectoryAnalyticsPayload(payload: DirectoryAnalyticsPayload): DirectoryAnalyticsPayload {
  return {
    event: payload.event,
    recordId: sanitizeAnalyticsId(payload.recordId),
    recordType: sanitizeAnalyticsEnum(payload.recordType, DIRECTORY_ANALYTICS_RECORD_TYPES),
    stateId: sanitizeAnalyticsId(payload.stateId),
    countyId: sanitizeAnalyticsId(payload.countyId),
    pageType: sanitizeAnalyticsEnum(payload.pageType, DIRECTORY_ANALYTICS_PAGE_TYPES),
    searchQuery: redactSearchQuery(payload.searchQuery),
    resultCount: sanitizeResultCount(payload.resultCount),
    nextStepType: sanitizeAnalyticsEnum(payload.nextStepType, DIRECTORY_ANALYTICS_NEXT_STEP_TYPES) as DirectoryAnalyticsNextStepType | undefined,
  };
}

export function trackDirectoryAnalyticsEvent(payload: DirectoryAnalyticsPayload): DirectoryAnalyticsPayload | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const sanitized = sanitizeDirectoryAnalyticsPayload(payload);
  window.__ABLEFULL_DIRECTORY_ANALYTICS__ ||= [];
  window.__ABLEFULL_DIRECTORY_ANALYTICS__.push(sanitized);
  window.dispatchEvent(new CustomEvent(DIRECTORY_ANALYTICS_BRIDGE_EVENT, { detail: sanitized }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ ...sanitized });
  }

  return sanitized;
}
