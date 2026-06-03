import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio'; // If cheerio is available, else we use standard string/regex or JS DOM

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const htmlPath = path.resolve(__dirname, 'copaa_results.html');
  if (!fs.existsSync(htmlPath)) {
    console.error("File does not exist!");
    return;
  }
  
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(html);
  
  console.log("=== Inspecting Pagination ===");
  $('ul.pagination, .pagination, [class*="pagination"]').each((i, el) => {
    console.log(`Pagination class: ${$(el).attr('class')} id: ${$(el).attr('id')}`);
    console.log("Links inside pagination:");
    $(el).find('a').each((j, a) => {
      console.log(`  text: ${$(a).text().trim()}, href: ${$(a).attr('href')}, onclick: ${$(a).attr('onclick')}`);
    });
  });
  
  console.log("\n=== Inspecting Member Row Structure ===");
  const memberRows = $('.member-row, [class*="member-row"]');
  console.log(`Found ${memberRows.length} member rows`);
  
  if (memberRows.length > 0) {
    const firstRow = memberRows.first();
    console.log("HTML of first row:\n", firstRow.html()?.trim().substring(0, 1000));
    
    console.log("\nChildren details of first row:");
    firstRow.find('*').each((i, el) => {
      const className = $(el).attr('class');
      const tagName = el.tagName;
      if (className) {
        console.log(`  <${tagName} class="${className}">: text = "${$(el).text().trim().substring(0, 50)}"`);
      }
    });
  }
}

main();
