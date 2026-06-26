import { useEffect, useRef, useState } from "react";
import { Eye, LayoutTemplate } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResumePreview from "@/components/ResumePreview";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BuilderPreviewPanel() {
  const formData = useResumeStore((state) => state.formData);
  const setFormData = useResumeStore((state) => state.setFormData);
  const currentTemplate = formData.template || "modern";
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Standard A4 width at 96 DPI is 794px
        setScale(entry.contentRect.width / 794);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="h-full border-l bg-muted/30 flex flex-col overflow-hidden">
      <header className="h-14 border-b bg-background px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-1">
              Live Preview
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
              A4 Resume Layout
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs font-semibold"
              >
                <LayoutTemplate className="size-3.5" />
                <span>Template: {currentTemplate.charAt(0).toUpperCase() + currentTemplate.slice(1)}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setFormData({ template: "modern" })} className="cursor-pointer">
                Modern
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({ template: "classic" })} className="cursor-pointer">
                Classic
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({ template: "minimal" })} className="cursor-pointer">
                Minimal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest hidden sm:inline">
              Syncing
            </span>
          </div>
        </div>
      </header>
      <ScrollArea className="flex-1 min-h-0 h-full bg-slate-200/50">
        <div className="p-4 sm:p-8 flex justify-center">
          <div
            ref={containerRef}
            className="shadow-2xl rounded-sm bg-white w-full max-w-198.5 aspect-210/297 overflow-hidden relative"
          >
            <div
              className="absolute top-0 left-0"
              style={{
                width: "794px",
                height: "1123px",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <ResumePreview data={formData} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
