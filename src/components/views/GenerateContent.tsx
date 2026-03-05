import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Instagram, Linkedin, Twitter, Facebook, Download, RefreshCw, Eye, Zap, Palette, AlertCircle, TrendingUp, Layers, Wand2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { toast } from 'sonner@2.0.3';
import { aiService } from '../../services/ai-service';
import { styleDNA } from '../../services/style-dna-service';

interface GeneratedVariation {
  id: string;
  styleScore: number;
  platform: string;
  headline: string;
  subtext: string;
  description: string;
  colors: string[];
  layout: string;
  typography: {
    headlineFont: string;
    headlineSize: string;
    bodyFont: string;
    bodySize: string;
    alignment: string;
  };
  visualElements: {
    primaryImage: string;
    backgroundStyle: string;
    overlayOpacity: number;
  };
  composition: {
    whitespace: string;
    hierarchy: string;
    visualWeight: string;
  };
  designNotes: string;
}

const PLATFORM_DIMENSIONS = {
  instagram: { width: 1080, height: 1080, name: 'Instagram Post' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  linkedin: { width: 1200, height: 627, name: 'LinkedIn Post' },
  twitter: { width: 1200, height: 675, name: 'Twitter Post' },
  facebook: { width: 1200, height: 630, name: 'Facebook Post' },
};

export function GenerateContent() {
  const [contentType, setContentType] = useState('social');
  const [platform, setPlatform] = useState('instagram');
  const [useStyleDNA, setUseStyleDNA] = useState(true);
  const [styleIntensity, setStyleIntensity] = useState([85]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<GeneratedVariation[]>([]);
  const [hoveredVariation, setHoveredVariation] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedVariation, setSelectedVariation] = useState<GeneratedVariation | null>(null);

  // Get Style DNA data
  const profile = styleDNA.getProfile();
  const designCount = parseInt(localStorage.getItem('designStudio_count') || '0');
  const confidence = Math.min(100, 40 + (designCount * 5));

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, dimensions: '1080×1080' },
    { id: 'instagram-story', name: 'Story', icon: Instagram, dimensions: '1080×1920' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, dimensions: '1200×627' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, dimensions: '1200×675' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, dimensions: '1200×630' },
  ];

  const selectedPlatformData = platforms.find(p => p.id === platform);
  const dimensions = PLATFORM_DIMENSIONS[platform as keyof typeof PLATFORM_DIMENSIONS];

  const handleDownloadVariation = async (variation: GeneratedVariation) => {
    // In production, this would generate actual image file
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    toast.success(`Downloading ${dimensions.name}`, {
      description: `${variation.headline} (${variation.styleScore}% Style DNA match)`
    });
  };

  const handleRegenerateVariation = async (variationId: string) => {
    try {
      const generated = await aiService.generateContent({
        prompt: prompt.trim(),
        platform,
        contentType,
        styleIntensity: styleIntensity[0],
        useStyleDNA
      });

      const newVariation = generated[0];
      
      const updatedVariations = variations.map(v => {
        if (v.id === variationId) {
          return {
            ...newVariation,
            id: v.id,
          };
        }
        return v;
      });
      
      setVariations(updatedVariations);
      toast.success('Variation regenerated with AI!');
    } catch (error) {
      toast.error('Failed to regenerate');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want to create');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generatedContent = await aiService.generateContent({
        prompt: prompt.trim(),
        platform,
        contentType,
        styleIntensity: styleIntensity[0],
        useStyleDNA
      });
      
      setVariations(generatedContent);
      setIsGenerating(false);
      
      toast.success('✨ Generated 3 world-class designs!', {
        description: `Intelligently crafted based on your Style DNA with ${Math.round(styleIntensity[0])}% brand alignment.`
      });
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
      toast.error('Generation failed', {
        description: 'Please try again or adjust your settings.'
      });
    }
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'hero': return '🎯';
      case 'split': return '📱';
      case 'centered': return '⚡';
      case 'minimal': return '✨';
      case 'bold': return '🔥';
      case 'story': return '📖';
      case 'data': return '📊';
      default: return '🎨';
    }
  };

  // Render actual design canvas
  const renderDesignCanvas = (variation: GeneratedVariation, scale: number = 0.3) => {
    const canvasWidth = dimensions.width * scale;
    const canvasHeight = dimensions.height * scale;
    const fontSize = parseInt(variation.typography.headlineSize) * scale;
    const bodySize = parseInt(variation.typography.bodySize) * scale;

    // Calculate padding and spacing based on composition
    const padding = variation.composition.whitespace === 'generous' ? 80 * scale :
                    variation.composition.whitespace === 'balanced' ? 50 * scale : 30 * scale;

    return (
      <div
        className="relative overflow-hidden rounded-lg shadow-xl"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          background: variation.visualElements.backgroundStyle === 'gradient'
            ? `linear-gradient(135deg, ${variation.colors[0]}, ${variation.colors[1]})`
            : variation.visualElements.backgroundStyle === 'solid'
            ? variation.colors[0]
            : `linear-gradient(135deg, ${variation.colors[0]}, ${variation.colors[1]})`,
        }}
      >
        {/* Decorative elements based on layout */}
        {variation.layout === 'hero' && (
          <>
            <div 
              className="absolute top-0 right-0 w-1/2 h-1/2 rounded-full blur-3xl opacity-20"
              style={{ background: variation.colors[2] }}
            />
            <div 
              className="absolute bottom-0 left-0 w-1/3 h-1/3 rounded-full blur-3xl opacity-20"
              style={{ background: variation.colors[1] }}
            />
          </>
        )}

        {variation.layout === 'minimal' && (
          <div 
            className="absolute top-0 left-0 w-px h-full opacity-10"
            style={{ background: variation.colors[2], left: '20%' }}
          />
        )}

        {variation.layout === 'bold' && (
          <>
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${variation.colors[2]} 35px, ${variation.colors[2]} 37px)`
              }}
            />
          </>
        )}

        {variation.layout === 'data' && (
          <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20">
            <div className="flex items-end justify-around h-full px-8">
              {[0.6, 0.8, 0.5, 0.9, 0.7].map((height, i) => (
                <div
                  key={i}
                  className="w-12 rounded-t-lg"
                  style={{
                    height: `${height * 100}%`,
                    background: variation.colors[2]
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pattern overlays for visual richness */}
        {variation.visualElements.backgroundStyle === 'pattern' && (
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
              backgroundSize: '50px 50px'
            }}
          />
        )}

        {/* Content container */}
        <div 
          className={`absolute inset-0 flex flex-col ${
            variation.typography.alignment === 'center' ? 'justify-center items-center text-center' :
            variation.typography.alignment === 'right' ? 'justify-center items-end text-right' :
            'justify-center items-start text-left'
          }`}
          style={{ padding }}
        >
          {/* Accent element */}
          {variation.composition.hierarchy === 'strong' && (
            <div
              className="mb-4 h-1 rounded-full"
              style={{
                width: 60 * scale,
                background: variation.colors[2]
              }}
            />
          )}

          {/* Headline */}
          <h2
            className="text-white font-bold leading-tight mb-3 max-w-full"
            style={{
              fontSize: fontSize,
              fontFamily: variation.typography.headlineFont,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)'
            }}
          >
            {variation.headline}
          </h2>

          {/* Subtext */}
          <p
            className="text-white/90 leading-relaxed max-w-full"
            style={{
              fontSize: bodySize,
              fontFamily: variation.typography.bodyFont,
              textShadow: '0 1px 10px rgba(0,0,0,0.2)',
              maxWidth: variation.typography.alignment === 'center' ? '80%' : '70%'
            }}
          >
            {variation.subtext}
          </p>

          {/* Visual badge for data layouts */}
          {variation.layout === 'data' && (
            <div className="mt-6 flex items-baseline gap-2">
              <span
                className="font-bold text-white"
                style={{
                  fontSize: fontSize * 1.2,
                  fontFamily: variation.typography.headlineFont
                }}
              >
                2.5x
              </span>
              <span
                className="text-white/80"
                style={{
                  fontSize: bodySize,
                  fontFamily: variation.typography.bodyFont
                }}
              >
                Growth
              </span>
            </div>
          )}

          {/* Decorative elements for story layout */}
          {variation.layout === 'story' && (
            <div className="mt-6 flex gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: variation.colors[2] }}
              >
                <span className="text-xs text-gray-900 font-bold">✓</span>
              </div>
            </div>
          )}
        </div>

        {/* Brand watermark (Style DNA indicator) */}
        {useStyleDNA && (
          <div
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">{variation.styleScore}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Left Panel - Controls */}
      <div className="w-[40%] p-8 overflow-auto border-r border-gray-100 bg-white">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
              <h2 className="text-[#1F2937]">AI Content Generation</h2>
            </div>
            <p className="text-sm text-[#6B7280]">Create content using your learned design style</p>
            
            {/* Style DNA Status */}
            {confidence < 50 && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-amber-900 font-medium">Limited Style DNA ({confidence}%)</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Create {Math.max(1, 10 - designCount)} more design{Math.max(1, 10 - designCount) !== 1 ? 's' : ''} in the Design Studio to improve AI accuracy
                  </p>
                </div>
              </div>
            )}
            
            {confidence >= 50 && (
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-[#001B42]/5 to-[#CDFF2A]/5 border border-[#001B42]/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#001B42]" />
                    <span className="text-sm text-[#001B42] font-medium">Style DNA Active ({confidence}%)</span>
                  </div>
                  <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">{designCount} designs</Badge>
                </div>
                <div className="flex gap-2 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ background: profile.colors.primary[0] || '#001B42' }} />
                    <span>Colors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    <span>{profile.typography.headingFont}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    <span>{profile.layouts.alignment}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content Type Selection */}
          <div>
            <label className="text-[#1F2937] mb-3 block">Content Type</label>
            <Tabs value={contentType} onValueChange={setContentType}>
              <TabsList className="grid grid-cols-3 w-full bg-gray-100 rounded-xl">
                <TabsTrigger value="social" className="rounded-lg">Social Post</TabsTrigger>
                <TabsTrigger value="story" className="rounded-lg">Story/Reel</TabsTrigger>
                <TabsTrigger value="carousel" className="rounded-lg">Carousel</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Platform Selection */}
          <div>
            <label className="text-[#1F2937] mb-3 block">Platform & Dimensions</label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border transition-all ${
                      platform === p.id
                        ? 'bg-gradient-to-br from-[#001B42] to-[#00328F] border-[#001B42] shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      platform === p.id ? 'text-[#CDFF2A]' : 'text-[#6B7280]'
                    }`} />
                    <p className={`text-sm ${platform === p.id ? 'text-white' : 'text-[#1F2937]'}`}>{p.name}</p>
                    <p className={`text-xs mt-1 ${platform === p.id ? 'text-white/70' : 'text-[#6B7280]'}`}>{p.dimensions}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label className="text-[#1F2937] mb-3 block">What do you want to create?</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Launch announcement for new AI-powered design tool, professional and exciting tone..."
              className="min-h-[120px] bg-gray-50 border-gray-200 rounded-xl resize-none"
            />
            <p className="text-xs text-[#6B7280] mt-2">
              💡 Be specific! Mention products, emotions, call-to-actions for best results.
            </p>
          </div>

          {/* Style DNA Toggle */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#001B42]/5 to-[#CDFF2A]/5 border border-[#001B42]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#001B42]" />
                <span className="text-[#1F2937]">Use Style DNA</span>
              </div>
              <Switch
                checked={useStyleDNA}
                onCheckedChange={setUseStyleDNA}
              />
            </div>
            {useStyleDNA && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Brand Alignment</span>
                  <span className="text-[#001B42]">{styleIntensity[0]}%</span>
                </div>
                <Slider
                  value={styleIntensity}
                  onValueChange={setStyleIntensity}
                  min={50}
                  max={100}
                  step={5}
                  className="mt-2"
                />
                <p className="text-xs text-[#6B7280]">
                  Higher values create designs more aligned with your learned brand style
                </p>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-12 bg-gradient-to-r from-[#001B42] to-[#00328F] hover:from-[#000a1a] hover:to-[#001b4d] text-white rounded-xl shadow-lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel - Generated Variations */}
      <div className="flex-1 p-8 overflow-auto bg-[#FAFBFC]">
        <AnimatePresence mode="wait">
          {variations.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-12 h-12 text-[#CDFF2A]" />
                </div>
                <h3 className="text-[#1F2937] mb-3">Ready to Create Magic?</h3>
                <p className="text-[#6B7280] mb-2">
                  Our AI will analyze your prompt and Style DNA to generate world-class designs in exact platform dimensions
                </p>
                <div className="mt-6 space-y-2 text-sm text-left">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-[#CDFF2A] mt-0.5" />
                    <span className="text-[#6B7280]">Intelligent layout selection based on content type</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Palette className="w-4 h-4 text-[#CDFF2A] mt-0.5" />
                    <span className="text-[#6B7280]">Brand-aligned color schemes from your Style DNA</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#CDFF2A] mt-0.5" />
                    <span className="text-[#6B7280]">Pixel-perfect dimensions for each platform</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="variations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[#1F2937]">Generated Variations</h3>
                  <p className="text-sm text-[#6B7280]">
                    {variations.length} AI-powered designs • {dimensions.name} ({dimensions.width}×{dimensions.height}px)
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setVariations([])}
                  className="border-gray-200 rounded-xl"
                >
                  Clear All
                </Button>
              </div>

              {/* Variations Grid */}
              <div className="space-y-6">
                {variations.map((variation, index) => (
                  <motion.div
                    key={variation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredVariation(variation.id)}
                    onMouseLeave={() => setHoveredVariation(null)}
                  >
                    <Card className="overflow-hidden border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all">
                      <div className="p-6">
                        {/* Canvas Preview */}
                        <div className="flex justify-center mb-6">
                          {renderDesignCanvas(variation)}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mb-4">
                          <Button
                            size="sm"
                            onClick={() => handleDownloadVariation(variation)}
                            className="flex-1 bg-[#001B42] hover:bg-[#00328F] text-white"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download ({dimensions.width}×{dimensions.height})
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRegenerateVariation(variation.id)}
                            className="border-gray-200"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedVariation(variation)}
                            className="border-gray-200"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Metadata */}
                        <div className="space-y-4">
                          {/* Style Score & Layout */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-[#10B981]/20 text-[#10B981]">
                              {variation.styleScore}% Style DNA Match
                            </Badge>
                            <Badge className="bg-gray-100 text-[#6B7280]">
                              {getLayoutIcon(variation.layout)} {variation.layout}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {variation.composition.whitespace} spacing
                            </Badge>
                          </div>

                          {/* Color Palette */}
                          <div>
                            <p className="text-xs text-[#6B7280] mb-2">Color Palette from Style DNA</p>
                            <div className="flex gap-2">
                              {variation.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="flex-1 h-10 rounded-lg shadow-sm ring-2 ring-white"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Typography Info */}
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <p className="text-[#6B7280]">Headline Font</p>
                              <p className="text-[#1F2937] font-medium">{variation.typography.headlineFont}</p>
                            </div>
                            <div>
                              <p className="text-[#6B7280]">Body Font</p>
                              <p className="text-[#1F2937] font-medium">{variation.typography.bodyFont}</p>
                            </div>
                          </div>

                          {/* AI Design Notes */}
                          <div>
                            <p className="text-xs text-[#6B7280] mb-1">AI Design Reasoning</p>
                            <p className="text-xs text-[#1F2937] bg-gray-50 p-3 rounded-lg">
                              {variation.designNotes}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
