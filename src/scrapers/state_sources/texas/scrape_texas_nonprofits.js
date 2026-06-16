import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../../../ca_disability_navigator.db');

const args = process.argv.slice(2);
let stateArg = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--state' && i + 1 < args.length) {
    stateArg = args[i + 1].toLowerCase();
  }
}

if (stateArg !== 'texas') {
  console.error('❌ Error: This script is only for --state texas');
  process.exit(1);
}

console.log('⏳ Connecting to database...');
const db = new Database(dbPath);

console.log('⏳ Cleaning up old staged Texas nonprofits...');
db.prepare("DELETE FROM staging_scraped_nonprofit_organizations WHERE county_id LIKE '%-tx'").run();

// 1. Fetch ESC counties mappings for Partners Resource Network mapping
const escAgencies = db.prepare("SELECT id, counties_served FROM regional_education_agencies WHERE state_id = 'texas'").all();
const escToCounties = {};
escAgencies.forEach(a => {
  escToCounties[a.id] = a.counties_served.split(',').map(c => c.trim());
});

// All 254 Texas counties from the database
const txCounties = db.prepare("SELECT id FROM counties WHERE state_id = 'texas'").all().map(c => c.id);

// 2. Define Regional Legal Aid County Mappings
const loneStarCounties = [
  'anderson', 'angelina', 'austin', 'bell', 'bosque', 'bowie', 'brazoria', 'brazos', 'burleson', 
  'camp', 'cass', 'chambers', 'cherokee', 'colorado', 'coryell', 'delta', 'falls', 'fayette', 
  'fort-bend', 'franklin', 'freestone', 'galveston', 'gregg', 'grimes', 'hamilton', 'hardin', 
  'harris', 'harrison', 'henderson', 'hill', 'hopkins', 'houston', 'jasper', 'jefferson', 
  'lamar', 'lampasas', 'lee', 'leon', 'liberty', 'limestone', 'madison', 'marion', 'matagorda', 
  'mclennan', 'milam', 'montgomery', 'morris', 'nacogdoches', 'navarro', 'newton', 'orange', 
  'panola', 'polk', 'rains', 'red-river', 'robertson', 'rusk', 'sabine', 'san-augustine', 
  'san-jacinto', 'shelby', 'smith', 'titus', 'trinity', 'tyler', 'upshur', 'walker', 'waller', 
  'washington', 'wharton', 'wood'
].map(c => `${c}-tx`);

const lanwtCounties = [
  'andrews', 'archer', 'armstrong', 'bailey', 'baylor', 'borden', 'briscoe', 'brown', 'callahan', 
  'carson', 'castro', 'childress', 'clay', 'cochran', 'coke', 'coleman', 'collin', 'collingsworth', 
  'comanche', 'concho', 'cooke', 'cottle', 'crane', 'crosby', 'dallam', 'dallas', 'dawson', 
  'deaf-smith', 'denton', 'dickens', 'donley', 'eastland', 'ector', 'ellis', 'erath', 'fannin', 
  'fisher', 'floyd', 'foard', 'gaines', 'garza', 'glasscock', 'gray', 'grayson', 'hale', 'hall', 
  'hansford', 'hardeman', 'hartley', 'haskell', 'hemphill', 'hockley', 'hood', 'howard', 'hunt', 
  'hutchinson', 'irion', 'jack', 'johnson', 'jones', 'kaufman', 'kent', 'king', 'knox', 'lamb', 
  'lipscomb', 'loving', 'lubbock', 'lynn', 'martin', 'mcculloch', 'menard', 'midland', 'mills', 
  'mitchell', 'montague', 'moore', 'motley', 'nolan', 'ochiltree', 'oldham', 'palo-pinto', 
  'parker', 'parmer', 'potter', 'randall', 'reagan', 'roberts', 'rockwall', 'runnels', 'san-saba', 
  'schleicher', 'scurry', 'shackelford', 'sherman', 'somervell', 'stephens', 'sterling', 
  'stonewall', 'swisher', 'tarrant', 'taylor', 'terry', 'throckmorton', 'tom-green', 'upton', 
  'ward', 'wheeler', 'wichita', 'wilbarger', 'winkler', 'wise', 'yoakum', 'young'
].map(c => `${c}-tx`);

const trlaCounties = txCounties.filter(c => !loneStarCounties.includes(c) && !lanwtCounties.includes(c));

// 3. Define Trusted Nonprofits & Service Area Lists
const nonprofitDefinitions = [
  // Parent Training Centers (PRN)
  {
    name: 'Partners Resource Network - PATH Project',
    website: 'https://prntexas.org',
    phone: '(409) 898-4684',
    email: 'path@prntexas.org',
    focus: 'any',
    category: 'Parent Support',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: [
      ...escToCounties['esc-region-2'] || [],
      ...escToCounties['esc-region-3'] || [],
      ...escToCounties['esc-region-4'] || [],
      ...escToCounties['esc-region-5'] || [],
      ...escToCounties['esc-region-6'] || []
    ]
  },
  {
    name: 'Partners Resource Network - PEN Project',
    website: 'https://prntexas.org',
    phone: '(409) 898-4684',
    email: 'pen@prntexas.org',
    focus: 'any',
    category: 'Parent Support',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: [
      ...escToCounties['esc-region-9'] || [],
      ...escToCounties['esc-region-12'] || [],
      ...escToCounties['esc-region-14'] || [],
      ...escToCounties['esc-region-15'] || [],
      ...escToCounties['esc-region-16'] || [],
      ...escToCounties['esc-region-17'] || [],
      ...escToCounties['esc-region-18'] || [],
      ...escToCounties['esc-region-19'] || []
    ]
  },
  {
    name: 'Partners Resource Network - TEAM Project',
    website: 'https://prntexas.org',
    phone: '(409) 898-4684',
    email: 'team@prntexas.org',
    focus: 'any',
    category: 'Parent Support',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: [
      ...escToCounties['esc-region-1'] || [],
      ...escToCounties['esc-region-13'] || [],
      ...escToCounties['esc-region-20'] || []
    ]
  },
  {
    name: 'Partners Resource Network - PACT Project',
    website: 'https://prntexas.org',
    phone: '(409) 898-4684',
    email: 'pact@prntexas.org',
    focus: 'any',
    category: 'Parent Support',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: [
      ...escToCounties['esc-region-7'] || [],
      ...escToCounties['esc-region-8'] || [],
      ...escToCounties['esc-region-10'] || [],
      ...escToCounties['esc-region-11'] || []
    ]
  },
  
  // Legal Aid Organizations
  {
    name: 'Lone Star Legal Aid',
    website: 'https://www.lonestarlegal.org',
    phone: '(800) 733-8394',
    email: 'info@lonestarlegal.org',
    focus: 'any',
    category: 'Legal Aid / Disability Rights',
    evidence_level: 'regional_routing_official',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: loneStarCounties
  },
  {
    name: 'Legal Aid of Northwest Texas',
    website: 'https://legalaidtx.org',
    phone: '(888) 529-5277',
    email: 'info@legalaidtx.org',
    focus: 'any',
    category: 'Legal Aid / Disability Rights',
    evidence_level: 'regional_routing_official',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: lanwtCounties
  },
  {
    name: 'Texas RioGrande Legal Aid',
    website: 'https://www.trla.org',
    phone: '(833) 329-8752',
    email: 'info@trla.org',
    focus: 'any',
    category: 'Legal Aid / Disability Rights',
    evidence_level: 'regional_routing_official',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.85,
    counties: trlaCounties
  },

  // Family-to-Family Health Info Center (Statewide Support)
  {
    name: 'Texas Family-to-Family Health Information Center',
    website: 'https://www.txf2f.org',
    phone: '(833) 867-7601',
    email: 'info@txf2f.org',
    focus: 'any',
    category: 'Parent Support',
    evidence_level: 'statewide_routing_official',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: txCounties
  },

  // Local Arc Chapters
  {
    name: 'The Arc of the Capital Area',
    website: 'https://www.arcofthecapitalarea.org',
    phone: '(512) 476-7044',
    email: 'info@arcofthecapitalarea.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['travis-tx', 'bastrop-tx', 'blanco-tx', 'burnet-tx', 'caldwell-tx', 'hays-tx', 'williamson-tx']
  },
  {
    name: 'The Arc of Greater Houston',
    website: 'https://www.aogh.org',
    phone: '(713) 957-1600',
    email: 'info@aogh.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['harris-tx', 'fort-bend-tx', 'brazoria-tx', 'galveston-tx', 'liberty-tx', 'montgomery-tx', 'waller-tx']
  },
  {
    name: 'The Arc of San Antonio',
    website: 'https://www.arcofsa.org',
    phone: '(210) 490-4300',
    email: 'info@arcofsa.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['bexar-tx', 'comal-tx', 'guadalupe-tx', 'kendall-tx', 'medina-tx', 'wilson-tx']
  },
  {
    name: 'The Arc of Northeast Texas',
    website: 'https://www.arcnetx.org',
    phone: '(903) 791-1050',
    email: 'info@arcnetx.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['bowie-tx', 'cass-tx', 'camp-tx', 'morris-tx', 'titus-tx']
  },
  {
    name: 'The Arc of Dallas',
    website: 'https://www.arcdallas.org',
    phone: '(214) 634-9810',
    email: 'info@arcdallas.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['dallas-tx']
  },
  {
    name: 'The Arc of Wichita County',
    website: 'https://www.arcwctx.org',
    phone: '(940) 692-2303',
    email: 'info@arcwctx.org',
    focus: 'intellectual_developmental_disability',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['wichita-tx', 'clay-tx', 'archer-tx']
  },

  // Autism Society Local Chapters
  {
    name: 'Autism Society of El Paso',
    website: 'https://www.autismsocietyep.org',
    phone: '(915) 772-9100',
    email: 'info@autismsocietyep.org',
    focus: 'autism',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['el-paso-tx']
  },

  // Down Syndrome Associations
  {
    name: 'Down Syndrome Association of Central Texas',
    website: 'https://www.dsact.org',
    phone: '(512) 323-0808',
    email: 'info@dsact.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['travis-tx', 'williamson-tx', 'hays-tx', 'bastrop-tx', 'caldwell-tx', 'burnet-tx']
  },
  {
    name: 'Down Syndrome Association of Houston',
    website: 'https://www.dsah.org',
    phone: '(713) 462-4652',
    email: 'info@dsah.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['harris-tx', 'fort-bend-tx', 'brazoria-tx', 'galveston-tx', 'montgomery-tx', 'liberty-tx', 'waller-tx']
  },
  {
    name: 'Down Syndrome Association of South Texas',
    website: 'https://www.dsast.org',
    phone: '(210) 349-4372',
    email: 'info@dsast.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['bexar-tx', 'comal-tx', 'guadalupe-tx', 'kendall-tx', 'atascosa-tx', 'medina-tx', 'wilson-tx']
  },
  {
    name: 'Down Syndrome Coalition for El Paso',
    website: 'https://www.dscep.org',
    phone: '(915) 308-0828',
    email: 'info@dscep.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['el-paso-tx']
  },
  {
    name: 'Down Syndrome Partnership of North Texas',
    website: 'https://www.dspnt.org',
    phone: '(817) 390-2970',
    email: 'info@dspnt.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['tarrant-tx', 'parker-tx', 'johnson-tx', 'hood-tx']
  },
  {
    name: 'Rio Grande Valley Down Syndrome Association',
    website: 'https://www.rgvdsa.org',
    phone: '(956) 314-0821',
    email: 'info@rgvdsa.org',
    focus: 'down_syndrome',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['hidalgo-tx', 'cameron-tx', 'willacy-tx', 'starr-tx']
  },

  // Centers for Independent Living
  {
    name: 'Coastal Bend Center for Independent Living',
    website: 'https://www.cbcil.org',
    phone: '(361) 883-8402',
    email: 'info@cbcil.org',
    focus: 'any',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['nueces-tx', 'san-patricio-tx', 'aransas-tx', 'kleberg-tx', 'jim-wells-tx', 'brooks-tx', 'duval-tx', 'kenedy-tx', 'bee-tx', 'live-oak-tx', 'mcmullen-tx']
  },
  {
    name: 'REACH Resource Center on Independent Living - Dallas',
    website: 'https://www.reachcils.org',
    phone: '(214) 630-4796',
    email: 'reachdallas@reachcils.org',
    focus: 'any',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['dallas-tx', 'collin-tx']
  },
  {
    name: 'REACH Resource Center on Independent Living - Fort Worth',
    website: 'https://www.reachcils.org',
    phone: '(817) 870-9082',
    email: 'reachftw@reachcils.org',
    focus: 'any',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['tarrant-tx']
  },
  {
    name: 'REACH Resource Center on Independent Living - Denton',
    website: 'https://www.reachcils.org',
    phone: '(940) 383-1062',
    email: 'reachdenton@reachcils.org',
    focus: 'any',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['denton-tx']
  },
  {
    name: 'Valley Association for Independent Living',
    website: 'https://www.vailtx.org',
    phone: '(956) 668-8245',
    email: 'info@vailtx.org',
    focus: 'any',
    category: 'Disability Nonprofit',
    evidence_level: 'trusted_nonprofit_listing',
    source_type: 'trusted_nonprofit_directory',
    confidence: 0.80,
    counties: ['hidalgo-tx', 'cameron-tx', 'willacy-tx', 'starr-tx', 'webb-tx', 'zapata-tx', 'jim-hogg-tx']
  }
];

const insertStaged = db.prepare(`
  INSERT INTO staging_scraped_nonprofit_organizations (
    source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
    extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
    extracted_name, extracted_website, extracted_phone, focus_condition, evidence_level
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let stagedCount = 0;
const timestamp = new Date().toISOString();

try {
  db.transaction(() => {
    nonprofitDefinitions.forEach(n => {
      n.counties.forEach(county => {
        // Double-check suffix
        const cId = county.endsWith('-tx') ? county : `${county}-tx`;
        
        // Clean phone number format
        let cleanPhone = n.phone;
        const digits = n.phone.replace(/\D/g, '');
        if (digits.length === 10) {
          cleanPhone = `(${digits.substring(0,3)}) ${digits.substring(3,6)}-${digits.substring(6)}`;
        }
        
        const suggestedId = `tx-np-${n.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${cId}`;
        const rawTextExcerpt = `Name: ${n.name}
Phone: ${cleanPhone}
Website: ${n.website}
Email: ${n.email}
Focus: ${n.focus}
Category: ${n.category}
County: ${cId}`;

        const extractionNotes = `Staged under Category H/I. Organization Type: nonprofit. Service Area: ${n.counties.length} counties. Category: ${n.category}. Email: ${n.email}`;

        insertStaged.run(
          n.website,
          'Texas Trusted Nonprofit Directory',
          n.source_type, // source_type in staging, maps to data_origin in prod
          timestamp,
          'texas',
          cId,
          n.confidence,
          extractionNotes,
          rawTextExcerpt,
          'nonprofit_organizations',
          suggestedId,
          'pending_review',
          n.name,
          n.website,
          cleanPhone,
          n.focus,
          n.evidence_level
        );
        stagedCount++;
      });
    });
  })();
  console.log(`✓ Successfully staged ${stagedCount} county-specific nonprofit records.`);
} catch (err) {
  console.error('❌ Staging transaction failed:', err.message);
  process.exit(1);
} finally {
  db.close();
}
