import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type ResumeTemplateId = "modern" | "classic" | "minimal";

interface TemplatePickerProps {
  onSelect: (template: ResumeTemplateId) => void;
}

export default function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const templates = [
    {
      id: "modern" as const,
      title: "Modern",
      description: "Clean sans-serif typography, header borders, and blue accents. Best for tech, startup, and design roles.",
      preview: (
        <div className="w-full aspect-210/297 bg-slate-100 rounded-lg p-3 flex flex-col space-y-3 h-48 overflow-hidden select-none border border-slate-200">
          <div className="space-y-1 text-left">
            <div className="h-3 w-1/2 bg-slate-800 rounded-xs" />
            <div className="h-1.5 w-1/3 bg-primary/50 rounded-xs" />
            <div className="h-1.5 w-1/4 bg-slate-450 rounded-xs" />
          </div>
          <div className="border-b border-slate-300 pb-0.5">
            <div className="h-2 w-1/4 bg-slate-500 rounded-xs" />
          </div>
          <div className="space-y-1.5 flex-1 pt-0.5">
            <div className="flex justify-between items-center">
              <div className="h-2.5 w-1/3 bg-slate-700 rounded-xs" />
              <div className="h-1.5 w-1/5 bg-slate-400 rounded-xs" />
            </div>
            <div className="space-y-1 pl-2">
              <div className="h-1 w-5/6 bg-slate-350 rounded-xs" />
              <div className="h-1 w-3/4 bg-slate-350 rounded-xs" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "classic" as const,
      title: "Classic",
      description: "Traditional centered serif design with bullet spacing. Perfect for corporate, finance, law, or academic roles.",
      preview: (
        <div className="w-full aspect-210/297 bg-slate-100 rounded-lg p-3 flex flex-col space-y-3 h-48 overflow-hidden select-none border border-slate-200">
          <div className="space-y-1 text-center flex flex-col items-center">
            <div className="h-3 w-1/2 bg-slate-800 rounded-xs" />
            <div className="h-1.5 w-3/5 bg-slate-450 rounded-xs" />
          </div>
          <div className="flex flex-col items-center border-none">
            <div className="h-2 w-1/4 bg-slate-500 rounded-xs" />
          </div>
          <div className="space-y-1.5 flex-1 pt-0.5">
            <div className="flex justify-between items-center">
              <div className="h-2.5 w-1/3 bg-slate-700 rounded-xs" />
              <div className="h-1.5 w-1/5 bg-slate-400 rounded-xs" />
            </div>
            <div className="space-y-1 pl-2 font-serif">
              <div className="h-1 w-5/6 bg-slate-350 rounded-xs" />
              <div className="h-1 w-3/4 bg-slate-350 rounded-xs" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: "minimal" as const,
      title: "Minimal",
      description: "High-density clean layouts with tight margins and small font scaling. Great for detailed multi-year histories.",
      preview: (
        <div className="w-full aspect-210/297 bg-slate-100 rounded-lg p-3 flex flex-col space-y-2 h-48 overflow-hidden select-none border border-slate-200">
          <div className="space-y-1 text-left">
            <div className="h-2.5 w-2/5 bg-slate-800 rounded-xs" />
            <div className="h-1.5 w-2/3 bg-slate-450 rounded-xs" />
          </div>
          <div>
            <div className="h-1.5 w-1/5 bg-slate-500 rounded-xs" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex justify-between items-center">
              <div className="h-2 w-1/3 bg-slate-700 rounded-xs" />
              <div className="h-1.5 w-1/5 bg-slate-400 rounded-xs" />
            </div>
            <div className="space-y-0.5 pl-2">
              <div className="h-1 w-5/6 bg-slate-350 rounded-xs" />
              <div className="h-1 w-2/3 bg-slate-350 rounded-xs" />
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <div className="h-2 w-1/3 bg-slate-700 rounded-xs" />
              <div className="h-1.5 w-1/5 bg-slate-400 rounded-xs" />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center items-center p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-4xl w-full space-y-8 md:space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Step 1: Choose Design</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose a Starting Template
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
            Select a resume style to structure your professional achievements. You can switch templates at any time with a single click.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className="group relative text-left bg-card hover:bg-card/85 p-5 rounded-2xl border border-border/80 hover:border-primary/55 shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col space-y-4 outline-hidden cursor-pointer"
            >
              {/* Visual Preview */}
              {t.preview}

              <div className="space-y-1 flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {t.title}
                  <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Exit option */}
        <div className="flex justify-center pt-4">
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
            <Link to="/app">
              <ArrowLeft className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
