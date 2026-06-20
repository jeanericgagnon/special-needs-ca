const sandboxNetworkDisabled = String(process.env.CODEX_SANDBOX_NETWORK_DISABLED || '').trim() === '1';

function isLikelyMalformedCountyHostname(result) {
  let hostname = String(result.hostname || '').toLowerCase();
  if (!hostname) {
    try {
      hostname = new URL(result.finalUrl || result.sourceUrl || '').hostname.toLowerCase();
    } catch {
      hostname = '';
    }
  }
  const gapFamily = String(result.gapFamily || '').trim();
  const targetTable = String(result.targetTable || '').trim();
  if (gapFamily !== 'medicaid_hhs_offices' && targetTable !== 'county_offices') return false;
  return /^www\.[a-z-]+county\.ca\.gov$/.test(hostname);
}

export function classifyFailure(result) {
  const status = Number(result.status || 0);
  const error = String(result.error || '').toLowerCase();
  const errorCode = String(result.errorCode || '').toUpperCase();

  if (error.includes('credentials')) {
    return {
      bucket: 'source_repair',
      reason: 'invalid_url_credentials',
    };
  }

  if (error.includes('dns_lookup_failed') || errorCode === 'ENOTFOUND') {
    if (isLikelyMalformedCountyHostname(result)) {
      return {
        bucket: 'source_repair',
        reason: 'malformed_county_hostname',
      };
    }
    if (sandboxNetworkDisabled) {
      return {
        bucket: 'blocked',
        reason: 'sandbox_network_disabled',
      };
    }
    return {
      bucket: 'source_repair',
      reason: 'dns_lookup_failed',
    };
  }

  if (error.includes('timeout') || error.includes('timed_out') || errorCode === 'TIMEOUT') {
    return {
      bucket: 'retryable',
      reason: 'network_timeout',
    };
  }

  if (error.includes('fetch failed')) {
    return {
      bucket: 'retryable',
      reason: 'network_fetch_failed',
    };
  }

  if ([500, 502, 503, 504, 523, 530].includes(status)) {
    return {
      bucket: 'retryable',
      reason: `server_${status}`,
    };
  }

  if ([401, 403, 409, 421, 444, 999].includes(status)) {
    return {
      bucket: 'blocked',
      reason: `access_blocked_${status}`,
    };
  }

  if ([400, 404, 410, 451].includes(status)) {
    return {
      bucket: 'source_repair',
      reason: `stale_or_invalid_${status}`,
    };
  }

  if (!result.status && !result.error) {
    return {
      bucket: 'blocked',
      reason: 'unknown_failure',
    };
  }

  return {
    bucket: 'blocked',
    reason: status ? `needs_review_${status}` : 'needs_review_unknown',
  };
}

export function classifyParseReady(row) {
  const hostname = String(row.hostname || '').toLowerCase();
  const finalUrl = String(row.finalUrl || row.sourceUrl || '').toLowerCase();
  const contentType = String(row.contentType || '').toLowerCase();

  const suspectHostPatterns = [
    'facebook.com',
    'linkedin.com',
    'accounts.google.com',
    'sites.google.com',
    'yahoo.com',
    'hugedomains.com',
    'buydomains.com',
    'networksolutions.com',
    'vistaprint.com',
    't-mobile.com',
  ];

  if (suspectHostPatterns.some((pattern) => hostname.includes(pattern))) {
    return {
      bucket: 'parse_ready_suspect',
      reason: 'suspect_redirect_or_platform',
    };
  }

  if (finalUrl.includes('/login') || finalUrl.includes('/signin') || finalUrl.includes('/account')) {
    return {
      bucket: 'parse_ready_suspect',
      reason: 'auth_or_account_page',
    };
  }

  if (!contentType.includes('html') && !contentType.includes('pdf') && !contentType.includes('wordprocessingml')) {
    return {
      bucket: 'parse_ready_suspect',
      reason: 'non_primary_document_type',
    };
  }

  return {
    bucket: 'parse_ready_high_signal',
    reason: 'http_success_useful_artifact',
  };
}
