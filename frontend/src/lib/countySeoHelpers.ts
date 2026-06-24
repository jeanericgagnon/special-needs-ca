import { County, CountyOffice, SchoolDistrict, NonprofitOrganization, RegionalCenter, Selpa } from './db';

export interface CountyDetails extends County {
  countyOffices?: CountyOffice[];
  schoolDistricts?: SchoolDistrict[];
  localOrganizations?: NonprofitOrganization[];
  regionalCenters?: RegionalCenter[];
  selpas?: Selpa[];
}

export function getCountyMetadata(
  stateId: string,
  stateName: string,
  stateCode: string,
  countyDetails: CountyDetails
) {
  const countyName = countyDetails.name;
  let title = `${countyName} County Special Needs Benefits & Resources (${stateCode})`;
  let description = `Find local service helpline numbers, school district offices, and catchment boundaries for ${countyName} County, ${stateName}.`;

  const verifiedOffice = countyDetails.countyOffices?.find(
    (o: CountyOffice) => o.verification_status === 'official_verified'
  )?.office_name;

  if (stateId === 'texas') {
    const eciContractor = countyDetails.regionalCenters?.[0]?.name;
    title = `${countyName} County ECI & LIDDA Special Needs Resources, TX`;
    description = `Access local resource coordinates for families in ${countyName} County, Texas. Includes ${
      eciContractor || 'Early Childhood Intervention (ECI)'
    } contacts, local health and human services offices, and school district IEP departments.`;
  } else if (stateId === 'florida') {
    const apdOffice = countyDetails.regionalCenters?.[0]?.name;
    title = `${countyName} County APD Waiver & Special Needs Resources, FL`;
    description = `Find contact numbers and intake details for the ${
      apdOffice || 'APD Area Office'
    } serving ${countyName} County, Florida, plus local school district student services and nonprofit support networks.`;
  } else if (stateId === 'pennsylvania') {
    const mhIdOffice =
      verifiedOffice || 'County MH/ID program coordinates';
    title = `${countyName} County MH/ID Office & Early Intervention, PA`;
    description = `Get verified intake phone lines, school district intermediate units, and local support networks for ${countyName} County, Pennsylvania, including ${mhIdOffice}.`;
  } else if (stateId === 'california') {
    const rcName = countyDetails.regionalCenters?.[0]?.name || 'Local Regional Center';
    title = `${countyName} County Regional Center & IHSS Benefits, CA`;
    description = `Navigate developmental disability services in ${countyName} County, California. Contact ${rcName}, check school district SELPA boundaries, and look up IHSS caregiver wage rates.`;
  }

  return { title, description };
}

export function getCountyIntroCopy(
  stateId: string,
  stateName: string,
  stateCode: string,
  countyDetails: CountyDetails,
  countyWage: number,
  catchmentLabel: string,
  _insuranceLabel: string
) {
  const countyName = countyDetails.name;
  
  if (stateId === 'texas') {
    const eciContract = countyDetails.regionalCenters?.[0]?.name || 'a local ECI contractor';
    return `For families navigating special needs in ${countyName} County, Texas, services are split by age and department:
1. **Under Age 3 (Early Childhood Intervention):** Your local intake is managed by **${eciContract}**. This is a localized program coordinating physical, occupational, and speech therapies at home or daycare.
2. **Age 3 and Older (LIDDA):** Your primary point of contact for developmental waivers (like HCS, CLASS, and TxHmL) is your Local Intellectual and Developmental Disability Authority (LIDDA). They coordinate long-term services and interest list placements.
3. **Medicaid & Caregiver Wages:** General benefits and the MDCP program are administered by the Texas Health and Human Services Commission (HHSC). The current caregiver hourly wage for Medicaid-funded home care in ${countyName} is **$${countyWage.toFixed(2)}/hour**.
4. **School Special Education:** School districts (listed below) coordinate local evaluations and Individualized Education Programs (IEPs) for school-aged children.`;
  }

  if (stateId === 'florida') {
    const apdName = countyDetails.regionalCenters?.[0]?.name || 'the local APD Area Office';
    return `Navigating disability benefits in ${countyName} County, Florida, involves several local and state pathways:
1. **Developmental Waivers (APD):** Intakes for the iBudget and CDC+ home and community-based waivers are managed by **${apdName}**. You should contact them directly to apply and check your placement on the APD waitlist.
2. **Early Intervention (Under 3):** Early Steps serves as the local coordinating body for infant and toddler developmental delays, offering in-home therapies and assessments.
3. **General Benefits & Medicaid:** The Florida Department of Children and Families (DCF) county office handles eligibility determination for Medicaid health insurance. The caregiver/respite provider hourly rate under Florida waivers averages **$${countyWage.toFixed(2)}/hour** in this county.
4. **Special Education:** School-aged children receive evaluations, therapies, and IEP planning directly through their county's school district student services department.`;
  }

  if (stateId === 'pennsylvania') {
    const officeName = countyDetails.countyOffices?.[0]?.office_name || 'the County MH/ID Office';
    return `For parents in ${countyName} County, Pennsylvania, the local developmental disability support structure consists of:
1. **County MH/ID Intake (Primary Starting Point):** The **${officeName}** acts as the local hub for both early intervention services (ages 0-3) and county-administered intellectual disability funding and waiver intakes. 
2. **Preschool & School-Age Special Education:** Early intervention for children ages 3-5 is coordinated by regional Intermediate Units (IUs). Once a child reaches kindergarten, special education and IEPs are managed by their local school district.
3. **Medicaid & Home Care:** General Medicaid eligibility is handled by your local County Assistance Office (CAO). The caregiver/respite hourly rate in ${countyName} County averages **$${countyWage.toFixed(2)}/hour**.`;
  }

  if (stateId === 'california') {
    const rcName = countyDetails.regionalCenters?.[0]?.name || 'your local Regional Center';
    return `Families seeking disability services in ${countyName} County, California, have access to a structured local system:
1. **Regional Center Coordination:** Intake for the Lanterman Act, Early Start (0-3), and the Self-Determination Program is managed by **${rcName}**. They serve as the single point of coordination for lifelong developmental services.
2. **In-Home Support (IHSS):** The county Department of Social Services administers the IHSS program for personal care services. In ${countyName} County, the provider hourly wage is **$${countyWage.toFixed(2)}/hour**.
3. **Special Education boundaries:** School districts are grouped into Special Education Local Plan Areas (SELPAs) to share resources and coordinate regional services.`;
  }

  // Default fallback for other states
  return `If you live in ${countyName} County, ${stateName}, your child has access to several layers of specialized support. Under local state rules, the Medicaid caregiver/respite wage rate is **$${countyWage.toFixed(2)}/hour**. Use the listings below to contact your local ${catchmentLabel} intake coordinator, find your local health and human services office, look up school district special education contacts, and browse verified community support resources.`;
}
