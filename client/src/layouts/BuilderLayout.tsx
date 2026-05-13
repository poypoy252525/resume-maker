import { Toaster } from "../components/ui/sonner";
import { Outlet, Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Save, Share2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useResumeStore } from "../store/useResumeStore";

/**
 * BuilderLayout - Used for the actual Resume Builder Workspace
 * Minimalist, full-screen, focused on productivity
 */
export default function BuilderLayout() {
  const { formData, handleSubmit, loading } = useResumeStore();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Workspace Header - Minimal and Functional */}
      <header className="h-14 border-b bg-card/50 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
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
          <div className="flex items-center gap-2 font-semibold min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs md:text-sm truncate">
              {formData.full_name || "Untitled Resume"}
            </span>
            <Badge variant="secondary" className="ml-1 md:ml-2 h-4 md:h-5 text-[8px] md:text-[10px] font-bold shrink-0">
              AI
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-4 shrink-0 ml-auto">
          <div className="hidden lg:flex items-center gap-2 mr-2 text-[11px] text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Auto-saved 2m ago
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 md:h-9 px-2 md:px-3 gap-1 md:gap-2"
          >
            <Save className="w-4 h-4" />
            <span className="hidden md:inline">Save</span>
          </Button>
          <Button
            size="sm"
            className="h-8 md:h-9 px-3 md:px-4 gap-1 md:gap-2 shadow-sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline text-xs md:text-sm">{loading ? "Exporting..." : "Export"}</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative"><Outlet /></main>

      <Toaster />
    </div>
  );
}
