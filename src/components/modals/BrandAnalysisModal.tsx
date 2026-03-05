import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { FileUpload } from '../ui/file-upload';
import { 
  Upload, 
  Palette, 
  Type, 
  Layout, 
  Image as ImageIcon, 
  Sparkles, 
  Check,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { BrandAnalysisService, AnalysisResult } from '../../services/brand-analysis-service';
import { styleDNA } from '../../services/style-dna-service';

interface BrandAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  preloadedFiles?: File[]; // Optional: files already uploaded in Brand Assets tab
}

type AnalysisStep = 'upload' | 'analyzing' | 'results' | 'applying';

export function BrandAnalysisModal({ isOpen, onClose, onComplete, preloadedFiles }: BrandAnalysisModalProps) {
  const [step, setStep] = useState<AnalysisStep>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added`, {
      description: 'Ready to analyze your brand assets'
    });
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please upload at least one brand asset');
      return;
    }

    setStep('analyzing');
    setAnalysisProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 400);

    try {
      const result = await BrandAnalysisService.analyzeAssets(uploadedFiles);
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setAnalysisResult(result);
        setStep('results');
      }, 500);

      toast.success('Analysis complete!', {
        description: `Extracted style elements from ${result.filesAnalyzed} image(s)`
      });
    } catch (error) {
      clearInterval(progressInterval);
      toast.error('Analysis failed', {
        description: error instanceof Error ? error.message : 'Please try again with different assets'
      });
      setStep('upload');
    }
  }, [uploadedFiles]);

  // Auto-start analysis if files are preloaded from Brand Assets tab
  useEffect(() => {
    if (preloadedFiles && preloadedFiles.length > 0 && isOpen) {
      setUploadedFiles(preloadedFiles);
      // Auto-start analysis after a short delay
      setTimeout(() => {
        handleAnalyze();
      }, 500);
    }
  }, [isOpen, preloadedFiles, handleAnalyze]);

  const handleApplyToStyleDNA = async () => {
    if (!analysisResult) return;

    setStep('applying');

    // Convert analysis to Style DNA format
    const updates = BrandAnalysisService.convertToStyleDNA(analysisResult);
    
    // Update Style DNA
    styleDNA.updateProfile(updates);

    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Style DNA Updated!', {
      description: 'Your brand elements have been learned and applied'
    });

    onComplete();
    handleClose();
  };

  const handleClose = () => {
    setStep('upload');
    setUploadedFiles([]);
    setAnalysisResult(null);
    setAnalysisProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#001B42] to-[#00328F]" />
            AI Brand Analysis
          </DialogTitle>
          <DialogDescription>
            Upload your brand assets to extract colors, visual tone, and style characteristics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'analyzing', label: 'Analyze', icon: Sparkles },
              { id: 'results', label: 'Review', icon: TrendingUp },
              { id: 'applying', label: 'Apply', icon: Check },
            ].map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isPast = ['upload', 'analyzing', 'results', 'applying'].indexOf(step) > 
                             ['upload', 'analyzing', 'results', 'applying'].indexOf(s.id);
              
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-[#353CED] text-white scale-110' 
                        : isPast
                        ? 'bg-[#10B981] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs mt-2 transition-all ${
                      isActive ? 'text-[#353CED]' : isPast ? 'text-[#10B981]' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </p>
                  </div>
                  {idx < 3 && (
                    <div className={`h-0.5 flex-1 transition-all ${
                      isPast ? 'bg-[#10B981]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-6 bg-gradient-to-br from-[#353CED]/5 to-[#CDFF2A]/5 border-[#353CED]/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#353CED]/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-[#353CED]" />
                  </div>
                  <div>
                    <h3 className="text-[#1F2937] mb-2">What gets analyzed from images?</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                        <p className="text-sm text-[#6B7280]">
                          <strong>Colors:</strong> Actual dominant colors extracted from your images
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                        <p className="text-sm text-[#6B7280]">
                          <strong>Visual Tone:</strong> Brand personality inferred from visual characteristics
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5" />
                        <p className="text-sm text-[#6B7280]">
                          <strong>Image Style:</strong> Brightness, saturation, and overall mood analysis
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-[#9CA3AF] mt-0.5" />
                        <p className="text-sm text-[#9CA3AF]">
                          <strong>Fonts:</strong> Cannot be reliably detected without advanced OCR
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <FileUpload
                onFileSelect={handleFileSelect}
                accept="image/*"
                multiple={true}
                maxSize={10}
                label="Upload Brand Assets"
                description="Logos, marketing materials, social posts, website screenshots (JPG, PNG - max 10MB each)"
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-[#1F2937]">
                    Uploaded Files ({uploadedFiles.length})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#353CED]/10 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-5 h-5 text-[#353CED]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#1F2937] truncate">{file.name}</p>
                          <p className="text-xs text-[#6B7280]">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAnalyze}
                  disabled={uploadedFiles.length === 0}
                  className="flex-1 bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze {uploadedFiles.length} Asset{uploadedFiles.length !== 1 ? 's' : ''}
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-gray-200 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Analyzing Step */}
          {step === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 py-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#001B42] via-[#353CED] to-[#CDFF2A] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-[#1F2937] mb-2">Analyzing Your Brand...</h3>
                <p className="text-[#6B7280] mb-6">
                  Extracting colors and analyzing visual characteristics
                </p>
                <div className="max-w-md mx-auto space-y-2">
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-[#353CED]">{Math.round(analysisProgress)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: Palette, label: 'Extracting Colors', delay: 0 },
                  { icon: ImageIcon, label: 'Analyzing Image Style', delay: 0.2 },
                  { icon: Sparkles, label: 'Inferring Tone', delay: 0.4 },
                  { icon: TrendingUp, label: 'Processing Results', delay: 0.6 },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = analysisProgress > (idx * 25);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: isActive ? 1 : 0.3, scale: 1 }}
                      transition={{ delay: item.delay }}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive 
                          ? 'bg-[#353CED]/10 border-[#353CED]/30' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-[#353CED]' : 'text-gray-400'}`} />
                      <p className="text-sm text-[#1F2937]">{item.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {step === 'results' && analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="p-4 bg-gradient-to-br from-[#10B981]/10 to-[#CDFF2A]/10 border-[#10B981]/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-[#1F2937]">Analysis Complete!</h3>
                    <p className="text-sm text-[#6B7280]">
                      Analyzed {analysisResult.filesAnalyzed} image(s) • {analysisResult.overallConfidence}% overall confidence
                    </p>
                  </div>
                </div>
              </Card>

              {/* Alert for non-detected elements */}
              {!analysisResult.typography.detected && (
                <Card className="p-4 bg-[#F59E0B]/5 border-[#F59E0B]/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1F2937]">
                        <strong>Limited Detection:</strong> Fonts cannot be reliably detected from images. 
                        Only visual characteristics (colors, tone, mood) were analyzed.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Colors - Only show if detected */}
                {analysisResult.colors.detected && (
                  <Card className="p-4 border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-5 h-5 text-[#353CED]" />
                      <h4 className="text-[#1F2937]">Color Palette</h4>
                      <Badge className="ml-auto bg-[#353CED]/20 text-[#353CED]">
                        {analysisResult.colors.confidence}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {analysisResult.colors.primary.length > 0 && (
                        <>
                          <p className="text-xs text-[#6B7280] mb-1">Primary Colors</p>
                          <div className="flex gap-2">
                            {analysisResult.colors.primary.map((color, idx) => (
                              <div key={idx} className="flex-1 space-y-1">
                                <div
                                  className="h-12 rounded-lg border border-gray-200"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs text-[#6B7280] text-center truncate">{color}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      {analysisResult.colors.secondary.length > 0 && (
                        <>
                          <p className="text-xs text-[#6B7280] mb-1 mt-3">Secondary Colors</p>
                          <div className="flex gap-2">
                            {analysisResult.colors.secondary.slice(0, 3).map((color, idx) => (
                              <div key={idx} className="flex-1 space-y-1">
                                <div
                                  className="h-8 rounded-lg border border-gray-200"
                                  style={{ backgroundColor: color }}
                                />
                                <p className="text-xs text-[#6B7280] text-center truncate">{color}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                )}

                {/* Image Style - Only show if detected */}
                {analysisResult.imageStyle.detected && (
                  <Card className="p-4 border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <ImageIcon className="w-5 h-5 text-[#353CED]" />
                      <h4 className="text-[#1F2937]">Image Style</h4>
                      <Badge className="ml-auto bg-[#353CED]/20 text-[#353CED]">
                        {analysisResult.imageStyle.confidence}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-[#6B7280]">Treatment</p>
                        <p className="text-sm text-[#1F2937]">{analysisResult.imageStyle.treatment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#6B7280]">Mood</p>
                        <p className="text-sm text-[#1F2937]">{analysisResult.imageStyle.mood}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Tone */}
                <Card className="p-4 border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-[#353CED]" />
                    <h4 className="text-[#1F2937]">Brand Tone</h4>
                    <Badge className="ml-auto bg-[#353CED]/20 text-[#353CED]">
                      {analysisResult.tone.confidence}%
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-[#1F2937]">{analysisResult.tone.detected}</p>
                    <p className="text-xs text-[#6B7280] italic">Inferred from visual characteristics</p>
                    <div className="space-y-2">
                      {Object.entries(analysisResult.tone.attributes)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-[#6B7280] capitalize">{key}</span>
                              <span className="text-[#353CED]">{value}%</span>
                            </div>
                            <Progress value={value} className="h-1" />
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>

                {/* Typography - Show with warning if not detected */}
                <Card className="p-4 border-gray-100 opacity-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-5 h-5 text-gray-400" />
                    <h4 className="text-[#1F2937]">Typography</h4>
                    <Badge className="ml-auto bg-gray-100 text-gray-500">
                      Not Detected
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                      <p className="text-xs text-[#6B7280]">
                        Font detection requires advanced OCR and is not currently supported
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  onClick={handleApplyToStyleDNA}
                  className="flex-1 bg-[#CDFF2A] text-[#1F2937] hover:bg-[#B8E028] rounded-xl"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply to Style DNA
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-gray-200 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Applying Step */}
          {step === 'applying' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#CDFF2A] flex items-center justify-center animate-pulse">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-[#1F2937] mb-2">Updating Style DNA...</h3>
              <p className="text-[#6B7280]">
                Your brand elements are being learned and applied
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
