import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeCCS() {
    console.log("Launching browser to scrape California Children's Services (CCS) guidelines...");
    const browser = await chromium.launch({ headless: false, slowMo: 60 });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log("Navigating to DHCS: California Children's Services...");
    // Official DHCS page for CCS
    await page.goto('https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(2000);

    console.log('Extracting CCS eligibility, covered conditions, and application process...');
    
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
            source: 'Department of Health Care Services (DHCS)',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            sections: sections
        };
    });
    
    console.log(`Extraction complete. Found ${extractedData.sections.length} critical sections on CCS.`);

    const outputDir = path.join(__dirname, '../data/raw');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, 'dhcs_ccs.json');
    fs.writeFileSync(outputFile, JSON.stringify(extractedData, null, 2));
    
    console.log(`Saved extracted data to ${outputFile}`);
    
    console.log('Closing browser in 3 seconds...');
    await page.waitForTimeout(3000);
    
    await browser.close();
    console.log('CCS scraping finished successfully.');
}

scrapeCCS().catch(err => {
    console.error('Error during scraping:', err);
    process.exit(1);
});
