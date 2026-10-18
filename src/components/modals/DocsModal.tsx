import React from 'react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">auto_stories</span>
            <h2 className="text-headline-md font-headline-md font-bold text-on-surface">
              RevIntel Studio Playbook &amp; Documentation
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container text-outline">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
              Linear 4-Step Sales Orchestration Workflow
            </h3>
            <p>
              RevIntel operates a synchronized pipeline that matches intent signals from LinkedIn, Apollo, and Salesforce to automated talking tracks and customer proofs:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Step 1 (Lead Import):</strong> Upload raw CSVs or sync targeted cohorts directly from CRM filters.</li>
              <li><strong>Step 2 (Enrichment &amp; Verification):</strong> 94.2% verified direct dial phone coverage and 0% estimated bounce rate email deliverability.</li>
              <li><strong>Step 3 (Company Case Studies):</strong> Real-time pairing engine matches relevant peer testimonials (e.g. Datasync $420k cloud savings) to prospect org size.</li>
              <li><strong>Step 4 (Cold Outreach Studio):</strong> AI cold call script generator (Consultative, Direct ROI, Challenger) + 3-step personalized email sequence + 1-click Google Meet calendar triggers.</li>
            </ul>
          </section>

          <section className="space-y-2 border-t border-outline-variant pt-4">
            <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">2</span>
              Google Meet Integration &amp; Automated Profiling
            </h3>
            <p>
              Whenever a prospect clicks your 1-click Google Meet link (e.g. <code className="bg-surface-container px-1.5 py-0.5 rounded font-mono text-xs">meet.google.com/xyz-demo-sc</code>), the webhook captures attendee email domains and queues automatic firmographic profiling before the sales call begins.
            </p>
          </section>

          <section className="space-y-2 border-t border-outline-variant pt-4">
            <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-xs">3</span>
              Live VoIP Calling HUD
            </h3>
            <p>
              Click "Start Dialer" to launch the simulated calling environment. Reps can check off talking points in real-time as they deliver them, reference instant rebuttals for objections like "We use Datadog" or "No budget", and log dispositions in one click.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-container"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
