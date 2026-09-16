import React, { useState, useEffect } from 'react';
import { ALL_TOOLS } from './data/tools';
import { ToolCategory, ToolDefinition, ApiStatus } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { ToolWorkspace } from './components/ToolWorkspace';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { ApiStatusModal } from './components/ApiStatusModal';
import { UnavailableToolModal } from './components/UnavailableToolModal';
import { LegalModals, LegalModalType } from './components/LegalModals';
import { buildApiUrl } from './utils/api';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [unavailableTool, setUnavailableTool] = useState<ToolDefinition | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalType>(null);

  // Fetch API status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch(buildApiUrl('/api/status'));
      if (res.ok) {
        const data = await res.json();
        setApiStatus(data);
      }
    } catch (err) {
      console.warn('Could not fetch backend API status:', err);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Support direct URLs from sitemap / search engines / GitHub Pages 404 redirects
    const params = new URLSearchParams(window.location.search);
    
    // Check if coming from GitHub Pages 404 handler (?p=/...&q=...)
    let toolParam = params.get('tool');
    let pageParam = params.get('page');

    const redirectPath = params.get('p');
    const redirectQuery = params.get('q');
    if (redirectQuery) {
      const restoredParams = new URLSearchParams(redirectQuery.replace(/~and~/g, '&'));
      if (!toolParam) toolParam = restoredParams.get('tool');
      if (!pageParam) pageParam = restoredParams.get('page');
    }
    if (redirectPath && !toolParam) {
      const pathClean = redirectPath.replace(/^\/+/, '').split('/')[0];
      if (pathClean) {
        toolParam = pathClean;
      }
    }

    if (toolParam) {
      const match = ALL_TOOLS.find((t) => t.id === toolParam);
      if (match) {
        if (match.supportedByApi) {
          setActiveTool(match);
        } else {
          setUnavailableTool(match);
        }
      }
    } else if (pageParam && ['privacy', 'terms', 'about', 'contact'].includes(pageParam)) {
      setLegalModal(pageParam as LegalModalType);
    }
  }, []);

  // Handle selecting a tool
  const handleSelectTool = (tool: ToolDefinition) => {
    if (!tool.supportedByApi) {
      setUnavailableTool(tool);
    } else {
      setActiveTool(tool);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Select tool by ID (from quick links or headers)
  const handleSelectToolById = (toolId: string) => {
    const target = ALL_TOOLS.find((t) => t.id === toolId);
    if (target) {
      handleSelectTool(target);
    }
  };

  // Return to homepage
  const handleGoHome = () => {
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-red-500 selection:text-white font-sans antialiased">
      {/* Persistent Navigation Header */}
      <Header
        apiStatus={apiStatus}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onSelectTool={handleSelectToolById}
        onGoHome={handleGoHome}
        activeToolId={activeTool?.id || null}
        onOpenLegalModal={(type) => setLegalModal(type)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTool ? (
          <ToolWorkspace
            tool={activeTool}
            apiStatus={apiStatus}
            onBack={handleGoHome}
            onOpenApiModal={() => setIsApiModalOpen(true)}
          />
        ) : (
          <>
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectTool={handleSelectToolById}
            />

            <ToolGrid
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSelectTool={handleSelectTool}
            />

            <HowItWorks />

            <FaqSection />
          </>
        )}
      </main>

      {/* Global Modals */}
      <ApiStatusModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        apiStatus={apiStatus}
        onRefreshStatus={fetchStatus}
      />

      <UnavailableToolModal
        tool={unavailableTool}
        onClose={() => setUnavailableTool(null)}
        onSelectAlternative={handleSelectToolById}
      />

      {/* Professional Footer */}
      <Footer
        onSelectTool={handleSelectToolById}
        onGoHome={handleGoHome}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenLegalModal={(type) => setLegalModal(type)}
      />

      {/* AdSense Legal Modals (Privacy, Terms, About, Contact) */}
      <LegalModals
        activeModal={legalModal}
        onClose={() => setLegalModal(null)}
        supportEmail="lomtegajendra2345@gmail.com"
      />
    </div>
  );
}
