import { chromium } from 'playwright';

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
    await page.waitForTimeout(4000);
    
    // Dump only non-checkbox, visible form inputs
    const formFields = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      return inputs
        .map(i => {
          // Get label text if any
          let labelText = '';
          if (i.id) {
            const label = document.querySelector(`label[for="${i.id}"]`);
            if (label) labelText = label.innerText.trim();
          }
          // Fallback to parent text if no explicit label
          if (!labelText && i.parentElement) {
            labelText = i.parentElement.innerText.split('\n')[0].trim();
          }
          
          return {
            tagName: i.tagName.toLowerCase(),
            name: i.getAttribute('name') || '',
            id: i.getAttribute('id') || '',
            type: i.getAttribute('type') || '',
            labelText,
            value: i.getAttribute('value') || '',
            visible: i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().height > 0
          };
        })
        .filter(i => i.name && !i.name.startsWith('__') && i.type !== 'checkbox' && i.type !== 'hidden' && i.visible);
    });
    
    console.log("Filtered Search Form Fields:");
    console.log(JSON.stringify(formFields, null, 2));
    
  } catch (err) {
    console.error("Error:", err.message);
  }
  
  await browser.close();
}

main();
