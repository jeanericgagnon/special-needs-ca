import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runnerPath = path.resolve(__dirname, '../src/state-upgrade/run_state_upgrade.js');
const outputDir = path.resolve(__dirname, '../data/state-upgrades/florida/phase_records');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Create a modified copy of the runner that exports the functions
let code = fs.readFileSync(runnerPath, 'utf8');

// Remove the main call at the bottom
code = code.replace(/main\(\)\.catch[\s\S]*$/, '');

// Append exports
code += `
export {
  getDcfAccessRecords,
  getEarlyStepsRecords,
  getFdlrsEseRecords,
  getApdRecords,
  getEseDistrictReplacementRecords
};
`;

const tempPath = path.resolve(__dirname, 'temp_run.js');
fs.writeFileSync(tempPath, code, 'utf8');

async function run() {
  const mod = await import('./temp_run.js');

  const apd = mod.getApdRecords();
  const dcf = mod.getDcfAccessRecords();
  const earlySteps = mod.getEarlyStepsRecords();
  const fdlrsEse = mod.getFdlrsEseRecords();
  const eseReplacement = mod.getEseDistrictReplacementRecords();

  // Write functions data
  // DD/IDD program: fl-ibudget, waitlist, offices
  const ddIddRecords = apd.filter(r => 
    r.target_production_table === 'programs' || 
    r.target_production_table === 'program_waitlists' || 
    (r.target_production_table === 'state_resource_agencies' && r.agency_type === 'apd_office')
  );
  fs.writeFileSync(path.join(outputDir, 'dd_idd.json'), JSON.stringify(ddIddRecords, null, 2));

  // Early steps
  fs.writeFileSync(path.join(outputDir, 'early_intervention.json'), JSON.stringify(earlySteps, null, 2));

  // DCF ACCESS storefronts / hubs (benefits)
  fs.writeFileSync(path.join(outputDir, 'benefits_hhs.json'), JSON.stringify(dcf, null, 2));

  // FDLRS & verified districts (education)
  // Let's filter out fallback placeholders
  const eduRecords = fdlrsEse.filter(r => r.record_type !== 'ese_district_fallback_placeholder');
  fs.writeFileSync(path.join(outputDir, 'education_regional.json'), JSON.stringify(eduRecords, null, 2));

  // ESE district replacements
  fs.writeFileSync(path.join(outputDir, 'district_replacements.json'), JSON.stringify(eseReplacement, null, 2));

  // 2. Extract clinics, forms, and nonprofits from the code string
  const originalCode = fs.readFileSync(runnerPath, 'utf8');

  // Helper to extract array by starting marker and closing brace
  function extractArray(marker, startBracket = '[') {
    const startIndex = originalCode.indexOf(marker);
    if (startIndex === -1) {
      console.error('Could not find marker:', marker);
      return null;
    }
    const arrayStart = originalCode.indexOf(startBracket, startIndex);
    let bracketCount = 1;
    let index = arrayStart + 1;
    while (bracketCount > 0 && index < originalCode.length) {
      if (originalCode[index] === '[') bracketCount++;
      else if (originalCode[index] === ']') bracketCount--;
      index++;
    }
    const arrayStr = originalCode.slice(arrayStart, index);
    // Evaluate it safely using a Function wrapper
    return new Function(`return ${arrayStr};`)();
  }

  const clinics = extractArray('const clinics = [');
  fs.writeFileSync(path.join(outputDir, 'clinics.json'), JSON.stringify(clinics, null, 2));

  const forms = extractArray('const forms = [');
  fs.writeFileSync(path.join(outputDir, 'forms_appeals_transition.json'), JSON.stringify(forms, null, 2));

  const nonprofits = extractArray('const supportOrgs = [');
  fs.writeFileSync(path.join(outputDir, 'trusted_nonprofits.json'), JSON.stringify(nonprofits, null, 2));

  console.log('✓ Successfully extracted all Florida data arrays to JSON!');
}

run().catch(err => {
  console.error('Extraction failed:', err);
}).finally(() => {
  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
});
