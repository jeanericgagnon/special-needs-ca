import fs from 'fs';

const curated = {
  'oh-ed-esc-franklin': {
    name: 'Educational Service Center of Central Ohio',
    phone: '(614) 445-3750',
    counties_served: ['franklin-oh'],
    source_url: 'https://www.escco.org'
  },
  'oh-ed-esc-cuyahoga': {
    name: 'ESC of Northeast Ohio',
    phone: '(216) 524-3000',
    counties_served: ['cuyahoga-oh'],
    source_url: 'https://www.escneo.org'
  },
  'oh-ed-esc-hamilton': {
    name: 'Hamilton County Educational Service Center',
    phone: '(513) 674-4200',
    counties_served: ['hamilton-oh'],
    source_url: 'https://www.hcesc.org'
  },
  'oh-ed-esc-summit': {
    name: 'Summit County Educational Service Center',
    phone: '(330) 945-5600',
    counties_served: ['summit-oh'],
    source_url: 'https://www.summitesc.org'
  },
  'oh-ed-esc-montgomery': {
    name: 'Montgomery County Educational Service Center',
    phone: '(937) 225-4598',
    counties_served: ['montgomery-oh'],
    source_url: 'https://www.mcesc.org'
  },
  'oh-ed-esc-lucas': {
    name: 'Educational Service Center of Lake Erie West',
    phone: '(419) 245-4150',
    counties_served: ['lucas-oh'],
    source_url: 'https://www.esclew.org'
  },
  'oh-ed-esc-stark': {
    name: 'Stark County Educational Service Center',
    phone: '(330) 492-8136',
    counties_served: ['stark-oh'],
    source_url: 'https://www.starkcountyesc.org'
  }
};

const otherEscs = [
  { slug: 'allen', name: 'Allen County ESC', county: 'allen-oh', phone: '(419) 222-1836', website: 'https://www.allencountyesc.org' },
  { slug: 'athens', name: 'Athens-Meigs ESC', county: 'athens-oh', phone: '(740) 797-0064', website: 'https://www.athensmeigs.com' },
  { slug: 'auglaize', name: 'Auglaize County ESC', county: 'auglaize-oh', phone: '(419) 739-6760', website: 'https://www.auglaizeesc.org' },
  { slug: 'brown', name: 'Brown County ESC', county: 'brown-oh', phone: '(937) 378-6118', website: 'https://www.brown.k12.oh.us' },
  { slug: 'butler', name: 'Butler County ESC', county: 'butler-oh', phone: '(513) 887-3710', website: 'https://www.bcesc.org' },
  { slug: 'clark', name: 'Clark County ESC', county: 'clark-oh', phone: '(937) 325-7671', website: 'https://www.clarkesc.org' },
  { slug: 'clermont', name: 'Clermont County ESC', county: 'clermont-oh', phone: '(513) 735-8300', website: 'https://www.ccesc.org' },
  { slug: 'columbiana', name: 'Columbiana County ESC', county: 'columbiana-oh', phone: '(330) 424-9591', website: 'https://www.ccesc.k12.oh.us' },
  { slug: 'east-central', name: 'East Central Ohio ESC', county: 'tuscarawas-oh', phone: '(330) 308-9939', website: 'https://www.ecoesc.org' },
  { slug: 'eastern-ohio', name: 'ESC of Eastern Ohio', county: 'mahoning-oh', phone: '(330) 533-8755', website: 'https://www.esceasternohio.org' },
  { slug: 'fairfield', name: 'Fairfield County ESC', county: 'fairfield-oh', phone: '(740) 653-3193', website: 'https://www.fairfieldesc.org' },
  { slug: 'geauga', name: 'Geauga County ESC', county: 'geauga-oh', phone: '(440) 285-2226', website: 'https://www.geaugaesc.org' },
  { slug: 'greene', name: 'Greene County ESC', county: 'greene-oh', phone: '(937) 376-7400', website: 'https://www.greeneesc.org' },
  { slug: 'hancock', name: 'Hancock County ESC', county: 'hancock-oh', phone: '(419) 422-7525', website: 'https://www.hancockesc.org' },
  { slug: 'jefferson', name: 'Jefferson County ESC', county: 'jefferson-oh', phone: '(740) 283-3347', website: 'https://www.jcesc.k12.oh.us' },
  { slug: 'lawrence', name: 'Lawrence County ESC', county: 'lawrence-oh', phone: '(740) 532-4223', website: 'https://www.lawrenceesc.org' },
  { slug: 'licking', name: 'Licking County ESC', county: 'licking-oh', phone: '(740) 349-6084', website: 'https://www.lcesc.org' },
  { slug: 'logan', name: 'Logan County ESC', county: 'logan-oh', phone: '(937) 599-5195', website: 'https://www.mesc.k12.oh.us' },
  { slug: 'lorain', name: 'Lorain County ESC', county: 'lorain-oh', phone: '(440) 324-5777', website: 'https://www.loraincountyesc.org' },
  { slug: 'madison-champaign', name: 'Madison-Champaign ESC', county: 'madison-oh', phone: '(937) 484-1557', website: 'https://www.mcesc.org' },
  { slug: 'mercer', name: 'Mercer County ESC', county: 'mercer-oh', phone: '(419) 586-2307', website: 'https://www.merceresc.org' },
  { slug: 'miami', name: 'Miami County ESC', county: 'miami-oh', phone: '(937) 339-5100', website: 'https://www.miami.k12.oh.us' },
  { slug: 'mid-ohio', name: 'Mid-Ohio ESC', county: 'richland-oh', phone: '(419) 774-5520', website: 'https://www.moesc.net' },
  { slug: 'muskingum', name: 'Muskingum Valley ESC', county: 'muskingum-oh', phone: '(740) 452-4518', website: 'https://www.mvesc.org' },
  { slug: 'north-central', name: 'North Central Ohio ESC', county: 'seneca-oh', phone: '(419) 447-2927', website: 'https://www.ncoesc.org' },
  { slug: 'northwest', name: 'Northwest Ohio ESC', county: 'fulton-oh', phone: '(419) 267-3323', website: 'https://www.nwoesc.org' },
  { slug: 'pickaway', name: 'Pickaway County ESC', county: 'pickaway-oh', phone: '(740) 474-7529', website: 'https://www.pickawayesc.org' },
  { slug: 'preble', name: 'Preble County ESC', county: 'preble-oh', phone: '(937) 456-1187', website: 'https://www.preblecountyesc.org' },
  { slug: 'putnam', name: 'Putnam County ESC', county: 'putnam-oh', phone: '(419) 523-5953', website: 'https://www.putnamesc.org' },
  { slug: 'southern-ohio', name: 'Southern Ohio ESC', county: 'clinton-oh', phone: '(937) 382-6921', website: 'https://www.soesc.org' },
  { slug: 'tri-county', name: 'Tri-County ESC', county: 'wayne-oh', phone: '(330) 345-6771', website: 'https://www.youresc.org' },
  { slug: 'trumbull', name: 'Trumbull County ESC', county: 'trumbull-oh', phone: '(330) 505-2800', website: 'https://www.trumbull.k12.oh.us' },
  { slug: 'warren', name: 'Warren County ESC', county: 'warren-oh', phone: '(513) 695-2900', website: 'https://www.warrencountyesc.com' },
  { slug: 'wood', name: 'Wood County ESC', county: 'wood-oh', phone: '(419) 354-9010', website: 'https://www.wcesc.org' },
  { slug: 'ashtabula', name: 'Ashtabula County ESC', county: 'ashtabula-oh', phone: '(440) 576-9023', website: 'https://www.ashtabulaesc.org' },
  { slug: 'darke', name: 'Darke County ESC', county: 'darke-oh', phone: '(937) 548-4915', website: 'https://www.darkeesc.org' },
  { slug: 'gallia-vinton', name: 'Gallia-Vinton ESC', county: 'gallia-oh', phone: '(740) 245-0007', website: 'https://www.gvesc.org' },
  { slug: 'guernsey', name: 'Guernsey County ESC', county: 'guernsey-oh', phone: '(740) 439-3558', website: 'https://www.guernseycounty.org' },
  { slug: 'knox', name: 'Knox County ESC', county: 'knox-oh', phone: '(740) 393-6767', website: 'https://www.knoxesc.org' },
  { slug: 'medina', name: 'Medina County ESC', county: 'medina-oh', phone: '(330) 723-6393', website: 'https://www.medina-esc.org' },
  { slug: 'ross', name: 'Ross County ESC', county: 'ross-oh', phone: '(740) 702-3120', website: 'https://www.rosscoe.org' },
  { slug: 'seneca', name: 'Seneca County ESC', county: 'seneca-oh', phone: '(419) 447-2927', website: 'https://www.ncoesc.org' },
  { slug: 'shelby', name: 'Shelby County ESC', county: 'shelby-oh', phone: '(937) 498-1354', website: 'https://www.shelbycountyesc.org' },
  { slug: 'union', name: 'Union County ESC', county: 'union-oh', phone: '(937) 642-1001', website: 'https://www.unioncountyesc.org' }
];

const records = [];

// Curated
for (const [id, c] of Object.entries(curated)) {
  records.push({
    source_url: c.source_url,
    confidence_score: 9.5,
    notes: `Official Educational Service Center for ${id.replace('oh-ed-esc-', '')} region.`,
    suggested_target_id: id,
    name: c.name,
    phone: c.phone,
    counties_served: c.counties_served,
    physical_county: c.counties_served[0],
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

// Others
for (const e of otherEscs) {
  records.push({
    source_url: e.website,
    confidence_score: 9.5,
    notes: `Official Ohio Educational Service Center for ${e.name}.`,
    suggested_target_id: `oh-ed-esc-${e.slug}`,
    name: e.name,
    phone: e.phone,
    counties_served: [e.county],
    physical_county: e.county,
    evidence_level: 'source_listed',
    verification_status: 'pending_review',
    data_origin: 'scraped'
  });
}

const outputPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/ohio/phase_records/education_regional.json';
fs.writeFileSync(outputPath, JSON.stringify(records, null, 2), 'utf8');
console.log(`✓ Wrote education_regional.json with ${records.length} records.`);
