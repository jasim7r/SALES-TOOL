import React, { useState } from 'react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (campaignName: string, targetPersona: string) => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [targetPersona, setTargetPersona] = useState('VP Infrastructure / DevOps Leads');
  const [enrichmentSource, setEnrichmentSource] = useState('Apollo + LinkedIn Sync');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name, targetPersona);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Create New Campaign</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Campaign Cohort Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Q4 Cloud Infra High-Growth Series B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Target Executive Persona</label>
            <select
              value={targetPersona}
              onChange={(e) => setTargetPersona(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            >
              <option value="VP Infrastructure / DevOps Leads">VP Infrastructure / DevOps Leads</option>
              <option value="Chief Technology Officers & VP Engineering">Chief Technology Officers &amp; VP Engineering</option>
              <option value="RevOps & Sales Tech Operations">RevOps &amp; Sales Tech Operations</option>
              <option value="Chief Information Security Officers (CISO)">Chief Information Security Officers (CISO)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Primary Enrichment Engine</label>
            <select
              value={enrichmentSource}
              onChange={(e) => setEnrichmentSource(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            >
              <option value="Apollo + LinkedIn Sync">Apollo.io + LinkedIn Real-Time Signal Sync</option>
              <option value="Salesforce Direct Pull">Salesforce Pipeline Cohort Pull</option>
              <option value="CSV / Excel Upload Only">Manual CSV / Excel Spreadsheet</option>
            </select>
          </div>

          <div className="p-3 bg-surface-container rounded-lg text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface block">Automated RevIntel Engine:</span>
            New campaign will automatically bootstrap 4-step workflow: Lead Import &rarr; Verification &rarr; Case Study Pairing &rarr; Cold Call &amp; Email Engine.
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-outline-variant flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white font-bold transition-all shadow-sm"
            >
              Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
