import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { X, Minimize2, Brain, Eye, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface LearningSessionProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStyleDNA?: () => void;
}

export function LearningSession({ isOpen, onClose, onViewStyleDNA }: LearningSessionProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const observations = [
    { id: '1', text: 'Color selection', icon: Eye, color: '#CDFF2A', status: 'watching' },
    { id: '2', text: 'Consistent 32px heading size', icon: CheckCircle, color: '#10B981', status: 'detected' },
    { id: '3', text: 'Your preferred Instagram grid layout', icon: TrendingUp, color: '#F59E0B', status: 'learning' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-8 top-8 bottom-8 w-[400px]"
          >
            <Card className="h-full glass flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-10 h-10 rounded-full bg-[#353CED]/20 flex items-center justify-center"
                  >
                    <Brain className="w-5 h-5 text-[#353CED]" />
                  </motion.div>
                  <div>
                    <h3 className="text-white">socialpAInt is Learning</h3>
                    <p className="text-xs text-[#9CA3AF]">{isPaused ? 'Paused' : 'Active'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Minimize2 className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex-1 overflow-auto"
                  >
                    {/* Content */}
                    <div className="p-6 space-y-6">
                      {/* Active Observations */}
                      <div>
                        <h4 className="text-white mb-3">Active Observations</h4>
                        <div className="space-y-2">
                          {observations.map((obs, index) => {
                            const Icon = obs.icon;
                            
                            return (
                              <motion.div
                                key={obs.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[#001B42]"
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse-glow"
                                  style={{ backgroundColor: `${obs.color}20` }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: obs.color }} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-[#9CA3AF] capitalize mb-0.5">
                                    {obs.status}
                                  </p>
                                  <p className="text-sm text-white">{obs.text}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Style Confidence Meter */}
                      <div className="p-4 rounded-lg bg-gradient-to-br from-[#353CED]/10 to-[#CDFF2A]/10 border border-[#353CED]/30">
                        <div className="flex items-center justify-center mb-4">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="rgba(53, 60, 237, 0.2)"
                                strokeWidth="8"
                                fill="none"
                              />
                              <motion.circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 352 }}
                                animate={{ strokeDashoffset: 352 - (352 * 0.94) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                strokeDasharray="352"
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#353CED" />
                                  <stop offset="100%" stopColor="#CDFF2A" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <span className="text-3xl text-white">94%</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-white mb-1">Style Confidence</p>
                          <p className="text-xs text-[#9CA3AF]">2,847 decisions analyzed</p>
                          <p className="text-xs text-[#CDFF2A] mt-2">Target: 95% for optimal generation</p>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-[#001B42]">
                          <span className="text-sm text-white">Pause Learning</span>
                          <Switch
                            checked={isPaused}
                            onCheckedChange={setIsPaused}
                          />
                        </div>
                        <Button variant="outline" className="w-full border-white/10">
                          Mark This as Reference
                        </Button>
                        <Button variant="outline" className="w-full border-white/10 text-[#EF4444] hover:text-[#EF4444]">
                          Don't Learn From This
                        </Button>
                      </div>

                      {/* Learning Stats */}
                      <div>
                        <button
                          onClick={() => setShowStats(!showStats)}
                          className="w-full flex items-center justify-between text-sm text-white hover:text-[#CDFF2A] transition-colors"
                        >
                          <span>Learning Stats</span>
                          <motion.div
                            animate={{ rotate: showStats ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {showStats && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 space-y-2 text-sm"
                            >
                              <div className="flex justify-between text-[#9CA3AF]">
                                <span>Session time:</span>
                                <span className="text-white">2h 34m</span>
                              </div>
                              <div className="flex justify-between text-[#9CA3AF]">
                                <span>Decisions captured:</span>
                                <span className="text-white">47</span>
                              </div>
                              <div className="flex justify-between text-[#9CA3AF]">
                                <span>Top learned element:</span>
                                <span className="text-white">Typography</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10">
                      <button 
                        onClick={() => {
                          onClose();
                          onViewStyleDNA?.();
                        }}
                        className="w-full text-center text-sm text-[#CDFF2A] hover:text-[#CDFF2A]/80 transition-colors"
                      >
                        View Full Style Profile →
                      </button>
                      <p className="text-xs text-center text-[#9CA3AF] mt-4">
                        Powered by socialpAInt AI
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
