import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Plus, Upload, Brain, Grid, Pencil } from 'lucide-react';

interface QuickActionsProps {
  onGenerate: () => void;
  onUploadBrandAssets?: () => void;
  onDesignStudio?: () => void;
}

export function QuickActions({ onGenerate, onUploadBrandAssets, onDesignStudio }: QuickActionsProps) {
  const actions = [
    { id: 'design', label: 'Create Design', icon: Pencil, color: '#001B42', subtitle: 'AI learns your style' },
    { id: 'generate', label: 'Generate Content', icon: Plus, color: '#353CED', subtitle: 'Using learned style' },
    { id: 'upload', label: 'Upload Brand Assets', icon: Upload, color: '#00328F', subtitle: 'Optional training data' },
    { id: 'templates', label: 'Browse Templates', icon: Grid, color: '#F59E0B' },
  ];

  const handleAction = (id: string) => {
    if (id === 'design' && onDesignStudio) {
      onDesignStudio();
    } else if (id === 'generate') {
      onGenerate();
    } else if (id === 'upload' && onUploadBrandAssets) {
      onUploadBrandAssets();
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon;
        
        return (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 bg-white border-gray-100 hover:border-[#353CED] cursor-pointer transition-all group rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1"
              onClick={() => handleAction(action.id)}
            >
              <div
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md"
              >
                <Icon className="w-6 h-6 text-[#CDFF2A]" />
              </div>
              <p className="text-[#1F2937] mb-1">{action.label}</p>
              {action.subtitle && (
                <p className="text-xs text-[#6B7280]">{action.subtitle}</p>
              )}
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}