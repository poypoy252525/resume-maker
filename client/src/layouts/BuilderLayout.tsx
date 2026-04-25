import type { ReactNode } from "react";
import { Toaster } from "../components/ui/sonner";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Save, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";

interface BuilderLayoutProps {
  children: ReactNode;
}

/**
 * BuilderLayout - Used for the actual Resume Builder Workspace
 * Minimalist, full-screen, focused on productivity
 */
export default function BuilderLayout({ children }: BuilderLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Workspace Header - Minimal and Functional */}
      <header className="h-14 border-b border-white/10 bg-card/30 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 text-muted-foreground"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </Button>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Untitled Resume</span>
            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20 ml-2">
              AI PROTECTED
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-4 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Auto-saved 2m ago
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 h-9 border-white/10"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 h-9 bg-linear-to-r from-primary to-violet-600 hover:opacity-90"
          >
            <Share2 className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative">{children}</main>

      <Toaster />
    </div>
  );
}
