import { chromium } from 'playwright';

// Curated list of desktop User-Agents
export const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0'
];

/**
 * Returns a random desktop User-Agent from the curated list.
 * @returns {string}
 */
export function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Launches a Playwright Chromium browser instance with custom options.
 * @param {Object} options - Playwright launch options
 * @returns {Promise<import('playwright').Browser>}
 */
export async function launchBrowser(options = {}) {
  const { args: customArgs, headless, ...remainingOptions } = options;
  const args = [
    '--disable-blink-features=AutomationControlled',
    ...(customArgs || [])
  ];

  return await chromium.launch({
    headless: headless !== false,
    args,
    ...remainingOptions
  });
}

/**
 * Creates a browser context with user agent rotation and anti-fingerprinting.
 * @param {import('playwright').Browser} browser - Playwright Browser instance
 * @param {Object} options - Custom context options
 * @returns {Promise<import('playwright').BrowserContext>}
 */
export async function createContext(browser, options = {}) {
  const {
    userAgent,
    viewport,
    locale,
    timezoneId,
    extraHTTPHeaders,
    ...remainingOptions
  } = options;

  const resolvedUserAgent = userAgent || getRandomUserAgent();
  const resolvedLocale = locale || 'en-US';

  const context = await browser.newContext({
    userAgent: resolvedUserAgent,
    viewport: viewport || { width: 1280, height: 720 },
    locale: resolvedLocale,
    timezoneId: timezoneId || 'America/New_York',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': `${resolvedLocale},en;q=0.9`,
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      ...(extraHTTPHeaders || {})
    },
    ...remainingOptions
  });

  // Inject initialization script to remove navigator.webdriver indicators
  await context.addInitScript(() => {
    try {
      const newProto = Object.getPrototypeOf(navigator);
      delete newProto.webdriver;
    } catch {
      // Fallback in case of restrictions on proto modification
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined
      });
    }
  });

  return context;
}

/**
 * Helper to launch a browser and create a context and page directly.
 * @param {Object} options - Combined launch and context options
 * @returns {Promise<{browser: import('playwright').Browser, context: import('playwright').BrowserContext, page: import('playwright').Page}>}
 */
export async function createStealthPage(options = {}) {
  const browser = await launchBrowser(options);
  try {
    const context = await createContext(browser, options);
    const page = await context.newPage();
    return { browser, context, page };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
