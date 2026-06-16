import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const states = ['pennsylvania', 'illinois', 'georgia', 'north-carolina'];
const phases = ['benefits_hhs', 'dd_idd', 'early_intervention', 'forms_appeals_transition'];

const results = [];

console.log("==========================================");
console.log("⚙️ RUNNING WAVE A BATCHING UPGRADE PIPELINE");
console.log("==========================================");

for (const state of states) {
  console.log(`\n------------------------------------------`);
  console.log(`State: ${state.toUpperCase()}`);
  console.log(`------------------------------------------`);
  
  for (const phase of phases) {
    try {
      console.log(`  • [${phase}] Staging...`);
      const stageOut = execSync(`node src/state-upgrade/run_state_upgrade.js --state ${state} --phase ${phase} --mode stage`, { encoding: 'utf8' });
      
      console.log(`  • [${phase}] Promoting...`);
      const promoteOut = execSync(`node src/state-upgrade/run_state_upgrade.js --state ${state} --phase ${phase} --mode promote`, { encoding: 'utf8' });

      // Get count of records
      const recordFilePath = `/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/${state}/phase_records/${phase}.json`;
      const records = JSON.parse(fs.readFileSync(recordFilePath, 'utf8'));

      results.push({
        state,
        phase,
        status: 'SUCCESS',
        count: records.length,
        notes: `Successfully staged and promoted ${records.length} records.`
      });
      console.log(`  ✓ [${phase}] Successfully completed!`);
    } catch (error) {
      console.error(`  ❌ [${phase}] Failed!`, error.message);
      results.push({
        state,
        phase,
        status: 'FAILED',
        count: 0,
        notes: error.message
      });
    }
  }
}

console.log("\n==========================================");
console.log("📊 WAVE A BATCH PROCESS RESULTS SUMMARY");
console.log("==========================================");
console.table(results);

fs.writeFileSync('/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/scratch/wave_a_batch_results.json', JSON.stringify(results, null, 2), 'utf8');
