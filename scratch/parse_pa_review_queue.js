import fs from 'fs';
import path from 'path';

// Define the 4 commercial providers/advocates held in the review queue for Pennsylvania
const queue = [
  {
    id: 'pa-review-mcandrews-law',
    name: 'McAndrews, Mehalick, Connolly, Hulse and Ryan P.C. (Special Education Attorneys)',
    category: 'legal_advocate',
    website: 'https://mcandrewslaw.com',
    phone: '610-687-9900',
    address: '30 Cassatt Ave, Berwyn, PA 19312',
    risk_classification: 'high_liability_commercial_legal',
    reason_for_hold: 'Commercial special education law firm. Excluded from auto-promotion to protect registry integrity.',
    terms_notes: 'Standard website copyright. Publicly accessible contact page.'
  },
  {
    id: 'pa-review-goldman-advocate',
    name: 'Goldman & Associates (Special Education Advocates)',
    category: 'iep_advocate',
    website: 'https://www.specialedadvocatepa.com',
    phone: '215-779-7973',
    address: 'Philadelphia, PA',
    risk_classification: 'commercial_advocacy',
    reason_for_hold: 'Private, for-profit special education advocate. Requires manual review of bar boundaries and licensing.',
    terms_notes: 'Standard website copyright. Publicly listed.'
  },
  {
    id: 'pa-review-aba2day',
    name: 'ABA2Day / Behavior Therapy Autism Clinic',
    category: 'therapy_provider',
    website: 'https://www.aba2day.com',
    phone: '610-328-3611',
    address: '370 Walnut St, Newtown Square, PA 19073',
    risk_classification: 'commercial_therapy',
    reason_for_hold: 'Private, commercial ABA/therapy clinic. Excluded from public directories under licensing review rules.',
    terms_notes: 'Standard website copyright.'
  },
  {
    id: 'pa-review-mainline-speech',
    name: 'Main Line Speech & Language',
    category: 'therapy_provider',
    website: 'https://mainlinespeech.com',
    phone: '610-688-6628',
    address: 'Wayne, PA',
    risk_classification: 'commercial_therapy',
    reason_for_hold: 'Private commercial speech therapy provider. Held back from auto-promotion.',
    terms_notes: 'Standard website copyright.'
  }
];

const outputFilePath = '/Users/ericgagnon/Documents/antigravity/beautiful-lavoisier/data/state-upgrades/pennsylvania/phase_records/provider_legal_review_queue.json';
fs.writeFileSync(outputFilePath, JSON.stringify(queue, null, 2), 'utf8');
console.log(`✓ Generated and wrote ${queue.length} review queue records to provider_legal_review_queue.json.`);
