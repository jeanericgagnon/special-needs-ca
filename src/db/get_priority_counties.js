import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const countiesPath = path.resolve(__dirname, '../../data/us_counties.json');

const usCounties = JSON.parse(fs.readFileSync(countiesPath, 'utf8'));

// Group by state
const statesMap = {};

Object.entries(usCounties).forEach(([key, countyData]) => {
  const state = countyData.state;
  if (!statesMap[state]) {
    statesMap[state] = [];
  }
  statesMap[state].push({
    name: countyData.name,
    population: countyData.population || 0,
    key: key
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

const priorityCountiesResult = {};

remainingStates.forEach(stateId => {
  const stateName = Object.keys(stateNamesToId).find(key => stateNamesToId[key] === stateId);
  const code = stateIdToCode[stateId];
  
  if (stateId === 'south-carolina') {
    // SC is missing from us_counties.json
    priorityCountiesResult[stateId] = ['greenville-sc', 'richland-sc'];
    return;
  }
  
  const stateCounties = statesMap[stateName] || [];
  // Sort descending by population
  stateCounties.sort((a, b) => b.population - a.population);
  
  // Take top 2
  const top2 = stateCounties.slice(0, 2).map(c => {
    // slugify: e.g. "Jefferson County" -> "jefferson-al"
    const rawName = c.name.replace(/ County$/i, '').replace(/ Borough$/i, '').replace(/ Parish$/i, '').replace(/\s+/g, '-').toLowerCase();
    return `${rawName}-${code.toLowerCase()}`;
  });
  
  priorityCountiesResult[stateId] = top2;
});

console.log(JSON.stringify(priorityCountiesResult, null, 2));
