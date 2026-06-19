# GitHub Tutorial Video - Remotion

> **A professional animated video tutorial showing how to create a GitHub account and push a local repository.**

<p align="center">
  <img src="./out/github-tutorial-ads.gif" alt="GitHub Tutorial Video Preview" width="640" />
</p>

<p align="center">
  <a href="./out/github-tutorial-ads.mp4">
    <img src="https://img.shields.io/badge/Download-Video%20MP4-58a6ff?style=for-the-badge&logo=github" alt="Download Video" />
  </a>
  <a href="https://www.remotion.dev/docs">
    <img src="https://img.shields.io/badge/Built%20with-Remotion-58a6ff?style=for-the-badge" alt="Built with Remotion" />
  </a>
  <img src="https://img.shields.io/badge/Duration-28s-3fb950?style=for-the-badge" alt="Duration" />
  <img src="https://img.shields.io/badge/Resolution-1280x720-bc8cff?style=for-the-badge" alt="Resolution" />
</p>

---

## 📺 What This Project Generates

This project creates a **28-second professional video tutorial** that guides viewers through the complete process of:

1. **Creating a GitHub account** - Sign up and get started
2. **Configuring Git** - Set up your local environment
3. **Creating a local repository** - Initialize and make your first commit
4. **Creating a remote repository** - Set up on GitHub
5. **Pushing to GitHub** - Connect and upload your code

The video features GitHub's official design language with:
- 🎨 Dark theme matching GitHub's UI
- ✨ Animated particles and gradient effects
- 📝 Syntax-highlighted code blocks
- 🎬 Smooth transitions and animations

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Start Remotion Studio (Live Preview)

```bash
npm run dev
```

This opens the Remotion Studio at `http://localhost:3001` where you can:
- Preview the video in real-time
- Scrub through the timeline
- See animations as they happen

### Render the Video

```bash
# Render the full HD video
npx remotion render src/index.ts MyComp out/github-tutorial-ads.mp4 --image-format=jpeg
```

## 🎬 Video Structure

| Time | Section | Description |
|------|---------|-------------|
| 0-4s | **Hero** | GitHub logo animation + "Build from here" tagline |
| 4-8s | **Step 1** | Create Your Account |
| 8-12s | **Step 2** | Configure Git (with commands) |
| 12-16s | **Step 3** | Initialize Repository (with commands) |
| 16-20s | **Step 4** | Create on GitHub |
| 20-24s | **Step 5** | Push to GitHub (with commands) |
| 24-28s | **CTA** | "You're all set! 🎉" call to action |

## 🛠️ Tech Stack

- **[Remotion](https://www.remotion.dev/docs)** - Create videos programmatically with React
- **React 19** - UI components
- **Tailwind CSS** - Styling (via `@remotion/tailwind-v4`)
- **TypeScript** - Type-safe code

## 📁 Project Structure

```
remotion-test/
├── src/
│   ├── index.ts          # Remotion entry point
│   ├── Root.tsx          # Composition configuration
│   ├── Composition.tsx   # Main video composition
│   └── index.css         # Global styles
├── out/
│   ├── github-tutorial-ads.mp4   # Rendered video (2.8 MB)
│   ├── github-tutorial-ads.gif   # Preview GIF (8.8 MB)
│   └── preview-step3.png         # Preview screenshot
├── public/               # Static assets
├── package.json
└── remotion.config.ts
```

## ⚙️ Configuration

### Composition Settings (`src/Root.tsx`)

```typescript
<Composition
  id="MyComp"
  component={MyComposition}
  durationInFrames={840}  // 28 seconds at 30fps
  fps={30}
  width={1280}
  height={720}
/>
```

### GitHub Brand Colors Used

```typescript
const GITHUB_COLORS = {
  bgDark: "#0d1117",        // GitHub dark background
  bgSecondary: "#161b22",   // Card backgrounds
  textPrimary: "#f0f6fc",   // Main text
  textSecondary: "#8b949e", // Secondary text
  accentBlue: "#58a6ff",    // Links and accents
  accentGreen: "#3fb950",   // Success/CTA
  accentPurple: "#bc8cff",  // Gradient accent
};
```

## 🎨 Key Features

### Animated Particles
Background particles that float upward, creating depth and visual interest.

### SVG GitHub Logo
The official GitHub logo rendered as an SVG with a glowing blue shadow effect.

### Gradient Accents
Smooth gradients between GitHub's brand colors for badges, dividers, and text.

### Code Blocks
Monospace-styled code blocks matching GitHub's syntax highlighting aesthetic.

### Smooth Animations
All animations use Remotion's `interpolate()` and `spring()` for frame-accurate timing.

## 📝 How It Works

### 1. Composition Architecture

The video is built using **Sequences** - Remotion's way of dividing a video into timed sections:

```typescript
// Each sequence plays at a specific time range
<Sequence from={0} durationInFrames={120}>
  <HeroSection />
</Sequence>

<Sequence from={120} durationInFrames={120}>
  <StepCard step={1} title="Create Your Account" />
</Sequence>
```

### 2. Animation System

All animations are frame-based using Remotion's hooks:

```typescript
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: "clamp",
  extrapolateLeft: "clamp",
});
```

### 3. Component Structure

- **`HeroSection`** - Opening with logo, headline, and particles
- **`StepCard`** - Reusable component for each tutorial step
- **`CTAScreen`** - Final call-to-action screen
- **`GitHubLogo`** - Animated SVG logo component
- **`Particle`** - Background animation element

## 🔧 Customization

### Change Video Duration

Edit `durationInFrames` in `src/Root.tsx`:

```typescript
durationInFrames={840} // 30fps × 28 seconds = 840 frames
```

### Modify Steps

Edit the steps in `src/Composition.tsx`:

```typescript
<StepCard
  step={2}
  title="Your Title"
  description="Your description"
  command="git config --global user.name 'Your Name'"
  delay={0}
/>
```

### Change Colors

Update the `GITHUB_COLORS` constant in `src/Composition.tsx`.

## 📦 Rendering

### Render Full Video

```bash
npx remotion render src/index.ts MyComp out/video.mp4 --image-format=jpeg
```

### Render Single Frame

```bash
npx remotion still MyComp --scale=0.25 --frame=420
```

### Render with Higher Quality

```bash
npx remotion render src/index.ts MyComp out/video.mp4 --image-format=jpeg --codec=libx264 --pixel-format=yuv420p
```

## 🤝 Contributing

1. Make changes to `src/Composition.tsx`
2. Preview in Remotion Studio: `npm run dev`
3. Render: `npx remotion render src/index.ts MyComp out/video.mp4`

## 📄 License

UNLICENSED

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-Remotion%204.0.481-58a6ff?style=flat" alt="Remotion Version" />
  <img src="https://img.shields.io/badge/React-19.2.3-61dafb?style=flat" alt="React Version" />
</p>
