import { useState } from 'react';
import { HeroWidget } from '../dashboard/HeroWidget';
import { RecentGenerations } from '../dashboard/RecentGenerations';
import { StyleProfileSnapshot } from '../dashboard/StyleProfileSnapshot';
import { LearningActivity } from '../dashboard/LearningActivity';
import { QuickActions } from '../dashboard/QuickActions';
import { BrandAnalysisModal } from '../modals/BrandAnalysisModal';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showBrandAnalysis, setShowBrandAnalysis] = useState(false);
  return (
    <div className="p-8 space-y-6 overflow-auto h-full">
      {/* Hero Widget */}
      <HeroWidget 
        onGenerate={() => onNavigate('generate')} 
        onDesignStudio={() => onNavigate('design-studio')}
      />

      {/* Three Column Widget Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
            <h3 className="text-[#1F2937]">Recent Generations</h3>
          </div>
          <RecentGenerations />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
            <h3 className="text-[#1F2937]">Style Profile</h3>
          </div>
          <StyleProfileSnapshot onViewFullProfile={() => onNavigate('style-dna')} />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
            <h3 className="text-[#1F2937]">Learning Activity</h3>
          </div>
          <LearningActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
          <h3 className="text-[#1F2937]">Quick Actions</h3>
        </div>
        <QuickActions 
          onGenerate={() => onNavigate('generate')} 
          onUploadBrandAssets={() => setShowBrandAnalysis(true)}
          onDesignStudio={() => onNavigate('design-studio')}
        />
      </div>

      {/* Brand Analysis Modal */}
      <BrandAnalysisModal
        isOpen={showBrandAnalysis}
        onClose={() => setShowBrandAnalysis(false)}
        onComplete={() => {
          toast.success('Style DNA updated from brand assets!');
        }}
      />
    </div>
  );
}