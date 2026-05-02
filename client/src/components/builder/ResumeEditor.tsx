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
  addAndFocusExperience: () => void;
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
  onParaphrase: (bullet: string) => Promise<string[] | null>;
  onUpdateBullet: (
    expIndex: number,
    bulletIndex: number,
    newValue: string,
  ) => void;
  focusedExperienceIndex: number | null;
  setFocusedExperienceIndex: (index: number | null) => void;
  setActiveExperienceIndex: (index: number) => void;
  loading: boolean;
}

export default function ResumeEditor({
  step,
  setStep,
  formData,
  handleInputChange,
  handleExperienceChange,
  addAndFocusExperience,
  removeExperience,
  handleEducationChange,
  addEducation,
  removeEducation,
  handleSubmit,
  handleSkillsChange,
  onFocusExperience,
  onFocusBullet,
  onParaphrase,
  onUpdateBullet,
  focusedExperienceIndex,
  setFocusedExperienceIndex,
  setActiveExperienceIndex,
  loading,
}: ResumeEditorProps) {
  const currentStepItem = sidebarItems[step - 1];

  // When "Add Experience" is clicked in list view, add + immediately focus
  const handleAddExperience = () => {
    addAndFocusExperience();
  };

  // When user opens an existing experience from list
  const handleOpenExperience = (index: number) => {
    setFocusedExperienceIndex(index);
    setActiveExperienceIndex(index);
  };

  // When user clicks "Done" in the focused form
  const handleDoneEditing = () => {
    setFocusedExperienceIndex(null);
  };

  // Hide the Next/Previous navigation while an experience is being edited
  const isEditingExperience = step === 2 && focusedExperienceIndex !== null;

  return (
    <main className="h-full bg-muted/5 flex flex-col overflow-hidden">
      <header className="h-14 border-b bg-background px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 text-primary">
            {currentStepItem && <currentStepItem.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xs md:text-sm font-bold leading-none mb-0.5 md:mb-1">
              {currentStepItem?.label}
              {isEditingExperience && (
                <span className="text-muted-foreground font-normal ml-1.5 hidden sm:inline">
                  · Adding Experience {focusedExperienceIndex! + 1}
                </span>
              )}
            </h2>
            <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium uppercase tracking-tight line-clamp-1">
              {isEditingExperience
                ? "Fill in details, then click Done"
                : currentStepItem?.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest hidden xs:inline">
            Editing Mode
          </span>
        </div>
      </header>

      <ScrollArea className="flex-1 min-h-0">
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-8 md:space-y-12 min-w-0">
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
                onAdd={handleAddExperience}
                onRemove={removeExperience}
                onFocusExperience={onFocusExperience}
                onFocusBullet={onFocusBullet}
                onParaphrase={onParaphrase}
                onUpdateBullet={onUpdateBullet}
                focusedIndex={focusedExperienceIndex}
                onOpenExperience={handleOpenExperience}
                onDoneEditing={handleDoneEditing}
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

            {/* Navigation — hidden while editing an experience */}
            {!isEditingExperience && (
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
            )}
          </StepperPanel>
        </div>
      </ScrollArea>
    </main>
  );
}
