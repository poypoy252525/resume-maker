import { Link } from "react-router-dom";
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
} from "lucide-react";
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

/* ─── Mock data (replace with real API calls later) ─── */
const mockResumes = [
  {
    id: "1",
    title: "Software Engineer – Google",
    updatedAt: "2 hours ago",
    score: 87,
    status: "complete",
  },
  {
    id: "2",
    title: "Product Manager – Meta",
    updatedAt: "Yesterday",
    score: 74,
    status: "draft",
  },
  {
    id: "3",
    title: "Full-Stack Developer – Startup",
    updatedAt: "3 days ago",
    score: 91,
    status: "complete",
  },
];

const mockActivity = [
  {
    icon: Brain,
    label: "AI Review completed",
    sub: "Software Engineer resume scored 87/100",
    time: "2h ago",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: Download,
    label: "Resume downloaded",
    sub: "Full-Stack Developer — PDF",
    time: "Yesterday",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Sparkles,
    label: "New resume created",
    sub: "Product Manager – Meta",
    time: "2 days ago",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const tips = [
  "Tailor your resume keywords to each job description for 3× more callbacks.",
  'Use strong action verbs like "Led," "Reduced," or "Launched" in bullet points.',
  "Keep your resume to 1 page if you have less than 10 years of experience.",
  "Quantify achievements — numbers make you stand out instantly.",
];

const scoreColor = (score: number) =>
  score >= 85
    ? "text-emerald-500"
    : score >= 70
      ? "text-amber-500"
      : "text-rose-500";

const scoreBar = (score: number) =>
  score >= 85
    ? "[&>div]:bg-emerald-500"
    : score >= 70
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-rose-500";

export default function Dashboard() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const tip = tips[new Date().getDay() % tips.length];

  return (
    <div className="space-y-8">
      {/* ── Welcome Hero ── */}
      <section className="relative rounded-2xl overflow-hidden border bg-gradient-to-br from-primary/5 via-background to-violet-500/5 p-6 md:p-8">
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
                {mockResumes.length} resumes
              </span>{" "}
              in your workspace. Ready to land that next role?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/create">
                <Plus className="size-4" />
                New Resume
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/dashboard/resumes">
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
            value: "3",
            sub: "+1 this week",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Avg. AI Score",
            value: "84",
            sub: "↑ 6 pts from last",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Downloads",
            value: "12",
            sub: "All time",
            icon: Download,
            color: "text-violet-500",
            bg: "bg-violet-500/10",
          },
          {
            label: "AI Reviews",
            value: "5",
            sub: "Last 30 days",
            icon: Brain,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border bg-card/60 backdrop-blur-sm hover:shadow-md transition-shadow">
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
            <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
              <Link to="/dashboard/resumes">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {mockResumes.map((resume) => (
              <Card
                key={resume.id}
                className="border bg-card/60 hover:shadow-md transition-all duration-200 group cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="size-5 text-primary" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate text-sm">{resume.title}</p>
                        <Badge
                          variant={resume.status === "complete" ? "default" : "secondary"}
                          className="text-[10px] px-1.5 py-0"
                        >
                          {resume.status === "complete" ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="size-3" /> Done
                            </span>
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
                        <span className={`text-xs font-bold ${scoreColor(resume.score)}`}>
                          {resume.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" /> {resume.updatedAt}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="mt-1 h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Link to={`/create`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                  to: "/create",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  icon: Zap,
                  label: "AI Resume Review",
                  to: "/create",
                  color: "text-violet-500",
                  bg: "bg-violet-500/10",
                },
                {
                  icon: Star,
                  label: "View favorites",
                  to: "/dashboard/favorites",
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
              <CardDescription className="text-xs">Your last actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActivity.map((act) => (
                <div key={act.label} className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${act.bg}`}>
                    <act.icon className={`size-3.5 ${act.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{act.label}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{act.sub}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">
                    {act.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pro Tip */}
          <Card className="border bg-gradient-to-br from-primary/5 to-violet-500/5 border-primary/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
