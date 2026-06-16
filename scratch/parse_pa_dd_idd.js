import fs from 'fs';
import path from 'path';

// Define the 48 unique MH/ID offices and their counties served in Pennsylvania
const offices = [
  {
    target_id: 'pa-dd-york-adams',
    name: 'York/Adams Mental Health/Intellectual and Developmental Disabilities Departments',
    counties: ['york-pa', 'adams-pa'],
    phone: '717-771-9618',
    website: 'https://yorkcountypa.gov/',
    address: '100 West Market Street, Suite 301, York, PA 17401'
  },
  {
    target_id: 'pa-dd-allegheny',
    name: 'Allegheny County Department of Human Services Office of Developmental Supports',
    counties: ['allegheny-pa'],
    phone: '412-253-1399',
    website: 'https://www.alleghenycounty.us/Human-Services/Programs-Services/Disabilities/Intellectual-Disability-Autism.aspx',
    address: 'Executive Commons Building, 110 Roessler Road Suite 300D, Pittsburgh, PA 15220'
  },
  {
    target_id: 'pa-dd-armstrong-indiana',
    name: 'Armstrong-Indiana Behavioral and Developmental Health Program',
    counties: ['armstrong-pa', 'indiana-pa'],
    phone: '724-548-3451',
    website: 'http://www.aibdhp.org/',
    address: '120 South Grant Avenue, Suite 3, Kittanning, PA 16201'
  },
  {
    target_id: 'pa-dd-beaver',
    name: 'Beaver County Behavioral Health-Developmental Disabilities',
    counties: ['beaver-pa'],
    phone: '724-847-6225',
    website: 'http://www.bcbh.org/',
    address: '1040 8TH Avenue, Beaver Falls, PA 15010'
  },
  {
    target_id: 'pa-dd-bedford-somerset',
    name: 'Bedford-Somerset Developmental and Behavioral Health Services',
    counties: ['bedford-pa', 'somerset-pa'],
    phone: '814-443-4891',
    website: 'https://dbhs.co/',
    address: '245 West Race Street, Somerset, PA 15501'
  },
  {
    target_id: 'pa-dd-berks',
    name: 'Berks County Mental Health/Developmental Disabilities',
    counties: ['berks-pa'],
    phone: '610-478-3271',
    website: 'https://www.countyofberks.com/departments/mental-health-developmental-disabilities',
    address: 'Berks County Services Center, 633 Court Street, 8th Floor, Reading, PA 19601'
  },
  {
    target_id: 'pa-dd-blair',
    name: 'Blair County Department of Social Services & Mental Health',
    counties: ['blair-pa'],
    phone: '814-693-3023',
    website: 'https://www.blairco.org/',
    address: '423 Allegheny Street, Suite 441, Hollidaysburg, PA 16648-2022'
  },
  {
    target_id: 'pa-dd-bradford-sullivan',
    name: 'Bradford-Sullivan Office of Mental Health & Intellectual Disabilities',
    counties: ['bradford-pa', 'sullivan-pa'],
    phone: '570-265-1760',
    website: 'https://bradfordcountypa.org/bradfordsullivan-intellectual-disabilities-services/',
    address: '220 Main St., Unit #1, Towanda, PA 18848'
  },
  {
    target_id: 'pa-dd-bucks',
    name: 'Bucks County Department of Behavioral Health/Developmental Programs',
    counties: ['bucks-pa'],
    phone: '215-444-2800',
    website: 'https://pa-buckscounty.civicplus.com/315/Behavioral-Health',
    address: '55 East Court Street, 4th Floor, Doylestown, PA 18901'
  },
  {
    target_id: 'pa-dd-butler',
    name: 'Butler County Developmental Services',
    counties: ['butler-pa'],
    phone: '724-284-5114',
    website: 'https://butlercountypa.gov/400/Developmental-Services',
    address: 'County Government Center, 124 West Diamond Street, First Floor Annex, P.O. Box 1208. Butler, PA 16003-1208'
  },
  {
    target_id: 'pa-dd-cambria',
    name: 'Cambria County Behavioral Health/Intellectual Disabilities/Early Intervention',
    counties: ['cambria-pa'],
    phone: '814-534-2800',
    website: 'https://www.cambriacountypa.gov/behavioral-health/',
    address: 'Central Park Complex, 110 Franklin Street, Suite 300, Johnstown, PA 15901-1831'
  },
  {
    target_id: 'pa-dd-cameron-elk',
    name: 'Cameron-Elk Behavioral & Developmental Programs',
    counties: ['cameron-pa', 'elk-pa'],
    phone: '814-772-8016',
    website: 'http://www.cemhmr.org/',
    address: '2070 Court Street, Ridgeway, PA 15853'
  },
  {
    target_id: 'pa-dd-carbon-monroe-pike',
    name: 'Carbon-Monroe-Pike Mental Health & Developmental Services',
    counties: ['carbon-pa', 'monroe-pa', 'pike-pa'],
    phone: '570-421-2901',
    website: 'https://www.cmpmhds.org/',
    address: '724 Phillips Street and 732 Phillips Street, Stroudsburg, PA 18360-2224'
  },
  {
    target_id: 'pa-dd-centre',
    name: 'Centre County Mental Health/Intellectual Disabilities/Early Intervention',
    counties: ['centre-pa'],
    phone: '814-355-6782',
    website: 'https://www.centrecountypa.gov/329/MHIDEI---Drug-Alcohol',
    address: '3500 East College Avenue, Suite 1200, State College, PA 16801'
  },
  {
    target_id: 'pa-dd-chester',
    name: 'Chester County Mental Health/Intellectual and Developmental Disabilities',
    counties: ['chester-pa'],
    phone: '610-344-6265',
    website: 'https://www.chesco.org/615/Mental-HealthIntellectual-Dev-Disabiliti',
    address: 'Government Services Center, 601 Westtown Road, Suite 340, P.O. Box 2747, West Chester, PA 19380-0991'
  },
  {
    target_id: 'pa-dd-clarion',
    name: 'Clarion County Mental Health/Developmental Disabilities/Early Intervention',
    counties: ['clarion-pa'],
    phone: '814-226-4000',
    website: 'https://www.co.clarion.pa.us/government/departments/human_services__mhddei.php',
    address: '214 South Seventh Avenue, Clarion, PA 16214'
  },
  {
    target_id: 'pa-dd-clearfield-jefferson',
    name: 'Community Connections of Clearfield-Jefferson Counties',
    counties: ['clearfield-pa', 'jefferson-pa'],
    phone: '814-371-5100',
    website: 'http://www.ccc-j.com/',
    address: '375 Beaver Drive, P O Box 268, Dubois, PA 15801'
  },
  {
    target_id: 'pa-dd-lycoming-clinton',
    name: 'Lycoming-Clinton Mental Health and Developmental Disabilities/Autism Services',
    counties: ['lycoming-pa', 'clinton-pa'],
    phone: '570-326-7895',
    website: 'https://lycomingclintonmhida.com/',
    address: 'Sharewell Building, 200 East Street, Williamsport, PA 17701-6613'
  },
  {
    target_id: 'pa-dd-cmsu',
    name: 'Columbia-Montour-Snyder-Union (CMSU) Service System Behavioral Health/Developmental Services',
    counties: ['columbia-pa', 'montour-pa', 'snyder-pa', 'union-pa'],
    phone: '570-275-6080',
    website: 'https://www.cmsu.org/',
    address: '1083 Bloom Rd, Suite 101, Danville, PA 17821'
  },
  {
    target_id: 'pa-dd-crawford',
    name: 'Crawford County Human Services Mental Health/Intellectual Disabilities',
    counties: ['crawford-pa'],
    phone: '814-724-8380',
    website: 'https://www.crawfordcountypa.net/cchs/Pages/home.aspx',
    address: '18282 Technology Drive, Suite 101, Meadville, PA 16335'
  },
  {
    target_id: 'pa-dd-cumberland-perry',
    name: 'Cumberland-Perry Mental Health/Intellectual & Developmental Disabilities',
    counties: ['cumberland-pa', 'perry-pa'],
    phone: '717-240-6325',
    website: 'https://www.cumberlandcountypa.gov/118/Mental-Health-Intellectual-Develop-Dis',
    address: '1615 Ritner Highway, Carlisle, PA 17013'
  },
  {
    target_id: 'pa-dd-dauphin',
    name: 'Dauphin County Mental Health/Autism & Developmental Programs',
    counties: ['dauphin-pa'],
    phone: '717-780-7050',
    website: 'https://www.dauphincounty.gov/government/human-services/mental-health-autism-developmental-programs',
    address: '100 Chestnut Street, 1st Floor, Harrisburg, PA 17101'
  },
  {
    target_id: 'pa-dd-delaware',
    name: 'Delaware County Office of Intellectual and Developmental Disabilities',
    counties: ['delaware-pa'],
    phone: '610-713-2400',
    website: 'https://www.delcohsa.org/oidd.html',
    address: '20 South 69TH Street, 4th Floor, Upper Darby, PA 19082'
  },
  {
    target_id: 'pa-dd-erie',
    name: 'Erie County Office of Mental Health/Intellectual Disabilities',
    counties: ['erie-pa'],
    phone: '814-451-6800',
    website: 'https://eriecountypa.gov/departments/human-services/',
    address: '154 West Ninth Street, Erie, PA 16501'
  },
  {
    target_id: 'pa-dd-fayette',
    name: 'Fayette County Behavioral Health Administration',
    counties: ['fayette-pa'],
    phone: '724-430-1370',
    website: 'https://www.fayettecountypa.org/264/Behavioral-Health',
    address: '215 Jacob Murphy Lane,, Uniontown, PA 15401'
  },
  {
    target_id: 'pa-dd-forest-warren',
    name: 'Forest-Warren Human Services',
    counties: ['forest-pa', 'warren-pa'],
    phone: '814-726-2100',
    website: 'https://wc-hs.org/1178/ForestWarrenHuman-Services',
    address: '285 Hospital Drive, Warren, PA 16365'
  },
  {
    target_id: 'pa-dd-franklin-fulton',
    name: 'Franklin–Fulton Mental Health/Intellectual and Developmental Disabilities Programs',
    counties: ['franklin-pa', 'fulton-pa'],
    phone: '717-264-5387',
    website: 'https://www.franklincountypa.gov/index.php?section=human-services_mental-health',
    address: 'Human Services Building, 425 Franklin Farm Lane, Chambersburg PA 17202'
  },
  {
    target_id: 'pa-dd-greene',
    name: 'Greene County Human Services Department Mental Health and Intellectual/Developmental Disabilities Programs',
    counties: ['greene-pa'],
    phone: '724-852-5276',
    website: 'https://www.co.greene.pa.us/',
    address: 'Ft. Jackson Building, 19 South Washington Street, Third Floor, Waynesburg, PA 15370'
  },
  {
    target_id: 'pa-dd-juniata-valley',
    name: 'Juniata Valley Behavioral and Developmental Services',
    counties: ['huntingdon-pa', 'juniata-pa', 'mifflin-pa'],
    phone: '717-242-6467',
    website: 'http://jvbds.org/',
    address: 'The Greater Lewistown Regional Business Center, 152 East Market Street, Suite 105, Lewistown, PA 17044'
  },
  {
    target_id: 'pa-dd-lackawanna-susquehanna',
    name: 'Lackawanna/Susquehanna Behavioral Health/Intellectual Disabilities/Early Intervention',
    counties: ['lackawanna-pa', 'susquehanna-pa'],
    phone: '570-346-5741',
    website: 'https://www.lackawannacounty.org/government/departments/behavioral_health_intellectual_disability_early_intervention/index.php',
    address: '123 Wyoming Avenue, 4th Floor, Scranton, PA 18503'
  },
  {
    target_id: 'pa-dd-lancaster',
    name: 'Lancaster County Behavioral Health and Developmental Services',
    counties: ['lancaster-pa'],
    phone: '717-299-8021',
    website: 'https://www.lancastercountybhds.org/',
    address: '150 North Queen Street, Lancaster, PA 17603'
  },
  {
    target_id: 'pa-dd-lawrence',
    name: 'Lawrence County Mental Health and Developmental Services',
    counties: ['lawrence-pa'],
    phone: '724-658-2538',
    website: 'https://lawrencecountypa.gov/departments/mhds',
    address: '439 Countyline Street, New Castle, PA 16101'
  },
  {
    target_id: 'pa-dd-lebanon',
    name: 'Lebanon County Mental Health/Intellectual Disability/Early Intervention Programs',
    counties: ['lebanon-pa'],
    phone: '717-274-3415',
    website: 'https://lebanon.pa.networkofcare.org/mh/index.aspx',
    address: '220 East Lehman Street, Lebanon, PA 17046'
  },
  {
    target_id: 'pa-dd-lehigh',
    name: 'Lehigh County Office of Intellectual Disabilities and Mental Health',
    counties: ['lehigh-pa'],
    phone: '610-782-3126',
    website: 'https://www.lehighcounty.org/Departments/Human-Services',
    address: '17 South 7th Street, Allentown, PA 18101-2401'
  },
  {
    target_id: 'pa-dd-luzerne-wyoming',
    name: 'Luzerne–Wyoming Mental Health and Developmental Services',
    counties: ['luzerne-pa', 'wyoming-pa'],
    phone: '570-825-9441',
    website: 'https://www.luzernecounty.org/466/Mental-Health-Developmental-Services',
    address: '111 N Pennsylvania Avenue, Suite 300, Wilkes Barre, PA 18701-3510'
  },
  {
    target_id: 'pa-dd-mckean',
    name: 'McKean County Department of Human Services',
    counties: ['mckean-pa'],
    phone: '814-887-3350',
    website: 'https://www.mckeancountypa.org/departments/human_services/index.php',
    address: '17155 Route 6, Smethport, PA 16749'
  },
  {
    target_id: 'pa-dd-mercer',
    name: 'Mercer County Behavioral Health Commission Inc.',
    counties: ['mercer-pa'],
    phone: '724-662-1550',
    website: 'http://www.mercercountybhc.org/',
    address: '8406 Sharon–Mercer Road, Mercer, PA 16137'
  },
  {
    target_id: 'pa-dd-montgomery',
    name: 'Montgomery County Behavioral Health/Developmental Disabilities Department',
    counties: ['montgomery-pa'],
    phone: '610-278-3642',
    website: 'https://www.montgomerycountypa.gov/3042/Mental-Health-and-Developmental-Disabili',
    address: '1430 Dekalb Street, P.O. Box 311, Norristown, PA 19404-0311'
  },
  {
    target_id: 'pa-dd-northampton',
    name: 'Northampton County Human Services',
    counties: ['northampton-pa'],
    phone: '610-974-7500',
    website: 'https://www.northamptoncounty.org/HS/Pages/default.aspx',
    address: '2801 Emrick Blvd, Bethlehem, PA 18020-8015'
  },
  {
    target_id: 'pa-dd-northumberland',
    name: 'Northumberland County Behavioral Health / Intellectual Developmental Services',
    counties: ['northumberland-pa'],
    phone: '570-495-2039',
    website: 'https://northumberland.pa.networkofcare.org/mh/services/agency.aspx?pid=NorthumberlandCountyBehavioralHealthandIntellectualDevelopmentalServices_2_804_1',
    address: 'Human Services Building, 217 North Center Street, Sunbury, PA 17801'
  },
  {
    target_id: 'pa-dd-philadelphia',
    name: 'City of Philadelphia Department of Behavioral Health and Intellectual disAbility Services',
    counties: ['philadelphia-pa'],
    phone: '215-685-5400',
    website: 'https://dbhids.org/',
    address: '1101 Market Street, Suite 700, Philadelphia, PA 19107'
  },
  {
    target_id: 'pa-dd-potter',
    name: 'Potter County Human Services',
    counties: ['potter-pa'],
    phone: '814-544-7315',
    website: 'https://pottercountyhumansvcs.org/',
    address: 'P.O. Box 241, 62 North Street, Roulette, PA 16746-0241'
  },
  {
    target_id: 'pa-dd-schuylkill',
    name: 'Schuylkill County Mental Health/Developmental Services',
    counties: ['schuylkill-pa'],
    phone: '570-621-2890',
    website: 'https://schuylkillcountypa.gov/departments/human_services/mental_health_development_services.php',
    address: '410 North Centre Street, Suite 2, Pottsville, PA 17901'
  },
  {
    target_id: 'pa-dd-tioga',
    name: 'Tioga County Department of Human Services',
    counties: ['tioga-pa'],
    phone: '570-724-5766',
    website: 'https://www.tiogacountypa.us/',
    address: '1873 Shumway Hill Road, Wellsboro, PA 16901'
  },
  {
    target_id: 'pa-dd-venango',
    name: 'Venango County Mental Health/Developmental Services',
    counties: ['venango-pa'],
    phone: '814-432-9100',
    website: 'https://venango.pa.networkofcare.org/mh/services/agency.aspx?pid=VenangoCountyDepartmentofMentalHealthandDevelopmentalServices_2_815_0',
    address: '1 Dale Avenue, Franklin, PA 16323'
  },
  {
    target_id: 'pa-dd-washington',
    name: 'Washington County Behavioral Health and Developmental Services',
    counties: ['washington-pa'],
    phone: '724-228-6832',
    website: 'https://washingtoncountyhumanservices.com/agencies/behavioral-health-developmental-services',
    address: '95 West Beau Street, Suite 300; Washington, PA 15301'
  },
  {
    target_id: 'pa-dd-wayne',
    name: 'Wayne County Behavioral Health/Developmental Services',
    counties: ['wayne-pa'],
    phone: '570-253-9200',
    website: 'https://waynecountypa.gov/155/Behavioral-and-Developmental-Programs',
    address: '648 Park Street, Honesdale, PA 18431'
  },
  {
    target_id: 'pa-dd-westmoreland',
    name: 'Westmoreland County Behavioral Health & Developmental Services',
    counties: ['westmoreland-pa'],
    phone: '724-830-3617',
    website: 'https://www.co.westmoreland.pa.us/841/Behavioral-Health-Developmental-Services',
    address: '40 N Pennsylvania Avenue, 1st Floor, Suite 110, Greensburg, PA 15601'
  }
];

const records = offices.map(off => {
  const commaSeparatedCounties = off.counties.join(',');
  return {
    source_url: 'https://www.pa.gov/en/agencies/dhs/contact/county-mh-id-offices.html',
    confidence_score: 0.95,
    notes: `Official Mental Health/Intellectual Disabilities (MH/ID) Administrative Entity serving ${off.counties.map(c => c.split('-')[0].toUpperCase()).join(', ')} County.`,
    suggested_target_id: off.target_id,
    name: off.name,
    phone: off.phone,
    physical_county: commaSeparatedCounties,
    counties_served: commaSeparatedCounties,
    service_area_type: off.counties.length > 1 ? 'regional' : 'county',
    agency_type: 'developmental_services_agency',
    evidence_level: 'direct_official_page',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  };
});

const outputFilePath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records/dd_idd.json';
fs.writeFileSync(outputFilePath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Generated and wrote ${records.length} real DD/IDD records with service area types to dd_idd.json.`);
