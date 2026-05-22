import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useResumeStore } from "@/store/useResumeStore";
import BuilderFormPanel from "@/components/builder/BuilderFormPanel";
import BuilderPreviewPanel from "@/components/builder/BuilderPreviewPanel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AIReviewModal from "@/components/builder/AIReviewModal";

export default function Builder() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  
  const {
    error,
    resumeId,
    loadResume,
    handleReset,
    loading,
  } = useResumeStore();

  useEffect(() => {
    if (id) {
      if (id !== resumeId) {
        loadResume(id);
      }
    } else {
      if (resumeId !== null) {
        handleReset();
      }
    }
  }, [id, resumeId, loadResume, handleReset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col bg-background">
      <AIReviewModal />
      {isDesktop ? (
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize={50} minSize={30}>
            <BuilderFormPanel />
          </ResizablePanel>
          
          <ResizableHandle withHandle className="w-1 bg-muted hover:bg-primary/20 transition-colors" />
          
          <ResizablePanel defaultSize={50} minSize={30}>
            <BuilderPreviewPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <BuilderFormPanel />
          
          {/* Mobile Preview Toggle */}
          <Sheet open={showPreviewMobile} onOpenChange={setShowPreviewMobile}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 size-14 rounded-full shadow-2xl shadow-primary/40 z-50 animate-in zoom-in-50 duration-300 bg-primary text-primary-foreground"
              >
                <Eye className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-3xl border-t-2 border-primary/20">
              <div className="h-full pt-4">
                <BuilderPreviewPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
}
