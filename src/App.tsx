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

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);
  const [unavailableTool, setUnavailableTool] = useState<ToolDefinition | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Fetch API status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
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
      />
    </div>
  );
}
