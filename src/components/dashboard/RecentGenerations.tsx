import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Download, Eye, Edit, Trash2, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';

interface Generation {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'twitter';
  timestamp: string;
  thumbnail: string;
}

export function RecentGenerations() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const generations: Generation[] = [
    { id: '1', title: 'Product Launch Post', platform: 'instagram', timestamp: '2 hours ago', thumbnail: '' },
    { id: '2', title: 'Team Update', platform: 'linkedin', timestamp: '5 hours ago', thumbnail: '' },
    { id: '3', title: 'Feature Announcement', platform: 'twitter', timestamp: '1 day ago', thumbnail: '' },
    { id: '4', title: 'Event Promo', platform: 'instagram', timestamp: '2 days ago', thumbnail: '' },
  ];

  const platformIcons = {
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
  };

  return (
    <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {generations.map((gen, index) => {
          const PlatformIcon = platformIcons[gen.platform];
          
          return (
            <motion.div
              key={gen.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(gen.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center flex-shrink-0 shadow-md">
                <PlatformIcon className="w-8 h-8 text-[#CDFF2A]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#1F2937] truncate">{gen.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PlatformIcon className="w-3 h-3 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">{gen.timestamp}</span>
                </div>
              </div>

              {/* Quick Actions */}
              {hoveredId === gen.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex gap-2"
                >
                  <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <Eye className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <Edit className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <Download className="w-4 h-4 text-[#6B7280]" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-md transition-colors">
                    <Trash2 className="w-4 h-4 text-[#EF4444]" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
