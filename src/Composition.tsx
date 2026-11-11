import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";

// GitHub brand colors
const GITHUB_COLORS = {
  bgDark: "#0d1117",
  bgSecondary: "#161b22",
  bgTertiary: "#21262d",
  border: "#30363d",
  textPrimary: "#f0f6fc",
  textSecondary: "#8b949e",
  accentBlue: "#58a6ff",
  accentGreen: "#3fb950",
  accentPurple: "#bc8cff",
  white: "#ffffff",
  gradientStart: "#1a1f2e",
  gradientEnd: "#0d1117",
};

// Animated background particles
const Particle: React.FC<{ delay: number; size: number; x: number; y: number }> = ({ delay, size, x, y }) => {
  const frame = useCurrentFrame();
  
  const animFrame = Math.max(0, frame - delay);
  const opacity = interpolate(animFrame, [0, 60], [0, 0.6], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const translateY = interpolate(animFrame, [0, 120], [0, -100], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: GITHUB_COLORS.accentBlue,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    />
  );
};

// GitHub Logo SVG component
const GitHubLogo: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const scale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={GITHUB_COLORS.white}
        style={{ filter: "drop-shadow(0 0 20px rgba(88, 166, 255, 0.5))" }}
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    </div>
  );
};

// Hero section with main headline
const HeroSection: React.FC = () => {
  const frame = useCurrentFrame();
  
  const titleOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const subtitleY = interpolate(frame, [30, 60], [30, 0], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(180deg, ${GITHUB_COLORS.gradientStart} 0%, ${GITHUB_COLORS.gradientEnd} 100%)`,
        padding: "0 100px",
      }}
    >
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        opacity: 0.3,
      }}>
        {[...Array(20)].map((_, i) => (
          <Particle
            key={i}
            delay={i * 5}
            size={2 + ((i * 17) % 5)}
            x={(i * 37) % 100}
            y={(i * 53) % 100}
          />
        ))}
      </div>
      
      {/* GitHub Logo */}
      <GitHubLogo size={140} />
      
      {/* Main headline */}
      <div style={{
        opacity: titleOpacity,
        marginTop: 40,
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: 80,
          fontWeight: 800,
          color: GITHUB_COLORS.textPrimary,
          margin: "20px 0",
          lineHeight: 1.1,
          letterSpacing: "-2px",
        }}>
          Build from{" "}
          <span style={{
            background: `linear-gradient(90deg, ${GITHUB_COLORS.accentBlue}, ${GITHUB_COLORS.accentPurple})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            here
          </span>
        </h1>
      </div>
      
      {/* Subtitle */}
      <div style={{
        opacity: subtitleOpacity,
        transform: `translateY(${subtitleY}%)`,
        textAlign: "center",
        maxWidth: 800,
      }}>
        <p style={{
          fontSize: 32,
          color: GITHUB_COLORS.textSecondary,
          margin: "20px 0 40px 0",
          lineHeight: 1.5,
        }}>
          The world's leading developer platform.
        </p>
        <p style={{
          fontSize: 28,
          color: GITHUB_COLORS.accentBlue,
          fontWeight: 600,
        }}>
          Now you can too. Follow these 5 simple steps.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Step card component with GitHub styling
const StepCard: React.FC<{ step: number; title: string; description: string; command?: string; delay: number }> = ({
  step, title, description, command, delay
}) => {
  const frame = useCurrentFrame();
  
  const animFrame = Math.max(0, frame - delay);
  const opacity = interpolate(animFrame, [0, 30], [0, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const scale = interpolate(animFrame, [0, 30], [0.9, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const slideY = interpolate(animFrame, [0, 40], [60, 0], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: GITHUB_COLORS.bgDark,
        padding: "60px 100px",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${slideY}px)`,
          maxWidth: 1100,
          width: "100%",
        }}
      >
        {/* Step number badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${GITHUB_COLORS.accentBlue}, ${GITHUB_COLORS.accentPurple})`,
          fontSize: 28,
          fontWeight: 700,
          color: GITHUB_COLORS.white,
          marginBottom: 30,
          boxShadow: `0 8px 32px rgba(88, 166, 255, 0.3)`,
        }}>
          {step}
        </div>
        
        {/* Title */}
        <h2 style={{
          fontSize: 52,
          fontWeight: 700,
          color: GITHUB_COLORS.textPrimary,
          margin: "0 0 16px 0",
          letterSpacing: "-1px",
        }}>
          {title}
        </h2>
        
        {/* Description */}
        <p style={{
          fontSize: 28,
          color: GITHUB_COLORS.textSecondary,
          margin: "0 0 40px 0",
          lineHeight: 1.6,
        }}>
          {description}
        </p>
        
        {/* Code block if available */}
        {command && (
          <div style={{
            backgroundColor: GITHUB_COLORS.bgSecondary,
            border: `1px solid ${GITHUB_COLORS.border}`,
            borderRadius: 12,
            padding: "24px 32px",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}>
            <pre style={{
              margin: 0,
              fontSize: 22,
              color: GITHUB_COLORS.accentBlue,
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
            }}>
              {command}
            </pre>
          </div>
        )}
        
        {/* Decorative line */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${GITHUB_COLORS.accentBlue}, ${GITHUB_COLORS.accentPurple}, ${GITHUB_COLORS.accentGreen})`,
          borderRadius: 2,
          marginTop: 40,
          opacity: 0.6,
        }} />
      </div>
    </AbsoluteFill>
  );
};

// CTA / End screen
const CTAScreen: React.FC = () => {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  const scale = interpolate(frame, [0, 40], [0.8, 1], {
    extrapolateRight: "clamp" as const,
    extrapolateLeft: "clamp" as const,
  });
  
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(180deg, ${GITHUB_COLORS.gradientEnd} 0%, ${GITHUB_COLORS.gradientStart} 100%)`,
        padding: "0 100px",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          textAlign: "center",
        }}
      >
        <GitHubLogo size={100} />
        
        <h2 style={{
          fontSize: 64,
          fontWeight: 800,
          color: GITHUB_COLORS.textPrimary,
          margin: "30px 0 20px 0",
          letterSpacing: "-2px",
        }}>
          You're all set! 🎉
        </h2>
        
        <p style={{
          fontSize: 32,
          color: GITHUB_COLORS.textSecondary,
          margin: "0 0 40px 0",
        }}>
          Your code is now live on GitHub
        </p>
        
        {/* CTA Button */}
        <div style={{
          display: "inline-block",
          background: `linear-gradient(90deg, #238636, #2ea043)`,
          color: GITHUB_COLORS.white,
          fontSize: 28,
          fontWeight: 600,
          padding: "20px 48px",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(35, 134, 54, 0.4)",
        }}>
          github.com/new
        </div>
        
        <p style={{
          fontSize: 24,
          color: GITHUB_COLORS.textSecondary,
          marginTop: 40,
          opacity: 0.7,
        }}>
          Start building amazing things today
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const MyComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: GITHUB_COLORS.bgDark,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif",
      }}
    >
      {/* Hero Section (0-120 frames / 0-4 seconds) */}
      <Sequence durationInFrames={120}>
        <HeroSection />
      </Sequence>
      
      {/* Step 1: Create Account (120-240 frames / 4-8 seconds) */}
      <Sequence from={120} durationInFrames={120}>
        <StepCard
          step={1}
          title="Create Your Account"
          description="Sign up for free at github.com and join millions of developers worldwide"
          delay={0}
        />
      </Sequence>
      
      {/* Step 2: Configure Git (240-360 frames / 8-12 seconds) */}
      <Sequence from={240} durationInFrames={120}>
        <StepCard
          step={2}
          title="Configure Git"
          description="Set up Git on your machine with your GitHub credentials"
          command="git config --global user.name 'Your Name'\ngit config --global user.email 'your@email.com'"
          delay={0}
        />
      </Sequence>
      
      {/* Step 3: Create Local Repo (360-480 frames / 12-16 seconds) */}
      <Sequence from={360} durationInFrames={120}>
        <StepCard
          step={3}
          title="Initialize Your Repository"
          description="Create a local project and make your first commit"
          command="mkdir my-project && cd my-project\ngit init\ntouch README.md\ngit add . && git commit -m 'Initial commit'"
          delay={0}
        />
      </Sequence>
      
      {/* Step 4: Create Remote Repo (480-600 frames / 16-20 seconds) */}
      <Sequence from={480} durationInFrames={120}>
        <StepCard
          step={4}
          title="Create on GitHub"
          description="Create a new repository on GitHub to host your code"
          delay={0}
        />
      </Sequence>
      
      {/* Step 5: Push to GitHub (600-720 frames / 20-24 seconds) */}
      <Sequence from={600} durationInFrames={120}>
        <StepCard
          step={5}
          title="Push to GitHub"
          description="Connect your local repo and push your code to the cloud"
          command="git remote add origin https://github.com/user/repo.git\ngit branch -M main\ngit push -u origin main"
          delay={0}
        />
      </Sequence>
      
      {/* CTA / End Screen (720-840 frames / 24-28 seconds) */}
      <Sequence from={720} durationInFrames={120}>
        <CTAScreen />
      </Sequence>
    </AbsoluteFill>
  );
};
