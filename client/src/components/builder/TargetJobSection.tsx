import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";
import type { ResumeData } from "@/api";

interface TargetJobSectionProps {
  data: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function TargetJobSection({ data, onChange }: TargetJobSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-1">
      {/* Informative Header / Guide Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-linear-to-tr from-primary/5 to-primary/10 p-5 md:p-6">
        <div className="relative z-10 flex gap-4 items-start">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Target className="size-5" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold text-foreground">
              Define Your Job Goal
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every outstanding resume is customized for a specific role. By providing your Target Role and Job Description, you power our AI suggestions to align your summary, bullets, and skills perfectly with what recruiters are looking for.
            </p>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 opacity-5 text-primary pointer-events-none">
          <Target className="size-36" />
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="target_role" className="text-sm font-semibold">
              Target Role
            </Label>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Required for AI tools</span>
          </div>
          <Input
            id="target_role"
            name="target_role"
            placeholder="e.g. Senior Software Engineer"
            value={data.target_role || ""}
            onChange={onChange}
            className="rounded-xl h-11 border-muted-foreground/20 focus-visible:ring-primary/20 bg-background shadow-xs"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="job_description" className="text-sm font-semibold">
              Job Description
            </Label>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Highly Recommended</span>
          </div>
          <Textarea
            id="job_description"
            name="job_description"
            placeholder="Paste the target job description here to optimize your experience, bullet points, and skills recommendations for ATS matching..."
            className="min-h-48 rounded-xl resize-none shadow-xs border-muted-foreground/20 bg-background/50 focus:bg-background focus-visible:ring-primary/20 transition-all p-3 text-sm leading-relaxed"
            value={data.job_description || ""}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
