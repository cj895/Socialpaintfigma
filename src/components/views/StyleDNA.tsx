import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { BrandAnalysisModal } from '../modals/BrandAnalysisModal';
import { 
  Brain, 
  Palette, 
  Type, 
  Image, 
  Layout, 
  Sparkles, 
  TrendingUp,
  Clock,
  CheckCircle,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Upload,
  Zap
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function StyleDNA() {
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const confidenceScore = 94;
  
  const colorPalette = [
    { color: '#001B42', name: 'Brand Navy', usage: 35, hex: '#001B42' },
    { color: '#353CED', name: 'Brand Blue', usage: 30, hex: '#353CED' },
    { color: '#00328F', name: 'Deep Blue', usage: 20, hex: '#00328F' },
    { color: '#353CED', name: 'Accent Blue', usage: 10, hex: '#353CED' },
    { color: '#CDFF2A', name: 'Electric Lime', usage: 5, hex: '#CDFF2A' },
  ];

  const typography = [
    { name: 'Inter', category: 'Sans-serif', usage: 65, contexts: ['Body', 'UI', 'Captions'] },
    { name: 'Playfair Display', category: 'Serif', usage: 20, contexts: ['Headlines', 'Quotes'] },
    { name: 'Roboto', category: 'Sans-serif', usage: 10, contexts: ['Labels', 'Data'] },
    { name: 'Montserrat', category: 'Sans-serif', usage: 5, contexts: ['Accents'] },
  ];

  const layoutPreferences = [
    { name: 'Grid-based', score: 92, description: 'Strong preference for structured grid layouts' },
    { name: 'Asymmetric balance', score: 78, description: 'Creative use of asymmetry while maintaining visual balance' },
    { name: 'Generous whitespace', score: 85, description: 'Comfortable with breathing room and negative space' },
    { name: 'Layered depth', score: 70, description: 'Moderate use of shadows and depth effects' },
  ];

  const imageStyle = [
    { name: 'Photography style', value: 'Lifestyle & candid', confidence: 88 },
    { name: 'Color treatment', value: 'Vibrant with high saturation', confidence: 91 },
    { name: 'Composition', value: 'Center-weighted with rule of thirds', confidence: 85 },
    { name: 'Subject matter', value: 'People-focused, urban settings', confidence: 82 },
  ];

  const brandVoice = [
    { trait: 'Professional', score: 85 },
    { trait: 'Friendly', score: 92 },
    { trait: 'Innovative', score: 88 },
    { trait: 'Trustworthy', score: 90 },
    { trait: 'Bold', score: 75 },
    { trait: 'Playful', score: 65 },
  ];

  const learningHistory = [
    { date: 'Today', sessions: 3, decisions: 147, newPatterns: 8 },
    { date: 'Yesterday', sessions: 5, decisions: 234, newPatterns: 12 },
    { date: 'This Week', sessions: 18, decisions: 892, newPatterns: 34 },
    { date: 'This Month', sessions: 64, decisions: 2847, newPatterns: 127 },
  ];

  const platformAdaptations = [
    { 
      platform: 'Instagram', 
      icon: Instagram, 
      adaptations: ['Square crops preferred', 'Bold text overlays', 'Vibrant color usage'],
      performance: 94
    },
    { 
      platform: 'LinkedIn', 
      icon: Linkedin, 
      adaptations: ['Professional tone', 'Data visualizations', 'Minimal design'],
      performance: 88
    },
    { 
      platform: 'Twitter', 
      icon: Twitter, 
      adaptations: ['Punchy headlines', 'High contrast', 'Simple layouts'],
      performance: 91
    },
  ];

  const contentPatterns = [
    { type: 'Social Posts', count: 847, avgAccuracy: 94, topElements: ['Bold headlines', 'Gradient overlays', 'Left-aligned text'] },
    { type: 'Stories', count: 562, avgAccuracy: 91, topElements: ['Vertical orientation', 'Bottom text placement', 'Animated elements'] },
    { type: 'Carousels', count: 234, avgAccuracy: 89, topElements: ['Consistent templates', 'Progressive reveals', 'Swipe indicators'] },
  ];

  return (
    <div className="p-8 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <div>
            <h2 className="text-[#1F2937]">Style DNA Profile</h2>
            <p className="text-sm text-[#6B7280] mt-1">Your complete creative fingerprint</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowAnalysisModal(true)}
            className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Brand Assets
          </Button>
          <div className="text-right">
            <p className="text-sm text-[#6B7280]">Confidence Score</p>
            <p className="text-2xl text-[#1F2937]">{confidenceScore}%</p>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#353CED] flex items-center justify-center shadow-lg navy-glow">
            <Brain className="w-10 h-10 text-[#CDFF2A]" />
          </div>
        </div>
      </div>

      {/* Quick AI Analysis Banner */}
      <Card className="p-4 bg-gradient-to-br from-[#353CED]/10 to-[#CDFF2A]/10 border-[#353CED]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#353CED]/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-[#353CED]" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#1F2937] mb-1">Accelerate Style Learning</h3>
            <p className="text-sm text-[#6B7280]">
              Upload your existing brand assets (logos, marketing materials, social posts) and let AI instantly analyze and extract your complete Style DNA
            </p>
          </div>
          <Button
            onClick={() => setShowAnalysisModal(true)}
            className="bg-white border border-[#353CED]/30 text-[#353CED] hover:bg-[#353CED]/5 rounded-xl flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Assets
          </Button>
        </div>
      </Card>

      {/* Learning Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Design Decisions', value: '2,847', icon: CheckCircle, trend: '+234 this week' },
          { label: 'Learning Sessions', value: '64', icon: Clock, trend: '+18 this week' },
          { label: 'Patterns Identified', value: '127', icon: Sparkles, trend: '+34 this week' },
          { label: 'Style Accuracy', value: '94%', icon: TrendingUp, trend: '+2% this month' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-[#CDFF2A]" />
                  </div>
                  <div>
                    <p className="text-2xl text-[#1F2937]">{stat.value}</p>
                    <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  </div>
                </div>
                <p className="text-xs text-[#10B981]">{stat.trend}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="bg-gray-100 rounded-xl">
          <TabsTrigger value="colors" className="rounded-lg">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="rounded-lg">
            <Type className="w-4 h-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout" className="rounded-lg">
            <Layout className="w-4 h-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="imagery" className="rounded-lg">
            <Image className="w-4 h-4 mr-2" />
            Imagery
          </TabsTrigger>
          <TabsTrigger value="tone" className="rounded-lg">
            <Sparkles className="w-4 h-4 mr-2" />
            Tone & Voice
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6 mt-6">
          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Color Palette Preferences</h3>
            </div>
            <div className="space-y-4">
              {colorPalette.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div
                    className="w-16 h-16 rounded-xl shadow-lg ring-2 ring-white flex-shrink-0"
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-[#1F2937]">{color.name}</p>
                        <p className="text-sm text-[#6B7280]">{color.hex}</p>
                      </div>
                      <Badge className="bg-[#CDFF2A] text-[#1F2937]">{color.usage}% usage</Badge>
                    </div>
                    <Progress value={color.usage} className="h-2" />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Brand Voice Traits</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {brandVoice.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#1F2937]">{trait.trait}</p>
                    <p className="text-sm text-[#6B7280]">{trait.score}%</p>
                  </div>
                  <Progress value={trait.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6 mt-6">
          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Font Preferences</h3>
            </div>
            <div className="space-y-6">
              {typography.map((font, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg text-[#1F2937]" style={{ fontFamily: font.name }}>{font.name}</p>
                      <p className="text-sm text-[#6B7280]">{font.category}</p>
                    </div>
                    <Badge className="bg-gradient-to-r from-[#001B42] to-[#353CED] text-white">
                      {font.usage}% usage
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {font.contexts.map((context, i) => (
                      <Badge key={i} variant="outline" className="border-gray-300">
                        {context}
                      </Badge>
                    ))}
                  </div>
                  <Progress value={font.usage} className="h-2 mt-3" />
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-6 mt-6">
          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Layout Preferences</h3>
            </div>
            <div className="space-y-4">
              {layoutPreferences.map((pref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#1F2937]">{pref.name}</p>
                    <Badge className="bg-[#CDFF2A] text-[#1F2937]">{pref.score}%</Badge>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-3">{pref.description}</p>
                  <Progress value={pref.score} className="h-2" />
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Content Type Patterns</h3>
            </div>
            <div className="space-y-4">
              {contentPatterns.map((pattern, index) => (
                <div key={index} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[#1F2937]">{pattern.type}</p>
                      <p className="text-sm text-[#6B7280]">{pattern.count} created • {pattern.avgAccuracy}% accuracy</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {pattern.topElements.map((element, i) => (
                      <Badge key={i} variant="outline" className="border-gray-300 text-xs">
                        {element}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Imagery Tab */}
        <TabsContent value="imagery" className="space-y-6 mt-6">
          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Image Style Analysis</h3>
            </div>
            <div className="space-y-4">
              {imageStyle.map((style, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-[#6B7280]">{style.name}</p>
                    <Badge className="bg-gradient-to-r from-[#001B42] to-[#353CED] text-white text-xs">
                      {style.confidence}% confident
                    </Badge>
                  </div>
                  <p className="text-[#1F2937]">{style.value}</p>
                  <Progress value={style.confidence} className="h-2 mt-2" />
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Platform Adaptations</h3>
            </div>
            <div className="space-y-4">
              {platformAdaptations.map((platform, index) => {
                const Icon = platform.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5 text-[#CDFF2A]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[#1F2937]">{platform.platform}</p>
                        <p className="text-sm text-[#6B7280]">Performance: {platform.performance}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {platform.adaptations.map((adaptation, i) => (
                        <Badge key={i} variant="outline" className="border-gray-300 text-xs">
                          {adaptation}
                        </Badge>
                      ))}
                    </div>
                    <Progress value={platform.performance} className="h-2 mt-3" />
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Tone & Voice Tab */}
        <TabsContent value="tone" className="space-y-6 mt-6">
          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Brand Tone & Voice</h3>
            </div>
            
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#353CED]/10 to-[#CDFF2A]/10 border border-[#353CED]/20">
              <p className="text-sm text-[#6B7280] mb-2">Primary Tone</p>
              <p className="text-xl text-[#1F2937]">Professional & Innovative</p>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-[#6B7280]">Tone Attributes</p>
              {brandVoice.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#1F2937]">{trait.trait}</p>
                    <Badge className={
                      trait.score >= 85 
                        ? 'bg-[#10B981]/20 text-[#10B981]'
                        : trait.score >= 75
                        ? 'bg-[#353CED]/20 text-[#353CED]'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                    }>
                      {trait.score}%
                    </Badge>
                  </div>
                  <Progress value={trait.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Messaging Guidelines</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-[#1F2937] mb-2">✅ Do</p>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Use clear, authoritative language</li>
                  <li>• Keep it warm and approachable</li>
                  <li>• Emphasize cutting-edge solutions</li>
                  <li>• Build trust through transparency</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-[#1F2937] mb-2">❌ Avoid</p>
                <ul className="space-y-1 text-sm text-[#6B7280]">
                  <li>• Overly casual or unprofessional language</li>
                  <li>• Jargon without explanation</li>
                  <li>• Pushy or aggressive sales tactics</li>
                  <li>• Inconsistent brand messaging</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
              <h3 className="text-[#1F2937]">Example Phrases</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                'Proven results',
                'Industry-leading',
                'We\'re here for you',
                'Let\'s create together',
                'Next-generation',
                'Transform the way',
                'Built on trust',
                'Your success matters'
              ].map((phrase, i) => (
                <div key={i} className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  <p className="text-sm text-[#1F2937]">"{phrase}"</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Learning History */}
      <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <h3 className="text-[#1F2937]">Learning History</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {learningHistory.map((period, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
            >
              <p className="text-sm text-[#6B7280] mb-3">{period.date}</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-[#6B7280]">Sessions</p>
                  <p className="text-xl text-[#1F2937]">{period.sessions}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Decisions</p>
                  <p className="text-xl text-[#1F2937]">{period.decisions}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">New Patterns</p>
                  <p className="text-xl text-[#353CED]">{period.newPatterns}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Brand Analysis Modal */}
      <BrandAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        onComplete={() => {
          setLastUpdated(new Date());
          toast.success('Style DNA updated successfully!');
        }}
      />
    </div>
  );
}
