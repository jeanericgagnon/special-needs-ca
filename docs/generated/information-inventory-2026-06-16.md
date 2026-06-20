# Information Inventory

Generated: 2026-06-16

DB audited: /Users/ericgagnon/Documents/Ablefull/special-needs-ca/frontend/ca_disability_navigator.db

This artifact inventories the kinds of information the repo currently supports, with subtype values pulled from the checked-in schema, DB, and controlled frontend vocabularies.

## Summary

- Major layers: 13
- Indexable states in public truth contract: 50
- Verified diagnosis slugs in public truth contract: 6
- Directory service tags: 22
- Directory serving tags: 12

## Geography and Coverage

- Layer ID: geography_coverage
- Subtypes: states; counties; regional center county coverage; regional education county coverage; advocate county coverage; virtual service area county coverage
- Table `states`: 50 rows, 3 columns
- Table `counties`: 3094 rows, 6 columns
- Table `regional_center_counties`: 6320 rows, 2 columns
- Table `selpa_counties`: 833 rows, 2 columns
- Table `iep_advocate_counties`: 21642 rows, 2 columns
- Table `virtual_service_area_counties`: 0 rows, 2 columns
- Notes:
  - Coverage junctions prevent fake county-local duplication.

## Programs, Benefits, and Application Knowledge

- Layer ID: programs_benefits
- Subtypes: program definitions; eligibility rules; required and optional documents; application steps; appeal rules; waitlists and interest lists
- Table `programs`: 507 rows, 16 columns
- Table `program_eligibility_rules`: 303 rows, 9 columns
- Table `program_document_requirements`: 502 rows, 5 columns
- Table `program_application_steps`: 992 rows, 6 columns
- Table `program_appeal_info`: 451 rows, 6 columns
- Table `program_waitlists`: 165 rows, 13 columns
- Controlled values:
  - programCategories: federal, state
  - insuranceStatuses: any
  - schoolStatuses: any

## Public Administrative and Education Routing

- Layer ID: public_routing_education
- Subtypes: county offices; state DD or IDD routing agencies; regional education agencies; school districts
- Table `county_offices`: 3678 rows, 16 columns
- Table `state_resource_agencies`: 636 rows, 25 columns
- Table `regional_education_agencies`: 313 rows, 14 columns
- Table `school_districts`: 3117 rows, 18 columns
- Controlled values:
  - countyOfficePrograms: ak-medicaid, al-medicaid, ar-medicaid, az-medicaid, california-childrens-services, co-medicaid, ct-medicaid, de-medicaid, fl-medicaid, fl-medicaid-dcf, ga-medicaid, hi-medicaid, ia-medicaid, id-medicaid, ihss-for-children, il-medicaid, in-medicaid, ks-medicaid, ky-medicaid, la-medicaid, ma-medicaid, md-medicaid, me-medicaid, medi-cal-for-kids-and-teens, mi-medicaid, mn-medicaid, mo-medicaid, ms-medicaid, mt-medicaid, nc-medicaid, nd-medicaid, ne-medicaid, nh-medicaid, nj-medicaid, nm-medicaid, nv-medicaid, ny-medicaid, oh-medicaid, ok-medicaid, or-medicaid, pa-medicaid, ri-medicaid, sc-medicaid, sd-medicaid, tn-medicaid, tx-mdcp, tx-medicaid, ut-medicaid, va-medicaid, vt-medicaid, wa-medicaid, wi-medicaid, wv-medicaid, wy-medicaid
  - stateAgencyTypes: apd_office, cbdd, cfc, county_ae, dbhdd_office, dd_intake, ddro, developmental_services_agency, early_intervention, early_steps, eci, isc, lidda, regional_center
  - regionalEducationAgencyTypes: boces, cfc, county-technical-district, esc, isc, iu, resa, roe, selpa, special-services-district, state-special-education-support

## Local Directory Layers

- Layer ID: local_directories
- Subtypes: resource providers; nonprofit organizations; IEP advocates
- Table `resource_providers`: 36 rows, 54 columns
- Table `nonprofit_organizations`: 29499 rows, 51 columns
- Table `iep_advocates`: 3573 rows, 59 columns
- Controlled values:
  - providerCategories: Autism, autism_clinic, card_center, Clinical, Developmental, developmental_clinic, developmental_pediatrics, diagnostic_center, Education, Speech, Therapy
  - nonprofitFocusConditions: adhd, All Disabilities, any, autism, Autism Spectrum Disorder, autism-spectrum-disorder, cerebral-palsy, developmental_disabilities, developmental-delay, down_syndrome, down-syndrome, dyslexia, epilepsy, hearing-loss-deafness, Intellectual and Developmental Disabilities, intellectual_developmental_disability, intellectual-disability
  - advocateSpecialties: 504, 504 Plan, ABA Clinic, ADHD, ARD, ARD Advocacy, Autism, Autism Therapy, Behavioral Needs, Cerebral Palsy, CSE Assistance, DBHDD Appeals, Deaf-Blindness, DODD Appeals, Down Syndrome, Due Process, Dyslexia, Early Steps, ECI Support, Emotional Disturbance, Epilepsy, ESE Advocacy, ESE Attorney, ESE Dispute Resolution, ESE Law, FDLRS Liaison, GAPP Navigation, General Advocacy, Hearing Loss, Help Me Grow Routing, HSP Appeals, iBudget, iBudget Appeal, IDD Advocacy, IEP, IEP Advocate, IEP Consultant, IEP Navigation, Intellectual Disability, ISBE Appeals, Learning Disabilities, Legal Aid, Multiple Disabilities, Occupational therapy, ODP Appeals, ODP Resource Routing, OPWDD Appeals, Orthopedic Impairment, Other Health Impairment, Parent Coach, Pediatric Therapies, Physical therapy, Protection & Advocacy, Special Ed Law, Special Education, Special Education Attorney, Special Education Law, Speech & Language, Speech therapy, Spina Bifida, Support Groups, Vision Impairment

## Directory Foundation Metadata

- Layer ID: directory_foundation
- Subtypes: service taxonomy; audience taxonomy; availability and capacity; next-step and intake; languages and accessibility; claim groundwork; trust and freshness
- Table `resource_providers`: 36 rows, 54 columns
- Table `nonprofit_organizations`: 29499 rows, 51 columns
- Table `iep_advocates`: 3573 rows, 59 columns
- Controlled values:
  - serviceTags: food, housing, home_mods, utilities, supplies, transport, therapy, behavioral_health, benefits, grants, respite, in_home_support, caregiving, early_intervention, special_education, iep_advocacy, vocational_rehab, transition, guardianship, trusts, legal_aid, appeals
  - servingTags: down_syndrome, autism, idd_dd, early_childhood, school_age, transition_age, parents_caregivers, medicaid_waiver_families, iep_families, non_english_speakers, rural_families, low_income_families
  - availabilityStatuses: available, limited, near_capacity, waitlist, full, out_of_funding, temporarily_closed, unknown
  - nextStepTypes: call, email, apply_online, referral, schedule, walk_in, download_form, contact_form, see_instructions, unknown
  - fundingStatuses: funded, grant_funded, insurance_only, medicaid_only, private_pay, scholarships_available, out_of_funding, unknown
  - claimStatuses: unclaimed, pending_review, claimed, verified_affiliation, changes_submitted, changes_approved
  - publicVerificationStatuses: official_verified, verified, human_verified, source_listed
- Notes:
  - Provider accessibility booleans with true signal: accepts_medi_cal 27/36; interpreter_available 0/36; asl_available 0/36; wheelchair_accessible 0/36; virtual_services 0/36; in_person_services 0/36; home_visits 0/36; transportation_help 0/36
  - Nonprofit accessibility booleans with true signal: interpreter_available 0/29499; asl_available 0/29499; wheelchair_accessible 0/29499; virtual_services 0/29499; in_person_services 0/29499; home_visits 0/29499; transportation_help 0/29499
  - Advocate accessibility booleans with true signal: interpreter_available 0/3573; asl_available 0/3573; wheelchair_accessible 0/3573; virtual_services 0/3573; in_person_services 0/3573; home_visits 0/3573; transportation_help 0/3573

## Normalization Foundation

- Layer ID: normalization
- Subtypes: canonical organizations; organization to program links; service locations; office locations; virtual service areas
- Table `organizations`: 0 rows, 15 columns
- Table `organization_program_links`: 0 rows, 15 columns
- Table `service_locations`: 0 rows, 21 columns
- Table `office_locations`: 0 rows, 20 columns
- Table `virtual_service_areas`: 0 rows, 15 columns
- Notes:
  - This is a landing zone for future org -> program -> location normalization, not yet the main public rendering layer.

## Disability Knowledge and Reference Layer

- Layer ID: disability_knowledge
- Subtypes: conditions; functional needs; age bands; insurance types
- Table `conditions`: 78 rows, 12 columns
- Table `functional_needs`: 18 rows, 5 columns
- Table `age_bands`: 0 rows, 3 columns
- Table `insurance_types`: 0 rows, 2 columns
- Controlled values:
  - conditionNames: Aicardi Syndrome, Angelman Syndrome, Apraxia of Speech, Arthrogryposis Multiplex Congenita, Attention Deficit Hyperactivity Disorder (ADHD), Auditory Dyslexia, Auditory Processing Disorder (APD), Autism Spectrum Disorder (ASD), Cerebral Palsy (CP), Chronic Kidney Disease (CKD), Congenital Heart Disease (CHD), Cortical Visual Impairment (CVI), Cri-du-Chat Syndrome, Cystic Fibrosis (CF), Deaf-Blindness, Developmental Coordination Disorder (Dyspraxia), Developmental Delay (CA Education Code), DiGeorge Syndrome (22q11.2 deletion), Down Syndrome (Trisomy 21), Dravet Syndrome, Dyscalculia, Dysgraphia, Dyslexia, Emotional Disturbance (ED), Epilepsy / Seizure Disorder, Executive Function Disorder, Fragile X Syndrome, Gastrostomy (G-tube) Dependency, Global Developmental Delay (GDD), Hearing Loss / Deafness, Hydrocephalus, Intellectual Disability (ID), Juvenile Idiopathic Arthritis (JIA), Klinefelter Syndrome (XXY), Landau-Kleffner Syndrome, Lennox-Gastaut Syndrome, Microcephaly, Mitochondrial Disease, Multiple Disabilities, Muscular Dystrophy (Becker), Muscular Dystrophy (Duchenne), Neurofibromatosis Type 1 (NF1), Neurofibromatosis Type 2 (NF2), Nonverbal Learning Disability (NVLD), Noonan Syndrome, Oppositional Defiant Disorder (ODD), Optic Nerve Hypoplasia (ONH), Orthopedic Impairment, Other Health Impairment (OHI), Pediatric Cancer / Leukemia, Pervasive Developmental Disorder (PDD-NOS), Prader-Willi Syndrome, Rabin-Kopp Syndrome, Rasmussen Encephalitis, Reactive Attachment Disorder (RAD), Retinopathy of Prematurity (ROP), Rett Syndrome, Sensory Processing Disorder (SPD), Severe Hemophilia, Severe Persistent Asthma, Short Bowel Syndrome, Sickle Cell Disease, Social Communication Disorder, Specific Learning Disability (SLD), Speech and Language Delay, Spina Bifida, Spinal Muscular Atrophy (SMA), Tourette Syndrome, Tracheostomy Dependency, Traumatic Brain Injury (TBI), Trisomy 13 (Patau Syndrome), Trisomy 18 (Edwards Syndrome), Turner Syndrome, Type 1 Diabetes, Usher Syndrome, Ventilator Dependency, Visual Impairment / Blindness, Williams Syndrome
  - functionalNeedCategories: behavioral, communication, daily-living, education, medical, mobility, planning

## Family and Navigator-Adjacent Workflow Data

- Layer ID: family_case
- Subtypes: family cases; child profiles; child condition mappings; child need mappings; program tracking; document tracking; reminders; waiver vault
- Table `family_cases`: 1 rows, 3 columns
- Table `child_profiles`: 1 rows, 10 columns
- Table `child_profile_conditions`: 1 rows, 2 columns
- Table `child_profile_needs`: 2 rows, 2 columns
- Table `case_program_statuses`: 0 rows, 5 columns
- Table `document_checklist_items`: 0 rows, 6 columns
- Table `reminders`: 0 rows, 6 columns
- Table `child_waivers`: 0 rows, 10 columns

## Family Support, Planning, and Collaboration

- Layer ID: support_planning_collaboration
- Subtypes: safety incidents; parent declarations; caregiver profiles; transition tasks; caregiver self-care logs; child coordinators; clinical documents; consultation threads and messages; shared portal tokens; IEP accommodations and goals; respite assessments
- Table `safety_incidents`: 0 rows, 7 columns
- Table `parent_declarations`: 0 rows, 3 columns
- Table `caregiver_profiles`: 0 rows, 5 columns
- Table `child_transition_tasks`: 0 rows, 2 columns
- Table `caregiver_selfcare_logs`: 0 rows, 8 columns
- Table `child_coordinators`: 0 rows, 2 columns
- Table `child_clinical_documents`: 0 rows, 7 columns
- Table `consultation_threads`: 0 rows, 5 columns
- Table `consultation_messages`: 0 rows, 6 columns
- Table `shared_portal_tokens`: 0 rows, 6 columns
- Table `child_iep_accommodations`: 0 rows, 3 columns
- Table `child_iep_goals`: 0 rows, 5 columns
- Table `child_respite_assessments`: 0 rows, 6 columns

## Knowledge Content

- Layer ID: knowledge_content
- Subtypes: bilingual structured knowledge articles
- Table `knowledge_articles`: 15 rows, 12 columns
- Controlled values:
  - knowledgeArticleCategories: Appeals, IEP, IEP & School Rights, IHSS, Medi-Cal & Waivers, Regional Center, Savings & Benefits, SDP, Therapy & Medical, Transition to Adulthood
  - verifiedDiagnosisSlugs: autism-spectrum-disorder, adhd, down-syndrome, speech-or-language-delay, cerebral-palsy, epilepsy

## Source, Review, and Operations Layers

- Layer ID: sources_review_ops
- Subtypes: source registry; source verifications; user-submitted resources; coverage gaps; verification queue
- Table `sources`: 30 rows, 12 columns
- Table `source_verifications`: 18 rows, 12 columns
- Table `user_submitted_resources`: 0 rows, 8 columns
- Table `coverage_gaps`: 0 rows, 5 columns
- Table `verification_queue_items`: 2 rows, 6 columns
- Controlled values:
  - sourceTypes: official
  - verificationLevels: 1

## Staging and Promotion Layers

- Layer ID: staging_promotion
- Subtypes: source targets; scraped county offices; scraped state resource agencies; scraped regional education agencies; scraped school districts; scraped nonprofits; scraped advocates; scraped resource providers; scraped forms; scraped waitlists; scraped sources; promotion audit
- Table `staging_source_targets`: 0 rows, 16 columns
- Table `staging_scraped_county_offices`: 3050 rows, 21 columns
- Table `staging_scraped_state_resource_agencies`: 374 rows, 26 columns
- Table `staging_scraped_regional_education_agencies`: 161 rows, 20 columns
- Table `staging_scraped_school_districts`: 2874 rows, 20 columns
- Table `staging_scraped_nonprofit_organizations`: 21071 rows, 19 columns
- Table `staging_scraped_iep_advocates`: 3053 rows, 26 columns
- Table `staging_scraped_resource_providers`: 23 rows, 21 columns
- Table `staging_scraped_forms`: 133 rows, 21 columns
- Table `staging_scraped_waitlists`: 7 rows, 23 columns
- Table `staging_scraped_sources`: 13 rows, 18 columns
- Table `staging_promotion_audit`: 22414 rows, 10 columns

## Truth and Public Eligibility Contract

- Layer ID: public_truth
- Subtypes: source-backed trust metadata; public-safe render eligibility; index-safe gating; verified diagnosis allowlist; indexable state allowlist
- Table `resource_providers`: 36 rows, 54 columns
- Table `nonprofit_organizations`: 29499 rows, 51 columns
- Table `iep_advocates`: 3573 rows, 59 columns
- Table `county_offices`: 3678 rows, 16 columns
- Table `state_resource_agencies`: 636 rows, 25 columns
- Table `regional_education_agencies`: 313 rows, 14 columns
- Table `school_districts`: 3117 rows, 18 columns
- Table `programs`: 507 rows, 16 columns
- Controlled values:
  - indexableStates: california, texas, florida, pennsylvania, new-york, ohio, illinois, georgia, maryland, utah, new-mexico, oregon, washington, idaho, south-carolina, north-dakota, west-virginia, montana, colorado, louisiana, south-dakota, alabama, wisconsin, arkansas, oklahoma, north-carolina, mississippi, michigan, minnesota, indiana, nebraska, tennessee, virginia, arizona, alaska, connecticut, delaware, hawaii, iowa, kansas, kentucky, maine, massachusetts, missouri, nevada, new-hampshire, new-jersey, rhode-island, vermont, wyoming
  - publicVerificationStatuses: official_verified, verified, human_verified, source_listed
  - verifiedDiagnosisSlugs: autism-spectrum-disorder, adhd, down-syndrome, speech-or-language-delay, cerebral-palsy, epilepsy
- Notes:
  - Public eligibility requires acceptable verification status, non-synthetic source URL, and contact signal.
