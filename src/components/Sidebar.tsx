import React, { useState } from 'react';

interface SidebarProps {
  activeTab: 'import' | 'enrichment' | 'cases' | 'outreach';
  onSelectTab: (tab: 'import' | 'enrichment' | 'cases' | 'outreach') => void;
  onOpenNewCampaign: () => void;
  onOpenSync: () => void;
  onOpenExport: () => void;
  onOpenDocs: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
  leadCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNewCampaign,
  onOpenSync,
  onOpenExport,
  onOpenDocs,
  onOpenSettings,
  onOpenNotifications,
  notificationCount,
  leadCount,
  searchQuery,
  onSearchChange,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [showCalendarPreview, setShowCalendarPreview] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full w-full">
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => onSelectTab('outreach')}
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-md font-bold shadow-sm">
              <span className="material-symbols-outlined text-white text-[20px]" data-icon="hub">hub</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-headline-md font-bold text-primary tracking-tight">RevIntel Studio</span>
              </div>
              <span className="text-[10px] text-on-surface-variant font-medium">Enterprise RevOps v2.4</span>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Workspace Card */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-headline-sm font-bold text-xs shadow-xs shrink-0">
              AE
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-headline-sm font-bold text-on-surface truncate">Acme Enterprise</h2>
              <p className="text-[11px] text-on-surface-variant truncate">Enterprise Tier • RevOps</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline text-[16px] cursor-pointer" title="Switch Workspace">
            unfold_more
          </span>
        </div>

        {/* Search Bar inside Sidebar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-outline text-[16px]" data-icon="search">search</span>
          <input
            className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-body-sm font-body-sm text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors placeholder:text-outline"
            placeholder="Search leads, scripts..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* CTA Action */}
        <button
          onClick={onOpenNewCampaign}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary text-on-primary font-label-md text-xs font-semibold shadow-sm hover:bg-primary-container transition-all duration-150 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[16px]" data-icon="add">add</span>
          <span>New Campaign</span>
        </button>

        {/* Navigation items: 5 Tabs */}
        <nav className="space-y-1">
          <p className="px-2 pt-1 pb-1 text-[10px] font-bold text-outline uppercase tracking-wider">
            Sales Workflow
          </p>

          {/* Pipeline Hub */}
          <button
            onClick={() => onSelectTab('import')}
            className={`w-full text-left font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg transition-colors ${
              activeTab === 'import'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span>
            <span>1. Pipeline Hub</span>
            <span className="ml-auto text-[10px] bg-surface-container px-1.5 py-0.5 rounded-full text-on-surface-variant">
              {leadCount > 0 ? leadCount : '0'}
            </span>
          </button>

          {/* Lead Lists / Enrichment */}
          <button
            onClick={() => onSelectTab('enrichment')}
            className={`w-full text-left font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg transition-colors ${
              activeTab === 'enrichment'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="contacts">contacts</span>
            <span>2. Lead Enrichment</span>
            {leadCount > 0 && (
              <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                94%
              </span>
            )}
          </button>

          {/* Intelligence Matrix / Case Studies */}
          <button
            onClick={() => onSelectTab('cases')}
            className={`w-full text-left font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg transition-colors ${
              activeTab === 'cases'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="psychology">psychology</span>
            <span>3. Case Studies</span>
          </button>

          {/* Outreach Playbooks / Outreach Studio */}
          <button
            onClick={() => onSelectTab('outreach')}
            className={`w-full text-left font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg transition-colors ${
              activeTab === 'outreach'
                ? 'bg-primary-fixed text-on-primary-fixed font-bold shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              data-icon="mark_email_read"
              style={{ fontVariationSettings: activeTab === 'outreach' ? "'FILL' 1" : "'FILL' 0" }}
            >
              mark_email_read
            </span>
            <span>4. Outreach Studio</span>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
          </button>

          <p className="px-2 pt-3 pb-1 text-[10px] font-bold text-outline uppercase tracking-wider">
            Integrations &amp; Actions
          </p>

          {/* Integrations */}
          <button
            onClick={onOpenSync}
            className="w-full text-left text-on-surface-variant font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="hub">hub</span>
            <span>Integrations</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {/* Export Leads Action */}
          <button
            onClick={onOpenExport}
            className="w-full text-left text-on-surface-variant font-label-md text-xs px-3 py-2 flex items-center gap-2.5 rounded-lg hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="file_download">file_download</span>
            <span>Export Leads</span>
          </button>

          {/* Quick Hub for Calendar & Notifications */}
          <div className="pt-2 px-1 grid grid-cols-2 gap-1.5 relative">
            <button
              onClick={() => setShowCalendarPreview(!showCalendarPreview)}
              className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs flex items-center justify-center gap-1.5 text-on-surface-variant"
              title="Google Meet Calendar Sync"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Calendar</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs flex items-center justify-center gap-1.5 text-on-surface-variant relative"
              title="Alerts &amp; Webhooks"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Alerts</span>
              {notificationCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-error animate-pulse absolute top-1 right-1"></span>
              )}
            </button>

            {/* Quick Calendar Popover */}
            {showCalendarPreview && (
              <div className="absolute left-0 bottom-10 w-64 bg-white rounded-xl shadow-2xl border border-outline-variant p-3 z-50 text-on-surface animate-in fade-in">
                <div className="flex items-center justify-between pb-1.5 border-b border-outline-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-emerald-600 text-sm">videocam</span>
                    <span className="font-headline-sm text-xs font-bold">Google Meet Sync</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-semibold">Active</span>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="p-1.5 rounded bg-surface-container-low text-[11px]">
                    <p className="font-semibold text-primary">CloudScale Demo</p>
                    <p className="text-[10px] text-on-surface-variant">Thursday @ 2:30 PM PST</p>
                    <span className="text-[9px] text-secondary font-mono">meet.google.com/xyz-demo-sc</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer User Profile & System Links */}
      <div className="border-t border-outline-variant pt-3 space-y-2">
        <div className="flex items-center justify-between px-1">
          <button
            onClick={onOpenDocs}
            className="text-on-surface-variant font-label-md text-xs px-2 py-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="help_outline">help_outline</span>
            <span>Docs</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="text-on-surface-variant font-label-md text-xs px-2 py-1.5 rounded-lg hover:bg-surface-container hover:text-on-surface flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="settings">settings</span>
            <span>Settings</span>
          </button>
        </div>

        {/* User Card */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                  alt="Alex Rivera Profile"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXMslEwukpOCFSoc8EuZrzY2M109Dp3S0nnghcTpMLQTKgmbvIdwFHDekbEtlr0bsf02ZuAe7AYvwKgpnFf3fg0bL5cveReaUUomlCXWxTPyj7fPJICGyH7VQxNkDLntcVnHoB4UNyTS5EqUR0xzc7hDoIrZrOsBthazbCDSjn2F3TRiDgQf9Hbebc4yE1RI8OTQvDWZ5DMyZr-lrinlQdeIDuvaMqCZkckzyujXa0GuC3FKu2RUi1"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">Alex Rivera</p>
                <p className="text-[10px] text-on-surface-variant truncate">alex.rivera@revintel.studio</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-[16px]">expand_less</span>
          </div>

          {showProfileMenu && (
            <div className="absolute left-0 bottom-14 w-full bg-white rounded-xl shadow-xl border border-outline-variant p-2 z-50 text-on-surface animate-in fade-in">
              <div className="p-1.5 border-b border-outline-variant">
                <p className="text-xs font-bold text-on-surface">Alex Rivera</p>
                <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-primary-fixed text-primary font-bold">
                  RevOps Admin
                </span>
              </div>
              <div className="py-1 text-xs space-y-1">
                <button
                  onClick={() => { setShowProfileMenu(false); onOpenSync(); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">integration_instructions</span>
                  <span>Sync Status</span>
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); onOpenDocs(); }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">help</span>
                  <span>RevIntel Guide</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Left Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant p-4 h-screen hidden lg:flex flex-col flex-shrink-0 z-30 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile}></div>
          <div className="relative w-72 bg-surface-container-lowest p-4 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
