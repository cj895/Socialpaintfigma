# socialpAInt - AI Brand Intelligence Platform

AI-powered SaaS platform that observes your design team's work to automatically build "Style DNA" - enabling anyone in your organization to generate world-class, perfectly on-brand content.

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Deploy to Vercel

### Via GitHub (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure build settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**

### Via Vercel CLI

```bash
npm install -g vercel
vercel
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **React Router v7** - Routing
- **Motion (Framer Motion)** - Animations
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **shadcn/ui** - UI components

## 📁 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── main.tsx        # App entry point
│   ├── App.tsx         # Main app component
│   ├── components/     # React components
│   ├── services/       # Business logic
│   └── styles/         # Global styles
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── package.json        # Dependencies
└── vercel.json         # Vercel configuration
```

## 🎨 Features

- **Design Studio** - Interactive canvas for creating designs
- **AI Content Generation** - Generate on-brand content from prompts
- **Style DNA** - AI learns from your design decisions
- **Analytics Dashboard** - Track usage and performance
- **Brand Assets Library** - Centralized asset management
- **Figma Plugin Integration** - Real-time design observation

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions, please contact support@socialpaint.com
