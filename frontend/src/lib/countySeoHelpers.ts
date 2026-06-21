import { County, CountyOffice, RegionalCenter } from './db';

interface CountyDetailsInput extends County {
  countyOffices?: CountyOffice[];
  regionalCenters?: RegionalCenter[];
}

export function getCountyMetadata(
  stateId: string,
  stateName: string,
  stateCode: string,
  countyDetails: CountyDetailsInput
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

function getDeterministicIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash) % max;
}

export function getCountyIntroCopy(
  stateId: string,
  stateName: string,
  stateCode: string,
  countyDetails: CountyDetailsInput,
  countyWage: number | null | undefined,
  catchmentLabel: string,
  insuranceLabel: string
) {
  const countyName = countyDetails.name;
  const wage = countyWage && countyWage > 0 ? countyWage : 0;
  
  const seed = countyDetails.id || countyName;
  const variationIndex = getDeterministicIndex(seed, 3);

  if (stateId === 'texas') {
    const eciContract = countyDetails.regionalCenters?.[0]?.name || 'a local ECI contractor';
    
    // Wage sentences
    const wageSentence0 = wage > 0 
      ? `The current caregiver hourly wage for Medicaid-funded home care in ${countyName} is **$${wage.toFixed(2)}/hour**.`
      : `The caregiver hourly wage for Medicaid-funded home care in ${countyName} is currently **verification pending**.`;
    
    const wageSentence1 = wage > 0
      ? `Medicaid home care programs in ${countyName} currently support a caregiver pay rate of **$${wage.toFixed(2)}/hour**.`
      : `The standard caregiver wage rate for Medicaid home care services in ${countyName} is currently **verification pending**.`;
      
    const wageSentence2 = wage > 0
      ? `Home care caregivers under Medicaid waiver plans in ${countyName} are paid a rate of **$${wage.toFixed(2)}/hour**.`
      : `At present, state Medicaid caregiver payment rates for ${countyName} are **verification pending**.`;

    const variations = [
      `For families navigating special needs in ${countyName} County, Texas, services are split by age and department:
1. **Under Age 3 (Early Childhood Intervention):** Your local intake is managed by **${eciContract}**. This is a localized program coordinating physical, occupational, and speech therapies at home or daycare.
2. **Age 3 and Older (LIDDA):** Your primary point of contact for developmental waivers (like HCS, CLASS, and TxHmL) is your Local Intellectual and Developmental Disability Authority (LIDDA). They coordinate long-term services and interest list placements.
3. **Medicaid & Caregiver Wages:** General benefits and the MDCP program are administered by the Texas Health and Human Services Commission (HHSC). ${wageSentence0}
4. **School Special Education:** School districts (listed below) coordinate local evaluations and Individualized Education Programs (IEPs) for school-aged children.`,

      `Navigating the developmental and special needs support systems in ${countyName} County, Texas, requires understanding how programs are divided:
1. **Early Childhood Intervention (Under 3):** Localized therapies (physical, occupational, speech) are coordinated by **${eciContract}** for infants and toddlers in their natural environments.
2. **LIDDA Services (Ages 3+):** Your Local Intellectual and Developmental Disability Authority (LIDDA) acts as the local hub for long-term Medicaid waiver interest lists, including HCS, CLASS, and TxHmL.
3. **Medicaid & Caregiver Wages:** HHSC handles general healthcare eligibility and home-based service administration. ${wageSentence1}
4. **Special Education Programs:** Local school districts (listed below) evaluate children and develop Individualized Education Programs (IEPs) for school-aged students.`,

      `If you are raising a child with special needs in ${countyName} County, Texas, your local support structure is organized around several key departments:
1. **Infants & Toddlers (Early Start/ECI):** Therapeutic coordination for children under 3 is managed by **${eciContract}** to address developmental delays early.
2. **Long-Term Developmental Supports (LIDDA):** To apply for state waivers like HCS, TxHmL, or CLASS, you must contact your Local Intellectual and Developmental Disability Authority (LIDDA) to begin the intake process.
3. **Medicaid Administration:** Caregiver support and medical coverage fall under the Texas Health and Human Services Commission (HHSC). ${wageSentence2}
4. **School-Age IEP Services:** Public school districts within the county are responsible for providing specialized academic instruction and accommodations.`
    ];

    return variations[variationIndex];
  }

  if (stateId === 'florida') {
    const apdName = countyDetails.regionalCenters?.[0]?.name || 'the local APD Area Office';
    
    // Wage sentences
    const wageSentence0 = wage > 0
      ? `The caregiver/respite provider hourly rate under Florida waivers averages **$${wage.toFixed(2)}/hour** in this county.`
      : `The caregiver/respite provider hourly rate under Florida waivers in this county is currently **verification pending**.`;

    const wageSentence1 = wage > 0
      ? `Within the county, caregiver and respite wages for state-sponsored waivers average **$${wage.toFixed(2)}/hour**.`
      : `The caregiver reimbursement rate for waiver-funded support in this county is **verification pending** at this time.`;

    const wageSentence2 = wage > 0
      ? `Under local Medicaid waivers, caregivers receive an average payment rate of **$${wage.toFixed(2)}/hour**.`
      : `Official caregiver and respite provider pay rates in this county are currently **verification pending**.`;

    const variations = [
      `Navigating disability benefits in ${countyName} County, Florida, involves several local and state pathways:
1. **Developmental Waivers (APD):** Intakes for the iBudget and CDC+ home and community-based waivers are managed by **${apdName}**. You should contact them directly to apply and check your placement on the APD waitlist.
2. **Early Intervention (Under 3):** Early Steps serves as the local coordinating body for infant and toddler developmental delays, offering in-home therapies and assessments.
3. **General Benefits & Medicaid:** The Florida Department of Children and Families (DCF) county office handles eligibility determination for Medicaid health insurance. ${wageSentence0}
4. **Special Education:** School-aged children receive evaluations, therapies, and IEP planning directly through their county's school district student services department.`,

      `Families seeking disability and developmental support in ${countyName} County, Florida, must coordinate across multiple agencies:
1. **Agency for Persons with Disabilities (APD):** The local contact for home and community-based services (iBudget/CDC+ waivers) is **${apdName}**. Reach out to them to start the application and check waitlist status.
2. **Early Steps (Ages 0-3):** Infants and toddlers experiencing developmental delays are served by the local Early Steps provider, who coordinates early intervention assessments.
3. **Medicaid Eligibility:** DCF processes general benefits and Medicaid health insurance applications. ${wageSentence1}
4. **IEP & School Services:** The local county school district coordinates evaluations, accommodations, and specialized instruction for eligible students.`,

      `If you live in ${countyName} County, Florida, and are coordinating care for a child with special needs, these are the key agencies to contact:
1. **APD Waiver Intake:** Long-term Medicaid waivers like iBudget are administered locally by **${apdName}**, where you can submit applications and track your waitlist position.
2. **Infant & Toddler Early Intervention:** The Early Steps program coordinates speech, occupational, and physical therapies for children under age three.
3. **Health Coverage & Assistance:** The Florida Department of Children and Families (DCF) determines eligibility for Medicaid. ${wageSentence2}
4. **School-Age Special Education:** Local school districts (listed below) are responsible for evaluating students and implementing Individualized Education Programs (IEPs).`
    ];

    return variations[variationIndex];
  }

  if (stateId === 'pennsylvania') {
    const officeName = countyDetails.countyOffices?.[0]?.office_name || 'the County MH/ID Office';
    
    // Wage sentences
    const wageSentence0 = wage > 0
      ? `The caregiver/respite hourly rate in ${countyName} County averages **$${wage.toFixed(2)}/hour**.`
      : `The caregiver/respite hourly rate in ${countyName} County is currently **verification pending**.`;

    const wageSentence1 = wage > 0
      ? `The standard hourly pay rate for respite providers and caregivers in ${countyName} County is **$${wage.toFixed(2)}/hour**.`
      : `Respite care hourly wages for families in ${countyName} County are currently **verification pending**.`;

    const wageSentence2 = wage > 0
      ? `Under Pennsylvania waiver systems, home care wages in ${countyName} County average **$${wage.toFixed(2)}/hour**.`
      : `The caregiver payment rate for local waiver programs in ${countyName} County is **verification pending**.`;

    const variations = [
      `For parents in ${countyName} County, Pennsylvania, the local developmental disability support structure consists of:
1. **County MH/ID Intake (Primary Starting Point):** The **${officeName}** acts as the local hub for both early intervention services (ages 0-3) and county-administered intellectual disability funding and waiver intakes. 
2. **Preschool & School-Age Special Education:** Early intervention for children ages 3-5 is coordinated by regional Intermediate Units (IUs). Once a child reaches kindergarten, special education and IEPs are managed by their local school district.
3. **Medicaid & Home Care:** General Medicaid eligibility is handled by your local County Assistance Office (CAO). ${wageSentence0}`,

      `Navigating the special needs system in ${countyName} County, Pennsylvania, involves several core public resources:
1. **County Intellectual Disabilities (MH/ID) Office:** Your primary point of entry for developmental waivers and birth-to-three early intervention is **${officeName}**.
2. **Schooling & Intermediate Units (IUs):** Intermediate Units handle early intervention for preschool-aged children (3-5), while local school districts manage IEP services for kindergarten through graduation.
3. **Medicaid & Caregiver Support:** Your County Assistance Office (CAO) handles applications for Medical Assistance (Medicaid). ${wageSentence1}`,

      `If you are raising a child with developmental delays or special needs in ${countyName} County, Pennsylvania, here is how services are organized:
1. **MH/ID County Administration:** Call **${officeName}** to request intake for intellectual disability services, waiver programs, and early intervention for infants.
2. **Educational Support & IEPs:** Preschool services are coordinated by the regional Intermediate Unit, and school-aged special education is handled directly by local school districts.
3. **Medicaid Benefits:** The County Assistance Office (CAO) manages eligibility for state health insurance benefits. ${wageSentence2}`
    ];

    return variations[variationIndex];
  }

  if (stateId === 'california') {
    const rcName = countyDetails.regionalCenters?.[0]?.name || 'your local Regional Center';
    
    // Wage sentences
    const wageSentence0 = wage > 0
      ? `In ${countyName} County, the provider hourly wage is **$${wage.toFixed(2)}/hour**.`
      : `In ${countyName} County, the provider hourly wage is currently **verification pending**.`;

    const wageSentence1 = wage > 0
      ? `The official IHSS provider hourly wage for ${countyName} County is established at **$${wage.toFixed(2)}/hour**.`
      : `The IHSS caregiver wage rate in ${countyName} County is currently **verification pending**.`;

    const wageSentence2 = wage > 0
      ? `Caregivers under the IHSS program in ${countyName} County receive an hourly wage of **$${wage.toFixed(2)}/hour**.`
      : `The caregiver pay rate for the county IHSS program is currently **verification pending**.`;

    const variations = [
      `Families seeking disability services in ${countyName} County, California, have access to a structured local system:
1. **Regional Center Coordination:** Intake for the Lanterman Act, Early Start (0-3), and the Self-Determination Program is managed by **${rcName}**. They serve as the single point of coordination for lifelong developmental services.
2. **In-Home Support (IHSS):** The county Department of Social Services administers the IHSS program for personal care services. ${wageSentence0}
3. **Special Education boundaries:** School districts are grouped into Special Education Local Plan Areas (SELPAs) to share resources and coordinate regional services.`,

      `For special needs families in ${countyName} County, California, local resources are divided into three primary agencies:
1. **Regional Centers:** Your local office is **${rcName}**, coordinating developmental services, Early Start (ages 0-2), and Lanterman Act eligibility.
2. **In-Home Supportive Services (IHSS):** The Department of Public Social Services handles IHSS caregiver programs. ${wageSentence1}
3. **SELPA & School Districts:** Special education is organized through local Special Education Local Plan Areas (SELPAs) to coordinate services across school districts.`,

      `Navigating developmental and educational benefits in ${countyName} County, California, involves coordinating with these primary local entities:
1. **Developmental Services Intake:** **${rcName}** manages regional coordination for Lanterman services, Self-Determination, and Early Start.
2. **Caregiver Wages & IHSS:** In-home care hours are administered by the county Department of Social Services. ${wageSentence2}
3. **Special Education (SELPA):** Local school districts coordinate assessments and IEP planning within regional SELPA configurations.`
    ];

    return variations[variationIndex];
  }

  // Default fallback for other states
  const wageSentence0 = wage > 0
    ? `Under local state rules, the Medicaid caregiver/respite wage rate is **$${wage.toFixed(2)}/hour**.`
    : `Under local state rules, the Medicaid caregiver/respite wage rate is currently **verification pending**.`;

  const wageSentence1 = wage > 0
    ? `The state-allocated caregiver hourly pay rate for respite and support services is **$${wage.toFixed(2)}/hour**.`
    : `State caregiver and respite payment rates for this county are currently **verification pending**.`;

  const wageSentence2 = wage > 0
    ? `Under local state programs, caregiver compensation is set at **$${wage.toFixed(2)}/hour**.`
    : `The caregiver pay scale under home-based Medicaid waivers is currently **verification pending**.`;

  const variations = [
    `If you live in ${countyName} County, ${stateName}, your child has access to several layers of specialized support. ${wageSentence0} Use the listings below to contact your local ${catchmentLabel} intake coordinator, find your local health and human services office, look up school district special education contacts, and browse verified community support resources.`,
    
    `Families residing in ${countyName} County, ${stateName}, can access multiple local resources and programs for children with special needs. ${wageSentence1} Browse the details below to reach your local ${catchmentLabel} coordinator, contact health and human services, connect with local school district special education offices, and find community support networks.`,
    
    `Navigating disability resources in ${countyName} County, ${stateName}, is simplified by contacting the correct local offices. ${wageSentence2} The listings below provide coordinate information for your local ${catchmentLabel} intake team, health and welfare administration, school district special education departments, and verified nonprofit support groups.`
  ];

  return variations[variationIndex];
}
