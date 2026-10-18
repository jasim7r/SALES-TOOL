import React, { useState, useRef } from 'react';
import { Prospect } from '../../data/mockData';
import { parseCSV, convertRowsToProspects, generateSampleCSV } from '../../utils/fileParser';

interface LeadImportScreenProps {
  prospects: Prospect[];
  onUploadProspects: (newProspects: Prospect[], filename: string) => void;
  onProceedToEnrichment: () => void;
  onShowToast: (message: string) => void;
}

export const LeadImportScreen: React.FC<LeadImportScreenProps> = ({
  prospects,
  onUploadProspects,
  onProceedToEnrichment,
  onShowToast,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        const parsedLeads = convertRowsToProspects(rows);

        if (parsedLeads.length === 0) {
          onShowToast('Could not find valid prospect rows in the file. Please check format.');
          setIsUploading(false);
          return;
        }

        onUploadProspects(parsedLeads, file.name);
        onShowToast(`Successfully imported ${parsedLeads.length} leads from ${file.name}!`);
      } catch (err) {
        console.error(err);
        onShowToast('Failed to parse file. Please upload a valid CSV.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      setIsUploading(false);
      onShowToast('Error reading file.');
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setIsUploading(true);
    setTimeout(() => {
      const sampleText = generateSampleCSV();
      const rows = parseCSV(sampleText);
      const parsedLeads = convertRowsToProspects(rows);
      onUploadProspects(parsedLeads, 'revintel_sample_cohort.csv');
      setIsUploading(false);
      onShowToast(`Loaded ${parsedLeads.length} sample enterprise leads!`);
    }, 400);
  };

  const handleDownloadTemplate = () => {
    const csvContent = generateSampleCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'revintel_lead_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Downloaded revintel_lead_import_template.csv');
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv,.txt,.tsv"
        className="hidden"
      />

      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-label-xs font-label-xs font-semibold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">
              Campaign Step 1 of 4
            </span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">
              Target Audience Pipeline
            </span>
          </div>
          <h1 className="text-headline-lg font-headline-lg font-bold text-on-surface mt-1">
            Target Prospect Cohort &amp; Lead Import
          </h1>
          <p className="text-body-sm font-body-sm text-on-surface-variant mt-1">
            Upload your raw CSV contact spreadsheet. RevIntel parses names, titles, direct dials, and auto-generates enrichment signals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface font-label-sm text-xs font-semibold transition-all"
          >
            Download CSV Template
          </button>

          {prospects.length > 0 && (
            <button
              onClick={onProceedToEnrichment}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <span>Proceed to Lead Enrichment ({prospects.length})</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* Real Drag & Drop Import Dropzone */}
      <section
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`bg-surface-container-lowest border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer space-y-4 ${
          dragActive
            ? 'border-primary bg-primary-fixed/30 scale-[1.01]'
            : 'border-primary/40 hover:border-primary hover:bg-surface-container-low/40'
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-primary-fixed/50 text-primary mx-auto flex items-center justify-center shadow-xs">
          <span className={`material-symbols-outlined text-4xl ${isUploading ? 'animate-bounce' : ''}`}>
            cloud_upload
          </span>
        </div>

        <div>
          <h3 className="text-headline-md font-headline-md font-bold text-on-surface">
            {isUploading ? 'Parsing & Enriching Contact List...' : 'Click to Upload or Drag & Drop your CSV File'}
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant max-w-lg mx-auto mt-1">
            Supported columns: Full Name, Job Title, Company, Work Email, Direct Phone, Technologies, Employee Headcount, ARR.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1">
          <span className="px-3 py-1 rounded-md bg-surface-container text-xs font-mono text-on-surface-variant font-semibold">.csv</span>
          <span className="px-3 py-1 rounded-md bg-surface-container text-xs font-mono text-on-surface-variant font-semibold">.tsv</span>
          <span className="px-3 py-1 rounded-md bg-surface-container text-xs font-mono text-on-surface-variant font-semibold">.txt</span>
          <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">Auto Header Detection</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleLoadSample();
            }}
            className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 bg-primary-fixed/40 px-3 py-1.5 rounded-lg border border-primary/30"
          >
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
            <span>Or click here to load sample demo CSV dataset</span>
          </button>
        </div>
      </section>

      {/* Uploaded File Status or Empty State */}
      {prospects.length > 0 ? (
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">check_circle</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Imported Data Preview ({prospects.length} leads loaded)
              </h3>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">upload</span>
              Upload Another File
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-wider border-b border-outline-variant">
                <tr>
                  <th className="p-2.5">Name</th>
                  <th className="p-2.5">Title &amp; Company</th>
                  <th className="p-2.5">Work Email</th>
                  <th className="p-2.5">Direct Phone</th>
                  <th className="p-2.5">Tech Stack</th>
                  <th className="p-2.5 text-right">Intent Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {prospects.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low/40">
                    <td className="p-2.5 font-bold text-on-surface">{p.name}</td>
                    <td className="p-2.5">{p.role} @ <strong className="text-on-surface">{p.company}</strong></td>
                    <td className="p-2.5 text-on-surface-variant font-mono">{p.verifiedEmail}</td>
                    <td className="p-2.5 text-on-surface-variant font-mono">{p.directPhone}</td>
                    <td className="p-2.5">
                      <div className="flex gap-1 flex-wrap">
                        {p.techStack.slice(0, 2).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-surface-container text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2.5 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {p.intentScore}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {prospects.length > 5 && (
            <p className="text-[11px] text-on-surface-variant pt-1 text-center">
              + {prospects.length - 5} more prospects loaded. Ready for Step 2: Lead Enrichment &amp; Verification.
            </p>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onProceedToEnrichment}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-label-md text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <span>Proceed to Lead Enrichment &amp; Verification</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-container text-on-surface-variant mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">folder_open</span>
          </div>
          <h3 className="text-base font-bold text-on-surface">No leads imported yet</h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto">
            Upload your CSV to view verified phone coverage, ICP alignment fit, and automatically match relevant company case studies.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold shadow-xs"
            >
              Upload CSV File
            </button>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-xs font-semibold"
            >
              Load Sample Demo File
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
