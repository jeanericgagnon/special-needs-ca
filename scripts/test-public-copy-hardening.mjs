import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const answerPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/answer-page.tsx'), 'utf8');
const ihssBehaviorLog = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/ihss-behavior-log/behavior-log-client.tsx'), 'utf8');
const countyBenefitsPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/[state]/[[...slug]]/page.tsx'), 'utf8');
const correctionFlow = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/counties/components/CorrectionFlow.tsx'), 'utf8');
const footer = fs.readFileSync(path.join(repoRoot, 'src/components/Footer.jsx'), 'utf8');
const editorialDisclosure = fs.readFileSync(path.join(repoRoot, 'frontend/src/components/editorial-disclosure.tsx'), 'utf8');
const seoPolicy = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/seo-policy.ts'), 'utf8');
const wizardClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/wizard-client.tsx'), 'utf8');
const launchToolLanding = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/launch-tool-landing.tsx'), 'utf8');
const conditionPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/conditions/[slug]/page.tsx'), 'utf8');
const appealLetterGenerator = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/components/appeal-letter-generator.tsx'), 'utf8');
const countyDiagnosisPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/[state]/[diagnosis]/[county]/page.tsx'), 'utf8');
const countiesClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/counties/[state]/counties-client.tsx'), 'utf8');
const countiesStatePage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/counties/[state]/page.tsx'), 'utf8');
const ihssCalculator = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/components/ihss-calculator.tsx'), 'utf8');
const appealsClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/appeals-center/appeals-client.tsx'), 'utf8');
const seoData = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/seo-data.ts'), 'utf8');
const stateConfigs = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts'), 'utf8');

assert.match(
  answerPage,
  /Download Source-Backed Form/,
  'Document download CTA should not label every linked form as official.'
);

assert.doesNotMatch(
  answerPage,
  /Download Official Form/,
  'Document download CTA should avoid unsupported official-form wording.'
);

assert.match(
  ihssBehaviorLog,
  />\s*24-HOUR BEHAVIOR & SAFETY LOG\s*</,
  'Printed IHSS safety log should avoid claiming official status.'
);

assert.doesNotMatch(
  ihssBehaviorLog,
  /OFFICIAL 24-HOUR BEHAVIOR & SAFETY LOG/,
  'Printed IHSS safety log should not present itself as official.'
);

assert.match(
  answerPage,
  /\$\\?\{countyWageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hour estimate/,
  'AnswerPage should label county IHSS values as estimates.'
);

assert.doesNotMatch(
  answerPage,
  /\$\\?\{countyWageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hr/,
  'AnswerPage should avoid rendering county IHSS values like hard rates.'
);

assert.match(
  countyBenefitsPage,
  /\$\\?\{wageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hour estimate/,
  'County benefits page should label IHSS values as estimates.'
);

assert.match(
  ihssCalculator,
  /\/ month estimate/,
  'Public IHSS calculator payout display should label monthly caregiver pay as an estimate.'
);

assert.doesNotMatch(
  `${countyBenefitsPage}\n${ihssCalculator}`,
  /\$\\?\{wageDisclosure\.hourlyRate\.toFixed\(2\)\}\/hr|\/ mo\b/,
  'Public IHSS surfaces should avoid hard-rate shorthand and unlabeled monthly pay displays.'
);

assert.match(
  countyBenefitsPage,
  /Visit Source Page/,
  'Program CTA should use evidence-safe source wording.'
);

assert.doesNotMatch(
  countyBenefitsPage,
  /Visit Official Agency Source/,
  'Program CTA should avoid assuming every linked source is an official agency page.'
);

assert.doesNotMatch(
  correctionFlow,
  /Source-backed checked official contact/,
  'County trust badge should avoid overstating a listing as an official contact.'
);

assert.match(
  correctionFlow,
  /Reviewed public contact|Reviewed public listing/,
  'County trust badge should use softer reviewed-public wording for checked listings.'
);

assert.match(
  correctionFlow,
  /Official public source linked/,
  'County trust badge should distinguish a linked official public source from a verified contact claim.'
);

assert.doesNotMatch(
  footer,
  /\bLast database audit:\b/i,
  'Footer should not ship a fake sitewide freshness stamp.'
);

assert.doesNotMatch(
  footer,
  /\bBuilt to wow families\b/i,
  'Footer should avoid throwaway marketing copy on a public trust surface.'
);

assert.match(
  footer,
  /Check each page for source links and last checked dates\./,
  'Footer should direct families to page-level provenance instead of claiming one global freshness date.'
);

assert.doesNotMatch(
  `${answerPage}\n${countyBenefitsPage}\n${footer}\n${ihssBehaviorLog}`,
  /\bwagers\b/i,
  'Public app copy must not contain the wagers typo.'
);

assert.doesNotMatch(
  countyDiagnosisPage,
  /Access .* school IEP assistance/,
  'County diagnosis metadata should avoid implying broader local assistance depth than the reviewed public route data supports.'
);

assert.doesNotMatch(
  countiesClient,
  /Lanterman Act service coordinators|LIDDA service coordinators|APD service coordinators|OPWDD Front Door coordinators|local service coordinators/,
  'County directory cards should not promise per-county coordinator coverage before the county page itself verifies that local public lane.'
);

assert.match(
  countiesClient,
  /currently published public routing options/,
  'County directory cards should describe the county grid as a reviewed-public routing surface rather than a guaranteed local coordinator directory.'
);

assert.doesNotMatch(
  countiesStatePage,
  /source-backed local routing|source-backed routing/,
  'State county directory copy should avoid stronger routing-certainty phrasing than the public-review model supports.'
);

assert.match(
  countiesStatePage,
  /currently published public routing/,
  'State county directory copy should describe the counties hub as a reviewed public-routing surface.'
);

assert.doesNotMatch(
  countyBenefitsPage,
  /Find pediatric Speech & Occupational therapy clinics, sensory-inclusive play areas, and caregiver support networks/i,
  'City-level leaf metadata should not imply verified clinic or network depth on gated local surfaces.'
);

assert.doesNotMatch(
  `${editorialDisclosure}\n${seoPolicy}`,
  /\bcrawler-verified\b/i,
  'Public trust surfaces should not label content as crawler-verified.'
);

assert.match(
  editorialDisclosure,
  /Public source linked from/,
  'Editorial disclosure should use softer public-source wording instead of automated verification claims.'
);

assert.match(
  answerPage,
  /Suggest a public source to review/,
  'Thin public guide surfaces should offer a direct source-suggestion CTA when provenance is still being verified.'
);

assert.match(
  answerPage,
  /Suggest a county office source/,
  'County lookup fallback copy should offer a direct county-office source suggestion CTA when local contacts are still under review.'
);

assert.doesNotMatch(
  wizardClient,
  /Projected Care Package Value/,
  'Benefits matcher should avoid projected-benefit framing that reads more certain than the evidence model supports.'
);

assert.match(
  wizardClient,
  /Estimated Planning Value/,
  'Benefits matcher should label the summary value as an estimate for planning.'
);

assert.match(
  wizardClient,
  /not a guaranteed benefit total/i,
  'Benefits matcher should explicitly disclaim that the planning summary is not a guaranteed benefit total.'
);

assert.doesNotMatch(
  `${seoData}\n${conditionPage}\n${countyBenefitsPage}`,
  /Assuming ADHD alone will qualify/i,
  'Public indexed guides should avoid framing diagnosis guidance as a direct qualification promise.'
);

assert.doesNotMatch(
  seoData,
  /To qualify for Protective Supervision/i,
  'Public IHSS guide content should frame Protective Supervision as a screening or review path, not as a qualification promise.'
);

assert.match(
  wizardClient,
  /Potential program paths/,
  'Benefits matcher should describe matched outputs as potential program paths rather than definitive matched programs.'
);

assert.match(
  launchToolLanding,
  /Sign in only if you want to save progress, keep notes, or return to a private working draft later\./,
  'Launch tool landing pages should state that login is only for saving private progress.'
);

assert.doesNotMatch(
  conditionPage,
  /California DDS Intake Liaison/,
  'Condition fallback copy should not imply that the statewide DDS office is a local intake liaison.'
);

assert.doesNotMatch(
  conditionPage,
  /Benefits in California: Parent Guide|Benefits California \| Lanterman Act & School Aid/,
  'Condition fallback copy should avoid older benefits-guide framing that overstates certainty.'
);

assert.doesNotMatch(
  conditionPage,
  /may qualify for specialized public benefit and school-support pathways/i,
  'Condition fallback quick-answer should stay at orientation-level guidance instead of sounding like an eligibility conclusion.'
);

assert.match(
  conditionPage,
  /families often review several public support pathways/i,
  'Condition fallback quick-answer should frame diagnosis pages as source-backed planning guidance.'
);

assert.doesNotMatch(
  conditionPage,
  /start the 15-day timeline/i,
  'Condition fallback copy should not hard-code an intake timeline trigger in generic diagnosis guidance.'
);

assert.doesNotMatch(
  appealLetterGenerator,
  /statutory 15-day timeline|60-day deadline as mandated/i,
  'Appeal letter generator should ask families to confirm the current district timeline rather than asserting a guaranteed statutory schedule.'
);

assert.doesNotMatch(
  appealsClient,
  /statutory 15 days|statutory 30-day window/i,
  'Public appeals helper letters should ask families to confirm the current applicable timeline instead of asserting fixed statutory windows as universal fact.'
);

assert.match(
  appealsClient,
  /confirm the current Assessment Plan timeline|timeline I understand currently applies/i,
  'Public appeals helper letters should redirect families back to the current timeline that applies to the notice or request.'
);

assert.doesNotMatch(
  `${seoData}\n${stateConfigs}`,
  /start the 15-day clock|15 Days to respond; 120 Days to assess|California DDS Intake Division/,
  'California public helper copy should avoid unsupported hard-clock language and misleading statewide intake labels.'
);

assert.doesNotMatch(
  `${seoData}\n${countyBenefitsPage}\n${countiesClient}`,
  /past the 15-day statutory deadline|statutory special-education timelines|The statutory timeline mandates/i,
  'Public indexed education-routing guidance should tell families to confirm the current timeline instead of asserting hard statutory timing as universal public fact.'
);

assert.match(
  `${seoData}\n${countyBenefitsPage}\n${countiesClient}`,
  /confirm the current .*timeline|confirm the current district or state special-education timeline|confirm the current intake, assessment, and service-start timeline/i,
  'Public education-routing guidance should redirect families back to the current official timeline that applies to their case.'
);

assert.doesNotMatch(
  seoData,
  /without losing SSI or Medi-Cal eligibility|bypasses this rule completely/,
  'Shared public guide copy should avoid absolute CalABLE eligibility-preservation phrasing without current-source confirmation.'
);

assert.doesNotMatch(
  seoData,
  /official application for In-Home Supportive Services \(IHSS\) in California/,
  'Shared form guide copy should avoid stronger-than-needed official-application wording when the public trust model only requires source-backed current form guidance.'
);

assert.match(
  seoData,
  /confirm the current contribution cap, SSI treatment threshold, and Medi-Cal treatment|current CDSS IHSS application form families commonly use/,
  'Shared guide copy should steer families back to current-source confirmation for savings and form workflow rules.'
);

console.log('public copy hardening tests passed');
