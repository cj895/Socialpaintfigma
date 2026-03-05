import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { FileUpload } from '../ui/file-upload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { BrandAnalysisModal } from '../modals/BrandAnalysisModal';
import { Search, Download, Edit, Trash2, Instagram, Linkedin, Twitter, Plus, Upload, Eye, Sparkles, Image as ImageIcon, FileImage, Palette, Type, Layout, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { aiService } from '../../services/ai-service';
import { styleDNA } from '../../services/style-dna-service';

interface StyleElement {
  id: string;
  type: 'color' | 'typography' | 'layout' | 'pattern' | 'image';
  name: string;
  confidence: number;
  usageCount: number;
  dateAdded: string;
  platforms: string[];
  preview: string;
  editable: boolean;
  meta?: any; // Extra metadata like font weight, specific color slot
}

interface BrandAsset {
  id: string;
  name: string;
  file: File;
  preview: string;
  uploadedAt: Date;
  size: number;
  analyzed: boolean;
}

interface StyleLibraryProps {
  brandAssets?: BrandAsset[];
  setBrandAssets?: (assets: BrandAsset[] | ((prev: BrandAsset[]) => BrandAsset[])) => void;
  defaultTab?: 'elements' | 'assets';
}

const AVAILABLE_FONTS = [
  'Inter', 'Playfair Display', 'Roboto', 'Montserrat', 'Open Sans', 'Lato', 'Poppins', 'Oswald', 'Lora', 'Merriweather'
];

export function StyleLibrary({ 
  brandAssets: externalBrandAssets, 
  setBrandAssets: externalSetBrandAssets,
  defaultTab = 'elements'
}: StyleLibraryProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [confidenceRange, setConfidenceRange] = useState([50]);
  const [selectedElement, setSelectedElement] = useState<StyleElement | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBrandAnalysisModal, setShowBrandAnalysisModal] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use external state if provided, otherwise use local state
  const [localBrandAssets, setLocalBrandAssets] = useState<BrandAsset[]>([]);
  const brandAssets = externalBrandAssets ?? localBrandAssets;
  const setBrandAssets = externalSetBrandAssets ?? setLocalBrandAssets;

  const [styleElements, setStyleElements] = useState<StyleElement[]>([]);

  // Initialize from Style DNA
  useEffect(() => {
    const profile = styleDNA.getProfile();
    const elements: StyleElement[] = [];

    // Colors
    profile.colors.primary.forEach((color, idx) => {
      elements.push({
        id: `color-primary-${idx}`,
        type: 'color',
        name: idx === 0 ? 'Primary Brand Color' : `Primary Shade ${idx + 1}`,
        confidence: 98,
        usageCount: 156 - idx * 20,
        dateAdded: 'Oct 1, 2025',
        platforms: ['instagram', 'linkedin', 'twitter'],
        preview: color,
        editable: true,
        meta: { slot: 'primary', index: idx }
      });
    });

    profile.colors.accent.forEach((color, idx) => {
      elements.push({
        id: `color-accent-${idx}`,
        type: 'color',
        name: 'Brand Accent',
        confidence: 94,
        usageCount: 89,
        dateAdded: 'Oct 5, 2025',
        platforms: ['instagram'],
        preview: color,
        editable: true,
        meta: { slot: 'accent', index: idx }
      });
    });

    // Typography
    elements.push({
      id: 'type-heading',
      type: 'typography',
      name: 'Heading Font',
      confidence: 95,
      usageCount: 210,
      dateAdded: 'Oct 1, 2025',
      platforms: ['instagram', 'linkedin', 'twitter'],
      preview: profile.typography.headingFont,
      editable: true,
      meta: { slot: 'heading' }
    });

    elements.push({
      id: 'type-body',
      type: 'typography',
      name: 'Body Font',
      confidence: 92,
      usageCount: 180,
      dateAdded: 'Oct 1, 2025',
      platforms: ['instagram', 'linkedin', 'twitter'],
      preview: profile.typography.bodyFont,
      editable: true,
      meta: { slot: 'body' }
    });

    // Layouts
    profile.layouts.preferred.forEach((layout, idx) => {
      elements.push({
        id: `layout-${idx}`,
        type: 'layout',
        name: `${layout.charAt(0).toUpperCase() + layout.slice(1)} Layout`,
        confidence: 88,
        usageCount: 45 + idx * 10,
        dateAdded: 'Oct 10, 2025',
        platforms: ['instagram'],
        preview: `Optimized ${layout} arrangement for brand messaging`,
        editable: true,
        meta: { slot: 'layout', value: layout }
      });
    });

    setStyleElements(elements);
  }, []);

  const filteredElements = styleElements.filter(element => {
    const matchesCategory = selectedCategory === 'all' || element.type === selectedCategory;
    const matchesConfidence = element.confidence >= confidenceRange[0];
    const matchesSearch = searchQuery === '' || 
      element.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesConfidence && matchesSearch;
  });

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsAnalyzing(true);
    
    try {
      // Use AI to analyze the uploaded files
      const analysisResults = await Promise.all(
        files.map(file => aiService.analyzeImage(file))
      );

      // Add analyzed elements to library
      const newElements: StyleElement[] = analysisResults.map((result, index) => ({
        id: `new_${Date.now()}_${index}`,
        type: 'color',
        name: `Extracted ${result.style}`,
        confidence: result.confidence,
        usageCount: 0,
        dateAdded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        platforms: [],
        preview: result.dominantColors[0],
        editable: true,
      }));

      setStyleElements([...styleElements, ...newElements]);
      setShowUploadDialog(false);
      setIsAnalyzing(false);

      toast.success(`Added ${newElements.length} style elements!`, {
        description: 'AI analyzed and extracted styles from your uploads'
      });
    } catch (error) {
      setIsAnalyzing(false);
      toast.error('Failed to analyze files');
    }
  };

  const handleEditElement = (element: StyleElement) => {
    setSelectedElement(element);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedElement) return;

    // Update local state
    const updatedElements = styleElements.map(el => 
      el.id === selectedElement.id ? selectedElement : el
    );
    setStyleElements(updatedElements);
    
    // Update Style DNA Service
    const profile = styleDNA.getProfile();
    const updates: any = {};

    if (selectedElement.type === 'color') {
      const slot = selectedElement.meta?.slot;
      const index = selectedElement.meta?.index || 0;
      
      if (slot === 'primary') {
        const newColors = [...profile.colors.primary];
        newColors[index] = selectedElement.preview;
        updates.colors = { ...profile.colors, primary: newColors };
      } else if (slot === 'secondary') {
        const newColors = [...profile.colors.secondary];
        newColors[index] = selectedElement.preview;
        updates.colors = { ...profile.colors, secondary: newColors };
      } else if (slot === 'accent') {
        const newColors = [...profile.colors.accent];
        newColors[index] = selectedElement.preview;
        updates.colors = { ...profile.colors, accent: newColors };
      }
    } else if (selectedElement.type === 'typography') {
      const slot = selectedElement.meta?.slot;
      if (slot === 'heading') {
        updates.typography = { ...profile.typography, headingFont: selectedElement.preview };
      } else if (slot === 'body') {
        updates.typography = { ...profile.typography, bodyFont: selectedElement.preview };
      }
    }

    if (Object.keys(updates).length > 0) {
      styleDNA.updateProfile(updates);
    }
    
    setShowEditDialog(false);
    toast.success('Style element updated!', {
      description: 'Changes will be applied to future AI generations.'
    });
  };

  const handleDeleteElement = (id: string) => {
    setStyleElements(styleElements.filter(el => el.id !== id));
    toast.success('Style element deleted');
  };

  const handleBrandAssetUpload = async (files: File[]) => {
    const newAssets: BrandAsset[] = files.map((file, index) => ({
      id: `asset_${Date.now()}_${index}`,
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file),
      uploadedAt: new Date(),
      size: file.size,
      analyzed: false,
    }));

    setBrandAssets([...brandAssets, ...newAssets]);
    toast.success(`${files.length} brand asset(s) uploaded`, {
      description: 'Ready to analyze and extract style DNA'
    });
  };

  const handleDeleteBrandAsset = (id: string) => {
    const asset = brandAssets.find(a => a.id === id);
    if (asset) {
      URL.revokeObjectURL(asset.preview); // Clean up memory
    }
    setBrandAssets(brandAssets.filter(a => a.id !== id));
    toast.success('Brand asset deleted');
  };

  const handleAnalyzeBrandAssets = () => {
    if (brandAssets.length === 0) {
      toast.error('No brand assets to analyze', {
        description: 'Please upload at least one brand asset first'
      });
      return;
    }
    setShowBrandAnalysisModal(true);
  };

  const handleAnalysisComplete = () => {
    // Mark all assets as analyzed
    setBrandAssets(brandAssets.map(asset => ({
      ...asset,
      analyzed: true,
    })));
    toast.success('Brand assets analyzed!', {
      description: 'Style DNA has been updated with your brand elements'
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      default: return Instagram;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'color': return 'bg-[#353CED]/20 text-[#353CED]';
      case 'typography': return 'bg-[#CDFF2A]/20 text-[#1F2937]';
      case 'layout': return 'bg-[#00328F]/20 text-[#00328F]';
      case 'pattern': return 'bg-[#353CED]/10 text-[#353CED]';
      case 'image': return 'bg-[#001B42]/20 text-[#001B42]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="p-8 space-y-6 h-full overflow-auto bg-[#FAFBFC]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
          <div>
            <h2 className="text-[#1F2937]">Style Library</h2>
            <p className="text-sm text-[#6B7280]">Your learned design elements and brand assets</p>
          </div>
        </div>
        <div className="flex gap-3">
          {activeTab === 'elements' ? (
            <Button
              onClick={() => setShowUploadDialog(true)}
              className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Style Elements
            </Button>
          ) : (
            <>
              <Button
                onClick={handleAnalyzeBrandAssets}
                disabled={brandAssets.length === 0}
                className="bg-[#353CED] text-white hover:bg-gradient-to-r hover:from-[#001B42] hover:via-[#353CED] hover:to-[#00328F] rounded-xl shadow-sm"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Assets ({brandAssets.length})
              </Button>
              <Button
                onClick={() => document.getElementById('brand-asset-upload')?.click()}
                className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Brand Assets
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
          <TabsTrigger value="elements" className="rounded-lg data-[state=active]:bg-[#353CED] data-[state=active]:text-white">
            Style Elements
          </TabsTrigger>
          <TabsTrigger value="assets" className="rounded-lg data-[state=active]:bg-[#353CED] data-[state=active]:text-white">
            Brand Assets
            {brandAssets.length > 0 && (
              <Badge className="ml-2 bg-[#CDFF2A] text-[#1F2937]">
                {brandAssets.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Style Elements Tab */}
        <TabsContent value="elements" className="space-y-6">")

      {/* Filters */}
      <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          {/* Search */}
          <div className="col-span-1">
            <label className="text-sm text-[#6B7280] mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles..."
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="col-span-1">
            <label className="text-sm text-[#6B7280] mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="color">Colors</SelectItem>
                <SelectItem value="typography">Typography</SelectItem>
                <SelectItem value="layout">Layouts</SelectItem>
                <SelectItem value="pattern">Patterns</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence Range */}
          <div className="col-span-2">
            <label className="text-sm text-[#6B7280] mb-2 block">
              Min Confidence: {confidenceRange[0]}%
            </label>
            <Slider
              value={confidenceRange}
              onValueChange={setConfidenceRange}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      </Card>

      {/* Style Elements Grid */}
      <div className="grid grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="p-6 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                {/* Preview */}
                <div className="mb-4">
                  {element.type === 'color' ? (
                    <div
                      className="w-full h-32 rounded-xl shadow-md"
                      style={{ backgroundColor: element.preview }}
                    />
                  ) : element.type === 'typography' ? (
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 flex items-center justify-center">
                      <p className="text-center px-4" style={{ fontFamily: 'Inter' }}>
                        {element.preview}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center">
                      <p className="text-white text-sm text-center px-4">{element.preview}</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[#1F2937] mb-1">{element.name}</h3>
                      <p className="text-xs text-[#6B7280]">{element.dateAdded}</p>
                    </div>
                    <Badge className={getCategoryColor(element.type)}>
                      {element.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Confidence:</span>
                    <Badge className="bg-[#10B981]/20 text-[#10B981]">
                      {element.confidence}%
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280]">Used:</span>
                    <span className="text-[#1F2937]">{element.usageCount}x</span>
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    {element.platforms.map((platform) => {
                      const Icon = getPlatformIcon(platform);
                      return (
                        <div
                          key={platform}
                          className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center"
                          title={platform}
                        >
                          <Icon className="w-4 h-4 text-[#CDFF2A]" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditElement(element)}
                      className="flex-1 border-gray-200 rounded-xl"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteElement(element.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredElements.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#00328F] flex items-center justify-center shadow-lg">
            <Search className="w-12 h-12 text-[#CDFF2A]" />
          </div>
          <h3 className="text-[#1F2937] mb-2">No style elements found</h3>
          <p className="text-[#6B7280] mb-6">Try adjusting your filters or add new elements</p>
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Style Elements
          </Button>
        </div>
      )}
        </TabsContent>

        {/* Brand Assets Tab */}
        <TabsContent value="assets" className="space-y-6">
          {/* Hidden File Input */}
          <input
            id="brand-asset-upload"
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleBrandAssetUpload(Array.from(e.target.files));
                e.target.value = ''; // Reset input
              }
            }}
          />

          {/* Info Banner */}
          {brandAssets.length > 0 && (
            <Card className="p-4 bg-gradient-to-br from-[#353CED]/10 to-[#CDFF2A]/10 border-[#353CED]/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#353CED]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-[#353CED]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[#1F2937] mb-1">Ready to Analyze</h3>
                  <p className="text-sm text-[#6B7280]">
                    Click "Analyze Assets" to extract colors, fonts, tone, and layout preferences from your {brandAssets.length} uploaded asset{brandAssets.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Button
                  onClick={handleAnalyzeBrandAssets}
                  className="bg-[#353CED] text-white hover:bg-gradient-to-r hover:from-[#001B42] hover:via-[#353CED] hover:to-[#00328F] rounded-xl flex-shrink-0"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Now
                </Button>
              </div>
            </Card>
          )}

          {/* Brand Assets Grid */}
          {brandAssets.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {brandAssets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="p-4 bg-white border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                      {/* Preview */}
                      <div className="relative mb-3">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                          <img
                            src={asset.preview}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {asset.analyzed && (
                          <div className="absolute top-2 right-2">
                            <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-2">
                        <div>
                          <h4 className="text-sm text-[#1F2937] truncate" title={asset.name}>
                            {asset.name}
                          </h4>
                          <p className="text-xs text-[#6B7280]">
                            {(asset.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>

                        {asset.analyzed && (
                          <Badge className="bg-[#10B981]/20 text-[#10B981] text-xs">
                            ✓ Analyzed
                          </Badge>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(asset.preview, '_blank')}
                            className="flex-1 border-gray-200 rounded-xl text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteBrandAsset(asset.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            /* Empty State for Brand Assets */
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#353CED] flex items-center justify-center shadow-lg">
                <FileImage className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-[#1F2937] mb-2">No Brand Assets Yet</h3>
              <p className="text-[#6B7280] mb-6 max-w-md mx-auto">
                Upload your logos, marketing materials, social posts, and website screenshots. AI will analyze them to extract your complete Style DNA.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => document.getElementById('brand-asset-upload')?.click()}
                  className="bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Brand Assets
                </Button>
              </div>
              <div className="mt-8 max-w-2xl mx-auto">
                <Card className="p-6 bg-white border-gray-100 text-left">
                  <h4 className="text-sm text-[#1F2937] mb-3">What gets analyzed?</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Palette, label: 'Brand Colors', desc: 'Primary, secondary, accent palettes' },
                      { icon: Type, label: 'Typography', desc: 'Font styles and hierarchies' },
                      { icon: Sparkles, label: 'Brand Tone', desc: 'Visual personality traits' },
                      { icon: Layout, label: 'Layouts', desc: 'Composition preferences' },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#353CED]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-[#353CED]" />
                          </div>
                          <div>
                            <p className="text-sm text-[#1F2937]">{item.label}</p>
                            <p className="text-xs text-[#6B7280]">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>Add Style Elements</DialogTitle>
            <DialogDescription>
              Upload design files, images, or screenshots. socialpAInt AI will analyze them and extract style elements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={handleFileUpload}
              accept="image/*"
              multiple={true}
              maxSize={20}
              label="Upload design files"
              description="JPG, PNG, SVG, or PSD files (max 20MB each)"
            />
            {isAnalyzing && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#001B42] to-[#353CED] flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#1F2937]">Analyzing with AI...</p>
                <p className="text-sm text-[#6B7280]">Extracting colors, fonts, and layouts</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Style Element</DialogTitle>
            <DialogDescription>
              Update the name and properties of this style element. Changes will be saved to your Style DNA.
            </DialogDescription>
          </DialogHeader>
          {selectedElement && (
            <div className="space-y-6 py-4">
              <div>
                <label className="text-sm font-medium text-[#1F2937] mb-2 block">Element Name</label>
                <Input
                  value={selectedElement.name}
                  onChange={(e) => setSelectedElement({ ...selectedElement, name: e.target.value })}
                  className="bg-gray-50 border-gray-200 rounded-xl"
                  placeholder="e.g., Primary Brand Color"
                />
              </div>

              {selectedElement.type === 'color' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1F2937] mb-2 block">Color Value</label>
                    <div className="flex gap-3">
                      <div className="relative group">
                        <Input
                          type="color"
                          value={selectedElement.preview}
                          onChange={(e) => setSelectedElement({ ...selectedElement, preview: e.target.value })}
                          className="w-16 h-12 rounded-xl cursor-pointer p-1"
                        />
                        <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-black/10" />
                      </div>
                      <div className="flex-1 relative">
                        <Input
                          value={selectedElement.preview}
                          onChange={(e) => setSelectedElement({ ...selectedElement, preview: e.target.value })}
                          className="bg-gray-50 border-gray-200 rounded-xl uppercase font-mono"
                          placeholder="#000000"
                        />
                        <Palette className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-[#6B7280] mb-2">Suggested Palette Matches:</p>
                    <div className="flex gap-2">
                      {['#353CED', '#001B42', '#CDFF2A', '#00328F', '#FAFBFC'].map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedElement({ ...selectedElement, preview: c })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${selectedElement.preview.toLowerCase() === c.toLowerCase() ? 'border-[#353CED] scale-110 shadow-sm' : 'border-white'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedElement.type === 'typography' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[#1F2937] mb-2 block">Font Family</label>
                    <Select 
                      value={selectedElement.preview} 
                      onValueChange={(val) => setSelectedElement({ ...selectedElement, preview: val })}
                    >
                      <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_FONTS.map(font => (
                          <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-inner overflow-hidden min-h-[120px] flex items-center justify-center">
                    <p 
                      style={{ 
                        fontFamily: selectedElement.preview,
                        fontSize: selectedElement.name.includes('Heading') ? '24px' : '16px',
                        fontWeight: selectedElement.name.includes('Heading') ? '700' : '400'
                      }}
                      className="text-[#1F2937] text-center"
                    >
                      {selectedElement.name.includes('Heading') 
                        ? 'The Quick Brown Fox Jumps Over The Lazy Dog'
                        : 'Experience the next generation of AI-powered design. Automatically learned, perfectly on-brand.'}
                    </p>
                  </div>

                  <div className="bg-[#353CED]/5 p-3 rounded-xl border border-[#353CED]/10">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#353CED] mt-0.5" />
                      <p className="text-xs text-[#353CED]">
                        Changing this font will update your Style DNA and affect all future {selectedElement.name.toLowerCase()} generations.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedElement.type === 'layout' && (
                <div className="space-y-4">
                   <div>
                    <label className="text-sm font-medium text-[#1F2937] mb-2 block">Description</label>
                    <Input
                      value={selectedElement.preview}
                      onChange={(e) => setSelectedElement({ ...selectedElement, preview: e.target.value })}
                      className="bg-gray-50 border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t border-gray-100">
                <Button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-[#353CED] text-white hover:bg-[#001B42] rounded-xl shadow-sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply to DNA
                </Button>
                <Button
                  onClick={() => setShowEditDialog(false)}
                  variant="outline"
                  className="border-gray-200 rounded-xl text-[#6B7280]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Brand Analysis Modal */}
      <BrandAnalysisModal
        isOpen={showBrandAnalysisModal}
        onClose={() => setShowBrandAnalysisModal(false)}
        onComplete={handleAnalysisComplete}
        preloadedFiles={brandAssets.map(asset => asset.file)}
      />
    </div>
  );
}
