import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { CheckCircle, TrendingUp, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  text: string;
  timestamp: string;
  type: 'learned' | 'detected' | 'noted';
}

export function LearningActivity() {
  const [activities] = useState<Activity[]>([
    { id: '1', text: 'You prefer 24px padding on Instagram posts', timestamp: '2m ago', type: 'learned' },
    { id: '2', text: 'Sans-serif for headlines, serif for body', timestamp: '15m ago', type: 'detected' },
    { id: '3', text: 'High contrast preferred for CTA buttons', timestamp: '1h ago', type: 'noted' },
    { id: '4', text: 'Consistent use of rounded corners (12px)', timestamp: '2h ago', type: 'learned' },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'learned':
        return CheckCircle;
      case 'detected':
        return TrendingUp;
      case 'noted':
        return Eye;
      default:
        return CheckCircle;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'learned':
        return '#10B981';
      case 'detected':
        return '#CDFF2A';
      case 'noted':
        return '#F59E0B';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const color = getColor(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-md"
                >
                  <Icon className="w-4 h-4 text-[#CDFF2A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1F2937] leading-relaxed">
                    <span className="text-[#6B7280] capitalize">{activity.type}:</span> {activity.text}
                  </p>
                  <span className="text-xs text-[#6B7280] mt-1">{activity.timestamp}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
