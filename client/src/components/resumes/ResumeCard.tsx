import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  Star,
  Edit2,
  Trash2,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime, scoreColor, scoreBar } from "@/lib/utils";
import type { ResumeResponse } from "@/api";
import ResumePreview from "@/components/ResumePreview";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/* ── Thumbnail with auto-scale ── */
export function ResumeThumbnail({ resume }: { resume: ResumeResponse }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // A4 at 96 DPI = 794px wide
        setScale(entry.contentRect.width / 794);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full aspect-[3/3] overflow-hidden relative bg-white rounded-t-xl"
    >
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "794px",
          height: "1123px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumePreview data={resume.data} />
      </div>
      {/* Fade-out at bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}

/* ── Grid Card ── */
export function ResumeCard({
  resume,
  onToggleFavorite,
  onDelete,
}: {
  resume: ResumeResponse;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete?: (id: string) => Promise<void>;
}) {
  const status = resume.status.toLowerCase();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(resume.id);
      toast.success("Resume deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete resume");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group relative rounded-xl border bg-card/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* Preview thumbnail */}
            <Link to={`/create?id=${resume.id}`} className="block">
              <div className="relative">
                <ResumeThumbnail resume={resume} />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-t-xl">
                  <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Edit2 className="size-3.5 text-primary" />
                    <span className="text-sm font-semibold text-primary">Edit Resume</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card footer */}
            <div className="p-3.5 border-t bg-background/80 space-y-2.5 flex-1 flex flex-col">
              {/* Title + Badge row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate leading-tight">{resume.title}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="size-3 shrink-0" />
                    {formatRelativeTime(resume.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Badge
                    variant={status === "completed" ? "default" : "secondary"}
                    className="text-[10px] px-1.5 py-0 shrink-0"
                  >
                    {status === "completed" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Done
                      </span>
                    ) : status === "processing" ? (
                      "Processing"
                    ) : (
                      "Draft"
                    )}
                  </Badge>
                  <button
                    onClick={() => onToggleFavorite(resume.id, resume.is_favorite)}
                    className={`p-1.5 rounded-lg transition-colors hover:bg-muted ${resume.is_favorite
                      ? "text-amber-500"
                      : "text-muted-foreground/40 hover:text-amber-400"
                      }`}
                    aria-label={
                      resume.is_favorite ? "Remove from favorites" : "Add to favorites"
                    }
                  >
                    <Star
                      className={`size-3.5 ${resume.is_favorite ? "fill-amber-500" : ""}`}
                    />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1.5 rounded-lg transition-colors hover:bg-muted text-muted-foreground/60 hover:text-foreground md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                        aria-label="More options"
                      >
                        <MoreVertical className="size-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => navigate(`/create?id=${resume.id}`)}>
                        <Edit2 className="size-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleFavorite(resume.id, resume.is_favorite)}>
                        <Star className={`size-4 mr-2 ${resume.is_favorite ? "fill-amber-500 text-amber-500" : ""}`} />
                        {resume.is_favorite ? "Unfavorite" : "Favorite"}
                      </DropdownMenuItem>
                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Score bar */}
              <div className="flex items-center gap-2 mt-auto">
                <div className="flex-1">
                  <Progress
                    value={resume.score}
                    className={`h-1.5 ${scoreBar(resume.score)}`}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold shrink-0 ${scoreColor(resume.score)}`}
                >
                  {resume.score}/100
                </span>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => navigate(`/create?id=${resume.id}`)}>
            <Edit2 className="size-4 mr-2" />
            Edit Resume
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onToggleFavorite(resume.id, resume.is_favorite)}>
            <Star className={`size-4 mr-2 ${resume.is_favorite ? "fill-amber-500 text-amber-500" : ""}`} />
            {resume.is_favorite ? "Remove Favorite" : "Make Favorite"}
          </ContextMenuItem>
          {onDelete && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete Resume
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{resume.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex sm:justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Skeleton ── */
export function ResumeSkeleton() {
  return (
    <div className="rounded-xl border bg-card/60 overflow-hidden">
      <Skeleton className="w-full aspect-[3/3] rounded-none" />
      <div className="p-3.5 border-t space-y-2.5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-1.5 w-full" />
      </div>
    </div>
  );
}
