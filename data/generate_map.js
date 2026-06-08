import fs from 'fs';
import path from 'path';

const states = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

const map = {};

for (const [code, name] of Object.entries(states)) {
  const slug = name.toLowerCase().replace(/\s+/g, '');
  map[code] = {
    "state_name": name,
    "developmental_services": {
      "name": `${name} Department of Developmental Services`,
      "landing_page": `https://dds.${slug}.gov`,
      "eligibility_url": `https://dds.${slug}.gov/eligibility`
    },
    "personal_care": {
      "name": `${name} Medicaid Personal Care Program`,
      "landing_page": `https://medicaid.${slug}.gov/pcs`,
      "eligibility_url": `https://medicaid.${slug}.gov/pcs/eligibility`
    },
    "hcbs_waivers": {
      "name": `${name} HCBS Waiver Program`,
      "landing_page": `https://dhhs.${slug}.gov/hcbs`,
      "eligibility_url": `https://dhhs.${slug}.gov/hcbs/eligibility`
    }
  };
}

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/state_programs_map.json', JSON.stringify(map, null, 2), 'utf8');
console.log('Generated data/state_programs_map.json successfully!');
