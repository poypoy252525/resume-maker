import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Star,
  Download,
  Brain,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";
import { formatRelativeTime, getActivityDetails, scoreColor, scoreBar } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchResumes, fetchActivities, deleteResume, toggleFavoriteResume } from "@/api";
import type { ResumeResponse, ActivityResponse } from "@/api";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";


const tips = [
  "Tailor your resume keywords to each job description for 3× more callbacks.",
  'Use strong action verbs like "Led," "Reduced," or "Launched" in bullet points.',
  "Keep your resume to 1 page if you have less than 10 years of experience.",
  "Quantify achievements — numbers make you stand out instantly.",
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedResume, setSelectedResume] = useState<ResumeResponse | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (resume: ResumeResponse) => {
    setSelectedResume(resume);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedResume) return;
    setIsDeleting(true);
    try {
      await deleteResume(selectedResume.id);
      setResumes((prev) => prev.filter((r) => r.id !== selectedResume.id));
      toast.success("Resume deleted successfully");
      setShowDeleteDialog(false);
      const activitiesData = await fetchActivities();
      setActivities(activitiesData);
    } catch (error) {
      toast.error("Failed to delete resume");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setSelectedResume(null);
    }
  };

  const handleToggleFavorite = async (resume: ResumeResponse) => {
    setResumes((prev) =>
      prev.map((r) => (r.id === resume.id ? { ...r, is_favorite: !resume.is_favorite } : r))
    );
    try {
      await toggleFavoriteResume(resume.id, !resume.is_favorite);
      toast.success(resume.is_favorite ? "Removed from favorites" : "Added to favorites");
    } catch {
      setResumes((prev) =>
        prev.map((r) => (r.id === resume.id ? { ...r, is_favorite: resume.is_favorite } : r))
      );
      toast.error("Failed to update favorite status");
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [resumesData, activitiesData] = await Promise.all([
          fetchResumes(),
          fetchActivities(),
        ]);
        setResumes(resumesData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const totalResumes = resumes.length;
  const avgScore = resumes.length > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + (r.score || 0), 0) / resumes.length) 
    : 0;
  const downloadsCount = activities.filter(a => a.activity_type === 'download').length;
  const aiReviewsCount = activities.filter(a => a.activity_type === 'ai_review').length;

  const tip = tips[new Date().getDay() % tips.length];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Welcome Hero ── */}
      <section className="relative rounded-2xl overflow-hidden border bg-linear-to-br from-primary/5 via-background to-violet-500/5 p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 rounded-full bg-primary/8 blur-[100px]" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 rounded-full bg-violet-500/6 blur-[100px]" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Hey, {firstName}!
            </h1>
            <p className="mt-2 text-muted-foreground max-w-md">
              You have{" "}
              <span className="font-semibold text-foreground">
                {totalResumes} {totalResumes === 1 ? 'resume' : 'resumes'}
              </span>{" "}
              in your workspace. Ready to land that next role?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/create?new=true">
                <Plus className="size-4" />
                New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/app/resumes">
                <FileText className="size-4" />
                View All
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Resumes",
            value: totalResumes.toString(),
            sub: "In your workspace",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Avg. AI Score",
            value: avgScore > 0 ? avgScore.toString() : "N/A",
            sub: avgScore > 0 ? "Targeting 85+ for callbacks" : "No score yet",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Downloads",
            value: downloadsCount.toString(),
            sub: "All time",
            icon: Download,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
          {
            label: "AI Reviews",
            value: aiReviewsCount.toString(),
            sub: "All time",
            icon: Brain,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.sub}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* ── Main Grid ── */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Recent Resumes — 2/3 width */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Resumes</h2>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 text-muted-foreground"
            >
              <Link to="/app/resumes">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {resumes.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-xl flex flex-col items-center justify-center bg-card/20">
                <FileText className="size-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No resumes found</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Create your first resume to get started!
                </p>
                <Button asChild size="sm">
                  <Link to="/create?new=true" className="gap-2">
                    <Plus className="size-4" /> Create Resume
                  </Link>
                </Button>
              </div>
            ) : (
              resumes.slice(0, 5).map((resume) => (
                <ContextMenu key={resume.id}>
                  <ContextMenuTrigger asChild>
                    <Card
                      className="border bg-card/60 hover:shadow-md transition-all duration-200 group cursor-pointer"
                      onClick={() => navigate(`/create?id=${resume.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="size-5 text-primary" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold truncate text-sm">
                                {resume.title}
                              </p>
                              <Badge
                                variant={
                                  resume.status.toLowerCase() === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-[10px] px-1.5 py-0"
                              >
                                {resume.status.toLowerCase() === "completed" ? (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3" /> Done
                                  </span>
                                ) : resume.status.toLowerCase() === "processing" ? (
                                  "Processing"
                                ) : (
                                  "Draft"
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex-1">
                                <Progress
                                  value={resume.score}
                                  className={`h-1.5 ${scoreBar(resume.score)}`}
                                />
                              </div>
                              <span
                                className={`text-xs font-bold ${scoreColor(resume.score)}`}
                              >
                                {resume.score}/100
                              </span>
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="shrink-0 text-right" onClick={(e) => e.stopPropagation()}>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3" /> {formatRelativeTime(resume.updated_at)}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="mt-1 h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Link to={`/create?id=${resume.id}`}>Edit</Link>
                            </Button>
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
                    <ContextMenuItem onClick={() => handleToggleFavorite(resume)}>
                      <Star className={`size-4 mr-2 ${resume.is_favorite ? "fill-amber-500 text-amber-500" : ""}`} />
                      {resume.is_favorite ? "Remove Favorite" : "Make Favorite"}
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => handleDeleteClick(resume)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete Resume
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="border bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  icon: Plus,
                  label: "Create new resume",
                  to: "/create?new=true",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  icon: Zap,
                  label: "AI Resume Review",
                  to: "/create?new=true",
                  color: "text-violet-500",
                  bg: "bg-violet-500/10",
                },
                {
                  icon: Star,
                  label: "View favorites",
                  to: "/app/favorites",
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-colors group"
                >
                  <div className={`p-2 rounded-lg ${action.bg}`}>
                    <action.icon className={`size-4 ${action.color}`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowRight className="size-3.5 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border bg-card/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription className="text-xs">
                Your last actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No recent activities
                </div>
              ) : (
                activities.slice(0, 5).map((act) => {
                  const details = getActivityDetails(act.activity_type);
                  const IconComponent = details.icon;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${details.bg}`}>
                        <IconComponent className={`size-3.5 ${details.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{act.label}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {act.sub}
                        </p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatRelativeTime(act.created_at)}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Pro Tip */}
          <Card className="border bg-linear-to-br from-primary/5 to-violet-500/5 border-primary/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tip}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Resume</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedResume?.title}"? This action cannot be undone.
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
    </div>
  );
}
