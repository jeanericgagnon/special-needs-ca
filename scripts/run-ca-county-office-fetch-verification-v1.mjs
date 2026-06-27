import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultInputDir = path.join(repoRoot, 'data', 'generated', 'ca_county_office_fetch_now_v1');
const defaultOutputDir = defaultInputDir;

function readJsonl(filePath) {
  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonl(filePath, rows) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join('\n') + (rows.length ? '\n' : ''));
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function readFullText(row) {
  if (!row.saved_path || !fs.existsSync(row.saved_path)) return '';
  const raw = fs.readFileSync(row.saved_path, 'utf8');
  return normalizeText(raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' '));
}

function classifyRow(row) {
  const pageIdentity = normalizeText([row.evidence_title, row.evidence_h1].join(' ')).toLowerCase();
  const haystack = normalizeText([
    row.evidence_title,
    row.evidence_h1,
    row.text_sample,
    readFullText(row).slice(0, 15000),
  ].join(' ')).toLowerCase();

  const hasIhss = /\bihss\b|in-home supportive services|in home supportive services/.test(haystack);
  const hasPhone = /\(\d{3}\)\s*\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b/.test(haystack);
  const hasAddress = /\bave\b|\broad\b|\brd\b|\bstreet\b|\bst\b|\bdrive\b|\bdr\b|\bblvd\b|\bmodesto\b|\bnevada city\b/.test(haystack);
  const hasIntakeCue = /\bapply\b|how to apply|call[: ]|contact information|contact us|to apply|information needed to apply/.test(haystack);
  const advisoryOnly = /advisory committee/.test(pageIdentity);

  if (advisoryOnly) {
    return {
      verification_status: 'rejected_non_office_leaf',
      rationale: 'advisory_committee_page_not_county_intake_office_leaf',
    };
  }

  if (hasIhss && hasPhone && hasAddress && hasIntakeCue) {
    return {
      verification_status: 'verified_exact_county_office_leaf',
      rationale: 'ihss_leaf_exposes_program_identity_contact_address_and_apply_signal',
    };
  }

  if (hasIhss && hasPhone && hasAddress) {
    return {
      verification_status: 'needs_manual_review',
      rationale: 'ihss_leaf_has_contact_and_address_but_apply_or_intake_signal_not_visible_in_compact_sample',
    };
  }

  return {
    verification_status: 'rejected_non_office_leaf',
    rationale: 'page_lacks_required_county_ihss_leaf_signals',
  };
}

function main() {
  const inputDir = process.argv.find((arg) => arg.startsWith('--input-dir='))?.split('=')[1] || defaultInputDir;
  const outputDir = process.argv.find((arg) => arg.startsWith('--output-dir='))?.split('=')[1] || defaultOutputDir;
  const resultsPath = path.join(inputDir, 'ca_scrape_results_v1.jsonl');
  if (!fs.existsSync(resultsPath)) {
    throw new Error(`Missing fetch results: ${resultsPath}`);
  }

  const rows = readJsonl(resultsPath).map((row) => ({
    ...row,
    ...classifyRow(row),
  }));

  const summary = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    verifiedCount: rows.filter((row) => row.verification_status === 'verified_exact_county_office_leaf').length,
    needsManualReviewCount: rows.filter((row) => row.verification_status === 'needs_manual_review').length,
    rejectedCount: rows.filter((row) => row.verification_status === 'rejected_non_office_leaf').length,
    byCounty: rows.reduce((accumulator, row) => {
      const county = String(row.entity_id || '').includes('stanislaus') ? 'stanislaus'
        : String(row.entity_id || '').includes('nevada') ? 'nevada'
          : 'unknown';
      accumulator[county] = accumulator[county] || { verified: 0, review: 0, rejected: 0 };
      if (row.verification_status === 'verified_exact_county_office_leaf') accumulator[county].verified += 1;
      else if (row.verification_status === 'needs_manual_review') accumulator[county].review += 1;
      else accumulator[county].rejected += 1;
      return accumulator;
    }, {}),
  };

  writeJsonl(path.join(outputDir, 'ca_county_office_fetch_verification_v1.jsonl'), rows);
  writeJson(path.join(outputDir, 'ca_county_office_fetch_verification_summary_v1.json'), summary);

  console.log(JSON.stringify(summary, null, 2));
}

main();
