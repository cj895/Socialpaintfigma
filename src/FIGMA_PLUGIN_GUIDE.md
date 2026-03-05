# socialpAInt Figma Plugin Integration Guide

## Overview

The socialpAInt Figma Plugin enables AI to observe and learn from your design work directly in Figma. This creates a seamless workflow where designers can work naturally in their preferred tool while the AI builds a comprehensive Style DNA in the background.

## How It Works

### 1. Plugin Installation
- Install the "socialpAInt Observer" plugin from the Figma Community
- The plugin runs silently in the background (no UI interruptions)
- One-time setup with a secure connection code

### 2. Real-Time Observation
The plugin tracks design decisions as they happen:

**Color Decisions:**
- Every time you select a color from the color picker
- When you apply fills, strokes, or effects
- Color frequency and combinations
- Usage patterns (primary vs. accent colors)

**Typography Choices:**
- Font selections and pairings
- Size relationships and hierarchy
- Weight usage patterns
- Letter spacing and line height preferences

**Layout Patterns:**
- Element positioning and alignment
- Spacing between elements (padding, margins, gaps)
- Grid usage and structure
- Composition balance (symmetry vs. asymmetry)

**Component Usage:**
- Which components you create and reuse
- Naming conventions
- Organizational patterns
- Design system structure

### 3. Data Transmission
- Design decisions are anonymized and encrypted
- Only **pattern data** is sent (no actual design content or client work)
- Data transmitted: color hex codes, font names, spacing values, layout structures
- NOT transmitted: Text content, images, client information, file names

### 4. Style DNA Updates
- AI analyzes patterns in real-time
- Style DNA updates automatically after each session
- Confidence score increases with more observed work
- Patterns emerge after ~5-10 design sessions

## Technical Architecture

```
Figma Plugin → Secure API → socialpAInt Backend → Style DNA Service
     ↓                                                    ↓
Observes design          Analyzes patterns      Updates user profile
decisions locally        extracts rules         increases confidence
```

### Plugin Code Structure (Conceptual)

```typescript
// Figma Plugin Main Thread
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;
  
  selection.forEach(node => {
    // Observe color usage
    if ('fills' in node && node.fills) {
      const fills = node.fills as Paint[];
      fills.forEach(fill => {
        if (fill.type === 'SOLID') {
          sendToAPI({
            type: 'color_usage',
            value: rgbToHex(fill.color),
            context: 'fill',
            timestamp: Date.now()
          });
        }
      });
    }
    
    // Observe typography
    if ('fontName' in node && node.fontName) {
      sendToAPI({
        type: 'typography',
        font: node.fontName.family,
        weight: node.fontName.style,
        size: node.fontSize,
        timestamp: Date.now()
      });
    }
    
    // Observe spacing
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
      sendToAPI({
        type: 'spacing',
        padding: node.paddingLeft,
        gap: node.itemSpacing,
        alignment: node.primaryAxisAlignItems,
        timestamp: Date.now()
      });
    }
  });
});

// Track when designs are saved/published
figma.on('documentchange', (event) => {
  if (event.documentChanges.length > 0) {
    analyzeSession();
  }
});
```

### API Endpoints

**POST /api/figma/observe**
```json
{
  "userId": "user_123",
  "sessionId": "session_456",
  "observations": [
    {
      "type": "color_usage",
      "value": "#2563EB",
      "context": "background",
      "frequency": 12,
      "timestamp": 1703001234567
    },
    {
      "type": "typography",
      "font": "Inter",
      "weight": "Bold",
      "size": 32,
      "context": "headline",
      "timestamp": 1703001234890
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "confidence_delta": 2,
  "new_confidence": 67,
  "patterns_learned": [
    "Consistent use of Inter Bold for headlines",
    "Primary blue (#2563EB) used for 80% of backgrounds",
    "24px spacing pattern detected"
  ]
}
```

## Privacy & Security

### What We Track:
✅ Color values (hex codes)
✅ Font names and sizes
✅ Spacing measurements
✅ Layout structures
✅ Design patterns

### What We DON'T Track:
❌ Actual design content
❌ Text/copy content
❌ Images or graphics
❌ Client information
❌ File names or project names
❌ Collaboration data

### Data Handling:
- All data encrypted in transit (TLS 1.3)
- No personally identifiable information collected
- Pattern data only, aggregated and anonymized
- User can disconnect plugin anytime
- All tracked data deleted if account is deleted

## User Experience

### For Designers:
1. **Install once** - 30 second setup process
2. **Work normally** - No UI changes or interruptions
3. **AI learns silently** - Observes in background
4. **See progress** - Check confidence score in socialpAInt dashboard
5. **Generate when ready** - Use learned style to create content

### Indicators:
- **Active**: Green dot in Figma plugin menu
- **Syncing**: Brief "synced" notification after major changes
- **Learned**: Occasional "AI learned new pattern" notification (if enabled)

### Performance:
- Zero impact on Figma performance
- Observations batched and sent every 30 seconds
- Minimal network usage (~10KB per minute)
- No UI blocking or lag

## Setup Process

### Step 1: Install Plugin
1. Open Figma
2. Right-click → Plugins → Browse plugins in Community
3. Search "socialpAInt Observer"
4. Click "Install"

### Step 2: Connect to socialpAInt
1. Open socialpAInt web app
2. Go to Settings → Integrations
3. Click "Connect Figma"
4. Copy connection code: `SPAINT-F1GM4-2024-X7Y9Z`

### Step 3: Authorize in Figma
1. In Figma: Right-click → Plugins → socialpAInt Observer
2. Paste connection code
3. Click "Connect"
4. Plugin will confirm: "Connected to socialpAInt ✓"

### Step 4: Verify Connection
1. Return to socialpAInt web app
2. See "Figma Connected" status in Settings
3. Green indicator appears on Dashboard
4. Start designing - AI will observe automatically

## Advanced Configuration

### Tracking Settings (in socialpAInt Settings → Integrations):
- ☑️ **Track Colors** - Observe color selections
- ☑️ **Track Typography** - Observe font choices
- ☑️ **Track Layout** - Observe spacing and composition
- ☑️ **Track Spacing** - Observe padding and gaps
- ☐ **Auto-track all designs** - Learn from every frame
- ☐ **Learning notifications** - Get notified of new patterns

### Selective Tracking:
- Tag frames with `#socialpaint` to explicitly include them
- Tag frames with `#nosync` to exclude them
- Useful for client work vs. personal experimentation

### Session Summary:
- After each Figma session, receive summary email:
  - "AI observed 45 design decisions"
  - "Learned: Consistent 32px spacing pattern"
  - "Style DNA confidence: 67% → 72%"

## Troubleshooting

### Plugin Not Connecting:
- Verify connection code is correct (case-sensitive)
- Check internet connection
- Ensure socialpAInt account is active
- Try regenerating connection code

### Not Learning:
- Ensure tracking settings are enabled
- Verify plugin shows "Active" status
- Check that you're making trackable changes (colors, fonts, spacing)
- Some actions (like viewing only) don't generate learnings

### Disconnect Plugin:
1. socialpAInt Settings → Integrations → Disconnect
2. Or in Figma: Right-click → Plugins → socialpAInt Observer → Disconnect

## Benefits

### For Individual Designers:
- 🎨 **Work naturally** in your preferred tool
- 🚀 **No manual uploads** or exports needed
- 📈 **Automatic Style DNA** improvement
- ⚡ **Faster generation** results over time

### For Design Teams:
- 👥 **Collective learning** from team's work
- 📊 **Consistency insights** across designers
- 🔄 **Real-time updates** to design system
- 📚 **Living style guide** that evolves

### For Organizations:
- 🎯 **Capture expertise** from senior designers
- 🔓 **Distribute knowledge** to entire team
- ⏱️ **Save time** on content creation
- ✅ **Maintain quality** across all output

## Comparison: Design Studio vs. Figma Plugin

| Aspect | Design Studio | Figma Plugin |
|--------|---------------|--------------|
| **Where you work** | socialpAInt web app | Figma (your normal tool) |
| **Learning speed** | Immediate (per design) | Gradual (over sessions) |
| **Setup required** | None | One-time install + connect |
| **Use case** | Quick designs, training AI | Professional work, deep learning |
| **Data captured** | Full design decisions | Pattern observations |
| **Best for** | Starting out, rapid iteration | Ongoing work, team collaboration |

## Recommendation

**Use Both for Maximum AI Learning:**
1. **Start with Design Studio** - Create 5-10 designs to establish baseline
2. **Connect Figma Plugin** - Let AI observe your professional work
3. **Continue both** - Quick designs in Studio, real projects in Figma
4. **Result** - Fastest path to high-confidence Style DNA

## Future Enhancements

Coming soon:
- 🎨 Adobe XD plugin support
- 🖼️ Sketch plugin integration
- 📱 Mobile design tracking (Figma mobile app)
- 🤝 Team collaboration features
- 📊 Advanced analytics on design patterns
- 🔍 Pattern suggestions while designing

---

**Questions?** Visit our help center or contact support@socialpaint.com

**Ready to connect?** Go to Settings → Integrations in your socialpAInt dashboard
