import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Star,
  Clock,
  CheckCircle2,
  ArrowUpDown,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useResumes } from "@/hooks/useResumes";
import { formatRelativeTime, scoreColor, scoreBar } from "@/lib/utils";
import type { ResumeResponse } from "@/api";
import ResumePreview from "@/components/ResumePreview";

type SortKey = "updated_at" | "score" | "title";
type TabFilter = "all" | "favorites" | "draft" | "completed";

/* ── Thumbnail with auto-scale ── */
function ResumeThumbnail({ resume }: { resume: ResumeResponse }) {
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
      className="w-full aspect-[4/3] overflow-hidden relative bg-white rounded-t-xl"
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
function ResumeCard({
  resume,
  onToggleFavorite,
}: {
  resume: ResumeResponse;
  onToggleFavorite: (id: string, current: boolean) => void;
}) {
  const status = resume.status.toLowerCase();

  return (
    <div className="group relative rounded-xl border bg-card/60 hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col">
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
              className={`p-1.5 rounded-lg transition-colors hover:bg-muted ${
                resume.is_favorite
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
  );
}

/* ── Skeleton ── */
function ResumeSkeleton() {
  return (
    <div className="rounded-xl border bg-card/60 overflow-hidden">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
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

export default function Resumes() {
  const { resumes, isLoading, toggleFavorite } = useResumes();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");

  const sortLabel: Record<SortKey, string> = {
    updated_at: "Last Modified",
    score: "Score",
    title: "Title",
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return resumes
      .filter((r) => r.title.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortKey === "updated_at")
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        if (sortKey === "score") return b.score - a.score;
        return a.title.localeCompare(b.title);
      });
  }, [resumes, search, sortKey]);

  const byTab = (tab: TabFilter) => {
    if (tab === "favorites") return filtered.filter((r) => r.is_favorite);
    if (tab === "draft")
      return filtered.filter((r) => r.status.toLowerCase() === "draft");
    if (tab === "completed")
      return filtered.filter((r) => r.status.toLowerCase() === "completed");
    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading…"
              : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} in your workspace`}
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <Link to="/create">
            <Plus className="size-4" /> New Resume
          </Link>
        </Button>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="resume-search"
            placeholder="Search resumes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 shrink-0">
              <ArrowUpDown className="size-3.5" />
              Sort: {sortLabel[sortKey]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(sortLabel) as SortKey[]).map((key) => (
              <DropdownMenuItem
                key={key}
                onClick={() => setSortKey(key)}
                className={sortKey === key ? "font-semibold" : ""}
              >
                {sortLabel[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Tabs + Grid ── */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" id="tab-all">
            All
          </TabsTrigger>
          <TabsTrigger value="favorites" id="tab-favorites">
            <Star className="size-3.5 mr-1.5" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="draft" id="tab-draft">
            Draft
          </TabsTrigger>
          <TabsTrigger value="completed" id="tab-completed">
            Completed
          </TabsTrigger>
        </TabsList>

        {(["all", "favorites", "draft", "completed"] as TabFilter[]).map(
          (tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ResumeSkeleton key={i} />
                  ))}
                </div>
              ) : byTab(tab).length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-xl flex flex-col items-center justify-center bg-card/20">
                  <FileText className="size-10 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">
                    {tab === "favorites"
                      ? "No favorites yet"
                      : search
                        ? "No resumes match your search"
                        : `No ${tab === "all" ? "" : tab} resumes`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    {tab === "favorites"
                      ? "Star a resume to save it here for quick access."
                      : "Create your first resume to get started!"}
                  </p>
                  {tab !== "favorites" && (
                    <Button asChild size="sm">
                      <Link to="/create" className="gap-2">
                        <Plus className="size-4" /> Create Resume
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {byTab(tab).map((resume) => (
                    <ResumeCard
                      key={resume.id}
                      resume={resume}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          )
        )}
      </Tabs>
    </div>
  );
}
