import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const db = new Database(dbPath);

console.log("🌱 Starting state-by-state eligibility rules seeding...");

// 1. Fetch conditions
const conditions = db.prepare(`
  SELECT id, name, regional_center_relevance, iep_relevance, cal_able_relevance, ccs_relevance 
  FROM conditions
`).all();

// 2. Fetch non-California programs
const programs = db.prepare(`
  SELECT id, name, state_id, category 
  FROM programs 
  WHERE state_id != 'california' AND state_id IS NOT NULL
`).all();

console.log(`Found ${conditions.length} conditions and ${programs.length} programs to process.`);

// 3. Clear existing rules for these programs
const deleteStmt = db.prepare(`
  DELETE FROM program_eligibility_rules 
  WHERE program_id IN (SELECT id FROM programs WHERE state_id != 'california' AND state_id IS NOT NULL)
`);
const deletedCount = deleteStmt.run().changes;
console.log(`🧹 Cleared ${deletedCount} existing non-California eligibility rules.`);

// 4. Prepare insert statement
const insertRule = db.prepare(`
  INSERT OR REPLACE INTO program_eligibility_rules 
  (id, program_id, min_age_years, max_age_years, required_condition, required_need, insurance_status, school_status, trigger_reason) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// State map helper for formatting trigger reasons
const stateNameMap = {
  'alabama': 'Alabama', 'alaska': 'Alaska', 'arizona': 'Arizona', 'arkansas': 'Arkansas',
  'colorado': 'Colorado', 'connecticut': 'Connecticut', 'delaware': 'Delaware', 'florida': 'Florida',
  'georgia': 'Georgia', 'hawaii': 'Hawaii', 'idaho': 'Idaho', 'illinois': 'Illinois',
  'indiana': 'Indiana', 'iowa': 'Iowa', 'kansas': 'Kansas', 'kentucky': 'Kentucky',
  'louisiana': 'Louisiana', 'maine': 'Maine', 'maryland': 'Maryland', 'massachusetts': 'Massachusetts',
  'michigan': 'Michigan', 'minnesota': 'Minnesota', 'mississippi': 'Mississippi', 'missouri': 'Missouri',
  'montana': 'Montana', 'nebraska': 'Nebraska', 'nevada': 'Nevada', 'new-hampshire': 'New Hampshire',
  'new-jersey': 'New Jersey', 'new-mexico': 'New Mexico', 'new-york': 'New York', 'north-carolina': 'North Carolina',
  'north-dakota': 'North Dakota', 'ohio': 'Ohio', 'oklahoma': 'Oklahoma', 'oregon': 'Oregon',
  'pennsylvania': 'Pennsylvania', 'rhode-island': 'Rhode Island', 'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota', 'tennessee': 'Tennessee', 'texas': 'Texas', 'utah': 'Utah',
  'vermont': 'Vermont', 'virginia': 'Virginia', 'washington': 'Washington', 'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin', 'wyoming': 'Wyoming'
};

const seedRulesTx = db.transaction(() => {
  let ruleCount = 0;

  for (const prog of programs) {
    const pid = prog.id;
    const pidLower = pid.toLowerCase();
    const name = prog.name;
    const nameLower = name.toLowerCase();
    const stateId = prog.state_id;
    const stateName = stateNameMap[stateId] || stateId.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Classification boolean flags
    const isEi = (
      pidLower.includes('early-intervention') ||
      pidLower.includes('early-start') ||
      pidLower.includes('earlysteps') ||
      pidLower.includes('early_intervention') ||
      pidLower.includes('earlystart') ||
      nameLower.includes('early childhood') ||
      nameLower.includes('early steps') ||
      pidLower.endsWith('-eci') ||
      nameLower.includes('early intervention')
    );

    const isSped = (
      pidLower.includes('special-education') ||
      pidLower.includes('special_education') ||
      pidLower.includes('sped') ||
      pidLower.includes('education-iep') ||
      pidLower.includes('special-education-iep') ||
      nameLower.includes('special education') ||
      pidLower.includes('fldoe-ese') ||
      pidLower.endsWith('-tea-sped') ||
      pidLower.includes('family-empowerment')
    );

    const isAble = (
      pidLower.includes('able') ||
      nameLower.includes('able') ||
      pidLower.includes('stable') ||
      nameLower.includes('stable')
    );

    const isWaiver = (
      pidLower.includes('waiver') ||
      pidLower.includes('hcs') ||
      pidLower.includes('class') ||
      pidLower.includes('ibudget') ||
      pidLower.includes('txhml') ||
      pidLower.includes('pfds') ||
      pidLower.includes('starplus') ||
      pidLower.includes('dbmd') ||
      pidLower.includes('yes') ||
      pidLower.includes('gapp') ||
      pidLower.includes('hcbs') ||
      nameLower.includes('waiver') ||
      nameLower.includes('ibudget')
    );

    const isWagesRespite = (
      pidLower.includes('personal-care') ||
      pidLower.includes('respite') ||
      pidLower.includes('self-direction') ||
      pidLower.includes('wages') ||
      pidLower.includes('ihss') ||
      pidLower.includes('cdpap') ||
      pidLower.includes('cdc-plus') ||
      pidLower.includes('mdcp') ||
      pidLower.includes('hsp') ||
      nameLower.includes('personal care') ||
      nameLower.includes('respite') ||
      nameLower.includes('self-direction') ||
      nameLower.includes('caregiver') ||
      nameLower.includes('home services')
    );

    const isMedicaid = (
      pidLower.includes('medicaid') ||
      nameLower.includes('medicaid') ||
      pidLower.endsWith('-medicaid')
    );

    const isChip = (
      pidLower.includes('chip') ||
      pidLower.includes('kidcare') ||
      pidLower.includes('child-health-plus') ||
      pidLower.includes('all-kids') ||
      pidLower.includes('healthy-start') ||
      pidLower.includes('peachcare') ||
      nameLower.includes('chip') ||
      nameLower.includes('kidcare') ||
      nameLower.includes('child health plus') ||
      nameLower.includes('all kids') ||
      nameLower.includes('healthy start') ||
      nameLower.includes('peachcare')
    );

    const isSsi = (
      pidLower.includes('ssi-child') ||
      nameLower.includes('ssi for children')
    );

    const isTransition = (
      pidLower.includes('transition') ||
      pidLower.includes('vocational') ||
      pidLower.includes('ovr') ||
      pidLower.includes('drs') ||
      pidLower.includes('ood') ||
      pidLower.includes('gvra') ||
      nameLower.includes('transition') ||
      nameLower.includes('vocational')
    );

    const isCcsLike = (
      pidLower.includes('cms-plan') ||
      nameLower.includes("children's medical services")
    );

    // Apply rules based on classification
    if (isEi) {
      // Need-based rules
      insertRule.run(
        `rule-${pid}-speech`,
        pid,
        0.0,
        3.0,
        null,
        'speech-therapy',
        'any',
        'any',
        `Child is under age 3 and has active speech/language or communication needs; Early Intervention speech therapy assessments are recommended in ${stateName}.`
      );
      insertRule.run(
        `rule-${pid}-feeding`,
        pid,
        0.0,
        3.0,
        null,
        'feeding-therapy',
        'any',
        'any',
        `Child is under age 3 and has swallowing or feeding developmental delays; referral for occupational/physical therapy under ${name} is recommended.`
      );
      ruleCount += 2;

      // Condition-based rules
      for (const cond of conditions) {
        if (cond.regional_center_relevance === 1 || cond.ccs_relevance === 1) {
          insertRule.run(
            `rule-${pid}-${cond.id}`,
            pid,
            0.0,
            3.0,
            cond.id,
            null,
            'any',
            'any',
            `Child is under age 3 and has an established high-risk condition (${cond.name}); Early Intervention services under ${name} in ${stateName} are highly recommended.`
          );
          ruleCount++;
        }
      }
    } else if (isSped) {
      insertRule.run(
        `rule-${pid}-iep-eval`,
        pid,
        3.0,
        22.0,
        null,
        'iep-evaluation',
        'any',
        'any',
        `School-aged child exhibits speech, developmental, or academic needs requiring a Special Education IEP evaluation under the IDEA Act in ${stateName}.`
      );
      ruleCount++;

      // Custom condition relevance for Florida's unique FES-UA program
      if (pidLower.includes('family-empowerment')) {
        for (const cond of conditions) {
          if (cond.regional_center_relevance === 1) {
            insertRule.run(
              `rule-${pid}-${cond.id}`,
              pid,
              3.0,
              22.0,
              cond.id,
              null,
              'any',
              'any',
              `Diagnosed with ${cond.name} qualifies the child for the Florida Family Empowerment Scholarship for Students with Unique Abilities (FES-UA) to fund private schooling or therapies.`
            );
            ruleCount++;
          }
        }
      }
    } else if (isAble) {
      for (const cond of conditions) {
        if (cond.cal_able_relevance === 1) {
          insertRule.run(
            `rule-${pid}-${cond.id}`,
            pid,
            0.0,
            120.0,
            cond.id,
            null,
            'any',
            'any',
            `Disability onset of ${cond.name} before age 26 qualifies for a tax-advantaged ${name} savings account.`
          );
          ruleCount++;
        }
      }
    } else if (isWaiver) {
      // Condition-based rules
      for (const cond of conditions) {
        if (cond.regional_center_relevance === 1) {
          insertRule.run(
            `rule-${pid}-${cond.id}`,
            pid,
            0.0,
            120.0,
            cond.id,
            null,
            'any',
            'any',
            `${cond.name} is a qualifying developmental disability category for the ${name} program in ${stateName}.`
          );
          ruleCount++;
        }
      }
      // Need-based rules
      insertRule.run(
        `rule-${pid}-supervision`,
        pid,
        0.0,
        120.0,
        null,
        'protective-supervision',
        'any',
        'any',
        `Child requires safety supervision (wandering, elopement, self-injury) which may qualify for behavioral, habilitative, or personal support hours under ${name}.`
      );
      insertRule.run(
        `rule-${pid}-respite`,
        pid,
        0.0,
        120.0,
        null,
        'respite-care',
        'any',
        'any',
        `Respite hours are available under ${name} to provide relief for family caregivers of children with developmental needs in ${stateName}.`
      );
      ruleCount += 2;
    } else if (isWagesRespite) {
      insertRule.run(
        `rule-${pid}-supervision`,
        pid,
        0.0,
        18.0,
        null,
        'protective-supervision',
        'any',
        'any',
        `Child profile exhibits a critical lack of safety awareness (elopement, pica, self-injury) requiring 24/7 safety supervision; screen for caregiver wages/hours under ${name}.`
      );
      insertRule.run(
        `rule-${pid}-respite`,
        pid,
        0.0,
        18.0,
        null,
        'respite-care',
        'any',
        'any',
        `Respite care hours are available under ${name} to provide relief for family caregivers of children with developmental behaviors in ${stateName}.`
      );
      insertRule.run(
        `rule-${pid}-diapers`,
        pid,
        3.0,
        18.0,
        null,
        'diapers-incontinence-supplies',
        'any',
        'any',
        `Incontinence supplies (diapers/briefs) may be covered after age 3 under ${name} in ${stateName} due to developmental delays.`
      );
      ruleCount += 3;
    } else if (isMedicaid) {
      // General rule
      insertRule.run(
        `rule-${pid}-general`,
        pid,
        0.0,
        19.0,
        null,
        null,
        'any',
        'any',
        `${stateName} Medicaid provides comprehensive healthcare coverage, including EPSDT pediatric screenings, therapies, and medical equipment for eligible children with disabilities.`
      );
      // Diapers
      insertRule.run(
        `rule-${pid}-diapers`,
        pid,
        3.0,
        19.0,
        null,
        'diapers-incontinence-supplies',
        'any',
        'any',
        `Medicaid covers diapers and incontinence supplies starting at age 3 for children with developmental delays in ${stateName}.`
      );
      ruleCount += 2;
    } else if (isChip) {
      insertRule.run(
        `rule-${pid}-general`,
        pid,
        0.0,
        19.0,
        null,
        null,
        'any',
        'any',
        `${stateName} Children's Health Insurance Program (CHIP) provides low-cost health coverage for children in families that earn too much money to qualify for Medicaid.`
      );
      ruleCount++;
    } else if (isSsi) {
      for (const cond of conditions) {
        insertRule.run(
          `rule-${pid}-${cond.id}`,
          pid,
          0.0,
          18.0,
          cond.id,
          null,
          'any',
          'any',
          `Assessments for ${cond.name} check for marked and severe functional limitations under childhood SSI guidelines in ${stateName}.`
        );
        ruleCount++;
      }
    } else if (isTransition) {
      insertRule.run(
        `rule-${pid}-general`,
        pid,
        14.0,
        22.0,
        null,
        null,
        'any',
        'any',
        `Transition services in ${stateName} help young adults with disabilities transition from high school to employment or independent living.`
      );
      ruleCount++;
    } else if (isCcsLike) {
      for (const cond of conditions) {
        if (cond.ccs_relevance === 1) {
          insertRule.run(
            `rule-${pid}-${cond.id}`,
            pid,
            0.0,
            21.0,
            cond.id,
            null,
            'any',
            'any',
            `${cond.name} qualifies the child for specialized pediatric medical and clinical therapy support under ${name} in ${stateName}.`
          );
          ruleCount++;
        }
      }
    } else {
      if (pidLower.includes('childfind') || nameLower.includes('find')) {
        insertRule.run(
          `rule-${pid}-general`,
          pid,
          0.0,
          22.0,
          null,
          null,
          'any',
          'any',
          `Child Find in ${stateName} helps identify, locate, and evaluate children from birth through age 21 who may need special education and related services.`
        );
        ruleCount++;
      } else {
        console.warn(`⚠️ Warning: Program ${pid} | ${name} remains unclassified.`);
      }
    }
  }

  console.log(`🎉 Successfully seeded ${ruleCount} eligibility rules.`);
});

seedRulesTx();
db.close();
console.log("✅ Seeding completed.");
