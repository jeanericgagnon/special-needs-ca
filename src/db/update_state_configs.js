import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const stateConfigsPath = path.resolve(__dirname, '../../frontend/src/lib/stateConfigs.ts');
const mapPath = path.resolve(__dirname, '../../data/state_programs_map.json');
const usCountiesPath = path.resolve(__dirname, '../../data/us_counties.json');
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const stateConfigsContent = fs.readFileSync(stateConfigsPath, 'utf8');
const stateProgramsMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const usCounties = JSON.parse(fs.readFileSync(usCountiesPath, 'utf8'));

// Group by state from JSON
const statesMap = {};
Object.entries(usCounties).forEach(([key, countyData]) => {
  const state = countyData.state;
  if (!statesMap[state]) {
    statesMap[state] = [];
  }
  statesMap[state].push({
    id: key,
    name: countyData.name,
    population: countyData.population || 0
  });
});

const stateNamesToId = {
  'Alabama': 'alabama', 'Alaska': 'alaska', 'Arizona': 'arizona', 'Arkansas': 'arkansas',
  'California': 'california', 'Colorado': 'colorado', 'Connecticut': 'connecticut',
  'Delaware': 'delaware', 'Florida': 'florida', 'Georgia': 'georgia', 'Hawaii': 'hawaii',
  'Idaho': 'idaho', 'Illinois': 'illinois', 'Indiana': 'indiana', 'Iowa': 'iowa',
  'Kansas': 'kansas', 'Kentucky': 'kentucky', 'Louisiana': 'louisiana', 'Maine': 'maine',
  'Maryland': 'maryland', 'Massachusetts': 'massachusetts', 'Michigan': 'michigan',
  'Minnesota': 'minnesota', 'Mississippi': 'mississippi', 'Missouri': 'missouri',
  'Montana': 'montana', 'Nebraska': 'nebraska', 'Nevada': 'nevada', 'New Hampshire': 'new-hampshire',
  'New Jersey': 'new-jersey', 'New Mexico': 'new-mexico', 'New York': 'new-york',
  'North Carolina': 'north-carolina', 'North Dakota': 'north-dakota', 'Ohio': 'ohio',
  'Oklahoma': 'oklahoma', 'Oregon': 'oregon', 'Pennsylvania': 'pennsylvania',
  'Rhode Island': 'rhode-island', 'South Carolina': 'south-carolina', 'South Dakota': 'south-dakota',
  'Tennessee': 'tennessee', 'Texas': 'texas', 'Utah': 'utah', 'Vermont': 'vermont',
  'Virginia': 'virginia', 'Washington': 'washington', 'West Virginia': 'west-virginia',
  'Wisconsin': 'wisconsin', 'Wyoming': 'wyoming'
};

const stateIdToCode = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
  'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH',
  'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC',
  'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA',
  'rhode-island': 'RI', 'south-carolina': 'SC', 'south-dakota': 'SD', 'tennessee': 'TN',
  'texas': 'TX', 'utah': 'UT', 'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA',
  'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

const pilotStates = ['california', 'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia'];
const remainingStates = Object.keys(stateIdToCode).filter(s => !pilotStates.includes(s));

// Load actual counties from DB
const db = new Database(dbPath, { readonly: true });
const dbCounties = db.prepare("SELECT * FROM counties").all();
const countiesByState = {};
dbCounties.forEach(c => {
  if (!countiesByState[c.state_id]) {
    countiesByState[c.state_id] = [];
  }
  countiesByState[c.state_id].push(c);
});
db.close();

// Match priority counties to DB IDs
const priorityCounties = {};
remainingStates.forEach(stateId => {
  if (stateId === 'south-carolina') {
    priorityCounties[stateId] = ['greenville-sc', 'richland-sc'];
    return;
  }
  const stateName = Object.keys(stateNamesToId).find(k => stateNamesToId[k] === stateId);
  const list = statesMap[stateName] || [];
  list.sort((a, b) => b.population - a.population);
  
  const stateCounties = countiesByState[stateId] || [];
  const top2Names = list.slice(0, 2).map(c => c.name.replace(/ County$/i, '').toLowerCase());
  
  const top2Ids = [];
  for (const name of top2Names) {
    const found = stateCounties.find(c => {
      const dbName = c.name.replace(/ County$/i, '').replace(/ Borough$/i, '').replace(/ Parish$/i, '').toLowerCase();
      const normName = name.replace(/ Borough$/i, '').replace(/ Parish$/i, '');
      return dbName.includes(normName) || normName.includes(dbName);
    });
    if (found) {
      top2Ids.push(found.id);
    }
  }
  priorityCounties[stateId] = top2Ids;
});

// Locate the dynamic config function signature index
const funcIdx = stateConfigsContent.indexOf('export function getDynamicStateConfig');
if (funcIdx === -1) {
  console.error("❌ Could not find getDynamicStateConfig function signature!");
  process.exit(1);
}

// Find the index of California's block starting point to know where we rewrite from
const californiaIdx = stateConfigsContent.indexOf("'california': {");
if (californiaIdx === -1) {
  console.error("❌ Could not find California config start!");
  process.exit(1);
}

const beforeInsertion = stateConfigsContent.substring(0, californiaIdx);

// We want to keep California + 7 pilot states EXACTLY as they are in the original file
// Let's locate the Georgia block ending index
const georgiaEndIdx = stateConfigsContent.indexOf("priorityMetroCounties: [\n      'fulton-ga', 'gwinnett-ga', 'cobb-ga', 'dekalb-ga', 'clayton-ga',\n      'cherokee-ga', 'forsyth-ga', 'chatham-ga', 'richmond-ga', 'muscogee-ga', 'clarke-ga'\n    ],\n    faqs: []\n  }");

if (georgiaEndIdx === -1) {
  // Let's check if the file was already updated and does not have Georgia at the end.
  // We can just find the end of Georgia block using:
  console.log("Georgia block index check: fallback to parsing original blocks");
}

// Actually, to make it completely safe, let's parse the original 8 states from the current file!
// The 8 states are 'california', 'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia'
const originalBlocks = [];
for (const s of pilotStates) {
  const blockStart = stateConfigsContent.indexOf(`'${s}': {`);
  if (blockStart === -1) continue;
  
  // Find where the next state starts or the getDynamicStateConfig function starts
  const nextStates = pilotStates.slice(pilotStates.indexOf(s) + 1);
  let blockEnd = -1;
  for (const ns of nextStates) {
    blockEnd = stateConfigsContent.indexOf(`'${ns}': {`, blockStart);
    if (blockEnd !== -1) break;
  }
  if (blockEnd === -1) {
    // Check if there is any other state config block start in the file
    const allOtherStates = Object.keys(stateIdToCode).filter(x => x !== s);
    let earliestStateStart = -1;
    for (const os of allOtherStates) {
      const idx = stateConfigsContent.indexOf(`'${os}': {`, blockStart);
      if (idx !== -1 && (earliestStateStart === -1 || idx < earliestStateStart)) {
        earliestStateStart = idx;
      }
    }
    if (earliestStateStart !== -1) {
      blockEnd = earliestStateStart;
    } else {
      blockEnd = stateConfigsContent.indexOf(`export function getDynamicStateConfig`, blockStart);
    }
  }
  
  // Backtrack from blockEnd to find the closing bracket + comma
  const lastBrace = stateConfigsContent.lastIndexOf('}', blockEnd);
  const blockText = stateConfigsContent.substring(blockStart, lastBrace + 1);
  originalBlocks.push(blockText);
}

// Construct the new stateConfigs object content
let configsText = originalBlocks.join(',\n  ');

remainingStates.forEach(stateId => {
  const code = stateIdToCode[stateId];
  const codeLower = code.toLowerCase();
  const stateName = Object.keys(stateNamesToId).find(k => stateNamesToId[k] === stateId);
  const mapData = stateProgramsMap[code] || {};
  
  const devServicesName = mapData.developmental_services?.name || `${stateName} Developmental Services`;
  const personalCareName = mapData.personal_care?.name || `${stateName} Personal Care`;
  const hcbsWaiversName = mapData.hcbs_waivers?.name || `${stateName} HCBS Waivers`;
  const pCounties = priorityCounties[stateId] || [];

  configsText += `,\n  '${stateId}': {
    name: '${stateName}',
    code: '${code}',
    catchmentName: 'Developmental Disability Agency',
    catchmentDesc: 'Local agency managing intake and services for ${devServicesName}.',
    waiverProgram: '${hcbsWaiversName}',
    personalCareProgram: '${personalCareName}',
    medicaidName: '${stateName} Medicaid',
    educationAgencyLabel: 'Regional Special Education Agencies',
    earlyInterventionLabel: '${stateName} Early Intervention',
    legalDisclaimer: 'This guide provides resource routing for ${stateName} disability benefits. Standard federal IDEA guidelines apply to special education timelines.',
    timelineDaysPlan: '15 calendar days',
    timelineDaysMeeting: '60 calendar days',
    timelinesCode: 'Federal IDEA Guidelines',
    localAgencyType: 'Developmental Disability Agency',
    stateMedicaidAgency: '${stateName} Medicaid Agency',
    ddAgency: '${devServicesName}',
    educationAgency: '${stateName} Department of Education',
    specialEducationSupport: 'Special Education Services',
    earlyIntervention: '${stateName} Early Intervention',
    ableProgram: '${stateName} ABLE',
    parentTrainingResources: [],
    corePrograms: [
      '${codeLower}-dd-waiver', '${codeLower}-dd-self-direction', '${codeLower}-medicaid', '${codeLower}-personal-care', '${codeLower}-chip',
      '${codeLower}-early-intervention', '${codeLower}-special-education', '${codeLower}-able', '${codeLower}-ssi-child', '${codeLower}-transition-services'
    ],
    requiredForms: [
      '${codeLower}-medicaid-app', '${codeLower}-dd-intake-request', '${codeLower}-dd-eligibility-guide', '${codeLower}-personal-care-app', '${codeLower}-personal-care-agreement',
      '${codeLower}-chip-app', '${codeLower}-ei-referral', '${codeLower}-iep-evaluation-request', '${codeLower}-iep-appeal', '${codeLower}-prior-written-notice',
      '${codeLower}-due-process', '${codeLower}-state-complaint', '${codeLower}-records-request', '${codeLower}-iee-request', '${codeLower}-able-opening',
      '${codeLower}-ssi-checklist', '${codeLower}-transition-app', '${codeLower}-dd-self-direction-guide', '${codeLower}-medicaid-renewal', '${codeLower}-medicaid-fair-hearing'
    ],
    priorityMetroCounties: [
      ${pCounties.map(c => `'${c}'`).join(', ')}
    ],
    faqs: []
  }`;
});

const functionPart = stateConfigsContent.substring(stateConfigsContent.indexOf('export function getDynamicStateConfig'));
const finalOutput = beforeInsertion + configsText + '\n};\n\n' + functionPart;

fs.writeFileSync(stateConfigsPath, finalOutput, 'utf8');
console.log('✓ Successfully updated stateConfigs.ts with verified county matching.');
