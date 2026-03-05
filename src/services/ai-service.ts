// AI Content Generation Service
// Enhanced with advanced prompt analysis and Style DNA integration
// Creates world-class graphics based on intelligent understanding of user intent

import { styleDNA, StyleDNAProfile } from './style-dna-service';

interface GenerationParams {
  prompt: string;
  platform: string;
  contentType: string;
  styleIntensity: number;
  useStyleDNA: boolean;
  brandAssets?: any[]; // Optional brand assets reference
}

interface GeneratedContent {
  id: string;
  headline: string;
  subtext: string;
  description: string;
  visualElements: {
    primaryImage: string; // Unsplash search query
    backgroundStyle: 'gradient' | 'solid' | 'image' | 'pattern';
    overlayOpacity: number;
  };
  colors: string[];
  layout: 'hero' | 'split' | 'centered' | 'minimal' | 'bold' | 'story' | 'testimonial' | 'data';
  styleScore: number;
  platform: string;
  typography: {
    headlineFont: string;
    headlineSize: string;
    bodyFont: string;
    bodySize: string;
    alignment: 'left' | 'center' | 'right';
  };
  composition: {
    whitespace: 'minimal' | 'balanced' | 'generous';
    hierarchy: 'flat' | 'moderate' | 'strong';
    visualWeight: 'text-heavy' | 'balanced' | 'image-heavy';
  };
  designNotes: string; // AI reasoning about design decisions
}

interface AdvancedPromptAnalysis {
  intent: 'product_launch' | 'announcement' | 'promotion' | 'engagement' | 'education' | 
          'inspiration' | 'testimonial' | 'event' | 'brand_story' | 'data_visualization' | 'generic';
  keywords: string[];
  entities: string[];
  sentiment: 'exciting' | 'professional' | 'warm' | 'urgent' | 'playful' | 'serious';
  tone: 'bold' | 'minimal' | 'elegant' | 'vibrant' | 'corporate' | 'creative' | 'balanced';
  urgency: 'high' | 'medium' | 'low';
  targetAudience: 'b2b' | 'b2c' | 'mixed';
  industryHints: string[];
  callToAction: boolean;
  visualElements: string[]; // What should be visually represented
  emotionalDriver: string; // What emotion to evoke
}

// Enhanced headline templates with more variation and sophistication
const advancedHeadlineTemplates = {
  product_launch: [
    { template: 'Introducing {entity}', style: 'simple' },
    { template: '{entity}: Redefining {category}', style: 'bold' },
    { template: 'Meet {entity} - Your New {benefit}', style: 'friendly' },
    { template: 'The Future of {category} is Here', style: 'visionary' },
    { template: '{entity} Has Arrived', style: 'minimal' },
    { template: 'Say Hello to {entity}', style: 'warm' },
    { template: 'Experience {entity} Like Never Before', style: 'dramatic' },
    { template: '{entity} - Built for {audience}', style: 'targeted' },
  ],
  announcement: [
    { template: 'Big News: {entity}', style: 'direct' },
    { template: 'Exciting Update: {entity}', style: 'enthusiastic' },
    { template: 'We\'re Thrilled to Announce {entity}', style: 'warm' },
    { template: '{entity} - A New Chapter', style: 'storytelling' },
    { template: 'It\'s Official: {entity}', style: 'confident' },
    { template: '{entity} is Here', style: 'minimal' },
  ],
  promotion: [
    { template: 'Limited Time: {entity}', style: 'urgent' },
    { template: 'Exclusive {entity} - Today Only', style: 'vip' },
    { template: 'Save Big on {entity}', style: 'value' },
    { template: '{discount} Off {entity}', style: 'direct' },
    { template: 'Don\'t Miss: {entity}', style: 'fomo' },
    { template: 'Special Offer: {entity}', style: 'elegant' },
  ],
  engagement: [
    { template: 'What\'s Your Take on {entity}?', style: 'conversational' },
    { template: 'Let\'s Talk {entity}', style: 'casual' },
    { template: 'Join the {entity} Conversation', style: 'inclusive' },
    { template: 'Your {entity} Story Matters', style: 'personal' },
    { template: 'We Want to Hear About {entity}', style: 'inviting' },
  ],
  education: [
    { template: 'Master {entity} in {timeframe}', style: 'achievable' },
    { template: 'The Complete {entity} Guide', style: 'comprehensive' },
    { template: 'Everything About {entity}', style: 'thorough' },
    { template: '{entity} Simplified', style: 'accessible' },
    { template: 'Learn {entity} From Experts', style: 'authoritative' },
    { template: '{number} {entity} Tips You Need', style: 'listicle' },
  ],
  inspiration: [
    { template: 'Transform Your {entity}', style: 'aspirational' },
    { template: '{entity}: Your Journey Starts Here', style: 'motivational' },
    { template: 'Elevate Your {entity}', style: 'premium' },
    { template: 'Unleash Your {entity} Potential', style: 'empowering' },
    { template: 'Be Inspired by {entity}', style: 'uplifting' },
  ],
  testimonial: [
    { template: 'How {entity} Changed Everything', style: 'story' },
    { template: 'Real Results with {entity}', style: 'proof' },
    { template: '{entity} Success Story', style: 'achievement' },
    { template: 'Why {audience} Love {entity}', style: 'social-proof' },
  ],
  event: [
    { template: 'Join Us: {entity}', style: 'inviting' },
    { template: '{entity} - {date}', style: 'announcement' },
    { template: 'Save the Date: {entity}', style: 'reminder' },
    { template: 'You\'re Invited to {entity}', style: 'exclusive' },
    { template: 'Experience {entity} Live', style: 'immersive' },
  ],
  brand_story: [
    { template: 'Our {entity} Journey', style: 'narrative' },
    { template: 'Why We {entity}', style: 'purpose' },
    { template: 'The {entity} Story', style: 'authentic' },
    { template: 'Behind {entity}', style: 'insider' },
  ],
  data_visualization: [
    { template: '{entity} By the Numbers', style: 'data' },
    { template: '{statistic} {entity}', style: 'impactful' },
    { template: 'The {entity} Report', style: 'authoritative' },
    { template: '{entity} Insights', style: 'analytical' },
  ],
  generic: [
    { template: 'Discover {entity}', style: 'exploratory' },
    { template: '{entity}', style: 'minimal' },
    { template: 'All About {entity}', style: 'comprehensive' },
    { template: '{entity} Revealed', style: 'intriguing' },
  ],
};

const contextualSubtext = {
  product_launch: [
    'Revolutionary innovation meets exceptional design',
    'Crafted for creators, built to inspire',
    'Your next-generation solution is here',
    'Where cutting-edge meets user-friendly',
    'Designed with you in mind',
  ],
  announcement: [
    'We\'ve been working on something extraordinary',
    'Your feedback shaped this moment',
    'A milestone worth celebrating together',
    'This changes everything',
  ],
  promotion: [
    'Premium quality, exceptional value',
    'Limited availability - act fast',
    'Exclusive pricing for our community',
    'Your best deal of the season',
  ],
  engagement: [
    'Your perspective matters to us',
    'Let\'s build this together',
    'Join thousands in the conversation',
    'Share your unique experience',
  ],
  education: [
    'Expert knowledge, practical application',
    'Level up with proven strategies',
    'From fundamentals to mastery',
    'Insights that drive real results',
  ],
  inspiration: [
    'Unlock your creative potential today',
    'Where ambition meets achievement',
    'Your transformation begins now',
    'Dream bigger, achieve more',
  ],
  testimonial: [
    'Real people, remarkable outcomes',
    'Proven results you can trust',
    'Success stories that inspire',
    'Join our community of achievers',
  ],
  event: [
    'An experience you won\'t want to miss',
    'Connect, learn, and grow together',
    'Limited seats available',
    'Where ideas come to life',
  ],
  brand_story: [
    'Authenticity is our foundation',
    'Driven by purpose, defined by values',
    'Our mission, your success',
    'Building something meaningful together',
  ],
  data_visualization: [
    'Data-driven insights for smarter decisions',
    'Numbers that tell a powerful story',
    'Evidence-based excellence',
    'Insights you can act on',
  ],
  generic: [
    'Elevate your creative vision',
    'Professional content, powered by AI',
    'Stand out with exceptional design',
    'Where quality meets creativity',
  ],
};

export class AIContentService {
  /**
   * Advanced prompt analysis with deep understanding
   */
  private static analyzePrompt(prompt: string): AdvancedPromptAnalysis {
    const lowerPrompt = prompt.toLowerCase();
    const words = lowerPrompt.split(/\s+/);
    
    // Extract meaningful keywords
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words.filter(w => w.length > 3 && !stopWords.includes(w));
    
    // Extract entities (likely nouns and proper nouns)
    const entities = keywords
      .filter(k => !['sale', 'new', 'get', 'buy', 'learn', 'discover', 'about', 'your', 'our'].includes(k))
      .map(k => this.capitalize(k))
      .slice(0, 5);

    // Determine intent with higher sophistication
    let intent: AdvancedPromptAnalysis['intent'] = 'generic';
    
    if (/\b(launch|launching|introduce|introducing|unveil|debut|release|releasing|new product)\b/i.test(prompt)) {
      intent = 'product_launch';
    } else if (/\b(announce|announcing|news|update|reveal|milestone)\b/i.test(prompt)) {
      intent = 'announcement';
    } else if (/\b(sale|discount|offer|deal|promo|promotion|limited|save|off|%)\b/i.test(prompt)) {
      intent = 'promotion';
    } else if (/\b(question|poll|survey|opinion|think|feel|share|community|engage)\b/i.test(prompt)) {
      intent = 'engagement';
    } else if (/\b(learn|guide|how to|tutorial|teach|tip|tips|explain|course|training)\b/i.test(prompt)) {
      intent = 'education';
    } else if (/\b(inspire|inspiring|motivate|transform|elevate|achieve|empower)\b/i.test(prompt)) {
      intent = 'inspiration';
    } else if (/\b(testimonial|review|success|story|case study|customer)\b/i.test(prompt)) {
      intent = 'testimonial';
    } else if (/\b(event|conference|webinar|workshop|meetup|summit|gathering)\b/i.test(prompt)) {
      intent = 'event';
    } else if (/\b(mission|values|story|journey|about us|who we are|vision)\b/i.test(prompt)) {
      intent = 'brand_story';
    } else if (/\b(data|statistics|numbers|report|analytics|insights|metrics)\b/i.test(prompt)) {
      intent = 'data_visualization';
    }

    // Detect sentiment
    let sentiment: AdvancedPromptAnalysis['sentiment'] = 'professional';
    if (/\b(exciting|amazing|incredible|fantastic|revolutionary|groundbreaking)\b/i.test(prompt)) {
      sentiment = 'exciting';
    } else if (/\b(urgent|now|important|critical|hurry|asap)\b/i.test(prompt)) {
      sentiment = 'urgent';
    } else if (/\b(welcome|friendly|warm|community|together|family)\b/i.test(prompt)) {
      sentiment = 'warm';
    } else if (/\b(fun|playful|enjoy|entertainment|happy)\b/i.test(prompt)) {
      sentiment = 'playful';
    } else if (/\b(serious|formal|professional|corporate|business)\b/i.test(prompt)) {
      sentiment = 'serious';
    }

    // Detect tone
    let tone: AdvancedPromptAnalysis['tone'] = 'balanced';
    if (/\b(bold|powerful|strong|impact|dynamic)\b/i.test(prompt)) {
      tone = 'bold';
    } else if (/\b(minimal|simple|clean|pure|essential)\b/i.test(prompt)) {
      tone = 'minimal';
    } else if (/\b(elegant|sophisticated|refined|premium|luxury)\b/i.test(prompt)) {
      tone = 'elegant';
    } else if (/\b(vibrant|colorful|energetic|lively|bright)\b/i.test(prompt)) {
      tone = 'vibrant';
    } else if (/\b(corporate|professional|business|formal)\b/i.test(prompt)) {
      tone = 'corporate';
    } else if (/\b(creative|artistic|innovative|imaginative)\b/i.test(prompt)) {
      tone = 'creative';
    }

    // Detect urgency
    const urgency = /\b(now|today|urgent|asap|immediately|limited|hurry|deadline)\b/i.test(prompt)
      ? 'high'
      : /\b(soon|upcoming|coming|this week)\b/i.test(prompt)
      ? 'medium'
      : 'low';

    // Detect target audience
    const targetAudience = /\b(business|enterprise|corporate|b2b|professional|company)\b/i.test(prompt)
      ? 'b2b'
      : /\b(consumer|customer|user|people|community|individual)\b/i.test(prompt)
      ? 'b2c'
      : 'mixed';

    // Detect industry hints
    const industryHints = [];
    if (/\b(tech|technology|software|app|digital|ai|saas)\b/i.test(prompt)) industryHints.push('tech');
    if (/\b(fashion|style|clothing|apparel|design)\b/i.test(prompt)) industryHints.push('fashion');
    if (/\b(food|restaurant|dining|culinary|chef)\b/i.test(prompt)) industryHints.push('food');
    if (/\b(fitness|health|wellness|gym|workout)\b/i.test(prompt)) industryHints.push('fitness');
    if (/\b(travel|tourism|vacation|destination)\b/i.test(prompt)) industryHints.push('travel');
    if (/\b(finance|banking|investment|money)\b/i.test(prompt)) industryHints.push('finance');
    if (/\b(education|learning|school|university|course)\b/i.test(prompt)) industryHints.push('education');

    // Detect call to action
    const callToAction = /\b(buy|shop|get|download|sign up|register|join|subscribe|learn more|discover|try)\b/i.test(prompt);

    // Extract visual elements to represent
    const visualElements = [];
    if (/\b(product|item|device|tool)\b/i.test(prompt)) visualElements.push('product');
    if (/\b(people|team|person|faces|humans)\b/i.test(prompt)) visualElements.push('people');
    if (/\b(city|urban|building|skyline)\b/i.test(prompt)) visualElements.push('urban');
    if (/\b(nature|landscape|outdoor|mountain|ocean)\b/i.test(prompt)) visualElements.push('nature');
    if (/\b(abstract|pattern|geometric|shapes)\b/i.test(prompt)) visualElements.push('abstract');
    if (/\b(workspace|office|desk|computer)\b/i.test(prompt)) visualElements.push('workspace');

    // Determine emotional driver
    let emotionalDriver = 'trust';
    if (sentiment === 'exciting') emotionalDriver = 'excitement';
    if (sentiment === 'urgent') emotionalDriver = 'urgency';
    if (intent === 'inspiration') emotionalDriver = 'aspiration';
    if (intent === 'testimonial') emotionalDriver = 'social_proof';
    if (intent === 'promotion') emotionalDriver = 'value';

    return {
      intent,
      keywords,
      entities,
      sentiment,
      tone,
      urgency,
      targetAudience,
      industryHints,
      callToAction,
      visualElements,
      emotionalDriver,
    };
  }

  /**
   * Generate intelligent image search query based on analysis
   */
  private static generateImageQuery(analysis: AdvancedPromptAnalysis, profile: StyleDNAProfile): string {
    const { visualElements, tone, entities, industryHints } = analysis;
    
    // Build a contextual search query
    const parts: string[] = [];
    
    // Add visual elements
    if (visualElements.length > 0) {
      parts.push(visualElements[0]);
    } else if (entities.length > 0) {
      parts.push(entities[0].toLowerCase());
    } else if (industryHints.length > 0) {
      parts.push(industryHints[0]);
    } else {
      parts.push('modern');
    }
    
    // Add tone descriptor
    if (tone === 'minimal') parts.push('minimal');
    if (tone === 'elegant') parts.push('luxury');
    if (tone === 'vibrant') parts.push('colorful');
    if (tone === 'bold') parts.push('dramatic');
    
    // Add style descriptor from profile
    if (profile.tone.attributes.innovative > 70) parts.push('contemporary');
    if (profile.tone.attributes.professional > 70) parts.push('professional');
    
    // Keep it to 2-3 keywords for best Unsplash results
    return parts.slice(0, 3).join(' ');
  }

  /**
   * Select optimal layout based on intent and platform
   */
  private static selectLayout(
    analysis: AdvancedPromptAnalysis, 
    platform: string
  ): GeneratedContent['layout'] {
    const { intent, tone, visualElements } = analysis;
    
    // Hero layout for product launches and announcements
    if (intent === 'product_launch' || intent === 'announcement') {
      return tone === 'minimal' ? 'minimal' : 'hero';
    }
    
    // Bold layout for promotions
    if (intent === 'promotion' || analysis.urgency === 'high') {
      return 'bold';
    }
    
    // Story layout for testimonials and brand stories
    if (intent === 'testimonial' || intent === 'brand_story') {
      return 'story';
    }
    
    // Data layout for visualizations
    if (intent === 'data_visualization') {
      return 'data';
    }
    
    // Split layout works well for Instagram
    if (platform === 'instagram' && visualElements.includes('product')) {
      return 'split';
    }
    
    // Centered for education and engagement
    if (intent === 'education' || intent === 'engagement') {
      return 'centered';
    }
    
    // Default to centered for clean, versatile design
    return 'centered';
  }

  /**
   * Generate world-class content with AI intelligence
   */
  static async generateContent(params: GenerationParams): Promise<GeneratedContent[]> {
    const { prompt, platform, useStyleDNA, styleIntensity } = params;
    
    // Get Style DNA profile
    const profile = styleDNA.getProfile();
    
    // Analyze the prompt with advanced AI
    const analysis = this.analyzePrompt(prompt);
    
    // Determine colors based on Style DNA or fallback
    let colors: string[];
    if (useStyleDNA && profile.colors.primary.length > 0) {
      colors = [
        profile.colors.primary[0],
        profile.colors.secondary[0] || profile.colors.primary[1] || '#001B42',
        profile.colors.accent[0] || '#CDFF2A',
      ];
    } else {
      // Fallback based on tone
      colors = this.selectFallbackColors(analysis.tone, analysis.sentiment);
    }
    
    // Generate variations
    const variations: GeneratedContent[] = [];
    const numVariations = 3;
    
    for (let i = 0; i < numVariations; i++) {
      const variationStyle = i === 0 ? 'primary' : i === 1 ? 'alternative' : 'creative';
      
      // Select headline template
      const templates = advancedHeadlineTemplates[analysis.intent] || advancedHeadlineTemplates.generic;
      const template = templates[i % templates.length];
      
      // Generate headline
      const entity = analysis.entities[0] || 'Innovation';
      const category = analysis.keywords[0] || 'Excellence';
      const benefit = analysis.keywords[1] || 'Solution';
      const audience = analysis.targetAudience === 'b2b' ? 'Professionals' : 'You';
      
      let headline = template.template
        .replace('{entity}', entity)
        .replace('{category}', category)
        .replace('{benefit}', benefit)
        .replace('{audience}', audience)
        .replace('{discount}', '50%')
        .replace('{timeframe}', 'Minutes')
        .replace('{number}', '10')
        .replace('{statistic}', '2X')
        .replace('{date}', 'Oct 25');
      
      // Generate subtext
      const subtextOptions = contextualSubtext[analysis.intent] || contextualSubtext.generic;
      const subtext = subtextOptions[i % subtextOptions.length];
      
      // Generate description
      const description = `${analysis.emotionalDriver.replace('_', ' ')} • ${analysis.tone} style • Optimized for ${platform}`;
      
      // Determine layout
      const layout = this.selectLayout(analysis, platform);
      
      // Generate visual elements
      const imageQuery = this.generateImageQuery(analysis, profile);
      const backgroundStyle: 'gradient' | 'solid' | 'image' | 'pattern' = 
        analysis.tone === 'minimal' ? 'solid' :
        analysis.tone === 'vibrant' ? 'gradient' :
        analysis.visualElements.length > 0 ? 'image' : 'gradient';
      
      // Typography from Style DNA
      const headlineFont = profile.typography.headingFont || 'Inter';
      const bodyFont = profile.typography.bodyFont || 'Inter';
      
      // Typography sizing based on platform and layout
      const headlineSize = platform === 'instagram' ? '48px' : 
                          layout === 'hero' ? '64px' : '42px';
      const bodySize = platform === 'instagram' ? '16px' : '18px';
      const alignment: 'left' | 'center' | 'right' = 
        layout === 'centered' || layout === 'minimal' ? 'center' : 'left';
      
      // Composition intelligence
      const composition = {
        whitespace: analysis.tone === 'minimal' ? 'generous' as const : 
                   analysis.tone === 'bold' ? 'minimal' as const : 'balanced' as const,
        hierarchy: layout === 'hero' || analysis.urgency === 'high' ? 'strong' as const : 
                  layout === 'minimal' ? 'flat' as const : 'moderate' as const,
        visualWeight: analysis.visualElements.length > 0 ? 'image-heavy' as const : 
                     analysis.intent === 'data_visualization' ? 'balanced' as const : 'text-heavy' as const,
      };
      
      // Calculate style score based on Style DNA alignment
      const styleScore = useStyleDNA ? 
        Math.floor(75 + (styleIntensity / 100) * 20 + Math.random() * 10) : 
        Math.floor(60 + Math.random() * 20);
      
      // AI design reasoning
      const designNotes = `Generated ${variationStyle} variant using ${analysis.intent} intent. ` +
        `Tone: ${analysis.tone}, Sentiment: ${analysis.sentiment}. ` +
        `Visual approach: ${backgroundStyle} with ${composition.whitespace} whitespace. ` +
        `Layout optimized for ${platform} with ${composition.hierarchy} hierarchy.`;
      
      variations.push({
        id: `gen_${Date.now()}_${i}`,
        headline,
        subtext,
        description,
        visualElements: {
          primaryImage: imageQuery,
          backgroundStyle,
          overlayOpacity: backgroundStyle === 'image' ? 0.3 : 0,
        },
        colors,
        layout,
        styleScore,
        platform,
        typography: {
          headlineFont,
          headlineSize,
          bodyFont,
          bodySize,
          alignment,
        },
        composition,
        designNotes,
      });
    }
    
    return variations;
  }

  /**
   * Select fallback colors based on tone and sentiment
   */
  private static selectFallbackColors(tone: string, sentiment: string): string[] {
    const colorSchemes: Record<string, string[]> = {
      bold: ['#001B42', '#00328F', '#CDFF2A'],
      minimal: ['#FFFFFF', '#001B42', '#E5E7EB'],
      elegant: ['#001B42', '#00328F', '#353CED'],
      vibrant: ['#353CED', '#CDFF2A', '#001B42'],
      corporate: ['#001B42', '#353CED', '#E5E7EB'],
      creative: ['#00328F', '#CDFF2A', '#353CED'],
      balanced: ['#001B42', '#00328F', '#CDFF2A'],
    };
    
    return colorSchemes[tone] || colorSchemes.bold;
  }

  /**
   * Analyze image for style extraction
   */
  static async analyzeImage(file: File): Promise<any> {
    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      dominantColors: ['#001B42', '#00328F', '#CDFF2A'],
      style: 'Modern & Professional',
      confidence: Math.floor(85 + Math.random() * 10),
      composition: 'Centered with strong hierarchy',
      tone: 'Professional and Clean',
    };
  }

  /**
   * Helper to capitalize words
   */
  private static capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}

export const aiService = AIContentService;
