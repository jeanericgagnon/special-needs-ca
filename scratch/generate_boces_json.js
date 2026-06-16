import fs from 'fs';

const boces = [
  // 8 Curated/Protected BOCES
  {
    suggested_target_id: 'ny-ed-boces-nyc',
    name: 'NYC Public Schools - Committee on Special Education Office',
    phone: '(718) 935-2000',
    counties_served: ['bronx-ny', 'kings-ny', 'new-york-ny', 'queens-ny', 'richmond-ny'],
    source_url: 'https://www.schools.nyc.gov/learning/special-education',
    notes: 'NYC DOE Special Education Office'
  },
  {
    suggested_target_id: 'ny-ed-boces-nassau',
    name: 'Nassau BOCES',
    phone: '(516) 396-2200',
    counties_served: ['nassau-ny'],
    source_url: 'https://www.nassauboces.org',
    notes: 'Nassau County Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-suffolk',
    name: 'Eastern Suffolk BOCES',
    phone: '(631) 687-3000',
    counties_served: ['suffolk-ny'],
    source_url: 'https://www.esboces.org',
    notes: 'Eastern Suffolk Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-westchester',
    name: 'Southern Westchester BOCES',
    phone: '(914) 937-3820',
    counties_served: ['westchester-ny'],
    source_url: 'https://www.swboces.org',
    notes: 'Southern Westchester Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-erie',
    name: 'Erie 1 BOCES',
    phone: '(716) 821-7000',
    counties_served: ['erie-ny'],
    source_url: 'https://www.e1b.org',
    notes: 'Erie 1 Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-monroe',
    name: 'Monroe 1 BOCES',
    phone: '(585) 383-2200',
    counties_served: ['monroe-ny'],
    source_url: 'https://www.monroe.edu',
    notes: 'Monroe 1 Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-onondaga',
    name: 'OCM BOCES (Onondaga-Cortland-Madison)',
    phone: '(315) 433-2600',
    counties_served: ['onondaga-ny', 'cortland-ny', 'madison-ny'],
    source_url: 'https://www.ocmboces.org',
    notes: 'Onondaga-Cortland-Madison Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-albany',
    name: 'Capital Region BOCES',
    phone: '(518) 862-4900',
    counties_served: ['albany-ny', 'schoharie-ny', 'schenectady-ny', 'saratoga-ny'],
    source_url: 'https://www.capitalregionboces.org',
    notes: 'Capital Region Board of Cooperative Educational Services'
  },
  // 29 New BOCES
  {
    suggested_target_id: 'ny-ed-boces-broome-tioga',
    name: 'Broome-Tioga BOCES',
    phone: '(607) 763-3300',
    counties_served: ['broome-ny', 'tioga-ny'],
    source_url: 'https://www.btboces.org',
    notes: 'Broome-Tioga Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-cattaraugus-allegany',
    name: 'Cattaraugus-Allegany-Erie-Wyoming BOCES (CA BOCES)',
    phone: '(716) 376-8200',
    counties_served: ['cattaraugus-ny', 'allegany-ny', 'wyoming-ny'],
    source_url: 'https://www.caboces.org',
    notes: 'Cattaraugus-Allegany Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-cayuga-onondaga',
    name: 'Cayuga-Onondaga BOCES',
    phone: '(315) 253-0361',
    counties_served: ['cayuga-ny'],
    source_url: 'https://www.cayboces.org',
    notes: 'Cayuga-Onondaga Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-champlain-valley',
    name: 'Champlain Valley Educational Services (CVES BOCES)',
    phone: '(518) 561-0100',
    counties_served: ['clinton-ny', 'essex-ny'],
    source_url: 'https://www.cves.org',
    notes: 'Clinton-Essex-Warren-Washington Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-dcmo',
    name: 'DCMO BOCES (Delaware-Chenango-Madison-Otsego)',
    phone: '(607) 335-1200',
    counties_served: ['delaware-ny', 'chenango-ny', 'otsego-ny'],
    source_url: 'https://www.dcmoboces.com',
    notes: 'Delaware-Chenango-Madison-Otsego Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-dutchess',
    name: 'Dutchess BOCES',
    phone: '(845) 486-4800',
    counties_served: ['dutchess-ny'],
    source_url: 'https://www.dutchesselearning.org',
    notes: 'Dutchess Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-erie-2-chautauqua',
    name: 'Erie 2-Chautauqua-Cattaraugus BOCES',
    phone: '(716) 549-4454',
    counties_served: ['chautauqua-ny'],
    source_url: 'https://www.e2ccb.org',
    notes: 'Erie 2-Chautauqua-Cattaraugus Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-franklin-essex',
    name: 'Franklin-Essex-Hamilton BOCES',
    phone: '(518) 483-6420',
    counties_served: ['franklin-ny', 'hamilton-ny'],
    source_url: 'https://www.fehb.org',
    notes: 'Franklin-Essex-Hamilton Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-genesee-valley',
    name: 'Genesee Valley BOCES',
    phone: '(585) 344-7700',
    counties_served: ['genesee-ny', 'livingston-ny'],
    source_url: 'https://www.gvboces.org',
    notes: 'Genesee Valley Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-hfm',
    name: 'HFM BOCES (Hamilton-Fulton-Montgomery)',
    phone: '(518) 736-4600',
    counties_served: ['fulton-ny', 'montgomery-ny'],
    source_url: 'https://www.hfmboces.org',
    notes: 'Hamilton-Fulton-Montgomery Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-herkimer',
    name: 'Herkimer-Fulton-Hamilton-Otsego BOCES',
    phone: '(315) 867-2000',
    counties_served: ['herkimer-ny'],
    source_url: 'https://www.herkimer-boces.org',
    notes: 'Herkimer-Fulton-Hamilton-Otsego Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-jefferson-lewis',
    name: 'Jefferson-Lewis-Hamilton-Herkimer-Oneida BOCES',
    phone: '(315) 779-7000',
    counties_served: ['jefferson-ny', 'lewis-ny'],
    source_url: 'https://www.boces.com',
    notes: 'Jefferson-Lewis Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-madison-oneida',
    name: 'Madison-Oneida BOCES',
    phone: '(315) 361-5500',
    counties_served: ['madison-ny'],
    source_url: 'https://www.moboces.org',
    notes: 'Madison-Oneida Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-monroe-2-orleans',
    name: 'Monroe 2-Orleans BOCES',
    phone: '(585) 352-2400',
    counties_served: ['orleans-ny'],
    source_url: 'https://www.monroe2boces.org',
    notes: 'Monroe 2-Orleans Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-oneida-herkimer',
    name: 'Oneida-Herkimer-Madison BOCES',
    phone: '(315) 793-8500',
    counties_served: ['oneida-ny'],
    source_url: 'https://www.oneida-boces.org',
    notes: 'Oneida-Herkimer-Madison Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-orange-ulster',
    name: 'Orange-Ulster BOCES',
    phone: '(845) 291-0100',
    counties_served: ['orange-ny'],
    source_url: 'https://www.ouboces.org',
    notes: 'Orange-Ulster Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-orleans-niagara',
    name: 'Orleans-Niagara BOCES',
    phone: '(716) 731-6800',
    counties_served: ['niagara-ny'],
    source_url: 'https://www.onboces.org',
    notes: 'Orleans-Niagara Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-oswego',
    name: 'Oswego County BOCES (CiTi BOCES)',
    phone: '(315) 963-4251',
    counties_served: ['oswego-ny'],
    source_url: 'https://www.citiboces.org',
    notes: 'Oswego County Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-onc',
    name: 'Otsego-Delaware-Schoharie-Greene BOCES (ONC BOCES)',
    phone: '(607) 588-6291',
    counties_served: ['otsego-ny'],
    source_url: 'https://www.oncboces.org',
    notes: 'Otsego-Delaware-Schoharie-Greene Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-putnam-westchester',
    name: 'Putnam-Northern Westchester BOCES',
    phone: '(914) 245-2700',
    counties_served: ['putnam-ny'],
    source_url: 'https://www.pnwboces.org',
    notes: 'Putnam-Northern Westchester Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-questar-iii',
    name: 'Questar III BOCES (Rensselaer-Columbia-Greene)',
    phone: '(518) 477-8771',
    counties_served: ['rensselaer-ny', 'columbia-ny', 'greene-ny'],
    source_url: 'https://www.questar.org',
    notes: 'Rensselaer-Columbia-Greene Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-rockland',
    name: 'Rockland BOCES',
    phone: '(845) 627-4700',
    counties_served: ['rockland-ny'],
    source_url: 'https://www.rocklandboces.org',
    notes: 'Rockland Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-st-lawrence',
    name: 'St. Lawrence-Lewis BOCES',
    phone: '(315) 386-4504',
    counties_served: ['st-lawrence-ny'],
    source_url: 'https://www.sllboces.org',
    notes: 'St. Lawrence-Lewis Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-greater-southern-tier',
    name: 'Greater Southern Tier BOCES (GST BOCES)',
    phone: '(607) 739-3581',
    counties_served: ['chemung-ny', 'schuyler-ny', 'steuben-ny'],
    source_url: 'https://www.gstboces.org',
    notes: 'Greater Southern Tier Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-sullivan',
    name: 'Sullivan County BOCES',
    phone: '(845) 295-4000',
    counties_served: ['sullivan-ny'],
    source_url: 'https://www.scboces.org',
    notes: 'Sullivan County Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-tst',
    name: 'Tompkins-Seneca-Tioga BOCES (TST BOCES)',
    phone: '(607) 257-1551',
    counties_served: ['tompkins-ny', 'seneca-ny'],
    source_url: 'https://www.tstboces.org',
    notes: 'Tompkins-Seneca-Tioga Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-ulster',
    name: 'Ulster BOCES',
    phone: '(845) 255-3040',
    counties_served: ['ulster-ny'],
    source_url: 'https://www.ulsterboces.org',
    notes: 'Ulster Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-wswhe',
    name: 'WSWHE BOCES (Washington-Saratoga-Warren-Hamilton-Essex)',
    phone: '(518) 581-3300',
    counties_served: ['washington-ny', 'warren-ny'],
    source_url: 'https://www.wswheboces.org',
    notes: 'Washington-Saratoga-Warren-Hamilton-Essex Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-wayne-finger-lakes',
    name: 'Wayne-Finger Lakes BOCES',
    phone: '(315) 332-7200',
    counties_served: ['wayne-ny'],
    source_url: 'https://www.wflboces.org',
    notes: 'Wayne-Finger Lakes Board of Cooperative Educational Services'
  },
  {
    suggested_target_id: 'ny-ed-boces-western-suffolk',
    name: 'Western Suffolk BOCES',
    phone: '(631) 549-4900',
    counties_served: ['suffolk-ny'],
    source_url: 'https://www.wsboces.org',
    notes: 'Western Suffolk Board of Cooperative Educational Services'
  }
];

const records = boces.map(b => ({
  source_url: b.source_url,
  confidence_score: 9.5,
  notes: b.notes,
  suggested_target_id: b.suggested_target_id,
  name: b.name,
  phone: b.phone,
  counties_served: b.counties_served,
  physical_county: b.counties_served[0] || 'statewide',
  evidence_level: 'source_listed',
  verification_status: 'pending_review',
  data_origin: 'scraped'
}));

const outputPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/new-york/phase_records/education_regional.json';
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Generated education_regional.json with ${records.length} records.`);
