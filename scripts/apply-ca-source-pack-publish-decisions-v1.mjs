import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    runId: 'ca-v3',
    inputDir: path.join(process.cwd(), 'data', 'generated'),
    runsDir: path.join(process.cwd(), 'data', 'source-acquisition-runs'),
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'run-id' && value) args.runId = value;
    if (flag === 'input-dir' && value) args.inputDir = path.resolve(value);
    if (flag === 'runs-dir' && value) args.runsDir = path.resolve(value);
  }
  return args;
}

function readNdjson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeNdjson(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

const args = parseArgs(process.argv.slice(2));
const decisions = readNdjson(path.join(args.inputDir, 'ca_publish_decisions_v1.jsonl'));
const decisionMap = new Map(decisions.map((row) => [row.recordId, row.displayStatusDecision]));
const runStagedDir = path.join(args.runsDir, args.runId, 'staged');

let updatedRows = 0;
let publishedRows = 0;

for (const family of fs.readdirSync(runStagedDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)) {
  const promotionPath = path.join(runStagedDir, family, 'promotion-candidates.ndjson');
  if (!fs.existsSync(promotionPath)) continue;
  const rows = readNdjson(promotionPath);
  const updated = rows.map((row) => {
    const decision = decisionMap.get(row.recordId);
    if (!decision) return row;
    updatedRows += 1;
    if (decision === 'published') publishedRows += 1;
    return {
      ...row,
      candidate: {
        ...row.candidate,
        row: {
          ...(row.candidate?.row || {}),
          display_status: decision,
        },
      },
    };
  });
  writeNdjson(promotionPath, updated);
}

console.log(JSON.stringify({
  runId: args.runId,
  updatedRows,
  publishedRows,
}, null, 2));
