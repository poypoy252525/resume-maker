import { Toaster } from "../components/ui/sonner";
import { Outlet, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, Download, FileText, ChevronDown, Save, Edit2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useResumeStore } from "../store/useResumeStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { calculateResumeScore } from "../lib/score";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

/**
 * BuilderLayout - Used for the actual Resume Builder Workspace
 * Minimalist, full-screen, focused on productivity
 */
export default function BuilderLayout() {
  const {
    handleSubmit,
    isDownloading,
    resumeTitle,
    setResumeTitle,
    saveResume,
    isSaving,
    formData,
    setReviewModalOpen,
  } = useResumeStore();

  const score = calculateResumeScore(formData);

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(resumeTitle);

  useEffect(() => {
    setLocalTitle(resumeTitle);
  }, [resumeTitle]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (localTitle.trim()) {
      setResumeTitle(localTitle.trim());
    } else {
      setLocalTitle(resumeTitle);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.warning("Sign in required", {
        description: "Please sign in or sign up to save your resume for later.",
        action: {
          label: "Sign Up",
          onClick: () => navigate("/signup"),
        },
      });
      return;
    }

    try {
      const savedId = await saveResume();
      if (savedId) {
        toast.success("Resume saved successfully!");
        setSearchParams({ id: savedId });
      } else {
        toast.error("Failed to save resume.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save resume.");
    }
  };

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
            <Link to="/app">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2 font-semibold min-w-0">
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            {isEditingTitle ? (
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSubmit();
                  if (e.key === "Escape") {
                    setIsEditingTitle(false);
                    setLocalTitle(resumeTitle);
                  }
                }}
                className="bg-transparent text-xs md:text-sm font-semibold border-b border-primary outline-hidden px-1 py-0.5 w-32 sm:w-48 max-w-full focus:ring-0"
                autoFocus
              />
            ) : (
              <div 
                className="flex items-center gap-1 cursor-pointer group/title min-w-0"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="text-xs md:text-sm truncate max-w-[120px] sm:max-w-[200px] text-foreground hover:text-primary transition-colors font-semibold">
                  {resumeTitle || "Untitled Resume"}
                </span>
                <Edit2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover/title:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
            <Badge variant="secondary" className="ml-1 md:ml-2 h-4 md:h-5 text-[8px] md:text-[10px] font-bold shrink-0">
              AI
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
          {/* Resume Score Badge (Interactive) */}
          <button
            onClick={() => setReviewModalOpen(true)}
            className="flex items-center gap-2 bg-muted/40 hover:bg-muted/70 active:scale-95 transition-all px-2.5 py-1.5 md:px-3 rounded-xl border text-[10px] md:text-xs font-semibold cursor-pointer group shrink-0"
            title="Click to view full AI review and suggestions"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">Score:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-12 md:w-16 bg-muted-foreground/10 rounded-full h-1 md:h-1.5 overflow-hidden hidden sm:block">
                <div 
                  className={cn(
                    "h-full transition-all duration-500",
                    score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className={cn(
                "font-bold font-mono transition-colors",
                score >= 80 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500"
              )}>
                {score}/100
              </span>
            </div>
          </button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 md:h-9 px-3 md:px-4 gap-1 md:gap-2 shadow-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs md:text-sm font-semibold"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin text-primary" />
            ) : (
              <Save className="w-4.5 h-4.5" />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-8 md:h-9 px-3 md:px-4 gap-1 md:gap-2 shadow-sm"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-xs md:text-sm">
                  {isDownloading ? "Downloading..." : "Download"}
                </span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Download Format
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleSubmit("pdf")}
                className="gap-2 cursor-pointer py-2"
              >
                <div className="bg-red-500/10 p-1 rounded">
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">PDF Document</span>
                  <span className="text-[10px] text-muted-foreground">Best for sharing</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleSubmit("docx")}
                className="gap-2 cursor-pointer py-2"
              >
                <div className="bg-blue-500/10 p-1 rounded">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Word Document</span>
                  <span className="text-[10px] text-muted-foreground">Editable format</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 overflow-hidden relative"><Outlet /></main>

      <Toaster />
    </div>
  );
}
