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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Check, LoaderCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * NewResume Page - Modular Workspace
 * Uses Resizable panels on desktop and a mobile-optimized layout on smaller screens.
 */
export default function NewResume() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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
    handleRecommendJobDescription,
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

  const editorProps = {
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
    onFocusExperience: setActiveExperienceIndex,
    onFocusBullet: setActiveBulletIndex,
    onParaphrase: handleParaphrase,
    onUpdateBullet: updateBullet,
    focusedExperienceIndex,
    setFocusedExperienceIndex,
    setActiveExperienceIndex,
    loading,
  };

  const aiAssistantProps = {
    formData,
    onChange: handleInputChange,
    onSkillsChange: handleSkillsChange,
    onAnalyze: triggerAIAnalysis,
    onRecommendJobDescription: handleRecommendJobDescription,
    onAddBullet: addBulletToExperience,
    loading,
    step,
    focusedExperienceIndex,
  };

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Stepper
        value={step}
        onValueChange={setStep}
        orientation="horizontal"
        className="flex-1 overflow-hidden"
        indicators={{
          completed: <Check className="size-3.5" />,
          loading: <LoaderCircle className="size-3.5 animate-spin" />,
        }}
      >
        {isDesktop ? (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full w-full items-stretch"
          >
            <ResizablePanel defaultSize={65} minSize={40}>
              <ResumeEditor {...editorProps} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={35} minSize={25}>
              <AIAssistantPanel {...aiAssistantProps} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="relative h-full w-full overflow-hidden flex flex-col">
            <ResumeEditor {...editorProps} />

            {/* Mobile AI Assistant Trigger */}
            <Sheet open={showAIAssistant} onOpenChange={setShowAIAssistant}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  className="fixed bottom-6 right-6 size-14 rounded-full shadow-2xl shadow-primary/40 z-50 animate-in zoom-in-50 duration-300"
                >
                  <Sparkles className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-[90%] sm:w-100">
                <div className="h-full relative">
                  <AIAssistantPanel {...aiAssistantProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </Stepper>
    </div>
  );
}
