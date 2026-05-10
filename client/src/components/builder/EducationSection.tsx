import { Plus, Trash2, GraduationCap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
      <div className="flex items-center justify-between px-1">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold truncate">Education History</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {educations.length === 0
              ? "No education added yet"
              : `${educations.length} entry${educations.length > 1 ? "ies" : ""} added`}
          </p>
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {educations.map((edu, index) => (
          <AccordionItem key={index} value={`edu-${index}`} className="border-none">
            <AccordionTrigger className="hover:no-underline py-0 group [&[data-state=open]>div]:border-primary/20 [&[data-state=open]>div]:bg-primary/5">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card group-hover:border-primary/20 transition-all w-full text-left">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {edu.school || `Education #${index + 1}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate uppercase font-medium tracking-tight">
                    {edu.school_type || "Degree / Certification"}
                  </p>
                </div>
                <ChevronDown className="size-4 text-muted-foreground/40 transition-transform duration-500 group-data-[state=open]:rotate-180" />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2 px-1">
              <Card className="border-primary/10 shadow-sm overflow-hidden">
                <CardHeader className="bg-primary/5 border-b py-3 px-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      Academic Details
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {educations.length === 0 && (
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">No education yet</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Add your academic background
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
        <Plus className="w-4 h-4 mr-2" /> Add Education History
      </Button>
    </div>
  );
}
