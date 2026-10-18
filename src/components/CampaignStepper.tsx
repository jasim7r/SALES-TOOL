import React from 'react';

interface CampaignStepperProps {
  currentStep: 'import' | 'enrichment' | 'cases' | 'outreach';
  onSelectStep: (step: 'import' | 'enrichment' | 'cases' | 'outreach') => void;
  autopilotActive: boolean;
  onToggleAutopilot?: () => void;
  leadCount: number;
  cohortName?: string;
}

export const CampaignStepper: React.FC<CampaignStepperProps> = ({
  currentStep,
  onSelectStep,
  autopilotActive,
  onToggleAutopilot,
  leadCount,
  cohortName = 'Target Mid-Market Cohort',
}) => {
  const stepNumber = 
    currentStep === 'import' ? 1 :
    currentStep === 'enrichment' ? 2 :
    currentStep === 'cases' ? 3 : 4;

  const stepTitles = {
    import: 'Target Prospect Cohort & Lead Import',
    enrichment: 'Lead Enrichment & Verification with Apollo & LinkedIn',
    cases: 'Auto-Matched Case Studies & Value Proof Points per Prospect',
    outreach: 'Cold Call & Email Generation with Plugins & GMeet Integration',
  };

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 sm:p-4 shadow-sm flex-shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4 pb-2.5 sm:pb-3 border-b border-outline-variant">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-label-xs font-semibold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
              Campaign Step {stepNumber} of 4
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {cohortName}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-headline-lg text-on-surface mt-0.5 font-bold">
            {stepTitles[currentStep]}
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button 
            onClick={onToggleAutopilot}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label-sm border transition-all ${
              autopilotActive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-xs'
                : 'bg-surface text-on-surface-variant border-outline-variant'
            }`}
            title="Click to toggle AI Outreach Autopilot"
          >
            <span className={`w-2 h-2 rounded-full ${autopilotActive ? 'bg-emerald-500 animate-pulse' : 'bg-outline'}`}></span>
            <span>{autopilotActive ? 'Autopilot Ready' : 'Manual Mode'}</span>
          </button>
        </div>
      </div>

      {/* The 4-step stepper */}
      <div className="pt-3 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Step 1: Lead Import */}
        <button
          onClick={() => onSelectStep('import')}
          className={`text-left flex items-center gap-3 p-2 rounded-lg transition-all ${
            currentStep === 'import'
              ? 'bg-surface-container-low border border-primary/30 ring-1 ring-primary/20'
              : 'hover:bg-surface-container-low/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 shadow-sm ${
            currentStep === 'import'
              ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed'
              : leadCount > 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {leadCount > 0 && currentStep !== 'import' ? (
              <span className="material-symbols-outlined text-sm font-bold" data-icon="check">check</span>
            ) : (
              '1'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-label-xs font-label-xs text-primary font-semibold uppercase">
              {currentStep === 'import' ? 'Current Workflow' : leadCount > 0 ? 'Step 1 • Completed' : 'Step 1 • Import'}
            </p>
            <p className="text-label-md font-label-md text-on-surface font-semibold truncate">Lead Import</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant truncate">
              {leadCount > 0 ? `${leadCount} Verified Leads` : 'No leads imported yet'}
            </p>
          </div>
        </button>

        {/* Step 2: Lead Enrichment */}
        <button
          onClick={() => onSelectStep('enrichment')}
          className={`text-left flex items-center gap-3 p-2 rounded-lg transition-all ${
            currentStep === 'enrichment'
              ? 'bg-surface-container-low border border-primary/30 ring-1 ring-primary/20'
              : 'hover:bg-surface-container-low/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 shadow-sm ${
            currentStep === 'enrichment'
              ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed'
              : stepNumber > 2 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant border border-outline-variant'
          }`}>
            {stepNumber > 2 ? (
              <span className="material-symbols-outlined text-sm font-bold" data-icon="check">check</span>
            ) : (
              '2'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-label-xs font-label-xs text-primary font-semibold uppercase">
              {currentStep === 'enrichment' ? 'Current Workflow' : stepNumber > 2 ? 'Step 2 • Completed' : 'Step 2'}
            </p>
            <p className="text-label-md font-label-md text-on-surface font-semibold truncate">Lead Enrichment</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant truncate">Apollo &amp; LinkedIn Sync</p>
          </div>
        </button>

        {/* Step 3: Case Studies */}
        <button
          onClick={() => onSelectStep('cases')}
          className={`text-left flex items-center gap-3 p-2 rounded-lg transition-all ${
            currentStep === 'cases'
              ? 'bg-surface-container-low border border-primary/30 ring-1 ring-primary/20'
              : 'hover:bg-surface-container-low/50'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 shadow-sm ${
            currentStep === 'cases'
              ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed'
              : stepNumber > 3 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant border border-outline-variant'
          }`}>
            {stepNumber > 3 ? (
              <span className="material-symbols-outlined text-sm font-bold" data-icon="check">check</span>
            ) : (
              '3'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-label-xs font-label-xs text-primary font-semibold uppercase">
              {currentStep === 'cases' ? 'Current Workflow' : stepNumber > 3 ? 'Step 3 • Completed' : 'Step 3'}
            </p>
            <p className="text-label-md font-label-md text-on-surface font-semibold truncate">Case Studies</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant truncate">Datasync ROI Linked</p>
          </div>
        </button>

        {/* Step 4: Cold Outreach Studio */}
        <button
          onClick={() => onSelectStep('outreach')}
          className={`text-left flex items-center gap-3 p-2 rounded-lg transition-all ${
            currentStep === 'outreach'
              ? 'bg-surface-container-low border border-primary/30 ring-1 ring-primary/20'
              : 'hover:bg-surface-container-low/50 opacity-90'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-md shrink-0 ${
            currentStep === 'outreach'
              ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed shadow-sm'
              : 'bg-surface-container text-on-surface-variant border border-outline-variant'
          }`}>
            4
          </div>
          <div className="min-w-0">
            <p className="text-label-xs font-label-xs text-primary font-bold uppercase">
              {currentStep === 'outreach' ? 'Current Workflow' : 'Campaign Step 4'}
            </p>
            <p className="text-label-md font-label-md text-on-surface font-bold truncate">Cold Outreach Studio</p>
            <p className="text-body-sm font-body-sm text-on-surface-variant truncate">Live Call &amp; Email Engine</p>
          </div>
        </button>
      </div>
    </section>
  );
};
