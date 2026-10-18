import React, { useState } from 'react';

interface UploadLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (count: number) => void;
}

export const UploadLeadsModal: React.FC<UploadLeadsModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateSelect = (name: string) => {
    setSelectedFileName(name);
  };

  const handleConfirmUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUploaded(64);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">upload_file</span>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Upload Raw Contacts</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              setSelectedFileName('q4_prospects_export_cloud.csv');
            }}
            onClick={() => handleSimulateSelect('q4_prospects_export_cloud.csv')}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant hover:border-primary/50 bg-surface'
            }`}
          >
            <span className="material-symbols-outlined text-3xl text-primary mb-1">cloud_upload</span>
            <p className="font-bold text-on-surface text-sm">
              {selectedFileName ? selectedFileName : 'Drag & drop your CSV or Excel file here'}
            </p>
            <p className="text-on-surface-variant text-[11px] mt-1">
              Supports .csv, .xlsx, .tsv up to 50MB (up to 25,000 rows per batch)
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-on-surface block">Or pick sample demo batch:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateSelect('cloudscale_cohort_54_leads.csv')}
                className="p-2.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-left"
              >
                <p className="font-semibold text-on-surface">CloudScale Cohort</p>
                <p className="text-[10px] text-on-surface-variant">54 Mid-Market DevOps leads</p>
              </button>
              <button
                type="button"
                onClick={() => handleSimulateSelect('fintech_direct_dials_120.csv')}
                className="p-2.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-left"
              >
                <p className="font-semibold text-on-surface">Fintech Direct Dials</p>
                <p className="text-[10px] text-on-surface-variant">120 Verified Tech Executives</p>
              </button>
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded-lg text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface block">Automatic Deduplication:</span>
            RevIntel will merge matching domain records and skip existing contacts in your active CRM pipelines.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmUpload}
            disabled={!selectedFileName || isProcessing}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-xs transition-all shadow-sm"
          >
            {isProcessing ? 'Enriching Leads...' : 'Upload & Trigger Enrichment'}
          </button>
        </div>
      </div>
    </div>
  );
};
