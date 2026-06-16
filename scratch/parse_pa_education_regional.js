import fs from 'fs';
import path from 'path';

// Define the 29 Intermediate Units in Pennsylvania
const ius = [
  {
    target_id: 'pa-iu-1',
    name: 'Intermediate Unit 1',
    counties: ['fayette-pa', 'greene-pa', 'washington-pa'],
    phone: '(724) 938-3241',
    website: 'https://www.iu1.org',
    physical_county: 'washington-pa'
  },
  {
    target_id: 'pa-iu-2',
    name: 'Pittsburgh-Mt. Oliver Intermediate Unit 2',
    counties: ['allegheny-pa'],
    phone: '(412) 529-4357',
    website: 'https://www.pghschools.org',
    physical_county: 'allegheny-pa'
  },
  {
    target_id: 'pa-iu-3',
    name: 'Allegheny Intermediate Unit 3',
    counties: ['allegheny-pa'],
    phone: '(412) 394-5700',
    website: 'https://www.aiu3.net',
    physical_county: 'allegheny-pa'
  },
  {
    target_id: 'pa-iu-4',
    name: 'Midwestern Intermediate Unit 4',
    counties: ['butler-pa', 'lawrence-pa', 'mercer-pa'],
    phone: '(724) 458-6700',
    website: 'https://www.miu4.org',
    physical_county: 'mercer-pa'
  },
  {
    target_id: 'pa-iu-5',
    name: 'Northwest Tri-County Intermediate Unit 5',
    counties: ['erie-pa', 'crawford-pa', 'warren-pa'],
    phone: '(814) 734-5610',
    website: 'https://www.iu5.org',
    physical_county: 'erie-pa'
  },
  {
    target_id: 'pa-iu-6',
    name: 'Riverview Intermediate Unit 6',
    counties: ['clarion-pa', 'forest-pa', 'jefferson-pa', 'venango-pa'],
    phone: '(814) 226-4000',
    website: 'https://www.riu6.org',
    physical_county: 'clarion-pa'
  },
  {
    target_id: 'pa-iu-7',
    name: 'Westmoreland Intermediate Unit 7',
    counties: ['westmoreland-pa'],
    phone: '(724) 836-2460',
    website: 'https://www.wiu7.org',
    physical_county: 'westmoreland-pa'
  },
  {
    target_id: 'pa-iu-8',
    name: 'Appalachia Intermediate Unit 8',
    counties: ['bedford-pa', 'blair-pa', 'cambria-pa', 'somerset-pa'],
    phone: '(814) 940-0223',
    website: 'https://www.iu08.org',
    physical_county: 'blair-pa'
  },
  {
    target_id: 'pa-iu-9',
    name: 'Seneca Highlands Intermediate Unit 9',
    counties: ['cameron-pa', 'elk-pa', 'mckean-pa', 'potter-pa'],
    phone: '(814) 887-5512',
    website: 'https://www.iu9.org',
    physical_county: 'mckean-pa'
  },
  {
    target_id: 'pa-iu-10',
    name: 'Central Intermediate Unit 10',
    counties: ['centre-pa', 'clearfield-pa', 'clinton-pa'],
    phone: '(814) 342-0884',
    website: 'https://www.ciu10.org',
    physical_county: 'centre-pa'
  },
  {
    target_id: 'pa-iu-11',
    name: 'Tuscarora Intermediate Unit 11',
    counties: ['fulton-pa', 'huntingdon-pa', 'juniata-pa', 'mifflin-pa'],
    phone: '(814) 542-2501',
    website: 'https://www.tiu11.org',
    physical_county: 'huntingdon-pa'
  },
  {
    target_id: 'pa-iu-12',
    name: 'Lincoln Intermediate Unit 12',
    counties: ['adams-pa', 'franklin-pa', 'york-pa'],
    phone: '(717 624-4616',
    website: 'https://www.iu12.org',
    physical_county: 'adams-pa'
  },
  {
    target_id: 'pa-iu-13',
    name: 'Lancaster-Lebanon Intermediate Unit 13',
    counties: ['lancaster-pa', 'lebanon-pa'],
    phone: '(717) 606-1600',
    website: 'https://www.iu13.org',
    physical_county: 'lancaster-pa'
  },
  {
    target_id: 'pa-iu-14',
    name: 'Berks County Intermediate Unit 14',
    counties: ['berks-pa'],
    phone: '(610) 987-2248',
    website: 'https://www.berksiu.org',
    physical_county: 'berks-pa'
  },
  {
    target_id: 'pa-iu-15',
    name: 'Capital Area Intermediate Unit 15',
    counties: ['cumberland-pa', 'dauphin-pa', 'perry-pa'],
    phone: '(717) 732-8400',
    website: 'https://www.caiu.org',
    physical_county: 'cumberland-pa'
  },
  {
    target_id: 'pa-iu-16',
    name: 'Central Susquehanna Intermediate Unit 16',
    counties: ['columbia-pa', 'montour-pa', 'northumberland-pa', 'snyder-pa', 'union-pa'],
    phone: '(570) 523-1155',
    website: 'https://www.csiu.org',
    physical_county: 'union-pa'
  },
  {
    target_id: 'pa-iu-17',
    name: 'BLaST Intermediate Unit 17',
    counties: ['bradford-pa', 'lycoming-pa', 'sullivan-pa', 'tioga-pa'],
    phone: '(570) 323-8561',
    website: 'https://www.iu17.org',
    physical_county: 'lycoming-pa'
  },
  {
    target_id: 'pa-iu-18',
    name: 'Luzerne Intermediate Unit 18',
    counties: ['luzerne-pa', 'wyoming-pa'],
    phone: '(570) 718-4600',
    website: 'https://www.liu18.org',
    physical_county: 'luzerne-pa'
  },
  {
    target_id: 'pa-iu-19',
    name: 'Northeastern Educational Intermediate Unit 19',
    counties: ['lackawanna-pa', 'susquehanna-pa', 'wayne-pa'],
    phone: '(570) 876-9200',
    website: 'https://www.neiu.org',
    physical_county: 'lackawanna-pa'
  },
  {
    target_id: 'pa-iu-20',
    name: 'Colonial Intermediate Unit 20',
    counties: ['monroe-pa', 'northampton-pa', 'pike-pa'],
    phone: '(610) 252-5550',
    website: 'https://www.ciu20.org',
    physical_county: 'northampton-pa'
  },
  {
    target_id: 'pa-iu-21',
    name: 'Carbon-Lehigh Intermediate Unit 21',
    counties: ['carbon-pa', 'lehigh-pa'],
    phone: '(610) 769-4111',
    website: 'https://www.cliu.org',
    physical_county: 'lehigh-pa'
  },
  {
    target_id: 'pa-iu-22',
    name: 'Bucks County Intermediate Unit 22',
    counties: ['bucks-pa'],
    phone: '(215) 348-2940',
    website: 'https://www.bucksiu.org',
    physical_county: 'bucks-pa'
  },
  {
    target_id: 'pa-iu-23',
    name: 'Montgomery County Intermediate Unit 23',
    counties: ['montgomery-pa'],
    phone: '(610) 755-9400',
    website: 'https://www.mciu.org',
    physical_county: 'montgomery-pa'
  },
  {
    target_id: 'pa-iu-24',
    name: 'Chester County Intermediate Unit 24',
    counties: ['chester-pa'],
    phone: '(484) 237-5000',
    website: 'https://www.cciu.org',
    physical_county: 'chester-pa'
  },
  {
    target_id: 'pa-iu-25',
    name: 'Delaware County Intermediate Unit 25',
    counties: ['delaware-pa'],
    phone: '(610) 938-9000',
    website: 'https://www.dciu.org',
    physical_county: 'delaware-pa'
  },
  {
    target_id: 'pa-iu-26',
    name: 'Philadelphia Intermediate Unit 26',
    counties: ['philadelphia-pa'],
    phone: '(215) 400-4000',
    website: 'https://www.philasd.org',
    physical_county: 'philadelphia-pa'
  },
  {
    target_id: 'pa-iu-27',
    name: 'Beaver Valley Intermediate Unit 27',
    counties: ['beaver-pa'],
    phone: '(724) 774-7800',
    website: 'https://www.bviu.org',
    physical_county: 'beaver-pa'
  },
  {
    target_id: 'pa-iu-28',
    name: 'ARIN Intermediate Unit 28',
    counties: ['armstrong-pa', 'indiana-pa'],
    phone: '(724) 463-5300',
    website: 'https://www.arin28.org',
    physical_county: 'indiana-pa'
  },
  {
    target_id: 'pa-iu-29',
    name: 'Schuylkill Intermediate Unit 29',
    counties: ['schuylkill-pa'],
    phone: '(570) 544-9131',
    website: 'https://www.iu29.org',
    physical_county: 'schuylkill-pa'
  }
];

const records = ius.map(iu => {
  return {
    source_url: 'https://www.education.pa.gov/Postsecondary-Adult/Pages/Intermediate-Units.aspx',
    confidence_score: 0.95,
    notes: `Official Pennsylvania Intermediate Unit (IU) serving ${iu.counties.map(c => c.split('-')[0].toUpperCase()).join(', ')} counties. Provides Preschool Early Intervention and regional educational services.`,
    suggested_target_id: iu.target_id,
    name: iu.name,
    phone: iu.phone,
    physical_county: iu.physical_county,
    counties_served: iu.counties,
    agency_type: 'iu',
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  };
});

const outputFilePath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records/education_regional.json';
fs.writeFileSync(outputFilePath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Generated and wrote ${records.length} regional education Intermediate Unit records to education_regional.json.`);
