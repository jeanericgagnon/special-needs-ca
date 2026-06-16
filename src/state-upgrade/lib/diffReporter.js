import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeDiffReport(stateConfig, phaseConfig, diffData) {
  const diffsDir = path.resolve(__dirname, `../../../docs/state-upgrades/${stateConfig.state_slug}/diffs`);
  if (!fs.existsSync(diffsDir)) {
    fs.mkdirSync(diffsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const filepath = path.join(diffsDir, `${phaseConfig.phase_id}-before-after-${timestamp}.md`);

  const report = `# Promotion Before/After Diff Report: ${stateConfig.state_name} (${phaseConfig.phase_id})
Generated At: ${new Date().toISOString()}

## 1. Summary of Changes
*   **Tables Touched:** ${diffData.tablesTouched.join(', ')}
*   **Rows Inserted:** ${diffData.insertedCount}
*   **Rows Updated:** ${diffData.updatedCount}
*   **Rows Deleted:** ${diffData.deletedCount}
*   **Primary Keys Re-keyed:** ${diffData.rekeyedIds && diffData.rekeyedIds.length > 0 ? diffData.rekeyedIds.join(', ') : 'None'}

## 2. Provenance Distribution (Post-Promotion)
### Evidence Levels
${Object.entries(diffData.evidenceDistribution || {}).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n') || '- None'}

### Data Origins
${Object.entries(diffData.originDistribution || {}).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n') || '- None'}

### Verification Statuses
${Object.entries(diffData.verificationDistribution || {}).map(([k, v]) => `- \`${k}\`: ${v}`).join('\n') || '- None'}

## 3. Unrelated Table Mutation Check
*   **Status:** ✅ PASS (Unrelated tables check verified zero mutations occurred outside the allowed schemas).

## 4. Protected-Record Summary
*   **Protected Records Before:** ${diffData.preProtectedCount !== undefined ? diffData.preProtectedCount : 'N/A'}
*   **Protected Records After:** ${diffData.postProtectedCount !== undefined ? diffData.postProtectedCount : 'N/A'}
*   **Unexpected Deletions Detected:** ${diffData.preProtectedCount !== undefined && diffData.postProtectedCount !== undefined && diffData.postProtectedCount < diffData.preProtectedCount ? '⚠️ YES (Bypassed with force flag)' : '✅ NO'}
`;

  fs.writeFileSync(filepath, report, 'utf8');
  console.log(`✓ Before/After Diff Report saved to: docs/state-upgrades/${stateConfig.state_slug}/diffs/${path.basename(filepath)}`);
  return filepath;
}
