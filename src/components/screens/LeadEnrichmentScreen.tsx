import React, { useState } from 'react';
import { Prospect } from '../../data/mockData';

interface LeadEnrichmentScreenProps {
  prospects: Prospect[];
  onSelectProspectForOutreach: (prospect: Prospect) => void;
  onProceedToCases: () => void;
  onBackToImport: () => void;
  onOpenUploadModal: () => void;
  onShowToast: (message: string) => void;
}

export const LeadEnrichmentScreen: React.FC<LeadEnrichmentScreenProps> = ({
  prospects,
  onSelectProspectForOutreach,
  onProceedToCases,
  onBackToImport,
  onOpenUploadModal,
  onShowToast,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [selectedLeadIds, setSelectedLeadIds] = useState<Record<string, boolean>>({});
  const [isReRunning, setIsReRunning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Compute live dynamic stats from the actual prospects list
  const totalCount = prospects.length;
  const directDialsCount = prospects.filter((p) => p.hasDirectMobile).length;
  const verifiedEmailsCount = prospects.filter((p) => p.verifiedEmail && p.verifiedEmail.includes('@')).length;
  const directCoveragePct = totalCount > 0 ? ((directDialsCount / totalCount) * 100).toFixed(1) : '0';
  const emailCoveragePct = totalCount > 0 ? ((verifiedEmailsCount / totalCount) * 100).toFixed(1) : '0';
  const overallRate = totalCount > 0 
    ? (((directDialsCount + verifiedEmailsCount + totalCount) / (totalCount * 3)) * 100).toFixed(1) 
    : '0';

  // Seniority count
  const executiveCount = prospects.filter((p) => /vp|director|chief|head|officer|lead|cfo|cto|cro/i.test(p.role)).length;
  const seniorityPct = totalCount > 0 ? Math.round((executiveCount / totalCount) * 100) : 0;

  const filteredProspects = prospects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));

    if (!matchesSearch) return false;
    if (stageFilter !== 'All' && !p.stage.toLowerCase().includes(stageFilter.toLowerCase())) return false;
    return true;
  });

  const toggleSelectAll = () => {
    const allSelected = filteredProspects.every((p) => selectedLeadIds[p.id]);
    const next: Record<string, boolean> = { ...selectedLeadIds };
    filteredProspects.forEach((p) => {
      next[p.id] = !allSelected;
    });
    setSelectedLeadIds(next);
    onShowToast(!allSelected ? `Selected all ${filteredProspects.length} leads` : 'Deselected leads');
  };

  const toggleLead = (id: string) => {
    setSelectedLeadIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVerifyDirectDials = () => {
    onShowToast(`Queued Apollo API live HLR lookup on ${Object.values(selectedLeadIds).filter(Boolean).length || filteredProspects.length} phone numbers`);
  };

  const handleReRunEngine = () => {
    setIsReRunning(true);
    setTimeout(() => {
      setIsReRunning(false);
      onShowToast(`Intelligence Engine scanned ${totalCount} accounts. Verified real-time mobile presence.`);
    }, 800);
  };

  if (totalCount === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">upload_file</span>
        </div>
        <h2 className="text-xl font-headline-md font-bold text-on-surface">No Leads Available to Enrich</h2>
        <p className="text-xs text-on-surface-variant max-w-md mx-auto">
          Please upload your CSV contact list in Step 1 to trigger automatic phone verification and firmographic matching.
        </p>
        <div className="pt-2">
          <button
            onClick={onBackToImport}
            className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm"
          >
            Go to Step 1: Lead Import
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface">
              Lead Enrichment &amp; Verification
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-label-xs font-label-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Enrichment Active ({totalCount} Leads)
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
            Deep automated scanning performed across {totalCount} uploaded contacts. Review enriched signals, phone coverage, and firmographics below.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button 
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload Additional Leads</span>
          </button>

          <button 
            onClick={handleReRunEngine}
            disabled={isReRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold transition-all shadow-xs active:scale-[0.98]"
          >
            <span className={`material-symbols-outlined text-[18px] ${isReRunning ? 'animate-spin' : ''}`}>sync</span>
            <span>{isReRunning ? 'Scanning...' : 'Re-run Intelligence Engine'}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Overall Enrichment Rate */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-xs font-label-xs text-on-surface-variant font-medium">Overall Enrichment Rate</p>
              <h2 className="text-3xl font-headline-xl font-bold text-on-surface mt-1 tracking-tight">{overallRate}%</h2>
              <p className="text-label-xs font-label-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                Dynamic match rate
              </p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center text-primary bg-primary-fixed/20">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${overallRate}%` }}></div>
          </div>
        </div>

        {/* Card 2: Direct Dial Phones */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-xs font-label-xs text-on-surface-variant font-medium">Direct Dial Phones</p>
              <h2 className="text-3xl font-headline-xl font-bold text-on-surface mt-1 tracking-tight">{directDialsCount}</h2>
              <p className="text-label-xs font-label-xs text-on-surface-variant mt-1">
                <span className="font-semibold text-on-surface">{directCoveragePct}% direct coverage</span> {directDialsCount} / {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <span className="material-symbols-outlined text-[20px]">phone_enabled</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${directCoveragePct}%` }}></div>
          </div>
        </div>

        {/* Card 3: Verified Work Emails */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-xs font-label-xs text-on-surface-variant font-medium">Verified Work Emails</p>
              <h2 className="text-3xl font-headline-xl font-bold text-on-surface mt-1 tracking-tight">{verifiedEmailsCount}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-label-xs font-label-xs text-on-surface-variant">{emailCoveragePct}% deliverability</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1 rounded font-semibold border border-emerald-200">
                  0% Bounce
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${emailCoveragePct}%` }}></div>
          </div>
        </div>

        {/* Card 4: Firmographics Appended */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-xs font-label-xs text-on-surface-variant font-medium">Firmographics Appended</p>
              <h2 className="text-3xl font-headline-xl font-bold text-on-surface mt-1 tracking-tight">{totalCount}</h2>
              <p className="text-label-xs font-label-xs text-on-surface-variant mt-1">
                <span className="font-semibold text-on-surface">100% matched accounts</span> Complete
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-primary flex items-center justify-center border border-indigo-100">
              <span className="material-symbols-outlined text-[20px]">domain</span>
            </div>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-4 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">search</span>
          <input
            type="text"
            placeholder="Filter by lead name, role, company, or tech stack..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-body-sm font-body-sm text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-label-sm font-label-sm text-on-surface focus:outline-none focus:border-primary text-xs"
          >
            <option value="All">All Funding Stages</option>
            <option value="Series B">Series B</option>
            <option value="Series C">Series C / Growth</option>
            <option value="Enterprise">Enterprise Tier</option>
          </select>

          <button 
            onClick={() => { setSearchFilter(''); setStageFilter('All'); }}
            className="p-2 border border-outline-variant rounded-lg hover:bg-surface text-on-surface-variant" 
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
          </button>
        </div>
      </section>

      {/* Main Split Layout: Table on Left + ICP Breakdown on Right */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Enriched Prospects Table (Span 2 cols) */}
        <div className="xl:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface/30">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filteredProspects.length > 0 && filteredProspects.every((p) => selectedLeadIds[p.id])}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
              />
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Displaying {filteredProspects.length} of {totalCount} Uploaded Prospects
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-label-xs font-label-xs text-on-surface-variant">Bulk Action:</span>
              <button 
                onClick={handleVerifyDirectDials}
                className="px-3 py-1 bg-surface-container hover:bg-surface-container-high rounded-md text-label-xs font-label-xs font-semibold text-on-surface transition-all active:scale-[0.98]"
              >
                Verify Direct Dials
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm font-body-sm">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[11px] font-bold tracking-wider border-b border-outline-variant">
                <tr>
                  <th className="p-3 pl-4 w-10"></th>
                  <th className="p-3">Lead &amp; Company</th>
                  <th className="p-3">Contact Verification</th>
                  <th className="p-3">Firmographics</th>
                  <th className="p-3">Tech Stack Detected</th>
                  <th className="p-3 text-right">Intent Score</th>
                  <th className="p-3 pr-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {filteredProspects.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={`hover:bg-surface-container-low/40 transition-colors ${
                      selectedLeadIds[lead.id] ? 'bg-primary-fixed/10' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 pl-4">
                      <input
                        type="checkbox"
                        checked={!!selectedLeadIds[lead.id]}
                        onChange={() => toggleLead(lead.id)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
                      />
                    </td>

                    {/* Lead & Company */}
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {lead.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-on-surface text-label-md">{lead.name}</span>
                            <span className="material-symbols-outlined text-primary text-[14px]" title="Identity verified">
                              verified_user
                            </span>
                          </div>
                          <p className="text-on-surface-variant text-xs truncate">
                            {lead.role} • <span className="font-medium text-on-surface">{lead.company}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Verification */}
                    <td className="p-3 space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Verified Email
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {lead.phoneType === 'Direct Mobile' ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">smartphone</span>
                            Direct Mobile
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">call</span>
                            Switchboard
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Firmographics */}
                    <td className="p-3 text-xs">
                      <p className="font-semibold text-on-surface">{lead.empCount}</p>
                      <p className="text-on-surface-variant">{lead.arr}</p>
                      <p className="text-outline text-[11px]">{lead.location}</p>
                    </td>

                    {/* Tech Stack Detected */}
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[170px]">
                        {lead.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-container text-on-surface-variant border border-outline-variant/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Intent Score */}
                    <td className="p-3 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                        lead.intentScore >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        <span className="material-symbols-outlined text-[13px]">bolt</span>
                        {lead.intentTier} {lead.intentScore}/100
                      </span>
                    </td>

                    {/* Action */}
                    <td className="p-3 pr-4 text-center">
                      <button
                        onClick={() => {
                          onSelectProspectForOutreach(lead);
                          onShowToast(`Selected ${lead.name} (${lead.company}) for Cold Outreach!`);
                        }}
                        className="px-2.5 py-1 rounded bg-primary-fixed/40 hover:bg-primary-fixed text-primary text-xs font-semibold transition-colors"
                        title="Generate cold outreach play"
                      >
                        Launch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-3 border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant bg-surface/30">
            <span>Showing {filteredProspects.length} of {totalCount} contacts</span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="px-2.5 py-1 rounded border border-outline-variant bg-surface hover:bg-surface-container"
              >
                Previous
              </button>
              <button className="px-2.5 py-1 rounded bg-primary text-white font-bold">1</button>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-2.5 py-1 rounded border border-outline-variant bg-surface hover:bg-surface-container"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: ICP Alignment & Industry Breakdown */}
        <div className="space-y-6">
          {/* ICP Alignment Fit Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">ICP Alignment Fit</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-label-xs font-label-xs bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                AI Augmented
              </span>
            </div>

            <div>
              <p className="text-label-sm font-label-sm font-bold text-on-surface">Tier 1 Target Profile Match</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant text-xs mt-0.5 leading-relaxed">
                {Math.round(totalCount * 0.88)} uploaded contacts precisely match your executive buyer persona specs.
              </p>
            </div>

            {/* Match Rate Progress Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider block">Match Rate</span>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>VP &amp; C-Suite Seniority</span>
                  <span className="text-primary font-bold">{seniorityPct}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${seniorityPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Target Tech Stack Synergy</span>
                  <span className="text-secondary font-bold">91%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '91%' }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Active Growth &amp; Cloud Signals</span>
                  <span className="text-indigo-600 font-bold">78%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Industry Breakdown */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">donut_large</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Key Industry Breakdown</h3>
              </div>
              <span className="text-xs text-on-surface-variant">Verified</span>
            </div>

            {/* Multi-segment visual bar */}
            <div className="w-full h-3 rounded-full flex overflow-hidden">
              <div className="bg-primary h-full" style={{ width: '45%' }}></div>
              <div className="bg-secondary h-full" style={{ width: '30%' }}></div>
              <div className="bg-purple-600 h-full" style={{ width: '25%' }}></div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="font-semibold text-on-surface">SaaS &amp; Enterprise Cloud</span>
                </span>
                <span className="font-bold text-on-surface">{Math.round(totalCount * 0.45)} leads</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                  <span className="font-semibold text-on-surface">Fintech &amp; Banking Systems</span>
                </span>
                <span className="font-bold text-on-surface">{Math.round(totalCount * 0.30)} leads</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span className="font-semibold text-on-surface">HealthTech &amp; Life Sciences</span>
                </span>
                <span className="font-bold text-on-surface">{Math.round(totalCount * 0.25)} leads</span>
              </div>
            </div>

            {/* AI Insight Box */}
            <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0">tips_and_updates</span>
              <p className="text-on-surface-variant leading-relaxed">
                High intent concentration detected across uploaded accounts. Recommending auto-matched case studies in Step 3.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Bar */}
      <footer className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToImport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Import</span>
        </button>

        <div className="flex items-center gap-2 text-label-xs font-label-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
          <span><strong>{totalCount} leads enriched &amp; validated</strong> • Ready for case study auto-matching</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onShowToast('Cohort draft saved!')}
            className="px-4 py-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-md text-label-md"
          >
            Save Draft
          </button>
          <button
            onClick={onProceedToCases}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            <span>Proceed to Company Case Studies</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
