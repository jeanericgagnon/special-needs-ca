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

// 1. Alter tables to add waitlist duration columns and program type column if missing
const addColumn = (table, col, type) => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(c => c.name);
    if (!columns.includes(col)) {
      db.prepare(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`).run();
      console.log(`  ✓ Added column '${col}' to ${table}`);
    }
  } catch (err) {
    console.error(`  ⚠️ Warning adding ${col} to ${table}:`, err.message);
  }
};

console.log('⏳ Verifying database schema columns...');
addColumn('program_waitlists', 'estimate_source_url', 'TEXT');
addColumn('program_waitlists', 'estimate_source_type', 'TEXT');
addColumn('program_waitlists', 'last_checked_at', 'TEXT');
addColumn('staging_scraped_waitlists', 'estimate_source_url', 'TEXT');
addColumn('staging_scraped_waitlists', 'estimate_source_type', 'TEXT');
addColumn('staging_scraped_waitlists', 'last_checked_at', 'TEXT');
addColumn('programs', 'program_type', 'TEXT');

console.log('⏳ Cleaning up old staged Texas forms, waitlists, and sources...');
db.prepare("DELETE FROM staging_scraped_forms WHERE state_id = 'texas'").run();
db.prepare("DELETE FROM staging_scraped_waitlists WHERE state_id = 'texas'").run();
db.prepare("DELETE FROM staging_scraped_sources WHERE state_id = 'texas'").run();

const timestamp = new Date().toISOString();
const lastCheckedAt = timestamp.split('T')[0];

// Waitlist Ingestion Definitions (Correction 1: Null duration labels)
const waitlists = [
  {
    id: 'wl-tx-hcs',
    program_id: 'tx-hcs',
    name: 'Texas HCS Waiver Interest List',
    duration_label: 'Not officially stated', // Left null/Not officially stated since wait times are not officially published
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'The Home and Community-Based Services (HCS) interest list is a chronological queue. The state HHSC does not officially state wait times, but historical averages are reported by advocacy groups to exceed 15 years.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  },
  {
    id: 'wl-tx-class',
    program_id: 'tx-class',
    name: 'Texas CLASS Waiver Interest List',
    duration_label: 'Not officially stated',
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'Community Living Assistance and Support Services (CLASS) interest list. Wait times are not officially published by HHSC; historical averages are reported by advocacy groups to range between 12-15 years.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  },
  {
    id: 'wl-tx-txhml',
    program_id: 'tx-txhml',
    name: 'Texas Home Living (TxHmL) Waiver Interest List',
    duration_label: 'Not officially stated',
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'TxHmL waiver interest list. Wait times are not officially published by HHSC; historical averages are reported by advocacy groups to range between 8-10 years.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  },
  {
    id: 'wl-tx-mdcp',
    program_id: 'tx-mdcp',
    name: 'Texas Medically Dependent Children Program (MDCP) Interest List',
    duration_label: 'Not officially stated',
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'MDCP interest list. Wait times are not officially published by HHSC; historical averages are reported by advocacy groups to range between 3-5 years.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  },
  {
    id: 'wl-tx-dbmd',
    program_id: 'tx-dbmd',
    name: 'Texas Deaf-Blind with Multiple Disabilities (DBMD) Interest List',
    duration_label: 'Not officially stated',
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'DBMD waiver interest list. Wait times are not officially published by HHSC.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  },
  {
    id: 'wl-tx-yes',
    program_id: 'tx-yes',
    name: 'Texas Youth Empowerment Services (YES) Waiver Interest List',
    duration_label: 'Not officially stated',
    duration_months: -1.0,
    status: 'Active Waiting List',
    description: 'YES waiver interest list. Wait times are not officially published by HHSC.',
    estimate_source_url: 'https://www.hhs.texas.gov/about/records-statistics/interest-list-status',
    estimate_source_type: 'official_state'
  }
];

// Sources Ingestion Definitions (Correction 4: Official only)
const sources = [
  {
    id: 'src-tx-yourtexasbenefits',
    program_id: 'tx-medicaid',
    url: 'https://www.yourtexasbenefits.com',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.yourtexasbenefits.com',
    source_name: 'YourTexasBenefits Portal',
    source_type: 'official_state_portal',
    confidence_score: 0.98,
    notes: 'Official portal for benefits application.'
  },
  {
    id: 'src-tx-medicaid-fair-hearing',
    program_id: 'tx-medicaid',
    url: 'https://www.hhs.texas.gov/services/your-rights/medicaid-chip-fair-hearings',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/your-rights/medicaid-chip-fair-hearings',
    source_name: 'HHSC Fair Hearings Info Page',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'State instructions for Medicaid appeals.'
  },
  {
    id: 'src-tx-star-kids-appeal',
    program_id: 'tx-mdcp',
    url: 'https://www.hhs.texas.gov/services/your-rights/hhs-ombudsman/medicaid-managed-care-help',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/your-rights/hhs-ombudsman/medicaid-managed-care-help',
    source_name: 'HHSC Ombudsman Managed Care',
    source_type: 'official_state_page',
    confidence_score: 0.90,
    notes: 'Managed care benefit cuts and appeal routing.'
  },
  {
    id: 'src-tx-eci-main',
    program_id: 'tx-eci',
    url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services',
    source_name: 'HHSC ECI Services Central Page',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'Primary early intervention program page.'
  },
  {
    id: 'src-tx-eci-referral',
    program_id: 'tx-eci',
    url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-early-childhood-intervention',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/how-make-referral-early-childhood-intervention',
    source_name: 'ECI How to Make a Referral',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'Early intervention referral intake routes.'
  },
  {
    id: 'src-tx-eci-complaints',
    program_id: 'tx-eci',
    url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-dispute-resolution',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/disability/early-childhood-intervention-services/eci-dispute-resolution',
    source_name: 'ECI Dispute Resolution Page',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'ECI legal dispute, complaints, and mediation process.'
  },
  {
    id: 'src-tx-tea-dispute',
    program_id: 'tx-tea-sped',
    url: 'https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution',
    source_name: 'TEA Dispute Resolution Page',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'Special education mediation, state complaints, and hearings.'
  },
  {
    id: 'src-tx-tea-safeguards',
    program_id: 'tx-tea-sped',
    url: 'https://tea.texas.gov/academics/special-student-populations/special-education/parent-and-family-resources/procedural-safeguards',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://tea.texas.gov/academics/special-student-populations/special-education/parent-and-family-resources/procedural-safeguards',
    source_name: 'TEA Procedural Safeguards Parent Rights',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'Required procedural rights guidelines.'
  },
  {
    id: 'src-tx-spedtex',
    program_id: 'tx-tea-sped',
    url: 'https://www.spedtex.org',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.spedtex.org',
    source_name: 'SPEDTex Special Ed Information Center',
    source_type: 'official_state_portal',
    confidence_score: 0.95,
    notes: 'TEA contracted special education information hub.'
  },
  {
    id: 'src-tx-twc-vr-portal',
    program_id: 'tx-twc-vr',
    url: 'https://www.twc.texas.gov/services/vocational-rehabilitation',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.twc.texas.gov/services/vocational-rehabilitation',
    source_name: 'TWC Vocational Rehabilitation Portal',
    source_type: 'official_state_portal',
    confidence_score: 0.95,
    notes: 'Primary VR services information.'
  },
  {
    id: 'src-tx-twc-vr-youth',
    program_id: 'tx-twc-vr',
    url: 'https://www.twc.texas.gov/services/vocational-rehabilitation/youth-students',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.twc.texas.gov/services/vocational-rehabilitation/youth-students',
    source_name: 'TWC VR Youth and Student Services',
    source_type: 'official_state_page',
    confidence_score: 0.95,
    notes: 'VR student transition program resource.'
  },
  {
    id: 'src-tx-guardianship-alternatives',
    program_id: 'tx-twc-vr',
    url: 'https://www.hhs.texas.gov/services/disability/guardianship',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.hhs.texas.gov/services/disability/guardianship',
    source_name: 'HHSC Guardianship Alternatives',
    source_type: 'official_state_page',
    confidence_score: 0.90,
    notes: 'State guide on guardianship and alternatives.'
  },
  {
    id: 'src-tx-able',
    program_id: 'tx-able',
    url: 'https://www.texasable.org',
    type: 'official',
    confidence_rating: 'high',
    source_url: 'https://www.texasable.org',
    source_name: 'Texas ABLE Savings Program',
    source_type: 'official_state_portal',
    confidence_score: 0.95,
    notes: 'Official enrollment portal for Texas ABLE savings accounts.'
  }
];

// Forms Ingestion Definitions (Correction 3: Schema gap validation)
const forms = [
  {
    id: 'form-tx-h1010',
    program_id: 'tx-medicaid',
    slug: 'form-h1010',
    title: 'Texas Works Application for Assistance (Form H1010)',
    official_download_url: 'https://www.hhs.texas.gov/sites/default/files/documents/laws-regulations/forms/H1010/H1010.pdf',
    source_url: 'https://www.hhs.texas.gov/regulations/forms/1000-1999/form-h1010-texas-works-application',
    source_name: 'YourTexasBenefits Paper Application',
    who_uses_it: 'Parents/caregivers applying for Medicaid, CHIP, SNAP, and TANF.',
    who_signs_it: 'Applicant, Spouse, or Authorized Representative.',
    where_to_send_it: 'Mail to Texas Health and Human Services Commission, P.O. Box 149024, Austin, TX 78714 or fax to 877-447-2839.',
    letter_script: null,
    notes: 'Paper application form.'
  },
  {
    id: 'form-tx-tea-due-process',
    program_id: 'tx-tea-sped',
    slug: 'form-due-process-hearing',
    title: 'Texas Special Education Due Process Hearing Request Form',
    official_download_url: 'https://tea.texas.gov/sites/default/files/due-process-hearing-request-form.pdf',
    source_url: 'https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-due-process-hearing-program',
    source_name: 'TEA Due Process Hearing Request Program',
    who_uses_it: 'Parents or school districts requesting a formal due process hearing.',
    who_signs_it: 'Requesting party (Parent, Attorney, or District Rep).',
    where_to_send_it: 'Submit online via TEA SE-Web application, or mail/fax to Texas Education Agency Office of General Counsel.',
    letter_script: null,
    notes: 'Model form for special education hearings.'
  },
  {
    id: 'form-tx-tea-state-complaint',
    program_id: 'tx-tea-sped',
    slug: 'form-model-state-complaint',
    title: 'Texas Special Education Model State Complaint Form',
    official_download_url: 'https://tea.texas.gov/sites/default/files/special-education-model-complaint-form.pdf',
    source_url: 'https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-complaint-process',
    source_name: 'TEA Special Education Complaint Process',
    who_uses_it: 'Individuals or organizations filing compliance complaints with TEA.',
    who_signs_it: 'Complainant.',
    where_to_send_it: 'Mail to Texas Education Agency, Special Education Dispute Resolution Division, 1701 N. Congress Avenue, Austin, TX 78701 or email to SpecialEducation@tea.texas.gov.',
    letter_script: null,
    notes: 'State compliance complaint form.'
  },
  {
    id: 'form-tx-tea-mediation',
    program_id: 'tx-tea-sped',
    slug: 'form-mediation-request',
    title: 'Texas Special Education Mediation Request Form',
    official_download_url: 'https://tea.texas.gov/sites/default/files/request-for-special-education-mediation.pdf',
    source_url: 'https://tea.texas.gov/about-tea/laws-and-rules/special-education-dispute-resolution/special-education-mediation-program',
    source_name: 'TEA Special Education Mediation Program',
    who_uses_it: 'Parents and school districts requesting mediation.',
    who_signs_it: 'Both Parent and District Representative.',
    where_to_send_it: 'Submit to TEA Special Education Dispute Resolution Division via email or fax.',
    letter_script: null,
    notes: 'Mediation agreement request form.'
  },
  {
    id: 'form-tx-supported-decision-making',
    program_id: 'tx-twc-vr',
    slug: 'form-supported-decision-making',
    title: 'Texas Supported Decision-Making Agreement Template',
    official_download_url: 'https://www.hhs.texas.gov/sites/default/files/documents/regulations/legal/supported-decision-making-agreement-sample.pdf',
    source_url: 'https://www.hhs.texas.gov/regulations/legal-information/supported-decision-making',
    source_name: 'HHSC Supported Decision-Making Agreement Page',
    who_uses_it: 'Adults with disabilities and their chosen supporters.',
    who_signs_it: 'Adult with disability, Supporter, and two Witnesses or a Notary Public.',
    where_to_send_it: 'Retained by the adult with disability and presented to doctors, schools, banks, etc.',
    letter_script: null,
    notes: 'Estates Code Chapter 1357 model agreement.'
  }
];

try {
  db.transaction(() => {
    // 1. Stage Waitlists
    const insertWaitlist = db.prepare(`
      INSERT INTO staging_scraped_waitlists (
        source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
        extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
        program_id, name, duration_label, duration_months, status, description,
        estimate_source_url, estimate_source_type, last_checked_at
      ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    waitlists.forEach(w => {
      const excerpt = `Waitlist: ${w.name}\nProgram: ${w.program_id}\nEstimate Source: ${w.estimate_source_url}\nType: ${w.estimate_source_type}`;
      const notes = `staged official waitlist for ${w.program_id}. Estimate Source Type: ${w.estimate_source_type}. Checked on ${lastCheckedAt}.`;
      insertWaitlist.run(
        w.estimate_source_url,
        'Texas HHS Interest List Statistics',
        'official_state_page',
        timestamp,
        'texas',
        0.95,
        notes,
        excerpt,
        'program_waitlists',
        w.id,
        'pending_review',
        w.program_id,
        w.name,
        w.duration_label,
        w.duration_months,
        w.status,
        w.description,
        w.estimate_source_url,
        w.estimate_source_type,
        lastCheckedAt
      );
    });

    // 2. Stage Sources
    const insertSource = db.prepare(`
      INSERT INTO staging_scraped_sources (
        source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
        extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
        program_id, url, type, confidence_rating
      ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    sources.forEach(s => {
      const excerpt = `Source Link: ${s.url}\nProgram: ${s.program_id}\nConfidence Rating: ${s.confidence_rating}`;
      const notes = `staged official source link for ${s.program_id}. URL: ${s.url}.`;
      insertSource.run(
        s.source_url,
        s.source_name,
        s.source_type,
        timestamp,
        'texas',
        s.confidence_score,
        notes,
        excerpt,
        'sources',
        s.id,
        'pending_review',
        s.program_id,
        s.url,
        s.type,
        s.confidence_rating
      );
    });

    // 3. Stage Forms
    const insertForm = db.prepare(`
      INSERT INTO staging_scraped_forms (
        source_url, source_name, source_type, scraped_at, state_id, county_id, confidence_score,
        extraction_notes, raw_text_excerpt, suggested_target_table, suggested_target_id, review_status,
        slug, program, official_download_url, who_uses_it, who_signs_it, where_to_send_it, letter_script
      ) VALUES (?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    forms.forEach(f => {
      const excerpt = `Form: ${f.title}\nSlug: ${f.slug}\nProgram: ${f.program_id}\nDownload: ${f.official_download_url}`;
      const notes = `staged official form for ${f.program_id}. Download: ${f.official_download_url}.`;
      insertForm.run(
        f.source_url,
        f.source_name,
        'official_state_forms_catalog',
        timestamp,
        'texas',
        0.95,
        notes,
        excerpt,
        'forms',
        f.id,
        'pending_review',
        f.slug,
        f.program_id,
        f.official_download_url,
        f.who_uses_it,
        f.who_signs_it,
        f.where_to_send_it,
        f.letter_script
      );
    });

  })();
  console.log(`✓ Staged waitlists (${waitlists.length}), sources (${sources.length}), and forms (${forms.length}) successfully.`);
} catch (err) {
  console.error('❌ Staging failed:', err.message);
  process.exit(1);
} finally {
  db.close();
}
