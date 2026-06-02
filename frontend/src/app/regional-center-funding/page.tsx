import type { Metadata } from 'next';
import FundingClient from './funding-client';

export const metadata: Metadata = {
  title: "DDS Regional Center Funding Guide & Respite Estimator",
  description: "Examine California DDS Regional Center service codes (respite, behavioral therapy, social recreation) and use our Respite Hours Estimator to generate request letters.",
  openGraph: {
    title: "DDS Regional Center Funding Guide & Respite Estimator",
    description: "Examine California DDS Regional Center service codes (respite, behavioral therapy, social recreation) and use our Respite Hours Estimator to generate request letters.",
    type: "website",
  }
};

export default function FundingPage() {
  return <FundingClient />;
}
