import { ResumeCard, ResumeSkeleton } from "@/components/resumes/ResumeCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumes } from "@/hooks/useResumes";
import {
  ArrowUpDown,
  FileText,
  Plus,
  Search,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type SortKey = "updated_at" | "score" | "title";
type TabFilter = "all" | "favorites" | "draft" | "completed";

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
