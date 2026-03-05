import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Type, 
  Square, 
  Circle, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Save,
  Eye,
  Sparkles,
  Layers,
  Trash2,
  Move,
  Minus,
  Copy,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Undo2,
  Redo2,
  ChevronDown,
  Clipboard
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { styleDNA } from '../../services/style-dna-service';

interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  locked: boolean;
  visible: boolean;
  opacity: number;
  content?: string;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  shapeType?: 'rectangle' | 'circle' | 'line';
  zIndex: number;
  name: string;
}

const FORMATS = [
  { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080 },
  { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920 },
  { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627 },
  { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675 },
  { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630 },
];

const FONTS = [
  'Inter', 'Playfair Display', 'Roboto', 'Montserrat', 'Open Sans', 'Poppins', 'Lora', 'Merriweather'
];

const PRESET_COLORS = [
  '#001B42', '#00328F', '#2563EB', '#3B82F6', '#60A5FA',
  '#CDFF2A', '#B8E028', '#10B981', '#EF4444', '#F59E0B',
  '#8B5CF6', '#EC4899', '#FFFFFF', '#F3F4F6', '#1F2937', '#000000'
];

export function DesignStudio() {
  const [selectedFormat, setSelectedFormat] = useState(FORMATS[0]);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [designName, setDesignName] = useState('Untitled Design');
  const [isLearning, setIsLearning] = useState(false);
  const [zoom, setZoom] = useState(0.5);
  const [showGrid, setShowGrid] = useState(false);
  const [clipboard, setClipboard] = useState<CanvasElement | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [aiObservations, setAiObservations] = useState<string[]>([]);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // History
  const [history, setHistory] = useState<CanvasElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showLayers, setShowLayers] = useState(true);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Roboto:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600;700&family=Poppins:wght@400;600;700&family=Lora:wght@400;600;700&family=Merriweather:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Save to history when elements change
  useEffect(() => {
    if (elements.length >= 0) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(elements)));
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [elements]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c' && selectedId) {
        e.preventDefault();
        const el = elements.find(el => el.id === selectedId);
        if (el) {
          setClipboard(JSON.parse(JSON.stringify(el)));
          toast.success('Copied');
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'v' && clipboard) {
        e.preventDefault();
        paste();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        duplicate();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, clipboard, elements, historyIndex, history]);

  const addTextElement = () => {
    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: 'Text',
      x: selectedFormat.width / 2 - 150,
      y: selectedFormat.height / 2 - 30,
      width: 300,
      height: 60,
      rotation: 0,
      locked: false,
      visible: true,
      opacity: 1,
      content: 'Click to edit text',
      color: '#1F2937',
      fontSize: 32,
      fontFamily: 'Inter',
      fontWeight: 700,
      textAlign: 'center',
      zIndex: nextZIndex
    };
    
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
    setNextZIndex(nextZIndex + 1);
    observeDesignDecision('text', `Added text with ${newElement.fontFamily} font`);
  };

  const addShapeElement = (shapeType: 'rectangle' | 'circle') => {
    const newElement: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      name: shapeType === 'circle' ? 'Circle' : 'Rectangle',
      shapeType,
      x: selectedFormat.width / 2 - 100,
      y: selectedFormat.height / 2 - 75,
      width: 200,
      height: 150,
      rotation: 0,
      locked: false,
      visible: true,
      backgroundColor: '#2563EB',
      borderRadius: shapeType === 'circle' ? 9999 : 8,
      borderWidth: 0,
      borderColor: '#000000',
      opacity: 1,
      zIndex: nextZIndex
    };
    
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
    setNextZIndex(nextZIndex + 1);
    observeDesignDecision('shape', `Added ${shapeType} shape`);
  };

  const addLineElement = () => {
    const newElement: CanvasElement = {
      id: `line-${Date.now()}`,
      type: 'line',
      name: 'Line',
      shapeType: 'line',
      x: selectedFormat.width / 2 - 100,
      y: selectedFormat.height / 2,
      width: 200,
      height: 2,
      rotation: 0,
      locked: false,
      visible: true,
      backgroundColor: '#1F2937',
      opacity: 1,
      zIndex: nextZIndex
    };
    
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
    setNextZIndex(nextZIndex + 1);
    observeDesignDecision('line', 'Added line element');
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
    
    if (updates.color || updates.backgroundColor) {
      observeDesignDecision('color', `Used color ${updates.color || updates.backgroundColor}`);
    }
    if (updates.fontFamily) {
      observeDesignDecision('typography', `Selected ${updates.fontFamily} font`);
    }
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setElements(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const paste = () => {
    if (!clipboard) return;
    
    const pastedElement = {
      ...clipboard,
      id: `${clipboard.type}-${Date.now()}`,
      x: clipboard.x + 20,
      y: clipboard.y + 20,
      zIndex: nextZIndex
    };
    
    setElements([...elements, pastedElement]);
    setSelectedId(pastedElement.id);
    setNextZIndex(nextZIndex + 1);
    toast.success('Pasted');
  };

  const duplicate = () => {
    const el = elements.find(e => e.id === selectedId);
    if (!el) return;
    
    setClipboard(JSON.parse(JSON.stringify(el)));
    paste();
  };

  // Mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    const element = elements.find(el => el.id === elementId);
    if (!element || element.locked) return;
    
    setSelectedId(elementId);
    setIsDragging(true);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;
      
      setDragOffset({
        x: mouseX - element.x,
        y: mouseY - element.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;
    
    if (isDragging && selectedId) {
      const newX = Math.max(0, Math.min(selectedFormat.width, mouseX - dragOffset.x));
      const newY = Math.max(0, Math.min(selectedFormat.height, mouseY - dragOffset.y));
      
      updateElement(selectedId, { x: newX, y: newY });
    } else if (isResizing && selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (!element) return;
      
      let newWidth = element.width;
      let newHeight = element.height;
      let newX = element.x;
      let newY = element.y;
      
      if (isResizing.includes('e')) {
        newWidth = Math.max(20, mouseX - element.x);
      }
      if (isResizing.includes('s')) {
        newHeight = Math.max(20, mouseY - element.y);
      }
      if (isResizing.includes('w')) {
        const diff = mouseX - element.x;
        newWidth = Math.max(20, resizeStart.width - diff);
        newX = Math.min(resizeStart.x + resizeStart.width - 20, mouseX);
      }
      if (isResizing.includes('n')) {
        const diff = mouseY - element.y;
        newHeight = Math.max(20, resizeStart.height - diff);
        newY = Math.min(resizeStart.y + resizeStart.height - 20, mouseY);
      }
      
      updateElement(selectedId, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(null);
  };

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    
    const element = elements.find(el => el.id === selectedId);
    if (!element) return;
    
    setIsResizing(direction);
    setResizeStart({
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    });
  };

  const alignLeft = () => {
    if (!selectedId) return;
    updateElement(selectedId, { x: 50 });
  };

  const alignCenter = () => {
    if (!selectedId) return;
    const el = elements.find(e => e.id === selectedId);
    if (el) {
      updateElement(selectedId, { x: (selectedFormat.width - el.width) / 2 });
    }
  };

  const alignRight = () => {
    if (!selectedId) return;
    const el = elements.find(e => e.id === selectedId);
    if (el) {
      updateElement(selectedId, { x: selectedFormat.width - el.width - 50 });
    }
  };

  const bringToFront = () => {
    if (!selectedId) return;
    const maxZ = Math.max(...elements.map(el => el.zIndex), 0);
    updateElement(selectedId, { zIndex: maxZ + 1 });
  };

  const sendToBack = () => {
    if (!selectedId) return;
    const minZ = Math.min(...elements.map(el => el.zIndex), 0);
    updateElement(selectedId, { zIndex: minZ - 1 });
  };

  const observeDesignDecision = (category: string, observation: string) => {
    setAiObservations(prev => [...prev, `${category}: ${observation}`].slice(-5));
  };

  const handleSaveAndLearn = async () => {
    if (elements.length === 0) {
      toast.error('Add some elements before saving');
      return;
    }

    setIsLearning(true);
    
    try {
      const design = {
        id: `design-${Date.now()}`,
        name: designName,
        format: selectedFormat.id,
        dimensions: { width: selectedFormat.width, height: selectedFormat.height },
        backgroundColor,
        elements,
        createdAt: new Date()
      };

      const analysisResult = await analyzeDesignForLearning(design);
      
      const designCount = parseInt(localStorage.getItem('designStudio_count') || '0');
      const newCount = designCount + 1;
      localStorage.setItem('designStudio_count', newCount.toString());
      
      await updateStyleDNAFromDesign(analysisResult);
      
      setIsLearning(false);
      
      toast.success('🎨 Design saved & AI learned from your work!', {
        description: analysisResult.summary
      });
      
      setElements([]);
      setBackgroundColor('#FFFFFF');
      setDesignName('Untitled Design');
      setAiObservations([]);
      setSelectedId(null);
      
    } catch (error) {
      console.error('Save error:', error);
      setIsLearning(false);
      toast.error('Failed to save design');
    }
  };

  const analyzeDesignForLearning = async (design: any) => {
    const colorUsage = new Map<string, number>();
    const fontUsage = new Map<string, number>();
    let totalSpacing = 0;
    let spacingCount = 0;
    
    design.elements.forEach((element: CanvasElement, index: number) => {
      if (element.color) {
        colorUsage.set(element.color, (colorUsage.get(element.color) || 0) + 1);
      }
      if (element.backgroundColor) {
        colorUsage.set(element.backgroundColor, (colorUsage.get(element.backgroundColor) || 0) + 1);
      }
      
      if (element.fontFamily) {
        fontUsage.set(element.fontFamily, (fontUsage.get(element.fontFamily) || 0) + 1);
      }
      
      if (index > 0) {
        const prevElement = design.elements[index - 1];
        const spacing = Math.abs(element.y - (prevElement.y + prevElement.height));
        if (spacing < 200) {
          totalSpacing += spacing;
          spacingCount++;
        }
      }
    });

    const avgSpacing = spacingCount > 0 ? Math.round(totalSpacing / spacingCount) : 0;
    
    const textElements = design.elements.filter((el: CanvasElement) => el.type === 'text');
    const hasLeftAlign = textElements.some((el: CanvasElement) => el.textAlign === 'left');
    const hasCenterAlign = textElements.some((el: CanvasElement) => el.textAlign === 'center');
    
    const layoutStyle = hasCenterAlign ? 'centered' : hasLeftAlign ? 'left-aligned' : 'balanced';
    
    const topColors = Array.from(colorUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);
    
    const topFonts = Array.from(fontUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([font]) => font);

    return {
      colorPalette: topColors,
      primaryFont: topFonts[0] || 'Inter',
      layoutStyle,
      averageSpacing: avgSpacing,
      elementCount: design.elements.length,
      composition: design.elements.some((el: CanvasElement) => el.type === 'shape') ? 'graphical' : 'text-focused',
      summary: `Learned: ${topColors.length} colors, ${topFonts[0]} typography, ${layoutStyle} layout`
    };
  };

  const updateStyleDNAFromDesign = async (analysis: any) => {
    const currentProfile = styleDNA.getProfile();
    
    const updatedColors = {
      primary: [...new Set([...analysis.colorPalette, ...(currentProfile.colors?.primary || [])])].slice(0, 5),
      secondary: currentProfile.colors?.secondary || [],
      accent: currentProfile.colors?.accent || []
    };
    
    const updatedTypography = {
      headingFont: analysis.primaryFont || currentProfile.typography?.headingFont || 'Inter',
      bodyFont: currentProfile.typography?.bodyFont || 'Inter',
      preferredSizes: currentProfile.typography?.preferredSizes || ['32px', '24px', '16px']
    };
    
    const currentCount = parseInt(localStorage.getItem('designStudio_count') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('designStudio_count', newCount.toString());
    
    const newConfidence = Math.min(100, 40 + (newCount * 5));
    
    styleDNA.updateProfile({
      colors: updatedColors,
      typography: updatedTypography
    });
  };

  const selectedEl = selectedId ? elements.find(el => el.id === selectedId) : null;

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex h-full bg-[#FAFBFC]">
      {/* Left Toolbar */}
      <div className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={addTextElement}
          className="w-12 h-12 rounded-lg hover:bg-gray-100"
          title="Text (T)"
        >
          <Type className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addShapeElement('rectangle')}
          className="w-12 h-12 rounded-lg hover:bg-gray-100"
          title="Rectangle (R)"
        >
          <Square className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addShapeElement('circle')}
          className="w-12 h-12 rounded-lg hover:bg-gray-100"
          title="Circle (O)"
        >
          <Circle className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={addLineElement}
          className="w-12 h-12 rounded-lg hover:bg-gray-100"
          title="Line (L)"
        >
          <Minus className="w-5 h-5" />
        </Button>

        <Separator className="w-10 my-2" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowGrid(!showGrid)}
          className={`w-12 h-12 rounded-lg hover:bg-gray-100 ${showGrid ? 'bg-gray-100' : ''}`}
          title="Grid"
        >
          <Grid3x3 className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Input
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="w-48 h-8 border-gray-200 rounded-lg text-sm"
              placeholder="Design name..."
            />
            
            <Select value={selectedFormat.id} onValueChange={(value) => {
              const format = FORMATS.find(f => f.id === value);
              if (format) setSelectedFormat(format);
            }}>
              <SelectTrigger className="w-44 h-8 border-gray-200 rounded-lg text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMATS.map(format => (
                  <SelectItem key={format.id} value={format.id}>
                    {format.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Center Tools */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="h-8 w-8"
              title="Undo (⌘Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="h-8 w-8"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
              className="h-8 w-8"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-xs text-[#6B7280] w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              className="h-8 w-8"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: aiObservations.length > 0 ? 1 : 0.3 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#001B42]/10 to-[#CDFF2A]/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#001B42]" />
              <span className="text-xs text-[#1F2937]">AI Observing</span>
            </motion.div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-lg border-gray-200 text-xs"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview
            </Button>
            
            <Button
              onClick={handleSaveAndLearn}
              disabled={isLearning || elements.length === 0}
              size="sm"
              className="h-8 bg-gradient-to-r from-[#001B42] to-[#00328F] text-white rounded-lg text-xs"
            >
              {isLearning ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                  Learning...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Publish & Train AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Alignment Toolbar */}
        {selectedId && (
          <div className="h-12 bg-white border-b border-gray-100 flex items-center justify-center gap-2 px-4">
            <span className="text-xs text-[#6B7280] mr-2">1 selected</span>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="ghost" size="icon" onClick={alignLeft} className="h-8 w-8" title="Align Left">
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={alignCenter} className="h-8 w-8" title="Align Center">
              <AlignHorizontalJustifyCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={alignRight} className="h-8 w-8" title="Align Right">
              <AlignRight className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <Button variant="ghost" size="icon" onClick={bringToFront} className="h-8 w-8" title="Bring to Front">
              <ChevronDown className="w-4 h-4 rotate-180" />
            </Button>
            <Button variant="ghost" size="icon" onClick={sendToBack} className="h-8 w-8" title="Send to Back">
              <ChevronDown className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            <Button variant="ghost" size="icon" onClick={duplicate} className="h-8 w-8" title="Duplicate (⌘D)">
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={deleteSelected} className="h-8 w-8 text-red-500 hover:text-red-600" title="Delete">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Canvas */}
        <div 
          className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[#E5E7EB]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div className="relative">
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="relative shadow-2xl bg-white rounded-lg overflow-hidden cursor-default"
              style={{
                width: selectedFormat.width * zoom,
                height: selectedFormat.height * zoom,
                backgroundColor,
                backgroundImage: showGrid ? 
                  'linear-gradient(#E5E7EB 1px, transparent 1px), linear-gradient(90deg, #E5E7EB 1px, transparent 1px)' : 
                  'none',
                backgroundSize: showGrid ? `${20 * zoom}px ${20 * zoom}px` : 'auto'
              }}
            >
              {elements
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  if (!element.visible) return null;
                  
                  const isSelected = selectedId === element.id;
                  
                  return (
                    <div
                      key={element.id}
                      onMouseDown={(e) => handleMouseDown(e, element.id)}
                      className={`absolute select-none ${element.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
                      style={{
                        left: element.x * zoom,
                        top: element.y * zoom,
                        width: element.width * zoom,
                        height: element.height * zoom,
                        transform: `rotate(${element.rotation}deg)`,
                        opacity: element.opacity,
                        zIndex: element.zIndex,
                        pointerEvents: element.locked ? 'none' : 'auto'
                      }}
                    >
                      {element.type === 'text' && (
                        <div
                          contentEditable={!element.locked && isSelected}
                          suppressContentEditableWarning
                          onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full h-full outline-none px-2 flex items-center"
                          style={{
                            color: element.color,
                            fontSize: (element.fontSize || 32) * zoom,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            textAlign: element.textAlign,
                            lineHeight: 1.2,
                            cursor: isSelected ? 'text' : 'move'
                          }}
                        >
                          {element.content}
                        </div>
                      )}
                      
                      {element.type === 'shape' && element.shapeType !== 'line' && (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: element.backgroundColor,
                            borderRadius: element.borderRadius ? element.borderRadius * zoom : 0,
                            border: element.borderWidth ? `${element.borderWidth * zoom}px solid ${element.borderColor}` : 'none'
                          }}
                        />
                      )}
                      
                      {element.type === 'line' && (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: element.backgroundColor
                          }}
                        />
                      )}
                      
                      {/* Selection and resize handles */}
                      {isSelected && !element.locked && (
                        <>
                          {/* Selection border */}
                          <div className="absolute inset-0 border-2 border-[#2563EB] pointer-events-none" 
                            style={{ borderRadius: element.type === 'shape' && element.shapeType === 'circle' ? '50%' : 0 }}
                          />
                          
                          {/* Resize handles */}
                          <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-nw-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'nw')} />
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-n-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'n')} />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-ne-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'ne')} />
                          
                          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-w-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'w')} />
                          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-e-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'e')} />
                          
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-sw-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'sw')} />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-s-resize"
                            onMouseDown={(e) => handleResizeStart(e, 's')} />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-sm cursor-se-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'se')} />
                        </>
                      )}
                      
                      {element.locked && isSelected && (
                        <div className="absolute -top-6 left-0 bg-red-500 text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="absolute -bottom-8 left-0 right-0 text-center">
              <Badge variant="outline" className="bg-white">
                {selectedFormat.name} • {selectedFormat.width}x{selectedFormat.height}px • {Math.round(zoom * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-100 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-gray-100 flex items-center justify-between px-4">
          <h3 className="text-sm font-semibold text-[#1F2937]">Properties</h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {!selectedEl && (
              <div>
                <h4 className="text-xs font-medium text-[#1F2937] mb-3">Canvas</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#6B7280] mb-2 block">Background</label>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setBackgroundColor(color);
                            observeDesignDecision('color', `Set background to ${color}`);
                          }}
                          className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                            backgroundColor === color ? 'border-[#2563EB] scale-110' : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedEl && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-medium text-[#1F2937]">{selectedEl.name}</h4>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => updateElement(selectedEl.id, { locked: !selectedEl.locked })}
                      className="h-6 w-6"
                    >
                      {selectedEl.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={deleteSelected}
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#6B7280] mb-2 block">Position & Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-[#9CA3AF] mb-1 block">X</label>
                        <Input
                          type="number"
                          value={Math.round(selectedEl.x)}
                          onChange={(e) => updateElement(selectedEl.id, { x: parseInt(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#9CA3AF] mb-1 block">Y</label>
                        <Input
                          type="number"
                          value={Math.round(selectedEl.y)}
                          onChange={(e) => updateElement(selectedEl.id, { y: parseInt(e.target.value) || 0 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#9CA3AF] mb-1 block">W</label>
                        <Input
                          type="number"
                          value={Math.round(selectedEl.width)}
                          onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) || 1 })}
                          className="h-8 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#9CA3AF] mb-1 block">H</label>
                        <Input
                          type="number"
                          value={Math.round(selectedEl.height)}
                          onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) || 1 })}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#6B7280] mb-2 block">
                      Opacity: {Math.round(selectedEl.opacity * 100)}%
                    </label>
                    <Slider
                      value={[selectedEl.opacity * 100]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { opacity: value / 100 })}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  {selectedEl.type === 'text' && (
                    <>
                      <Separator />
                      
                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">Font Family</label>
                        <Select 
                          value={selectedEl.fontFamily} 
                          onValueChange={(value) => updateElement(selectedEl.id, { fontFamily: value })}
                        >
                          <SelectTrigger className="h-8 border-gray-200 rounded-lg text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map(font => (
                              <SelectItem key={font} value={font} style={{ fontFamily: font }} className="text-xs">
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">
                          Font Size: {selectedEl.fontSize}px
                        </label>
                        <Slider
                          value={[selectedEl.fontSize || 32]}
                          onValueChange={([value]) => updateElement(selectedEl.id, { fontSize: value })}
                          min={8}
                          max={120}
                          step={2}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">Font Weight</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[400, 600, 700].map(weight => (
                            <Button
                              key={weight}
                              size="sm"
                              variant={selectedEl.fontWeight === weight ? 'default' : 'outline'}
                              onClick={() => updateElement(selectedEl.id, { fontWeight: weight })}
                              className="h-8 text-xs"
                            >
                              {weight === 400 ? 'Regular' : weight === 600 ? 'Semi' : 'Bold'}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">Text Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateElement(selectedEl.id, { color })}
                              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                                selectedEl.color === color ? 'border-[#2563EB] scale-110' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">Alignment</label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={selectedEl.textAlign === 'left' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedEl.id, { textAlign: 'left' })}
                            className="flex-1 h-8 rounded-lg"
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedEl.textAlign === 'center' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedEl.id, { textAlign: 'center' })}
                            className="flex-1 h-8 rounded-lg"
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={selectedEl.textAlign === 'right' ? 'default' : 'outline'}
                            onClick={() => updateElement(selectedEl.id, { textAlign: 'right' })}
                            className="flex-1 h-8 rounded-lg"
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {(selectedEl.type === 'shape' || selectedEl.type === 'line') && (
                    <>
                      <Separator />
                      
                      <div>
                        <label className="text-xs text-[#6B7280] mb-2 block">Fill Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {PRESET_COLORS.map(color => (
                            <button
                              key={color}
                              onClick={() => updateElement(selectedEl.id, { backgroundColor: color })}
                              className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                                selectedEl.backgroundColor === color ? 'border-[#2563EB] scale-110' : 'border-gray-200'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {selectedEl.type === 'shape' && selectedEl.shapeType === 'rectangle' && (
                        <div>
                          <label className="text-xs text-[#6B7280] mb-2 block">
                            Border Radius: {selectedEl.borderRadius}px
                          </label>
                          <Slider
                            value={[selectedEl.borderRadius || 0]}
                            onValueChange={([value]) => updateElement(selectedEl.id, { borderRadius: value })}
                            min={0}
                            max={100}
                            step={1}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#001B42]" />
                <h4 className="text-xs font-medium text-[#1F2937]">AI Learning</h4>
              </div>
              <div className="space-y-2">
                {aiObservations.length > 0 ? (
                  aiObservations.map((obs, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-[#6B7280] bg-gradient-to-r from-[#001B42]/5 to-transparent p-2 rounded"
                    >
                      {obs}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-[#9CA3AF] italic">
                    AI will observe your design decisions...
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Layers Panel */}
        <div className="border-t border-gray-100">
          <button
            onClick={() => setShowLayers(!showLayers)}
            className="w-full h-10 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6B7280]" />
              <span className="text-xs font-medium text-[#1F2937]">Layers</span>
              <Badge variant="outline" className="text-xs">{elements.length}</Badge>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform ${showLayers ? 'rotate-180' : ''}`} />
          </button>
          
          {showLayers && (
            <ScrollArea className="max-h-48 border-t border-gray-100">
              <div className="p-2 space-y-1">
                {elements
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((element) => (
                    <button
                      key={element.id}
                      onClick={() => setSelectedId(element.id)}
                      className={`w-full p-2 rounded-lg flex items-center justify-between text-left transition-colors ${
                        selectedId === element.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {element.type === 'text' && <Type className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />}
                        {element.type === 'shape' && element.shapeType === 'rectangle' && <Square className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />}
                        {element.type === 'shape' && element.shapeType === 'circle' && <Circle className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />}
                        {element.type === 'line' && <Minus className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />}
                        
                        <span className="text-xs text-[#1F2937] truncate">{element.name}</span>
                      </div>
                      
                      {element.locked && <Lock className="w-3 h-3 text-[#6B7280]" />}
                    </button>
                  ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}