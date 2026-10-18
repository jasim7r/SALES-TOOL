import React, { useState } from 'react';

interface SyncIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export const SyncIntegrationsModal: React.FC<SyncIntegrationsModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [syncingPlugin, setSyncingPlugin] = useState<string | null>(null);

  if (!isOpen) return null;

  const plugins = [
    {
      id: 'linkedin',
      name: 'LinkedIn Plugin',
      version: 'Connected v4.1',
      status: 'Active Sync',
      icon: 'business_center',
      iconColor: 'bg-blue-50 text-blue-700',
      lastSynced: '2 minutes ago',
      details: 'Syncing executive job changes, AWS/GCP migration posts, and company headcounts.',
    },
    {
      id: 'apollo',
      name: 'Apollo.io Plugin',
      version: 'Connected API Key',
      status: 'Synced',
      icon: 'badge',
      iconColor: 'bg-indigo-50 text-primary',
      lastSynced: '14 minutes ago',
      details: 'Direct dial coverage: 84.4% (1,180 verified cell numbers). 0% bounce rate verified.',
    },
    {
      id: 'gmeet',
      name: 'Google Meet Integration',
      version: 'Google Workspace OAuth',
      status: 'Active Calendar Sync',
      icon: 'videocam',
      iconColor: 'bg-emerald-50 text-emerald-700',
      lastSynced: 'Continuous webhook',
      details: 'Listening to calendar invites. Auto-detects attendee emails and queues firmographic profiling.',
    },
    {
      id: 'salesforce',
      name: 'Salesforce Enterprise',
      version: 'Connected v58.0',
      status: 'Two-Way Sync',
      icon: 'cloud_sync',
      iconColor: 'bg-sky-50 text-sky-700',
      lastSynced: '1 hour ago',
      details: 'Bi-directional account & contact sync with automatic activity logging.',
    },
  ];

  const handleTriggerSync = (id: string, name: string) => {
    setSyncingPlugin(id);
    setTimeout(() => {
      setSyncingPlugin(null);
      onShowToast(`Successfully re-synced ${name} integration!`);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div>
              <h2 className="text-headline-md font-headline-md font-bold text-on-surface">
                Connected Integration Plugins
              </h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant text-xs">
                Real-time pipelines powering lead enrichment, case study matching, and outreach automation.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {plugins.map((plugin) => (
            <div
              key={plugin.id}
              className="p-4 rounded-xl border border-outline-variant bg-surface hover:border-primary/40 transition-all flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border border-outline-variant/60 ${plugin.iconColor}`}>
                    <span className="material-symbols-outlined text-[20px]">{plugin.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-on-surface text-sm">{plugin.name}</h4>
                      <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 rounded-full font-semibold">
                        {plugin.status}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{plugin.version} • Last synced {plugin.lastSynced}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerSync(plugin.id, plugin.name)}
                  disabled={syncingPlugin === plugin.id}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant bg-white hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span className={`material-symbols-outlined text-[14px] ${syncingPlugin === plugin.id ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{syncingPlugin === plugin.id ? 'Syncing...' : 'Re-sync'}</span>
                </button>
              </div>

              <p className="text-xs text-on-surface-variant bg-surface-container-low p-2 rounded-lg leading-relaxed">
                {plugin.details}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
          <span className="text-xs text-on-surface-variant">
            4 of 4 Integrations Active &amp; Healthy
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-container transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
