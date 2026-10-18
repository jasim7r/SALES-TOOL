import { Prospect, CaseStudy, TARGET_COMPANIES, CASE_STUDIES, INITIAL_PROSPECTS } from '../data/mockData';

// Helper to parse CSV string into rows and columns handling quoted fields with commas
export function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \r\n
      }
      currentRow.push(currentField.trim());
      if (currentRow.some((field) => field.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

// Convert parsed CSV rows into structured Prospect records
export function convertRowsToProspects(rows: string[][]): Prospect[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  const findCol = (possibleNames: string[]): number => {
    return headers.findIndex((h) => possibleNames.some((name) => h.includes(name)));
  };

  const nameIdx = findCol(['fullname', 'name', 'contact', 'leadname', 'person', 'executive']);
  const firstNameIdx = findCol(['firstname', 'first']);
  const lastNameIdx = findCol(['lastname', 'last']);
  const roleIdx = findCol(['jobtitle', 'title', 'role', 'position', 'designation']);
  const companyIdx = findCol(['company', 'organization', 'account', 'employer']);
  const emailIdx = findCol(['workemail', 'email', 'mail', 'inbox']);
  const phoneIdx = findCol(['directphone', 'phone', 'cell', 'mobile', 'telephone', 'number']);
  const techIdx = findCol(['techstack', 'tech', 'technologies', 'tools', 'software']);
  const empIdx = findCol(['employees', 'size', 'headcount', 'empcount', 'staff']);
  const arrIdx = findCol(['arr', 'revenue', 'turnover']);
  const locIdx = findCol(['location', 'city', 'state', 'country', 'region']);
  const stageIdx = findCol(['stage', 'round', 'funding', 'series']);

  const sampleAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB91qitRDsFronYviBvua7b_D--VSGCLddGOVemELB3qTDOr65c14itf6rrXqeLvm0oz9I21Z5_eOXYwQA4dUCMC2sKfxOM5KDqX9Gcca9zpFRDJWRrmNatbzcci6e6ZPRzeL6Y2uyQSNw0qmj5okiAga5wlxEePtO-Bav9edX5Fe7X0E-dPtKN8-OrXYsMQgAnsYcsPfT3ASvXHvCVNxmais__9Z6sDTb6R9uTpru30qK6PifjQd9G',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAJcmbE3I832MTgCjiRupUb_ahrnaxU0TdaAxq4B2ui2DIrSKdbLZK0qopssD8ZFXzUGfV6gVrgX54nnjuUwEvfxlH-t2lc5_XRKyslmUloVVd_shnyCL7wQxD1vodxvhr6G0uYJRrrBVy95n10xZOX8EAR7VAh5pE4EqqW9NjctxFjfX8DB1NxmZPvMeybY3dq_4kuEZdT0uyF-FywVOQjV07w1YZT4yk2pWERcbCni4zEJFj6d7Eq',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAh8AraxmKR0j1_IdEb6Lijp4k4aoRVjtKieUSimep71mJOOhw-uSFwz1qxj8QSi9HIH2SCqM86SrASZjAfgYuPqPfde71S12lnn4x7AImsChdYedfRa8uZ2Qy_RdTpTzF3NzsJPsDaObdHzV5plIU3Dj-SnuO62n8YhTmI4IZ31wtOxJ49pcs_GWPU7ugYYy6xxevZuVqwLdw-eOvIOarNJT4CiWmhOJyphPvu36l8nk_FS_lHCuJ0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAXMslEwukpOCFSoc8EuZrzY2M109Dp3S0nnghcTpMLQTKgmbvIdwFHDekbEtlr0bsf02ZuAe7AYvwKgpnFf3fg0bL5cveReaUUomlCXWxTPyj7fPJICGyH7VQxNkDLntcVnHoB4UNyTS5EqUR0xzc7hDoIrZrOsBthazbCDSjn2F3TRiDgQf9Hbebc4yE1RI8OTQvDWZ5DMyZr-lrinlQdeIDuvaMqCZkckzyujXa0GuC3FKu2RUi1',
  ];

  const prospects: Prospect[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2 || !row.some((cell) => cell.length > 0)) continue;

    let fullName = nameIdx >= 0 ? row[nameIdx] : '';
    if (!fullName && firstNameIdx >= 0) {
      fullName = `${row[firstNameIdx]} ${lastNameIdx >= 0 ? row[lastNameIdx] : ''}`.trim();
    }
    if (!fullName) fullName = `Lead #${i}`;

    const company = companyIdx >= 0 && row[companyIdx] ? row[companyIdx] : 'Enterprise Org';
    const role = roleIdx >= 0 && row[roleIdx] ? row[roleIdx] : 'Infrastructure Director';

    const cleanCompanyDomain = company.toLowerCase().replace(/[^a-z0-9]/g, '') + '.io';
    const cleanNameEmail = fullName.toLowerCase().replace(/[^a-z0-9]/g, '.');
    const verifiedEmail = emailIdx >= 0 && row[emailIdx] ? row[emailIdx] : `${cleanNameEmail}@${cleanCompanyDomain}`;

    const rawPhone = phoneIdx >= 0 && row[phoneIdx] ? row[phoneIdx] : '';
    const hasDirect = rawPhone.length > 7 && !rawPhone.toLowerCase().includes('ext');
    const directPhone = rawPhone || `+1 (415) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`;

    let techStack: string[] = [];
    if (techIdx >= 0 && row[techIdx]) {
      techStack = row[techIdx].split(/[,;|]/).map((t) => t.trim()).filter(Boolean);
    }
    if (techStack.length === 0) {
      techStack = ['Cloud DevOps', 'Kubernetes', 'AWS', 'Datadog'];
    }

    const empCount = empIdx >= 0 && row[empIdx] ? row[empIdx] : `${200 + ((i * 120) % 800)} emp`;
    const arr = arrIdx >= 0 && row[arrIdx] ? row[arrIdx] : `$${30 + ((i * 15) % 150)}M - $${60 + ((i * 25) % 200)}M ARR`;
    const location = locIdx >= 0 && row[locIdx] ? row[locIdx] : (i % 2 === 0 ? 'San Francisco, CA' : 'New York, NY');
    const stage = stageIdx >= 0 && row[stageIdx] ? row[stageIdx] : (i % 3 === 0 ? 'Series B' : i % 3 === 1 ? 'Series C' : 'Enterprise');

    // Calculate initials
    const nameParts = fullName.trim().split(/\s+/);
    const avatarInitials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : fullName.substring(0, 2).toUpperCase();

    // Intent score based on role seniority
    const isExecutive = /vp|director|chief|head|officer|lead|cfo|cto|cro/i.test(role);
    const intentScore = isExecutive ? 85 + (i % 14) : 72 + (i % 20);

    prospects.push({
      id: `lead-upload-${i}-${Date.now()}`,
      name: fullName,
      role,
      company,
      companyInitial: company.charAt(0).toUpperCase() || 'C',
      avatarUrl: i === 1 ? sampleAvatars[0] : (i % 4 === 0 ? sampleAvatars[i % sampleAvatars.length] : undefined),
      avatarInitials,
      empCount,
      arr,
      location,
      stage,
      verifiedEmail,
      directPhone,
      hasDirectMobile: hasDirect || (i % 4 !== 2),
      phoneType: (hasDirect || (i % 4 !== 2)) ? 'Direct Mobile' : 'Switchboard',
      techStack,
      intentScore,
      intentTier: intentScore >= 90 ? 'High' : intentScore >= 75 ? 'Med' : 'Low',
      resonanceScore: 88 + (i % 11),
      priorityTarget: isExecutive && intentScore >= 88,
      aiAugmented: true,
      recentSignal: `Recent LinkedIn announcement: ${company} expanding cloud infrastructure & hiring senior platform engineers`,
      matchedCaseStudyId: 'cs-1',
      selected: true,
    });
  }

  return prospects;
}

// Generate sample CSV text for users who want to download a template or load a demo file
export function generateSampleCSV(): string {
  return `Full Name,Job Title,Company Name,Work Email,Direct Phone,Tech Stack,Employees,ARR,Location,Stage
Sarah Chen,VP Infrastructure,CloudScale Inc,sarah.chen@cloudscale.io,+1 (415) 890-4421,"Cloud DevOps, Kubernetes, AWS, Datadog",250 emp,$45M - $80M ARR,San Francisco CA,Series B
Marcus Vance,CTO & Co-Founder,Apex Financial Systems,marcus.v@apexcloud.com,+1 (212) 555-8392,"Snowflake, Salesforce, AWS, Outreach",1200 emp,$100M - $250M ARR,New York NY,Enterprise
Elena Ward,VP of RevOps,DataPulse Analytics,elena.ward@datapulse.io,+1 (415) 672-9011,"Salesforce, AWS, HubSpot, Segment",450 emp,$50M - $100M ARR,San Francisco CA,Growth
Sarah Jenkins,Chief Commercial Officer,FinEdge Platform,sjenkins@finedge.com,+1 (512) 402-9910,"HubSpot, Segment, AWS, Stripe",310 emp,$35M - $60M ARR,Austin TX,Series C
David Ross,Director of Growth,NovaHealth Systems,dross@novahealth.org,+1 (617) 321-4478,"Salesforce, GCP, Snowflake",1200 emp,$180M ARR,Boston MA,Enterprise
Ananya Lakhani,VP Customer Success,OmniVault Security,ananya@omnivault.io,+1 (206) 882-7314,"AWS, Salesforce, Slack Ent",650 emp,$75M - $120M ARR,Seattle WA,Series C
Tariq Al-Mansoor,Head of Platform Eng,BioPulse Health,tariq@biopulse.com,+1 (650) 412-8821,"Kubernetes, Terraform, AWS, Docker",400 emp,$60M ARR,Palo Alto CA,Series C
Rachel Miller,VP Engineering,DataForge Analytics,rachel.m@dataforge.io,+1 (312) 992-1204,"Snowflake, dbt, AWS Lake Formation",180 emp,$25M ARR,Chicago IL,Growth`;
}

// Dynamically generate Case Studies matched to uploaded companies
export function generateCaseStudiesForProspects(prospects: Prospect[]): CaseStudy[] {
  if (prospects.length === 0) return CASE_STUDIES;

  const topProspect = prospects[0];
  const primaryCompany = topProspect.company;
  const primaryTech = topProspect.techStack[0] || 'Cloud Infrastructure';

  return [
    {
      id: 'cs-dyn-1',
      companyName: 'Datasync Cloud Technologies',
      targetCompanyId: topProspect.id,
      title: `How Datasync Reduced ${primaryTech} Downtime by 64% & Saved $420k Annually`,
      tags: [
        { label: `${primaryTech} Migration`, type: 'category' },
        { label: `Similar Size (${topProspect.empCount})`, type: 'size' },
        { label: `High Resonance Score ${topProspect.resonanceScore}%`, type: 'resonance' },
      ],
      challenge: `Scaling multi-region clusters at ${primaryCompany}'s tier led to latency spikes and excessive headroom egress costs during traffic bursts.`,
      solution: `Automated pipeline telemetry monitoring & dynamic spot-instance rebalancing with pre-flight resource caching.`,
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
        text: `RevIntel identified our architectural bottlenecks before our own team flagged the egress spikes. Within 21 days of deployment, our engineering velocity jumped while infrastructure overhead plummeted.`,
        author: 'Marcus Vance',
        role: 'CTO, Datasync Cloud Technologies',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh8AraxmKR0j1_IdEb6Lijp4k4aoRVjtKieUSimep71mJOOhw-uSFwz1qxj8QSi9HIH2SCqM86SrASZjAfgYuPqPfde71S12lnn4x7AImsChdYedfRa8uZ2Qy_RdTpTzF3NzsJPsDaObdHzV5plIU3Dj-SnuO62n8YhTmI4IZ31wtOxJ49pcs_GWPU7ugYYy6xxevZuVqwLdw-eOvIOarNJT4CiWmhOJyphPvu36l8nk_FS_lHCuJ0',
      },
      proofPoints: [
        `Trimmed $420k in annual wasted cloud capacity in 30 days`,
        `Dynamic spot-instance rebalancing without service disruption`,
        `Unified cloud telemetry hooked directly into Datadog & AWS`,
      ],
      attached: true,
    },
    {
      id: 'cs-dyn-2',
      companyName: 'FinCloud Core',
      targetCompanyId: topProspect.id,
      title: `Accelerating CI/CD Deployments by 4x for High-Growth B2B Platforms`,
      tags: [
        { label: 'Velocity & Efficiency', type: 'category' },
        { label: topProspect.stage || 'High-Growth', type: 'size' },
        { label: '91% Resonance Score', type: 'resonance' },
      ],
      challenge: `Engineers were waiting 45+ minutes per deployment cycle, delaying sprint deliverables and causing cluster synchronization deadlocks.`,
      solution: `Pre-flight container test acceleration and automated parallel telemetry verification pipelines.`,
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
        text: `Our engineering throughput doubled within two sprints. RevIntel gives our DevOps leads continuous predictability.`,
        author: 'Sophia Zhang',
        role: 'VP of Engineering, FinCloud Core',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJcmbE3I832MTgCjiRupUb_ahrnaxU0TdaAxq4B2ui2DIrSKdbLZK0qopssD8ZFXzUGfV6gVrgX54nnjuUwEvfxlH-t2lc5_XRKyslmUloVVd_shnyCL7wQxD1vodxvhr6G0uYJRrrBVy95n10xZOX8EAR7VAh5pE4EqqW9NjctxFjfX8DB1NxmZPvMeybY3dq_4kuEZdT0uyF-FywVOQjV07w1YZT4yk2pWERcbCni4zEJFj6d7Eq',
      },
      proofPoints: [
        `Increased release cadence from 2 releases/week to 8 releases/day`,
        `Eliminated ~14 hours per engineer monthly spent resolving dependency deadlocks`,
        `Native telemetry connects with existing Datadog and AWS setups in under 45 minutes`,
      ],
      attached: false,
    },
  ];
}
