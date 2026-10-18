export interface Prospect {
  id: string;
  name: string;
  role: string;
  company: string;
  companyInitial: string;
  avatarUrl?: string;
  avatarInitials: string;
  empCount: string;
  arr: string;
  location: string;
  stage: string;
  verifiedEmail: string;
  directPhone: string;
  hasDirectMobile: boolean;
  phoneType: 'Direct Mobile' | 'Switchboard';
  techStack: string[];
  intentScore: number;
  intentTier: 'High' | 'Med' | 'Low';
  resonanceScore: number;
  priorityTarget: boolean;
  aiAugmented: boolean;
  recentSignal: string;
  matchedCaseStudyId: string;
  selected?: boolean;
}

export interface CaseStudy {
  id: string;
  companyName: string;
  targetCompanyId: string;
  title: string;
  tags: { label: string; type: 'category' | 'size' | 'resonance' }[];
  challenge: string;
  solution: string;
  metrics: {
    stat: string;
    label: string;
    subtext: string;
    highlightColor: 'primary' | 'secondary' | 'dark';
  }[];
  quote: {
    text: string;
    author: string;
    role: string;
    avatarUrl: string;
  };
  proofPoints: string[];
  attached: boolean;
}

export interface ScriptToneVariation {
  opener: string;
  openerTag: string;
  painHook: string;
  painHookTag: string;
  proofPoint: string;
  proofPointTag: string;
  cta: string;
  ctaTag: string;
}

export const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: 'lead-1',
    name: 'Sarah Chen',
    role: 'VP Infrastructure',
    company: 'CloudScale Inc',
    companyInitial: 'C',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB91qitRDsFronYviBvua7b_D--VSGCLddGOVemELB3qTDOr65c14itf6rrXqeLvm0oz9I21Z5_eOXYwQA4dUCMC2sKfxOM5KDqX9Gcca9zpFRDJWRrmNatbzcci6e6ZPRzeL6Y2uyQSNw0qmj5okiAga5wlxEePtO-Bav9edX5Fe7X0E-dPtKN8-OrXYsMQgAnsYcsPfT3ASvXHvCVNxmais__9Z6sDTb6R9uTpru30qK6PifjQd9G',
    avatarInitials: 'SC',
    empCount: '250 emp',
    arr: '$45M - $80M ARR',
    location: 'San Francisco, CA (PST)',
    stage: 'Series B',
    verifiedEmail: 'sarah.chen@cloudscale.io',
    directPhone: '+1 (415) 890-4421',
    hasDirectMobile: true,
    phoneType: 'Direct Mobile',
    techStack: ['Cloud DevOps', 'Kubernetes', 'AWS', 'Datadog', 'Terraform'],
    intentScore: 94,
    intentTier: 'High',
    resonanceScore: 96,
    priorityTarget: true,
    aiAugmented: true,
    recentSignal: 'LinkedIn Signal (2 days ago): CloudScale 4x cluster expansion across AWS us-east',
    matchedCaseStudyId: 'cs-1',
    selected: true,
  },
  {
    id: 'lead-2',
    name: 'Elena Ward',
    role: 'VP of RevOps',
    company: 'DataPulse Analytics',
    companyInitial: 'EW',
    avatarInitials: 'EW',
    empCount: '450 emp',
    arr: '$50M - $100M ARR',
    location: 'San Francisco, CA',
    stage: 'Growth',
    verifiedEmail: 'elena.ward@datapulse.io',
    directPhone: '+1 (415) 672-9011',
    hasDirectMobile: true,
    phoneType: 'Direct Mobile',
    techStack: ['Salesforce', 'AWS', 'HubSpot'],
    intentScore: 92,
    intentTier: 'High',
    resonanceScore: 94,
    priorityTarget: true,
    aiAugmented: true,
    recentSignal: 'Hiring spike for 8 Senior Data Engineers announced on LinkedIn',
    matchedCaseStudyId: 'cs-4',
    selected: true,
  },
  {
    id: 'lead-3',
    name: 'Marcus Chen',
    role: 'Head of Sales Tech',
    company: 'Apex Cloudworks',
    companyInitial: 'MC',
    avatarInitials: 'MC',
    empCount: '820 emp',
    arr: '$100M - $250M ARR',
    location: 'New York, NY',
    stage: 'Enterprise',
    verifiedEmail: 'marcus.chen@apexcloud.com',
    directPhone: '+1 (212) 555-8392',
    hasDirectMobile: true,
    phoneType: 'Direct Mobile',
    techStack: ['Snowflake', 'Salesforce', 'Outreach'],
    intentScore: 95,
    intentTier: 'High',
    resonanceScore: 88,
    priorityTarget: true,
    aiAugmented: true,
    recentSignal: 'Migrating legacy BI reporting pipelines to Snowflake & AWS Lake Formation',
    matchedCaseStudyId: 'cs-2',
    selected: true,
  },
  {
    id: 'lead-4',
    name: 'Sarah Jenkins',
    role: 'Chief Commercial Officer',
    company: 'FinEdge Platform',
    companyInitial: 'SK',
    avatarInitials: 'SK',
    empCount: '310 emp',
    arr: '$35M - $60M ARR',
    location: 'Austin, TX',
    stage: 'Series C',
    verifiedEmail: 'sjenkins@finedge.com',
    directPhone: '+1 (512) 402-9910',
    hasDirectMobile: false,
    phoneType: 'Switchboard',
    techStack: ['HubSpot', 'Segment', 'AWS'],
    intentScore: 78,
    intentTier: 'Med',
    resonanceScore: 82,
    priorityTarget: false,
    aiAugmented: true,
    recentSignal: 'FinEdge launched new automated compliance suite for neo-banks',
    matchedCaseStudyId: 'cs-3',
    selected: true,
  },
  {
    id: 'lead-5',
    name: 'David Ross',
    role: 'Director of Growth',
    company: 'NovaHealth Systems',
    companyInitial: 'DR',
    avatarInitials: 'DR',
    empCount: '1,200 emp',
    arr: '$180M ARR',
    location: 'Boston, MA',
    stage: 'Enterprise',
    verifiedEmail: 'dross@novahealth.org',
    directPhone: '+1 (617) 321-4478',
    hasDirectMobile: true,
    phoneType: 'Direct Mobile',
    techStack: ['Salesforce', 'GCP', 'Snowflake'],
    intentScore: 81,
    intentTier: 'Med',
    resonanceScore: 85,
    priorityTarget: false,
    aiAugmented: true,
    recentSignal: 'Announced HIPAA-compliant patient intelligence data fabric',
    matchedCaseStudyId: 'cs-3',
    selected: true,
  },
  {
    id: 'lead-6',
    name: 'Ananya Lakhani',
    role: 'VP Customer Success',
    company: 'OmniVault Security',
    companyInitial: 'AL',
    avatarInitials: 'AL',
    empCount: '650 emp',
    arr: '$75M - $120M ARR',
    location: 'Seattle, WA',
    stage: 'Series C',
    verifiedEmail: 'ananya@omnivault.io',
    directPhone: '+1 (206) 882-7314',
    hasDirectMobile: true,
    phoneType: 'Direct Mobile',
    techStack: ['AWS', 'Salesforce', 'Slack Ent'],
    intentScore: 89,
    intentTier: 'High',
    resonanceScore: 89,
    priorityTarget: false,
    aiAugmented: true,
    recentSignal: 'Expanded SOC2 and FedRAMP certification footprint across SaaS customer base',
    matchedCaseStudyId: 'cs-2',
    selected: true,
  },
];

export const TARGET_COMPANIES = [
  {
    id: 'lead-1',
    name: 'CloudScale Inc',
    initial: 'C',
    stageAndSize: 'Series B • 250 emp',
    matchScore: '96% Match',
    highMatch: true,
    tags: ['Cloud DevOps', 'Kubernetes'],
    leadCount: 12,
  },
  {
    id: 'lead-3',
    name: 'Apex Financial Systems',
    initial: 'A',
    stageAndSize: 'Enterprise • 1,200 emp',
    matchScore: '88% Match',
    highMatch: false,
    tags: ['Fintech / PCI', 'Multi-Cloud'],
    leadCount: 18,
  },
  {
    id: 'lead-4',
    name: 'BioPulse Health',
    initial: 'B',
    stageAndSize: 'Series C • 400 emp',
    matchScore: '82% Match',
    highMatch: false,
    tags: ['HealthTech', 'HIPAA Reg'],
    leadCount: 9,
  },
  {
    id: 'lead-2',
    name: 'DataForge Analytics',
    initial: 'D',
    stageAndSize: 'Growth • 180 emp',
    matchScore: '79% Match',
    highMatch: false,
    tags: ['Data Infra', 'Snowflake'],
    leadCount: 15,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-1',
    companyName: 'Datasync Cloud Technologies',
    targetCompanyId: 'lead-1',
    title: 'How Datasync Reduced Infra Downtime by 64% & Saved $420k Annually',
    tags: [
      { label: 'DevOps / Cloud Migration', type: 'category' },
      { label: 'Similar Size (200-500 emp)', type: 'size' },
      { label: 'High Resonance Score 96%', type: 'resonance' },
    ],
    challenge: 'Scaling multi-region Kubernetes clusters led to latency spikes and high cloud egress fees during peak traffic bursts.',
    solution: 'Automated pipeline monitoring & automated resource provisioning with dynamic spot-instance rebalancing.',
    metrics: [
      {
        stat: '64%',
        label: 'Less Latency',
        subtext: 'Global 99th percentile',
        highlightColor: 'primary',
      },
      {
        stat: '$420K',
        label: 'Cost Reduction',
        subtext: 'Annualized cloud run-rate',
        highlightColor: 'secondary',
      },
      {
        stat: '3-Week',
        label: 'Payback Period',
        subtext: 'From rollout completion',
        highlightColor: 'dark',
      },
    ],
    quote: {
      text: 'RevIntel identified our architectural bottlenecks before our own team flagged the egress spikes. Within 21 days of deployment, our engineering velocity jumped while infrastructure overhead plummeted.',
      author: 'Marcus Vance',
      role: 'CTO, Datasync Cloud Technologies',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh8AraxmKR0j1_IdEb6Lijp4k4aoRVjtKieUSimep71mJOOhw-uSFwz1qxj8QSi9HIH2SCqM86SrASZjAfgYuPqPfde71S12lnn4x7AImsChdYedfRa8uZ2Qy_RdTpTzF3NzsJPsDaObdHzV5plIU3Dj-SnuO62n8YhTmI4IZ31wtOxJ49pcs_GWPU7ugYYy6xxevZuVqwLdw-eOvIOarNJT4CiWmhOJyphPvu36l8nk_FS_lHCuJ0',
    },
    proofPoints: [
      'Trimmed $420k in annual wasted cloud capacity in 30 days',
      'Dynamic spot-instance rebalancing without service disruption',
      'Unified cloud telemetry hooked directly into Datadog & AWS',
    ],
    attached: true,
  },
  {
    id: 'cs-2',
    companyName: 'FinCloud Core',
    targetCompanyId: 'lead-1',
    title: 'Accelerating CI/CD Deployments by 4x for High-Growth B2B Platforms',
    tags: [
      { label: 'Velocity & Efficiency', type: 'category' },
      { label: 'High-Growth B2B', type: 'size' },
      { label: '91% Resonance Score', type: 'resonance' },
    ],
    challenge: 'Developers were waiting 45+ minutes per build pipeline, stalling product ship velocity and causing production merge conflicts.',
    solution: 'Pre-flight resource caching, automated parallel container tests, and intelligent canary deployment verifications.',
    metrics: [
      {
        stat: '4.2x',
        label: 'Faster Build Pipeline',
        subtext: 'Down to 11 minutes flat',
        highlightColor: 'primary',
      },
      {
        stat: '14 hrs',
        label: 'Saved per Dev / Mo',
        subtext: 'Context switching eliminated',
        highlightColor: 'secondary',
      },
      {
        stat: '99.98%',
        label: 'Deployment Uptime',
        subtext: 'Zero rollbacks recorded',
        highlightColor: 'dark',
      },
    ],
    quote: {
      text: 'Our engineering throughput doubled within two sprints. RevIntel gives our DevOps leads continuous predictability.',
      author: 'Sophia Zhang',
      role: 'VP of Engineering, FinCloud Core',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJcmbE3I832MTgCjiRupUb_ahrnaxU0TdaAxq4B2ui2DIrSKdbLZK0qopssD8ZFXzUGfV6gVrgX54nnjuUwEvfxlH-t2lc5_XRKyslmUloVVd_shnyCL7wQxD1vodxvhr6G0uYJRrrBVy95n10xZOX8EAR7VAh5pE4EqqW9NjctxFjfX8DB1NxmZPvMeybY3dq_4kuEZdT0uyF-FywVOQjV07w1YZT4yk2pWERcbCni4zEJFj6d7Eq',
    },
    proofPoints: [
      'Increased release cadence from 2 releases/week to 8 releases/day',
      'Eliminated ~14 hours per engineer monthly spent resolving dependency deadlocks',
      'Native telemetry connects with existing Datadog and AWS setups in under 45 minutes',
    ],
    attached: false,
  },
];

export const TONE_SCRIPTS: Record<'consultative' | 'roi' | 'challenger', ScriptToneVariation> = {
  consultative: {
    opener: '"Hi Sarah, this is Alex from RevIntel. I saw your post on LinkedIn earlier this week celebrating CloudScale’s 4x cluster expansion across AWS us-east. Huge milestone for your DevOps team!"',
    openerTag: 'LinkedIn Signal (2 days ago)',
    painHook: '"Typically when teams scale Kubernetes nodes that quickly, they face 30%+ cloud compute waste in unoptimized provisioned headroom before finops can catch up. Are you seeing that drag on your Q3 infrastructure margins?"',
    painHookTag: 'Infra Waste Pattern',
    proofPoint: '"We recently partnered with Marcus over at Datasync during their hyperscale migration. In 4 weeks, our automated telemetry stripped out $420k in annual idle compute costs without touching a line of core deployment code."',
    proofPointTag: 'Datasync Benchmark',
    cta: '"I\'m not expecting a commitment today, Sarah. Do you have 15 minutes this Thursday afternoon to jump on a quick Google Meet so I can share the 3-page teardown Datasync used?"',
    ctaTag: '15-min discovery',
  },
  roi: {
    opener: '"Hi Sarah, Alex here with RevIntel. Quick question regarding CloudScale’s recent AWS footprint expansion: are you currently benchmarking idle compute spend against similar Series B SaaS platforms?"',
    openerTag: 'Direct Executive Hook',
    painHook: '"At your current scale of ~250 employees and multi-region Kubernetes clusters, unmanaged headroom is likely siphoning between $30,000 and $45,000 every single month directly out of gross margins."',
    painHookTag: 'Hard Dollar Leakage',
    proofPoint: '"Datasync unlocked $420k hard cash savings in 28 days with zero downtime. We guarantee a 10x ROI or our software is completely cost-neutral."',
    proofPointTag: '$420K Validated Savings',
    cta: '"Could you spare 10 minutes Wednesday at 2pm on Google Meet? I\'ll run your public telemetry against our cost model live on screen."',
    ctaTag: '10-min live audit',
  },
  challenger: {
    opener: '"Sarah, congratulations on the AWS 4x cluster rollout. Most VPs of Infrastructure tell me expanding compute so fast is exciting, but secretly terrifying for infrastructure margin predictability."',
    openerTag: 'Provocative Angle',
    painHook: '"The common mistake high-growth engineering orgs make is assuming Datadog alarms protect against idle node decay. They alert you after you get billed, they don\'t stop the bleed in real-time."',
    painHookTag: 'Assumption Disruption',
    proofPoint: '"Marcus Vance at Datasync had the exact same stance until we showed them 32% dormant node capacity that traditional APMs masked. We fixed it inside 3 weeks."',
    proofPointTag: 'Case Study Benchmark',
    cta: '"Are you open to having your assumptions challenged for 15 minutes on a short Google Meet this Friday, or is your cloud bill already 100% optimized?"',
    ctaTag: 'Executive Challenge',
  },
};

export const EMAIL_SEQUENCES = [
  {
    step: 1,
    title: 'Step 1 of 3 (Initial Strategic Value Prop)',
    openRate: '92% Open Rate Benchmark',
    subject: "CloudScale's cloud efficiency + Datasync benchmark",
    bodyParagraphs: [
      'Hi Sarah,',
      "Noticed CloudScale’s recent expansion in public cloud clusters. When VP's scale infrastructure at your cadence, idle compute overhead tends to creep up by ~30% before standard DevOps audits flag it.",
      'Would you be open to a 15-minute sync this week to explore if similar efficiency gains apply to CloudScale\'s current AWS architecture?',
    ],
    snippet: '"RevIntel trimmed $420k in annual wasted cloud capacity for Datasync within 30 days of telemetry integration."',
    gmeetLink: 'meet.google.com/xyz-demo-sc',
  },
  {
    step: 2,
    title: 'Step 2 of 3 (Technical Architectural Breakdown)',
    openRate: '88% Open Rate Benchmark',
    subject: "3-page Kubernetes teardown for CloudScale's DevOps leads",
    bodyParagraphs: [
      'Sarah,',
      'Following up on my note regarding AWS us-east node provisioning. I put together the exact 3-page teardown Marcus Vance used at Datasync before their spot-instance optimization.',
      'No pitch deck—just pure architecture diagrams and Terraform module snippets.',
    ],
    snippet: '"Payback period took under 21 days from rollout completion, with zero production failovers."',
    gmeetLink: 'meet.google.com/xyz-demo-sc',
  },
  {
    step: 3,
    title: 'Step 3 of 3 (Direct Executive Breakup / Permission Hook)',
    openRate: '79% Open Rate Benchmark',
    subject: 'Closing loop on CloudScale cloud efficiency',
    bodyParagraphs: [
      'Hi Sarah,',
      'I know scaling multi-region infrastructure keeps you slammed with sprint planning. If optimizing compute waste isn\'t on your roadmap this quarter, no problem at all.',
      'If you ever want the self-funding AWS cost remediation benchmark, grab 10 minutes on my Google Meet below anytime.',
    ],
    snippet: '"RevIntel guarantees self-funding within the first 60 days via verified AWS credits."',
    gmeetLink: 'meet.google.com/xyz-demo-sc',
  },
];
