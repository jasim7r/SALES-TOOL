/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Prospect } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { CampaignStepper } from './components/CampaignStepper';
import { OutreachStudioScreen } from './components/screens/OutreachStudioScreen';
import { LeadEnrichmentScreen } from './components/screens/LeadEnrichmentScreen';
import { CaseStudiesScreen } from './components/screens/CaseStudiesScreen';
import { LeadImportScreen } from './components/screens/LeadImportScreen';
import { DialerModal } from './components/modals/DialerModal';
import { SyncIntegrationsModal } from './components/modals/SyncIntegrationsModal';
import { ExportLeadsModal } from './components/modals/ExportLeadsModal';
import { NewCampaignModal } from './components/modals/NewCampaignModal';
import { UploadLeadsModal } from './components/modals/UploadLeadsModal';
import { UploadCustomStudyModal } from './components/modals/UploadCustomStudyModal';
import { DocsModal } from './components/modals/DocsModal';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation & Cohort State - starts clean at Step 1 (Lead Import) with no dummy data
  const [activeTab, setActiveTab] = useState<'import' | 'enrichment' | 'cases' | 'outreach'>('import');
  const [cohortName, setCohortName] = useState('Target Audience Cohort');
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);
  const [autopilotActive, setAutopilotActive] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCustomStudyModalOpen, setIsCustomStudyModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Called when real CSV file is uploaded or demo sample is loaded
  const handleUploadProspects = (newProspects: Prospect[], filename: string) => {
    setProspects(newProspects);
    if (newProspects.length > 0) {
      setActiveProspect(newProspects[0]);
    }
    const cleanCohort = filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    setCohortName(cleanCohort.charAt(0).toUpperCase() + cleanCohort.slice(1));
    showToast(`Loaded ${newProspects.length} verified leads from ${filename}!`);
  };

  const handleCreateCampaign = (name: string, persona: string) => {
    setCohortName(name);
    showToast(`Campaign "${name}" initialized for target persona: ${persona}`);
    setActiveTab('import');
  };

  const handleStartDialer = (prospect: Prospect) => {
    setActiveProspect(prospect);
    setIsDialerOpen(true);
  };

  const handleNotificationsOpen = () => {
    if (prospects.length > 0) {
      showToast(`${activeProspect?.name || 'Lead'} clicked Google Meet link • Calendar webhook ready`);
    } else {
      showToast('No active webhook events yet. Upload contacts to enable triggers.');
    }
    setNotificationCount(0);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-on-surface antialiased flex flex-col lg:flex-row font-body-md text-body-md selection:bg-primary-fixed selection:text-primary">
      {/* Mobile Top Header (Only visible on small devices to toggle the sidebar) */}
      <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant px-4 py-2 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
              <span className="material-symbols-outlined text-[16px]">hub</span>
            </div>
            <span className="font-bold text-sm text-primary tracking-tight">RevIntel Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
          </button>
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
          </button>
        </div>
      </div>

      {/* Main Left SideBar (Contains all navigation and upper bar elements) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        onOpenNewCampaign={() => {
          setIsNewCampaignModalOpen(true);
          setIsMobileSidebarOpen(false);
        }}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenDocs={() => setIsDocsModalOpen(true)}
        onOpenSettings={() => setIsSyncModalOpen(true)}
        onOpenNotifications={handleNotificationsOpen}
        notificationCount={notificationCount}
        leadCount={prospects.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 h-full min-h-0 overflow-hidden flex flex-col p-3 sm:p-4 md:p-5 lg:p-6 space-y-3">
        {/* Linear Campaign Stepper (Shown when in general workflow or outreach) */}
        {activeTab !== 'cases' && (
          <div className="flex-shrink-0">
            <CampaignStepper
              currentStep={activeTab}
              onSelectStep={setActiveTab}
              autopilotActive={autopilotActive}
              onToggleAutopilot={() => {
                setAutopilotActive(!autopilotActive);
                showToast(
                  !autopilotActive
                    ? 'AI Autopilot enabled: dynamic talking tracks & meeting webhooks active'
                    : 'Switched to Manual Rep Mode'
                );
              }}
              leadCount={prospects.length}
              cohortName={cohortName}
            />
          </div>
        )}

        {/* Content View with inner scroll where needed */}
        {activeTab === 'cases' ? (
          <div className="flex-1 min-h-0 h-full overflow-hidden">
            <CaseStudiesScreen
              prospects={prospects}
              onProceedToOutreach={() => setActiveTab('outreach')}
              onBackToEnrichment={() => setActiveTab('enrichment')}
              onOpenUploadCustomStudy={() => setIsCustomStudyModalOpen(true)}
              onShowToast={showToast}
            />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {/* Step 1: Real CSV File Import & Pipeline Hub */}
            {activeTab === 'import' && (
              <LeadImportScreen
                prospects={prospects}
                onUploadProspects={handleUploadProspects}
                onProceedToEnrichment={() => setActiveTab('enrichment')}
                onShowToast={showToast}
              />
            )}

            {/* Step 2: Lead Enrichment & Verification (Updated with uploaded file data) */}
            {activeTab === 'enrichment' && (
              <LeadEnrichmentScreen
                prospects={prospects}
                onSelectProspectForOutreach={(p) => {
                  setActiveProspect(p);
                  setActiveTab('outreach');
                }}
                onProceedToCases={() => setActiveTab('cases')}
                onBackToImport={() => setActiveTab('import')}
                onOpenUploadModal={() => setIsUploadModalOpen(true)}
                onShowToast={showToast}
              />
            )}

            {/* Step 4: Cold Outreach Studio (Updated with selected uploaded prospect) */}
            {activeTab === 'outreach' && (
              <OutreachStudioScreen
                prospect={activeProspect}
                allProspects={prospects}
                onSelectProspect={setActiveProspect}
                onStartDialer={handleStartDialer}
                onShowToast={showToast}
                onOpenSync={() => setIsSyncModalOpen(true)}
                onGoToImport={() => setActiveTab('import')}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="lg:hidden bg-surface-container-lowest border-t border-outline-variant px-4 py-2 flex justify-around items-center sticky bottom-0 z-40">
        <button
          onClick={() => setActiveTab('import')}
          className={`flex flex-col items-center p-1 ${activeTab === 'import' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="filter_list">filter_list</span>
          <span className="text-label-xs font-label-xs mt-0.5">Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('enrichment')}
          className={`flex flex-col items-center p-1 ${activeTab === 'enrichment' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="contacts">contacts</span>
          <span className="text-label-xs font-label-xs mt-0.5">Leads</span>
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`flex flex-col items-center p-1 ${activeTab === 'cases' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined text-[20px]" data-icon="psychology">psychology</span>
          <span className="text-label-xs font-label-xs mt-0.5">Cases</span>
        </button>

        <button
          onClick={() => setActiveTab('outreach')}
          className={`flex flex-col items-center p-1 ${activeTab === 'outreach' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="mark_email_read"
            style={{ fontVariationSettings: activeTab === 'outreach' ? "'FILL' 1" : "'FILL' 0" }}
          >
            mark_email_read
          </span>
          <span className="text-label-xs font-label-xs mt-0.5">Studio</span>
        </button>
      </nav>

      {/* Interactive Modals */}
      {activeProspect && (
        <DialerModal
          isOpen={isDialerOpen}
          prospect={activeProspect}
          onClose={() => setIsDialerOpen(false)}
          onDisposition={(msg) => showToast(msg)}
        />
      )}

      <SyncIntegrationsModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onShowToast={showToast}
      />

      <ExportLeadsModal
        isOpen={isExportModalOpen}
        totalLeads={prospects.length}
        onClose={() => setIsExportModalOpen(false)}
        onShowToast={showToast}
      />

      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onCreate={handleCreateCampaign}
      />

      <UploadLeadsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={(count) => {
          showToast(`Uploaded ${count} additional leads!`);
        }}
      />

      <UploadCustomStudyModal
        isOpen={isCustomStudyModalOpen}
        onClose={() => setIsCustomStudyModalOpen(false)}
        onAddStudy={(title) => {
          showToast(`Custom case study "${title}" indexed & paired!`);
        }}
      />

      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />

      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
