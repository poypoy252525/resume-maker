import BuilderStatus from "@/components/builder/BuilderStatus";
import ResumeEditor from "@/components/builder/ResumeEditor";
import AIAssistantPanel from "@/components/builder/AIAssistantPanel";
import { Stepper } from "@/components/reui/stepper";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { Check, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

/**
 * NewResume Page - Modular Workspace
 * Uses Resizable panels and extracted components for maintainability and premium UX.
 */
export default function NewResume() {
  const {
    step,
    setStep,
    formData,
    isGenerating,
    loading,
    taskId,
    fileUrl,
    status,
    error,
    handleInputChange,
    handleExperienceChange,
    addAndFocusExperience,
    removeExperience,
    handleEducationChange,
    addEducation,
    removeEducation,
    handleReset,
    handleSubmit,
    handleSkillsChange,
    triggerAIAnalysis,
    handleParaphrase,
    updateBullet,
    handleRecommendAchievements,
    addBulletToExperience,
    setActiveExperienceIndex,
    setActiveBulletIndex,
    focusedExperienceIndex,
    setFocusedExperienceIndex,
  } = useResumeBuilder();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isGenerating) {
    return (
      <BuilderStatus
        status={status}
        taskId={taskId}
        fileUrl={fileUrl}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <Stepper
        value={step}
        onValueChange={setStep}
        orientation="horizontal"
        className="h-full w-full"
        indicators={{
          completed: <Check className="size-3.5" />,
          loading: <LoaderCircle className="size-3.5 animate-spin" />,
        }}
      >
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full w-full items-stretch"
        >
          <ResizablePanel defaultSize={65} minSize={40}>
            <ResumeEditor
              step={step}
              setStep={setStep}
              formData={formData}
              handleInputChange={handleInputChange}
              handleExperienceChange={handleExperienceChange}
              addAndFocusExperience={addAndFocusExperience}
              removeExperience={removeExperience}
              handleEducationChange={handleEducationChange}
              addEducation={addEducation}
              removeEducation={removeEducation}
              handleSubmit={handleSubmit}
              handleSkillsChange={handleSkillsChange}
              onFocusExperience={setActiveExperienceIndex}
              onFocusBullet={setActiveBulletIndex}
              onParaphrase={handleParaphrase}
              onUpdateBullet={updateBullet}
              focusedExperienceIndex={focusedExperienceIndex}
              setFocusedExperienceIndex={setFocusedExperienceIndex}
              setActiveExperienceIndex={setActiveExperienceIndex}
              loading={loading}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={35} minSize={25}>
            <AIAssistantPanel
              formData={formData}
              onChange={handleInputChange}
              onSkillsChange={handleSkillsChange}
              onAnalyze={triggerAIAnalysis}
              onRecommendAchievements={handleRecommendAchievements}
              onAddBullet={addBulletToExperience}
              loading={loading}
              step={step}
              focusedExperienceIndex={focusedExperienceIndex}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Stepper>
    </div>
  );
}
