import { Toaster } from "../components/ui/sonner";
import { Outlet, Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Save, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

/**
 * BuilderLayout - Used for the actual Resume Builder Workspace
 * Minimalist, full-screen, focused on productivity
 */
export default function BuilderLayout() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Workspace Header - Minimal and Functional */}
      <header className="h-14 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-4 z-50">
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
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm">Untitled Resume</span>
            <Badge variant="secondary" className="ml-2 h-5 text-[10px] font-bold">
              AI PROTECTED
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-2 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Auto-saved 2m ago
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            size="sm"
            className="gap-2 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative"><Outlet /></main>

      <Toaster />
    </div>
  );
}
