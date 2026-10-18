import React, { useState, useMemo } from 'react';
import { Prospect } from '../../data/mockData';

interface OutreachStudioScreenProps {
  prospect: Prospect | null;
  allProspects: Prospect[];
  onSelectProspect: (prospect: Prospect) => void;
  onStartDialer: (prospect: Prospect) => void;
  onShowToast: (message: string) => void;
  onOpenSync: () => void;
  onGoToImport: () => void;
}

export const OutreachStudioScreen: React.FC<OutreachStudioScreenProps> = ({
  prospect,
  allProspects,
  onSelectProspect,
  onStartDialer,
  onShowToast,
  onOpenSync,
  onGoToImport,
}) => {
  const [tone, setTone] = useState<'consultative' | 'roi' | 'challenger'>('consultative');
  const [sequenceStep, setSequenceStep] = useState<number>(1);
  const [isEditingSubject, setIsEditingSubject] = useState(false);
  const [customSubject, setCustomSubject] = useState<string | null>(null);
  const [showProspectDropdown, setShowProspectDropdown] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [rebuttalsOpen, setRebuttalsOpen] = useState({ 0: true, 1: false });

  // Dynamically tailor script to current prospect
  const dynamicScript = useMemo(() => {
    if (!prospect) return null;
    const pName = prospect.name.split(' ')[0] || prospect.name;
    const pComp = prospect.company;
    const pRole = prospect.role;
    const pTech = prospect.techStack[0] || 'infrastructure';

    if (tone === 'consultative') {
      return {
        opener: `"Hi ${pName}, this is Alex from RevIntel. I saw ${pComp}'s recent growth signals celebrating your team's expansion across ${pTech}. Huge milestone for your engineering org!"`,
        openerTag: `LinkedIn Signal (Verified)`,
        painHook: `"Typically when teams scale ${pTech} that quickly, they face 30%+ compute headroom waste before internal audits can flag it. Are you seeing that drag on ${pComp}'s quarterly margins?"`,
        painHookTag: 'Headroom Leakage Pattern',
        proofPoint: `"We recently partnered with Marcus over at Datasync during their hyperscale migration. In 4 weeks, our automated telemetry stripped out $420k in annual idle compute costs without touching a line of core deployment code."`,
        proofPointTag: 'Datasync Benchmark',
        cta: `"I'm not expecting a commitment today, ${pName}. Do you have 15 minutes this Thursday afternoon to jump on a quick Google Meet so I can share the 3-page teardown Datasync used?"`,
        ctaTag: '15-min discovery',
      };
    } else if (tone === 'roi') {
      return {
        opener: `"Hi ${pName}, Alex here with RevIntel. Quick question regarding ${pComp}'s recent ${pTech} expansion: are you currently benchmarking idle compute spend against similar ${prospect.stage} SaaS platforms?"`,
        openerTag: 'Direct Executive Hook',
        painHook: `"At your current scale of ${prospect.empCount} and multi-region clusters, unmanaged headroom is likely siphoning between $30,000 and $45,000 every single month directly out of gross margins."`,
        painHookTag: 'Hard Dollar Leakage',
        proofPoint: `"Datasync unlocked $420k hard cash savings in 28 days with zero downtime. We guarantee a 10x ROI or our software is completely cost-neutral."`,
        proofPointTag: '$420K Validated Savings',
        cta: `"Could you spare 10 minutes Wednesday at 2pm on Google Meet? I'll run ${pComp}'s telemetry against our cost model live on screen."`,
        ctaTag: '10-min live audit',
      };
    } else {
      return {
        opener: `"${pName}, congratulations on ${pComp}'s ${pTech} rollout. Most ${pRole}s tell me expanding compute infrastructure so fast is exciting, but secretly stressful for margin predictability."`,
        openerTag: 'Provocative Angle',
        painHook: `"The common mistake high-growth engineering orgs make is assuming legacy APM monitoring tools protect against idle node decay. They alert you after you get billed, they don't stop the bleed in real-time."`,
        painHookTag: 'Assumption Disruption',
        proofPoint: `"Marcus Vance at Datasync had the exact same stance until we showed them 32% dormant node capacity that traditional APMs masked. We fixed it inside 3 weeks."`,
        proofPointTag: 'Case Study Benchmark',
        cta: `"Are you open to having your assumptions challenged for 15 minutes on a short Google Meet this Friday, or is ${pComp}'s cloud bill already 100% optimized?"`,
        ctaTag: 'Executive Challenge',
      };
    }
  }, [prospect, tone]);

  // Dynamically tailor email sequence
  const dynamicEmail = useMemo(() => {
    if (!prospect) return null;
    const pName = prospect.name.split(' ')[0] || prospect.name;
    const pComp = prospect.company;
    const pTech = prospect.techStack[0] || 'infrastructure';

    if (sequenceStep === 1) {
      return {
        title: 'Step 1 of 3 (Initial Strategic Value Prop)',
        openRate: '92% Open Rate Benchmark',
        defaultSubject: `${pComp}'s ${pTech} efficiency + Datasync benchmark`,
        paragraphs: [
          `Hi ${pName},`,
          `Noticed ${pComp}’s recent expansion in public cloud clusters. When executive teams scale infrastructure at your cadence, idle compute overhead tends to creep up by ~30% before standard DevOps audits flag it.`,
          `Would you be open to a 15-minute sync this week to explore if similar efficiency gains apply to ${pComp}'s current architecture?`,
        ],
        snippet: `"RevIntel trimmed $420k in annual wasted cloud capacity for Datasync within 30 days of telemetry integration."`,
      };
    } else if (sequenceStep === 2) {
      return {
        title: 'Step 2 of 3 (Technical Architectural Breakdown)',
        openRate: '88% Open Rate Benchmark',
        defaultSubject: `3-page ${pTech} teardown for ${pComp}'s engineering leads`,
        paragraphs: [
          `${pName},`,
          `Following up on my note regarding ${pComp}'s node provisioning. I put together the exact 3-page teardown Marcus Vance used at Datasync before their spot-instance optimization.`,
          `No pitch deck—just pure architecture diagrams and Terraform module snippets.`,
        ],
        snippet: `"Payback period took under 21 days from rollout completion, with zero production failovers."`,
      };
    } else {
      return {
        title: 'Step 3 of 3 (Direct Executive Breakup / Permission Hook)',
        openRate: '79% Open Rate Benchmark',
        defaultSubject: `Closing loop on ${pComp} cloud efficiency`,
        paragraphs: [
          `Hi ${pName},`,
          `I know scaling infrastructure keeps you slammed with sprint planning. If optimizing compute waste isn't on ${pComp}'s roadmap this quarter, no problem at all.`,
          `If you ever want the self-funding cost remediation benchmark, grab 10 minutes on my Google Meet below anytime.`,
        ],
        snippet: `"RevIntel guarantees self-funding within the first 60 days via verified AWS credits."`,
      };
    }
  }, [prospect, sequenceStep]);

  if (!prospect) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">mark_email_read</span>
        </div>
        <h2 className="text-xl font-headline-md font-bold text-on-surface">No Active Prospect Selected</h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Please upload your lead spreadsheet in Step 1 to generate personalized cold call scripts, live objection rebuttals, and email sequences.
        </p>
        <button
          onClick={onGoToImport}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm"
        >
          Go to Step 1: Lead Import
        </button>
      </div>
    );
  }

  const activeSubject = customSubject || dynamicEmail?.defaultSubject || '';

  const handleCopyScript = () => {
    if (!dynamicScript) return;
    const fullText = `Cold Call Script for ${prospect.name} (${prospect.company}) - Tone: ${tone.toUpperCase()}\n\n1. Opener: ${dynamicScript.opener}\n2. Pain Hook: ${dynamicScript.painHook}\n3. Proof Point: ${dynamicScript.proofPoint}\n4. Call to Action: ${dynamicScript.cta}`;
    navigator.clipboard?.writeText(fullText);
    onShowToast('Call script copied to clipboard!');
  };

  const handleRegenerateScript = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      onShowToast(`Regenerated dynamic talking tracks for ${prospect.name}!`);
    }, 600);
  };

  const handleSendSequence = () => {
    onShowToast(`Sequence step ${sequenceStep} queued for ${prospect.name} (${prospect.verifiedEmail})!`);
  };

  const handleTestEmail = () => {
    onShowToast(`Test preview email dispatched for ${prospect.name}!`);
  };

  const handleScheduleCadence = () => {
    onShowToast(`3-step multi-touch cadence scheduled for ${prospect.company}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Integration & Plugins Bar (Clean Card Tiles) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LinkedIn Plugin Card */}
        <div 
          onClick={onOpenSync}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined" data-icon="business_center">business_center</span>
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-semibold text-xs sm:text-sm">LinkedIn Plugin</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant text-[11px]">Connected v4.1</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-xs font-label-xs bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Sync
            </span>
          </div>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant text-xs">
            Pulling recent company announcements, executive posts, hiring spikes, and infra tech changes for {prospect.company}.
          </p>
        </div>

        {/* Apollo.io Plugin Card */}
        <div 
          onClick={onOpenSync}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-primary flex items-center justify-center border border-indigo-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined" data-icon="badge">badge</span>
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-semibold text-xs sm:text-sm">Apollo.io Plugin</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant text-[11px]">Connected API</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-xs font-label-xs bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Synced
            </span>
          </div>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant text-xs">
            Direct dial verified numbers (HQ + Cell) and deliverability verified executive inbox IDs.
          </p>
        </div>

        {/* Google Meet Integration Card */}
        <div 
          onClick={onOpenSync}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined" data-icon="videocam">videocam</span>
              </div>
              <div>
                <h3 className="text-headline-sm font-headline-sm text-on-surface font-semibold text-xs sm:text-sm">Google Meet Integration</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant text-[11px]">Workspace Connected</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-xs font-label-xs bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Calendar Sync
            </span>
          </div>
          <p className="mt-3 text-body-sm font-body-sm text-on-surface-variant text-xs">
            Auto-detects booked demo meetings, extracts attendee emails, and triggers automated deep enrichment profiling.
          </p>
        </div>
      </section>

      {/* Active Prospect Banner Details */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {prospect.avatarUrl ? (
              <img 
                className="w-14 h-14 rounded-full border-2 border-primary/20 object-cover shadow-sm" 
                alt={`Portrait of ${prospect.name}`} 
                src={prospect.avatarUrl}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-lg border-2 border-primary/20 shadow-sm">
                {prospect.avatarInitials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <button
                  onClick={() => setShowProspectDropdown(!showProspectDropdown)}
                  className="flex items-center gap-1.5 text-headline-md font-headline-md font-bold text-on-surface hover:text-primary transition-colors text-left"
                >
                  <span>{prospect.name}</span>
                  <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                </button>

                {showProspectDropdown && (
                  <div className="absolute left-0 top-8 w-64 bg-white rounded-xl shadow-xl border border-outline-variant p-2 z-50 text-on-surface max-h-60 overflow-y-auto">
                    <p className="text-[11px] font-semibold text-outline uppercase px-2 py-1">Switch Active Prospect</p>
                    <div className="space-y-1">
                      {allProspects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProspect(p);
                            setCustomSubject(null);
                            setShowProspectDropdown(false);
                            onShowToast(`Switched active context to ${p.name} (${p.company})`);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            p.id === prospect.id ? 'bg-primary-fixed/40 font-semibold text-primary' : 'hover:bg-surface-container'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <p className="font-semibold text-on-surface truncate">{p.name}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{p.role} @ {p.company}</p>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold shrink-0">
                            {p.intentScore}/100
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {prospect.priorityTarget && (
                <span className="px-2 py-0.5 rounded text-label-xs font-label-xs bg-primary-fixed text-on-primary-fixed font-semibold">
                  Priority Target
                </span>
              )}
              {prospect.aiAugmented && (
                <span className="px-2 py-0.5 rounded text-label-xs font-label-xs bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" data-icon="auto_awesome">auto_awesome</span>
                  AI Augmented
                </span>
              )}
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant text-xs sm:text-sm">
              {prospect.role} @ <span className="font-semibold text-on-surface">{prospect.company}</span> • {prospect.location}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-surface-container px-3 py-2 rounded-lg text-body-sm font-body-sm flex items-center gap-1 text-xs">
            <span className="text-outline">Direct Dial:</span>
            <span className="font-semibold text-on-surface ml-1 font-mono">{prospect.directPhone}</span>
            <button 
              onClick={() => onStartDialer(prospect)}
              className="ml-1 text-primary hover:text-primary-container p-0.5" 
              title="Call now"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
            </button>
          </div>

          <div className="bg-surface-container px-3 py-2 rounded-lg text-body-sm font-body-sm text-xs">
            <span className="text-outline">Email:</span>
            <span className="font-semibold text-on-surface ml-1 font-mono">{prospect.verifiedEmail}</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-body-sm font-body-sm text-emerald-800 flex items-center text-xs">
            <span className="text-emerald-700 font-medium">Intent Score:</span>
            <span className="font-bold ml-1">{prospect.intentScore}/100 ({prospect.intentTier})</span>
          </div>
        </div>
      </section>

      {/* Main 2-Column Workspace for Active Lead */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT COLUMN: AI Cold Call Script Generator */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined" data-icon="phone_in_talk">phone_in_talk</span>
              </div>
              <div>
                <h3 className="text-headline-md font-headline-md font-bold text-on-surface text-sm sm:text-base">AI Cold Call Script Generator</h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant text-xs">Real-time dynamic objections and talking tracks</p>
              </div>
            </div>
            <span className="px-2 py-1 rounded text-label-xs font-label-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
              Synced with Case Study 3
            </span>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-label-sm font-label-sm font-semibold text-on-surface text-xs">Script Tone &amp; Methodology:</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => setTone('consultative')}
                className={`py-2 px-3 rounded-lg font-label-md text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  tone === 'consultative'
                    ? 'border-2 border-primary bg-primary-fixed/30 text-primary font-bold'
                    : 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {tone === 'consultative' && (
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="done">done</span>
                )}
                <span>Consultative</span>
              </button>

              <button 
                onClick={() => setTone('roi')}
                className={`py-2 px-3 rounded-lg font-label-md text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  tone === 'roi'
                    ? 'border-2 border-primary bg-primary-fixed/30 text-primary font-bold'
                    : 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {tone === 'roi' && (
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="done">done</span>
                )}
                <span>Direct ROI</span>
              </button>

              <button 
                onClick={() => setTone('challenger')}
                className={`py-2 px-3 rounded-lg font-label-md text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                  tone === 'challenger'
                    ? 'border-2 border-primary bg-primary-fixed/30 text-primary font-bold'
                    : 'border border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                {tone === 'challenger' && (
                  <span className="material-symbols-outlined text-sm font-bold" data-icon="done">done</span>
                )}
                <span>Challenger</span>
              </button>
            </div>
          </div>

          {/* Structured Script Output Bento Sections */}
          {dynamicScript && (
            <div className={`space-y-3.5 transition-opacity ${isRegenerating ? 'opacity-40 animate-pulse' : 'opacity-100'}`}>
              {/* Opener */}
              <div className="p-3.5 rounded-lg border border-outline-variant bg-surface-container-low/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-label-xs font-label-xs font-bold text-primary uppercase tracking-wide">1. Contextualized Opener</span>
                  <span className="text-label-xs font-label-xs text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-blue-600" data-icon="link">link</span> {dynamicScript.openerTag}
                  </span>
                </div>
                <p className="text-body-md font-body-md text-on-surface leading-relaxed text-xs sm:text-sm">
                  {dynamicScript.opener}
                </p>
              </div>

              {/* Pain Hook */}
              <div className="p-3.5 rounded-lg border border-outline-variant bg-surface-container-low/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-label-xs font-label-xs font-bold text-primary uppercase tracking-wide">2. The Pain Hook</span>
                  <span className="text-label-xs font-label-xs text-on-surface-variant">{dynamicScript.painHookTag}</span>
                </div>
                <p className="text-body-md font-body-md text-on-surface leading-relaxed text-xs sm:text-sm">
                  {dynamicScript.painHook}
                </p>
              </div>

              {/* Proof Point */}
              <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-label-xs font-label-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm" data-icon="auto_graph">auto_graph</span> 3. Proof Point (Step 3 Case Study Sourced)
                  </span>
                  <span className="text-label-xs font-label-xs font-semibold text-indigo-700">{dynamicScript.proofPointTag}</span>
                </div>
                <p className="text-body-md font-body-md text-on-surface leading-relaxed text-xs sm:text-sm">
                  {dynamicScript.proofPoint}
                </p>
              </div>

              {/* Call to Action */}
              <div className="p-3.5 rounded-lg border border-outline-variant bg-surface-container-low/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-label-xs font-label-xs font-bold text-primary uppercase tracking-wide">4. Call to Action (GMeet Hook)</span>
                  <span className="text-label-xs font-label-xs text-emerald-700 font-medium">{dynamicScript.ctaTag}</span>
                </div>
                <p className="text-body-md font-body-md text-on-surface leading-relaxed text-xs sm:text-sm">
                  {dynamicScript.cta}
                </p>
              </div>

              {/* Objections & Rebuttals Accordion */}
              <div className="border border-outline-variant rounded-lg divide-y divide-outline-variant overflow-hidden">
                <div className="p-3 bg-surface-container text-body-sm font-body-sm font-semibold text-on-surface flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs">
                    <span className="material-symbols-outlined text-outline" data-icon="shield">shield</span>
                    Objections &amp; Live Rebuttals (2 Active)
                  </span>
                  <span className="text-label-xs font-label-xs text-outline font-normal">Click to expand</span>
                </div>

                {/* Rebuttal 1 */}
                <div className="bg-surface-container-lowest">
                  <button
                    type="button"
                    onClick={() => setRebuttalsOpen((prev) => ({ ...prev, 0: !prev[0] }))}
                    className="w-full text-left p-3 flex justify-between items-center text-xs font-semibold text-on-surface hover:bg-surface-container/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      "We already use Datadog for infra monitoring."
                    </span>
                    <span className={`material-symbols-outlined text-outline text-sm transition-transform duration-200 ${rebuttalsOpen[0] ? 'rotate-180' : ''}`} data-icon="expand_more">
                      expand_more
                    </span>
                  </button>
                  {rebuttalsOpen[0] && (
                    <div className="px-4 pb-3 pl-6 border-l-2 border-primary text-body-sm font-body-sm text-on-surface-variant leading-relaxed text-xs">
                      <strong className="text-on-surface">Say this:</strong> "Datadog is fantastic for observability alarms. RevIntel sits right beneath Datadog to actively trim the resource tier dynamically. Think of us as the auto-remediator rather than another dashboard."
                    </div>
                  )}
                </div>

                {/* Rebuttal 2 */}
                <div className="bg-surface-container-lowest">
                  <button
                    type="button"
                    onClick={() => setRebuttalsOpen((prev) => ({ ...prev, 1: !prev[1] }))}
                    className="w-full text-left p-3 flex justify-between items-center text-xs font-semibold text-on-surface hover:bg-surface-container/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-error"></span>
                      "No budget this quarter for new tooling."
                    </span>
                    <span className={`material-symbols-outlined text-outline text-sm transition-transform duration-200 ${rebuttalsOpen[1] ? 'rotate-180' : ''}`} data-icon="expand_more">
                      expand_more
                    </span>
                  </button>
                  {rebuttalsOpen[1] && (
                    <div className="px-4 pb-3 pl-6 border-l-2 border-primary text-body-sm font-body-sm text-on-surface-variant leading-relaxed text-xs">
                      <strong className="text-on-surface">Say this:</strong> "Understood. The reason Datasync worked with us is that we are self-funding. We take our fee solely out of the documented AWS rebates we unlock within the first 60 days."
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
            <button 
              onClick={() => onStartDialer(prospect)}
              className="flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="call">call</span>
              <span>Start Dialer</span>
            </button>
            <button 
              onClick={handleCopyScript}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]" data-icon="content_copy">content_copy</span>
              <span>Copy Script</span>
            </button>
            <button 
              onClick={handleRegenerateScript}
              disabled={isRegenerating}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-semibold transition-all active:scale-[0.98]" 
              title="Regenerate Script"
            >
              <span className={`material-symbols-outlined text-[16px] ${isRegenerating ? 'animate-spin' : ''}`} data-icon="refresh">refresh</span>
              <span>{isRegenerating ? 'Generating...' : 'Regenerate'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Personalized Email Sequence (1 of 3) & GMeet Profiler */}
        <div className="space-y-6">
          {/* Email Composer / Preview Container */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined" data-icon="mail">mail</span>
                </div>
                <div>
                  <h3 className="text-headline-md font-headline-md font-bold text-on-surface text-sm sm:text-base">Personalized Email Sequence</h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant text-xs">{dynamicEmail?.title}</p>
                </div>
              </div>

              {/* Sequence step navigation button */}
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => {
                      setSequenceStep(step);
                      setCustomSubject(null);
                    }}
                    className={`px-2.5 py-1 rounded-md text-label-xs font-label-xs font-semibold transition-all text-xs ${
                      sequenceStep === step
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    Step {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-1">
              <label className="text-label-sm font-label-sm font-semibold text-on-surface flex items-center justify-between text-xs">
                <span>Subject Line:</span>
                <span className="text-label-xs font-label-xs text-emerald-700 font-semibold">{dynamicEmail?.openRate}</span>
              </label>
              
              <div className="flex items-center justify-between px-3.5 py-2 rounded-lg border border-outline-variant bg-surface text-body-md font-body-md text-on-surface font-medium text-xs sm:text-sm">
                {isEditingSubject ? (
                  <input
                    type="text"
                    value={activeSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    onBlur={() => setIsEditingSubject(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingSubject(false)}
                    className="w-full bg-transparent border-none outline-none font-medium"
                    autoFocus
                  />
                ) : (
                  <span className="truncate">{activeSubject}</span>
                )}
                <button 
                  onClick={() => setIsEditingSubject(!isEditingSubject)}
                  className="text-outline hover:text-on-surface ml-2 shrink-0" 
                  title="Edit Subject"
                >
                  <span className="material-symbols-outlined text-sm" data-icon="edit">
                    {isEditingSubject ? 'check' : 'edit'}
                  </span>
                </button>
              </div>
            </div>

            {/* Email Body Preview Canvas */}
            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low/30 space-y-3 font-body-md text-body-md text-on-surface text-xs sm:text-sm">
              <div className="text-on-surface-variant text-body-sm font-body-sm pb-2 border-b border-outline-variant flex justify-between text-xs">
                <span>To: <strong className="text-on-surface">{prospect.verifiedEmail}</strong></span>
                <span>From: <strong className="text-on-surface">alex.rivera@revintel.studio</strong></span>
              </div>

              {dynamicEmail?.paragraphs.map((p, i) => (
                <p key={i} className="leading-relaxed">{p}</p>
              ))}

              {/* Embedded Case Study Snippet */}
              <div className="p-3 bg-surface-container-lowest border-l-4 border-primary rounded-r-lg shadow-xs space-y-1 my-2">
                <div className="flex items-center gap-2 text-label-xs font-label-xs font-bold text-primary uppercase text-[10px]">
                  <span className="material-symbols-outlined text-sm" data-icon="verified">verified</span> Case Study Snippet Embedded
                </div>
                <p className="text-body-sm font-body-sm text-on-surface italic text-xs">
                  {dynamicEmail?.snippet}
                </p>
              </div>

              {/* GMeet 1-Click Link Insert */}
              <div className="p-3 bg-white rounded-lg border border-emerald-300 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]" data-icon="video_camera_front">video_camera_front</span>
                  </div>
                  <div>
                    <p className="text-label-sm font-label-sm font-semibold text-on-surface text-xs">1-Click Google Meet Calendar Link</p>
                    <a className="text-body-sm font-body-sm text-secondary hover:underline font-mono text-xs" href="https://meet.google.com/xyz-demo-sc" target="_blank" rel="noreferrer">
                      meet.google.com/xyz-demo-sc
                    </a>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-label-xs font-label-xs bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">Pre-authenticated</span>
              </div>

              <p className="pt-1 text-xs">
                Best,<br/>
                <strong>Alex Rivera</strong><br/>
                <span className="text-on-surface-variant">RevIntel Studio Architecture Lead</span>
              </p>
            </div>

            {/* Email Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleTestEmail}
                  className="py-1.5 px-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-md text-xs flex items-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-sm" data-icon="send">send</span>
                  <span>Test Email</span>
                </button>
                <button 
                  onClick={handleScheduleCadence}
                  className="py-1.5 px-3 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-md text-xs flex items-center gap-1.5 transition-colors active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span>
                  <span>Schedule Cadence</span>
                </button>
              </div>

              <button 
                onClick={handleSendSequence}
                className="py-2 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm" data-icon="mark_email_read">mark_email_read</span>
                <span>Send via Sequence</span>
              </button>
            </div>
          </div>

          {/* Section for GMeet Lead Capture & Profiling Automation */}
          <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low border border-primary/30 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined" data-icon="hub">hub</span>
                </div>
                <div>
                  <h4 className="text-headline-sm font-headline-sm font-bold text-on-surface text-xs sm:text-sm">GMeet Lead Capture &amp; Automated Profiling</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant text-[11px]">Autonomous pipeline trigger engine for {prospect.company}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-label-xs font-label-xs bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">Trigger Active</span>
            </div>

            {/* Flow Step Pipeline Visualizer */}
            <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-emerald-600 text-sm">verified_user</span>
                <span>How the Automation Executes:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-center text-xs">
                <div className="p-2 rounded bg-surface border border-outline-variant/60">
                  <div className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center mx-auto mb-1">1</div>
                  <p className="font-semibold text-on-surface text-[11px]">Invite Acceptance</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Prospect accepts link via calendar</p>
                </div>
                <div className="p-2 rounded bg-surface border border-outline-variant/60">
                  <div className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center mx-auto mb-1">2</div>
                  <p className="font-semibold text-on-surface text-[11px]">Attendee Capture</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Extracts emails of colleagues invited</p>
                </div>
                <div className="p-2 rounded bg-surface border border-outline-variant/60">
                  <div className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center mx-auto mb-1">3</div>
                  <p className="font-semibold text-on-surface text-[11px]">Deep Profiling</p>
                  <p className="text-on-surface-variant text-[10px] mt-0.5">Apollo &amp; LinkedIn firmographics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Webhook: <code className="bg-surface-container px-1 py-0.5 rounded text-[10px] font-mono">gmeet.hook/revintel/{prospect.company.toLowerCase().replace(/[^a-z0-9]/g, '')}</code>
              </span>
              <button 
                onClick={onOpenSync}
                className="text-primary font-semibold hover:underline flex items-center gap-0.5 text-xs"
              >
                Configure Rule <span className="material-symbols-outlined text-xs" data-icon="settings">settings</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
