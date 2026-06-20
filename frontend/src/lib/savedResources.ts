export const DIRECTORY_SAVED_RESOURCES_KEY = 'ablefull_saved_directory_resources';
const MAX_SAVED_RESOURCES = 100;
const MAX_TEXT_LENGTH = 200;

export type SavedDirectoryResource = {
  id: string;
  name: string;
  recordType: 'provider' | 'nonprofit' | 'advocate' | 'program' | 'office';
  stateId?: string;
  countyId?: string;
  pageType?: 'find_help' | 'county' | 'county_diagnosis' | 'advocates' | 'forms';
  originPath?: string;
  phone?: string;
  email?: string;
  website?: string;
  sourceUrl?: string;
  verificationStatus?: string;
  savedAt: string;
};

export function getSavedDirectoryResourceAnchorId(resourceId: string): string {
  const normalized = sanitizeIdValue(resourceId) || 'resource';
  return `directory-resource-${normalized}`;
}

function sanitizeTextValue(value?: string | null, maxLength = MAX_TEXT_LENGTH): string | undefined {
  if (!value) return undefined;
  const sanitized = value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
  return sanitized || undefined;
}

function sanitizeIdValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, MAX_TEXT_LENGTH);
  return sanitized || undefined;
}

function sanitizeUrlValue(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return url.toString().slice(0, 500);
  } catch {
    return undefined;
  }
}

function sanitizeOriginPath(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) return undefined;
  if (trimmed.startsWith('//')) return undefined;
  return trimmed.slice(0, 500);
}

function sanitizeSavedAt(value?: string | null): string {
  if (!value) return new Date().toISOString();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) return new Date().toISOString();
  return parsed.toISOString();
}

export function normalizeSavedDirectoryResource(input: Partial<SavedDirectoryResource>): SavedDirectoryResource | null {
  const id = sanitizeIdValue(input.id);
  const name = sanitizeTextValue(input.name);
  const recordType = input.recordType;

  if (!id || !name || !recordType) {
    return null;
  }

  return {
    id,
    name,
    recordType,
    stateId: sanitizeIdValue(input.stateId),
    countyId: sanitizeIdValue(input.countyId),
    pageType: input.pageType,
    originPath: sanitizeOriginPath(input.originPath),
    phone: sanitizeTextValue(input.phone, 60),
    email: sanitizeTextValue(input.email, 160),
    website: sanitizeUrlValue(input.website),
    sourceUrl: sanitizeUrlValue(input.sourceUrl),
    verificationStatus: sanitizeTextValue(input.verificationStatus, 60),
    savedAt: sanitizeSavedAt(input.savedAt),
  };
}

export function parseSavedDirectoryResources(raw: string): SavedDirectoryResource[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeSavedDirectoryResource(item))
      .filter((item): item is SavedDirectoryResource => Boolean(item))
      .slice(0, MAX_SAVED_RESOURCES);
  } catch {
    return [];
  }
}

export function serializeSavedDirectoryResources(items: SavedDirectoryResource[]): string {
  return JSON.stringify(items.slice(0, MAX_SAVED_RESOURCES));
}

function getStoredSavedResourcesRaw(): string {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem(DIRECTORY_SAVED_RESOURCES_KEY) || '[]';
}

function setStoredSavedResourcesRaw(value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DIRECTORY_SAVED_RESOURCES_KEY, value);
}

export function getSavedDirectoryResources(): SavedDirectoryResource[] {
  if (typeof window === 'undefined') return [];
  return parseSavedDirectoryResources(getStoredSavedResourcesRaw());
}

export function isDirectoryResourceSaved(id: string, recordType: SavedDirectoryResource['recordType']): boolean {
  const normalizedId = sanitizeIdValue(id);
  if (!normalizedId) return false;
  return getSavedDirectoryResources().some((item) => item.id === normalizedId && item.recordType === recordType);
}

export function saveDirectoryResource(resource: Partial<SavedDirectoryResource>): SavedDirectoryResource | null {
  if (typeof window === 'undefined') return null;
  const normalized = normalizeSavedDirectoryResource(resource);
  if (!normalized) return null;

  const next = [
    normalized,
    ...getSavedDirectoryResources().filter((item) => !(item.id === normalized.id && item.recordType === normalized.recordType)),
  ].slice(0, MAX_SAVED_RESOURCES);

  setStoredSavedResourcesRaw(serializeSavedDirectoryResources(next));
  return normalized;
}

export function removeSavedDirectoryResource(id: string, recordType: SavedDirectoryResource['recordType']): void {
  if (typeof window === 'undefined') return;
  const normalizedId = sanitizeIdValue(id);
  if (!normalizedId) return;
  const next = getSavedDirectoryResources().filter((item) => !(item.id === normalizedId && item.recordType === recordType));
  setStoredSavedResourcesRaw(serializeSavedDirectoryResources(next));
}

export function toggleSavedDirectoryResource(resource: Partial<SavedDirectoryResource>): { saved: boolean; resource: SavedDirectoryResource | null } {
  const normalized = normalizeSavedDirectoryResource(resource);
  if (!normalized) {
    return { saved: false, resource: null };
  }

  if (isDirectoryResourceSaved(normalized.id, normalized.recordType)) {
    removeSavedDirectoryResource(normalized.id, normalized.recordType);
    return { saved: false, resource: normalized };
  }

  const saved = saveDirectoryResource(normalized);
  return { saved: Boolean(saved), resource: saved };
}
