function normalized(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function lower(value) {
  return normalized(value).toLowerCase();
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function aggregateText(record) {
  return [
    record.sourceRole,
    record.sourceName,
    record.pageTitle,
    ...(record.h1s || []),
    ...(record.h2s || []),
    ...(record.paragraphs || []).slice(0, 80),
    record.textSample,
    ...(record.links || []).flatMap((link) => [link.text, link.href]),
  ].filter(Boolean).join('\n');
}

function hasCue(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function findParagraph(record, patterns) {
  return (record.paragraphs || []).find((line) => hasCue(line, patterns)) || '';
}

function findLink(record, patterns) {
  return (record.links || []).find((link) => hasCue(`${link.text} ${link.href}`, patterns)) || null;
}

function evidence(field, value, evidenceText, pageLocation, source = 'content') {
  return {
    field,
    value: value ?? '',
    covered: Boolean(normalized(value)),
    evidenceText: normalized(evidenceText || ''),
    pageLocation: normalized(pageLocation || ''),
    source,
  };
}

function genericTitle(title) {
  return hasCue(title, [
    /^home$/i,
    /^services$/i,
    /^forms\/?brochures$/i,
    /^forms and publications/i,
    /^resources$/i,
    /^public authority$/i,
    /^welcome/i,
    /^news and announcements$/i,
    /\.pdf$/i,
    /^free legal help$/i,
    /^get help$/i,
  ]);
}

function filenameLike(title) {
  return /^[a-f0-9]{32,}\.pdf$/i.test(normalized(title));
}

function classifyFormRecord(record, text) {
  const sourceRole = lower(record.sourceRole);
  if (hasCue(sourceRole, [/forms_catalog/, /directory/, /information/, /faq/, /fact_sheet/, /directive/])) {
    return {
      entityType: hasCue(sourceRole, [/directory/, /catalog/]) ? 'directory' : 'policy_or_informational_page',
      classificationReason: 'forms_catalog_or_guidance_not_exact_form',
      destinationTable: null,
    };
  }
  return {
    entityType: 'form',
    classificationReason: 'exact_form_pdf_or_form_like_source_role',
    destinationTable: 'forms_and_guides',
  };
}

function classifyAdvocateRecord(record, text) {
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  const iepCue = hasCue(text, [/\biep\b/i, /\b504\b/i, /special education/i, /education advocacy/i, /special[- ]ed/i]);
  const legalDirectoryCue = hasCue(text, [/free legal help/i, /lawyer referral/i, /lawhelp/i, /state bar/i, /self help guide/i, /california courts/i]);
  const statewideRightsCue = hasCue(text, [/disability rights california/i, /protection and advocacy/i]);
  if (iepCue) {
    return {
      entityType: 'advocate_organization',
      classificationReason: 'explicit_special_education_advocacy_signal',
      destinationTable: 'iep_advocates',
    };
  }
  if (statewideRightsCue) {
    return {
      entityType: 'advocate_organization',
      classificationReason: 'statewide_rights_org_not_iep_advocate',
      destinationTable: 'referral_resources',
    };
  }
  if (legalDirectoryCue || genericTitle(title)) {
    return {
      entityType: 'directory',
      classificationReason: 'general_legal_help_directory',
      destinationTable: 'legal_help_resources',
    };
  }
  return {
    entityType: 'contact_page',
    classificationReason: 'generic_advocate_contact_page',
    destinationTable: 'referral_resources',
  };
}

function classifyDdRoutingRecord(record, text) {
  const sourceRole = lower(record.sourceRole);
  if (/regional_center_root_from_dds_directory/.test(sourceRole)) {
    return {
      entityType: 'agency',
      classificationReason: 'regional_center_root_page',
      destinationTable: 'state_resource_agencies',
    };
  }
  if (hasCue(sourceRole, [/official_directory/, /directory/])) {
    return {
      entityType: 'directory',
      classificationReason: 'regional_center_or_family_resource_directory',
      destinationTable: null,
    };
  }
  if (hasCue(sourceRole, [/appeals/, /complaint/])) {
    return {
      entityType: 'appeal_procedure',
      classificationReason: 'dds_appeal_or_complaint_page',
      destinationTable: null,
    };
  }
  if (hasCue(sourceRole, [/eligibility/, /individual_program_plan/, /work_services/, /job_seeker/, /parent_rights/, /transition/, /service_index/, /program_eligibility_referral/])) {
    return {
      entityType: 'policy_or_informational_page',
      classificationReason: 'dds_policy_or_info_page_not_agency_entity',
      destinationTable: null,
    };
  }
  if (hasCue(text, [/regional center/i]) && (record.phones?.length || record.addressLines?.length)) {
    return {
      entityType: 'agency',
      classificationReason: 'regional_center_contact_signals_present',
      destinationTable: 'state_resource_agencies',
    };
  }
  return {
    entityType: 'policy_or_informational_page',
    classificationReason: 'dd_page_without_agency_entity_signals',
    destinationTable: null,
  };
}

function classifyOfficeRecord(record, text) {
  const sourceRole = lower(record.sourceRole);
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  if (!/county_ihss_entry_from_cdss_directory/.test(sourceRole)) {
    return {
      entityType: 'directory',
      classificationReason: 'non_county_office_directory_source',
      destinationTable: null,
    };
  }
  const officeCue = hasCue(text, [/ihss/i, /in-home supportive services/i, /public authority/i, /social services agency/i, /adult services/i]);
  const titleOfficeCue = hasCue(title, [/ihss/i, /in-home supportive services/i, /public authority/i, /social services agency/i, /adult services/i, /aging services/i, /human services/i]);
  const genericCountyHomepage = hasCue(title, [/^home\b/i, /official website/i, /county, ca/i, /county of/i]) || genericTitle(title);
  if (officeCue && titleOfficeCue && !genericCountyHomepage && record.phones?.length && record.addressLines?.length) {
    return {
      entityType: 'office',
      classificationReason: 'local_office_contact_signals_present',
      destinationTable: 'county_offices',
    };
  }
  if (officeCue && (record.phones?.length || record.addressLines?.length)) {
    return {
      entityType: 'contact_page',
      classificationReason: 'county_service_page_needs_office_extraction',
      destinationTable: 'county_offices',
    };
  }
  return {
    entityType: 'directory',
    classificationReason: 'generic_county_homepage_not_office',
    destinationTable: null,
  };
}

function classifyEducationRecord(record, text) {
  const sourceRole = lower(record.sourceRole);
  if (hasCue(sourceRole, [/directory/])) {
    return {
      entityType: 'directory',
      classificationReason: 'education_directory_index_page',
      destinationTable: null,
    };
  }
  if (hasCue(sourceRole, [/rights/, /policy/, /laws/, /resources/, /family_involvement/, /secure_filing/])) {
    return {
      entityType: hasCue(sourceRole, [/secure_filing/]) ? 'appeal_procedure' : 'policy_or_informational_page',
      classificationReason: 'education_policy_or_appeal_page',
      destinationTable: null,
    };
  }
  return {
    entityType: 'contact_page',
    classificationReason: 'education_contact_like_page',
    destinationTable: null,
  };
}

function classifyProgramRecord(record, text) {
  const sourceRole = lower(record.sourceRole);
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  if (hasCue(sourceRole, [/directory/, /office_directory/, /local_intake_directory/]) || hasCue(text, [/county ihss offices/i, /\bdirectory\b/i, /\boffice locations\b/i])) {
    return {
      entityType: 'directory',
      classificationReason: 'directory_page_not_program',
      destinationTable: null,
    };
  }
  if (
    hasCue(sourceRole, [/guidance/, /rights/, /discrimination/, /policy/, /alternatives_to_conservatorship/, /places_to_find_support/, /conservatorship_overview/])
    || hasCue(text, [/disability discrimination/i, /procedural safeguards/i, /know your rights/i, /california courts/i, /self help guide/i, /conservatorship/i, /options to help someone/i, /places to find support/i])
  ) {
    return {
      entityType: 'policy_or_informational_page',
      classificationReason: 'policy_or_guidance_page_not_program',
      destinationTable: null,
    };
  }
  if (filenameLike(title) || genericTitle(title)) {
    return {
      entityType: 'policy_or_informational_page',
      classificationReason: 'generic_title_not_program_identity',
      destinationTable: null,
    };
  }
  if (hasCue(sourceRole, [/appeal/, /hearing/, /complaint/])) {
    return {
      entityType: 'appeal_procedure',
      classificationReason: 'appeal_or_hearing_process_page',
      destinationTable: null,
    };
  }
  if (hasCue(text, [/\bapply\b/i, /\bapplication\b/i, /\bprogram\b/i, /\beligib/i, /\bservices?\b/i])) {
    return {
      entityType: 'program',
      classificationReason: 'program_action_signals_present',
      destinationTable: 'programs',
    };
  }
  return {
    entityType: 'policy_or_informational_page',
    classificationReason: 'program_signals_too_weak',
    destinationTable: null,
  };
}

export function classifyCaliforniaEntity(record) {
  const text = aggregateText(record);
  if (record.gapFamily === 'forms_guides') return classifyFormRecord(record, text);
  if (record.gapFamily === 'advocates_legal') return classifyAdvocateRecord(record, text);
  if (record.gapFamily === 'dd_routing') return classifyDdRoutingRecord(record, text);
  if (record.gapFamily === 'medicaid_hhs_offices') return classifyOfficeRecord(record, text);
  if (record.gapFamily === 'education_routing') return classifyEducationRecord(record, text);
  if (['programs_benefits', 'waivers', 'general_gap_fill'].includes(record.gapFamily)) return classifyProgramRecord(record, text);
  return {
    entityType: 'policy_or_informational_page',
    classificationReason: 'fallback_non_entity_page',
    destinationTable: null,
  };
}

function extractProgramFields(record) {
  const title = normalized(record.h1s?.[0] || record.pageTitle || '');
  const description = normalized((record.paragraphs || []).slice(0, 8).join(' '));
  const actionLink = findLink(record, [/\bapply\b/i, /\bapplication\b/i, /\brequest\b/i]);
  return {
    fields: {
      name: evidence('name', !genericTitle(title) && !filenameLike(title) ? title : '', title, record.h1s?.[0] || record.pageTitle, 'heading'),
      description: evidence('description', description, description, 'paragraphs', 'paragraphs'),
      action_url: evidence('action_url', actionLink?.href || '', actionLink?.text || '', 'links', 'link'),
      source_url: evidence('source_url', record.sourceUrl, record.sourceUrl, 'source', 'metadata'),
    },
    requiredFields: ['name', 'description', 'action_url', 'source_url'],
  };
}

function extractOfficeFields(record) {
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  return {
    fields: {
      office_name: evidence('office_name', !genericTitle(title) ? title : '', title, record.h1s?.[0] || record.pageTitle, 'heading'),
      phone: evidence('phone', record.phones?.[0] || '', record.phones?.[0] || '', 'phones', 'contact'),
      address: evidence('address', record.addressLines?.[0] || '', record.addressLines?.[0] || '', 'addressLines', 'contact'),
      website: evidence('website', record.finalUrl || record.sourceUrl || '', record.finalUrl || record.sourceUrl || '', 'source', 'metadata'),
    },
    requiredFields: ['office_name', 'phone', 'address', 'website'],
  };
}

function extractDdAgencyFields(record) {
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  const eligibilityLink = findLink(record, [/\beligib/i, /\bapply\b/i, /\bintake\b/i]);
  const appealsLink = findLink(record, [/appeal/i, /complaint/i, /rights/i]);
  const serviceAreaLink = findLink(record, [/service area/i, /catchment/i, /map/i]);
  const servicesLink = findLink(record, [/services?/i, /supports?/i]);
  const officeLink = findLink(record, [/contact/i, /office/i]);
  const countiesParagraph = findParagraph(record, [/counties served/i, /service area/i, /catchment/i]);
  const countyValue = /california$/i.test(normalized(countiesParagraph)) ? '' : countiesParagraph;
  return {
    fields: {
      name: evidence('name', !genericTitle(title) ? title : '', title, record.h1s?.[0] || record.pageTitle, 'heading'),
      website: evidence('website', record.finalUrl || record.sourceUrl || '', record.finalUrl || record.sourceUrl || '', 'source', 'metadata'),
      phone: evidence('phone', record.phones?.[0] || '', record.phones?.[0] || '', 'phones', 'contact'),
      address: evidence('address', record.addressLines?.[0] || '', record.addressLines?.[0] || '', 'addressLines', 'contact'),
      counties_served: evidence('counties_served', countyValue, countiesParagraph, 'paragraphs', 'paragraphs'),
      catchment_boundaries: evidence('catchment_boundaries', countyValue, countiesParagraph || serviceAreaLink?.text || '', serviceAreaLink ? 'links' : 'paragraphs', serviceAreaLink ? 'link' : 'paragraphs'),
      eligibility_info_page: evidence('eligibility_info_page', eligibilityLink?.href || '', eligibilityLink?.text || '', 'links', 'link'),
      services_page: evidence('services_page', servicesLink?.href || '', servicesLink?.text || '', 'links', 'link'),
      appeals_info: evidence('appeals_info', appealsLink?.href || '', appealsLink?.text || '', 'links', 'link'),
      office_contact_directory: evidence('office_contact_directory', officeLink?.href || '', officeLink?.text || '', 'links', 'link'),
      early_start_contact: evidence('early_start_contact', '', '', '', 'missing'),
      intake_contact: evidence('intake_contact', '', '', '', 'missing'),
    },
    requiredFields: ['name', 'website', 'phone', 'address', 'eligibility_info_page', 'appeals_info'],
  };
}

function extractAdvocateFields(record, classification) {
  const name = normalized(record.familyExtraction?.organizationName || record.pageTitle || record.h1s?.[0] || '');
  const advocacyEvidence = findParagraph(record, [/\biep\b/i, /\b504\b/i, /special education/i, /education advocacy/i]);
  return {
    fields: {
      name: evidence('name', !genericTitle(name) ? name : '', name, record.h1s?.[0] || record.pageTitle, 'heading'),
      advocacy_scope: evidence('advocacy_scope', advocacyEvidence, advocacyEvidence, 'paragraphs', 'paragraphs'),
      phone: evidence('phone', record.phones?.[0] || '', record.phones?.[0] || '', 'phones', 'contact'),
      email: evidence('email', record.emails?.[0] || '', record.emails?.[0] || '', 'emails', 'contact'),
      website: evidence('website', record.finalUrl || record.sourceUrl || '', record.finalUrl || record.sourceUrl || '', 'source', 'metadata'),
      entity_type: evidence('entity_type', classification.entityType, classification.classificationReason, 'classification', 'rule'),
    },
    requiredFields: ['name', 'advocacy_scope', 'website'],
  };
}

function extractFormFields(record) {
  const lines = unique([
    ...(record.h1s || []),
    ...(record.paragraphs || []).slice(0, 20),
  ]).map((line) => normalized(line));
  const joined = lines.join('\n');
  const titleLine = lines.find((line) => !filenameLike(line) && /[A-Z]/.test(line) && line.length > 10 && !/agency|page \d/i.test(line) && /^[A-Z0-9 ()'’\-/:,&.]+$/.test(line)) || '';
  const formNumberMatch = joined.match(/\b([A-Z]{2,5}\s?-?\d{2,5}[A-Z]?)\s*\(([^)]+)\)/i) || joined.match(/\b([A-Z]{2,5}\s?-?\d{2,5}[A-Z]?)\b/i);
  const formNumber = formNumberMatch?.[1] || '';
  const revision = formNumberMatch?.[2] || '';
  const agencyLine = lines.find((line) => /department of social services|department of developmental services|department of health care services|health & human services/i.test(line)) || '';
  const whoUses = lines.find((line) => /to the applicant|applicant\/recipient|provider enrollment|recipient|student/i.test(line)) || '';
  const signer = lines.find((line) => /sign and date|signature of|signed by/i.test(line)) || '';
  const submit = lines.find((line) => /submit|received within|send to|county office|portal|upload/i.test(line)) || '';
  return {
    fields: {
      title: evidence('title', titleLine, titleLine, 'paragraphs', 'paragraphs'),
      form_number: evidence('form_number', formNumber, formNumberMatch?.[0] || '', 'paragraphs', 'paragraphs'),
      official_download_url: evidence('official_download_url', record.sourceUrl, record.sourceUrl, 'source', 'metadata'),
      issuing_agency: evidence('issuing_agency', agencyLine, agencyLine, 'paragraphs', 'paragraphs'),
      who_uses_it: evidence('who_uses_it', whoUses, whoUses, 'paragraphs', 'paragraphs'),
      who_signs_it: evidence('who_signs_it', signer, signer, 'paragraphs', 'paragraphs'),
      where_to_send_it: evidence('where_to_send_it', submit, submit, 'paragraphs', 'paragraphs'),
      revision_date: evidence('revision_date', revision, formNumberMatch?.[0] || '', 'paragraphs', 'paragraphs'),
    },
    requiredFields: ['title', 'form_number', 'official_download_url', 'issuing_agency', 'who_uses_it', 'who_signs_it', 'where_to_send_it'],
  };
}

function extractEducationFields(record) {
  const title = normalized(record.pageTitle || record.h1s?.[0] || '');
  return {
    fields: {
      name: evidence('name', !genericTitle(title) ? title : '', title, record.h1s?.[0] || record.pageTitle, 'heading'),
      phone: evidence('phone', record.phones?.[0] || '', record.phones?.[0] || '', 'phones', 'contact'),
      email: evidence('email', record.emails?.[0] || '', record.emails?.[0] || '', 'emails', 'contact'),
      website: evidence('website', record.finalUrl || record.sourceUrl || '', record.finalUrl || record.sourceUrl || '', 'source', 'metadata'),
    },
    requiredFields: ['name', 'phone', 'website'],
  };
}

export function extractFieldEvidence(record, classification) {
  if (classification.destinationTable === 'state_resource_agencies') return extractDdAgencyFields(record);
  if (classification.destinationTable === 'county_offices') return extractOfficeFields(record);
  if (classification.destinationTable === 'forms_and_guides') return extractFormFields(record);
  if (classification.destinationTable === 'iep_advocates') return extractAdvocateFields(record, classification);
  if (classification.destinationTable === 'programs') return extractProgramFields(record);
  if (classification.destinationTable === 'regional_education_agencies') return extractEducationFields(record);
  return { fields: {}, requiredFields: [] };
}

function confidenceFromAssessment({ classification, requiredCoverage, evidenceCoverage, authority, roleMatch, jurisdictionMatch, defaultedCount }) {
  const authorityScore = /official_(state|county|federal|regional_center)|state_protection/i.test(authority) ? 0.2 : 0.12;
  const classificationScore = classification.destinationTable ? 0.28 : 0.12;
  const roleScore = roleMatch ? 0.2 : 0.05;
  const completenessScore = requiredCoverage * 0.2;
  const evidenceScore = evidenceCoverage * 0.1;
  const jurisdictionScore = jurisdictionMatch ? 0.1 : 0.04;
  let score = classificationScore + authorityScore + roleScore + completenessScore + evidenceScore + jurisdictionScore;
  if (defaultedCount > 0) score = Math.min(score, 0.5);
  return Number(Math.min(score, 1).toFixed(2));
}

export function evaluateCaliforniaSemanticRecord(record) {
  const text = aggregateText(record);
  const classification = classifyCaliforniaEntity(record);
  const { fields, requiredFields } = extractFieldEvidence(record, classification);
  const fieldEntries = Object.values(fields);
  const coveredRequired = requiredFields.filter((field) => fields[field]?.covered).length;
  const requiredCoverage = requiredFields.length ? coveredRequired / requiredFields.length : 0;
  const evidenceCovered = fieldEntries.filter((entry) => entry.covered && normalized(entry.evidenceText)).length;
  const evidenceCoverage = fieldEntries.length ? evidenceCovered / fieldEntries.length : 0;
  const roleMatch = classification.classificationReason !== 'fallback_non_entity_page'
    && !/not_iep_advocate|not_agency_entity|generic_county_homepage/.test(classification.classificationReason);
  const jurisdictionMatch = record.stateId === 'california';
  const defaultedCount = requiredFields.filter((field) => !fields[field]?.covered).length;
  const supportedStageTables = new Set([
    'state_resource_agencies',
    'county_offices',
    'forms_and_guides',
    'iep_advocates',
    'programs',
  ]);

  let status = 'rejected';
  let destinationTable = classification.destinationTable;
  const reasons = [];

  if (!destinationTable) {
    status = classification.entityType === 'program' || classification.entityType === 'office' || classification.entityType === 'agency' ? 'enrichment_required' : 'unsupported';
    reasons.push('no_supported_destination_for_entity_type');
  } else if (!supportedStageTables.has(destinationTable)) {
    status = 'unsupported';
    reasons.push('destination_table_not_enabled_for_ca_v4_staging');
  } else if (classification.destinationTable === 'iep_advocates' && classification.entityType !== 'individual_advocate' && classification.entityType !== 'advocate_organization') {
    status = 'rejected';
    reasons.push('entity_type_mismatch_for_iep_advocates');
  } else if (classification.destinationTable === 'programs' && classification.entityType !== 'program') {
    status = 'rejected';
    reasons.push('entity_type_mismatch_for_programs');
  } else if (classification.destinationTable === 'county_offices' && classification.entityType !== 'office') {
    status = 'enrichment_required';
    reasons.push('office_entity_not_fully_extracted');
  } else if (classification.destinationTable === 'state_resource_agencies' && classification.entityType !== 'agency') {
    status = 'rejected';
    reasons.push('entity_type_mismatch_for_state_resource_agencies');
  } else if (classification.destinationTable === 'forms_and_guides' && classification.entityType !== 'form') {
    status = 'rejected';
    reasons.push('entity_type_mismatch_for_forms');
  } else if (classification.destinationTable === 'regional_education_agencies') {
    status = 'unsupported';
    reasons.push('directory_or_policy_pages_not_regional_agency_entities');
  }

  if (!reasons.length) {
    if (defaultedCount > 0) {
      status = 'enrichment_required';
      reasons.push('required_fields_missing_or_unproven');
    } else {
      status = 'stage_ready';
    }
  }

  if (classification.destinationTable === 'programs' && genericTitle(fields.name?.value || record.pageTitle || '')) {
    status = 'rejected';
    reasons.push('page_title_alone_not_valid_program_identity');
  } else if (classification.classificationReason === 'generic_title_not_program_identity' && !reasons.includes('page_title_alone_not_valid_program_identity')) {
    reasons.push('page_title_alone_not_valid_program_identity');
  }
  if (classification.destinationTable === 'forms_and_guides' && (!fields.who_signs_it?.covered || !fields.where_to_send_it?.covered)) {
    status = 'enrichment_required';
    if (!reasons.includes('form_missing_signer_or_submission_route')) reasons.push('form_missing_signer_or_submission_route');
  }
  if (classification.destinationTable === 'state_resource_agencies') {
    const repeatedUrlCount = ['eligibility_info_page', 'services_page', 'appeals_info']
      .map((field) => fields[field]?.value || '')
      .filter(Boolean);
    if (repeatedUrlCount.length > 1 && unique(repeatedUrlCount).length === 1) {
      status = 'rejected';
      reasons.push('same_url_reused_for_multiple_semantic_fields');
    }
    if (lower(fields.catchment_boundaries?.value || '') === 'california') {
      status = 'rejected';
      reasons.push('statewide_value_used_as_catchment_boundaries');
    }
    const catchmentEvidence = normalized(fields.catchment_boundaries?.evidenceText || '');
    if (/california/i.test(catchmentEvidence) && /service area|catchment|counties served/i.test(catchmentEvidence)) {
      status = 'rejected';
      if (!reasons.includes('statewide_value_used_as_catchment_boundaries')) reasons.push('statewide_value_used_as_catchment_boundaries');
    }
    if (fields.intake_contact?.covered && !/intake|apply|application/i.test(text)) {
      status = 'rejected';
      reasons.push('intake_contact_not_role_specific');
    }
  }

  if (classification.destinationTable === 'iep_advocates' && !hasCue(text, [/\biep\b/i, /\b504\b/i, /special education/i, /education advocacy/i])) {
    status = 'unsupported';
    reasons.push('general_legal_help_page_not_iep_advocate');
    destinationTable = 'referral_resources';
  }

  const confidenceScore = confidenceFromAssessment({
    classification,
    requiredCoverage,
    evidenceCoverage,
    authority: record.authority || '',
    roleMatch,
    jurisdictionMatch,
    defaultedCount,
  });

  return {
    recordId: record.recordId,
    family: record.gapFamily,
    entityType: classification.entityType,
    destinationTable,
    semanticStatus: status,
    classificationReason: classification.classificationReason,
    confidenceScore,
    reasons: unique(reasons),
    requiredFieldCount: requiredFields.length,
    requiredFieldCoveredCount: coveredRequired,
    requiredFieldCompleteness: Number(requiredCoverage.toFixed(2)),
    fieldEvidenceCoverage: Number(evidenceCoverage.toFixed(2)),
    unsupportedDefaultedFieldCount: defaultedCount,
    fieldEntries,
  };
}
