import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeIHSS() {
    console.log('Launching visible browser so you can watch...');
    // headless: false so the user can see it
    // slowMo: 50 adds a slight delay to actions so it's not a blur
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('Navigating to California Department of Social Services (CDSS) IHSS Page...');
    await page.goto('https://www.cdss.ca.gov/in-home-supportive-services', { waitUntil: 'domcontentloaded' });
    
    // Give it a moment so you can see the page loaded
    await page.waitForTimeout(2000);

    console.log('Extracting information from the page...');
    
    // Scroll down the page slightly to demonstrate interaction
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Extract textual data: specifically we want to get the main content area
    // Usually CDSS main content is in an article or main div. We'll pull headers and paragraphs.
    const extractedData = await page.evaluate(() => {
        const sections = [];
        
        // Find all headings and the paragraphs that follow them
        const contentElements = document.querySelectorAll('main, article, .content-container, h1, h2, h3, p, ul > li');
        
        let currentSection = { heading: 'Main', content: [] };
        
        for (const el of contentElements) {
            const tagName = el.tagName.toLowerCase();
            
            if (['h1', 'h2', 'h3'].includes(tagName)) {
                if (currentSection.content.length > 0 || currentSection.heading !== 'Main') {
                    sections.push(currentSection);
                }
                currentSection = { heading: el.innerText.trim(), content: [] };
            } else if (['p', 'li'].includes(tagName)) {
                const text = el.innerText.trim();
                if (text.length > 20) { // filter out short useless strings
                    currentSection.content.push(text);
                }
            }
        }
        sections.push(currentSection);
        
        return {
            title: document.title,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            sections: sections.filter(s => s.content.length > 0)
        };
    });
    
    console.log('Data extraction complete.');
    console.log(`Extracted ${extractedData.sections.length} informational sections.`);

    const outputDir = path.join(__dirname, '../data/raw');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'ihss_core.json');
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    
    console.log(`Saved extracted data to ${outputFile}`);
    
    // Wait a little before closing so you can see the final state
    console.log('Closing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    
    await browser.close();
    console.log('Scraping session finished successfully.');
}

scrapeIHSS().catch(err => {
    console.error('Error during scraping:', err);
    process.exit(1);
});
