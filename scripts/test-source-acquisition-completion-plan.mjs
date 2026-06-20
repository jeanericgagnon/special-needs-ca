import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDate = new Date().toISOString().slice(0, 10);

function runNode(scriptRelativePath) {
  const scriptPath = path.join(repoRoot, scriptRelativePath);
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ABLEFULL_REPO_ROOT: repoRoot,
    },
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Script failed: ${scriptRelativePath}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }

  return JSON.parse(result.stdout.trim());
}

const output = runNode('src/db/generate_source_acquisition_completion_plan.js');
const jsonPath = path.join(repoRoot, 'docs', 'generated', `source-acquisition-completion-plan-${generatedDate}.json`);

assert.ok(fs.existsSync(jsonPath));
assert.equal(output.summary.missingSourceFamilyCount, 0);

const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
assert.equal(payload.summary.missingSourceFamilyCount, 0);
assert.equal(payload.summary.combinedByExecutionLane.source_family_authoring, undefined);
assert.ok((payload.summary.combinedByExecutionLane.ready_target_scrape || 0) > 0);
assert.equal(payload.queueWaves[0].count, 0);
assert.ok(payload.summary.suppressedDeferredKnowledgeRows >= 2);
assert.ok(payload.summary.suppressedDeterministicRejectedUrls >= 1);
assert.ok(payload.summary.suppressedRepeatedFamilyFollowupUrls >= 1);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'programs_benefits' &&
    [
      'https://www.mass.gov/masshealth',
      'https://www.michigan.gov/medicaid',
      'https://www.health.ny.gov/health_care/medicaid/',
      'https://www.ssa.gov/ssi',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'program_waitlists' &&
    [
      'https://dbhdid.ky.gov/',
      'https://myaccess.myflfamilies.com/',
      'https://www.dhcs.ca.gov/services/Pages/HACCP.aspx',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'medicaid_hhs_offices' &&
    [
      'https://www.alamedacounty.ca.gov/ihss',
      'https://www.alpinecounty.ca.gov/ihss',
      'https://www.amadorcounty.ca.gov/ihss',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'dd_routing' &&
    [
      'https://dbhdd.georgia.gov/region-2-field-office',
      'https://dbhdd.georgia.gov/region-3-field-office',
      'https://www.dayonenetwork.org/',
      'https://www.sarc.org/',
      'https://www.serviceassociates.org/',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'education_routing' &&
    [
      'https://education.minnesota.gov/regional',
      'https://education.vermont.gov/regional',
      'https://education.virginia.gov/regional',
      'https://www.fldoe.org/contact-us/districts.stml',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'knowledge_content' &&
    [
      'https://www.ssa.gov/apply/ssi',
      'https://www.ssa.gov/ssi/eligibility',
      'https://www.ssa.gov/disability/disability_starter_kits_child_eng.htm',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'knowledge_content'
    && row.sourceUrl === 'https://sites.ed.gov/idea/regs/b/d/300.111'
  ),
  false,
);
assert.ok(payload.summary.suppressedRepeatedStaleSourceRepairUrls >= 1);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'forms_guides' &&
    [
      'https://www.hhs.texas.gov/sites/default/files/documents/regulations/legal/supported-decision-making-agreement-sample.pdf',
      'https://www.myflfamilies.com/sites/default/files/2022-12/fair-hearing-request-form.pdf',
      'https://www.nysed.gov/career-development-and-studies/adult-career-and-continuing-education-services',
      'https://humanservices.arkansas.gov/wp-content/uploads/DDS.docx',
      'https://www.dhcs.ca.gov/formsandpubs/Pages/default.aspx',
      'https://illinoisable.com/',
      'https://myaccess.myflfamilies.com/',
      'https://odr-pa.org/wp-content/uploads/Mediation-Request-Form.pdf',
      'https://www.liberte-consulting.com/',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'advocates_legal' &&
    [
      'http://www.fldoe.org/core/fileparse.php/7690/urlt/1btoc.pdf',
      'http://specialeducationmap.com/',
      'https://www.jstcoaching.com/adhd-life-coach-directory/tina-bates-baldera',
    ].includes(row.sourceUrl)
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'housing' &&
    row.sourceUrl === 'https://resources.hud.gov/'
  ),
  false,
);
assert.equal(
  payload.combinedReadyRows.some((row) =>
    row.gapFamily === 'programs_benefits' &&
    [
      'https://apd.myflorida.com/cdcplus',
      'https://www.dhcs.ca.gov/services/ccs/Pages/default.aspx',
    ].includes(row.sourceUrl)
  ),
  false,
);

console.log('source acquisition completion plan tests passed');
