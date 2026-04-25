import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wand2,
  AlertCircle,
  Eye,
  Settings2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [step, setStep] = useState("personal");
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
    setStep("personal");
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
      setStep("generating");
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
      step === "generating" &&
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
  }, [taskId, step, status]);

  const sidebarItems = [
    { id: "personal", label: "Personal", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
  ];

  if (step === "generating") {
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
    <div className="h-full w-full">
      <ResizablePanelGroup
        orientation="horizontal"
        className="h-full w-full items-stretch"
      >
        {/* Sidebar Panel */}
        <ResizablePanel defaultSize="20%" maxSize="30%">
          <aside className="h-full w-full bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Settings2 className="w-3 h-3" />
                Configuration
              </div>
            </div>

            <Tabs
              value={step}
              onValueChange={setStep}
              orientation="vertical"
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="flex flex-col h-auto bg-transparent p-2 gap-1">
                {sidebarItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="w-full justify-start gap-3 h-10 px-3 data-[state=active]:bg-secondary data-[state=active]:text-primary"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="mt-auto p-4 border-t">
              <Button
                className="w-full gap-2 shadow-lg shadow-primary/10"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                Generate PDF
              </Button>
            </div>
          </aside>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Editor Area Panel */}
        <ResizablePanel defaultSize="50%">
          <main className="h-full bg-muted/5 flex flex-col overflow-hidden">
            <header className="h-14 border-b bg-background/50 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold capitalize">{step}</h2>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-xs text-muted-foreground">
                  {step === "personal" && "Contact details & address"}
                  {step === "experience" && "Work history & achievements"}
                  {step === "education" && "Academic background"}
                  {step === "skills" && "Core competencies"}
                </p>
              </div>
            </header>

            <ScrollArea className="flex-1">
              <div className="max-w-3xl mx-auto p-8 space-y-8">
                {step === "personal" && (
                  <PersonalInfoSection
                    data={formData}
                    onChange={handleInputChange}
                  />
                )}
                {step === "experience" && (
                  <ExperienceSection
                    experiences={formData.experiences}
                    onChange={handleExperienceChange}
                    onAdd={addExperience}
                    onRemove={removeExperience}
                  />
                )}
                {step === "education" && (
                  <EducationSection
                    educations={formData.educations}
                    onChange={handleEducationChange}
                    onAdd={addEducation}
                    onRemove={removeEducation}
                  />
                )}
                {step === "skills" && (
                  <SkillsSection
                    value={formData.skill_description}
                    onChange={handleInputChange}
                  />
                )}

                {/* Navigation buttons at bottom of form */}
                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const sections = [
                        "personal",
                        "experience",
                        "education",
                        "skills",
                      ];
                      const currentIndex = sections.indexOf(step);
                      if (currentIndex > 0) setStep(sections[currentIndex - 1]);
                    }}
                    disabled={step === "personal"}
                    className="rounded-xl px-6"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>

                  {step !== "skills" ? (
                    <Button
                      size="lg"
                      onClick={() => {
                        const sections = [
                          "personal",
                          "experience",
                          "education",
                          "skills",
                        ];
                        const currentIndex = sections.indexOf(step);
                        if (currentIndex < sections.length - 1)
                          setStep(sections[currentIndex + 1]);
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
            <div className="flex-1 overflow-hidden p-6 bg-slate-200/50">
              <div className="h-full shadow-2xl rounded-sm overflow-hidden scale-[0.95] origin-top">
                <ResumePreview data={formData} />
              </div>
            </div>
          </aside>
        </ResizablePanel>
      </ResizablePanelGroup>

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
