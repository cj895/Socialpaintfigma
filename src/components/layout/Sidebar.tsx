import { useState } from 'react';
import { Home, Palette, Brain, Sparkles, Folder, BarChart3, Settings, TrendingUp, Fingerprint, ChevronLeft, ChevronRight, X, Pencil } from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { UpgradePlanModal } from '../modals/UpgradePlanModal';
import logo from 'figma:asset/0dc461c01ad3aed282b4c4ff5ef5591f247a738d.png';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ currentView, onNavigate, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'design-studio', label: 'Design Studio', icon: Pencil },
    { id: 'generate', label: 'Generate Content', icon: Sparkles },
    { id: 'style-dna', label: 'Style DNA', icon: Fingerprint },
    { id: 'style-library', label: 'Style Library', icon: Palette },
    { id: 'learning', label: 'Learning Sessions', icon: Brain },
    { id: 'assets', label: 'Brand Assets', icon: Folder },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? '80px' : '240px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex h-screen bg-white border-r border-gray-100 flex-col relative z-10"
      >
        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-center border-b border-gray-100">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.img
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                src={logo}
                alt="socialpAInt"
                className="h-9"
              />
            ) : (
              <motion.div
                key="mini-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start'} gap-3 rounded-xl ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#001B42] to-[#00328F] text-white hover:from-[#000a1a] hover:to-[#001b4d] shadow-md' 
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                }`}
                onClick={() => handleNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            );
          })}
        </nav>

        {/* Storage Usage */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 border-t border-gray-200 space-y-4 overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6B7280]">Storage</span>
                  <span className="text-sm text-[#1F2937]">67%</span>
                </div>
                <Progress value={67} className="h-2" />
                <p className="text-xs text-[#6B7280]">6.7 GB of 10 GB used</p>
              </div>
              
              <Button 
                onClick={() => setShowUpgradeModal(true)}
                className="w-full gradient-primary hover:opacity-90 transition-opacity"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
          )}
        </button>
      </motion.div>

      {/* Sidebar - Mobile */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isMobileOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50"
      >
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="absolute top-6 right-4 w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>

        {/* Logo */}
        <div className="h-20 px-6 flex items-center justify-center border-b border-gray-100">
          <img
            src={logo}
            alt="socialpAInt"
            className="h-9"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-3 rounded-xl ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#001B42] to-[#00328F] text-white hover:from-[#000a1a] hover:to-[#001b4d] shadow-md' 
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-gray-50'
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Storage Usage */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Storage</span>
              <span className="text-sm text-[#1F2937]">67%</span>
            </div>
            <Progress value={67} className="h-2" />
            <p className="text-xs text-[#6B7280]">6.7 GB of 10 GB used</p>
          </div>
          
          <Button 
            onClick={() => setShowUpgradeModal(true)}
            className="w-full gradient-primary hover:opacity-90 transition-opacity"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </motion.div>

      {/* Upgrade Modal */}
      <UpgradePlanModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}