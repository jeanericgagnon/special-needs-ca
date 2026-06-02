/**
 * Structured Database Schema Declarations (JSDoc Type Definitions)
 * This schema details all 26 entities powering the California Disability benefits database system.
 */

/**
 * 1. Program
 * Represents a federal, national, or state-wide support program.
 * @typedef {Object} Program
 * @property {string} id - Unique identifier (e.g., 'ihss-for-children', 'early-start')
 * @property {string} name - Official program name
 * @property {string} description - Brief plain-English description of what it is
 * @property {string} whoItIsFor - Plain-English explanation of target user
 * @property {string} whoMightQualify - Plain-English overview of qualification criteria
 * @property {string} officialSourceUrl - Main official source page URL
 * @property {string} category - 'federal' | 'state' | 'county'
 * @property {string[]} relatedProgramIds - IDs of related programs to check
 * @property {number} confidenceScore - Trust level from 1 to 5 (or percentage)
 * @property {string} lastVerifiedDate - ISO Date format (YYYY-MM-DD)
 */

/**
 * 2. ProgramEligibilityRule
 * Represents rules that trigger recommendations for a program.
 * @typedef {Object} ProgramEligibilityRule
 * @property {string} id - Unique identifier
 * @property {string} programId - Foreign key referencing Program.id
 * @property {Object} criteria - Match conditions
 * @property {number[]} criteria.ageRange - [minAgeYears, maxAgeYears]
 * @property {string[]} criteria.requiredConditions - List of condition names/tags that match
 * @property {string[]} criteria.functionalNeeds - List of functional needs that match
 * @property {string[]} criteria.insuranceStatus - ['medi-cal', 'private', 'any']
 * @property {string[]} criteria.schoolStatus - ['iep', '504', 'early-start', 'any']
 * @property {string} triggerReason - Clear explanation of why this was matched
 */

/**
 * 3. ProgramDocumentRequirement
 * Documents a family needs to submit to apply.
 * @typedef {Object} ProgramDocumentRequirement
 * @property {string} id - Unique identifier
 * @property {string} programId - Foreign key referencing Program.id
 * @property {string} name - Document name (e.g., 'Diagnosis Report', 'Doctor Letter')
 * @property {string} description - Why it is needed and how to obtain it
 * @property {boolean} isMandatory - True if strictly required
 */

/**
 * 4. ProgramApplicationStep
 * Chronological steps to complete the application.
 * @typedef {Object} ProgramApplicationStep
 * @property {number} stepNumber - Order index (1-indexed)
 * @property {string} programId - Foreign key referencing Program.id
 * @property {string} title - Step title
 * @property {string} actionDescription - What the family needs to do
 * @property {string} applyUrlOrContact - Where to submit or who to contact
 * @property {string} templateId - Optional template for appeal or application letters
 */

/**
 * 5. ProgramAppealInfo
 * Guidelines on what to do if denied.
 * @typedef {Object} ProgramAppealInfo
 * @property {string} programId - Foreign key referencing Program.id
 * @property {string} deadlineDays - Timeline to file an appeal (e.g. '90 days')
 * @property {string} appealSteps - Step-by-step description of filing an appeal
 * @property {string} denialReasons - Common reasons for denial (e.g., 'income cap', 'no medical necessity')
 * @property {string} appealFormName - Official name/number of the appeal form (e.g., 'SOC 832')
 * @property {string} officialAppealSourceUrl - URL for downloading forms
 */

/**
 * 6. County
 * Represents one of the 58 California counties.
 * @typedef {Object} County
 * @property {string} id - Lowercase slug (e.g., 'los-angeles', 'orange')
 * @property {string} name - Official county name (e.g., 'Los Angeles')
 * @property {string} website - Official county government portal
 */

/**
 * 7. CountyOffice
 * County-specific department offices handling applications.
 * @typedef {Object} CountyOffice
 * @property {string} id - Unique identifier
 * @property {string} countyId - Foreign key referencing County.id
 * @property {string} programId - Foreign key referencing Program.id (e.g. 'ihss-for-children')
 * @property {string} officeName - Name of the specific office (e.g., 'LA County DPSS - IHSS Metro')
 * @property {string} address - Physical address
 * @property {string} phone - Direct contact number
 * @property {string} email - Email address
 * @property {string} website - Direct program landing page
 */

/**
 * 8. RegionalCenter
 * One of the 21 California Regional Centers.
 * @typedef {Object} RegionalCenter
 * @property {string} id - Unique slug (e.g., 'lanterman', 'golden-gate')
 * @property {string} name - Official Regional Center name
 * @property {string[]} countiesServed - Counties in catchment
 * @property {string} website - Main website
 * @property {string} intakePhone - Phone number for intake department
 * @property {string} earlyStartContact - Contact info for birth-to-3 early intervention
 * @property {string} selfDeterminationContact - Contact info for Self-Determination Program
 * @property {string} eligibilityInfoPage - URL explaining Lanterman Act intake
 * @property {string} servicesPage - URL of services list
 * @property {string} appealPage - URL for appeals and complaints page
 * @property {string} lastVerifiedDate - ISO Date format (YYYY-MM-DD)
 */

/**
 * 9. SELPA
 * Special Education Local Plan Area.
 * @typedef {Object} SELPA
 * @property {string} id - Slug (e.g., 'orange-county-selpa')
 * @property {string} name - Official SELPA name
 * @property {string[]} countiesServed - Counties served
 * @property {string} website - Official site
 */

/**
 * 10. SchoolDistrict
 * Local school district for IEP management.
 * @typedef {Object} SchoolDistrict
 * @property {string} id - Unique ID
 * @property {string} countyId - Foreign key referencing County.id
 * @property {string} name - School district name
 * @property {string} specEdContactPhone - Special education department number
 * @property {string} specEdContactEmail - Special education department email
 * @property {string} website - District website
 */

/**
 * 11. ResourceProvider
 * A specific therapist, clinic, doctor, or respite agency.
 * @typedef {Object} ResourceProvider
 * @property {string} id - Unique ID
 * @property {string} name - Provider name
 * @property {string[]} categories - 'respite' | 'speech-therapy' | 'ot' | 'pt' | 'aba' | 'advocacy'
 * @property {string} countyId - Local county
 * @property {string} phone - Contact phone
 * @property {string} email - Contact email
 * @property {string} address - Location
 * @property {boolean} acceptsMediCal - True if Medi-Cal is accepted
 * @property {string[]} regionalCenterVendorIds - Vendor IDs for Regional Centers (if vended)
 */

/**
 * 12. NonprofitOrganization
 * Support groups, Down syndrome or autism associations.
 * @typedef {Object} NonprofitOrganization
 * @property {string} id - Slug
 * @property {string} name - Organization Name (e.g., 'Down Syndrome Association of Orange County')
 * @property {string} countyId - Primary county
 * @property {string} website - Main site
 * @property {string} phone - Contact phone
 * @property {string} focusCondition - Condition name it focuses on (e.g., 'Down syndrome')
 */

/**
 * 13. Condition
 * Represents a disability, developmental delay, or complexity in the taxonomy.
 * @typedef {Object} Condition
 * @property {string} id - Slug (e.g., 'down-syndrome', 'autism')
 * @property {string} name - Official condition name
 * @property {string[]} aliases - Diagnostic aliases and synonyms
 * @property {string} parentFriendlyExplanation - Easy-to-understand explanation
 * @property {Object} categoryMappings - Official system relevance mapping
 * @property {boolean} categoryMappings.regionalCenterRelevance - True if matches developmental disability criteria
 * @property {boolean} categoryMappings.iepRelevance - True if eligible for special education category
 * @property {boolean} categoryMappings.ccsRelevance - True if CCS medically eligible
 * @property {boolean} categoryMappings.ssiRelevance - True if child SSI eligible
 * @property {boolean} categoryMappings.calAbleRelevance - True if qualifies for ABLE account
 * @property {string[]} commonFunctionalNeeds - Common functional challenges
 * @property {string[]} commonServices - Services recommended
 * @property {string[]} commonProgramIds - Programs to display first
 * @property {string} ageSpecificNotes - Notes on developmental milestones/transition points
 * @property {string} sourceUrl - Source link
 * @property {string} lastVerifiedDate - ISO Date format (YYYY-MM-DD)
 */

/**
 * 14. FunctionalNeed
 * The granular list of child functional categories.
 * @typedef {Object} FunctionalNeed
 * @property {string} id - Slug (e.g., 'protective-supervision', 'speech-therapy')
 * @property {string} name - Plain English name
 * @property {string} category - 'communication' | 'mobility' | 'daily-living' | 'medical' | 'behavioral' | 'education' | 'planning'
 * @property {string} description - Brief summary
 * @property {string[]} programTriggers - Program IDs this need commonly points to
 */

/**
 * 15. AgeBand
 * Developmental age groups.
 * @typedef {Object} AgeBand
 * @property {string} id - 'prenatal-newborn' | '0-3' | '3-5' | 'k-12' | '14-16' | '16-18' | '18plus'
 * @property {string} label - Display label
 * @property {string} description - Development milestones and legal pivots
 */

/**
 * 16. InsuranceType
 * Insurance categories.
 * @typedef {Object} InsuranceType
 * @property {string} id - 'medi-cal' | 'private' | 'medi-cal-managed-care' | 'none'
 * @property {string} label - Display label
 */

/**
 * 17. FamilyCase
 * Represents a saved case setup for a family/account.
 * @typedef {Object} FamilyCase
 * @property {string} id - Case ID
 * @property {string} email - Caregiver email
 * @property {string} createdAt - Date created
 */

/**
 * 18. ChildProfile
 * The structured profile of a child entered by a parent.
 * @typedef {Object} ChildProfile
 * @property {string} id - Child ID
 * @property {string} nickname - Nickname / First name
 * @property {string} dob - Date of Birth (YYYY-MM-DD)
 * @property {string} countyId - Primary residence county
 * @property {string} zipCode - ZIP Code
 * @property {string[]} conditionIds - Selected diagnoses
 * @property {string[]} suspectedConditionIds - Suspected undiagnosed conditions
 * @property {string[]} functionalNeedIds - Selected functional challenges
 * @property {string[]} currentServiceIds - Programs currently enrolled in
 * @property {string} insuranceType - 'medi-cal' | 'private' | 'both' | 'none'
 * @property {string} schoolStatus - 'iep' | '504' | 'none' | 'early-start'
 * @property {string} languagePreference - 'english' | 'spanish' | 'other'
 * @property {string} caregiverNotes - Custom notes
 */

/**
 * 19. CaseProgramStatus
 * Links a child profile to a program's application progress.
 * @typedef {Object} CaseProgramStatus
 * @property {string} id - Unique ID
 * @property {string} childId - Foreign key referencing ChildProfile.id
 * @property {string} programId - Foreign key referencing Program.id
 * @property {string} status - 'recommended' | 'not-started' | 'gathering-documents' | 'applied' | 'waiting' | 'approved' | 'denied' | 'appeal-pending' | 'active' | 'renewal-due' | 'not-relevant' | 'revisit-later'
 * @property {string} updatedAt - ISO Date format (YYYY-MM-DD)
 */

/**
 * 20. DocumentChecklistItem
 * Tracking document collection progress.
 * @typedef {Object} DocumentChecklistItem
 * @property {string} id - Unique ID
 * @property {string} childId - Foreign key referencing ChildProfile.id
 * @property {string} documentName - Name of document
 * @property {boolean} isCollected - Checkbox state
 * @property {string} programId - Related program ID (optional)
 * @property {string} fileMockUrl - Simulated file pathway (e.g. '/mock-uploads/report.pdf')
 */

/**
 * 21. Reminder
 * Actionable alerts.
 * @typedef {Object} Reminder
 * @property {string} id - Unique ID
 * @property {string} childId - Foreign key referencing ChildProfile.id
 * @property {string} programId - Related program
 * @property {string} title - Reminder headline
 * @property {string} dueDate - Deadline ISO Date format
 * @property {boolean} isCompleted - Done state
 */

/**
 * 22. Source
 * Citation tracker.
 * @typedef {Object} Source
 * @property {string} id - Unique ID
 * @property {string} programId - Related program
 * @property {string} url - Official URL
 * @property {string} type - 'official' | 'nonprofit' | 'provider' | 'scraped'
 * @property {string} confidenceRating - 'high' | 'medium' | 'low'
 */

/**
 * 23. SourceVerification
 * Action log showing who verified what.
 * @typedef {Object} SourceVerification
 * @property {string} id - Unique ID
 * @property {string} sourceId - Related Source.id
 * @property {string} verifiedBy - Admin name
 * @property {string} verifiedDate - Date checked
 * @property {string} notes - Verification comments
 */

/**
 * 24. UserSubmittedResource
 * Resource suggestions submitted by directory users.
 * @typedef {Object} UserSubmittedResource
 * @property {string} id - Unique ID
 * @property {string} providerName - Suggested name
 * @property {string} category - Care type
 * @property {string} countyId - Primary county
 * @property {string} phone - Provider phone
 * @property {string} website - Website
 * @property {string} status - 'pending' | 'approved' | 'rejected'
 * @property {string} submittedAt - Date submitted
 */

/**
 * 25. CoverageGap
 * Track known data gaps (missing school districts/local offices).
 * @typedef {Object} CoverageGap
 * @property {string} id - Unique ID
 * @property {string} countyId - County slug
 * @property {string} gapCategory - e.g., 'SELPA', 'County CCS Office', 'Early Start intake'
 * @property {string} description - Summary of what data is missing
 * @property {string} severity - 'critical' | 'moderate' | 'low'
 */

/**
 * 26. VerificationQueueItem
 * Flagged stale pages requiring manual audit.
 * @typedef {Object} VerificationQueueItem
 * @property {string} id - Unique ID
 * @property {string} recordType - 'program' | 'county' | 'regional-center' | 'condition' | 'need'
 * @property {string} recordId - Unique slug of the record
 * @property {string} recordName - Display name of the page
 * @property {string} reason - e.g., 'Stale record > 180 days', 'Broken source link'
 * @property {number} verificationLevel - Level 1 (official) to Level 6 (archived)
 */

export const SCHEMA_ENTITIES = [
  'Program', 'ProgramEligibilityRule', 'ProgramDocumentRequirement', 'ProgramApplicationStep',
  'ProgramAppealInfo', 'County', 'CountyOffice', 'RegionalCenter', 'SELPA', 'SchoolDistrict',
  'ResourceProvider', 'NonprofitOrganization', 'Condition', 'FunctionalNeed', 'AgeBand',
  'InsuranceType', 'FamilyCase', 'ChildProfile', 'CaseProgramStatus', 'DocumentChecklistItem',
  'Reminder', 'Source', 'SourceVerification', 'UserSubmittedResource', 'CoverageGap',
  'VerificationQueueItem'
];
