import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Dashboard } from './components/views/Dashboard';
import { GenerateContent } from './components/views/GenerateContent';
import { StyleLibrary } from './components/views/StyleLibrary';
import { Analytics } from './components/views/Analytics';
import { Settings } from './components/views/Settings';
import { StyleDNA } from './components/views/StyleDNA';
import { DesignStudio } from './components/views/DesignStudio';
import { LearningSession } from './components/overlays/LearningSession';
import { AIAssistant } from './components/AIAssistant';
import { Button } from './components/ui/button';
import { Brain } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

export interface BrandAsset {
  id: string;
  name: string;
  file: File;
  preview: string;
  uploadedAt: Date;
  size: number;
  analyzed: boolean;
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showLearningOverlay, setShowLearningOverlay] = useState(false);
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const breadcrumbs: Record<string, string[]> = {
    dashboard: ['Home', 'Dashboard'],
    'design-studio': ['Home', 'Design Studio'],
    'style-library': ['Home', 'Style Library'],
    'style-dna': ['Home', 'Style DNA'],
    learning: ['Home', 'Learning Sessions'],
    generate: ['Home', 'Generate Content'],
    assets: ['Home', 'Brand Assets'],
    analytics: ['Home', 'Analytics'],
    settings: ['Home', 'Settings'],
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'design-studio':
        return <DesignStudio />;
      case 'generate':
        return <GenerateContent />;
      case 'style-library':
        return <StyleLibrary brandAssets={brandAssets} setBrandAssets={setBrandAssets} />;
      case 'style-dna':
        return <StyleDNA />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'assets':
        // Navigate to Style Library with Brand Assets tab active
        return <StyleLibrary brandAssets={brandAssets} setBrandAssets={setBrandAssets} defaultTab="assets" />;
      case 'learning':
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-lg">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-[#1F2937] mb-2">Learning Sessions</h3>
              <p className="text-[#6B7280] mb-6">
                View your AI learning activity and sessions
              </p>
              <Button
                onClick={() => setShowLearningOverlay(true)}
                className="gradient-primary"
              >
                <Brain className="w-4 h-4 mr-2" />
                Start Learning Session
              </Button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAFBFC] flex">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          breadcrumbs={breadcrumbs[currentView] || ['Home']}
          onMobileMenuToggle={() => setIsMobileSidebarOpen(true)}
        />

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderView()}
        </div>
      </div>

      {/* Learning Overlay */}
      <LearningSession
        isOpen={showLearningOverlay}
        onClose={() => setShowLearningOverlay(false)}
        onViewStyleDNA={() => setCurrentView('style-dna')}
      />

      {/* AI Assistant */}
      <AIAssistant />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}