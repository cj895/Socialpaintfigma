import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Save, X, Type, Palette, Layout, Sparkles } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { styleDNA } from '../../services/style-dna-service';

interface DesignVariation {
  id: string;
  headline: string;
  subtext: string;
  colors: string[];
  layout: string;
  styleScore: number;
  platform: string;
}

interface EditDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: DesignVariation | null;
  onSave: (updatedDesign: DesignVariation) => void;
}

export function EditDesignModal({ isOpen, onClose, design, onSave }: EditDesignModalProps) {
  const [editedDesign, setEditedDesign] = useState<DesignVariation | null>(null);

  useEffect(() => {
    if (design) {
      setEditedDesign(design);
    }
  }, [design, isOpen]);

  if (!editedDesign) return null;

  const handleSave = () => {
    onSave(editedDesign);
    
    // Also update Style DNA if user made changes to help the model learn
    const currentDNA = styleDNA.getProfile();
    const updates: any = {};
    
    // Learn from the selected colors
    if (editedDesign.colors[0] !== currentDNA.colors.primary[0]) {
      const newPrimary = [editedDesign.colors[0], ...currentDNA.colors.primary.slice(1)];
      updates.colors = { ...currentDNA.colors, primary: newPrimary };
    }
    
    if (Object.keys(updates).length > 0) {
      styleDNA.updateProfile(updates);
      toast.info('Style DNA updated!', {
        description: 'AI has learned from your manual adjustments to improve future generations.'
      });
    }

    onClose();
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...editedDesign.colors];
    newColors[index] = newColor;
    setEditedDesign({ ...editedDesign, colors: newColors });
  };

  const handleLayoutChange = (newLayout: 'gradient' | 'split' | 'centered' | 'overlay') => {
    setEditedDesign({ ...editedDesign, layout: newLayout });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#353CED]" />
            Edit Design
          </DialogTitle>
          <DialogDescription>
            Customize your generated design's content, colors, and layout
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left: Editor */}
          <div className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid grid-cols-3 w-full bg-gray-100 rounded-xl">
                <TabsTrigger value="content" className="rounded-lg">
                  <Type className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="colors" className="rounded-lg">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="layout" className="rounded-lg">
                  <Layout className="w-4 h-4 mr-2" />
                  Layout
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="headline" className="text-[#1F2937] mb-2">Headline</Label>
                  <Input
                    id="headline"
                    value={editedDesign.headline}
                    onChange={(e) => setEditedDesign({ ...editedDesign, headline: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl mt-2"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    {editedDesign.headline.length} characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="subtext" className="text-[#1F2937] mb-2">Subtext</Label>
                  <Textarea
                    id="subtext"
                    value={editedDesign.subtext}
                    onChange={(e) => setEditedDesign({ ...editedDesign, subtext: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl mt-2 min-h-24"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    {editedDesign.subtext.length} characters
                  </p>
                </div>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {editedDesign.colors.map((color, index) => (
                    <div key={index}>
                      <Label className="text-[#1F2937] mb-2">
                        {index === 0 ? 'Primary Color' : index === 1 ? 'Secondary Color' : 'Accent Color'}
                      </Label>
                      <div className="flex gap-3 mt-2">
                        <div
                          className="w-16 h-16 rounded-xl border-2 border-gray-200 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <div className="flex-1 space-y-2">
                          <Input
                            type="color"
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="w-full h-12 rounded-xl cursor-pointer"
                          />
                          <Input
                            value={color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="bg-gray-50 border-gray-200 rounded-xl"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-sm text-[#1F2937] mb-1">💡 Color Tip</p>
                  <p className="text-xs text-[#6B7280]">
                    Changes to colors will be reflected in your Style DNA for future generations
                  </p>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-4 mt-4">
                <div>
                  <Label className="text-[#1F2937] mb-3">Layout Style</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      { value: 'gradient', label: 'Gradient', desc: 'Smooth color transition' },
                      { value: 'split', label: 'Split', desc: 'Two-column design' },
                      { value: 'centered', label: 'Centered', desc: 'Center-aligned content' },
                      { value: 'overlay', label: 'Overlay', desc: 'Layered with effects' },
                    ].map((layoutOption) => (
                      <button
                        key={layoutOption.value}
                        onClick={() => handleLayoutChange(layoutOption.value as any)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          editedDesign.layout === layoutOption.value
                            ? 'border-[#353CED] bg-[#353CED]/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm text-[#1F2937] mb-1">{layoutOption.label}</p>
                        <p className="text-xs text-[#6B7280]">{layoutOption.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Live Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-[#1F2937]">Live Preview</Label>
              <div className="text-xs text-[#6B7280]">
                {editedDesign.platform}
              </div>
            </div>

            <div
              className="aspect-square rounded-2xl overflow-hidden shadow-lg relative"
              style={{
                background: editedDesign.layout === 'gradient'
                  ? `linear-gradient(135deg, ${editedDesign.colors[0]} 0%, ${editedDesign.colors[1]} 100%)`
                  : editedDesign.layout === 'split'
                  ? `linear-gradient(90deg, ${editedDesign.colors[0]} 50%, ${editedDesign.colors[1]} 50%)`
                  : editedDesign.colors[0]
              }}
            >
              {/* Render preview based on layout */}
              {editedDesign.layout === 'centered' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h2 className="text-white text-2xl mb-3" style={{ fontWeight: 700 }}>
                    {editedDesign.headline}
                  </h2>
                  <p className="text-white/80 text-sm max-w-xs">
                    {editedDesign.subtext}
                  </p>
                </div>
              )}

              {editedDesign.layout === 'gradient' && (
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="space-y-3">
                    <div className="inline-block px-4 py-2 rounded-full" style={{ backgroundColor: editedDesign.colors[2] }}>
                      <span className="text-sm">✨</span>
                    </div>
                    <h2 className="text-white text-2xl" style={{ fontWeight: 700 }}>
                      {editedDesign.headline}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {editedDesign.subtext}
                    </p>
                  </div>
                </div>
              )}

              {editedDesign.layout === 'split' && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
                    <span className="text-6xl">✨</span>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-1/2 flex flex-col justify-center p-6">
                    <h2 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>
                      {editedDesign.headline}
                    </h2>
                    <p className="text-white/80 text-xs">
                      {editedDesign.subtext}
                    </p>
                  </div>
                </>
              )}

              {editedDesign.layout === 'overlay' && (
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `repeating-linear-gradient(45deg, ${editedDesign.colors[1]}, ${editedDesign.colors[1]} 10px, transparent 10px, transparent 20px)`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-8">
                    <div className="flex justify-end">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: editedDesign.colors[2] }}>
                        <span className="text-xl">✨</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
                        {editedDesign.headline}
                      </h2>
                      <p className="text-white/90 text-sm">
                        {editedDesign.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-gray-50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Style Match</span>
                <span className="text-[#10B981]">{editedDesign.styleScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Platform</span>
                <span className="text-[#1F2937]">{editedDesign.platform}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Button
            onClick={handleSave}
            className="flex-1 bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-200 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
