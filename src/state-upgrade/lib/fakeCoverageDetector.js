/**
 * Fake Coverage Detector
 * 
 * Automatically audits staging and promotion records to identify suspicious county-count mirroring,
 * duplicate phone numbers or addresses, missing service areas, and metadata anomalies.
 */
export function detectFakeCoverage(records, stateConfig, phaseId) {
  const issues = [];
  const expectedCounties = stateConfig.expected_counties || 0;
  const recordCount = records.length;

  if (recordCount === 0) return { pass: true, issues: [] };

  // 1. County-count mirroring check
  const regionalPhases = [];
  if (regionalPhases.includes(phaseId) && recordCount === expectedCounties) {
    issues.push({
      type: 'COUNTY_COUNT_MIRRORING',
      message: `Suspicious: Regional phase '${phaseId}' has exactly ${recordCount} records, mirroring the state county count of ${expectedCounties}.`
    });
  }

  // Count frequencies
  const phones = {};
  const addresses = {};
  const urls = {};
  const scores = {};
  let missingServiceArea = 0;
  let serviceAreaConfusion = 0;

  for (const rec of records) {
    const phone = rec.phone || rec.intake_phone;
    if (phone) phones[phone] = (phones[phone] || 0) + 1;

    const address = rec.physical_address || rec.address || rec.office_locations;
    if (address) addresses[address] = (addresses[address] || 0) + 1;

    const url = rec.source_url || rec.source_urls;
    if (url) urls[url] = (urls[url] || 0) + 1;

    const score = rec.confidence_score;
    if (score !== undefined) scores[score] = (scores[score] || 0) + 1;

    if (rec.service_area_type !== undefined) {
      if (!rec.service_area_type) {
        missingServiceArea++;
      }

      // Physical county vs service area confusion
      if (rec.physical_county && !rec.counties_served && rec.service_area_type === 'regional') {
        serviceAreaConfusion++;
      }
    }
  }

  // 2. Repeated phone numbers
  for (const [phone, count] of Object.entries(phones)) {
    if (count > 5 && count >= recordCount * 0.1) {
      issues.push({
        type: 'REPEATED_PHONE_NUMBER',
        message: `Phone number '${phone}' is repeated in ${count} records (${Math.round((count/recordCount)*100)}% of total).`
      });
    }
  }

  // 3. Repeated addresses
  for (const [addr, count] of Object.entries(addresses)) {
    if (count > 5 && count >= recordCount * 0.1) {
      issues.push({
        type: 'REPEATED_ADDRESS',
        message: `Address '${addr}' is repeated in ${count} records (${Math.round((count/recordCount)*100)}% of total).`
      });
    }
  }

  // 4. Repeated source URLs
  for (const [url, count] of Object.entries(urls)) {
    if (count > 5 && count >= recordCount * 0.2 && !['benefits_hhs', 'dd_idd', 'district_replacements', 'trusted_nonprofits', 'forms_appeals_transition', 'early_intervention', 'education_regional'].includes(phaseId)) {
      issues.push({
        type: 'REPEATED_SOURCE_URL',
        message: `Source URL '${url}' is repeated in ${count} records (${Math.round((count/recordCount)*100)}% of total).`
      });
    }
  }

  // 5. Suspicious confidence uniformity
  const scoreKeys = Object.keys(scores);
  if (scoreKeys.length === 1 && recordCount > 5 && !['benefits_hhs', 'dd_idd', 'district_replacements', 'trusted_nonprofits', 'forms_appeals_transition', 'early_intervention', 'education_regional'].includes(phaseId)) {
    issues.push({
      type: 'SUSPICIOUS_CONFIDENCE_UNIFORMITY',
      message: `Suspicious: 100% of records have identical confidence score of ${scoreKeys[0]}.`
    });
  }

  // 6. Missing service area type
  if (missingServiceArea > 0) {
    issues.push({
      type: 'MISSING_SERVICE_AREA_TYPE',
      message: `${missingServiceArea} records are missing 'service_area_type'.`
    });
  }

  // 7. Physical location / service area confusion
  if (serviceAreaConfusion > 0) {
    issues.push({
      type: 'PHYSICAL_LOCATION_CONFUSION',
      message: `${serviceAreaConfusion} regional records map 'physical_county' without declaring 'counties_served' catchment area.`
    });
  }

  return {
    pass: issues.length === 0,
    issues
  };
}
