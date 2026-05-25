import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useActivities } from "@/hooks/useActivities";
import { formatRelativeTime, getActivityDetails } from "@/lib/utils";
import type { ActivityResponse } from "@/api";
import { History } from "lucide-react";

type ActivityTab = "all" | "create" | "download" | "ai_review";

const TAB_LABELS: Record<ActivityTab, string> = {
  all: "All",
  create: "Created",
  download: "Downloads",
  ai_review: "AI Reviews",
};

function ActivityItem({ act }: { act: ActivityResponse }) {
  const details = getActivityDetails(act.activity_type);
  const Icon = details.icon;

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${details.bg}`}>
        <Icon className={`size-3.5 ${details.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{act.label}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{act.sub}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {details.label}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {formatRelativeTime(act.created_at)}
        </span>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="size-9 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-16 shrink-0" />
    </div>
  );
}

export default function Activity() {
  const { activities, isLoading } = useActivities();
  const [tab, setTab] = useState<ActivityTab>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return activities;
    return activities.filter((a) => a.activity_type === tab);
  }, [activities, tab]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recent Activity</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          A full log of everything you've done in Resumaker
        </p>
      </div>

      {/* ── Content ── */}
      <Card className="border bg-card/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Activity Log</CardTitle>
          <CardDescription className="text-xs">
            {isLoading ? "Loading…" : `${activities.length} total event${activities.length !== 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as ActivityTab)}>
            <TabsList className="mb-4">
              {(Object.keys(TAB_LABELS) as ActivityTab[]).map((key) => (
                <TabsTrigger key={key} value={key} id={`activity-tab-${key}`}>
                  {TAB_LABELS[key]}
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.keys(TAB_LABELS) as ActivityTab[]).map((key) => (
              <TabsContent key={key} value={key} className="mt-0">
                <ScrollArea className="h-[480px] pr-3">
                  {isLoading ? (
                    <div className="divide-y divide-border">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <ActivitySkeleton key={i} />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <History className="size-10 text-muted-foreground mb-3" />
                      <p className="text-sm font-medium">No activity yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {key === "all"
                          ? "Your actions will appear here once you start using Resumaker."
                          : `No "${TAB_LABELS[key]}" events recorded yet.`}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filtered.map((act, i) => (
                        <div key={act.id}>
                          <ActivityItem act={act} />
                          {i < filtered.length - 1 && <Separator className="opacity-0" />}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
