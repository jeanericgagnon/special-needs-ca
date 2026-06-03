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
  const url = 'https://connect.copaa.org/profile?UserKey=593f064b-cf20-471c-afe2-50d5f92b310f';
  console.log(`Navigating to profile ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    
    // Save screenshot
    const screenshotPath = path.resolve(__dirname, 'copaa_profile.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);
    
    // Save HTML
    const html = await page.content();
    const htmlPath = path.resolve(__dirname, 'copaa_profile.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`HTML saved to ${htmlPath}`);
    
    const pageTitle = await page.title();
    console.log(`Page Title: ${pageTitle}`);
    
  } catch (err) {
    console.error("Error:", err.stack);
  }
  
  await browser.close();
}

main();
