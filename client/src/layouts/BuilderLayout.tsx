import { Toaster } from "../components/ui/sonner";
import { Outlet, Link } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, Download, FileText, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useResumeStore } from "../store/useResumeStore";
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
  const { formData, handleSubmit, isDownloading } = useResumeStore();

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

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-hidden relative"><Outlet /></main>

      <Toaster />
    </div>
  );
}
