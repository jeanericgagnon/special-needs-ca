import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles'
  });
  
  const page = await context.newPage();
  const url = 'https://connect.copaa.org/copaathrivecommunity/network/find-a-professional/find-a-professional32';
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    console.log("Selecting State: CA...");
    // Select CA by value or label
    await page.selectOption('#MainCopy_ctl06_ucCountryStateProvinceList_ddlState', { label: 'California' });
    await page.waitForTimeout(1000);
    
    console.log("Clicking Search...");
    await page.click('#MainCopy_ctl13_FindContacts');
    
    console.log("Waiting for results to load...");
    // Wait for either the search results container or some timeout
    await page.waitForTimeout(8000);
    
    // Save screenshot
    const screenshotPath = path.resolve(__dirname, 'copaa_results.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to ${screenshotPath}`);
    
    // Save HTML
    const html = await page.content();
    const htmlPath = path.resolve(__dirname, 'copaa_results.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`HTML saved to ${htmlPath}`);
    
    // Parse result count or some selectors
    const resultText = await page.evaluate(() => {
      // Look for result count elements, e.g., "Found X contacts" or list elements
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, div, span'));
      return headings
        .map(h => h.innerText?.trim() || '')
        .filter(t => t.includes('found') || t.includes('result') || t.includes('record'))
        .slice(0, 10);
    });
    console.log("Potential result count strings:", resultText);

    // List some links and class names on page
    const elements = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href') || '',
        className: a.className
      })).filter(l => l.text.length > 0).slice(0, 20);
      
      const listClasses = Array.from(document.querySelectorAll('div, ul, li')).map(e => e.className).filter(c => c && (c.includes('list') || c.includes('result') || c.includes('contact') || c.includes('member') || c.includes('profile'))).slice(0, 20);
      
      return { links, listClasses };
    });
    console.log("Found links (first 20):", elements.links);
    console.log("List classes (first 20):", elements.listClasses);
    
  } catch (err) {
    console.error("Error:", err.stack);
  }
  
  await browser.close();
}

main();
