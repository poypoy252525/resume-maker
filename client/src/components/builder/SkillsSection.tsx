import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillsSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function SkillsSection({ value, onChange }: SkillsSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Label htmlFor="skill_description" className="text-base">
          Professional Summary & Skills
        </Label>
        <p className="text-sm text-muted-foreground">
          List your core competencies, technologies, and a brief professional
          summary.
        </p>
      </div>
      <Textarea
        id="skill_description"
        name="skill_description"
        placeholder="e.g. JavaScript, React, Python, UI Design, Project Management..."
        className="min-h-100 rounded-xl resize-none shadow-inner"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
