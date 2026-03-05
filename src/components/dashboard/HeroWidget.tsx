import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Sparkles, Pencil } from 'lucide-react';

interface HeroWidgetProps {
  onGenerate: () => void;
  onDesignStudio?: () => void;
}

export function HeroWidget({ onGenerate, onDesignStudio }: HeroWidgetProps) {
  // Get design count from localStorage
  const designCount = parseInt(localStorage.getItem('designStudio_count') || '0');
  const confidence = Math.min(100, 40 + (designCount * 5));
  const isFigmaConnected = localStorage.getItem('figma_connected') === 'true';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-60 rounded-2xl gradient-hero p-8 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse-glow" />
          <span className="text-white text-sm">
            {isFigmaConnected ? 'AI Observing Figma + Design Studio' : 'AI Observing Your Work'}
          </span>
        </div>
        <h2 className="text-white mb-2">
          {designCount > 0 
            ? `AI has learned from ${designCount} design${designCount !== 1 ? 's' : ''} you created`
            : isFigmaConnected 
              ? 'Figma connected - AI will learn as you design'
              : 'Create your first design to train the AI'
          }
        </h2>
        <p className="text-white/90 text-sm">
          {designCount > 0 
            ? `Style confidence: ${confidence}% | ${confidence >= 70 ? 'Ready to generate' : 'Create more designs to improve'}`
            : isFigmaConnected
              ? 'Work in Figma and the AI will observe your design decisions'
              : 'The AI will learn your style as you design'
          }
        </p>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white">
            <span>Style DNA Confidence</span>
            <span>{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-2 bg-white/30" />
          <p className="text-xs text-white/70">
            {designCount < 5 && 'Create more designs to build stronger Style DNA'}
            {designCount >= 5 && designCount < 10 && 'Good progress! Keep creating to refine'}
            {designCount >= 10 && 'Excellent! Your Style DNA is well-trained'}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onDesignStudio}
            className="bg-white text-[#001B42] hover:bg-white/90 rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <Pencil className="w-4 h-4 mr-2" />
            {designCount > 0 ? 'Create Design' : 'Start Creating'}
          </Button>
          
          {confidence >= 50 && (
            <Button
              onClick={onGenerate}
              className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-full px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}