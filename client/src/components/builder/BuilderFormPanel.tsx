import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { sidebarItems } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/useResumeStore";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Sparkles,
} from "lucide-react";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import PersonalInfoSection from "./PersonalInfoSection";
import SkillsSection from "./SkillsSection";

export default function BuilderFormPanel() {
  const {
    step,
    setStep,
    formData,
    setFormData,
    loading,
    isAIAnalyzing,
    isTailoring,
    setActiveExperienceIndex,
    setActiveBulletIndex,
    focusedExperienceIndex,
    setFocusedExperienceIndex,
    triggerAIAnalysis,
    triggerTailorResume,
    handleParaphrase,
    handleRecommendSkills,
    handleRecommendJobDescription,
  } = useResumeStore();

  const currentStepItem = step > 0 ? sidebarItems[step - 1] : null;

  const handleNext = () => {
    if (step < sidebarItems.length) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // Helper for direct input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const isEditingExperience = step === 2 && focusedExperienceIndex !== null;

  return (
    <div className="h-full bg-background flex flex-col overflow-hidden">
      <header className="h-14 border-b bg-background px-4 md:px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shadow-sm shrink-0">
            {currentStepItem ? (
              <currentStepItem.icon className="w-4 h-4" />
            ) : (
              <div className="w-4 h-4 border-2 border-primary/30 rounded-sm" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-sm font-bold leading-none mb-1 flex items-center gap-2 min-w-0">
              <span className="truncate">
                {currentStepItem?.label || "Resume Builder"}
              </span>
              {isEditingExperience && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium shrink-0">
                  Item {focusedExperienceIndex! + 1}
                </span>
              )}
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight truncate">
              {isEditingExperience
                ? "Fill in details, then click Done"
                : currentStepItem?.description || "Select a section to begin"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all gap-1.5"
            onClick={triggerAIAnalysis}
            disabled={loading || isAIAnalyzing}
          >
            <Wand2 className="w-3 h-3" />
            AI Analyze
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg border-primary/20 hover:bg-primary/5 hover:text-primary transition-all gap-1.5"
            onClick={triggerTailorResume}
            disabled={loading || isTailoring || !formData.job_description}
            title={!formData.job_description ? "Please set a Job Description in Setup tab first" : ""}
          >
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            AI Tailor
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-8 space-y-8 max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            value={step > 0 ? `step-${step}` : ""}
            onValueChange={(value) => {
              if (value) {
                const newStep = parseInt(value.split("-")[1]);
                if (!isNaN(newStep)) setStep(newStep);
              } else {
                setStep(0);
              }
            }}
            className="w-full space-y-4"
          >
            {sidebarItems.map((item) => (
              <AccordionItem
                key={item.step}
                value={`step-${item.step}`}
                className="border-none"
              >
                <AccordionTrigger className="hover:no-underline py-0 group [&[data-state=open]>div]:border-primary/30 [&[data-state=open]>div]:bg-primary/5">
                  <div
                    className={cn(
                      "flex items-center gap-4 w-full p-4 rounded-2xl transition-all border-2 border-transparent bg-muted/30 group-hover:bg-muted/50 text-left",
                    )}
                  >
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                        step === item.step
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "bg-background text-muted-foreground",
                      )}
                    >
                      <item.icon className="size-5" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold truncate">
                          {item.label}
                        </span>
                        {step > item.step && (
                          <Check className="size-3.5 text-success" />
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium truncate uppercase tracking-tight">
                        {item.description}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground/40 transition-transform duration-500 ease-in-out",
                        step === item.step && "rotate-180 text-primary/60",
                      )}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 px-1">
                  {item.step === 1 && (
                    <PersonalInfoSection
                      data={formData}
                      onChange={handleInputChange}
                    />
                  )}
                  {item.step === 2 && (
                    <ExperienceSection
                      experiences={formData.experiences}
                      onChange={(index, field, value) => {
                        const newExperiences = [...formData.experiences];
                        newExperiences[index] = {
                          ...newExperiences[index],
                          [field]: value,
                        };
                        setFormData({ experiences: newExperiences });
                      }}
                      onAdd={() => {
                        const newExp = {
                          company_name: "",
                          location: "",
                          job_title: "",
                          date_from: "",
                          date_to: "",
                          bullet_points: [""],
                        };
                        const newIdx = formData.experiences.length;
                        setFormData({
                          experiences: [...formData.experiences, newExp],
                        });
                        setFocusedExperienceIndex(newIdx);
                        setActiveExperienceIndex(newIdx);
                      }}
                      onRemove={(index) => {
                        setFormData({
                          experiences: formData.experiences.filter(
                            (_, i) => i !== index,
                          ),
                        });
                      }}
                      onFocusExperience={setActiveExperienceIndex}
                      onFocusBullet={(expIdx, bulletIdx) => {
                        setActiveExperienceIndex(expIdx);
                        setActiveBulletIndex(bulletIdx);
                      }}
                      onParaphrase={handleParaphrase}
                      onRecommendJobDescription={handleRecommendJobDescription}
                      onUpdateBullet={(expIndex, bulletIndex, newValue) => {
                        const newExps = [...formData.experiences];
                        const newBullets = [...newExps[expIndex].bullet_points];
                        newBullets[bulletIndex] = newValue;
                        newExps[expIndex] = {
                          ...newExps[expIndex],
                          bullet_points: newBullets,
                        };
                        setFormData({ experiences: newExps });
                      }}
                      focusedIndex={focusedExperienceIndex}
                      onOpenExperience={(index) => {
                        setFocusedExperienceIndex(index);
                        setActiveExperienceIndex(index);
                      }}
                      onDoneEditing={() => setFocusedExperienceIndex(null)}
                    />
                  )}
                  {item.step === 3 && (
                    <EducationSection
                      educations={formData.educations}
                      onChange={(index, field, value) => {
                        const newEds = [...formData.educations];
                        newEds[index] = { ...newEds[index], [field]: value };
                        setFormData({ educations: newEds });
                      }}
                      onAdd={() => {
                        const newEd = {
                          school: "",
                          location: "",
                          school_type: "",
                          date_from: "",
                          date_to: "",
                          has_content: false,
                          content: "",
                        };
                        setFormData({
                          educations: [...formData.educations, newEd],
                        });
                      }}
                      onRemove={(index) => {
                        setFormData({
                          educations: formData.educations.filter(
                            (_, i) => i !== index,
                          ),
                        });
                      }}
                    />
                  )}
                  {item.step === 4 && (
                    <SkillsSection
                      skills={formData.skills || []}
                      onChange={(skills) => setFormData({ skills })}
                      onRecommendSkills={handleRecommendSkills}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {!isEditingExperience && step > 0 && (
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={step === 1}
                className="rounded-xl px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              {step !== 4 && (
                <Button
                  size="lg"
                  onClick={handleNext}
                  className="rounded-xl px-8 shadow-md"
                >
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
