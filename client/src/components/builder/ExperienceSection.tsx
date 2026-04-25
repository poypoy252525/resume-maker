import { Plus, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Experience } from "@/api";

interface ExperienceSectionProps {
  experiences: Experience[];
  onChange: (index: number, field: keyof Experience, value: string | string[]) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function ExperienceSection({ experiences, onChange, onAdd, onRemove }: ExperienceSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {experiences.map((exp, index) => (
        <Card key={index} className="relative group overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    {exp.company_name || `Experience #${index + 1}`}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    Work History
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={exp.company_name}
                  onChange={(e) => onChange(index, "company_name", e.target.value)}
                  placeholder="Acme Inc"
                />
              </div>
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={exp.job_title}
                  onChange={(e) => onChange(index, "job_title", e.target.value)}
                  placeholder="Senior Developer"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={exp.location}
                  onChange={(e) => onChange(index, "location", e.target.value)}
                  placeholder="Remote"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    value={exp.date_from}
                    onChange={(e) => onChange(index, "date_from", e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    value={exp.date_to}
                    onChange={(e) => onChange(index, "date_to", e.target.value)}
                    placeholder="Present"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Key Achievements
              </Label>
              {exp.bullet_points.map((bp, bpIndex) => (
                <div key={bpIndex} className="flex gap-2">
                  <Input
                    value={bp}
                    onChange={(e) => {
                      const newBullets = [...exp.bullet_points];
                      newBullets[bpIndex] = e.target.value;
                      onChange(index, "bullet_points", newBullets);
                    }}
                    placeholder="Describe your achievement..."
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => {
                      const newBullets = exp.bullet_points.filter((_, i) => i !== bpIndex);
                      onChange(index, "bullet_points", newBullets);
                    }}
                    disabled={exp.bullet_points.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-dashed w-full"
                onClick={() => onChange(index, "bullet_points", [...exp.bullet_points, ""])}
              >
                <Plus className="w-3 h-3 mr-2" /> Add Achievement
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        className="w-full h-12 border-dashed rounded-xl"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Professional Experience
      </Button>
    </div>
  );
}
