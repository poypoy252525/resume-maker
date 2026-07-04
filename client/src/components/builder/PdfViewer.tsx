import { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Use the local worker bundled with pdfjs-dist so no CDN is required
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  blobUrl: string | null;
  isLoading?: boolean;
}

export default function PdfViewer({ blobUrl, isLoading }: PdfViewerProps) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [isRendering, setIsRendering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Set scale based on container width to fit the page
  const fitToWidth = useCallback(async () => {
    if (!pdf || !containerRef.current) return;
    try {
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current.clientWidth;
      
      // Subtracting 48px to account for container padding (p-6 = 24px each side)
      const padding = 48;
      const targetWidth = Math.max(100, containerWidth - padding);
      const newScale = targetWidth / viewport.width;
      
      // Cap scale between 0.4 and 2.0
      setScale(Math.max(0.4, Math.min(2.0, +newScale.toFixed(2))));
    } catch (err) {
      console.error("Error auto-fitting PDF scale:", err);
    }
  }, [pdf, currentPage]);

  // Auto-fit scale on load or container resize
  useEffect(() => {
    if (!pdf) return;
    
    // Initial fit
    fitToWidth();
    
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver(() => {
      fitToWidth();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [pdf, fitToWidth]);

  // Load PDF whenever blobUrl changes
  useEffect(() => {
    if (!blobUrl) {
      setPdf(null);
      setNumPages(0);
      setCurrentPage(1);
      setLoadError(null);
      return;
    }

    setLoadError(null);
    let cancelled = false;

    pdfjsLib
      .getDocument({ url: blobUrl })
      .promise.then((doc) => {
        if (cancelled) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("PDF.js load error:", err);
          setLoadError("Failed to load PDF.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [blobUrl]);

  // Render the current page whenever pdf, page, or scale changes
  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current) return;

    // Cancel any in-flight render
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    setIsRendering(true);

    try {
      const page = await pdf.getPage(currentPage);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Set physical pixel size for sharp rendering on HiDPI screens
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * devicePixelRatio);
      canvas.height = Math.floor(viewport.height * devicePixelRatio);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const task = page.render({ canvasContext: context, viewport, canvas });
      renderTaskRef.current = task;

      await task.promise;
    } catch (err: unknown) {
      if ((err as { name?: string }).name !== "RenderingCancelledException") {
        console.error("Render error:", err);
      }
    } finally {
      setIsRendering(false);
    }
  }, [pdf, currentPage, scale]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNext = () => setCurrentPage((p) => Math.min(numPages, p + 1));
  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.2).toFixed(1)));
  const zoomOut = () => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(1)));
  const resetZoom = () => fitToWidth();

  if (isLoading && !blobUrl) return null; // parent handles spinner

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-destructive">
        {loadError}
      </div>
    );
  }

  if (!blobUrl || !pdf) return null;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b bg-background/80 backdrop-blur-sm z-10">
        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToPrev}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs font-medium tabular-nums px-1">
            {currentPage} / {numPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={goToNext}
            disabled={currentPage >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomOut}
            disabled={scale <= 0.4}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={resetZoom}
            className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded hover:bg-muted transition-colors min-w-[48px] text-center"
          >
            {Math.round(scale * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={zoomIn}
            disabled={scale >= 3}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 ml-1"
            onClick={resetZoom}
            title="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Canvas area ──────────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 overflow-auto flex justify-center bg-slate-200/60 p-6"
      >
        <div className="relative">
          <canvas
            ref={canvasRef}
            className={cn(
              "shadow-2xl rounded-sm transition-opacity duration-200",
              isRendering ? "opacity-60" : "opacity-100"
            )}
          />
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
