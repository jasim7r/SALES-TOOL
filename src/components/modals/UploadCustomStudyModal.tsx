import React, { useState } from 'react';

interface UploadCustomStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudy: (title: string, metrics: string, quote: string) => void;
}

export const UploadCustomStudyModal: React.FC<UploadCustomStudyModalProps> = ({
  isOpen,
  onClose,
  onAddStudy,
}) => {
  const [title, setTitle] = useState('');
  const [metrics, setMetrics] = useState('$350K Annual Cost Reduction • 55% Latency Drop');
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddStudy(title, metrics, quote || 'RevIntel delivers extraordinary ROI across cloud infrastructure.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_chart</span>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">Upload Custom Case Study</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Case Study Headline / Outcome</label>
            <input
              type="text"
              required
              placeholder="e.g. How CloudFlow Reduced AWS Idle Provisioning by 48%"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Quantifiable ROI Metrics</label>
            <input
              type="text"
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Customer Testimonial Quote</label>
            <textarea
              rows={3}
              placeholder="Direct quote from CTO, VP of Engineering, or DevOps leader..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-on-surface">Executive Author &amp; Company</label>
            <input
              type="text"
              placeholder="e.g. David Lin, VP Engineering @ CloudFlow"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-body-sm font-body-sm focus:outline-none focus:border-primary"
            />
          </div>

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
              Attach to Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
