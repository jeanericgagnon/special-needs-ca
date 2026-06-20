export const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
export const DEFAULT_BODY_TIMEOUT_MS = 15000;

function buildTimeoutError(stage, timeoutMs) {
  const error = new Error(`${stage}_timed_out_after_${timeoutMs}ms`);
  error.name = 'TimeoutError';
  error.stage = stage;
  error.timeoutMs = timeoutMs;
  return error;
}

function clearTimer(timer) {
  if (timer) clearTimeout(timer);
}

async function readBodyWithTimeout(response, contentType, controller, timeoutMs) {
  let timer = null;
  try {
    timer = setTimeout(() => {
      controller.abort(buildTimeoutError('body_read', timeoutMs));
    }, timeoutMs);

    if (contentType.includes('application/pdf')) {
      return Buffer.from(await response.arrayBuffer());
    }

    return await response.text();
  } finally {
    clearTimer(timer);
  }
}

export async function fetchWithRetry(url, args = {}) {
  const retryCount = Number(args.retryCount ?? 2);
  const requestTimeoutMs = Number(args.requestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS);
  const bodyTimeoutMs = Number(args.bodyTimeoutMs ?? DEFAULT_BODY_TIMEOUT_MS);

  let lastError = null;

  for (let attempt = 1; attempt <= retryCount + 1; attempt += 1) {
    const controller = new AbortController();
    let requestTimer = null;

    try {
      requestTimer = setTimeout(() => {
        controller.abort(buildTimeoutError('request', requestTimeoutMs));
      }, requestTimeoutMs);

      const response = await fetch(url, {
        headers: {
          'user-agent': 'Ablefull source acquisition runner/1.0 (+https://ablefull.com)',
          'accept-language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimer(requestTimer);

      const contentType = response.headers.get('content-type') || '';
      const body = await readBodyWithTimeout(response, contentType, controller, bodyTimeoutMs);

      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url || url,
        contentType,
        body,
        attempt,
      };
    } catch (error) {
      clearTimer(requestTimer);
      lastError = error;
      if (attempt <= retryCount) {
        await new Promise((resolve) => setTimeout(resolve, Number(args.rateLimitMs ?? 1200)));
      }
    }
  }

  throw lastError;
}
