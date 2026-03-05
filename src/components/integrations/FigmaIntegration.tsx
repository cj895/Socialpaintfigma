import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  Sparkles, 
  Eye,
  Palette,
  Type,
  Layout,
  Copy,
  Download,
  AlertCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface FigmaIntegrationProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function FigmaIntegration({ onConnect, onDisconnect }: FigmaIntegrationProps) {
  const [isConnected, setIsConnected] = useState(() => {
    return localStorage.getItem('figma_connected') === 'true';
  });
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [apiKey, setApiKey] = useState('');
  
  // Tracking settings
  const [settings, setSettings] = useState({
    autoTrack: true,
    trackColors: true,
    trackTypography: true,
    trackLayout: true,
    trackSpacing: true,
    minConfidenceThreshold: 70,
    notifyOnLearning: true
  });

  const handleConnect = () => {
    setShowSetupDialog(true);
    setSetupStep(1);
  };

  const handleCompleteSetup = () => {
    setIsConnected(true);
    localStorage.setItem('figma_connected', 'true');
    setShowSetupDialog(false);
    
    toast.success('🎨 Figma connected successfully!', {
      description: 'AI will now observe your design work in Figma'
    });
    
    if (onConnect) onConnect();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    localStorage.setItem('figma_connected', 'false');
    
    toast.success('Figma disconnected', {
      description: 'AI will no longer track your Figma designs'
    });
    
    if (onDisconnect) onDisconnect();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem('figma_settings', JSON.stringify({ ...settings, [key]: value }));
    toast.success('Settings updated');
  };

  const copyPluginCode = () => {
    const textToCopy = 'SPAINT-F1GM4-2024-X7Y9Z';
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          toast.success('Connection code copied to clipboard');
        })
        .catch(() => {
          // Fallback if modern API fails
          fallbackCopyText(textToCopy);
        });
    } else {
      // Use fallback for older browsers or non-secure contexts
      fallbackCopyText(textToCopy);
    }
  };
  
  const fallbackCopyText = (text: string) => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.focus();
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast.success('Connection code copied to clipboard');
      } else {
        toast.error('Failed to copy. Please copy manually.');
      }
    } catch (err) {
      toast.error('Failed to copy. Please copy manually.');
    }
    
    // Remove the temporary element
    document.body.removeChild(textarea);
  };

  return (
    <>
      <Card className="p-6 border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M6 6h6v6H6V6zm0 6h6v6H6v-6zm6-6h6v6h-6V6zm6 6h-6v6h6v-6z" fill="#CDFF2A"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-[#1F2937]">Figma Plugin</h3>
                {isConnected && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#6B7280]">
                {isConnected 
                  ? 'AI is observing your design work in Figma'
                  : 'Let AI learn from your Figma designs in real-time'
                }
              </p>
            </div>
          </div>

          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="border-gray-200 rounded-lg"
            >
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              className="bg-gradient-to-r from-[#001B42] to-[#00328F] text-white rounded-lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Connect Figma
            </Button>
          )}
        </div>

        <Separator className="my-6" />

        {/* Status and Features */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Real-time Tracking Status */}
            <div>
              <h4 className="text-sm font-medium text-[#1F2937] mb-3">Real-time Tracking</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-green-900">Active</span>
                  </div>
                  <p className="text-xs text-green-700">Observing design decisions</p>
                </div>
                
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Learning</span>
                  </div>
                  <p className="text-xs text-blue-700">Style DNA improving</p>
                </div>
              </div>
            </div>

            {/* What's Being Tracked */}
            <div>
              <h4 className="text-sm font-medium text-[#1F2937] mb-3">What AI Observes</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-[#001B42]" />
                    <span className="text-sm text-[#1F2937]">Color selections</span>
                  </div>
                  <Switch
                    checked={settings.trackColors}
                    onCheckedChange={(checked) => updateSetting('trackColors', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Type className="w-4 h-4 text-[#001B42]" />
                    <span className="text-sm text-[#1F2937]">Typography choices</span>
                  </div>
                  <Switch
                    checked={settings.trackTypography}
                    onCheckedChange={(checked) => updateSetting('trackTypography', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Layout className="w-4 h-4 text-[#001B42]" />
                    <span className="text-sm text-[#1F2937]">Layout patterns</span>
                  </div>
                  <Switch
                    checked={settings.trackLayout}
                    onCheckedChange={(checked) => updateSetting('trackLayout', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#001B42]" />
                    <span className="text-sm text-[#1F2937]">Spacing & alignment</span>
                  </div>
                  <Switch
                    checked={settings.trackSpacing}
                    onCheckedChange={(checked) => updateSetting('trackSpacing', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div>
              <h4 className="text-sm font-medium text-[#1F2937] mb-3">Preferences</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#1F2937]">Auto-track all designs</p>
                    <p className="text-xs text-[#6B7280]">Learn from every frame you create</p>
                  </div>
                  <Switch
                    checked={settings.autoTrack}
                    onCheckedChange={(checked) => updateSetting('autoTrack', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#1F2937]">Learning notifications</p>
                    <p className="text-xs text-[#6B7280]">Get notified when AI learns new patterns</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnLearning}
                    onCheckedChange={(checked) => updateSetting('notifyOnLearning', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">Learn from your actual work</p>
                  <p className="text-xs text-[#6B7280]">AI observes as you design in Figma</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">No workflow disruption</p>
                  <p className="text-xs text-[#6B7280]">Works silently in the background</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">Automatic Style DNA updates</p>
                  <p className="text-xs text-[#6B7280]">Every design improves AI accuracy</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1F2937]">Privacy-focused</p>
                  <p className="text-xs text-[#6B7280]">Only design decisions are tracked, not content</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Connect Figma Plugin</DialogTitle>
            <DialogDescription>
              Follow these steps to enable AI learning from your Figma designs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    setupStep >= step 
                      ? 'bg-gradient-to-br from-[#001B42] to-[#00328F] text-white' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      setupStep > step ? 'bg-[#001B42]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            {setupStep === 1 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Step 1: Install Plugin</p>
                      <p className="text-xs text-blue-700 mb-3">
                        Install the socialpAInt Observer plugin from the Figma Community
                      </p>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.open('https://figma.com/community/plugin/socialpaint-observer', '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in Figma Community
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#1F2937] font-medium">Quick Install Guide:</p>
                  <ol className="text-sm text-[#6B7280] space-y-2 list-decimal list-inside">
                    <li>Open Figma desktop app or browser</li>
                    <li>Go to Plugins → Browse plugins in Community</li>
                    <li>Search for "socialpAInt Observer"</li>
                    <li>Click "Install" to add to your plugins</li>
                  </ol>
                </div>
              </div>
            )}

            {setupStep === 2 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Step 2: Get Connection Code</p>
                      <p className="text-xs text-blue-700">
                        Copy this code to connect your Figma plugin to socialpAInt
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-[#1F2937] font-medium">Your Connection Code:</label>
                  <div className="flex gap-2">
                    <Input
                      value="SPAINT-F1GM4-2024-X7Y9Z"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      onClick={copyPluginCode}
                      className="flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-[#6B7280]">
                    This code is unique to your account and securely links the plugin to your Style DNA
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-xs text-[#6B7280]">
                    <span className="font-medium text-[#1F2937]">Note:</span> Keep this code private. 
                    Anyone with this code can contribute to your Style DNA.
                  </p>
                </div>
              </div>
            )}

            {setupStep === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Step 3: Activate in Figma</p>
                      <p className="text-xs text-blue-700">
                        Enter the connection code in the Figma plugin to start tracking
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#1F2937] font-medium">In Figma:</p>
                  <ol className="text-sm text-[#6B7280] space-y-2 list-decimal list-inside">
                    <li>Open any Figma file</li>
                    <li>Right-click → Plugins → socialpAInt Observer</li>
                    <li>Paste your connection code</li>
                    <li>Click "Connect"</li>
                    <li>The plugin will run in the background automatically</li>
                  </ol>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900 mb-1">What happens next?</p>
                      <ul className="text-xs text-green-700 space-y-1 list-disc list-inside ml-1">
                        <li>Plugin observes your design decisions silently</li>
                        <li>AI learns your color, typography, and layout patterns</li>
                        <li>Style DNA improves automatically with each design</li>
                        <li>No manual upload or export needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {setupStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setSetupStep(setupStep - 1)}
              >
                Back
              </Button>
            )}
            
            {setupStep < 3 ? (
              <Button
                onClick={() => setSetupStep(setupStep + 1)}
                className="bg-gradient-to-r from-[#001B42] to-[#00328F] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleCompleteSetup}
                className="bg-gradient-to-r from-[#001B42] to-[#00328F] text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}