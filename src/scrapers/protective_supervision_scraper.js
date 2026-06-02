import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeProtectiveSupervision() {
    console.log('Launching browser to scrape Protective Supervision guidelines...');
    const browser = await chromium.launch({ headless: false, slowMo: 60 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to CDSS Protective Supervision Guide...');
    // Using the official CDSS page since the DRC one moved
    await page.goto('https://www.cdss.ca.gov/inforesources/ihss/protective-supervision', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(2000);

    console.log('Extracting Protective Supervision eligibility rules and case law...');
    
    // Demonstrate interaction
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy(0, 800));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Extract the textual data, specifically looking for headings and paragraphs
    const extractedData = await page.evaluate(() => {
        const sections = [];
        
        // Find main content block
        const contentElements = document.querySelectorAll('main, article, .content-container, h1, h2, h3, p, ul > li');
        
        let currentSection = { heading: 'Introduction', content: [] };
        
        for (const el of contentElements) {
            const tagName = el.tagName.toLowerCase();
            
            if (['h2', 'h3'].includes(tagName)) {
                if (currentSection.content.length > 0 || currentSection.heading !== 'Introduction') {
                    sections.push(currentSection);
                }
                currentSection = { heading: el.innerText.trim(), content: [] };
            } else if (['p', 'li'].includes(tagName)) {
                const text = el.innerText.trim();
                if (text.length > 15) { 
                    currentSection.content.push(text);
                }
            }
        }
        if (currentSection.content.length > 0) {
            sections.push(currentSection);
        }
        
        return {
            title: document.title,
            source: 'Disability Rights California',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            sections: sections
        };
    });
    
    console.log(`Extraction complete. Found ${extractedData.sections.length} critical sections on Protective Supervision.`);

    const outputDir = path.join(__dirname, '../data/raw');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'ihss_protective_supervision.json');
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    
    console.log(`Saved extracted data to ${outputFile}`);
    
    console.log('Closing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    
    await browser.close();
    console.log('Protective Supervision scraping finished successfully.');
}

scrapeProtectiveSupervision().catch(err => {
    console.error('Error during scraping:', err);
    process.exit(1);
});
