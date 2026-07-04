import { useCallback, useEffect, useRef, useState } from "react";

// The server encodes SITE_URL into the media URL. In dev that's localhost:5173,
// but the file is actually served by Django on the API host. We rewrite the
// origin so the browser fetches the PDF directly from the Django server.
const API_BASE = import.meta.env.VITE_API_BASE_URL as string;
import {
  Eye,
  LayoutTemplate,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText,
  Monitor,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResumePreview from "@/components/ResumePreview";
import PdfViewer from "@/components/builder/PdfViewer";
import { useResumeStore } from "@/store/useResumeStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PreviewTab = "web" | "pdf";

export default function BuilderPreviewPanel() {
  const formData = useResumeStore((state) => state.formData);
  const setFormData = useResumeStore((state) => state.setFormData);

  // PDF Preview store state
  const pdfPreviewUrl = useResumeStore((state) => state.pdfPreviewUrl);
  const isCompilingPdf = useResumeStore((state) => state.isCompilingPdf);
  const compileError = useResumeStore((state) => state.compileError);
  const compilePdf = useResumeStore((state) => state.compilePdf);

  const [activeTab, setActiveTab] = useState<PreviewTab>("pdf");
  // Track what data snapshot was last compiled so we only re-compile on real changes
  const lastCompiledRef = useRef<string>("");

  const currentTemplate = formData.template || "modern";

  // Scaled A4 web-view helpers
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      // Standard A4 width at 96 DPI is 794 px
      setScale(entry.contentRect.width / 794);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Trigger compilation ─────────────────────────────────────────────────────
  const triggerCompile = useCallback(async () => {
    const snapshot = JSON.stringify(formData);
    if (snapshot === lastCompiledRef.current || isCompilingPdf) return;
    lastCompiledRef.current = snapshot;
    await compilePdf();
    // bump seed so the blob fetcher re-fetches even when the URL filename is the same
    setCompileSeed((n) => n + 1);
  }, [formData, isCompilingPdf, compilePdf]);

  // Debounce: re-compile 1.5 s after the user stops editing (only in PDF tab)
  useEffect(() => {
    if (activeTab !== "pdf") return;
    const snapshot = JSON.stringify(formData);
    if (snapshot === lastCompiledRef.current) return;

    const t = setTimeout(triggerCompile, 1500);
    return () => clearTimeout(t);
  }, [formData, activeTab, triggerCompile]);

  // Compile immediately when the user switches to PDF tab (if stale)
  useEffect(() => {
    if (activeTab !== "pdf") return;
    const snapshot = JSON.stringify(formData);
    if (snapshot !== lastCompiledRef.current) {
      triggerCompile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── Blob URL for iframe ───────────────────────────────────────────────────
  // Fetch the PDF from Django and convert to a blob:// URL so the iframe
  // loads it same-origin. This completely bypasses X-Frame-Options restrictions.
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isFetchingBlob, setIsFetchingBlob] = useState(false);
  // Bumped by triggerCompile after each successful compilation to force re-fetch
  const [compileSeed, setCompileSeed] = useState(0);

  useEffect(() => {
    if (!pdfPreviewUrl) {
      setBlobUrl(null);
      return;
    }

    // Rewrite origin from SITE_URL (localhost:5173) → API_BASE (localhost:8000)
    let fetchUrl = pdfPreviewUrl;
    try {
      const parsed = new URL(pdfPreviewUrl);
      const apiParsed = new URL(API_BASE);
      parsed.hostname = apiParsed.hostname;
      parsed.port = apiParsed.port;
      parsed.protocol = apiParsed.protocol;
      fetchUrl = parsed.toString();
    } catch {
      // fall back to original URL
    }

    let revoked = false;
    let currentObjectUrl: string | null = null;

    setIsFetchingBlob(true);
    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (revoked) return;
        const objectUrl = URL.createObjectURL(blob);
        currentObjectUrl = objectUrl;
        setBlobUrl(objectUrl);
      })
      .catch((err) => {
        if (!revoked) console.error("Failed to load PDF blob:", err);
      })
      .finally(() => {
        if (!revoked) setIsFetchingBlob(false);
      });

    return () => {
      revoked = true;
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    };
    // compileSeed triggers re-fetch when a new compilation finishes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfPreviewUrl, compileSeed]);

  return (
    <aside className="h-full lg:border-l bg-muted/30 flex flex-col overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="h-14 border-b bg-background px-4 flex items-center justify-between shrink-0 shadow-sm z-10 gap-2">
        {/* Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-0.5">Live Preview</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
              A4 Resume Layout
            </p>
          </div>
        </div>

        {/* Segmented tab switcher */}
        <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border/50 shrink-0">
          <button
            onClick={() => setActiveTab("web")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200",
              activeTab === "web"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="w-3 h-3" />
            Web
          </button>
          <button
            onClick={() => setActiveTab("pdf")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200",
              activeTab === "pdf"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-3 h-3" />
            PDF
            {activeTab === "pdf" && isCompilingPdf && (
              <Loader2 className="w-2.5 h-2.5 animate-spin ml-0.5" />
            )}
          </button>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs font-semibold"
              >
                <LayoutTemplate className="size-3.5" />
                <span className="hidden sm:inline">
                  {currentTemplate.charAt(0).toUpperCase() + currentTemplate.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {(["modern", "classic", "minimal"] as const).map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => setFormData({ template: t })}
                  className="cursor-pointer capitalize"
                >
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status dot */}
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isCompilingPdf
                  ? "bg-amber-500 animate-pulse"
                  : "bg-emerald-500 animate-pulse"
              )}
            />
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest hidden sm:inline",
                isCompilingPdf ? "text-amber-600" : "text-emerald-600"
              )}
            >
              {isCompilingPdf ? "Compiling" : "Syncing"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {activeTab === "web" ? (
        /* ── WEB VIEW: scaled A4 box ──────────────────────────────────────── */
        <ScrollArea className="flex-1 min-h-0 bg-slate-200/50">
          <div className="p-4 sm:p-8 flex justify-center">
            <div
              ref={containerRef}
              className="shadow-2xl rounded-sm bg-white w-full max-w-[794px] aspect-[210/297] overflow-hidden relative"
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
      ) : (
        /* ── PDF VIEW: full-panel iframe ──────────────────────────────────── */
        <div className="flex-1 min-h-0 relative bg-slate-100">
          {/* Initial compile or blob-fetch spinner (no PDF blob yet) */}
          {(isCompilingPdf || isFetchingBlob) && !blobUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-20 gap-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <FileText className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold">
                  {isCompilingPdf ? "Compiling PDF…" : "Loading preview…"}
                </p>
                <p className="text-xs text-muted-foreground">
                  This may take a few seconds
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {compileError && !isCompilingPdf && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 z-20 p-6 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Compilation Failed</h4>
                <p className="text-xs text-muted-foreground max-w-xs">{compileError}</p>
              </div>
              <Button size="sm" onClick={triggerCompile} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </Button>
            </div>
          )}

          {/* Recompile badge over existing PDF */}
          {blobUrl && (isCompilingPdf || isFetchingBlob) && (
            <div className="absolute top-3 right-3 z-30 bg-background/90 border border-primary/20 backdrop-blur-sm shadow-lg px-3 py-1.5 rounded-full flex items-center gap-2 text-[11px] font-semibold">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span className="text-primary">
                {isCompilingPdf ? "Recompiling…" : "Updating…"}
              </span>
            </div>
          )}

          {/* Custom PDF.js canvas viewer */}
          {blobUrl ? (
            <div className="absolute inset-0 flex flex-col">
              <PdfViewer blobUrl={blobUrl} isLoading={isFetchingBlob} />
            </div>
          ) : (
            !isCompilingPdf && !isFetchingBlob && !compileError && (
              /* First-load prompt */
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">No PDF compiled yet</h4>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Click below to generate an exact PDF preview of your resume
                  </p>
                </div>
                <Button size="sm" onClick={triggerCompile} className="gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Compile PDF
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </aside>
  );
}
