import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Brain, Download, Sparkles } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Score display helpers ─────────────────────────────────────────────────────

export const scoreColor = (score: number) =>
  score >= 85
    ? "text-emerald-500"
    : score >= 70
      ? "text-amber-500"
      : "text-rose-500";

export const scoreBar = (score: number) =>
  score >= 85
    ? "[&>div]:bg-emerald-500"
    : score >= 70
      ? "[&>div]:bg-amber-500"
      : "[&>div]:bg-rose-500";

// ── Date helpers ──────────────────────────────────────────────────────────────

export const formatRelativeTime = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "some time ago";
  }
};

// ── Activity helpers ──────────────────────────────────────────────────────────

export const getActivityDetails = (type: string) => {
  switch (type) {
    case "ai_review":
      return { icon: Brain, color: "text-violet-500", bg: "bg-violet-500/10", label: "AI Review" };
    case "download":
      return { icon: Download, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Download" };
    case "create":
    default:
      return { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10", label: "Created" };
  }
};
