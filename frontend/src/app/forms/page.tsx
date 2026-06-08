import React from 'react';
import Link from 'next/link';
import { FileText, FileSpreadsheet, Download, ExternalLink, ArrowRight, BookOpen, ShieldAlert } from 'lucide-react';
import { SEO_CLUSTERS } from '@/lib/seo-data';

export const metadata = {
  title: 'California Special Needs Forms Directory & Parent Guides (2026)',
  description: 'Complete directory of official California forms for IHSS, Regional Center services, IEP school accommodations, Medi-Cal, and SSI. Access official PDF downloads and step-by-step parent guides.',
  alternates: {
    canonical: '/forms'
  }
};

interface FormItem {
  slug: string;
  code: string;
  title: string;
  description: string;
  signer: string;
  downloadUrl?: string;
}

interface FormCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: FormItem[];
}

export default async function FormsIndexPage() {
  // Extract all forms in SEO_CLUSTERS
  const formsMap = new Map<string, any>();
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
        signer: 'Parent / Physician'
      };
    }

    const downloadDoc = data.documentsToGather?.find((d: any) => d.downloadUrl);
    const downloadUrl = downloadDoc?.downloadUrl;
    
    const signerPt = data.tldrPoints?.find((p: any) => p.label.toLowerCase().includes('signer') || p.label.toLowerCase().includes('authorized'));
    const signer = signerPt ? signerPt.value : 'Parent / Physician';

    return {
      slug,
      code: defaultCode,
      title: data.title.replace('Form ' + defaultCode.toUpperCase() + ': ', '').replace('Guide to Form ' + defaultCode.toUpperCase(), ''),
      description: data.quickAnswer ? data.quickAnswer.substring(0, 180) + '...' : data.metaDescription,
      signer,
      downloadUrl
    };
  };

  const categories: FormCategory[] = [
    {
      title: 'In-Home Supportive Services (IHSS) Forms',
      description: 'Official forms needed to apply for and manage California IHSS caregiver pay and 24/7 Protective Supervision.',
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '0.75rem', fontWeight: 800 }}>
          California Special Needs Forms Directory
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '800px', margin: '0 auto', color: 'var(--text-light)', lineHeight: '1.6' }}>
          Avoid denials and processing delays. Access official, updated PDF downloads and step-by-step parent guides for major California regional centers, IHSS offices, school districts, and state waivers.
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
          <strong>Official Source Verification:</strong> All links labeled as <strong style={{ color: '#0f766e' }}>Official PDF / Source</strong> connect directly to state portals (e.g. CDSS, DHCS, CDE, OAH). For letters and requests with no direct official form, we provide a <strong>Parent Request Letter Template</strong> to establish legal timelines.
        </div>
      </div>

      {/* Categories Loop */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {categories.map((cat, catIdx) => (
          <div key={catIdx}>
            {/* Category Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              {cat.icon}
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {cat.title}
              </h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', marginBottom: '1.5rem', maxWidth: '900px' }}>
              {cat.description}
            </p>

            {/* Grid of Forms */}
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
                        <Download size={14} /> Official PDF
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500, fontStyle: 'italic' }}>
                        Official Instructions Page
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
                        gap: '0.2rem'
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

    </div>
  );
}
