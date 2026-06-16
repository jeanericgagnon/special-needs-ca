import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.resolve(__dirname, '../../data/raw_texas_eci_contractors.json');

async function scrapeEci() {
  console.log('⏳ Starting Texas ECI contractor scrape from citysearch...');
  
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const allCountyMappings = [];

  for (const letter of letters) {
    const url = `https://citysearch.hhsc.state.tx.us/home/searchalpha/${letter}`;
    console.log(`  Fetching letter: ${letter.toUpperCase()} from ${url}...`);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`  ⚠️ Failed to fetch letter ${letter}: ${response.statusText}`);
        continue;
      }
      
      const html = await response.text();
      
      // Split by county header
      const countyBlocks = html.split('<h2>Programs available in ');
      // The first block is header HTML, skip it
      for (let i = 1; i < countyBlocks.length; i++) {
        const block = countyBlocks[i];
        
        // Parse county name
        const countyHeaderEnd = block.indexOf(' county:</h2>');
        if (countyHeaderEnd === -1) continue;
        const countyNameRaw = block.substring(0, countyHeaderEnd).trim();
        const countyId = `${countyNameRaw.toLowerCase().replace(/\s+/g, '-')}-tx`;
        
        // Extract content inside each <p>...</p>
        const pRegex = /<p>([\s\S]*?)<\/p>/ig;
        let match;
        while ((match = pRegex.exec(block)) !== null) {
          const pContent = match[1].trim();
          
          // Parse Program Name
          let programName = '';
          const h5Match = pContent.match(/<h5[^>]*>([\s\S]*?)<\/h5>/i);
          if (h5Match) {
            programName = h5Match[1].replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
          }
          if (!programName) continue; // skip non-program paragraphs (e.g. style tags or other content)
          
          // Parse Referral Phone
          let referralPhone = '';
          const phoneMatch = pContent.match(/Referral Number\s*-\s*([^&<\n]+)/i);
          if (phoneMatch) {
            referralPhone = phoneMatch[1].trim();
          }
          
          // Parse Fax
          let fax = '';
          const faxMatch = pContent.match(/Fax Number\s*-\s*([^&<\n]+)/i);
          if (faxMatch) {
            fax = faxMatch[1].trim();
          }
          
          // Parse Email
          let email = '';
          const emailMatch = pContent.match(/mailto:([^"]+)/i);
          if (emailMatch) {
            email = emailMatch[1].trim();
          }
          
          // Parse Website
          let website = '';
          const webMatch = pContent.match(/href="([^"]+)"[^>]*target="_blank"/i);
          if (webMatch) {
            website = webMatch[1].trim();
          }
          
          // Parse Address
          let address = '';
          const h5EndTag = '</h5>';
          const h5Index = pContent.indexOf(h5EndTag);
          const referralIndex = pContent.indexOf('<strong>Referral Number');
          if (h5Index !== -1 && referralIndex !== -1) {
            const addressBlock = pContent.substring(h5Index + h5EndTag.length, referralIndex);
            const addressLines = addressBlock
              .split('<br />')
              .map(line => line.replace(/<[^>]*>/g, '').trim())
              .filter(line => line.length > 0 && !line.includes('Little Lives ECI')); // clean sub-names
            
            address = addressLines.join(', ');
          }
          
          allCountyMappings.push({
            countyId,
            countyName: countyNameRaw,
            programName,
            address,
            referralPhone,
            fax,
            email,
            website
          });
        }
      }
    } catch (err) {
      console.error(`  ❌ Error fetching letter ${letter}:`, err.message);
    }
  }

  console.log(`✓ Completed scrape. Extracted ${allCountyMappings.length} county-to-program mappings.`);
  
  // Write raw mapping
  fs.writeFileSync(outputPath, JSON.stringify(allCountyMappings, null, 2));
  console.log(`✓ Saved raw mappings to ${outputPath}`);
  
  // Group by program name to see unique contractors
  const uniqueContractors = {};
  allCountyMappings.forEach(m => {
    const key = m.programName.toLowerCase().trim().replace(/[^a-z0-9]/g, '-');
    if (!uniqueContractors[key]) {
      uniqueContractors[key] = {
        id: `eci-${key}`,
        name: m.programName,
        address: m.address,
        phone: m.referralPhone,
        fax: m.fax,
        email: m.email,
        website: m.website,
        counties: []
      };
    }
    uniqueContractors[key].counties.push(m.countyId);
  });
  
  const uniqueList = Object.values(uniqueContractors);
  console.log(`Found ${uniqueList.length} unique ECI contractors across all 254 counties.`);
  
  // Save unique contractors list
  const uniquePath = path.resolve(__dirname, '../../data/unique_texas_eci_contractors.json');
  fs.writeFileSync(uniquePath, JSON.stringify(uniqueList, null, 2));
  console.log(`✓ Saved unique contractors to ${uniquePath}`);
}

scrapeEci();
