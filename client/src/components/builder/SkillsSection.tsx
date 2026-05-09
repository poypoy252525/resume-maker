import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillsSection({
  skills,
  onChange,
}: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Label className="text-base">Core Skills & Technologies</Label>
        <p className="text-sm text-muted-foreground">
          Add individual skills to showcase your technical and professional expertise.
        </p>
      </div>

      <form onSubmit={handleAddSkill} className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="e.g. React, Python, Project Management..."
          className="rounded-xl shadow-inner"
        />
        <Button type="submit" size="icon" className="rounded-xl shrink-0">
          <Plus className="size-4" />
        </Button>
      </form>

      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-background/50 rounded-xl border shadow-inner min-h-20">
          {skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="h-8 px-3 text-sm gap-1.5 rounded-lg bg-secondary/60"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="cursor-pointer hover:text-destructive transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
