import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeHCBA() {
    console.log("Launching browser to scrape Home and Community-Based Alternatives (HCBA) Waiver guidelines...");
    const browser = await chromium.launch({ headless: false, slowMo: 60 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to DHCS: HCBA Waiver page...");
    // Official DHCS page for HCBA Waiver
    await page.goto('https://www.dhcs.ca.gov/services/ltc/Pages/Home-and-Community-Based-(HCB)-Alternatives-Waiver.aspx', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(2000);

    console.log('Extracting HCBA Waiver eligibility, waitlist information, and nursing level of care criteria...');
    
    // Demonstrate interaction
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Extract the textual data
    const extractedData = await page.evaluate(() => {
        const sections = [];
        
        // Find main content block
        const contentElements = document.querySelectorAll('#ctl00_PlaceHolderMain_ctl00_label h2, #ctl00_PlaceHolderMain_ctl00_label h3, #ctl00_PlaceHolderMain_ctl00_label p, #ctl00_PlaceHolderMain_ctl00_label ul > li, .ms-rtestate-field h2, .ms-rtestate-field h3, .ms-rtestate-field p, .ms-rtestate-field li, main h2, main h3, main p, main li');
        
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
            source: 'Department of Health Care Services (DHCS) - HCBA',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            sections: sections
        };
    });
    
    console.log(`Extraction complete. Found ${extractedData.sections.length} critical sections on HCBA Waiver.`);

    const outputDir = path.join(__dirname, '../data/raw');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'dhcs_hcba.json');
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    
    console.log(`Saved extracted data to ${outputFile}`);
    
    console.log('Closing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    
    await browser.close();
    console.log('HCBA scraping finished successfully.');
}

scrapeHCBA().catch(err => {
    console.error('Error during scraping:', err);
    process.exit(1);
});
