export interface IEPAccommodation {
  id: string;
  category: 'Visual & Environmental' | 'Sensory & Regulation' | 'Academic & Task' | 'Speech & Social' | 'Behavior & Motivation' | 'Motor & Mobility';
  title: string;
  description: string;
  rationale: string;
}

export interface SMARTGoalTemplate {
  id: string;
  title: string;
  diagnosis: string;
  gradeBand: 'Preschool/TK' | 'Elementary' | 'Middle & High School';
  area: 'Social Skills' | 'Focus & Attention' | 'Executive Function' | 'Reading & Writing' | 'Sensory Regulation' | 'Behavior' | 'Self-Advocacy' | 'Communication';
  templateText: string;
  defaultTokens: {
    name: string;
    timeline: string;
    baseline?: string;
    target?: string;
    [key: string]: string | undefined;
  };
}

export const IEP_ACCOMMODATIONS: IEPAccommodation[] = [
  // Sensory & Regulation
  {
    id: 'acc-noise-headphones',
    category: 'Sensory & Regulation',
    title: 'Noise-Canceling Headphones',
    description: 'Provide access to noise-canceling headphones during independent work, assemblies, or cafeteria times.',
    rationale: 'Reduces auditory overload and helps the student maintain focus in high-stimulus environments.'
  },
  {
    id: 'acc-sensory-breaks',
    category: 'Sensory & Regulation',
    title: 'Scheduled Sensory Breaks',
    description: 'Allow student to take scheduled 5-minute sensory/movement breaks every 45-60 minutes in a designated quiet space.',
    rationale: 'Allows the nervous system to reset, preventing emotional or behavioral escalation due to sensory fatigue.'
  },
  {
    id: 'acc-flexible-seating',
    category: 'Sensory & Regulation',
    title: 'Flexible Seating Options',
    description: 'Offer a wobble stool, sensory cushion, standing desk, or option to work on a carpet area.',
    rationale: 'Allows subtle movement (vestibular input) that helps children with ADHD or sensory seeking needs maintain focus.'
  },
  {
    id: 'acc-fidget-tools',
    category: 'Sensory & Regulation',
    title: 'Discrete Fidget Tools',
    description: 'Permit use of discrete hand-fidgets (e.g., stress balls, putty, textured strips under desk) during direct instruction.',
    rationale: 'Supplies fine-motor sensory input to improve attention and mitigate physical restlessness.'
  },

  // Visual & Environmental
  {
    id: 'acc-visual-schedule',
    category: 'Visual & Environmental',
    title: 'Individual Visual Schedule',
    description: 'Provide a visual daily schedule (using icons or check-lists) on the student’s desk, updated daily.',
    rationale: 'Promotes independence and reduces anxiety during transitions by making the daily routine predictable.'
  },
  {
    id: 'acc-preferred-seating',
    category: 'Visual & Environmental',
    title: 'Preferred Seating near Instruction',
    description: 'Seat the student near the point of instruction and away from high-distraction zones (e.g., doors, windows, loud air vents).',
    rationale: 'Enhances focus and allows the teacher to quickly prompt and redirect the student without drawing peer attention.'
  },
  {
    id: 'acc-min-visual-clutter',
    category: 'Visual & Environmental',
    title: 'Reduced Visual Distractions',
    description: 'Present worksheets with fewer items per page, larger print, or use cover sheets to block extra sections.',
    rationale: 'Prevents cognitive overload and tracking errors for students with visual processing differences or ADHD.'
  },

  // Academic & Task
  {
    id: 'acc-extra-time',
    category: 'Academic & Task',
    title: 'Extended Time for Assignments',
    description: 'Allow 50% additional time (1.5x) to complete tests, exams, and lengthy written assignments.',
    rationale: 'Removes the anxiety of time pressure, allowing students with slow processing speed or dyslexia to show true competency.'
  },
  {
    id: 'acc-chunk-tasks',
    category: 'Academic & Task',
    title: 'Chunking of Multi-Step Tasks',
    description: 'Break down large assignments into smaller steps, checking in with the student after each subtask is finished.',
    rationale: 'Supports weak executive functioning by converting overwhelming projects into achievable checkpoints.'
  },
  {
    id: 'acc-reduced-writing',
    category: 'Academic & Task',
    title: 'Reduced Writing / Scribe Access',
    description: 'Allow speech-to-text tools, typing on a keyboard, or verbal testing answers for assignments requiring long-form writing.',
    rationale: 'Bypasses dysgraphia or motor-fatigue barriers, enabling the child to communicate conceptual knowledge independently.'
  },
  {
    id: 'acc-graphic-organizers',
    category: 'Academic & Task',
    title: 'Pre-written Graphic Organizers',
    description: 'Provide checklists, visual math charts, or paragraph guides before asking the student to write or solve problems.',
    rationale: 'Acts as cognitive scaffolding, aiding working memory retrieval and logical planning.'
  },

  // Speech & Social
  {
    id: 'acc-visual-timer',
    category: 'Speech & Social',
    title: 'Visual Countdown Timers',
    description: 'Use a visual timer (e.g., Time Timer) to indicate remaining duration of play or transition intervals.',
    rationale: 'Creates a concrete representation of elapsed time, which is critical for children with receptive delays or autism.'
  },
  {
    id: 'acc-peer-pairing',
    category: 'Speech & Social',
    title: 'Supported Social Grouping',
    description: 'Intentionally group the student with empathetic, pro-social peers during group work or cooperative play.',
    rationale: 'Creates safe social opportunities and models positive social communication skills naturally.'
  },
  {
    id: 'acc-speech-supports',
    category: 'Speech & Social',
    title: 'Alternative Communication (AAC) Inclusion',
    description: 'Ensure the student’s AAC device, picture board, or communication symbols are present and modeled by all staff members.',
    rationale: 'Supports non-verbal communication systems and helps ensure the student can participate consistently throughout the school day.'
  },

  // Behavior & Motivation
  {
    id: 'acc-positive-reinforcement',
    category: 'Behavior & Motivation',
    title: 'Token Economy & Visual Tracker',
    description: 'Utilize a visual "first-then" board or token reward chart to reward completion of non-preferred tasks.',
    rationale: 'Increases motivation and task compliance by offering immediate, visual reinforcement goals.'
  },
  {
    id: 'acc-cool-down',
    category: 'Behavior & Motivation',
    title: 'Designated Cool-Down Space',
    description: 'Permit student to self-initiate a transition to a designated "cool-down corner" or calm sensory room when feeling overwhelmed.',
    rationale: 'Supports self-regulation and de-escalation, preventing outbursts and physical safety risks.'
  },

  // Motor & Mobility
  {
    id: 'acc-pencil-grip',
    category: 'Motor & Mobility',
    title: 'Pencil Grips & Slanted Boards',
    description: 'Provide molded rubber pencil grips and a 20-degree slanted binder/board for writing tasks.',
    rationale: 'Improves handwriting ergonomics and reduces wrist fatigue associated with fine-motor delays.'
  },
  {
    id: 'acc-adaptive-paper',
    category: 'Motor & Mobility',
    title: 'Adaptive Writing Paper',
    description: 'Provide writing paper with raised lines or bold/colored margins to guide letter sizing and alignment.',
    rationale: 'Helps students with spatial awareness issues or fine-motor deficits control pencil strokes.'
  }
];

export const SMART_GOAL_TEMPLATES: SMARTGoalTemplate[] = [
  // AUTISM spectrum goals
  {
    id: 'goal-asd-social',
    title: 'Peer Social Interaction (Cooperative Play)',
    diagnosis: 'Autism Spectrum Disorder (ASD)',
    gradeBand: 'Preschool/TK',
    area: 'Social Skills',
    templateText: 'When participating in a structured small-group play activity, {{name}} will cooperatively share materials or take turns with peers, with no more than {{prompts}} verbal/visual prompt(s), in {{success_rate}} of opportunities across {{trials}} consecutive school weeks, as measured by teacher observation.',
    defaultTokens: {
      name: 'the student',
      prompts: '1',
      success_rate: '80%',
      trials: '4',
      timeline: 'by the next annual review'
    }
  },
  {
    id: 'goal-asd-transition',
    title: 'Smooth Transition Between Activities',
    diagnosis: 'Autism Spectrum Disorder (ASD)',
    gradeBand: 'Elementary',
    area: 'Behavior',
    templateText: 'When transitioning from a preferred task to a non-preferred task (using visual schedule and visual timers), {{name}} will transition within {{duration}} minutes, without screaming or refusing, in {{success_rate}} of observed trials over {{trials}} consecutive weeks, as documented by behavioral charts.',
    defaultTokens: {
      name: 'the student',
      duration: '2',
      success_rate: '85%',
      trials: '3',
      timeline: 'within one year'
    }
  },
  {
    id: 'goal-asd-sensory',
    title: 'Self-Regulation & Sensory Breaks',
    diagnosis: 'Autism Spectrum Disorder (ASD)',
    gradeBand: 'Middle & High School',
    area: 'Sensory Regulation',
    templateText: 'When experiencing sensory overload or emotional frustration, {{name}} will independently identify the need for a break and use a visual break card to request a 5-minute cool-down, increasing independence from a baseline of {{baseline}} to {{target}} of opportunities, over {{trials}} consecutive progress reports.',
    defaultTokens: {
      name: 'the student',
      baseline: 'needing teacher prompts 100% of the time',
      target: 'self-advocating independently 90% of the time',
      trials: '4',
      timeline: 'by June 2027'
    }
  },

  // ADHD goals
  {
    id: 'goal-adhd-attention',
    title: 'On-Task Academic Focus',
    diagnosis: 'Attention Deficit Hyperactivity Disorder (ADHD)',
    gradeBand: 'Elementary',
    area: 'Focus & Attention',
    templateText: 'During a {{work_duration}}-minute independent work session, {{name}} will remain focused on the assigned academic task (defined as sitting at desk, working on task, and utilizing sensory tools) for at least {{on_task_min}} minutes, requiring no more than {{redirections}} redirection(s) per session, in {{success_rate}} of sessions across {{weeks}} weeks.',
    defaultTokens: {
      name: 'the student',
      work_duration: '20',
      on_task_min: '15',
      redirections: '2 verbal prompts',
      success_rate: '80%',
      weeks: '4',
      timeline: 'by the end of the school year'
    }
  },
  {
    id: 'goal-adhd-org',
    title: 'Executive Function (Organization & Submission)',
    diagnosis: 'Attention Deficit Hyperactivity Disorder (ADHD)',
    gradeBand: 'Middle & High School',
    area: 'Executive Function',
    templateText: 'To improve executive functioning, {{name}} will record all daily assignments in their digital planner and pack their backpack with required binders/supplies, achieving a success rate of {{target}} (up from a baseline of {{baseline}}), as verified by a daily checklist signed by the student and resource specialist.',
    defaultTokens: {
      name: 'the student',
      baseline: '40% tracking compliance',
      target: '90% organization accuracy',
      timeline: 'for the next grading period'
    }
  },
  {
    id: 'goal-adhd-impulsivity',
    title: 'Waiting to Speak / Reducing Call-outs',
    diagnosis: 'Attention Deficit Hyperactivity Disorder (ADHD)',
    gradeBand: 'Preschool/TK',
    area: 'Behavior',
    templateText: 'During circle time or large-group discussions, {{name}} will raise their hand and wait to be called upon before speaking, with no more than {{reminders}} physical/visual reminder(s), in {{success_rate}} of group sessions over {{trials}} evaluation periods.',
    defaultTokens: {
      name: 'the student',
      reminders: '1 visual hand card',
      success_rate: '75%',
      trials: '5 consecutive days',
      timeline: 'within 6 months'
    }
  },

  // Speech & Language delay goals
  {
    id: 'goal-speech-exp',
    title: 'Expressive Language (Sentence Structure)',
    diagnosis: 'Speech and Language Delay',
    gradeBand: 'Preschool/TK',
    area: 'Communication',
    templateText: 'During conversation, {{name}} will express wants, needs, and ideas by producing complete sentences containing at least {{words_count}} words including target subject/verb markers, with no more than {{cues}} model cue(s), in {{success_rate}} of attempts across {{trials}} speech-therapy sessions.',
    defaultTokens: {
      name: 'the student',
      words_count: '4 to 5',
      cues: '1 visual/verbal sentence-frame',
      success_rate: '80%',
      trials: '10',
      timeline: 'by the annual IEP date'
    }
  },
  {
    id: 'goal-speech-directions',
    title: 'Receptive Language (Multi-Step Directions)',
    diagnosis: 'Speech and Language Delay',
    gradeBand: 'Elementary',
    area: 'Communication',
    templateText: 'When presented with {{steps_count}} multi-step directions containing academic and spatial concepts (e.g. "Get your book, turn to page 5, and circle the title"), {{name}} will listen, repeat if necessary, and execute the steps in sequence with {{prompts}} prompt(s) at {{success_rate}} accuracy across {{trials}} data collection periods.',
    defaultTokens: {
      name: 'the student',
      steps_count: '3-step',
      prompts: 'no more than 1 clarifying',
      success_rate: '80%',
      trials: '4 out of 5 opportunities',
      timeline: 'by the next IEP review'
    }
  },

  // Specific Learning Disability (Dyslexia, Dysgraphia) goals
  {
    id: 'goal-sld-reading',
    title: 'Reading Decoding (Phonic Patterns)',
    diagnosis: 'Specific Learning Disability (SLD)',
    gradeBand: 'Elementary',
    area: 'Reading & Writing',
    templateText: 'When presented with a list of {{words_type}} words (e.g., CVCE, multi-syllable, or sight words), {{name}} will correctly decode/read the words aloud at a rate of {{words_per_minute}} correct words per minute, increasing from a baseline of {{baseline}} to {{target}}, across {{trials}} consecutive assessments.',
    defaultTokens: {
      name: 'the student',
      words_type: 'grade-level phonetically regular and irregular',
      words_per_minute: '65',
      baseline: '30 words per minute',
      target: '65 words per minute with 95% decoding accuracy',
      trials: '3',
      timeline: 'by the end of the IEP period'
    }
  },
  {
    id: 'goal-sld-comp',
    title: 'Reading Comprehension (Summarizing)',
    diagnosis: 'Specific Learning Disability (SLD)',
    gradeBand: 'Middle & High School',
    area: 'Reading & Writing',
    templateText: 'After reading a grade-level expository or literary passage, {{name}} will write or dictate a summary identifying the main idea and supporting details, scoring {{score_target}} out of 4 points on a standardized writing rubric, in {{success_rate}} of attempts over {{weeks}} weeks.',
    defaultTokens: {
      name: 'the student',
      score_target: '3',
      success_rate: '80%',
      weeks: '4',
      timeline: 'by the annual IEP date'
    }
  },
  {
    id: 'goal-sld-advocacy',
    title: 'Self-Advocacy for Accommodations',
    diagnosis: 'Specific Learning Disability (SLD)',
    gradeBand: 'Middle & High School',
    area: 'Self-Advocacy',
    templateText: 'When given a complex classroom assignment or exam, {{name}} will independently request their approved accommodation (e.g., "I need 1.5x time" or "I need to type this") from the general education teacher prior to starting, increasing from a baseline of {{baseline}} to {{target}} of opportunities across {{trials}} grading periods.',
    defaultTokens: {
      name: 'the student',
      baseline: '0% self-advocacy (requiring teacher reminders)',
      target: '80% independent request rate',
      trials: '2 consecutive grading periods',
      timeline: 'by the next annual IEP review'
    }
  }
];
