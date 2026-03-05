// Style DNA Service - Manages the user's learned creative style
export interface StyleDNAProfile {
  colors: {
    primary: string[];
    secondary: string[];
    accent: string[];
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    preferredSizes: string[];
  };
  tone: {
    primary: string;
    attributes: {
      professional: number;
      friendly: number;
      innovative: number;
      bold: number;
      playful: number;
      trustworthy: number;
    };
  };
  layouts: {
    preferred: Array<'gradient' | 'split' | 'centered' | 'overlay'>;
    alignment: 'left' | 'center' | 'right';
    useWhitespace: boolean;
  };
  imageStyle: {
    treatment: string;
    mood: string;
  };
}

// Global Style DNA - This would normally be fetched from a database
let currentStyleDNA: StyleDNAProfile = {
  colors: {
    primary: ['#001B42', '#353CED', '#00328F'],
    secondary: ['#353CED', '#00328F'],
    accent: ['#CDFF2A'],
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    preferredSizes: ['32px', '24px', '16px'],
  },
  tone: {
    primary: 'Professional & Innovative',
    attributes: {
      professional: 85,
      friendly: 92,
      innovative: 88,
      bold: 75,
      playful: 65,
      trustworthy: 90,
    },
  },
  layouts: {
    preferred: ['gradient', 'centered', 'overlay'],
    alignment: 'center',
    useWhitespace: true,
  },
  imageStyle: {
    treatment: 'Vibrant with high saturation',
    mood: 'Professional yet Creative',
  },
};

export class StyleDNAService {
  /**
   * Get the current Style DNA profile
   */
  static getProfile(): StyleDNAProfile {
    return currentStyleDNA;
  }

  /**
   * Update Style DNA profile
   */
  static updateProfile(updates: Partial<StyleDNAProfile>): void {
    currentStyleDNA = { ...currentStyleDNA, ...updates };
    console.log('Style DNA Profile updated:', currentStyleDNA);
  }

  /**
   * Reset to default profile (useful for testing)
   */
  static resetProfile(): void {
    currentStyleDNA = {
      colors: {
        primary: ['#001B42', '#353CED', '#00328F'],
        secondary: ['#353CED', '#00328F'],
        accent: ['#CDFF2A'],
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        preferredSizes: ['32px', '24px', '16px'],
      },
      tone: {
        primary: 'Professional & Innovative',
        attributes: {
          professional: 85,
          friendly: 92,
          innovative: 88,
          bold: 75,
          playful: 65,
          trustworthy: 90,
        },
      },
      layouts: {
        preferred: ['gradient', 'centered', 'overlay'],
        alignment: 'center',
        useWhitespace: true,
      },
      imageStyle: {
        treatment: 'Vibrant with high saturation',
        mood: 'Professional yet Creative',
      },
    };
  }

  /**
   * Get tone-appropriate language based on Style DNA
   */
  static getToneGuidance(): {
    style: string;
    guidelines: string[];
    examplePhrases: string[];
  } {
    const tone = currentStyleDNA.tone;
    const primary = tone.primary;

    // Determine tone guidelines based on attributes
    const guidelines: string[] = [];
    const examplePhrases: string[] = [];

    if (tone.attributes.professional > 80) {
      guidelines.push('Use clear, authoritative language');
      examplePhrases.push('Proven results', 'Industry-leading', 'Professional excellence');
    }

    if (tone.attributes.friendly > 80) {
      guidelines.push('Keep it warm and approachable');
      examplePhrases.push('We\'re here for you', 'Let\'s create together', 'Join our community');
    }

    if (tone.attributes.innovative > 80) {
      guidelines.push('Emphasize cutting-edge and forward-thinking');
      examplePhrases.push('Next-generation', 'Reimagined', 'Transform the way');
    }

    if (tone.attributes.bold > 75) {
      guidelines.push('Use strong, confident statements');
      examplePhrases.push('Break the rules', 'Stand out', 'Make your mark');
    }

    if (tone.attributes.playful > 70) {
      guidelines.push('Add personality and energy');
      examplePhrases.push('Let\'s go!', 'Ready to shine?', 'Magic happens here');
    }

    return {
      style: primary,
      guidelines,
      examplePhrases,
    };
  }

  /**
   * Get color scheme for specific use case
   */
  static getColorScheme(variant: 'primary' | 'secondary' | 'accent' = 'primary'): string[] {
    switch (variant) {
      case 'primary':
        return currentStyleDNA.colors.primary;
      case 'secondary':
        return currentStyleDNA.colors.secondary;
      case 'accent':
        return currentStyleDNA.colors.accent;
      default:
        return currentStyleDNA.colors.primary;
    }
  }

  /**
   * Get preferred layout type based on content type
   */
  static getPreferredLayout(contentType: string): 'gradient' | 'split' | 'centered' | 'overlay' {
    const preferred = currentStyleDNA.layouts.preferred;
    
    // Return first preferred layout, or default
    return preferred[0] || 'gradient';
  }

  /**
   * Get typography settings
   */
  static getTypography() {
    return currentStyleDNA.typography;
  }

  /**
   * Learn from user feedback (update DNA based on selections)
   */
  static learnFromSelection(selectedDesign: {
    colors: string[];
    layout: string;
    tone: string;
  }): void {
    // In production, this would update the database and retrain the model
    console.log('Learning from selection:', selectedDesign);
    // Update preferences based on what user selected
  }
}

export const styleDNA = StyleDNAService;
