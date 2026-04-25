import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  LoaderCircle,
  Check,
} from "lucide-react";
import { Badge } from "@/components/reui/badge";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
  StepperTitle,
} from "@/components/reui/stepper";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { generateResume, checkTaskStatus } from "@/api";
import ResumePreview from "@/components/ResumePreview";
import type { ResumeData, Experience, Education } from "@/api";

// Sub-components
import PersonalInfoSection from "@/components/builder/PersonalInfoSection";
import ExperienceSection from "@/components/builder/ExperienceSection";
import EducationSection from "@/components/builder/EducationSection";
import SkillsSection from "@/components/builder/SkillsSection";
import BuilderStatus from "@/components/builder/BuilderStatus";

/**
 * NewResume Page - Modular Workspace
 * Uses Resizable panels and extracted components for maintainability and premium UX.
 */
export default function NewResume() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("PENDING");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ResumeData>({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
    has_skill: true,
    skill_description: "",
    has_experience: true,
    experiences: [
      {
        company_name: "",
        location: "",
        job_title: "",
        date_from: "",
        date_to: "",
        bullet_points: [""],
      },
    ],
    has_education: true,
    educations: [
      {
        school: "",
        location: "",
        school_type: "",
        date_from: "",
        date_to: "",
        has_content: false,
        content: "",
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | string[],
  ) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          company_name: "",
          location: "",
          job_title: "",
          date_from: "",
          date_to: "",
          bullet_points: [""],
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string | boolean,
  ) => {
    const updatedEducations = [...formData.educations];
    updatedEducations[index] = { ...updatedEducations[index], [field]: value };
    setFormData((prev) => ({ ...prev, educations: updatedEducations }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          school: "",
          location: "",
          school_type: "",
          date_from: "",
          date_to: "",
          has_content: false,
          content: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const handleReset = () => {
    setStep(1);
    setIsGenerating(false);
    setStatus("PENDING");
    setTaskId(null);
    setFileUrl(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanedData = {
        ...formData,
        experiences: formData.experiences
          .map((exp) => ({
            ...exp,
            bullet_points: exp.bullet_points.filter((bp) => bp.trim() !== ""),
          }))
          .filter((exp) => exp.company_name || exp.job_title),
      };

      cleanedData.experiences.forEach((exp) => {
        if (exp.bullet_points.length === 0) {
          exp.bullet_points = ["General duties and responsibilities"];
        }
      });

      const result = await generateResume(cleanedData);
      setTaskId(result.task_id);
      setIsGenerating(true);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: number;
    if (
      taskId &&
      isGenerating &&
      status !== "SUCCESS" &&
      status !== "FAILURE"
    ) {
      interval = setInterval(async () => {
        try {
          const result = await checkTaskStatus(taskId);
          setStatus(result.status);
          if (result.status === "SUCCESS") {
            setFileUrl(result.file_url);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [taskId, isGenerating, status]);

  const sidebarItems = [
    { step: 1, label: "Personal", icon: User, description: "Contact details & address" },
    { step: 2, label: "Experience", icon: Briefcase, description: "Work history & achievements" },
    { step: 3, label: "Education", icon: GraduationCap, description: "Academic background" },
    { step: 4, label: "Skills", icon: Wrench, description: "Core competencies" },
  ];

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
        {/* Editor Area Panel */}
        <ResizablePanel defaultSize="65%">
          <main className="h-full bg-muted/5 flex flex-col overflow-hidden">
            <header className="h-14 border-b bg-background/50 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold">
                  {sidebarItems[step - 1]?.label}
                </h2>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-xs text-muted-foreground">
                  {sidebarItems[step - 1]?.description}
                </p>
              </div>
            </header>

            <ScrollArea className="flex-1 min-h-0">
              <div className="max-w-3xl mx-auto p-8 pb-32 space-y-12">
                {/* Stepper Navigation - Integrated into content */}
                <StepperNav className="w-full gap-3">
                  {sidebarItems.map((item, index) => (
                    <StepperItem
                      key={item.step}
                      step={item.step}
                      className="relative flex-1 items-start"
                    >
                      <StepperTrigger
                        className="flex grow flex-col items-start justify-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors hover:bg-secondary/20"
                        asChild
                      >
                        <div>
                          <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground data-[state=completed]:bg-success size-8 border-2 data-[state=completed]:text-white data-[state=inactive]:bg-transparent">
                            <item.icon className="size-4" />
                          </StepperIndicator>
                          <div className="flex flex-col items-start gap-1">
                            <div className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                              Step {item.step}
                            </div>
                            <StepperTitle className="group-data-[state=inactive]/step:text-muted-foreground text-start text-sm font-semibold">
                              {item.label}
                            </StepperTitle>
                            <div>
                              <Badge
                                size="xs"
                                variant="primary-light"
                                className="hidden group-data-[state=active]/step:inline-flex"
                              >
                                In Progress
                              </Badge>
                              <Badge
                                variant="success-light"
                                size="xs"
                                className="hidden group-data-[state=completed]/step:inline-flex"
                              >
                                Completed
                              </Badge>
                              <Badge
                                variant="secondary"
                                size="xs"
                                className="text-muted-foreground hidden group-data-[state=inactive]/step:inline-flex"
                              >
                                Pending
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </StepperTrigger>

                      {sidebarItems.length > index + 1 && (
                        <StepperSeparator className="group-data-[state=completed]/step:bg-success absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none" />
                      )}
                    </StepperItem>
                  ))}
                </StepperNav>

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
                    value={formData.skill_description}
                    onChange={handleInputChange}
                  />
                </StepperContent>

                {/* Navigation buttons at bottom of form */}
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Area Panel */}
        <ResizablePanel defaultSize="30%">
          <aside className="h-full border-l bg-muted/30 flex flex-col overflow-hidden">
            <header className="h-14 border-b bg-background/50 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold">Live Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <Separator orientation="vertical" className="h-4" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  A4 Layout
                </span>
              </div>
            </header>
            <ScrollArea className="flex-1 bg-slate-200/50">
              <div className="p-8 flex justify-center">
                <div className="shadow-2xl rounded-sm bg-white min-h-[1123px] w-full max-w-[794px]">
                  <ResumePreview data={formData} />
                </div>
              </div>
            </ScrollArea>
          </aside>
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
