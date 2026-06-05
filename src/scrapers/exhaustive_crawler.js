import { PlaywrightCrawler } from 'crawlee';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the crawler database
const dbPath = path.resolve(__dirname, '../../ca_disability_crawler.db');
const db = new Database(dbPath);
const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO raw_scraped_pages (url, domain, title, raw_text) 
    VALUES (?, ?, ?, ?)
`);

// The massive seed list for the crawler
const seedUrls = [
    // Previous State Core (still useful to rescan deeply)
    'https://www.cdss.ca.gov/in-home-supportive-services',
    'https://www.dhcs.ca.gov/',
    'https://www.dds.ca.gov/',
    'https://www.cde.ca.gov/sp/se/', 
    
    // Master Aggregators & Rare Diseases
    'https://specialneeds.help', // HELPipedia
    'https://health.ucdavis.edu/mindinstitute/', // UC Davis MIND
    'https://www.cdph.ca.gov/Programs/CFH/DGDS/Pages/default.aspx', // Genetic Disease Screening
    'https://rarediseases.org/rare-disease-centers-of-excellence/', // NORD
    
    // Cross-Disability & Family Support
    'https://californiafamilyempowermentcenters.org',
    'https://frcnca.org', // Family Resource Centers Network
    'https://scdd.ca.gov/', // State Council on Developmental Disabilities
    
    // Diagnosis-Specific Networks
    'https://www.autismsocietyca.org',
    'https://ucp.org', // Cerebral Palsy
    'https://www.epilepsy.com/local/california',
    'https://www.globaldownsyndrome.org',
    'https://www.cadeafblind.org',
    'https://www.csb-cde.ca.gov', // School for the Blind
    'https://www.csdf.k12.ca.us', // School for the Deaf
    'https://ldaca.org', // Learning Disabilities Association
    
    // Financial & Federal Safety Nets
    'https://www.calable.ca.gov',
    'https://www.ssa.gov/ssi/text-child-ussi.htm'
];

// Keywords we care about for filtering
const keywords = [
    'waiver', 'disability', 'ihss', 'ccs', 'lanterman', 'regional center',
    'special education', 'iep', 'down syndrome', 'medical complexity',
    'home and community', 'hcbs', 'protective supervision',
    'autism', 'cerebral palsy', 'epilepsy', 'adhd', 'dyslexia',
    'medically fragile', 'ifsp', 'family empowerment', 'calable', 'ssi', 
    'early start', 'rare disease', 'genetic', 'blind', 'deaf', 'hard of hearing'
];

console.log('Starting the Exhaustive Crawlee Spider...');
console.log('This crawler will spider across all links on the seeded domains up to a depth of 5.');

const crawler = new PlaywrightCrawler({
    // Limits for testing. In the 24-hour run, maxRequestsPerCrawl can be removed or set to 100000.
    maxRequestsPerCrawl: process.env.TEST_MODE ? 50 : 50000,
    maxConcurrency: 5, // Lower concurrency for browser-based crawlers to save local resources
    
    // Stealth & Anti-bot Launch Options
    launchContext: {
        launchOptions: {
            headless: true,
            args: [
                '--disable-blink-features=AutomationControlled',
                '--use-fake-device-for-media-stream',
                '--use-fake-ui-for-media-stream'
            ]
        }
    },
    
    // Rotate sessions to bypass CDN / IP blocks
    useSessionPool: true,
    sessionPoolOptions: {
        maxPoolSize: 50,
        sessionOptions: {
            maxUsageCount: 10
        }
    },
    
    // Pre-navigation hooks to set stealth headers and user-agents
    preNavigationHooks: [
        async ({ page }) => {
            await page.setExtraHTTPHeaders({
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7',
                'Referer': 'https://www.google.com/'
            });
        }
    ],
    
    async requestHandler({ request, page, enqueueLinks, log }) {
        // Request throttling: introduce a variable delay to prevent rate-limit bans
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
        const title = await page.title();
        const url = request.loadedUrl || request.url;
        const domain = new URL(url).hostname;
        
        // Extract text from paragraph, list, and heading elements inside browser page context
        const rawText = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('p, li, h1, h2, h3, h4'));
            return elements.map(el => el.innerText.trim()).filter(Boolean).join('\n');
        });
        
        // Check if the page contains relevant keywords before saving
        const lowerText = rawText.toLowerCase();
        const hasKeyword = keywords.some(kw => lowerText.includes(kw));

        if (hasKeyword && rawText.length > 200) {
            log.info(`Found relevant page: ${title} (${url})`);
            
            // Save to SQLite
            try {
                insertStmt.run(url, domain, title, rawText);
            } catch (err) {
                log.error(`Failed to insert ${url} into DB: ${err.message}`);
            }
        }

        // Enqueue links that belong to the same domains
        await enqueueLinks({
            strategy: 'same-domain',
        });
    },

    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

async function startCrawl() {
    console.log(`Adding ${seedUrls.length} seed URLs...`);
    await crawler.addRequests(seedUrls);
    
    console.log('Crawler starting...');
    await crawler.run();
    console.log('Crawler finished successfully.');
    db.close();
}

startCrawl().catch(err => {
    console.error('Crawler failed:', err);
    db.close();
});
