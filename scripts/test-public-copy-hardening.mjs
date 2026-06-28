import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

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
const ihssMiniProduct = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/benefits/components/ihss-mini-product.tsx'), 'utf8');
const appealsClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/appeals-center/appeals-client.tsx'), 'utf8');
const seoData = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/seo-data.ts'), 'utf8');
const stateConfigs = fs.readFileSync(path.join(repoRoot, 'frontend/src/lib/stateConfigs.ts'), 'utf8');
const advocatesPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/advocates/page.tsx'), 'utf8');
const advocatesClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/advocates/advocate-directory-client.tsx'), 'utf8');
const findHelpClient = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/find-help/find-help-client.tsx'), 'utf8');
const formsIndexSource = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/forms/page.tsx'), 'utf8');
const programPage = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/programs/[slug]/page.tsx'), 'utf8');
const waiverComparison = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/waiver-comparison.tsx'), 'utf8');
const stateCoverageBadge = fs.readFileSync(path.join(repoRoot, 'frontend/src/components/state-coverage-badge.tsx'), 'utf8');
const directoryFoundationPanel = fs.readFileSync(path.join(repoRoot, 'frontend/src/app/components/directory-foundation-panel.tsx'), 'utf8');

const publicTrustSurfaceCopy = [
  answerPage,
  countyBenefitsPage,
  countyDiagnosisPage,
  countiesClient,
  countiesStatePage,
  findHelpClient,
  formsIndexSource,
  advocatesPage,
  advocatesClient,
  conditionPage,
  programPage,
  waiverComparison,
  stateCoverageBadge,
  launchToolLanding,
  editorialDisclosure,
  footer,
].join('\n');

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

assert.doesNotMatch(
  ihssBehaviorLog,
  /else\s*\{\s*setIncidents\(DEFAULT_INCIDENTS\)|catch\s*\{\s*setIncidents\(DEFAULT_INCIDENTS\)/,
  'Public IHSS behavior log should not auto-seed fabricated sample incidents.'
);

assert.doesNotMatch(
  ihssBehaviorLog,
  /const \[parentName, setParentName\] = useState\('Jane Doe'\)|const \[childName, setChildName\] = useState\('Alex'\)/,
  'Public IHSS behavior log should not ship hardcoded fake family names.'
);

const overtimePanel = fs.readFileSync(
  path.join(repoRoot, 'frontend/src/app/dashboard/components/IHSSOvertimePanel.tsx'),
  'utf8',
);

assert.doesNotMatch(
  overtimePanel,
  /DEFAULT_INCIDENTS\.forEach\(inc => \{\s*saveSafetyIncidentAction/,
  'Signed-in IHSS panel should not auto-save fabricated sample incidents into user data.'
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

assert.match(
  ihssCalculator,
  /checked public county hourly pay estimate/,
  'Public IHSS calculator intro should describe county pay as a checked public estimate, not a hard county rate.'
);

assert.match(
  ihssCalculator,
  /Treat this as planning guidance, not a county pay guarantee\./,
  'Public IHSS calculator intro should explicitly disclaim that county pay numbers are estimates.'
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
  publicTrustSurfaceCopy,
  /\battorney reviewed\b|\bexpert reviewed\b|\bvetted\b/i,
  'Public trust surfaces should not claim attorney review, expert review, or vetted status without an explicit evidence contract.'
);

assert.doesNotMatch(
  publicTrustSurfaceCopy,
  /\bguaranteed\b|\bwill qualify\b|\bguaranteed approval\b/i,
  'Public trust surfaces should not promise guaranteed outcomes or qualification.'
);

assert.doesNotMatch(
  seoData,
  /Your child has been approved for Protective Supervision\./,
  'Shared SEO guide content should avoid speaking as if approval has already happened without tying that statement to a reviewed agency notice.'
);

assert.doesNotMatch(
  seoData,
  /\bPrompts can qualify for hours\b|\bThey qualify for Lanterman Act assessment\b|\bcheck if they qualify for Medicaid or CHIP programs\b/,
  'Shared SEO guide content should prefer softer eligibility wording such as may qualify or may be eligible.'
);

assert.doesNotMatch(
  `${countyBenefitsPage}\n${countyDiagnosisPage}`,
  /Intake Desk,\s*\$\{countyFormatted\},\s*\$\{stateCode\}|Special Education Department,\s*\$\{countyFormatted\},\s*\$\{stateCode\}/,
  'County public pages should not fabricate local addresses for map cards or routing widgets.'
);

assert.doesNotMatch(
  `${countyBenefitsPage}\n${countyDiagnosisPage}`,
  /addressLocality': countyFormatted|addressRegion': stateCode|addressCountry': 'US'/,
  'County public JSON-LD should not manufacture PostalAddress fields from generic county/state placeholders.'
);

assert.doesNotMatch(
  stateCoverageBadge,
  /Deep Launch Coverage/,
  'State coverage badge should not imply California is fully launch-complete at every local layer.'
);

assert.match(
  stateCoverageBadge,
  /Deep Reviewed Coverage/,
  'State coverage badge should describe California as deeply reviewed rather than exhaustive.'
);

assert.match(
  directoryFoundationPanel,
  /const publicAddress = isMeaningfulDirectoryAddress\(record\.address\) \? record\.address : null;/,
  'Directory cards should sanitize address fields before rendering them publicly.'
);

assert.match(
  directoryFoundationPanel,
  /const publicNextStepPhone = isMeaningfulDirectoryPhone\(record\.next_step_phone\) \? record\.next_step_phone : null;/,
  'Directory cards should sanitize next-step intake phone fields before rendering them publicly.'
);

assert.match(
  directoryFoundationPanel,
  /const publicNextStepEmail = isMeaningfulDirectoryEmail\(record\.next_step_email\) \? record\.next_step_email : null;/,
  'Directory cards should sanitize next-step intake email fields before rendering them publicly.'
);

assert.match(
  answerPage,
  /const publicCountyOffice = countyDetails\?\.countyOffices\?\.find/,
  'Shared static answer pages should derive a public county office only from source-backed local records.'
);

assert.match(
  answerPage,
  /Source-backed county office snippet\./,
  'Shared static answer pages should label county office snippets as source-backed and caution families to confirm them.'
);

assert.match(
  answerPage,
  /Open county office source/,
  'Shared static answer pages should expose the county office source link instead of treating local routing as self-proving.'
);

assert.match(
  answerPage,
  /const publicRegionalCenter = countyDetails\?\.regionalCenters\?\.find/,
  'Shared static answer pages should gate regional-center snippets behind a source-backed public routing record.'
);

assert.match(
  answerPage,
  /Open regional center source/,
  'Shared static answer pages should expose the regional center source link when showing local intake snippets.'
);

assert.match(
  answerPage,
  /We are still verifying local regional center routing for this county\./,
  'Shared static answer pages should explicitly explain when local regional-center routing is still being verified.'
);

assert.match(
  answerPage,
  /Suggest a regional center source/,
  'Shared static answer pages should provide a public CTA to suggest a regional-center source when no reviewed routing is ready.'
);

assert.match(
  findHelpClient,
  /This hub stays <strong>noindex<\/strong> while we keep verifying local directory depth, contact routes, accessibility details, and next-step instructions\./,
  'Find-help hub should explicitly explain its noindex trust posture near the top of the page.'
);

assert.match(
  advocatesClient,
  /This directory stays <strong>noindex<\/strong> while local advocate depth is still under review\./,
  'Advocates directory should explicitly explain its noindex trust posture near the top of the page.'
);

assert.doesNotMatch(
  waiverComparison,
  /No waitlist\. Intakes must be completed within 45 days\.|Current wait list is 1\.5 to 2\+ years|Medi-Cal waivers bypass parent income limits, letting special needs children access full healthcare/i,
  'California waiver comparison should avoid unsupported hard waitlist, timing, or deterministic waiver-copy claims.'
);

assert.match(
  waiverComparison,
  /not a guarantee of eligibility, waitlist position, or approval/i,
  'California waiver comparison should carry an explicit planning-only disclaimer.'
);

assert.doesNotMatch(
  formsIndexSource,
  /Official step-by-step guides|Official applications and guides|Official applications and parent guides|Official CCS Enrollment Form/,
  'Forms hub should avoid overstating state category summaries or form titles as official when safer source-backed wording is available.'
);

assert.match(
  formsIndexSource,
  /Source-backed step-by-step guides|Source-backed applications and guides|CCS Enrollment Form \(DHCS 4480\)/,
  'Forms hub should preserve source-backed category wording and neutral form titles after hardening.'
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
  /This summary is informational, may include estimates, and should be checked against the linked public sources before you act on it\./,
  'Public answer guides should carry an explicit summary disclaimer before families rely on the quick-answer callout.'
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

assert.doesNotMatch(
  stateConfigs,
  /Could my child qualify for paid caregiver hours/i,
  'Reusable public state FAQ prompts should frame paid caregiver paths as worth reviewing, not as direct qualification promises.'
);

assert.match(
  stateConfigs,
  /Could paid caregiver hours \(IHSS\) be worth reviewing|Could paid caregiver hours \(MDCP\) be worth reviewing|Could paid caregiver hours \(CDC\+\) be worth reviewing|Could paid caregiver hours \(CDPAP\) be worth reviewing|Could paid caregiver hours \(HSP\) be worth reviewing|Could paid caregiver hours \(GAPP\) be worth reviewing/,
  'Reusable public state FAQ prompts should use softer screening language for caregiver-pay questions.'
);

assert.doesNotMatch(
  ihssCalculator,
  /If Protective Supervision is approved, basic personal care hours are integrated\./,
  'Public IHSS calculator should avoid presenting authorization language as if approval were already established.'
);

assert.match(
  ihssCalculator,
  /If Protective Supervision is later authorized, basic personal care hours are integrated\./,
  'Public IHSS calculator should frame the hour-cap explanation as a later-authorization scenario.'
);

assert.match(
  ihssMiniProduct,
  /Any authorized hours and monthly pay still depend on the county assessment, the current local rate, and the final county decision\./,
  'IHSS mini-product should explicitly keep authorized hours and pay estimates contingent on the county decision.'
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
  ihssMiniProduct,
  /formal appeals letters/i,
  'Public IHSS helper CTAs should not imply the product emits final-form legal appeal letters.'
);

assert.match(
  ihssMiniProduct,
  /appeal letter drafts/i,
  'Public IHSS helper CTAs should describe generated appeal content as drafts for family review.'
);

assert.doesNotMatch(
  `${stateConfigs}\n${seoData}`,
  /requiring evaluations within 60 calendar days of receiving parental consent\./i,
  'Public state legal disclaimers should avoid presenting state assessment timing as an unqualified hard promise.'
);

assert.match(
  stateConfigs,
  /generally require evaluations within 60 calendar days of receiving parental consent under the current process/i,
  'Public state legal disclaimers should frame timing rules as current-process guidance rather than an unconditional promise.'
);

assert.doesNotMatch(
  ihssMiniProduct,
  /\bIf approved, you will receive a Notice of Action\b/i,
  'Public IHSS helper copy should name the county approval decision rather than speaking as if approval is an abstract certainty.'
);

assert.match(
  ihssMiniProduct,
  /If the county approves the request, you will receive a Notice of Action/i,
  'Public IHSS helper copy should tie the NOA language back to the county decision.'
);

assert.doesNotMatch(
  `${seoData}\n${stateConfigs}\n${programPage}`,
  /\bis a qualifying condition \(or associated developmental delay category\) under the Lanterman Act\b|\bis medically eligible for CCS specialized physician care\b/i,
  'Public source-backed condition and program copy should not overstate legal or medical eligibility as already determined.'
);

assert.match(
  `${seoData}\n${stateConfigs}\n${programPage}\n${answerPage}`,
  /may be a relevant condition .* eligibility review under the Lanterman Act|may support California Children's Services review/i,
  'Public source-backed condition and program copy should frame Regional Center and CCS pathways as review-dependent.'
);

assert.doesNotMatch(
  `${seoData}\n${stateConfigs}`,
  /start the 15-day clock|15 Days to respond; 120 Days to assess|California DDS Intake Division/,
  'California public helper copy should avoid unsupported hard-clock language and misleading statewide intake labels.'
);

assert.doesNotMatch(
  seoData,
  /must respond to this written intake request within 15 days|submit the official transition referral and schedule our Transition Conference as mandated|fails to deliver the Assessment Plan within 15 days/i,
  'California canned letters and timeline guides should ask families to confirm the current process instead of asserting hard response mandates in template copy.'
);

assert.match(
  seoData,
  /confirm the current intake response timeline|current transition referral|written timeline confirmation/i,
  'California canned letters and timeline guides should redirect families back to the current official process and timing.'
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
  countyBenefitsPage,
  /Access .* school IEP assistance|view source-backed local special education contacts|Review source-backed Medi-Cal waiver pathways|source-backed advocacy links/i,
  'Shared county-guide metadata and intro copy should avoid overstating local certainty beyond the reviewed-public routing contract.'
);

assert.match(
  countyBenefitsPage,
  /Review .* public support paths|review currently published local special education contacts|Review currently published Medi-Cal waiver pathways|currently published advocacy links/i,
  'Shared county-guide metadata and intro copy should use the reviewed-public wording for local support, education, and waiver guidance.'
);

assert.doesNotMatch(
  advocatesPage,
  /source-backed California special education advocate listings/i,
  'Advocates directory metadata should not imply every listing is fully source-backed beyond the reviewed public-record standard.'
);

assert.match(
  advocatesPage,
  /publicly listed California special education advocate records/i,
  'Advocates directory metadata should describe the surface as publicly listed records with source notes.'
);

assert.doesNotMatch(
  findHelpClient,
  /Locate source-backed county intake offices/i,
  'Find-help county directory teaser should not overclaim local county coverage beyond the reviewed-public routing surface.'
);

assert.match(
  findHelpClient,
  /Review currently published county intake offices/i,
  'Find-help county directory teaser should describe the county surface as currently published public routing.'
);

assert.doesNotMatch(
  programPage,
  /Learn about eligibility, requirements, and how to apply/i,
  'DB-backed program fallback metadata should not read like a fully verified guide when it is only as strong as the linked public record.'
);

assert.match(
  programPage,
  /Review the current public program record|confirm details against the linked source/i,
  'DB-backed program fallback metadata should redirect families back to the linked source before they rely on the page.'
);

assert.doesNotMatch(
  programPage,
  /official source asks for them/i,
  'DB-backed program fallback body copy should not escalate the linked source into a stronger official-guide claim than the page contract supports.'
);

assert.match(
  programPage,
  /linked public source asks for them/i,
  'DB-backed program fallback body copy should keep the guidance tied to the linked public source.'
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
