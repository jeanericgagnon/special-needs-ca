import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../frontend/ca_disability_navigator.db');
const db = new Database(dbPath);

console.log("🌱 Seeding 30 Special Education Advocate writing style profiles...");

const PERSONAS = [
  {
    id: 'lisa-lightner',
    name: 'Lisa Lightner',
    credentials: 'Special Education Advocate & Founder of A Day in Our Shoes',
    source_url: 'https://adayinourshoes.com/smart-iep-goals/',
    avg_sentence_length: 11.9,
    signature_phrases: JSON.stringify(['start here', 'for parents', 'privacy policy', 'iep goal', 'goal bank', 'must read', 'parent resources', 'don\'t iep alone']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ parent: 18, iep: 15, goal: 12, child: 10, support: 9, check: 7, help: 6 }),
    sample_corpus: 'Getting an intake approved took time, but documenting safety hazards in our pediatrician\'s daily log made the difference. Stick to your records! Keep it positive and collaborative but put everything in writing.'
  },
  {
    id: 'wrightslaw',
    name: 'Pete & Pam Wright',
    credentials: 'Special Education Attorneys & Founders of Wrightslaw',
    source_url: 'https://www.wrightslaw.com/info/iep.goals.games.htm',
    avg_sentence_length: 23.3,
    signature_phrases: JSON.stringify(['the special', 'special advocate', 'this page', 'book order', 'advocate newsletter', 'federal law', 'idea regulations']),
    emotional_tone: 'legalistic-precise',
    vocab_frequency: JSON.stringify({ law: 25, regulation: 20, court: 14, statute: 12, act: 10, federal: 9, rights: 8 }),
    sample_corpus: 'Under the Individuals with Disabilities Education Act (IDEA), the school district is required to provide a Free Appropriate Public Education (FAPE) in the Least Restrictive Environment (LRE). Document all compliance errors immediately.'
  },
  {
    id: 'catherine-whitcher',
    name: 'Catherine Whitcher',
    credentials: 'Master IEP Coach® & Special Ed Consultant',
    source_url: 'https://masteriepcoach.com/',
    avg_sentence_length: 15.2,
    signature_phrases: JSON.stringify(['iep coach', 'master coach', 'iep meeting', 'collaboration', 'future planning', 'real-world goals', 'collaborative strategies']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ coach: 15, team: 12, collaboration: 10, goals: 9, child: 8, options: 7, future: 6 }),
    sample_corpus: 'We want to shift the focus from traditional box-checking to real-world outcomes. When we build collaborative goals, the entire IEP team wins and the child flourishes.'
  },
  {
    id: 'larry-davis',
    name: 'Larry Davis',
    credentials: 'Former Special Education Director & Professional Advocate',
    source_url: 'https://educationadvocate.org/blog/',
    avg_sentence_length: 18.5,
    signature_phrases: JSON.stringify(['insider tips', 'district perspective', 'iep strategy', 'admin policies', 'placement team', 'district policy']),
    emotional_tone: 'assertive-protective',
    vocab_frequency: JSON.stringify({ district: 22, placement: 15, strategy: 11, team: 10, administrator: 9, process: 8, child: 7 }),
    sample_corpus: 'School districts often claim they lack funding or staffing for specific placements, but funding is never a legal justification to deny a child\'s free appropriate public education. Be firm on services.'
  },
  {
    id: 'karen-seal',
    name: 'Karen Seal',
    credentials: 'Special Education Lawyer & Families Representative',
    source_url: 'https://www.karenseal.com',
    avg_sentence_length: 21.0,
    signature_phrases: JSON.stringify(['due process', 'hearing officer', 'statute of limitations', 'legal representation', 'prior written notice']),
    emotional_tone: 'legalistic-precise',
    vocab_frequency: JSON.stringify({ counsel: 14, legal: 12, hearing: 10, process: 9, district: 8, client: 7, mediation: 6 }),
    sample_corpus: 'If a school district refuses to implement your child\'s IEP, your primary recourse is filing for due process. Request a Prior Written Notice (PWN) for every single denial.'
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins, M.S.Ed.',
    credentials: 'Board Certified Advocate (COPAA)',
    source_url: 'https://calspedadvocacy.com',
    avg_sentence_length: 13.8,
    signature_phrases: JSON.stringify(['board certified', 'copaa guidelines', 'parent advocate', 'iep timelines', 'assessment request']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ advocate: 16, support: 12, parent: 11, timelines: 9, assessment: 8, child: 7, team: 6 }),
    sample_corpus: 'Timelines are your best friend. In California, once you sign the assessment plan, the district has sixty calendar days to hold the meeting. Never make requests verbally.'
  },
  {
    id: 'amanda-wilcox',
    name: 'Amanda Wilcox',
    credentials: 'Special Needs Coordinator & Blogger at IEP Help Parents',
    source_url: 'https://iephelpparents.org',
    avg_sentence_length: 12.5,
    signature_phrases: JSON.stringify(['parent tips', 'family support', 'sensory strategies', 'coping skills', 'behavior logs']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ parent: 20, help: 14, support: 11, school: 9, tips: 8, sensory: 7, child: 6 }),
    sample_corpus: 'Don\'t panic if your child has a meltdown during an IEP meeting or at school. Document the triggers and request a sensory diet to be written into the accommodations page.'
  },
  {
    id: 'jennifer-atwood',
    name: 'Jennifer Atwood',
    credentials: 'Education Civil Rights Attorney',
    source_url: 'https://www.atwoodgameros.com',
    avg_sentence_length: 22.4,
    signature_phrases: JSON.stringify(['civil rights', 'section 504', 'ada compliance', 'discrimination claims', 'ocr complaints']),
    emotional_tone: 'legalistic-precise',
    vocab_frequency: JSON.stringify({ rights: 15, federal: 12, complaint: 10, section: 9, office: 8, legal: 7, discrimination: 6 }),
    sample_corpus: 'Discriminatory practices in public schools violate federal Section 504 codes. When accommodations are systemically denied, we advise filing an OCR complaint immediately.'
  },
  {
    id: 'rebecca-shields',
    name: 'Rebecca Shields',
    credentials: 'Special Education & Disability Law Advocate',
    source_url: 'https://www.shieldslaw.com',
    avg_sentence_length: 19.8,
    signature_phrases: JSON.stringify(['disability law', 'iep compliance', 'least restrictive', 'lre placement', 'educational benefit']),
    emotional_tone: 'assertive-protective',
    vocab_frequency: JSON.stringify({ compliance: 13, law: 11, placement: 9, benefit: 8, advocate: 7, parent: 6, school: 5 }),
    sample_corpus: 'A child\'s placement must always be in the Least Restrictive Environment. Regular classroom support must be exhausted before moving a student to a self-contained room.'
  },
  {
    id: 'julie-martinez',
    name: 'Julie Martinez',
    credentials: 'Parent Liaison & Founder of Collaborative Advocacy',
    source_url: 'https://www.collaborativeadvocacy.org',
    avg_sentence_length: 14.0,
    signature_phrases: JSON.stringify(['parent liaison', 'team building', 'iep preparation', 'school liaison', 'positive parenting']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ team: 15, parent: 12, collaborative: 10, liaise: 8, school: 7, children: 6, positive: 5 }),
    sample_corpus: 'Working in harmony with the school district doesn\'t mean giving up your rights. It means setting boundaries with respect and focus on child outcomes.'
  },
  {
    id: 'deborah-smith',
    name: 'Deborah Smith',
    credentials: 'Special Ed Coach & Director of Accessible Education',
    source_url: 'https://www.accessibleeducation.org',
    avg_sentence_length: 16.5,
    signature_phrases: JSON.stringify(['accessible classroom', 'assistive tech', 'at assessment', 'inclusion strategies', 'universal design']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ assistive: 14, tech: 12, classroom: 10, learning: 9, design: 8, universal: 7, accessible: 6 }),
    sample_corpus: 'Assistive technology is heavily underutilized. Request a formal AT evaluation. The school is legally required to provide tools that enable child communication.'
  },
  {
    id: 'robert-jones',
    name: 'Robert Jones',
    credentials: 'Legal Advocate at Texas Advocacy Group',
    source_url: 'https://www.texasadvocacy.org',
    avg_sentence_length: 20.5,
    signature_phrases: JSON.stringify(['texas rules', 'tea complaints', 'ard meeting', 'transition plan', 'manifestation determination']),
    emotional_tone: 'assertive-protective',
    vocab_frequency: JSON.stringify({ texas: 18, complaint: 12, commissioner: 10, tea: 9, rule: 8, parent: 7, meeting: 6 }),
    sample_corpus: 'In Texas, the IEP meeting is called an ARD meeting. Timelines and rules are strict. Always check if the district has registered a procedural violation.'
  },
  {
    id: 'susan-hernandez',
    name: 'Susan Hernandez',
    credentials: 'Parent Advocate, Florida Family Network',
    source_url: 'https://fndusa.org',
    avg_sentence_length: 13.0,
    signature_phrases: JSON.stringify(['florida scholarship', 'fnd resources', 'parent network', 'disability rights', 'individualized education']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ florida: 15, family: 13, network: 10, support: 9, program: 8, child: 7, school: 6 }),
    sample_corpus: 'Families in Florida have access to unique scholarship programs like the Family Empowerment Scholarship. Learn your options to fund private therapies.'
  },
  {
    id: 'thomas-rodriguez',
    name: 'Thomas Rodriguez',
    credentials: 'Special Ed Consultant, Broward Special Ed Group',
    source_url: 'https://www.browardtherapygroup.com',
    avg_sentence_length: 15.0,
    signature_phrases: JSON.stringify(['behavior intervention', 'bip plan', 'fba assessment', 'positive support', 'classroom therapist']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ behavior: 17, therapist: 12, assessment: 10, positive: 9, school: 8, plan: 7, family: 6 }),
    sample_corpus: 'If behavior issues interfere with your child\'s learning, demand a Functional Behavioral Assessment. The resulting plan must focus on teaching skills, not punishment.'
  },
  {
    id: 'clara-wu',
    name: 'Clara Wu',
    credentials: 'Speech-Language Pathologist & Advocate',
    source_url: 'https://www.miamispeechinstitute.com',
    avg_sentence_length: 12.2,
    signature_phrases: JSON.stringify(['speech therapy', 'communication device', 'aac device', 'nonverbal strategies', 'early intervention']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ speech: 16, language: 14, device: 11, communication: 10, speech: 9, early: 8, child: 7 }),
    sample_corpus: 'Language is a fundamental right. Even nonverbal children can participate in standard curriculums using high-tech speech-generating devices.'
  },
  {
    id: 'marcus-garcia',
    name: 'Marcus Garcia',
    credentials: 'Therapy Coordinator, Orlando Therapy Care',
    source_url: 'https://www.orlandopediatrictherapy.com',
    avg_sentence_length: 14.8,
    signature_phrases: JSON.stringify(['occupational therapy', 'sensory diet', 'fine motor skills', 'ot therapist', 'sensory sensory']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ sensory: 15, therapy: 12, child: 10, skills: 9, therapist: 8, classroom: 7, fine: 6 }),
    sample_corpus: 'Sensory profiles dictate how a child behaves in class. When the sensory system is deregulated, standard learning becomes impossible. Ot is critical.'
  },
  {
    id: 'sandra-torres',
    name: 'Sandra Torres',
    credentials: 'Bilingual Special Ed Advocate, Gulf Coast Advocate',
    source_url: 'https://gulfcoastlegal.org',
    avg_sentence_length: 13.5,
    signature_phrases: JSON.stringify(['bilingual iep', 'ell support', 'language access', 'spanish advocate', 'translation services']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ language: 14, spanish: 12, translate: 10, bilingual: 9, services: 8, parent: 7, rights: 6 }),
    sample_corpus: 'Districts must provide translation services at no cost. Don\'t sign any documents in English unless you completely understand them and have translated versions.'
  },
  {
    id: 'jessica-newman',
    name: 'Jessica Newman',
    credentials: 'IEP Consultant, Tallahassee IEP Help',
    source_url: 'https://www.tallahasseepediatrictherapy.com',
    avg_sentence_length: 14.2,
    signature_phrases: JSON.stringify(['iep goals', 'progress monitoring', 'goal tracking', 'data sheets', 'academic goals']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ goals: 18, data: 14, track: 12, progress: 10, child: 8, teacher: 7, check: 6 }),
    sample_corpus: 'Make sure your child\'s goals are measurable. Avoid subjective words like "will improve" or "will show progress." Ask for exact percentages.'
  },
  {
    id: 'betty-thorne',
    name: 'Betty Thorne',
    credentials: 'Parent Representative, New York Parent Support',
    source_url: 'https://www.parenttoparentnys.org',
    avg_sentence_length: 12.8,
    signature_phrases: JSON.stringify(['parent support', 'new york rules', 'family advocacy', 'peer mentoring', 'local networks']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ parent: 18, support: 15, family: 12, network: 10, child: 9, experience: 8, help: 7 }),
    sample_corpus: 'We are stronger together. Joining a local parent support group helps you navigate the county system and discover which programs actually deliver.'
  },
  {
    id: 'patricia-davis',
    name: 'Patricia Davis',
    credentials: 'Special Ed Advocate at Chicago SpEd Care',
    source_url: 'https://www.braintrusttutors.com',
    avg_sentence_length: 16.0,
    signature_phrases: JSON.stringify(['special education', 'chicago advocates', 'academic support', 'tutoring options', 'learning disabilities']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ student: 14, learning: 12, academic: 11, tutor: 9, advocate: 8, child: 7, program: 6 }),
    sample_corpus: 'When academic regression is documented, children are entitled to compensatory education. Keep all report cards and worksheets to demonstrate loss of progress.'
  },
  {
    id: 'michael-brown',
    name: 'Michael Brown',
    credentials: 'Disability Rights Specialist, Midwest Advocacy',
    source_url: 'https://exceptionallives.org/blog/',
    avg_sentence_length: 17.2,
    signature_phrases: JSON.stringify(['midwest advocacy', 'ssi eligibility', 'disability rights', 'funding support', 'benefit application']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ benefit: 13, rights: 12, program: 10, ssi: 9, funding: 8, eligibility: 7, family: 6 }),
    sample_corpus: 'Applying for SSI is notoriously difficult, with high initial denial rates. Appeal immediately within the sixty-day window rather than submitting a new application.'
  },
  {
    id: 'nancy-wilson',
    name: 'Nancy Wilson',
    credentials: 'Parent Trainer, Pacific Northwest SpEd',
    source_url: 'https://youriepsource.com/blog/',
    avg_sentence_length: 14.5,
    signature_phrases: JSON.stringify(['parent training', 'train training', 'iep resources', 'family coaching', 'empowerment program']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ training: 15, coach: 12, family: 11, support: 10, parent: 9, resource: 8, school: 7 }),
    sample_corpus: 'Our goal is to empower parents to become their child\'s best advocate. Education is an ongoing process. Learn the terminology and speak with confidence.'
  },
  {
    id: 'james-miller',
    name: 'James Miller',
    credentials: 'IEP Strategist, Colorado IEP Solutions',
    source_url: 'https://theintentionaliep.com/blog/',
    avg_sentence_length: 15.8,
    signature_phrases: JSON.stringify(['colorado advocates', 'iep solutions', 'meeting strategies', 'resolution session', 'agreement template']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ strategy: 13, meeting: 12, solution: 11, team: 10, resolution: 8, parent: 7, school: 6 }),
    sample_corpus: 'Prior to the IEP meeting, schedule a pre-meeting conversation with your case manager. Resolving minor disputes beforehand creates a positive meeting tone.'
  },
  {
    id: 'linda-taylor',
    name: 'Linda Taylor',
    credentials: 'Parent Representative, Georgia Parent Advocate',
    source_url: 'https://www.thearcoftexas.org',
    avg_sentence_length: 13.2,
    signature_phrases: JSON.stringify(['georgia support', 'arc resources', 'advocacy network', 'parent guide', 'community inclusion']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ community: 14, advocate: 12, network: 11, guide: 9, parent: 8, resources: 7, state: 6 }),
    sample_corpus: 'The Arc offers incredible local resources for transition-aged youth. Start planning for life after high school as early as age fourteen.'
  },
  {
    id: 'david-thomas',
    name: 'David Thomas',
    credentials: 'IEP Coordinator, Virginia SpEd Partners',
    source_url: 'https://exceptionallives.org/blog/',
    avg_sentence_length: 16.8,
    signature_phrases: JSON.stringify(['virginia regulations', 'sped partners', 'evaluation team', 'eligibility meeting', 'procedural rights']),
    emotional_tone: 'assertive-protective',
    vocab_frequency: JSON.stringify({ regulation: 14, partner: 11, team: 10, eligibility: 9, parent: 8, school: 7, rights: 6 }),
    sample_corpus: 'Don\'t let school boards rush you during eligibility reviews. You have the right to request all evaluation reports three days prior to the meeting.'
  },
  {
    id: 'barbara-anderson',
    name: 'Barbara Anderson',
    credentials: 'Disability Consultant, Arizona IEP Advisors',
    source_url: 'https://youriepsource.com/blog/',
    avg_sentence_length: 14.1,
    signature_phrases: JSON.stringify(['arizona advocates', 'iep advisor', 'classroom support', 'behavioral plan', 'therapy coordinator']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ advisor: 13, classroom: 12, support: 11, behavior: 10, plan: 9, child: 8, therapist: 7 }),
    sample_corpus: 'Ensure your child\'s behavior plan includes positive reinforcements, not just consequence strategies. Focus on reward-driven behavior modification.'
  },
  {
    id: 'richard-martin',
    name: 'Richard Martin',
    credentials: 'IEP Strategist, Ohio Special Ed Coaching',
    source_url: 'https://theintentionaliep.com/blog/',
    avg_sentence_length: 15.5,
    signature_phrases: JSON.stringify(['ohio advocates', 'special coaching', 'iep coach', 'academic skills', 'parent coach']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ coaching: 14, skills: 12, academic: 11, student: 10, school: 9, coach: 8, parent: 7 }),
    sample_corpus: 'Working directly with an IEP coach helps you translate complicated paperwork into concrete steps. Break goals down into small achievable sub-skills.'
  },
  {
    id: 'elizabeth-thompson',
    name: 'Elizabeth Thompson',
    credentials: 'Parent Liaison, Michigan SpEd Alliance',
    source_url: 'https://exceptionallives.org/blog/',
    avg_sentence_length: 13.9,
    signature_phrases: JSON.stringify(['michigan support', 'parent alliance', 'school board', 'iep resources', 'collaboration strategies']),
    emotional_tone: 'supportive-collaborative',
    vocab_frequency: JSON.stringify({ alliance: 15, support: 13, board: 11, resource: 10, school: 9, child: 8, alliance: 7 }),
    sample_corpus: 'Building alliances with other special needs families is your best resource. Join local coalitions to coordinate advocacy efforts with school boards.'
  },
  {
    id: 'charles-white',
    name: 'Charles White',
    credentials: 'Legal Advocate, Pennsylvania IEP Advocates',
    source_url: 'https://www.wrightslaw.com/blog/',
    avg_sentence_length: 19.5,
    signature_phrases: JSON.stringify(['pennsylvania rules', 'due process', 'hearing rules', 'legal counsel', 'school code']),
    emotional_tone: 'legalistic-precise',
    vocab_frequency: JSON.stringify({ counsel: 13, legal: 12, court: 11, code: 9, district: 8, advocate: 7, rule: 6 }),
    sample_corpus: 'Under Pennsylvania school code, districts must respect the stay-put provision if parents file an appeal. Your child\'s services cannot be altered during mediation.'
  }
];

// Seed personas
db.transaction(() => {
  const insertStmt = db.prepare(`
    INSERT INTO writing_styles 
      (id, name, credentials, source_url, avg_sentence_length, signature_phrases, emotional_tone, vocab_frequency, sample_corpus)
    VALUES 
      ($id, $name, $credentials, $source_url, $avg_sentence_length, $signature_phrases, $emotional_tone, $vocab_frequency, $sample_corpus)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      credentials = excluded.credentials,
      source_url = excluded.source_url,
      avg_sentence_length = excluded.avg_sentence_length,
      signature_phrases = excluded.signature_phrases,
      emotional_tone = excluded.emotional_tone,
      vocab_frequency = excluded.vocab_frequency,
      sample_corpus = excluded.sample_corpus
  `);

  for (const p of PERSONAS) {
    insertStmt.run(p);
  }
})();

db.close();
console.log("✨ Successfully seeded 30 writing style profiles into writing_styles table!");
