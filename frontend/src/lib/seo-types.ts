export interface SEOPageData {
  slug: string;
  category: 'programs' | 'conditions' | 'forms' | 'deadlines' | 'situations' | 'counties';
  title: string;
  metaTitle: string;
  metaDescription: string;
  quickAnswer: string;
  tldrPoints: { label: string; value: string }[];
  whenThisMatters: string;
  signsThisMayApply: string[];
  whatToDoFirst: string[];
  documentsToGather: { name: string; description: string; downloadUrl?: string }[];
  whoToCall: { name: string; number?: string; description: string }[];
  whatToSay: string;
  commonMistakes: string[];
  relatedGuides: { title: string; url: string }[];
  officialSources: {
    name: string;
    url: string;
    sourceType?: string;
    confidenceScore?: number | null;
    verificationStatus?: string | null;
    lastReviewedDate?: string | null;
  }[];
  lastReviewedDate: string;
  callScriptTemplate?: {
    intro: string;
    script: string;
    tips: string;
  };
  letterTemplate?: {
    title: string;
    description: string;
    fields: { key: string; label: string; placeholder: string; defaultValue?: string }[];
    generateFn: (fields: Record<string, string>) => string;
  };
  eligibilityQuiz?: {
    question: string;
    options: { text: string; score: 'high' | 'med' | 'low'; reason: string }[];
  }[];
}
