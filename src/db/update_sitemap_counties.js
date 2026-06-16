import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routePath = path.resolve(__dirname, '../../frontend/src/app/sitemaps/counties.xml/route.ts');
const usCountiesPath = path.resolve(__dirname, '../../data/us_counties.json');
const dbPath = path.resolve(__dirname, '../../ca_disability_navigator.db');

const routeContent = fs.readFileSync(routePath, 'utf8');
const usCounties = JSON.parse(fs.readFileSync(usCountiesPath, 'utf8'));

// Group by state
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
const priorityCountiesList = [];
remainingStates.forEach(stateId => {
  if (stateId === 'south-carolina') {
    priorityCountiesList.push('greenville-sc', 'richland-sc');
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
  top2Ids.forEach(id => priorityCountiesList.push(id));
});

// Find the NON_CA_VERIFIED_COUNTIES array definition in route.ts
const arrayStartMarker = 'const NON_CA_VERIFIED_COUNTIES = [';
const arrayStartIdx = routeContent.indexOf(arrayStartMarker);

if (arrayStartIdx === -1) {
  console.error("❌ Could not find NON_CA_VERIFIED_COUNTIES array in route.ts!");
  process.exit(1);
}

const arrayEndIdx = routeContent.indexOf('];', arrayStartIdx);
if (arrayEndIdx === -1) {
  console.error("❌ Could not find end of NON_CA_VERIFIED_COUNTIES array!");
  process.exit(1);
}

// Parse existing pilot counties in the array (only keep the 8 original pilot states counties to merge cleanly)
// The 7 non-CA pilot states are TX, FL, NY, PA, IL, OH, GA.
// We can just filter them
const existingPilotCounties = [
  'anderson-tx',
  'andrews-tx',
  'angelina-tx',
  'aransas-tx',
  'archer-tx',
  'armstrong-tx',
  'atascosa-tx',
  'austin-tx',
  'bailey-tx',
  'bandera-tx',
  'bastrop-tx',
  'baylor-tx',
  'bee-tx',
  'bell-tx',
  'bexar-tx',
  'blanco-tx',
  'borden-tx',
  'bosque-tx',
  'bowie-tx',
  'brazoria-tx',
  'brewster-tx',
  'briscoe-tx',
  'brooks-tx',
  'brown-tx',
  'burleson-tx',
  'burnet-tx',
  'caldwell-tx',
  'calhoun-tx',
  'callahan-tx',
  'cameron-tx',
  'camp-tx',
  'carson-tx',
  'cass-tx',
  'castro-tx',
  'chambers-tx',
  'cherokee-tx',
  'childress-tx',
  'clay-tx',
  'cochran-tx',
  'coke-tx',
  'coleman-tx',
  'collin-tx',
  'collingsworth-tx',
  'colorado-tx',
  'comal-tx',
  'comanche-tx',
  'concho-tx',
  'cooke-tx',
  'coryell-tx',
  'cottle-tx',
  'crane-tx',
  'crockett-tx',
  'crosby-tx',
  'culberson-tx',
  'dallam-tx',
  'dallas-tx',
  'dawson-tx',
  'deaf-smith-tx',
  'delta-tx',
  'denton-tx',
  'dewitt-tx',
  'dickens-tx',
  'dimmit-tx',
  'donley-tx',
  'duval-tx',
  'eastland-tx',
  'ector-tx',
  'edwards-tx',
  'ellis-tx',
  'el-paso-tx',
  'erath-tx',
  'falls-tx',
  'fannin-tx',
  'fayette-tx',
  'fisher-tx',
  'floyd-tx',
  'foard-tx',
  'fort-bend-tx',
  'franklin-tx',
  'freestone-tx',
  'frio-tx',
  'gaines-tx',
  'galveston-tx',
  'garza-tx',
  'gillespie-tx',
  'glasscock-tx',
  'goliad-tx',
  'gonzales-tx',
  'gray-tx',
  'grayson-tx',
  'gregg-tx',
  'grimes-tx',
  'guadalupe-tx',
  'hale-tx',
  'hall-tx',
  'hamilton-tx',
  'hansford-tx',
  'hardeman-tx',
  'hardin-tx',
  'harris-tx',
  'harrison-tx',
  'hartley-tx',
  'haskell-tx',
  'hays-tx',
  'hemphill-tx',
  'henderson-tx',
  'hidalgo-tx',
  'hill-tx',
  'hockley-tx',
  'hood-tx',
  'hopkins-tx',
  'houston-tx',
  'howard-tx',
  'hudspeth-tx',
  'hunt-tx',
  'hutchinson-tx',
  'irion-tx',
  'jack-tx',
  'jackson-tx',
  'jasper-tx',
  'jeff-davis-tx',
  'jefferson-tx',
  'jim-hogg-tx',
  'jim-wells-tx',
  'johnson-tx',
  'jones-tx',
  'karnes-tx',
  'kaufman-tx',
  'kendall-tx',
  'kenedy-tx',
  'kent-tx',
  'kerr-tx',
  'kimble-tx',
  'king-tx',
  'kinney-tx',
  'kleberg-tx',
  'knox-tx',
  'lamar-tx',
  'lamb-tx',
  'lampasas-tx',
  'la-salle-tx',
  'lee-tx',
  'leon-tx',
  'liberty-tx',
  'limestone-tx',
  'lipscomb-tx',
  'live-oak-tx',
  'llano-tx',
  'loving-tx',
  'lubbock-tx',
  'lynn-tx',
  'mcculloch-tx',
  'mcmullen-tx',
  'madison-tx',
  'marion-tx',
  'martin-tx',
  'mason-tx',
  'matagorda-tx',
  'maverick-tx',
  'medina-tx',
  'menard-tx',
  'midland-tx',
  'milam-tx',
  'mills-tx',
  'mitchell-tx',
  'montague-tx',
  'montgomery-tx',
  'moore-tx',
  'morris-tx',
  'motley-tx',
  'nacogdoches-tx',
  'navarro-tx',
  'newton-tx',
  'nolan-tx',
  'nueces-tx',
  'ochiltree-tx',
  'oldham-tx',
  'orange-tx',
  'palo-pinto-tx',
  'panola-tx',
  'parker-tx',
  'parmer-tx',
  'pecos-tx',
  'polk-tx',
  'potter-tx',
  'presidio-tx',
  'rains-tx',
  'randall-tx',
  'reagan-tx',
  'real-tx',
  'red-river-tx',
  'reeves-tx',
  'refugio-tx',
  'roberts-tx',
  'robertson-tx',
  'rockwall-tx',
  'runnels-tx',
  'rusk-tx',
  'sabine-tx',
  'san-augustine-tx',
  'san-jacinto-tx',
  'san-patricio-tx',
  'san-saba-tx',
  'schleicher-tx',
  'scurry-tx',
  'shackelford-tx',
  'shelby-tx',
  'sherman-tx',
  'smith-tx',
  'somervell-tx',
  'starr-tx',
  'stephens-tx',
  'sterling-tx',
  'stonewall-tx',
  'sutton-tx',
  'swisher-tx',
  'tarrant-tx',
  'taylor-tx',
  'terrell-tx',
  'terry-tx',
  'throckmorton-tx',
  'titus-tx',
  'tom-green-tx',
  'travis-tx',
  'trinity-tx',
  'upshur-tx',
  'upton-tx',
  'uvalde-tx',
  'val-verde-tx',
  'van-zandt-tx',
  'walker-tx',
  'waller-tx',
  'ward-tx',
  'washington-tx',
  'webb-tx',
  'wharton-tx',
  'wheeler-tx',
  'wilbarger-tx',
  'willacy-tx',
  'williamson-tx',
  'wilson-tx',
  'winkler-tx',
  'wise-tx',
  'wood-tx',
  'yoakum-tx',
  'young-tx',
  'zapata-tx',
  'zavala-tx',
  'miami-dade-fl',
  'broward-fl',
  'palm-beach-fl',
  'hillsborough-fl',
  'orange-fl',
  'pinellas-fl',
  'duval-fl',
  'lee-fl',
  'polk-fl',
  'brevard-fl',
  'pasco-fl',
  'seminole-fl',
  'alachua-fl',
  'leon-fl',
  'kings-ny',
  'queens-ny',
  'new-york-ny',
  'bronx-ny',
  'richmond-ny',
  'nassau-ny',
  'suffolk-ny',
  'westchester-ny',
  'erie-ny',
  'monroe-ny',
  'onondaga-ny',
  'albany-ny',
  'philadelphia-pa',
  'allegheny-pa',
  'montgomery-pa',
  'bucks-pa',
  'delaware-pa',
  'chester-pa',
  'lancaster-pa',
  'berks-pa',
  'cook-il',
  'dupage-il',
  'lake-il',
  'will-il',
  'kane-il',
  'mchenry-il',
  'winnebago-il',
  'sangamon-il',
  'st-clair-il',
  'madison-il',
  'franklin-oh',
  'cuyahoga-oh',
  'hamilton-oh',
  'summit-oh',
  'montgomery-oh',
  'lucas-oh',
  'stark-oh',
  'fulton-ga',
  'gwinnett-ga',
  'cobb-ga',
  'dekalb-ga',
  'clayton-ga',
  'cherokee-ga',
  'forsyth-ga',
  'chatham-ga',
  'richmond-ga',
  'muscogee-ga',
  'clarke-ga'
];

const mergedCounties = Array.from(new Set([...existingPilotCounties, ...priorityCountiesList]));

// Format the new array content nicely
const formattedArray = mergedCounties.map(c => `  '${c}'`).join(',\n');
const replacement = `${arrayStartMarker}\n${formattedArray}\n`;

const newRouteContent = routeContent.substring(0, arrayStartIdx) + replacement + routeContent.substring(arrayEndIdx);
fs.writeFileSync(routePath, newRouteContent, 'utf8');
console.log('✓ Successfully updated counties sitemap route with DB-matched priority counties.');
