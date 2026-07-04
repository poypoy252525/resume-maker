import { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  Bot, 
  Zap, 
  FileText, 
  Check, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Trophy
} from "lucide-react";
import { Button } from "../ui/button";

type FeatureKey = "tailor" | "review" | "assistant" | "templates";

interface FeatureItem {
  id: FeatureKey;
  title: string;
  shortDesc: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("tailor");
  const [tailorStep, setTailorStep] = useState<"idle" | "tailoring" | "done">("idle");
  const [paraphraseOption, setParaphraseOption] = useState<number>(0);
  const [activeTemplate, setActiveTemplate] = useState<"modern" | "classic" | "minimal">("modern");
  const [score, setScore] = useState(55);

  // Listen for external trigger to show preview demo
  useEffect(() => {
    const handleShowPreview = () => {
      setActiveFeature("templates");
    };
    window.addEventListener("show-preview-demo", handleShowPreview);
    return () => {
      window.removeEventListener("show-preview-demo", handleShowPreview);
    };
  }, []);

  // Auto-animate score when review tab is selected
  useEffect(() => {
    if (activeFeature === "review") {
      setScore(55);
      const timer = setTimeout(() => {
        let current = 55;
        const interval = setInterval(() => {
          if (current < 89) {
            current += 1;
            setScore(current);
          } else {
            clearInterval(interval);
          }
        }, 15);
        return () => clearInterval(interval);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeFeature]);

  // Auto-run tailoring mockup periodically
  useEffect(() => {
    if (activeFeature === "tailor" && tailorStep === "idle") {
      const timer = setTimeout(() => {
        setTailorStep("tailoring");
        const nextTimer = setTimeout(() => {
          setTailorStep("done");
        }, 2000);
        return () => clearTimeout(nextTimer);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeFeature, tailorStep]);

  const features: FeatureItem[] = [
    {
      id: "tailor",
      title: "AI Resume Tailoring",
      shortDesc: "Instantly match job descriptions with a single click.",
      badge: "Most Popular",
      icon: Sparkles,
      details: [
        "Re-writes profile summary targeting the specific role",
        "Adapts experience bullet points to match key job requirements",
        "Maintains factual truth while emphasizing relevant achievements",
        "Includes a side-by-side comparison before applying changes"
      ]
    },
    {
      id: "review",
      title: "ATS Review & Scoring",
      shortDesc: "Get a comprehensive analysis of your resume.",
      badge: "Real-time",
      icon: Trophy,
      details: [
        "Checks ATS compatibility score out of 100",
        "Identifies missing keywords from the job description",
        "Highlights matched keywords to see what you got right",
        "Provides actionable feedback for every single section"
      ]
    },
    {
      id: "assistant",
      title: "AI Writing Assistant",
      shortDesc: "Optimize bullet points and generate content.",
      badge: "Co-pilot",
      icon: Bot,
      details: [
        "Paraphrases weak bullet points into action-driven accomplishments",
        "Suggests professional bullet points based on target job titles",
        "Recommends technical & soft skills based on your field",
        "Generates highly compelling profile summaries automatically"
      ]
    },
    {
      id: "templates",
      title: "ATS-Optimized Templates",
      shortDesc: "Switch layouts dynamically and preview in real-time.",
      badge: "Flexible",
      icon: FileText,
      details: [
        "Modern: Clean sans-serif design with subtle accent colors",
        "Classic: Timeless serif styling ideal for traditional industries",
        "Minimal: High density, layout-focused, zero-distraction format",
        "Designed to scan perfectly through recruiter screening software"
      ]
    }
  ];

  return (
    <section id="interactive-demo" className="py-24 bg-slate-50/50 dark:bg-slate-900/30 border-b border-white/5 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Power Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Everything you need to <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-violet-500">land the interview</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Check out the advanced, AI-powered tools designed to customize, score, and perfect your professional profile.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature Buttons & Lists */}
          <div className="lg:col-span-5 space-y-4">
            {features.map((feat) => {
              const Icon = feat.icon;
              const isActive = activeFeature === feat.id;
              
              return (
                <button
                  key={feat.id}
                  onClick={() => {
                    setActiveFeature(feat.id);
                    if (feat.id === "tailor") setTailorStep("idle");
                  }}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    isActive 
                      ? "bg-white dark:bg-zinc-900 border-primary shadow-lg scale-[1.02]" 
                      : "bg-white/50 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900/80 hover:border-slate-300 dark:hover:border-white/10"
                  }`}
                >
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "bg-slate-100 dark:bg-zinc-800 text-muted-foreground"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{feat.title}</span>
                      {feat.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "bg-slate-200/50 dark:bg-zinc-800 text-muted-foreground"
                        }`}>
                          {feat.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-normal">
                      {feat.shortDesc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Live Mockup Showcase */}
          <div className="lg:col-span-7 h-[480px] w-full relative">
            {/* Ambient Background Glow for Preview */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/15 to-violet-500/15 rounded-[2.5rem] blur-3xl" />
            
            {/* Card Frame */}
            <div className="relative h-full w-full rounded-[2.5rem] border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden">
              
              {/* Top decoration tab */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest bg-slate-100 dark:bg-zinc-900 px-3 py-1 rounded-full border border-slate-200/30 dark:border-white/5">
                  Interactive Demo
                </div>
              </div>

              {/* Showcase Screen content */}
              <div className="flex-1 py-6 flex flex-col justify-center min-h-0">
                
                {/* 1. TAILOR FEATURE */}
                {activeFeature === "tailor" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="bg-slate-100/80 dark:bg-zinc-900/80 p-4 rounded-xl border border-slate-200/30 dark:border-white/5">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Target Job Description</span>
                      <p className="text-xs text-muted-foreground line-clamp-2 italic">
                        "Seeking a Frontend Engineer. Must have strong expertise in React, TypeScript, and state management. Experience optimizing performance is highly preferred..."
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Before */}
                      <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                          Original Bullet
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Developed web interfaces and worked with React components to display user data.
                        </p>
                      </div>

                      {/* After */}
                      <div className={`border p-3 rounded-xl transition-all duration-700 ${
                        tailorStep === "done" 
                          ? "bg-emerald-500/10 border-emerald-500/30 scale-[1.02] shadow-md shadow-emerald-500/5" 
                          : tailorStep === "tailoring"
                          ? "bg-violet-500/10 border-violet-500/30 animate-pulse"
                          : "bg-slate-500/5 border-slate-200/30 dark:border-white/5 opacity-50"
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 mb-1 ${
                          tailorStep === "done" ? "text-emerald-500" : "text-violet-500"
                        }`}>
                          {tailorStep === "done" ? <Check className="w-3 h-3" /> : <RefreshCw className="w-3 h-3 animate-spin" />}
                          AI Tailored version
                        </span>
                        <p className="text-xs text-foreground font-medium">
                          {tailorStep === "done" ? (
                            "Engineered responsive UI using React & TypeScript; integrated custom state-management that boosted data loading speeds by 40%."
                          ) : tailorStep === "tailoring" ? (
                            "Analyzing keywords and restructuring bullets..."
                          ) : (
                            "Pending analysis..."
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => setTailorStep("idle")}
                        className="h-8 rounded-lg text-xs gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-run Demo
                      </Button>
                    </div>
                  </div>
                )}

                {/* 2. REVIEW FEATURE */}
                {activeFeature === "review" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-around bg-slate-100/50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-slate-200/30 dark:border-white/5">
                      
                      {/* Radial Score */}
                      <div className="relative size-24 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="40" className="stroke-slate-200 dark:stroke-zinc-800 fill-transparent" strokeWidth="8"/>
                          <circle cx="48" cy="48" r="40" className="stroke-primary fill-transparent" strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * score) / 100}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-black text-foreground">{score}%</span>
                          <span className="text-[8px] text-muted-foreground uppercase tracking-widest">ATS Score</span>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 flex-1 w-full text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold">Matching Keywords:</span>
                          <span className="text-muted-foreground">React, TypeScript, Redux</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold">Missing Keywords:</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">CI/CD</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">PostgreSQL</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold">Structure:</span>
                          <span className="text-muted-foreground">Standard header & spacing verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl text-xs">
                      <span className="font-bold text-indigo-500 block mb-1">AI Critique Suggestion:</span>
                      <p className="text-muted-foreground">
                        "Your experience section needs more quantitative results. Rephrase your React bullet points to specify the concrete outcome (e.g. performance metrics or page load speeds)."
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. ASSISTANT FEATURE */}
                {activeFeature === "assistant" && (
                  <div className="space-y-4 animate-in fade-in duration-500">
                    <div className="bg-slate-100/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-slate-200/30 dark:border-white/5 space-y-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Input Bullet Point</span>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-foreground font-semibold flex-1">
                          "I helped write unit tests for the React frontend."
                        </p>
                        <BadgeIcon variant="violet">Paraphrasing</BadgeIcon>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">AI Suggested Improvements (Select one):</span>
                      
                      {[
                        "Authored 50+ modular React unit tests, boosting test coverage from 60% to 88% and eliminating critical UI regressions.",
                        "Architected an automated testing pipeline in Jest/React Testing Library, reducing validation times by 2 hours per sprint.",
                        "Collaborated with QA to implement strict frontend unit test guidelines, reducing post-release bug reports by 30%."
                      ].map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setParaphraseOption(idx)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-start gap-2 ${
                            paraphraseOption === idx
                              ? "bg-primary/5 border-primary text-foreground font-medium scale-[1.01]"
                              : "bg-white/50 dark:bg-zinc-900/50 border-slate-200/50 dark:border-white/5 text-muted-foreground hover:bg-slate-50 dark:hover:bg-zinc-900"
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            paraphraseOption === idx ? "border-primary bg-primary text-white" : "border-slate-300"
                          }`}>
                            {paraphraseOption === idx && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TEMPLATES FEATURE */}
                {activeFeature === "templates" && (
                  <div className="space-y-4 animate-in fade-in duration-500 h-full flex flex-col justify-between py-2">
                    
                    {/* Style Switcher Bar */}
                    <div className="flex justify-center gap-3 bg-slate-100/80 dark:bg-zinc-900/80 p-1.5 rounded-xl border border-slate-200/40 dark:border-white/5 w-fit mx-auto">
                      {(["modern", "classic", "minimal"] as const).map((style) => (
                        <button
                          key={style}
                          onClick={() => setActiveTemplate(style)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                            activeTemplate === style
                              ? "bg-white dark:bg-zinc-800 text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>

                    {/* Resume Paper Mockup */}
                    <div className={`flex-1 mx-auto w-3/4 max-w-[320px] rounded-xl border p-4 bg-white text-zinc-800 shadow-md transition-all duration-500 flex flex-col justify-between ${
                      activeTemplate === "modern" 
                        ? "font-sans border-primary/20 bg-linear-to-b from-primary/5 to-white" 
                        : activeTemplate === "classic" 
                        ? "font-serif border-slate-300" 
                        : "font-mono border-zinc-200 text-xs p-3"
                    }`}>
                      {/* Mock Header */}
                      <div className={`space-y-1 ${
                        activeTemplate === "modern" ? "text-left border-l-2 border-primary pl-2" : "text-center"
                      }`}>
                        <div className={`h-3 bg-zinc-800 rounded-xs ${
                          activeTemplate === "minimal" ? "w-1/3" : "w-1/2 mx-auto"
                        }`} />
                        <div className={`h-2 bg-zinc-400 rounded-xs w-1/4 ${
                          activeTemplate === "minimal" ? "" : "mx-auto"
                        }`} />
                      </div>

                      {/* Mock Experience */}
                      <div className="space-y-2 mt-4 flex-1">
                        <div className="flex justify-between items-center">
                          <div className="h-2.5 bg-zinc-700 rounded-xs w-1/3" />
                          <div className="h-2 bg-zinc-400 rounded-xs w-1/5" />
                        </div>
                        <div className="space-y-1 pl-2">
                          <div className="h-1.5 bg-zinc-400 rounded-xs w-full" />
                          <div className="h-1.5 bg-zinc-400 rounded-xs w-5/6" />
                        </div>
                      </div>

                      {/* Mock Skills */}
                      <div className="mt-4 pt-2 border-t border-dashed border-zinc-200 flex flex-wrap gap-1">
                        {["React", "TypeScript", "Tailwind"].map((sk, sIdx) => (
                          <span 
                            key={sIdx} 
                            className={`text-[6px] font-bold px-1.5 py-0.5 rounded-sm border ${
                              activeTemplate === "modern" 
                                ? "bg-primary/5 border-primary/10 text-primary" 
                                : activeTemplate === "classic"
                                ? "bg-slate-50 border-slate-300"
                                : "bg-transparent border-dashed border-zinc-400 font-mono"
                            }`}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Bottom Feature Details */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Key Capabilities</span>
                <div className="grid grid-cols-2 gap-2 text-xs text-foreground font-medium">
                  {features.find((f) => f.id === activeFeature)?.details.slice(0, 4).map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic CTA at bottom */}
        <div className="mt-20 text-center">
          <Button asChild size="lg" className="rounded-2xl h-14 px-8 text-md font-semibold gap-2 shadow-lg shadow-primary/20">
            <a href="/create?new=true">
              Try the AI Tools Live
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Small helper badge
function BadgeIcon({ children, variant }: { children: string; variant: "violet" | "emerald" }) {
  return (
    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
      variant === "violet"
        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    }`}>
      {children}
    </span>
  );
}
