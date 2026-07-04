import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  CheckCircle2,
  Bot,
  Zap,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AITailorModal() {
  const {
    isTailorModalOpen,
    setTailorModalOpen,
    isTailoring,
    tailorResult,
    formData,
    applyTailoredResume,
  } = useResumeStore();

  const [selectedExperiences, setSelectedExperiences] = useState<number[]>([]);
  const [applySummary, setApplySummary] = useState(true);
  const [applySkills, setApplySkills] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  // loading steps animation
  useEffect(() => {
    if (!isTailoring) return;
    setLoadingStep(0);
    const intervals = [
      setTimeout(() => setLoadingStep(1), 1500),
      setTimeout(() => setLoadingStep(2), 3500),
      setTimeout(() => setLoadingStep(3), 5500),
    ];
    return () => intervals.forEach(clearTimeout);
  }, [isTailoring]);

  // Reset selections when new data arrives
  useEffect(() => {
    if (tailorResult) {
      setApplySummary(true);
      setApplySkills(true);
      setSelectedExperiences(
        tailorResult.tailored_experiences.map((exp) => exp.index)
      );
    }
  }, [tailorResult]);

  const handleToggleExperience = (index: number) => {
    setSelectedExperiences((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleApply = () => {
    applyTailoredResume(selectedExperiences, applySummary, applySkills);
  };

  return (
    <Dialog open={isTailorModalOpen} onOpenChange={setTailorModalOpen}>
      <DialogContent className="sm:max-w-5xl w-[95vw] max-h-[92vh] h-[92vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-3 border-b bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
              <Bot className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight flex items-center gap-2">
                AI Resume Tailoring
                <Badge variant="secondary" className="text-[9px] font-bold tracking-wider uppercase bg-primary/10 text-primary hover:bg-primary/20">
                  Auto-Match
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Aligning your profile summary, experience details, and technical skills with the target job description.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isTailoring ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 space-y-6">
            <div className="relative">
              <div className="size-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
              <Zap className="size-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div className="text-center space-y-2 max-w-md">
              <p className="font-bold text-lg text-foreground">Tailoring your resume...</p>
              <div className="h-6 overflow-hidden relative text-sm text-muted-foreground">
                <p className={cn(
                  "absolute inset-x-0 transition-all duration-500",
                  loadingStep === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                )}>
                  Ingesting your resume data and structure...
                </p>
                <p className={cn(
                  "absolute inset-x-0 transition-all duration-500",
                  loadingStep === 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  loadingStep > 1 && "-translate-y-4 opacity-0"
                )}>
                  Analyzing target job description and required competencies...
                </p>
                <p className={cn(
                  "absolute inset-x-0 transition-all duration-500",
                  loadingStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  loadingStep > 2 && "-translate-y-4 opacity-0"
                )}>
                  Enhancing achievement bullet points with action verbs...
                </p>
                <p className={cn(
                  "absolute inset-x-0 transition-all duration-500",
                  loadingStep === 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  Formulating tailored professional summary...
                </p>
              </div>
            </div>
          </div>
        ) : !tailorResult ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <Info className="size-12 text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">
              No tailoring data available. Make sure to input a Target Role and Job Description first.
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="p-6 space-y-6">
                
                {/* Summary Section */}
                <div className="bg-background rounded-2xl border shadow-xs overflow-hidden">
                  <div className="p-4 bg-muted/10 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="apply-summary"
                        checked={applySummary}
                        onChange={(e) => setApplySummary(e.target.checked)}
                        className="rounded border-muted-foreground/30 text-primary accent-primary size-4 cursor-pointer"
                      />
                      <label htmlFor="apply-summary" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                        Professional Summary Optimization
                      </label>
                    </div>
                    {applySummary && (
                      <Badge variant="outline" className="text-[10px] text-green-600 bg-green-500/5 border-green-500/20">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className={cn("grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x", !applySummary && "opacity-50 transition-opacity")}>
                    <div className="p-5 space-y-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Summary</p>
                      <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {formData.skill_description || "No summary provided."}
                      </p>
                    </div>
                    <div className="p-5 space-y-2 bg-primary/5">
                      <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                        <Sparkles className="size-3" /> Tailored Summary Suggestion
                      </p>
                      <p className="text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                        {tailorResult.tailored_summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                {tailorResult.skills_to_add && tailorResult.skills_to_add.length > 0 && (
                  <div className="bg-background rounded-2xl border shadow-xs overflow-hidden">
                    <div className="p-4 bg-muted/10 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="apply-skills"
                          checked={applySkills}
                          onChange={(e) => setApplySkills(e.target.checked)}
                          className="rounded border-muted-foreground/30 text-primary accent-primary size-4 cursor-pointer"
                        />
                        <label htmlFor="apply-skills" className="text-xs font-bold uppercase tracking-wider cursor-pointer">
                          Suggested Skills Injection
                        </label>
                      </div>
                      {applySkills && (
                        <Badge variant="outline" className="text-[10px] text-green-600 bg-green-500/5 border-green-500/20">
                          Selected
                        </Badge>
                      )}
                    </div>
                    <div className={cn("p-5 space-y-4", !applySkills && "opacity-50 transition-opacity")}>
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Current Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(formData.skills || []).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs py-0.5 px-2.5">
                              {skill}
                            </Badge>
                          ))}
                          {(formData.skills || []).length === 0 && (
                            <span className="text-xs text-muted-foreground italic">No skills listed yet.</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 border-t pt-4">
                        <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                          <Sparkles className="size-3" /> Recommended Skills to Append
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {tailorResult.skills_to_add.map((skill, idx) => (
                            <Badge key={idx} className="text-xs py-0.5 px-2.5 bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none flex items-center gap-1">
                              +{skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Experiences Section */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
                    Work Experiences Optimization
                  </h4>
                  {tailorResult.tailored_experiences.map((expItem) => {
                    const originalExp = formData.experiences[expItem.index];
                    if (!originalExp) return null;
                    
                    const isSelected = selectedExperiences.includes(expItem.index);

                    return (
                      <div key={expItem.index} className="bg-background rounded-2xl border shadow-xs overflow-hidden">
                        <div className="p-4 bg-muted/10 border-b flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`apply-exp-${expItem.index}`}
                              checked={isSelected}
                              onChange={() => handleToggleExperience(expItem.index)}
                              className="rounded border-muted-foreground/30 text-primary accent-primary size-4 cursor-pointer"
                            />
                            <label htmlFor={`apply-exp-${expItem.index}`} className="text-xs font-bold cursor-pointer">
                              {originalExp.company_name || `Experience #${expItem.index + 1}`}
                              <span className="text-muted-foreground font-normal ml-2">
                                ({originalExp.job_title || "No Title"})
                              </span>
                            </label>
                          </div>
                          {isSelected && (
                            <Badge variant="outline" className="text-[10px] text-green-600 bg-green-500/5 border-green-500/20">
                              Selected
                            </Badge>
                          )}
                        </div>

                        <div className={cn("grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x", !isSelected && "opacity-50 transition-opacity")}>
                          <div className="p-5 space-y-3">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Original Bullet Points</p>
                            <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-muted-foreground leading-relaxed">
                              {expItem.original_bullets.map((bullet, idx) => (
                                <li key={idx}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-5 space-y-3 bg-primary/5">
                            <p className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                              <Sparkles className="size-3" /> Tailored Suggested Bullets
                            </p>
                            <ul className="list-disc list-outside ml-4 space-y-2 text-xs text-foreground leading-relaxed">
                              {expItem.tailored_bullets.map((bullet, idx) => (
                                <li key={idx} className="marker:text-primary">
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                            {expItem.reasoning && (
                              <div className="mt-4 pt-3 border-t flex items-start gap-1.5 text-[10px] text-muted-foreground">
                                <Info className="size-3 text-primary shrink-0 mt-0.5" />
                                <p className="italic leading-snug">
                                  {expItem.reasoning}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-background flex items-center justify-between shrink-0">
              <Button
                variant="ghost"
                onClick={() => setTailorModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleApply}
                  disabled={!applySummary && !applySkills && selectedExperiences.length === 0}
                  className="rounded-xl text-xs font-bold px-6 shadow-md shadow-primary/20 gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  Apply Selected Optimizations
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
