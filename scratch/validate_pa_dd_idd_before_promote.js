import fs from 'fs';
import path from 'path';
import { detectFakeCoverage } from '../src/state-upgrade/lib/fakeCoverageDetector.js';
import { execSync } from 'child_process';

const stateConfigPath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/state_config.json';
const stateConfig = JSON.parse(fs.readFileSync(stateConfigPath, 'utf8'));

const recordFilePath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records/dd_idd.json';
const records = JSON.parse(fs.readFileSync(recordFilePath, 'utf8'));

console.log("==========================================");
console.log("🔍 RUNNING FAKE COVERAGE DETECTOR ON PA DD/IDD");
console.log("==========================================");

const result = detectFakeCoverage(records, stateConfig, 'dd_idd');

console.log("Result:", result);

if (!result.pass) {
  console.error("❌ Fake Coverage Detector failed! Blocking promotion.");
  process.exit(1);
}

console.log("✓ Fake Coverage Detector PASSED. Proceeding to promotion...");

try {
  const promoteOut = execSync('node src/state-upgrade/run_state_upgrade.js --state pennsylvania --phase dd_idd --mode promote', { encoding: 'utf8' });
  console.log(promoteOut);
  console.log("✓ Promotion completed successfully.");
} catch (error) {
  console.error("❌ Promotion failed:", error.message);
  process.exit(1);
}
