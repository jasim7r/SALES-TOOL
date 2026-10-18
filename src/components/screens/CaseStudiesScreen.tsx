import React, { useState, useMemo } from 'react';
import { Prospect, CaseStudy } from '../../data/mockData';
import { generateCaseStudiesForProspects } from '../../utils/fileParser';

interface CaseStudiesScreenProps {
  prospects: Prospect[];
  onProceedToOutreach: () => void;
  onBackToEnrichment: () => void;
  onOpenUploadCustomStudy: () => void;
  onShowToast: (message: string) => void;
}

export const CaseStudiesScreen: React.FC<CaseStudiesScreenProps> = ({
  prospects,
  onProceedToOutreach,
  onBackToEnrichment,
  onOpenUploadCustomStudy,
  onShowToast,
}) => {
  // Aggregate unique companies from uploaded prospects
  const companies = useMemo(() => {
    if (prospects.length === 0) return [];
    const map = new Map<string, {
      id: string;
      name: string;
      initial: string;
      stageAndSize: string;
      matchScore: string;
      highMatch: boolean;
      tags: string[];
      leadCount: number;
    }>();

    prospects.forEach((p, idx) => {
      if (!map.has(p.company)) {
        map.set(p.company, {
          id: p.id,
          name: p.company,
          initial: p.companyInitial || p.company.charAt(0),
          stageAndSize: `${p.stage} • ${p.empCount}`,
          matchScore: `${85 + ((idx * 3) % 12)}% Match`,
          highMatch: idx === 0,
          tags: p.techStack.slice(0, 2),
          leadCount: 1,
        });
      } else {
        const item = map.get(p.company)!;
        item.leadCount += 1;
      }
    });

    return Array.from(map.values());
  }, [prospects]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [companySearch, setCompanySearch] = useState('');

  const activeCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  // Generate dynamic case studies for the uploaded company
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() => {
    return generateCaseStudiesForProspects(prospects);
  });

  // Re-generate case studies if prospects changed
  useMemo(() => {
    setCaseStudies(generateCaseStudiesForProspects(prospects));
  }, [prospects]);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
    c.tags.some((t) => t.toLowerCase().includes(companySearch.toLowerCase()))
  );

  const toggleAttach = (id: string) => {
    setCaseStudies((prev) =>
      prev.map((cs) => {
        if (cs.id === id) {
          const updated = !cs.attached;
          onShowToast(updated ? `Attached study to ${activeCompany?.name || 'lead'} dossier` : `Detached from dossier`);
          return { ...cs, attached: updated };
        }
        return cs;
      })
    );
  };

  const copySnippet = (cs: CaseStudy) => {
    const snippet = `"${cs.quote.text}" — ${cs.quote.author}, ${cs.quote.role}`;
    navigator.clipboard?.writeText(snippet);
    onShowToast(`Snippet copied for cold outreach!`);
  };

  const copyProofPoints = (cs: CaseStudy) => {
    const text = cs.proofPoints.map((p) => `• ${p}`).join('\n');
    navigator.clipboard?.writeText(text);
    onShowToast(`Proof points copied to clipboard!`);
  };

  if (prospects.length === 0 || companies.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">psychology</span>
        </div>
        <h2 className="text-xl font-headline-md font-bold text-on-surface">No Target Companies Found</h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Please upload your lead spreadsheet in Step 1 to extract accounts and generate auto-paired case studies.
        </p>
        <button
          onClick={onBackToEnrichment}
          className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm"
        >
          Go Back &amp; Upload Leads
        </button>
      </div>
    );
  }

  const attachedCount = caseStudies.filter((c) => c.attached).length;

  return (
    <div className="flex-1 min-h-0 h-full flex flex-col xl:flex-row rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm">
      {/* Left Column: Target Prospects Selector (w-80) */}
      <aside className="w-full xl:w-80 border-r border-outline-variant bg-surface-container-lowest flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Target Prospects</h2>
            <p className="font-label-xs text-label-xs text-on-surface-variant">{companies.length} organizations detected</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-xs text-label-xs font-semibold">
            Step 3 of 4
          </span>
        </div>

        {/* Search & Filter Inside Selector */}
        <div className="px-4 py-2 border-b border-outline-variant bg-surface-container-low">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-[16px]">filter_list</span>
            <input
              type="text"
              placeholder="Filter company list..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-surface-container-lowest border border-outline-variant rounded text-label-sm font-label-sm text-on-surface focus:outline-none focus:border-primary text-xs"
            />
          </div>
        </div>

        {/* Company Selector Cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredCompanies.map((comp) => {
            const isSelected = comp.id === (activeCompany?.id || companies[0].id);
            return (
              <div
                key={comp.id}
                onClick={() => {
                  setSelectedCompanyId(comp.id);
                  onShowToast(`Loaded tailored case study dossier for ${comp.name}`);
                }}
                className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary-fixed/40 border-2 border-primary shadow-sm'
                    : 'bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-headline-sm text-headline-sm font-bold text-xs ${
                      isSelected ? 'bg-primary-container text-on-primary' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {comp.initial}
                    </div>
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5 text-xs">
                        {comp.name}
                        {comp.highMatch && (
                          <span className="material-symbols-outlined text-primary text-[14px]" title="AI Context Analyzed">
                            verified
                          </span>
                        )}
                      </h3>
                      <p className="font-label-xs text-label-xs text-on-surface-variant text-[11px]">{comp.stageAndSize}</p>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    comp.highMatch
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}>
                    {comp.matchScore}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  {comp.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-label-xs text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Quick Rep Note Box */}
        <div className="p-3 border-t border-outline-variant bg-surface-container-lowest">
          <div className="flex items-center gap-2 text-primary font-label-xs text-label-xs font-semibold mb-1">
            <span className="material-symbols-outlined text-[15px]">tips_and_updates</span>
            RevIntel Pairing Engine
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
            Case studies auto-prioritized by firmographic size, tech stack synergies, and industry triggers.
          </p>
        </div>
      </aside>

      {/* Right Column: Main Detail Work Area */}
      <main className="flex-1 overflow-y-auto bg-background p-6 flex flex-col justify-between">
        <div className="max-w-5xl mx-auto w-full space-y-6">
          {/* Header Explanation Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-outline-variant gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs font-semibold">
                  Matched Asset Dossier
                </span>
                <span className="text-on-surface-variant font-label-xs text-label-xs">
                  • Showing assets for <strong>{activeCompany?.name}</strong>
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                Auto-Matched Case Studies &amp; Value Proof Points per Prospect Organization
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Select verified customer testimonials and ROI impact metrics tailored specifically for the prospect's pipeline stage.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={onOpenUploadCustomStudy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">add_chart</span>
                <span>Upload Custom Case Study</span>
              </button>
            </div>
          </div>

          {/* Matched Case Study Card 1 */}
          {caseStudies[0] && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm hover:border-outline transition-all space-y-5">
              {/* Card Header & Metadata Tags */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {caseStudies[0].tags.map((tag) => (
                      <span key={tag.label} className="px-2.5 py-0.5 rounded-full font-label-xs text-label-xs font-semibold bg-primary-fixed text-on-primary-fixed flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">tune</span>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                    {caseStudies[0].title}
                  </h2>
                </div>

                {/* Quick Action Icons */}
                <div className="flex items-center gap-2 self-end lg:self-start flex-shrink-0">
                  <button 
                    onClick={() => copySnippet(caseStudies[0])}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Use Snippet in Email/Script</span>
                  </button>
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={caseStudies[0].attached}
                      onChange={() => toggleAttach(caseStudies[0].id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span className="font-label-sm text-label-sm font-medium text-on-surface">Attach to Lead Profile</span>
                  </label>
                </div>
              </div>

              {/* Problem & Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-low/60 p-4 rounded-lg border border-outline-variant/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-error font-label-xs text-label-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Prospect Challenge / Problem
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {caseStudies[0].challenge}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-primary font-label-xs text-label-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    Solution Deployed
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    {caseStudies[0].solution}
                  </p>
                </div>
              </div>

              {/* Key Metrics / ROI Badges */}
              <div>
                <span className="font-label-xs text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 block">
                  Quantifiable Business Impact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {caseStudies[0].metrics.map((m, idx) => (
                    <div key={idx} className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant shadow-sm flex flex-col">
                      <span className="font-metric-stat text-3xl text-primary font-bold">{m.stat}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">{m.label}</span>
                      <span className="text-[11px] text-emerald-600 font-medium mt-1">{m.subtext}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTO Quote Card */}
              <div className="relative bg-surface p-4 rounded-lg border-l-4 border-primary">
                <span className="material-symbols-outlined text-outline-variant absolute top-2 right-3 text-3xl opacity-30">
                  format_quote
                </span>
                <p className="font-body-md text-body-md italic text-on-surface relative z-10 leading-relaxed">
                  "{caseStudies[0].quote.text}"
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <img 
                    className="w-8 h-8 rounded-full object-cover border border-outline-variant" 
                    alt="Marcus Vance Headshot" 
                    src={caseStudies[0].quote.avatarUrl}
                  />
                  <div>
                    <p className="font-label-sm text-label-sm font-semibold text-on-surface">{caseStudies[0].quote.author}</p>
                    <p className="font-label-xs text-label-xs text-on-surface-variant">{caseStudies[0].quote.role}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case Study Card 2 */}
          {caseStudies[1] && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm hover:border-outline transition-all space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {caseStudies[1].tags.map((tag) => (
                      <span key={tag.label} className="px-2.5 py-0.5 rounded-full font-label-xs text-label-xs font-semibold bg-tertiary-fixed text-on-tertiary-fixed flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                    {caseStudies[1].title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-start flex-shrink-0">
                  <button 
                    onClick={() => copyProofPoints(caseStudies[1])}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Use Snippet in Email/Script</span>
                  </button>
                  <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                    <input 
                      type="checkbox"
                      checked={caseStudies[1].attached}
                      onChange={() => toggleAttach(caseStudies[1].id)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant"
                    />
                    <span className="font-label-sm text-label-sm font-medium text-on-surface">Attach to Lead Profile</span>
                  </label>
                </div>
              </div>

              {/* Cheat-Sheet */}
              <div className="bg-primary-fixed/20 border border-primary-fixed-dim rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[18px]">contact_support</span>
                  Key Proof Points for Cold Outreach Dialogue:
                </div>
                <ul className="space-y-1.5 pl-1">
                  {caseStudies[1].proofPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface text-xs">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Action Bar */}
        <footer className="mt-8 pt-4 border-t border-outline-variant flex items-center justify-between max-w-5xl mx-auto w-full flex-shrink-0">
          <button
            onClick={onBackToEnrichment}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Enrichment</span>
          </button>
          
          <div className="flex items-center gap-4">
            <span className="font-label-xs text-label-xs text-on-surface-variant hidden sm:inline-block">
              {attachedCount} Case Studies Selected for {activeCompany?.name}
            </span>
            <button
              onClick={onProceedToOutreach}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <span>Proceed to Cold Call &amp; Email Generation</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};
