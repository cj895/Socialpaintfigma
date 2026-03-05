import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { ChevronRight } from 'lucide-react';
import { styleDNA } from '../../services/style-dna-service';

interface StyleProfileSnapshotProps {
  onViewFullProfile?: () => void;
}

export function StyleProfileSnapshot({ onViewFullProfile }: StyleProfileSnapshotProps) {
  const profile = styleDNA.getProfile();
  
  const fonts = [
    { name: profile.typography.headingFont, percentage: 65 },
    { name: profile.typography.bodyFont, percentage: profile.typography.headingFont === profile.typography.bodyFont ? 35 : 25 },
    { name: 'Playfair Display', percentage: 10 },
  ].slice(0, 3);

  const colors = [
    ...profile.colors.primary.slice(0, 3),
    ...profile.colors.accent.slice(0, 1),
    '#FAFBFC'
  ].slice(0, 5);

  return (
    <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">

      {/* Color Distribution */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
          <p className="text-sm text-[#6B7280]">Color Palette</p>
        </div>
        <div className="flex gap-2">
          {colors.map((color, index) => (
            <motion.div
              key={`${color}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 h-12 rounded-lg cursor-pointer hover:scale-105 transition-transform shadow-md ring-2 ring-white"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Font Usage */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
          <p className="text-sm text-[#6B7280]">Top Fonts</p>
        </div>
        {fonts.map((font, index) => (
          <motion.div
            key={`${font.name}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-sm">
              <span className="text-[#1F2937]">{font.name}</span>
              <span className="text-[#6B7280]">{font.percentage}%</span>
            </div>
            <Progress value={font.percentage} className="h-1.5" />
          </motion.div>
        ))}
      </div>

      {/* View Full Link */}
      <button 
        onClick={onViewFullProfile}
        className="w-full mt-6 flex items-center justify-center gap-2 text-[#00328F] hover:text-[#001B42] transition-colors"
      >
        <span className="text-sm">View Full Style DNA</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </Card>
  );
}
