import React from 'react';
import Link from 'next/link';
import { FileText, FileSpreadsheet, Download, ExternalLink, ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';
import { SEO_CLUSTERS, SEOPageData } from '@/lib/seo-data';
import { stateConfigs } from '@/lib/stateConfigs';
import { getSafePublishedFormGuides } from '@/lib/publishedFormGuides';
import SourceFreshnessDisclosure, { type DisclosureSource } from '@/app/components/SourceFreshnessDisclosure';
import { resolvePublicSourceVerificationStatus } from '@/lib/sourceReviewLabels';
import ContributionModal from '@/components/contribution-modal';

type PageProps = {
  searchParams: Promise<{ state?: string }>;
};

function getStateName(stateId: string): string {
  if (!stateId) return 'California';
  switch (stateId) {
    case 'texas': return 'Texas';
    case 'florida': return 'Florida';
    case 'new-york': return 'New York';
    case 'pennsylvania': return 'Pennsylvania';
    case 'illinois': return 'Illinois';
    case 'ohio': return 'Ohio';
    case 'georgia': return 'Georgia';
    case 'new-jersey': return 'New Jersey';
    case 'wyoming': return 'Wyoming';
    default:
      return stateId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}

export async function generateMetadata({ searchParams }: PageProps) {
  const params = await searchParams;
  const stateId = params.state || 'california';
  const stateName = getStateName(stateId);
  const isCalifornia = stateId === 'california';
  return {
    title: isCalifornia
      ? `${stateName} Special Needs Forms Directory & Parent Guides`
      : `${stateName} Forms Verification In Progress | Ablefull`,
    description: isCalifornia
      ? `Source-backed ${stateName} forms and parent request templates for Medicaid waivers, early childhood intervention, IEP accommodations, and SSI.`
      : `We are still verifying ${stateName} forms, deadlines, and submission routes. Until source review is complete, this forms hub stays noindex and only California guides remain publicly listed.`,
    alternates: isCalifornia
      ? {
          canonical: `/forms`
        }
      : undefined,
    robots: isCalifornia ? { index: true, follow: true } : { index: false, follow: true }
  };
}

interface FormItem {
  slug: string;
  code: string;
  title: string;
  description: string;
  signer: string;
  downloadUrl?: string;
  submitTo?: string;
  sourceUrl?: string;
  sourceTypeLabel?: string;
  confidenceLabel?: string;
  lastCheckedLabel?: string;
  sourceNotes?: DisclosureSource[];
}

interface FormCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: FormItem[];
}

export default async function FormsIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stateId = params.state || 'california';
  const stateName = getStateName(stateId);
  const isCalifornia = stateId === 'california';
  const publishedCaliforniaForms = isCalifornia ? await getSafePublishedFormGuides('california') : [];

  // Extract all forms in SEO_CLUSTERS
  const formsMap = new Map<string, SEOPageData>();
  for (const [key, data] of Object.entries(SEO_CLUSTERS)) {
    if (data.category === 'forms') {
      formsMap.set(key, data);
    }
  }

  const getFormDetails = (slug: string, defaultCode: string, defaultTitle: string): FormItem => {
    const data = formsMap.get(slug);
    if (!data) {
      return {
        slug,
        code: defaultCode,
        title: defaultTitle,
        description: 'Detailed step-by-step parent guide and submission instructions.',
        signer: 'Parent / Physician',
        sourceNotes: []
      };
    }

    const downloadDoc = data.documentsToGather?.find((d) => d.downloadUrl);
    const downloadUrl = downloadDoc?.downloadUrl;
    
    const signerPt = data.tldrPoints?.find((p) => p.label.toLowerCase().includes('signer') || p.label.toLowerCase().includes('authorized'));
    const signer = signerPt ? signerPt.value : 'Parent / Physician';

    return {
      slug,
      code: defaultCode,
      title: data.title.replace('Form ' + defaultCode.toUpperCase() + ': ', '').replace('Guide to Form ' + defaultCode.toUpperCase(), ''),
      description: data.quickAnswer ? data.quickAnswer.substring(0, 180) + '...' : data.metaDescription,
      signer,
      downloadUrl,
      sourceNotes: (data.officialSources || []).map((source) => ({
        name: source.name,
        url: source.url,
        lastReviewedDate: source.lastReviewedDate || data.lastReviewedDate || null,
        verificationStatus: resolvePublicSourceVerificationStatus(source.verificationStatus, Boolean(source.url?.trim())),
        sourceType: source.sourceType || null,
        confidenceScore: typeof source.confidenceScore === 'number' ? source.confidenceScore : null,
      }))
    };
  };

  const getCategories = (): FormCategory[] => {
    if (stateId === 'texas') {
      return [
        {
          title: 'Texas Medicaid & Waiver Guides',
          description: 'Official step-by-step guides for Texas Health & Human Services waiver programs and Medicaid/CHIP eligibility.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('tx-medicaid-chip', 'Medicaid/CHIP', 'Texas Medicaid & CHIP Application'),
            getFormDetails('tx-hcs-guide', 'HCS Waiver', 'Texas HCS Waiver Guide'),
            getFormDetails('tx-class-guide', 'CLASS Waiver', 'Texas CLASS Waiver Guide'),
            getFormDetails('tx-txhml-guide', 'TxHmL Waiver', 'Texas Home Living Waiver Guide'),
            getFormDetails('tx-mdcp-guide', 'MDCP Waiver', 'Texas MDCP Waiver Guide'),
            getFormDetails('tx-starkids-overview', 'STAR Kids', 'Texas STAR Kids Managed Care Overview'),
            getFormDetails('tx-starkids-coordination', 'Care Coord.', 'STAR Kids Service Coordination Request'),
            getFormDetails('tx-starkids-mco-appeal', 'MCO Appeal', 'STAR Kids MCO Internal Appeal Guide'),
            getFormDetails('tx-starkids-reduction-appeal', 'Benefit Cut', 'STAR Kids Service Reduction Appeal'),
            getFormDetails('tx-medicaid-fair-hearing', 'Fair Hearing', 'Texas State Fair Hearing Request'),
            getFormDetails('tx-expedited-appeal', 'Expedited', 'Texas Medicaid Expedited Appeal'),
            getFormDetails('tx-benefits-continuation', 'Continuation', 'Texas Medicaid Benefits Continuation')
          ]
        },
        {
          title: 'Texas Early Intervention & Support Services',
          description: 'Referrals and coordination forms for early childhood intervention and family support.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('tx-eci-referral', 'ECI Intake', 'Texas ECI Referral Guide'),
            getFormDetails('tx-able-guide', 'Texas ABLE', 'Texas ABLE Account Guide'),
            getFormDetails('tx-ssi-checklist', 'SSI Checklist', 'Texas SSI Child Checklist')
          ]
        },
        {
          title: 'Texas Special Education & TEA Complaints',
          description: 'Written request letter templates and TEA compliance complaint guides for school IEP and evaluations.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('tx-sped-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('tx-tea-complaint', 'TEA Complaint', 'TEA State Compliance Complaint'),
            getFormDetails('tx-due-process-complaint', 'Due Process', 'Texas Due Process Complaint Guide'),
            getFormDetails('tx-mediation-request', 'Mediation Request', 'Texas Special Education Mediation Request'),
            getFormDetails('tx-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('tx-iee-request', 'IEE Request', 'Independent Evaluation Request')
          ]
        }
      ];
    }

    if (stateId === 'florida') {
      return [
        {
          title: 'Florida Medicaid & Waiver Guides',
          description: 'Official applications and parent guides for the APD iBudget waiver, CDC+ budget authority, and health coverage.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('fl-medicaid-application', 'Medicaid App', 'Florida Medicaid Single Streamline Application'),
            getFormDetails('fl-apd-application', 'APD App', 'APD iBudget Waiver Application Form'),
            getFormDetails('fl-ibudget-guide', 'iBudget Waiver', 'Florida iBudget Waiver Parent Guide'),
            getFormDetails('fl-ibudget-appeal', 'Waiver Appeal', 'Florida iBudget Waiver Appeal Guide'),
            getFormDetails('fl-apd-hearing-guide', 'Fair Hearing', 'APD Administrative Fair Hearing Guide'),
            getFormDetails('fl-cdc-plus-guide', 'CDC+ Guide', 'Florida Consumer Directed Care Plus Guide'),
            getFormDetails('fl-cms-plan-guide', 'CMS Plan', 'Florida Children\'s Medical Services Guide'),
            getFormDetails('fl-kidcare-guide', 'KidCare', 'Florida KidCare Health Insurance Guide')
          ]
        },
        {
          title: 'Florida Early Intervention & Family Support',
          description: 'Guides and directories for Early Steps referrals, ABLE savings accounts, and child SSI checklists.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('fl-earlysteps-referral', 'Early Steps', 'Florida Early Steps Referral Guide'),
            getFormDetails('fl-able-guide', 'ABLE United', 'Florida ABLE United Savings Guide'),
            getFormDetails('fl-ssi-checklist', 'SSI Checklist', 'Florida SSI Child Disability Checklist'),
            getFormDetails('fl-vocational-rehabilitation-transition', 'VR Transition', 'Florida Vocational Rehabilitation Guide')
          ]
        },
        {
          title: 'Florida Special Education & ESE Complaints',
          description: 'Letter templates and FDOE complaint procedures for public school IEP accommodations and assessments.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('fl-iep-evaluation-request', 'Evaluation Request', 'Florida IEP Assessment Request Letter'),
            getFormDetails('fl-fldoe-complaint', 'FDOE Complaint', 'Florida State ESE Complaint Guide'),
            getFormDetails('fl-due-process-complaint', 'Due Process', 'Florida Due Process Hearing Request'),
            getFormDetails('fl-mediation-request', 'Mediation', 'Florida ESE Mediation Request Guide'),
            getFormDetails('fl-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('fl-iee-request', 'IEE Request', 'Independent Educational Evaluation Request'),
            getFormDetails('fl-pwn-request', 'PWN Request', 'Prior Written Notice Request Letter'),
            getFormDetails('fl-family-empowerment-scholarship-unique-abilities', 'FES-UA', 'Family Empowerment Scholarship Guide')
          ]
        }
      ];
    }

    if (stateId === 'new-york') {
      return [
        {
          title: 'New York Medicaid & Waiver Guides',
          description: 'Official applications and guides for OPWDD HCBS waiver, CDPAP self-directed care, and NY Medicaid.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('ny-medicaid-app', 'Medicaid App', 'New York Medicaid Application'),
            getFormDetails('ny-opwdd-trans-referral', 'OPWDD Referral', 'OPWDD Transition Referral'),
            getFormDetails('ny-opwdd-frontdoor-guide', 'Front Door', 'OPWDD Front Door Guide'),
            getFormDetails('ny-cdpap-med-eval', 'CDPAP Eval', 'CDPAP Medical Evaluation'),
            getFormDetails('ny-cdpap-peer-agreement', 'CDPAP Agreement', 'CDPAP Peer Agreement'),
            getFormDetails('ny-child-health-plus-app', 'CHPlus App', 'Child Health Plus Application'),
            getFormDetails('ny-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('ny-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'New York Early Intervention & Support Services',
          description: 'NYS Early Intervention Program (EIP) forms, SSI checklist, and NY ABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('ny-ei-referral', 'EIP Referral', 'NYS Early Intervention Program Referral'),
            getFormDetails('ny-able-opening', 'NY ABLE', 'NY ABLE Account Enrollment'),
            getFormDetails('ny-ssi-checklist', 'SSI Checklist', 'NYS SSI Child Disability Checklist'),
            getFormDetails('ny-opwdd-self-direction-guide', 'Self-Direction', 'OPWDD Self-Direction Guide'),
            getFormDetails('ny-acces-vr-app', 'ACCES-VR App', 'ACCES-VR Application')
          ]
        },
        {
          title: 'Committee on Special Education (CSE)',
          description: 'IEP assessment requests, school records requests, and NYSED compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('ny-cse-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('ny-iep-appeal', 'IEP Appeal', 'Committee on Special Education IEP Appeal'),
            getFormDetails('ny-prior-written-notice', 'PWN Request', 'Prior Written Notice Demand'),
            getFormDetails('ny-due-process', 'Due Process', 'NYSED Due Process Complaint Form'),
            getFormDetails('ny-state-complaint', 'State Complaint', 'NYSED State Compliance Complaint'),
            getFormDetails('ny-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('ny-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    if (stateId === 'pennsylvania') {
      return [
        {
          title: 'Pennsylvania Medicaid & Waiver Guides',
          description: 'Official applications and guides for ODP Consolidated, Community Living, and P/FDS waivers.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('pa-medicaid-compass-app', 'COMPASS App', 'Pennsylvania Medicaid COMPASS Application'),
            getFormDetails('pa-odp-intake-request', 'ODP Intake', 'ODP Registry Intake Request'),
            getFormDetails('pa-puns-form', 'PUNS Form', 'ODP Prioritization of Urgency of Need for Services'),
            getFormDetails('pa-odp-waiver-guide', 'ODP Waiver', 'ODP Waiver Services Guide'),
            getFormDetails('pa-comp-waiver-guide', 'Consolidated', 'ODP Consolidated Waiver Guide'),
            getFormDetails('pa-comm-living-waiver-guide', 'Community Living', 'ODP Community Living Waiver Guide'),
            getFormDetails('pa-pfds-waiver-guide', 'P/FDS Waiver', 'ODP Person/Family Directed Support Waiver Guide'),
            getFormDetails('pa-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('pa-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'Pennsylvania Early Intervention & Support Services',
          description: 'Pennsylvania Early Intervention referrals, SSI checklists, and PA ABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('pa-early-intervention-referral', 'EI Referral', 'PA Early Intervention Referral'),
            getFormDetails('pa-chip-app', 'CHIP App', 'PA CHIP Health Insurance Application'),
            getFormDetails('pa-able-opening', 'PA ABLE', 'PA ABLE Account Enrollment'),
            getFormDetails('pa-ssi-checklist', 'SSI Checklist', 'PA SSI Child Disability Checklist'),
            getFormDetails('pa-ovr-referral', 'OVR Referral', 'OVR Transition Referral')
          ]
        },
        {
          title: 'Intermediate Units (IUs) & PDE Support',
          description: 'IEP assessment requests, school records requests, and PDE compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('pa-iep-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('pa-norep-form', 'NOREP Form', 'PA Notice of Recommended Educational Placement'),
            getFormDetails('pa-due-process-complaint', 'Due Process', 'PDE Due Process Hearing Request'),
            getFormDetails('pa-state-complaint', 'State Complaint', 'PDE State Compliance Complaint'),
            getFormDetails('pa-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('pa-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    if (stateId === 'illinois') {
      return [
        {
          title: 'Illinois Medicaid & Waiver Guides',
          description: 'Official applications and guides for Children\'s Support, Adults with DD, and Medicaid/ABE.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('il-medicaid', 'Medicaid (ABE)', 'Illinois Medicaid ABE Application'),
            getFormDetails('il-childrens-support-waiver', 'Children\'s Waiver', 'Illinois Children\'s Support Waiver Guide'),
            getFormDetails('il-adults-dd-waiver', 'Adults Waiver', 'Illinois Adults with DD Waiver Guide'),
            getFormDetails('il-hsp', 'HSP Program', 'Illinois Home Services Program Guide'),
            getFormDetails('il-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('il-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'Illinois Early Intervention & Support Services',
          description: 'Illinois Early Intervention (CFC) referrals, SSI checklists, and Illinois ABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('il-early-intervention', 'EI Referral', 'Illinois Early Intervention Referral'),
            getFormDetails('il-all-kids', 'All Kids App', 'Illinois All Kids Health Insurance Application'),
            getFormDetails('il-able', 'IL ABLE', 'Illinois ABLE Account Enrollment'),
            getFormDetails('il-ssi-child', 'SSI Checklist', 'Illinois SSI Child Disability Checklist'),
            getFormDetails('il-drs', 'DRS Referral', 'DRS Transition Referral')
          ]
        },
        {
          title: 'ISBE Special Education & school Support',
          description: 'IEP assessment requests, school records requests, and ISBE compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('il-special-education', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('il-iep-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('il-due-process-complaint', 'Due Process', 'ISBE Due Process Hearing Request'),
            getFormDetails('il-state-complaint', 'State Complaint', 'ISBE State Compliance Complaint'),
            getFormDetails('il-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('il-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    if (stateId === 'ohio') {
      return [
        {
          title: 'Ohio Medicaid & Waiver Guides',
          description: 'Official applications and guides for Individual Options, Level One, SELF waivers, and Medicaid.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('oh-medicaid', 'Medicaid App', 'Ohio Medicaid Application'),
            getFormDetails('oh-individual-options-waiver', 'IO Waiver', 'Ohio Individual Options Waiver Guide'),
            getFormDetails('oh-level-one-waiver', 'Level One', 'Ohio Level One Waiver Guide'),
            getFormDetails('oh-self-waiver', 'SELF Waiver', 'Ohio SELF Waiver Guide'),
            getFormDetails('oh-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('oh-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'Ohio Early Intervention & Support Services',
          description: 'Ohio Early Intervention (Help Me Grow) referrals, SSI checklists, and STABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('oh-early-intervention', 'EI Referral', 'Ohio Help Me Grow Early Intervention Referral'),
            getFormDetails('oh-healthy-start', 'Healthy Start', 'Ohio Healthy Start Health Insurance Application'),
            getFormDetails('oh-stable', 'STABLE Account', 'Ohio STABLE Account Enrollment'),
            getFormDetails('oh-ssi-child', 'SSI Checklist', 'Ohio SSI Child Disability Checklist'),
            getFormDetails('oh-ood', 'OOD Referral', 'OOD Transition Referral')
          ]
        },
        {
          title: 'Exceptional Children IEP & ODE Support',
          description: 'IEP assessment requests, school records requests, and ODE compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('oh-special-education', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('oh-iep-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('oh-due-process-complaint', 'Due Process', 'ODE Due Process Hearing Request'),
            getFormDetails('oh-state-complaint', 'State Complaint', 'ODE State Compliance Complaint'),
            getFormDetails('oh-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('oh-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    if (stateId === 'georgia') {
      return [
        {
          title: 'Georgia Medicaid & Waiver Guides',
          description: 'Official applications and guides for COMP waiver, NOW waiver, and GAPP medical nursing.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('ga-medicaid', 'Medicaid (Gateway)', 'Georgia Medicaid Gateway Application'),
            getFormDetails('ga-comp-waiver', 'COMP Waiver', 'Georgia COMP Waiver Guide'),
            getFormDetails('ga-now-waiver', 'NOW Waiver', 'Georgia NOW Waiver Guide'),
            getFormDetails('ga-gapp', 'GAPP Program', 'Georgia Pediatric Program nursing guide'),
            getFormDetails('ga-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('ga-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'Georgia Early Intervention & Support Services',
          description: 'Georgia Babies Can\'t Wait referrals, SSI checklists, and Georgia ABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('ga-early-intervention', 'EI Referral', 'Georgia Babies Can\'t Wait Referral'),
            getFormDetails('ga-peachcare', 'PeachCare App', 'Georgia PeachCare for Kids Health Insurance'),
            getFormDetails('ga-able', 'GA ABLE', 'Georgia ABLE Account Enrollment'),
            getFormDetails('ga-ssi-child', 'SSI Checklist', 'Georgia SSI Child Disability Checklist'),
            getFormDetails('ga-gvra', 'GVRA Referral', 'GVRA Transition Referral')
          ]
        },
        {
          title: 'GaDOE Special Education & School Support',
          description: 'IEP assessment requests, school records requests, and GaDOE compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('ga-special-education', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('ga-iep-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('ga-due-process-complaint', 'Due Process', 'GaDOE Due Process Hearing Request'),
            getFormDetails('ga-state-complaint', 'State Complaint', 'GaDOE State Compliance Complaint'),
            getFormDetails('ga-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('ga-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }
    if (stateId === 'new-jersey') {
      return [
        {
          title: 'New Jersey Medicaid & Waiver Guides',
          description: 'Official applications and guides for NJ FamilyCare, DDD programs, and PCA services.',
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails('nj-medicaid-app', 'Medicaid App', 'NJ FamilyCare Medicaid Application'),
            getFormDetails('nj-dd-intake-request', 'DDD Intake', 'DDD Intake Request Form'),
            getFormDetails('nj-dd-eligibility-guide', 'DDD Eligibility', 'DDD Eligibility Application Guide'),
            getFormDetails('nj-personal-care-app', 'PCA App', 'NJ PCA Caregiver Application'),
            getFormDetails('nj-personal-care-agreement', 'PCA Agreement', 'PCA Recipient Agreement Form'),
            getFormDetails('nj-medicaid-renewal', 'Medicaid Renewal', 'Medicaid Renewal Form'),
            getFormDetails('nj-medicaid-fair-hearing', 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: 'New Jersey Early Intervention & Support Services',
          description: 'NJEIS early intervention referrals, child SSI checklists, and NJ ABLE guides.',
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails('nj-ei-referral', 'NJEIS Referral', 'NJEIS Early Intervention Referral'),
            getFormDetails('nj-chip-app', 'FamilyCare CHIP', 'NJ FamilyCare CHIP Application'),
            getFormDetails('nj-able-opening', 'NJ ABLE', 'NJ ABLE Account Enrollment'),
            getFormDetails('nj-ssi-checklist', 'SSI Checklist', 'New Jersey SSI Child Disability Checklist'),
            getFormDetails('nj-transition-app', 'Transition Services', 'NJ DVRS Transition Services App')
          ]
        },
        {
          title: 'New Jersey Special Education & School Support',
          description: 'IEP assessment requests, school records requests, and NJDOE compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails('nj-iep-evaluation-request', 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails('nj-iep-appeal', 'IEP Appeal', 'NJ Special Ed Mediation & Hearing Guide'),
            getFormDetails('nj-prior-written-notice', 'PWN Request', 'Prior Written Notice Request Letter'),
            getFormDetails('nj-due-process', 'Due Process', 'NJDOE Due Process Hearing Request'),
            getFormDetails('nj-state-complaint', 'State Complaint', 'NJDOE State Compliance Complaint'),
            getFormDetails('nj-records-request', 'Records Request', 'Student Records Request Letter'),
            getFormDetails('nj-iee-request', 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    if (stateId !== 'california') {
      const stateConf = stateConfigs[stateId];
      const code = stateConf?.code ? stateConf.code.toLowerCase() : (stateId === 'new-jersey' ? 'nj' : stateId === 'wyoming' ? 'wy' : 'us');
      return [
        {
          title: `${stateName} Medicaid & Waiver Guides`,
          description: `Official applications and guides for ${stateName} Medicaid, developmental disability waivers, and caregiver programs.`,
          icon: <FileText size={20} color="#0f766e" />,
          color: '#0f766e',
          items: [
            getFormDetails(`${code}-medicaid-app`, 'Medicaid App', `${stateName} Medicaid Application`),
            getFormDetails(`${code}-dd-intake-request`, 'DD Intake', 'Developmental Services Intake Request'),
            getFormDetails(`${code}-dd-eligibility-guide`, 'DD Eligibility', 'Developmental Services Eligibility Guide'),
            getFormDetails(`${code}-personal-care-app`, 'PCA App', 'Personal Care Services Application'),
            getFormDetails(`${code}-personal-care-agreement`, 'PCA Agreement', 'PCA Recipient Agreement Form'),
            getFormDetails(`${code}-medicaid-renewal`, 'Renewal', 'Medicaid Renewal Form'),
            getFormDetails(`${code}-medicaid-fair-hearing`, 'Fair Hearing', 'Medicaid Fair Hearing Request')
          ]
        },
        {
          title: `${stateName} Early Intervention & Support Services`,
          description: `Early intervention referrals, child SSI checklists, and ${stateName} ABLE guides.`,
          icon: <FileSpreadsheet size={20} color="#3b82f6" />,
          color: '#3b82f6',
          items: [
            getFormDetails(`${code}-ei-referral`, 'EI Referral', `${stateName} Early Intervention Referral`),
            getFormDetails(`${code}-chip-app`, 'CHIP App', 'Children\'s Health Insurance Program Application'),
            getFormDetails(`${code}-able-opening`, 'ABLE Account', 'ABLE Account Enrollment Guide'),
            getFormDetails(`${code}-ssi-checklist`, 'SSI Checklist', `${stateName} SSI Child Disability Checklist`),
            getFormDetails(`${code}-transition-app`, 'Transition Services', 'Vocational Rehab Transition Application')
          ]
        },
        {
          title: `${stateName} Special Education & School Support`,
          description: 'IEP assessment requests, school records requests, and state education compliance complaints.',
          icon: <BookOpen size={20} color="#d97706" />,
          color: '#d97706',
          items: [
            getFormDetails(`${code}-iep-evaluation-request`, 'Evaluation Request', 'IEP Evaluation Request Letter'),
            getFormDetails(`${code}-iep-appeal`, 'IEP Appeal', 'Special Education Mediation & Hearing Guide'),
            getFormDetails(`${code}-prior-written-notice`, 'PWN Request', 'Prior Written Notice Request Letter'),
            getFormDetails(`${code}-due-process`, 'Due Process', 'Due Process Hearing Request'),
            getFormDetails(`${code}-state-complaint`, 'State Complaint', 'State Compliance Complaint Form'),
            getFormDetails(`${code}-records-request`, 'Records Request', 'Student Records Request Letter'),
            getFormDetails(`${code}-iee-request`, 'IEE Request', 'Independent Educational Evaluation Request')
          ]
        }
      ];
    }

    // Default: California
    return [
      {
        title: 'In-Home Supportive Services (IHSS) Forms',
        description: 'Reviewed California forms commonly used to apply for and manage IHSS caregiver pay and 24/7 Protective Supervision.',
        icon: <FileText size={20} color="#0f766e" />,
        color: '#0f766e',
        items: [
          getFormDetails('soc-295', 'SOC 295', 'IHSS Application Form'),
          getFormDetails('soc-873', 'SOC 873', 'IHSS Medical Certification Form'),
          getFormDetails('soc-821', 'SOC 821', 'Protective Supervision Checklist'),
          getFormDetails('soc-825', 'SOC 825', 'Recipient Agreement Form'),
          getFormDetails('soc-839', 'SOC 839', 'Provider Overtime Agreement')
        ]
      },
      {
        title: 'Regional Center / Lanterman Services Forms',
        description: 'Formal letters and state forms to request assessments, coordinate IPP services, and file appeals.',
        icon: <FileSpreadsheet size={20} color="#3b82f6" />,
        color: '#3b82f6',
        items: [
          getFormDetails('regional-center-intake-request', 'Intake Request', 'Lanterman Act Assessment Request'),
          getFormDetails('regional-center-ipp-request', 'IPP Review', 'IPP Meeting Request Letter'),
          getFormDetails('regional-center-service-request', 'Service Request', 'Formal Service Funding Request'),
          getFormDetails('regional-center-appeal-request', 'DS 1805', 'DDS Fair Hearing Appeal Form')
        ]
      },
      {
        title: 'Special Education & IEP Forms',
        description: 'Written requests and administrative complaints to secure psycho-educational assessments, private evaluations, and records.',
        icon: <BookOpen size={20} color="#d97706" />,
        color: '#d97706',
        items: [
          getFormDetails('iep-assessment-request', 'IEP Intake', 'IEP Assessment Request Letter'),
          getFormDetails('independent-educational-evaluation-request', 'IEE Request', 'Independent Educational Evaluation Request'),
          getFormDetails('prior-written-notice-request', 'PWN Request', 'Prior Written Notice Demand'),
          getFormDetails('education-records-request', 'Records Request', 'Student Records Request Letter'),
          getFormDetails('cde-state-complaint', 'CDE Complaint', 'CDE State Compliance Complaint'),
          getFormDetails('due-process-complaint', 'Due Process', 'OAH Due Process Complaint Form')
        ]
      },
      {
        title: 'State Health Waivers & Financial Aid Forms',
        description: 'Applications for Medi-Cal STREAM, CCS medical therapy units, SSI starter checklists, and CalABLE accounts.',
        icon: <ExternalLink size={20} color="#8b5cf6" />,
        color: '#8b5cf6',
        items: [
          getFormDetails('ccs-application', 'CCS App', 'California Children\'s Services Application'),
          getFormDetails('dhcs-4480', 'DHCS 4480', 'Official CCS Enrollment Form'),
          getFormDetails('medi-cal-application', 'Medi-Cal App', 'Medi-Cal Single Streamlined Application'),
          getFormDetails('medi-cal-epsdt-request', 'EPSDT Request', 'Medi-Cal EPSDT Supplemental Services Request'),
          getFormDetails('ssi-child-disability-checklist', 'SSI Checklist', 'SSI Child Disability Starter Kit Checklist'),
          getFormDetails('calable-account-opening', 'CalABLE Sign-up', 'CalABLE Account Enrollment Application'),
          getFormDetails('hcba-waiver-application', 'HCBA Waiver', 'HCBA Waiver Application')
        ]
      }
    ];
  };

  const categories = isCalifornia ? getCategories() : [];
  const publishedCaliforniaFormItems: FormItem[] = publishedCaliforniaForms
    .slice(0, 8)
    .map((form) => ({
      slug: form.slug || form.id,
      code: form.form_type || form.slug?.toUpperCase() || 'Published',
      title: form.title || form.slug || 'California published form',
      description:
        form.description?.trim() ||
        form.related_action?.trim() ||
        'Published from the California source-pack pipeline. Confirm the current download, signer, and submission route before you act.',
      signer: form.who_signs_it?.trim() || 'See source instructions',
      submitTo: form.where_to_send_it?.trim() || undefined,
      sourceUrl: form.source_url?.trim() || undefined,
      downloadUrl: form.pdf_url?.trim() || form.source_url?.trim() || undefined,
      sourceTypeLabel: form.evidence_level ? form.evidence_level.replace(/_/g, ' ') : undefined,
      confidenceLabel:
        typeof form.confidence_score === 'number' && Number.isFinite(form.confidence_score)
          ? `${Math.round(form.confidence_score * 100)}% confidence`
          : undefined,
      lastCheckedLabel: form.last_checked_at || form.last_verified_at || undefined,
      sourceNotes: [
        {
          name: form.agency?.trim() || 'California published form source',
          url: form.source_url?.trim() || form.pdf_url?.trim() || undefined,
          lastReviewedDate: form.last_checked_at || form.last_verified_at || null,
          verificationStatus: form.verification_status || 'needs_review',
          sourceType: form.evidence_level || undefined,
          confidenceScore: typeof form.confidence_score === 'number' ? form.confidence_score : null,
        },
      ],
    }));
  const disclosureSources = Array.from(
    new Map(
      [...categories.flatMap((category) => category.items), ...publishedCaliforniaFormItems]
        .flatMap((item) => item.sourceNotes || [])
        .map((source) => [`${source.name}|${source.url || ''}`, source])
    ).values()
  ).slice(0, 8);

  const getVerificationSourcesText = () => {
    switch (stateId) {
      case 'california': return 'CDSS, DHCS, CDE, OAH';
      case 'texas': return 'Texas Health and Human Services, Texas Education Agency, SPEDTex';
      case 'florida': return 'APD, DCF, FDOE, FDLRS';
      case 'new-york': return 'OPWDD, NYS Department of Health, NYSED';
      case 'pennsylvania': return 'PA Department of Human Services, ODP, PDE';
      case 'illinois': return 'Illinois DHS, ISBE, CFC';
      case 'ohio': return 'Ohio DODD, ODJFS, Help Me Grow, ODE';
      case 'georgia': return 'Georgia DBHDD, DCH, GaDOE';
      default: return 'CDSS, DHCS, CDE, OAH';
    }
  };

  const getLocalAgencyLabelText = () => {
    switch (stateId) {
      case 'texas': return 'LIDDAs';
      case 'florida': return 'APD offices';
      case 'new-york': return 'OPWDD DDROs';
      case 'pennsylvania': return 'County MH/ID AEs';
      case 'illinois': return 'ISC agencies';
      case 'ohio': return 'County Boards of DD';
      case 'georgia': return 'DBHDD field offices';
      default: return 'regional centers';
    }
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* State Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {['california', 'texas', 'florida', 'new-york', 'pennsylvania', 'illinois', 'ohio', 'georgia', 'maryland', 'utah', 'new-mexico', 'oregon', 'washington', 'idaho', 'south-carolina', 'north-dakota', 'west-virginia', 'montana', 'colorado', 'louisiana', 'south-dakota', 'alabama', 'wisconsin', 'arkansas', 'oklahoma', 'north-carolina', 'mississippi', 'michigan', 'minnesota', 'indiana', 'nebraska', 'tennessee', 'virginia', 'arizona', 'alaska', 'connecticut', 'delaware', 'hawaii', 'iowa', 'kansas', 'kentucky', 'maine', 'massachusetts', 'missouri', 'nevada', 'new-hampshire', 'new-jersey', 'rhode-island', 'vermont', 'wyoming'].map((st) => (
          <Link 
            key={st}
            href={`/forms?state=${st}`} 
            style={{ 
              padding: '0.4rem 1.2rem', 
              borderRadius: '20px', 
              textDecoration: 'none', 
              fontSize: '0.88rem',
              fontWeight: 700, 
              background: stateId === st ? 'var(--primary-color)' : 'rgba(0,0,0,0.04)', 
              color: stateId === st ? 'white' : 'var(--text-main)',
              border: stateId === st ? '1px solid var(--primary-color)' : '1px solid #e0e0e0',
              transition: 'all 0.2s ease'
            }}
          >
            {st.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </Link>
        ))}
      </div>

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.75rem', fontWeight: 800 }}>
          {isCalifornia ? `${stateName} Special Needs Forms Directory` : `${stateName} Forms Verification In Progress`}
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
          {isCalifornia
            ? `Review source-backed state portal PDFs, parent guides, and request templates for major ${stateName} ${getLocalAgencyLabelText()}, school districts, and waiver or Medicaid workflows. Families should still confirm the current form, signer, and submission route before relying on it.`
            : `We are still verifying local entries, current forms libraries, and submission routes for ${stateName}. Until that review is complete, we do not publish a full public forms directory for this state.`}
        </p>
      </div>

      {/* Info Warning Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.25rem 1.75rem', 
          borderRadius: '16px', 
          background: 'rgba(15, 118, 110, 0.04)', 
          border: '1px solid rgba(15, 118, 110, 0.15)', 
          marginBottom: '3rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.92rem',
          color: 'var(--text-main)'
        }}
      >
        <span style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center' }}><ShieldAlert size={24} color="#0f766e" /></span>
        <div>
          {isCalifornia ? (
            <>
              <strong>Source-backed link review:</strong> Links labeled as <strong style={{ color: '#0f766e' }}>Reviewed PDF / Source</strong> point to reviewed state or agency document pages (e.g. {getVerificationSourcesText()}). For letters and requests with no direct government form, we provide a <strong>Parent Request Letter Template</strong> to help families document the request and establish timelines.
            </>
          ) : (
            <>
              <strong>Truth-first hold:</strong> We only publish form guides here after we confirm the source URL, who signs it, where it is submitted, and the last checked date. {stateName} is still in review, so this page stays <strong style={{ color: '#0f766e' }}>noindex</strong> until those checks pass.
            </>
          )}
        </div>
      </div>

      {!isCalifornia && (
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem 1.75rem',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid var(--glass-border)',
            marginBottom: '2.5rem'
          }}
        >
          <h2 style={{ margin: '0 0 0.6rem 0', fontSize: '1.2rem', fontWeight: 800 }}>We are still verifying local entries</h2>
          <p style={{ margin: 0, color: 'var(--text-light)', lineHeight: 1.6 }}>
            We have not yet published a source-backed {stateName} forms directory that meets our launch standard. We only reopen this page after we verify current form libraries, appeal routes, signer requirements, and submission instructions.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <ContributionModal
              suggestionType="other"
              targetId={`${stateId}-forms-proof-gap`}
              targetName={`${stateName} forms source library`}
              buttonLabel="Suggest a source to review"
            />
          </div>
        </div>
      )}

      {isCalifornia ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {publishedCaliforniaFormItems.length > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <FileText size={20} color="#0f766e" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Published California Source-Pack Forms
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '1.5rem', maxWidth: '900px' }}>
                These entries come from the California source-pack publish lane and only appear here after they pass the current published-record gate. Use the source link to confirm the latest signer requirements, submission route, and revision details before acting.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {publishedCaliforniaFormItems.map((item) => (
                  <div
                    key={`published-${item.slug}`}
                    className="glass-panel"
                    style={{
                      padding: '1.75rem',
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      border: '1px solid var(--glass-border)',
                      height: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#0f766e',
                            backgroundColor: 'rgba(15, 118, 110, 0.08)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: '1px solid rgba(15, 118, 110, 0.18)'
                          }}
                        >
                          {item.code}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                          Signer: <strong>{item.signer}</strong>
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: '1.3' }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
                        {item.description}
                      </p>

                      {item.submitTo ? (
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.45 }}>
                          <strong>Submission route:</strong> {item.submitTo}
                        </p>
                      ) : null}

                      {(item.sourceTypeLabel || item.confidenceLabel || item.lastCheckedLabel) ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.45 }}>
                          {[item.sourceTypeLabel, item.confidenceLabel, item.lastCheckedLabel ? `Last checked: ${item.lastCheckedLabel}` : null]
                            .filter(Boolean)
                            .join(' • ')}
                        </p>
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '0.85rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.82rem',
                            color: '#0f766e',
                            textDecoration: 'none',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Download size={14} /> Published source
                        </a>
                      ) : null}

                      {item.sourceUrl ? (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            fontWeight: 700,
                            marginLeft: 'auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          Open source page <ExternalLink size={13} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {categories.map((cat, catIdx) => (
            <div key={catIdx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                {cat.icon}
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  {cat.title}
                </h2>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '1.5rem', maxWidth: '900px' }}>
                {cat.description}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {cat.items.map((item) => (
                  <div
                    key={item.slug}
                    className="glass-panel"
                    style={{
                      padding: '1.75rem',
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      border: '1px solid var(--glass-border)',
                      height: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: cat.color,
                            backgroundColor: `${cat.color}10`,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            border: `1px solid ${cat.color}25`
                          }}
                        >
                          {item.code}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                          Signer: <strong>{item.signer}</strong>
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.2rem 0 0 0', lineHeight: '1.3' }}>
                        {item.title}
                      </h3>

                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', margin: 0, lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '0.85rem', marginTop: '0.5rem' }}>
                      {item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.82rem',
                            color: '#0f766e',
                            textDecoration: 'none',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Download size={14} /> Reviewed PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500, fontStyle: 'italic' }}>
                          Reviewed Source Page
                        </span>
                      )}

                      <Link
                        href={`/forms/${item.slug}`}
                        style={{
                          fontSize: '0.82rem',
                          color: 'var(--primary-color)',
                          textDecoration: 'none',
                          fontWeight: 700,
                          marginLeft: 'auto',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2'
                        }}
                      >
                        Parent Guide <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.5rem 1.75rem', borderRadius: '20px', marginTop: '0.5rem' }}>
          <p style={{ margin: 0, color: 'var(--text-light)', lineHeight: 1.7 }}>
            We do not currently publish a public {stateName} forms inventory from template data alone. This hub stays in verification hold until we confirm exact current libraries, signer requirements, and submission routes with source evidence.
          </p>
        </div>
      )}

      {isCalifornia && disclosureSources.length > 0 ? (
        <SourceFreshnessDisclosure
          sources={disclosureSources}
          correctionSuggestionType="other"
          correctionTargetId={`forms-${stateId}`}
          correctionTargetName={`${stateName} forms hub`}
          correctionButtonLabel="Report a forms source issue"
        />
      ) : null}
    </main>
  );
}
