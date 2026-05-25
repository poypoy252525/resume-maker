import { useState, useMemo } from "react";
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
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

type SortKey = "updated_at" | "score" | "title";
type TabFilter = "all" | "favorites" | "draft" | "completed";

function ResumeCard({
  resume,
  onToggleFavorite,
}: {
  resume: ResumeResponse;
  onToggleFavorite: (id: string, current: boolean) => void;
}) {
  const status = resume.status.toLowerCase();

  return (
    <Card className="border bg-card/60 hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="shrink-0 size-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <FileText className="size-5 text-primary" />
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
                onClick={() => onToggleFavorite(resume.id, resume.is_favorite)}
                className={`p-1.5 rounded-lg transition-colors hover:bg-muted ${
                  resume.is_favorite ? "text-amber-500" : "text-muted-foreground/40 hover:text-amber-400"
                }`}
                aria-label={resume.is_favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`size-4 ${resume.is_favorite ? "fill-amber-500" : ""}`} />
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
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {formatRelativeTime(resume.updated_at)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResumeSkeleton() {
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
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        if (sortKey === "score") return b.score - a.score;
        return a.title.localeCompare(b.title);
      });
  }, [resumes, search, sortKey]);

  const byTab = (tab: TabFilter) => {
    if (tab === "favorites") return filtered.filter((r) => r.is_favorite);
    if (tab === "draft") return filtered.filter((r) => r.status.toLowerCase() === "draft");
    if (tab === "completed") return filtered.filter((r) => r.status.toLowerCase() === "completed");
    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Resumes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Loading…" : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} in your workspace`}
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

      {/* ── Tabs + List ── */}
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all" id="tab-all">All</TabsTrigger>
          <TabsTrigger value="favorites" id="tab-favorites">
            <Star className="size-3.5 mr-1.5" />Favorites
          </TabsTrigger>
          <TabsTrigger value="draft" id="tab-draft">Draft</TabsTrigger>
          <TabsTrigger value="completed" id="tab-completed">Completed</TabsTrigger>
        </TabsList>

        {(["all", "favorites", "draft", "completed"] as TabFilter[]).map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-3 mt-0">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <ResumeSkeleton key={i} />)
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
              byTab(tab).map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onToggleFavorite={toggleFavorite}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
