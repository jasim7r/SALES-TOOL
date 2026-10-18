import React, { useState } from 'react';

interface ExportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
  totalLeads: number;
}

export const ExportLeadsModal: React.FC<ExportLeadsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
  totalLeads,
}) => {
  const [format, setFormat] = useState<'csv' | 'xlsx' | 'salesforce' | 'hubspot'>('csv');
  const [includeSnippets, setIncludeSnippets] = useState(true);
  const [includeDirectDials, setIncludeDirectDials] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onShowToast(`Export complete: ${totalLeads.toLocaleString()} leads packaged into ${format.toUpperCase()}`);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">file_download</span>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Export Enriched Leads</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-on-surface block mb-1.5">Choose Export Destination / Format:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  format === 'csv'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant'
                }`}
              >
                <span className="text-sm">CSV Spreadsheet</span>
                <span className="text-[10px] text-outline">Standard table schema</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  format === 'xlsx'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant'
                }`}
              >
                <span className="text-sm">Excel (.xlsx)</span>
                <span className="text-[10px] text-outline">With formatted tabs</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('salesforce')}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  format === 'salesforce'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant'
                }`}
              >
                <span className="text-sm">Salesforce Push</span>
                <span className="text-[10px] text-outline">Direct CRM Campaign</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('hubspot')}
                className={`p-3 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                  format === 'hubspot'
                    ? 'border-primary bg-primary-fixed/20 font-bold text-primary'
                    : 'border-outline-variant bg-surface text-on-surface-variant'
                }`}
              >
                <span className="text-sm">HubSpot Sync</span>
                <span className="text-[10px] text-outline">Automated sequence list</span>
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant">
            <span className="font-semibold text-on-surface block">Data Fields to Include:</span>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDirectDials}
                onChange={(e) => setIncludeDirectDials(e.target.checked)}
                className="w-4 h-4 rounded text-primary"
              />
              <span>Direct Dial verified cell numbers &amp; switchboard extensions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSnippets}
                onChange={(e) => setIncludeSnippets(e.target.checked)}
                className="w-4 h-4 rounded text-primary"
              />
              <span>Auto-matched case study hooks &amp; talking tracks</span>
            </label>
          </div>

          <div className="p-3 bg-surface-container rounded-lg text-on-surface-variant">
            <p className="font-semibold text-on-surface">{totalLeads.toLocaleString()} Leads Selected</p>
            <p className="text-[11px] mt-0.5">Includes 1,180 direct dials and verified deliverable emails.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-all shadow-sm"
          >
            {isExporting ? 'Generating Package...' : 'Download / Push Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
