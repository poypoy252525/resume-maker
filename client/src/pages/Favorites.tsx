import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Star,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumes } from "@/hooks/useResumes";
import { formatRelativeTime, scoreColor, scoreBar } from "@/lib/utils";
import type { ResumeResponse } from "@/api";
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
import { toast } from "sonner";

function FavoriteCard({
  resume,
  onRemoveFavorite,
  onDelete,
}: {
  resume: ResumeResponse;
  onRemoveFavorite: (id: string, current: boolean) => void;
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
          <Card className="border bg-card/60 hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="shrink-0 size-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <FileText className="size-5 text-amber-500" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm truncate">{resume.title}</p>
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
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex-1">
                      <Progress
                        value={resume.score}
                        className={`h-1.5 ${scoreBar(resume.score)}`}
                      />
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${scoreColor(resume.score)}`}>
                      {resume.score}/100
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRemoveFavorite(resume.id, resume.is_favorite)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-muted text-amber-500"
                      aria-label="Remove from favorites"
                    >
                      <Star className="size-4 fill-amber-500" />
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link to={`/create?id=${resume.id}`}>
                        <Edit2 className="size-3 mr-1" /> Edit
                      </Link>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1.5 rounded-lg transition-colors hover:bg-muted text-muted-foreground/60 hover:text-foreground md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
                          aria-label="More options"
                        >
                          <MoreVertical className="size-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => navigate(`/create?id=${resume.id}`)}>
                          <Edit2 className="size-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRemoveFavorite(resume.id, resume.is_favorite)}>
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
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="size-3" />
                    {formatRelativeTime(resume.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={() => navigate(`/create?id=${resume.id}`)}>
            <Edit2 className="size-4 mr-2" />
            Edit Resume
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onRemoveFavorite(resume.id, resume.is_favorite)}>
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

function FavoriteSkeleton() {
  return (
    <Card className="border bg-card/60">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-11 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-2 w-full" />
          </div>
          <Skeleton className="h-8 w-16 shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Favorites() {
  const { resumes, isLoading, toggleFavorite, deleteResume } = useResumes();

  const favorites = useMemo(
    () => resumes.filter((r) => r.is_favorite),
    [resumes]
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Star className="size-6 text-amber-500 fill-amber-500" />
            Favorites
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading…"
              : `${favorites.length} starred resume${favorites.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link to="/create">
            <Plus className="size-4" /> New Resume
          </Link>
        </Button>
      </div>

      {/* ── List ── */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <FavoriteSkeleton key={i} />)
        ) : favorites.length === 0 ? (
          <div className="text-center p-14 border border-dashed rounded-xl flex flex-col items-center justify-center bg-card/20">
            <Star className="size-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No favorites yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-xs">
              Star any resume from the{" "}
              <Link to="/app/resumes" className="underline underline-offset-2 text-primary">
                My Resumes
              </Link>{" "}
              page to save it here for quick access.
            </p>
          </div>
        ) : (
          favorites.map((resume) => (
            <FavoriteCard
              key={resume.id}
              resume={resume}
              onRemoveFavorite={toggleFavorite}
              onDelete={deleteResume}
            />
          ))
        )}
      </div>
    </div>
  );
}

