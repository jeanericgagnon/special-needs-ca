import type { Metadata } from 'next';
import BehaviorLogClient from './behavior-log-client';

export const metadata: Metadata = {
  title: "IHSS Protective Supervision Safety Log Generator",
  description: "Generate a professional 24-hour behavior safety log to document elopement, pica, self-injury, and lack of hazard awareness. Perfect for IHSS Protective Supervision evaluations in California.",
  openGraph: {
    title: "IHSS Protective Supervision Safety Log Generator",
    description: "Generate a professional 24-hour behavior safety log to document elopement, pica, self-injury, and lack of hazard awareness.",
    type: "website",
  }
};

export default function BehaviorLogPage() {
  return <BehaviorLogClient />;
}
