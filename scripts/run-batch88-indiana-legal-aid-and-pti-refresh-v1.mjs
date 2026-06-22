import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const generatedDir = path.join(repoRoot, 'data', 'generated');
const docsGeneratedDir = path.join(repoRoot, 'docs', 'generated');

const INPUTS = {
  summary: path.join(generatedDir, 'indiana_california_grade_summary_v2.json'),
  gap: path.join(generatedDir, 'indiana_gap_matrix_v2.jsonl'),
  failure: path.join(generatedDir, 'indiana_failure_ledger_v2.jsonl'),
  verified: path.join(generatedDir, 'indiana_verified_sources_v1.jsonl'),
  next: path.join(generatedDir, 'indiana_next_action_queue_v2.jsonl'),
};

const OUTPUTS = {
  summary: path.join(generatedDir, 'batch88_indiana_legal_aid_and_pti_refresh_summary_v1.json'),
  report: path.join(docsGeneratedDir, 'batch88-indiana-legal-aid-and-pti-refresh-report-v1.md'),
  stateReport: path.join(docsGeneratedDir, 'indiana-california-grade-audit-report-v2.md'),
};

const URLS = {
  legalAid: 'https://www.indianalegalservices.org/',
  ptiHome: 'https://insource.org/',
  ptiAbout: 'https://insource.org/about/',
  ptiGetHelp: 'https://insource.org/get-help/',
  ptiContact: 'https://insource.org/contact-us/',
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonl(filePath) {
  if (!fs.existsSync(filePath)) return [];
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
  fs.writeFileSync(filePath, `${rows.map((row) => JSON.stringify(row)).join('\n')}${rows.length ? '\n' : ''}`);
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Ablefull Codex Indiana statewide repair' },
      signal: controller.signal,
      redirect: 'follow',
    });
    const html = await response.text();
    return {
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get('content-type') || '',
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function assertIncludes(text, pattern, label) {
  if (!text.toLowerCase().includes(pattern.toLowerCase())) {
    throw new Error(`Expected ${label} to include "${pattern}".`);
  }
}

export function extractIndianaLegalAidEvidence(html) {
  const text = htmlToText(html);
  const needles = [
    'Indiana Legal Services',
    'Help for Hoosiers',
    'free civil legal assistance to eligible low-income residents throughout the state of Indiana',
  ];
  for (const needle of needles) {
    assertIncludes(text, needle, 'Indiana Legal Services homepage');
  }

  const match = text.match(/free civil legal assistance to eligible low-income residents throughout the state of Indiana[^.]*\./i);
  return {
    titleSnippet: 'Indiana Legal Services',
    routingSnippet: match ? match[0] : 'Indiana Legal Services provides free civil legal assistance to eligible low-income residents throughout the state of Indiana.',
  };
}

export function evaluateIndianaPtiEvidence(pages) {
  const combined = pages.map((page) => htmlToText(page.html)).join(' ');

  const supportNeedles = [
    'Every Learner. Every Family. Every Educator.',
    'Indiana families and service providers',
    'children with disabilities navigate the special education process in the state of Indiana',
    "Indiana's state special education law, Article 7",
    'Indiana Resource Center for Families with Special Needs',
  ];
  const matchedNeedles = supportNeedles.filter((needle) => combined.toLowerCase().includes(needle.toLowerCase()));
  if (matchedNeedles.length < 2) {
    throw new Error('Indiana INSOURCE bounded first-party pages no longer preserve enough statewide support evidence to keep the PTI blocker truthful.');
  }

  const ptiRegex = /Parent Training( and| &) Information|Parent Training Information|\bPTI\b/i;
  return {
    explicitDesignationPreserved: ptiRegex.test(combined),
    blockerEvidence: ptiRegex.test(combined)
      ? 'Bounded first-party INSOURCE review now preserves explicit PTI designation text.'
      : 'Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI / Parent Training and Information Center designation text.',
  };
}

function recalcSummary(summary, gapRows, failureRows, verifiedRows) {
  const criticalRows = gapRows.filter((row) => row.critical);
  const strong = criticalRows.filter((row) => String(row.family_status || '').startsWith('verified_')).length;
  const missing = criticalRows.filter((row) => row.family_status === 'missing').length;
  const weak = criticalRows.length - strong - missing;
  return {
    ...summary,
    classification: 'BLOCKED',
    index_safe: false,
    incorrectly_index_safe: false,
    completeness_pct: Math.floor((strong / criticalRows.length) * 100),
    strong_critical_families: strong,
    weak_critical_families: weak,
    missing_critical_families: missing,
    primary_gap_reason: 'generic_or_statewide_evidence_used_where_local_required',
    recommended_batch: 'batch_2_repair_blocked',
    critical_gap_families: failureRows.filter((row) => row.severity === 'critical').map((row) => row.family),
    major_gap_families: failureRows.filter((row) => row.severity === 'major').map((row) => row.family),
    verified_source_families_with_samples: verifiedRows.filter((row) => row.sample_count > 0).map((row) => row.family),
    complete_ready: false,
    final_blockers: failureRows.map((row) => ({
      family: row.family,
      severity: row.severity,
      failure_code: row.failure_code,
      evidence: row.evidence,
      next_action: row.next_action,
    })),
  };
}

function buildStateReport(summary, gapRows, failureRows, verifiedRows, nextRows, ptiEvaluation) {
  return [
    '# Indiana California-Grade Batch 88 Report v1',
    '',
    `- classification: ${summary.classification}`,
    `- index_safe: ${summary.index_safe ? 'true' : 'false'}`,
    `- completeness_pct: ${summary.completeness_pct}`,
    `- county_count: ${summary.county_count}`,
    `- primary_gap_reason: ${summary.primary_gap_reason}`,
    '',
    '## Family status',
    '',
    ...gapRows.map((row) => `- ${row.family}: ${row.family_status} (${row.status_reason})`),
    '',
    '## Failure ledger',
    '',
    ...failureRows.map((row) => `- ${row.family}: ${row.failure_code} :: ${row.evidence}`),
    '',
    '## Verified source samples',
    '',
    ...verifiedRows.map((row) => `- ${row.family}: ${row.family_status}; samples=${row.sample_count}${row.samples?.[0]?.source_url ? `; first=${row.samples[0].source_url}` : ''}`),
    '',
    '## Next actions',
    '',
    ...nextRows.map((row) => `- [${row.severity}] ${row.family}: ${row.next_action}`),
    '',
    '## Completion decision',
    '',
    '- Indiana remains BLOCKED and not index-safe because district or county education routing still depends on generic statewide Indiana DOE fallback pages rather than county- or district-owned leaves, and county/local disability resources still depend on a DOI dataset mirror instead of reviewed county-owned local routing.',
    '- Indiana Legal Services is explicit enough for legal aid because the reviewed first-party homepage preserves Help for Hoosiers language plus free civil legal assistance for eligible low-income residents throughout the state of Indiana.',
    ptiEvaluation.explicitDesignationPreserved
      ? '- The bounded INSOURCE review now preserves explicit PTI designation text, so PTI no longer blocks the statewide support layer.'
      : '- INSOURCE remains blocked for PTI because the bounded live first-party review preserves statewide Indiana parent-support and training scope, but still does not preserve explicit PTI / Parent Training and Information Center designation text.',
    '- Indiana is therefore still terminal BLOCKED, not COMPLETE.',
  ].join('\n') + '\n';
}

export async function generateBatch88IndianaLegalAidAndPtiRefreshV1(customFetch = fetchHtml) {
  const summary = readJson(INPUTS.summary);
  const gapRows = readJsonl(INPUTS.gap);
  const failureRows = readJsonl(INPUTS.failure);
  const verifiedRows = readJsonl(INPUTS.verified);
  const nextRows = readJsonl(INPUTS.next);

  const [legalAidFetch, ptiHomeFetch, ptiAboutFetch, ptiGetHelpFetch, ptiContactFetch] = await Promise.all([
    customFetch(URLS.legalAid),
    customFetch(URLS.ptiHome),
    customFetch(URLS.ptiAbout),
    customFetch(URLS.ptiGetHelp),
    customFetch(URLS.ptiContact),
  ]);

  for (const [label, result] of [
    ['Indiana Legal Services', legalAidFetch],
    ['INSOURCE home', ptiHomeFetch],
    ['INSOURCE about', ptiAboutFetch],
    ['INSOURCE get-help', ptiGetHelpFetch],
    ['INSOURCE contact', ptiContactFetch],
  ]) {
    if (result.status !== 200) {
      throw new Error(`${label} fetch failed with status ${result.status}`);
    }
  }

  const legalEvidence = extractIndianaLegalAidEvidence(legalAidFetch.html);
  const ptiEvaluation = evaluateIndianaPtiEvidence([
    ptiHomeFetch,
    ptiAboutFetch,
    ptiGetHelpFetch,
    ptiContactFetch,
  ]);
  const fetchedAt = new Date().toISOString();

  const updatedGapRows = gapRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        status_reason: 'Indiana Legal Services now provides reviewed statewide first-party legal-aid routing from a live homepage.',
      };
    }
    if (row.family === 'parent_training_information_center' && !ptiEvaluation.explicitDesignationPreserved) {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        status_reason: 'Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI designation text.',
      };
    }
    return row;
  });

  const updatedFailureRows = failureRows
    .filter((row) => row.family !== 'legal_aid')
    .map((row) => {
      if (row.family === 'parent_training_information_center' && !ptiEvaluation.explicitDesignationPreserved) {
        return {
          ...row,
          failure_code: 'bounded_live_first_party_review_still_lacks_explicit_pti_designation',
          evidence: 'Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI / Parent Training and Information Center designation text.',
          next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
        };
      }
      return row;
    });

  const updatedNextRows = nextRows
    .filter((row) => row.family !== 'legal_aid')
    .map((row) => {
      if (row.family === 'parent_training_information_center' && !ptiEvaluation.explicitDesignationPreserved) {
        return {
          ...row,
          failure_code: 'bounded_live_first_party_review_still_lacks_explicit_pti_designation',
          evidence: 'Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI designation text.',
          next_action: 'hold_blocked_until_explicit_pti_designation_is_preserved_from_reviewed_first_party_source',
        };
      }
      return row;
    });

  const updatedVerifiedRows = verifiedRows.map((row) => {
    if (row.family === 'legal_aid') {
      return {
        ...row,
        family_status: 'verified_state_grade',
        evidence_strength: 'strong',
        sample_count: 1,
        blocker_code: null,
        blocker_evidence: null,
        query_basis: 'Reviewed first-party Indiana Legal Services homepage explicitly preserves statewide free civil legal assistance for eligible low-income Indiana residents.',
        samples: [
          {
            sample_name: 'Indiana Legal Services',
            source_url: URLS.legalAid,
            final_url: legalAidFetch.finalUrl,
            verification_status: 'verified',
            source_type: 'first_party',
            source_table: 'bounded_live_indiana_check',
            fetched_at: fetchedAt,
            evidence_snippet: `${legalEvidence.titleSnippet} ${legalEvidence.routingSnippet}`,
          },
        ],
      };
    }
    if (row.family === 'parent_training_information_center' && !ptiEvaluation.explicitDesignationPreserved) {
      return {
        ...row,
        family_status: 'blocked_reviewed_first_party_support_without_explicit_pti_designation',
        evidence_strength: 'weak',
        blocker_code: 'bounded_live_first_party_review_still_lacks_explicit_pti_designation',
        blocker_evidence: 'Bounded live review of the INSOURCE home, about, get-help, and contact pages still preserves statewide Indiana parent-support and training scope, but does not preserve explicit PTI / Parent Training and Information Center designation text.',
        query_basis: 'Reviewed first-party INSOURCE home, about, get-help, and contact pages preserve statewide Indiana family-support scope, but bounded live review still does not preserve explicit PTI designation text.',
      };
    }
    return row;
  });

  const updatedSummary = recalcSummary(summary, updatedGapRows, updatedFailureRows, updatedVerifiedRows);
  const updatedReport = buildStateReport(updatedSummary, updatedGapRows, updatedFailureRows, updatedVerifiedRows, updatedNextRows, ptiEvaluation);

  const batchSummary = {
    batch: 'batch_88_indiana_legal_aid_and_pti_refresh_v1',
    generated_at: fetchedAt,
    state: 'indiana',
    classification: updatedSummary.classification,
    index_safe: updatedSummary.index_safe,
    updated_families: ['legal_aid', 'parent_training_information_center'],
    remaining_blockers: updatedNextRows.map((row) => row.family),
    evidence_checks: {
      legalAid: {
        sourceUrl: URLS.legalAid,
        finalUrl: legalAidFetch.finalUrl,
        status: legalAidFetch.status,
        evidenceSnippet: legalEvidence.routingSnippet,
      },
      pti: {
        sourceUrls: [URLS.ptiHome, URLS.ptiAbout, URLS.ptiGetHelp, URLS.ptiContact],
        explicitDesignationPreserved: ptiEvaluation.explicitDesignationPreserved,
        blockerEvidence: ptiEvaluation.blockerEvidence,
      },
    },
  };

  writeJsonl(INPUTS.gap, updatedGapRows);
  writeJsonl(INPUTS.failure, updatedFailureRows);
  writeJsonl(INPUTS.verified, updatedVerifiedRows);
  writeJsonl(INPUTS.next, updatedNextRows);
  writeJson(INPUTS.summary, updatedSummary);
  writeJson(OUTPUTS.summary, batchSummary);
  fs.writeFileSync(OUTPUTS.stateReport, updatedReport);
  fs.writeFileSync(
    OUTPUTS.report,
    [
      '# Indiana Legal Aid + PTI Refresh Report v1',
      '',
      `- classification: ${updatedSummary.classification}`,
      `- index_safe: ${updatedSummary.index_safe ? 'true' : 'false'}`,
      `- updated_families: ${batchSummary.updated_families.join(', ')}`,
      `- remaining_blockers: ${batchSummary.remaining_blockers.join(', ')}`,
      '',
      '## Evidence checks',
      '',
      `- legal_aid: ${legalAidFetch.finalUrl} :: ${legalEvidence.routingSnippet}`,
      `- parent_training_information_center: ${ptiEvaluation.blockerEvidence}`,
      '',
      '## Notes',
      '',
      '- This pass repaired statewide legal aid from a reviewed live first-party homepage.',
      '- This pass also sharpened the PTI blocker using bounded live first-party review instead of relying only on the older saved artifact wording.',
    ].join('\n') + '\n',
  );

  return updatedSummary;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (isDirectRun) {
  generateBatch88IndianaLegalAidAndPtiRefreshV1().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
