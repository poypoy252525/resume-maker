import { Plus, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Education } from "@/api";

interface EducationSectionProps {
  educations: Education[];
  onChange: (index: number, field: keyof Education, value: string | boolean) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export default function EducationSection({ educations, onChange, onAdd, onRemove }: EducationSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {educations.map((edu, index) => (
        <Card key={index} className="relative group overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">
                    {edu.school || `Education #${index + 1}`}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                    Academic History
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
                <Label>School</Label>
                <Input
                  value={edu.school}
                  onChange={(e) => onChange(index, "school", e.target.value)}
                  placeholder="University of Technology"
                />
              </div>
              <div className="space-y-2">
                <Label>Degree / Certification</Label>
                <Input
                  value={edu.school_type}
                  onChange={(e) => onChange(index, "school_type", e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={edu.location}
                  onChange={(e) => onChange(index, "location", e.target.value)}
                  placeholder="Boston, MA"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>From</Label>
                  <Input
                    value={edu.date_from}
                    onChange={(e) => onChange(index, "date_from", e.target.value)}
                    placeholder="2016"
                  />
                </div>
                <div className="space-y-2">
                  <Label>To</Label>
                  <Input
                    value={edu.date_to}
                    onChange={(e) => onChange(index, "date_to", e.target.value)}
                    placeholder="2020"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        className="w-full h-12 border-dashed rounded-xl"
        onClick={onAdd}
      >
        <Plus className="w-4 h-4 mr-2" /> Add Education History
      </Button>
    </div>
  );
}
