function hostFromUrl(rawUrl) {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function resolveUrl(baseUrl, rawUrl) {
  if (!rawUrl) return '';
  try {
    return new URL(rawUrl, baseUrl).toString();
  } catch {
    return '';
  }
}

function hasSupportCue(link) {
  const combined = `${link.text || ''} ${link.href || ''}`.toLowerCase();
  return /(contact|location|address|directions|campus|visit|find us|hours)/i.test(combined);
}

function scoreSupportLink(link, baseUrl) {
  let score = 0;
  const text = String(link.text || '').toLowerCase();
  const href = String(link.rawHref || link.resolvedUrl || link.href || '').toLowerCase();
  const resolved = link.resolvedUrl || resolveUrl(baseUrl, href);
  if (!resolved) return -1;
  if (href === '#' || href.startsWith('javascript:')) return -1;
  try {
    const resolvedUrl = new URL(resolved);
    const base = new URL(baseUrl);
    if (resolvedUrl.origin === base.origin && resolvedUrl.pathname === base.pathname && (resolvedUrl.hash || '').trim()) return -1;
  } catch {
    // Ignore malformed URLs; later filters will drop them if needed.
  }
  if (text.includes('address')) score += 5;
  if (text.includes('location')) score += 4;
  if (text.includes('contact')) score += 3;
  if (text.includes('campus')) score += 2;
  if (href.includes('contact')) score += 3;
  if (href.includes('location')) score += 3;
  if (href.includes('address')) score += 3;
  if (href.includes('campus')) score += 1;
  if (href.includes('mailto:') || href.includes('tel:')) return -1;
  return score;
}

export function pickProviderSupportLink(parsedRecord) {
  const baseUrl = parsedRecord.finalUrl || parsedRecord.sourceUrl || '';
  const baseHost = hostFromUrl(baseUrl);
  if (!baseHost) return null;

  const candidates = (parsedRecord.links || [])
    .map((link) => {
      const resolvedUrl = resolveUrl(baseUrl, link.href);
      return {
        rawHref: link.href || '',
        text: link.text || '',
        resolvedUrl,
        host: hostFromUrl(resolvedUrl),
      };
    })
    .filter((link) => link.resolvedUrl && link.host && (link.host === baseHost || link.host.endsWith(`.${baseHost}`) || baseHost.endsWith(`.${link.host}`)))
    .filter((link) => hasSupportCue(link))
    .map((link) => ({
      ...link,
      score: scoreSupportLink(link, baseUrl),
    }))
    .filter((link) => link.score >= 0)
    .sort((a, b) => b.score - a.score || a.resolvedUrl.localeCompare(b.resolvedUrl));

  return candidates[0] || null;
}

export function mergeProviderSupportExtraction(baseRecord, supportRecord) {
  const baseExtraction = baseRecord.familyExtraction || {};
  const supportExtraction = supportRecord.familyExtraction || {};
  return {
    extractedName: baseExtraction.organizationName || supportExtraction.organizationName || '',
    extractedAddress: baseExtraction.contactAddress || supportExtraction.contactAddress || '',
    extractedPhone: baseExtraction.contactPhone || supportExtraction.contactPhone || '',
    extractedEmail: baseExtraction.contactEmail || supportExtraction.contactEmail || '',
    supportPublicContactSignalCount: Number(supportExtraction.publicContactSignalCount || 0),
    supportSourceUrl: supportRecord.finalUrl || supportRecord.sourceUrl || '',
  };
}
