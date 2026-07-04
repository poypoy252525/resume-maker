import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useResumeStore } from "@/store/useResumeStore";
import { toast } from "sonner";
import type { ResumeData } from "@/api";

interface PersonalInfoSectionProps {
  data: ResumeData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const { handleRecommendSummary, isRecommendingSummary } = useResumeStore();

  const handleGenerateSummary = async () => {
    if (!data.target_role?.trim()) {
      toast.warning("Please enter a Target Role first to help tailor the summary.");
      return;
    }

    try {
      const summary = await handleRecommendSummary();
      if (summary) {
        // Trigger onChange event to update parent state
        const event = {
          target: {
            name: "skill_description",
            value: summary,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(event);
        toast.success("Professional Summary generated!");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to generate summary.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 px-1">
      {/* Personal Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="John Doe"
            value={data.full_name}
            onChange={onChange}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={onChange}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            placeholder="+1 (555) 000-0000"
            value={data.phone_number}
            onChange={onChange}
            className="rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="New York, NY"
            value={data.location}
            onChange={onChange}
            className="rounded-xl"
          />
        </div>
      </div>

      {/* Target Job Context */}
      <div className="space-y-4 pt-6 border-t border-muted-foreground/10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Target Job Details</h3>
          <p className="text-xs text-muted-foreground">
            Provide details about your desired role and job description to power AI suggestions throughout your resume.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="target_role">Target Role</Label>
            <Input
              id="target_role"
              name="target_role"
              placeholder="e.g. Senior Software Engineer"
              value={data.target_role || ""}
              onChange={onChange}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job_description">Job Description</Label>
            <Textarea
              id="job_description"
              name="job_description"
              placeholder="Paste the job description here to optimize your resume for ATS..."
              className="min-h-24 rounded-xl resize-none shadow-inner bg-background/50 focus:bg-background transition-colors p-3 text-sm"
              value={data.job_description || ""}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-2 pt-6 border-t border-muted-foreground/10">
        <div className="flex items-center justify-between">
          <Label htmlFor="skill_description" className="text-base font-semibold">
            Professional Summary
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isRecommendingSummary}
            className="h-8 gap-1.5 rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all text-xs font-semibold text-primary"
          >
            {isRecommendingSummary ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>{isRecommendingSummary ? "Generating..." : "Generate with AI"}</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Provide a brief paragraph summarizing your background and career goals.
        </p>
        <Textarea
          id="skill_description"
          name="skill_description"
          placeholder="e.g. A passionate software architect with 10+ years of experience..."
          className="min-h-32 rounded-xl resize-none shadow-inner bg-background/50 focus:bg-background transition-colors p-3 text-sm"
          value={data.skill_description}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
