import { Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResumePreview from "@/components/ResumePreview";
import { useResumeStore } from "@/store/useResumeStore";

export default function BuilderPreviewPanel() {
  const formData = useResumeStore((state) => state.formData);

  return (
    <aside className="h-full border-l bg-muted/30 flex flex-col overflow-hidden">
      <header className="h-14 border-b bg-background px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-1">Live Preview</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
              A4 Resume Layout
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
            Syncing
          </span>
        </div>
      </header>
      <ScrollArea className="flex-1 bg-slate-200/50">
        <div className="p-8 flex justify-center">
          <div className="shadow-2xl rounded-sm bg-white min-h-[297mm] w-full max-w-[210mm]">
            <ResumePreview data={formData} />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
