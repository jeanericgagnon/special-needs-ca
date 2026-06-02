import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeDDS() {
    console.log("Launching browser to scrape Department of Developmental Services (DDS)...");
    const browser = await chromium.launch({ headless: false, slowMo: 60 });
    const context = await browser.newContext();
    const page = await context.newPage();

    // 1. Regional Center Eligibility
    console.log("Navigating to DDS: Regional Center Eligibility (Lanterman Act)...");
    await page.goto('https://www.dds.ca.gov/rc/eligibility/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    // Demonstrate interaction
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));

    console.log('Extracting Regional Center eligibility criteria...');
    const rcData = await page.evaluate(() => {
        const sections = [];
        const contentElements = document.querySelectorAll('main h2, main h3, main p, main li, article h2, article h3, article p, article li, #main-content h2, #main-content h3, #main-content p, #main-content li, h2, h3, p, li');
        let currentSection = { heading: 'Eligibility', content: [] };
        
        for (const el of contentElements) {
            const tagName = el.tagName.toLowerCase();
            if (['h2', 'h3'].includes(tagName)) {
                if (currentSection.content.length > 0 || currentSection.heading !== 'Eligibility') {
                    sections.push(currentSection);
                }
                currentSection = { heading: el.innerText.trim(), content: [] };
            } else if (['p', 'li'].includes(tagName)) {
                const text = el.innerText.trim();
                if (text.length > 15) currentSection.content.push(text);
            }
        }
        if (currentSection.content.length > 0) sections.push(currentSection);
        return sections;
    });

    // 2. HCBS Waiver for Developmental Disabilities
    console.log("Navigating to DDS: HCBS Waiver (Institutional Deeming)...");
    await page.goto('https://www.dds.ca.gov/services/hcbs/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));

    console.log('Extracting HCBS Waiver rules...');
    const hcbsData = await page.evaluate(() => {
        const sections = [];
        const contentElements = document.querySelectorAll('main h2, main h3, main p, main li, article h2, article h3, article p, article li, #main-content h2, #main-content h3, #main-content p, #main-content li, h2, h3, p, li');
        let currentSection = { heading: 'HCBS Waiver', content: [] };
        
        for (const el of contentElements) {
            const tagName = el.tagName.toLowerCase();
            if (['h2', 'h3'].includes(tagName)) {
                if (currentSection.content.length > 0 || currentSection.heading !== 'HCBS Waiver') {
                    sections.push(currentSection);
                }
                currentSection = { heading: el.innerText.trim(), content: [] };
            } else if (['p', 'li'].includes(tagName)) {
                const text = el.innerText.trim();
                if (text.length > 15) currentSection.content.push(text);
            }
        }
        if (currentSection.content.length > 0) sections.push(currentSection);
        return sections;
    });

    const extractedData = {
        title: "DDS Regional Center & HCBS Waiver Guidelines",
        source: "Department of Developmental Services (DDS)",
        timestamp: new Date().toISOString(),
        regionalCenterEligibility: rcData,
        hcbsWaiver: hcbsData
    };

    console.log(`Extraction complete. Found ${rcData.length} sections for RC Eligibility and ${hcbsData.length} for HCBS Waiver.`);

    const outputDir = path.join(__dirname, '../data/raw');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'dds_regional_center_hcbs.json');
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    
    console.log(`Saved extracted data to ${outputFile}`);
    
    console.log('Closing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    await browser.close();
    console.log('DDS scraping finished successfully.');
}

scrapeDDS().catch(err => {
    console.error('Error during scraping:', err);
    process.exit(1);
});
