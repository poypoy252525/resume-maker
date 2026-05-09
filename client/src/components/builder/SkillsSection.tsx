import React, { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Sparkles, Loader2, Search } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  onRecommendSkills: () => Promise<string[] | null>;
}

export default function SkillsSection({
  skills,
  onChange,
  onRecommendSkills,
}: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddSkill(newSkill);
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    const suggestions = await onRecommendSkills();
    if (suggestions) {
      setRecommendations(suggestions);
    }
    setIsLoading(false);
  };

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(
      (s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !skills.includes(s),
    );
  }, [recommendations, searchQuery, skills]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-bold tracking-tight">
            Skills & Expertise
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetSuggestions}
            disabled={isLoading}
            className="rounded-xl gap-2 border-primary/20 hover:bg-primary/5 text-primary font-bold shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {recommendations.length > 0 ? "Refresh AI Skills" : "Suggest 100+ Skills"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add specific technical skills, tools, and professional strengths. Use AI to discover what hiring managers are looking for.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Your Selection ({skills.length})
          </Label>
          <form onSubmit={handleManualAdd} className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Type a skill..."
              className="rounded-xl shadow-inner bg-background/50 h-11"
            />
            <Button type="submit" size="icon" className="rounded-xl shrink-0 h-11 w-11 shadow-lg shadow-primary/20">
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed min-h-40 content-start">
            {skills.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 space-y-2">
                <Plus className="size-8 opacity-20" />
                <p className="text-xs font-medium">No skills added yet</p>
              </div>
            ) : (
              skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="h-9 px-3.5 text-sm gap-2 rounded-xl bg-background border shadow-sm animate-in zoom-in-95"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="cursor-pointer hover:text-destructive transition-colors ml-0.5"
                  >
                    <X className="size-3.5" />
                  </button>
                </Badge>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              AI Recommendations
            </Label>
            {recommendations.length > 0 && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {filteredRecommendations.length} available
              </span>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              placeholder="Filter suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl h-11 bg-background/50"
              disabled={recommendations.length === 0}
            />
          </div>

          <ScrollArea className="h-70 rounded-2xl border bg-slate-50/30 dark:bg-slate-900/30 p-4">
            {recommendations.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="size-6 text-primary/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold">Discover Your Potential</p>
                  <p className="text-[10px] text-muted-foreground max-w-45 mx-auto">
                    Click the suggest button above to get 100+ tailored skills for your role.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredRecommendations.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center w-full py-8">
                    No matching suggestions found.
                  </p>
                ) : (
                  filteredRecommendations.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="h-8 px-3 text-xs gap-1.5 rounded-lg cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all border-dashed bg-background/50"
                      onClick={() => handleAddSkill(skill)}
                    >
                      {skill}
                      <Plus className="size-3 text-muted-foreground/50" />
                    </Badge>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
