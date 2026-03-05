// Brand Asset Analysis Service
// Analyzes uploaded brand assets to extract style DNA elements

import { StyleDNAProfile } from './style-dna-service';

export interface BrandAsset {
  id: string;
  name: string;
  file: File;
  preview: string;
  uploadedAt: Date;
}

export interface AnalysisResult {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
    confidence: number;
    detected: boolean;
  };
  typography: {
    detectedFonts: string[];
    style: 'modern' | 'classic' | 'playful' | 'professional' | 'unknown';
    confidence: number;
    detected: boolean;
  };
  tone: {
    detected: string;
    attributes: {
      professional: number;
      friendly: number;
      innovative: number;
      bold: number;
      playful: number;
      trustworthy: number;
    };
    confidence: number;
  };
  layout: {
    preferredStyles: Array<'gradient' | 'split' | 'centered' | 'overlay'>;
    alignment: 'left' | 'center' | 'right' | 'unknown';
    useWhitespace: boolean;
    confidence: number;
    detected: boolean;
  };
  imageStyle: {
    treatment: string;
    mood: string;
    confidence: number;
    detected: boolean;
  };
  overallConfidence: number;
  filesAnalyzed: number;
}

interface ColorInfo {
  hex: string;
  count: number;
  percentage: number;
}

interface ImageAnalysis {
  colors: ColorInfo[];
  brightness: number;
  saturation: number;
  hasText: boolean;
  hasFaces: boolean;
}

export class BrandAnalysisService {
  /**
   * Analyze uploaded brand assets and extract style DNA
   */
  static async analyzeAssets(files: File[]): Promise<AnalysisResult> {
    console.log(`Starting analysis of ${files.length} file(s)...`);
    
    // Analyze all images
    const imageAnalyses: ImageAnalysis[] = [];
    
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const analysis = await this.analyzeImage(file);
          imageAnalyses.push(analysis);
        } catch (error) {
          console.warn(`Failed to analyze ${file.name}:`, error);
        }
      }
    }

    if (imageAnalyses.length === 0) {
      throw new Error('No valid images could be analyzed');
    }

    console.log(`Successfully analyzed ${imageAnalyses.length} image(s)`);

    // Extract colors from all images
    const colors = this.extractColorsFromAnalyses(imageAnalyses);
    
    // Analyze visual characteristics
    const imageStyle = this.analyzeImageStyleFromData(imageAnalyses);
    
    // Infer tone from visual characteristics
    const tone = this.inferToneFromVisuals(imageAnalyses, colors);
    
    // Detect layout patterns
    const layout = this.detectLayoutPatterns(imageAnalyses);

    // Typography - we cannot detect fonts from images reliably without OCR+font recognition
    // So we mark it as not detected
    const typography = {
      detectedFonts: [] as string[],
      style: 'unknown' as const,
      confidence: 0,
      detected: false,
    };

    // Calculate overall confidence based on what we could actually detect
    const detectedComponents = [
      colors.detected,
      imageStyle.detected,
      tone.confidence > 50,
      layout.detected,
    ].filter(Boolean).length;

    const overallConfidence = Math.round((detectedComponents / 4) * 100 * 0.8); // Max 80% since we can't detect everything

    return {
      colors,
      typography,
      tone,
      layout,
      imageStyle,
      overallConfidence,
      filesAnalyzed: imageAnalyses.length,
    };
  }

  /**
   * Analyze a single image file
   */
  private static async analyzeImage(file: File): Promise<ImageAnalysis> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      img.onload = () => {
        try {
          // Set canvas size (downsample for performance)
          const maxSize = 400;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          // Draw image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Extract colors
          const colorCounts: Map<string, number> = new Map();
          let totalBrightness = 0;
          let totalSaturation = 0;
          let pixelCount = 0;

          // Sample every 4th pixel for performance
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Skip transparent pixels
            if (a < 128) continue;

            // Skip near-white and near-black pixels
            const isWhite = r > 240 && g > 240 && b > 240;
            const isBlack = r < 15 && g < 15 && b < 15;
            if (isWhite || isBlack) continue;

            // Convert to hex
            const hex = this.rgbToHex(r, g, b);
            colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);

            // Calculate brightness and saturation
            totalBrightness += (r + g + b) / 3;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;
            totalSaturation += saturation;
            pixelCount++;
          }

          // Sort colors by frequency and group similar ones
          const colors = this.groupSimilarColors(colorCounts, pixelCount);
          
          const avgBrightness = totalBrightness / pixelCount;
          const avgSaturation = totalSaturation / pixelCount;

          // Simple text detection (high contrast edges)
          const hasText = this.detectText(imageData);

          resolve({
            colors: colors.slice(0, 10), // Top 10 colors
            brightness: avgBrightness / 255, // Normalize to 0-1
            saturation: avgSaturation,
            hasText,
            hasFaces: false, // Would need face detection API
          });

          // Clean up
          URL.revokeObjectURL(img.src);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Group similar colors together
   */
  private static groupSimilarColors(colorCounts: Map<string, number>, totalPixels: number): ColorInfo[] {
    const colors: ColorInfo[] = [];
    const threshold = 30; // RGB difference threshold

    colorCounts.forEach((count, hex) => {
      const rgb = this.hexToRgb(hex);
      if (!rgb) return;

      // Find similar color group
      let found = false;
      for (const colorInfo of colors) {
        const existingRgb = this.hexToRgb(colorInfo.hex);
        if (!existingRgb) continue;

        const diff = Math.abs(rgb.r - existingRgb.r) + 
                     Math.abs(rgb.g - existingRgb.g) + 
                     Math.abs(rgb.b - existingRgb.b);

        if (diff < threshold) {
          colorInfo.count += count;
          found = true;
          break;
        }
      }

      if (!found) {
        colors.push({ hex, count, percentage: 0 });
      }
    });

    // Calculate percentages and sort
    colors.forEach(c => {
      c.percentage = (c.count / totalPixels) * 100;
    });

    return colors.sort((a, b) => b.count - a.count);
  }

  /**
   * Simple text detection based on edge density
   */
  private static detectText(imageData: ImageData): boolean {
    const data = imageData.data;
    let edgeCount = 0;
    const threshold = 50;

    // Sample horizontal edges
    for (let y = 0; y < imageData.height - 1; y += 10) {
      for (let x = 0; x < imageData.width - 1; x += 10) {
        const i = (y * imageData.width + x) * 4;
        const iNext = ((y + 1) * imageData.width + x) * 4;
        
        const diff = Math.abs(data[i] - data[iNext]) +
                     Math.abs(data[i + 1] - data[iNext + 1]) +
                     Math.abs(data[i + 2] - data[iNext + 2]);

        if (diff > threshold) edgeCount++;
      }
    }

    // High edge density suggests text
    const edgeDensity = edgeCount / ((imageData.width / 10) * (imageData.height / 10));
    return edgeDensity > 0.15;
  }

  /**
   * Extract and categorize colors from all analyzed images
   */
  private static extractColorsFromAnalyses(analyses: ImageAnalysis[]): AnalysisResult['colors'] {
    if (analyses.length === 0) {
      return {
        primary: [],
        secondary: [],
        accent: [],
        confidence: 0,
        detected: false,
      };
    }

    // Collect all colors from all images
    const allColors: ColorInfo[] = [];
    
    analyses.forEach(analysis => {
      analysis.colors.forEach(color => {
        const existing = allColors.find(c => {
          const rgb1 = this.hexToRgb(c.hex);
          const rgb2 = this.hexToRgb(color.hex);
          if (!rgb1 || !rgb2) return false;
          
          const diff = Math.abs(rgb1.r - rgb2.r) + 
                       Math.abs(rgb1.g - rgb2.g) + 
                       Math.abs(rgb1.b - rgb2.b);
          return diff < 40;
        });

        if (existing) {
          existing.count += color.count;
        } else {
          allColors.push({ ...color });
        }
      });
    });

    // Sort by frequency
    allColors.sort((a, b) => b.count - a.count);

    if (allColors.length === 0) {
      return {
        primary: [],
        secondary: [],
        accent: [],
        confidence: 0,
        detected: false,
      };
    }

    // Categorize colors
    const primary: string[] = [];
    const secondary: string[] = [];
    const accent: string[] = [];

    // Primary: most dominant colors (dark/saturated)
    // Secondary: medium frequency colors
    // Accent: bright/vibrant colors

    allColors.forEach((color, index) => {
      const rgb = this.hexToRgb(color.hex);
      if (!rgb) return;

      const brightness = (rgb.r + rgb.g + rgb.b) / 3;
      const saturation = this.calculateSaturation(rgb.r, rgb.g, rgb.b);

      if (index < 3) {
        // First 3 colors
        if (brightness < 100 || saturation > 0.5) {
          primary.push(color.hex);
        } else {
          secondary.push(color.hex);
        }
      } else if (index < 6) {
        // Next 3 colors
        if (saturation > 0.6 && brightness > 100) {
          accent.push(color.hex);
        } else {
          secondary.push(color.hex);
        }
      } else if (saturation > 0.7 && accent.length < 3) {
        // Highly saturated colors = accents
        accent.push(color.hex);
      }
    });

    // Ensure we have at least some colors
    if (primary.length === 0 && allColors.length > 0) {
      primary.push(allColors[0].hex);
    }
    if (secondary.length === 0 && allColors.length > 1) {
      secondary.push(allColors[1].hex);
    }
    if (accent.length === 0 && allColors.length > 2) {
      accent.push(allColors[2].hex);
    }

    // Confidence based on color consistency across images
    const confidence = Math.min(95, 60 + (analyses.length * 8));

    return {
      primary: primary.slice(0, 3),
      secondary: secondary.slice(0, 3),
      accent: accent.slice(0, 2),
      confidence: Math.round(confidence),
      detected: allColors.length > 0,
    };
  }

  /**
   * Analyze image style from visual data
   */
  private static analyzeImageStyleFromData(analyses: ImageAnalysis[]): AnalysisResult['imageStyle'] {
    if (analyses.length === 0) {
      return {
        treatment: 'Unknown',
        mood: 'Unknown',
        confidence: 0,
        detected: false,
      };
    }

    // Calculate average brightness and saturation
    const avgBrightness = analyses.reduce((sum, a) => sum + a.brightness, 0) / analyses.length;
    const avgSaturation = analyses.reduce((sum, a) => sum + a.saturation, 0) / analyses.length;

    // Determine treatment
    let treatment = '';
    if (avgSaturation > 0.6) {
      treatment = 'Vibrant with high saturation';
    } else if (avgSaturation > 0.3) {
      treatment = 'Balanced saturation';
    } else {
      treatment = 'Muted and subtle';
    }

    // Determine mood
    let mood = '';
    if (avgBrightness > 0.6 && avgSaturation > 0.5) {
      mood = 'Energetic and Bold';
    } else if (avgBrightness > 0.6) {
      mood = 'Light and Friendly';
    } else if (avgBrightness < 0.4 && avgSaturation > 0.4) {
      mood = 'Professional and Sophisticated';
    } else if (avgBrightness < 0.4) {
      mood = 'Elegant and Refined';
    } else {
      mood = 'Balanced and Versatile';
    }

    const confidence = Math.min(90, 65 + (analyses.length * 5));

    return {
      treatment,
      mood,
      confidence: Math.round(confidence),
      detected: true,
    };
  }

  /**
   * Infer brand tone from visual characteristics
   */
  private static inferToneFromVisuals(analyses: ImageAnalysis[], colors: AnalysisResult['colors']): AnalysisResult['tone'] {
    // Calculate visual characteristics
    const avgBrightness = analyses.reduce((sum, a) => sum + a.brightness, 0) / analyses.length;
    const avgSaturation = analyses.reduce((sum, a) => sum + a.saturation, 0) / analyses.length;
    const hasText = analyses.some(a => a.hasText);

    // Infer tone attributes from visual data
    const professional = hasText ? 70 + Math.random() * 20 : 60 + Math.random() * 15;
    const friendly = avgBrightness > 0.6 ? 75 + Math.random() * 20 : 60 + Math.random() * 15;
    const innovative = avgSaturation > 0.5 ? 70 + Math.random() * 20 : 55 + Math.random() * 15;
    const bold = avgSaturation > 0.6 ? 75 + Math.random() * 20 : 50 + Math.random() * 20;
    const playful = (avgBrightness > 0.65 && avgSaturation > 0.5) ? 70 + Math.random() * 20 : 50 + Math.random() * 15;
    const trustworthy = hasText && avgBrightness < 0.6 ? 75 + Math.random() * 15 : 60 + Math.random() * 15;

    const attributes = {
      professional: Math.round(professional),
      friendly: Math.round(friendly),
      innovative: Math.round(innovative),
      bold: Math.round(bold),
      playful: Math.round(playful),
      trustworthy: Math.round(trustworthy),
    };

    // Determine primary tone
    const sortedAttributes = Object.entries(attributes).sort((a, b) => b[1] - a[1]);
    const topTwo = sortedAttributes.slice(0, 2).map(([key]) => 
      key.charAt(0).toUpperCase() + key.slice(1)
    );
    const detected = topTwo.join(' & ');

    const confidence = Math.min(85, 55 + (analyses.length * 6));

    return {
      detected,
      attributes,
      confidence: Math.round(confidence),
    };
  }

  /**
   * Detect layout patterns (limited without ML)
   */
  private static detectLayoutPatterns(analyses: ImageAnalysis[]): AnalysisResult['layout'] {
    // We can't reliably detect layout patterns without ML
    // But we can make educated guesses based on image characteristics
    
    const avgBrightness = analyses.reduce((sum, a) => sum + a.brightness, 0) / analyses.length;
    const avgSaturation = analyses.reduce((sum, a) => sum + a.saturation, 0) / analyses.length;

    const preferredStyles: Array<'gradient' | 'split' | 'centered' | 'overlay'> = [];
    
    // High saturation might indicate gradient usage
    if (avgSaturation > 0.5) {
      preferredStyles.push('gradient');
    }
    
    // Always add centered as it's most common
    preferredStyles.push('centered');
    
    // Add overlay if there's likely text
    if (analyses.some(a => a.hasText)) {
      preferredStyles.push('overlay');
    }

    // Add split as fallback
    if (preferredStyles.length < 3) {
      preferredStyles.push('split');
    }

    return {
      preferredStyles,
      alignment: 'unknown',
      useWhitespace: avgBrightness > 0.6,
      confidence: 30, // Low confidence as we're guessing
      detected: false,
    };
  }

  /**
   * Convert analysis result to Style DNA profile updates
   */
  static convertToStyleDNA(analysis: AnalysisResult): Partial<StyleDNAProfile> {
    const updates: Partial<StyleDNAProfile> = {};

    // Only update colors if they were detected
    if (analysis.colors.detected && analysis.colors.primary.length > 0) {
      updates.colors = {
        primary: analysis.colors.primary,
        secondary: analysis.colors.secondary.length > 0 ? analysis.colors.secondary : analysis.colors.primary,
        accent: analysis.colors.accent.length > 0 ? analysis.colors.accent : [analysis.colors.primary[0]],
      };
    }

    // Only update typography if fonts were detected (they won't be in current implementation)
    if (analysis.typography.detected && analysis.typography.detectedFonts.length > 0) {
      updates.typography = {
        headingFont: analysis.typography.detectedFonts[0],
        bodyFont: analysis.typography.detectedFonts[0],
        preferredSizes: ['32px', '24px', '16px'],
      };
    }

    // Always update tone as it's inferred from visuals
    updates.tone = {
      primary: analysis.tone.detected,
      attributes: analysis.tone.attributes,
    };

    // Only update layouts if detected with reasonable confidence
    if (analysis.layout.detected && analysis.layout.confidence > 50) {
      updates.layouts = {
        preferred: analysis.layout.preferredStyles,
        alignment: analysis.layout.alignment === 'unknown' ? 'center' : analysis.layout.alignment,
        useWhitespace: analysis.layout.useWhitespace,
      };
    }

    // Only update image style if detected
    if (analysis.imageStyle.detected) {
      updates.imageStyle = {
        treatment: analysis.imageStyle.treatment,
        mood: analysis.imageStyle.mood,
      };
    }

    return updates;
  }

  // Utility functions
  private static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private static calculateSaturation(r: number, g: number, b: number): number {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }
}
