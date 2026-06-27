import fs from 'node:fs';
import path from 'node:path';
import { isPublicCountyOfficeEligible } from '../frontend/src/lib/publicTruth.ts';

function parseArgs(argv) {
  const args = {
    prefix: 'ca_v4',
    inputDir: path.join(process.cwd(), 'data', 'generated'),
  };
  for (const arg of argv) {
    if (!arg.startsWith('--')) continue;
    const [flag, rawValue = ''] = arg.slice(2).split('=');
    const value = rawValue.trim();
    if (flag === 'prefix' && value) args.prefix = value;
    if (flag === 'input-dir' && value) args.inputDir = path.resolve(value);
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

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function decisionForRow(row) {
  const reasons = [];
  const provenanceFields = ['sourceUrl', 'finalUrl', 'artifactPath', 'sha256', 'fetchedAt', 'authority', 'agency', 'sourceRole'];
  for (const field of provenanceFields) {
    if (!String(row[field] || '').trim()) reasons.push(`missing_${field}`);
  }
  if (row.semanticStatus !== 'stage_ready') reasons.push('semantic_status_not_stage_ready');
  if (Number(row.requiredFieldCompleteness || 0) < 1) reasons.push('required_field_completeness_below_100pct');
  if (Number(row.unsupportedDefaultedFieldCount || 0) > 0) reasons.push('has_unsupported_defaulted_fields');

  const family = String(row.family || '');
  const classification = String(row.classificationReason || '');
  const coverage = Number(row.fieldEvidenceCoverage || 0);
  const confidence = Number(row.confidenceScore || 0);

  const allowByFamily = {
    dd_routing: {
      minCoverage: 0.66,
      minConfidence: 0.95,
      classifications: new Set(['regional_center_root_page', 'regional_center_contact_signals_present']),
    },
    medicaid_hhs_offices: {
      minCoverage: 0.66,
      minConfidence: 0.9,
      classifications: new Set(['local_office_contact_signals_present']),
    },
    forms_guides: {
      minCoverage: 0.8,
      minConfidence: 0.9,
      classifications: new Set(['exact_form_pdf_or_form_like_source_role']),
    },
    programs_benefits: {
      minCoverage: 0.75,
      minConfidence: 0.9,
      classifications: new Set(['program_action_signals_present']),
    },
    waivers: {
      minCoverage: 0.75,
      minConfidence: 0.9,
      classifications: new Set(['program_action_signals_present']),
    },
    education_routing: {
      minCoverage: 0.75,
      minConfidence: 0.9,
      classifications: new Set(['district_special_education_contact', 'regional_special_education_contact', 'education_contact_like_page']),
    },
  };

  const rule = allowByFamily[family];
  if (!rule) {
    reasons.push('family_not_enabled_for_publish_v1');
  } else {
    if (!rule.classifications.has(classification)) reasons.push('classification_not_publishable_v1');
    if (coverage < rule.minCoverage) reasons.push(`field_evidence_coverage_below_${rule.minCoverage}`);
    if (confidence < rule.minConfidence) reasons.push(`confidence_below_${rule.minConfidence}`);
  }

  if (family === 'medicaid_hhs_offices') {
    const fieldMap = new Map((row.fieldEntries || []).map((entry) => [entry.field, entry.value]));
    const officeCandidate = {
      office_name: fieldMap.get('office_name') || row.pageTitle || row.agency || '',
      name: row.agency || '',
      program_id: String(row.recordId || '').includes('county-ihss-') ? 'ihss-for-children' : null,
      source_url: row.finalUrl || row.sourceUrl || '',
      website: fieldMap.get('website') || row.finalUrl || row.sourceUrl || '',
      verification_status: 'official_verified',
      data_origin: 'scraped',
      phone: fieldMap.get('phone') || '',
      display_status: 'published',
    };
    if (!isPublicCountyOfficeEligible(officeCandidate)) {
      reasons.push('county_office_not_public_safe');
    }
  }

  return {
    displayStatusDecision: reasons.length === 0 ? 'published' : 'needs_review',
    reasons,
  };
}

function summarize(rows, key) {
  return rows.reduce((acc, row) => {
    const bucket = String(row[key] || 'unknown');
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {});
}

const args = parseArgs(process.argv.slice(2));
const stageReadyPath = path.join(args.inputDir, `${args.prefix}_stage_ready.jsonl`);
const outputBase = path.join(args.inputDir, 'ca_publish_decisions_v1');
const decisionsPath = `${outputBase}.jsonl`;
const summaryPath = `${outputBase}.json`;
const markdownPath = `${outputBase}.md`;

const stageReadyRows = readNdjson(stageReadyPath);
const decisions = stageReadyRows.map((row) => {
  const decision = decisionForRow(row);
  return {
    ...row,
    ...decision,
  };
});

const summary = {
  prefix: args.prefix,
  generatedAt: new Date().toISOString(),
  totalStageReadyRows: stageReadyRows.length,
  publishedCount: decisions.filter((row) => row.displayStatusDecision === 'published').length,
  needsReviewCount: decisions.filter((row) => row.displayStatusDecision !== 'published').length,
  byFamily: summarize(decisions, 'family'),
  byDecision: summarize(decisions, 'displayStatusDecision'),
  byClassificationReason: summarize(decisions, 'classificationReason'),
};

writeNdjson(decisionsPath, decisions);
writeJson(summaryPath, summary);
fs.writeFileSync(markdownPath, [
  '# California Publish Decisions v1',
  '',
  `- Prefix: \`${args.prefix}\``,
  `- Stage-ready rows: \`${summary.totalStageReadyRows}\``,
  `- Published: \`${summary.publishedCount}\``,
  `- Needs review: \`${summary.needsReviewCount}\``,
  '',
  '## Decision Counts',
  '',
  ...Object.entries(summary.byDecision).map(([label, count]) => `- ${label}: ${count}`),
  '',
].join('\n') + '\n');

console.log(JSON.stringify({
  stageReadyPath,
  decisionsPath,
  summaryPath,
  markdownPath,
  publishedCount: summary.publishedCount,
  needsReviewCount: summary.needsReviewCount,
}, null, 2));
