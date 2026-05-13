import { useState } from "react";
import type { Experience } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Loader2,
  Plus,
  RefreshCcw,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
  experiences: Experience[];
  onChange: (
    index: number,
    field: keyof Experience,
    value: string | string[],
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onFocusExperience: (index: number) => void;
  onFocusBullet: (index: number, bulletIndex: number) => void;
  onParaphrase: (bullet: string) => Promise<string[] | null>;
  onRecommendJobDescription?: (jobTitle: string) => Promise<string[] | null>;
  onUpdateBullet: (
    expIndex: number,
    bulletIndex: number,
    newValue: string,
  ) => void;
  /** Index of the experience currently being focused/edited, or null for list view */
  focusedIndex: number | null;
  onOpenExperience: (index: number) => void;
  onDoneEditing: () => void;
}

export default function ExperienceSection({
  experiences,
  onChange,
  onAdd,
  onRemove,
  onFocusExperience,
  onFocusBullet,
  onParaphrase,
  onRecommendJobDescription,
  onUpdateBullet,
  focusedIndex,
  onOpenExperience,
  onDoneEditing,
}: ExperienceSectionProps) {
  const [optimizingIdx, setOptimizingIdx] = useState<number | null>(null);
  const [optimizationResults, setOptimizationResults] = useState<
    string[] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [recommendingIdx, setRecommendingIdx] = useState<number | null>(null);

  const handleRecommendJobDescriptionLocal = async (index: number, jobTitle: string) => {
    if (!onRecommendJobDescription) return;
    setRecommendingIdx(index);
    try {
      const suggestions = await onRecommendJobDescription(jobTitle);
      if (suggestions && suggestions.length > 0) {
        const exp = experiences[index];
        const currentBullets = exp.bullet_points.filter((bp) => bp.trim() !== "");
        onChange(index, "bullet_points", [...currentBullets, ...suggestions]);
      }
    } finally {
      setRecommendingIdx(null);
    }
  };

  const handleOptimizeBullet = async (bullet: string, bulletIdx: number) => {
    if (!bullet.trim()) return;
    setOptimizingIdx(bulletIdx);
    setIsOptimizing(true);
    setIsModalOpen(true);
    setOptimizationResults(null);

    const results = await onParaphrase(bullet);
    setOptimizationResults(results);
    setIsOptimizing(false);
  };

  const applyOptimization = (optimizedValue: string) => {
    if (focusedIndex !== null && optimizingIdx !== null) {
      onUpdateBullet(focusedIndex, optimizingIdx, optimizedValue);
      setIsModalOpen(false);
      setOptimizingIdx(null);
    }
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Section header */}
      <div className="flex items-center justify-between px-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold truncate">Work Experience</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {experiences.length === 0
              ? "No experience added yet"
              : `${experiences.length} experience${experiences.length > 1 ? "s" : ""} added`}
          </p>
        </div>
        {experiences.length > 0 && (
          <Badge variant="secondary" className="text-[10px] font-bold">
            {experiences.length} total
          </Badge>
        )}
      </div>

      <Accordion
        type="single"
        collapsible
        value={focusedIndex !== null ? `exp-${focusedIndex}` : ""}
        onValueChange={(value) => {
          if (value) {
            const index = parseInt(value.split("-")[1]);
            onOpenExperience(index);
          } else {
            onDoneEditing();
          }
        }}
        className="space-y-3"
      >
        {experiences.map((exp, index) => {
          const isComplete =
            exp.company_name.trim() &&
            exp.job_title.trim() &&
            exp.bullet_points.some((bp) => bp.trim());

          return (
            <AccordionItem
              key={index}
              value={`exp-${index}`}
              className="border-none"
            >
              <AccordionTrigger className="hover:no-underline py-0 group [&[data-state=open]>div]:border-primary/20 [&[data-state=open]>div]:bg-primary/5">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card group-hover:border-primary/20 transition-all w-full text-left">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {exp.company_name || `Experience #${index + 1}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate uppercase font-medium tracking-tight">
                      {exp.job_title || "New Position"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 mr-2">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-dashed border-muted-foreground/40" />
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "size-4 text-muted-foreground/40 transition-transform duration-500",
                    focusedIndex === index && "rotate-180 text-primary/60"
                  )} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2 px-1">
                <Card className="border-primary/10 shadow-sm overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Item Details
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(index);
                        onDoneEditing();
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-6">
                    {/* Form Fields - Reused from previous implementation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={exp.company_name}
                          onChange={(e) =>
                            onChange(index, "company_name", e.target.value)
                          }
                          onFocus={() => onFocusExperience(index)}
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                          value={exp.job_title}
                          onChange={(e) =>
                            onChange(index, "job_title", e.target.value)
                          }
                          onFocus={() => onFocusExperience(index)}
                          placeholder="Senior Developer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            onChange(index, "location", e.target.value)
                          }
                          placeholder="Remote"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>From</Label>
                        <Input
                          value={exp.date_from}
                          onChange={(e) =>
                            onChange(index, "date_from", e.target.value)
                          }
                          placeholder="Jan 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>To</Label>
                        <Input
                          value={exp.date_to}
                          onChange={(e) =>
                            onChange(index, "date_to", e.target.value)
                          }
                          placeholder="Present"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                        <ClipboardList className="w-3 h-3" />
                        Job Description
                      </div>
                      <div className="space-y-3">
                        {exp.bullet_points.map((bp, bpIndex) => (
                          <div key={bpIndex} className="group relative">
                            <div className="flex gap-3 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 mt-4" />
                              <div className="flex-1 min-w-0 relative">
                                <Textarea
                                  value={bp}
                                  onChange={(e) => {
                                    const newBullets = [...exp.bullet_points];
                                    newBullets[bpIndex] = e.target.value;
                                    onChange(index, "bullet_points", newBullets);
                                  }}
                                  onFocus={() => {
                                    onFocusExperience(index);
                                    onFocusBullet(index, bpIndex);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      const newBullets = [...exp.bullet_points];
                                      newBullets.splice(bpIndex + 1, 0, "");
                                      onChange(index, "bullet_points", newBullets);
                                    }
                                  }}
                                  placeholder="Describe a responsibility..."
                                  className="w-full min-h-9.5 py-2 resize-none overflow-hidden field-sizing-content transition-all pr-4 group-hover:pr-20 group-focus-within:pr-20"
                                  rows={1}
                                />
                                <div className="absolute right-2 top-1.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm p-0.5 rounded-lg border shadow-sm z-10">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 h-7 w-7 text-primary/40 hover:text-primary hover:bg-primary/10"
                                    onClick={() => handleOptimizeBullet(bp, bpIndex)}
                                    disabled={!bp.trim()}
                                  >
                                    <Sparkles className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 h-7 w-7 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => {
                                      const newBullets = exp.bullet_points.filter(
                                        (_, i) => i !== bpIndex,
                                      );
                                      onChange(index, "bullet_points", newBullets);
                                    }}
                                    disabled={exp.bullet_points.length === 1}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex flex-col sm:flex-row gap-2 w-full mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-dashed flex-1 h-9 sm:h-8"
                            onClick={() =>
                              onChange(index, "bullet_points", [
                                ...exp.bullet_points,
                                "",
                              ])
                            }
                          >
                            <Plus className="w-3 h-3 mr-2" /> Add Description Line
                          </Button>
                          {onRecommendJobDescription && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-dashed flex-1 text-primary hover:text-primary hover:bg-primary/5 hover:border-primary/30 h-9 sm:h-8"
                              onClick={() => handleRecommendJobDescriptionLocal(index, exp.job_title)}
                              disabled={recommendingIdx === index || !exp.job_title}
                            >
                              {recommendingIdx === index ? (
                                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                              ) : (
                                <Wand2 className="w-3 h-3 mr-2" />
                              )}
                              {recommendingIdx === index ? "Suggesting..." : "AI Suggestions"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="bg-muted/30 p-4 border-t flex justify-end">
                    <Button 
                      size="sm" 
                      onClick={onDoneEditing}
                      className="rounded-lg px-6"
                    >
                      Done
                    </Button>
                  </div>
                </Card>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {experiences.length === 0 && (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">No experience yet</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Add your work history one at a time
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        variant="outline"
        className="w-full h-12 border-dashed rounded-xl font-semibold hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4" />
        Add Work Experience
      </Button>

      {/* AI Optimization Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Bullet Optimizer
            </DialogTitle>
            <DialogDescription className="text-xs">
              Choose the best version for your resume.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                Original
              </Label>
              <div className="p-3 rounded-xl bg-muted/50 text-[11px] italic border border-dashed">
                "
                {optimizingIdx !== null && focusedIndex !== null
                  ? experiences[focusedIndex].bullet_points[optimizingIdx]
                  : ""}
                "
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-bold text-primary flex items-center gap-1.5">
                AI Suggestions
              </Label>

              {isOptimizing ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Generating better versions...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {optimizationResults &&
                  optimizationResults.length > 0 ? (
                    <div className="space-y-2">
                      {optimizationResults.map((result, i) => (
                        <button
                          key={i}
                          onClick={() => applyOptimization(result)}
                          className="w-full text-left p-3 rounded-xl border border-border/50 bg-background hover:border-primary hover:bg-primary/5 hover:shadow-sm transition-all group"
                        >
                          <p className="text-[11px] leading-relaxed">
                            {result}
                          </p>
                          <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[9px] font-bold text-primary uppercase">
                              Click to use
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-3 bg-muted/30 rounded-xl border border-dashed">
                      <div className="p-2 rounded-full bg-muted text-muted-foreground">
                        <RefreshCcw className="w-4 h-4" />
                      </div>
                      <div className="px-4">
                        <p className="text-[11px] font-semibold">
                          No suggestions found
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          We couldn't generate variations.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-xl text-[11px] font-bold"
                    onClick={() => {
                      if (optimizingIdx !== null && focusedIndex !== null) {
                        handleOptimizeBullet(
                          experiences[focusedIndex].bullet_points[optimizingIdx],
                          optimizingIdx,
                        );
                      }
                    }}
                  >
                    <RefreshCcw className="w-3 h-3 mr-2" />
                    Retry Generation
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
