import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StepperContent, StepperPanel } from "@/components/reui/stepper";
import PersonalInfoSection from "./PersonalInfoSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ResumeStepper from "./ResumeStepper";
import { sidebarItems } from "@/constants/builder";
import type { ResumeData, Experience, Education } from "@/api";

interface ResumeEditorProps {
  step: number;
  setStep: (step: number) => void;
  formData: ResumeData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleExperienceChange: (
    index: number,
    field: keyof Experience,
    value: string | string[],
  ) => void;
  addExperience: () => void;
  removeExperience: (index: number) => void;
  handleEducationChange: (
    index: number,
    field: keyof Education,
    value: string | boolean,
  ) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  handleSubmit: () => void;
  handleSkillsChange: (skills: string[]) => void;
  onFocusExperience: (index: number) => void;
  onFocusBullet: (index: number, bulletIndex: number) => void;
  loading: boolean;
}

export default function ResumeEditor({
  step,
  setStep,
  formData,
  handleInputChange,
  handleExperienceChange,
  addExperience,
  removeExperience,
  handleEducationChange,
  addEducation,
  removeEducation,
  handleSubmit,
  handleSkillsChange,
  onFocusExperience,
  onFocusBullet,
  loading,
}: ResumeEditorProps) {
  const currentStepItem = sidebarItems[step - 1];

  return (
    <main className="h-full bg-muted/5 flex flex-col overflow-hidden">
      <header className="h-14 border-b bg-background px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            {currentStepItem && <currentStepItem.icon className="w-4 h-4" />}
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold leading-none mb-1">
              {currentStepItem?.label}
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
              {currentStepItem?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
            Editing Mode
          </span>
        </div>
      </header>

      <ScrollArea className="flex-1 min-h-0">
        <div className="max-w-3xl mx-auto p-8 space-y-12">
          <ResumeStepper />

          <StepperPanel className="space-y-8">
            <StepperContent value={1}>
              <PersonalInfoSection
                data={formData}
                onChange={handleInputChange}
              />
            </StepperContent>
            <StepperContent value={2}>
              <ExperienceSection
                experiences={formData.experiences}
                onChange={handleExperienceChange}
                onAdd={addExperience}
                onRemove={removeExperience}
                onFocusExperience={onFocusExperience}
                onFocusBullet={onFocusBullet}
              />
            </StepperContent>
            <StepperContent value={3}>
              <EducationSection
                educations={formData.educations}
                onChange={handleEducationChange}
                onAdd={addEducation}
                onRemove={removeEducation}
              />
            </StepperContent>
            <StepperContent value={4}>
              <SkillsSection
                skills={formData.skills || []}
                onChange={handleSkillsChange}
                skillDescription={formData.skill_description}
                onDescriptionChange={handleInputChange}
              />
            </StepperContent>

            <div className="flex justify-between pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (step > 1) setStep(step - 1);
                }}
                disabled={step === 1}
                className="rounded-xl px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              {step !== 4 ? (
                <Button
                  size="lg"
                  onClick={() => {
                    if (step < 4) setStep(step + 1);
                  }}
                  className="rounded-xl px-8"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-xl px-8 shadow-lg shadow-primary/20"
                >
                  {loading ? "Generating..." : "Generate Resume"}
                </Button>
              )}
            </div>
          </StepperPanel>
        </div>
      </ScrollArea>
    </main>
  );
}
