import BuilderStatus from "@/components/builder/BuilderStatus";
import ResumeEditor from "@/components/builder/ResumeEditor";
import ResumePreviewPanel from "@/components/builder/ResumePreviewPanel";
import AIAssistantPanel from "@/components/builder/AIAssistantPanel";
import { Stepper } from "@/components/reui/stepper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { AlertCircle, Check, LoaderCircle } from "lucide-react";

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
    addExperience,
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
    activeExperienceIndex,
    setActiveExperienceIndex,
    activeBulletIndex,
    setActiveBulletIndex,
  } = useResumeBuilder();

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
              addExperience={addExperience}
              removeExperience={removeExperience}
              handleEducationChange={handleEducationChange}
              addEducation={addEducation}
              removeEducation={removeEducation}
              handleSubmit={handleSubmit}
              handleSkillsChange={handleSkillsChange}
              onFocusExperience={setActiveExperienceIndex}
              onFocusBullet={setActiveBulletIndex}
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
              onParaphrase={handleParaphrase}
              onUpdateBullet={updateBullet}
              onRecommendAchievements={handleRecommendAchievements}
              onAddBullet={addBulletToExperience}
              loading={loading}
              step={step}
              activeExperienceIndex={activeExperienceIndex}
              activeBulletIndex={activeBulletIndex}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Stepper>

      {error && (
        <div className="fixed bottom-6 right-6 z-50 w-80 animate-in slide-in-from-bottom-5">
          <Alert variant="destructive" className="shadow-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
