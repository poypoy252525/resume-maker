import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Wand2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateResume, checkTaskStatus } from "@/api";
import type { ResumeData, Experience, Education } from "@/api";

/**
 * NewResume Page - Refactored Structure
 * Uses Shadcn components for a consistent, premium UI.
 */
export default function NewResume() {
  const [step, setStep] = useState(1);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | string[]
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
    value: string | boolean
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
      setStep(5);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    let interval: number;
    if (taskId && step === 5 && status !== "SUCCESS" && status !== "FAILURE") {
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

  // Sidebar navigation items
  const sidebarItems = [
    { id: 1, label: "Personal", icon: User },
    { id: 2, label: "Experience", icon: Briefcase },
    { id: 3, label: "Education", icon: GraduationCap },
    { id: 4, label: "Skills", icon: Wrench },
  ];

  if (step === 5) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-xl border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              {status === "SUCCESS" ? (
                <div className="bg-green-500/10 p-4 rounded-full">
                  <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
              ) : status === "FAILURE" ? (
                <div className="bg-destructive/10 p-4 rounded-full">
                  <Trash2 className="w-16 h-16 text-destructive" />
                </div>
              ) : (
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {status === "SUCCESS"
                ? "Resume Ready!"
                : status === "FAILURE"
                ? "Generation Failed"
                : "Generating Resume..."}
            </CardTitle>
            <CardDescription className="text-base">
              {status === "PENDING" 
                ? "Our AI is crafting your professional story..." 
                : `Task ID: ${taskId}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground">
              {status === "SUCCESS"
                ? "Your professional resume has been generated successfully and is ready for download."
                : status === "FAILURE"
                ? "Something went wrong during the generation process. Please try again."
                : "We are optimizing every word for ATS and human recruiters. This usually takes less than a minute."}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {status === "SUCCESS" && fileUrl && (
                <Button asChild size="lg" className="px-8">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setStep(1);
                  setStatus("PENDING");
                  setTaskId(null);
                  setFileUrl(null);
                }}
              >
                {status === "SUCCESS" ? "Create Another" : "Try Again"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 h-full">
      <div className="flex flex-col md:flex-row gap-8 h-full max-w-6xl mx-auto">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 space-y-1">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={step === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start gap-3 h-12 text-sm rounded-xl transition-all ${
                step === item.id 
                  ? "bg-secondary font-semibold" 
                  : "text-muted-foreground"
              }`}
              onClick={() => setStep(item.id)}
            >
              <item.icon className={`w-4 h-4 ${step === item.id ? "text-primary" : ""}`} />
              {item.label}
            </Button>
          ))}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Card className="shadow-lg border-border/40 overflow-hidden h-fit flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {step === 1 && "Personal Information"}
                {step === 2 && "Work Experience"}
                {step === 3 && "Education History"}
                {step === 4 && "Skills & Expertise"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Start with your contact details so employers can reach you."}
                {step === 2 && "Highlight your professional achievements and roles."}
                {step === 3 && "Tell us about your academic background."}
                {step === 4 && "List your core competencies and tools."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden">
              <ScrollArea className="h-full pr-4 pb-4">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        placeholder="John Doe"
                        value={formData.full_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number</Label>
                      <Input
                        id="phone_number"
                        name="phone_number"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="New York, NY"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {formData.experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="p-5 border rounded-xl relative bg-muted/20 group transition-colors hover:bg-muted/30"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={exp.company_name}
                              onChange={(e) => handleExperienceChange(index, "company_name", e.target.value)}
                              placeholder="Acme Inc"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Job Title</Label>
                            <Input
                              value={exp.job_title}
                              onChange={(e) => handleExperienceChange(index, "job_title", e.target.value)}
                              placeholder="Senior Developer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                              placeholder="Remote"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>From</Label>
                              <Input
                                value={exp.date_from}
                                onChange={(e) => handleExperienceChange(index, "date_from", e.target.value)}
                                placeholder="Jan 2020"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>To</Label>
                              <Input
                                value={exp.date_to}
                                onChange={(e) => handleExperienceChange(index, "date_to", e.target.value)}
                                placeholder="Present"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 space-y-3">
                          <Label className="text-sm font-semibold">Bullet Points</Label>
                          {exp.bullet_points.map((bp, bpIndex) => (
                            <div key={bpIndex} className="flex gap-2">
                              <Input
                                value={bp}
                                onChange={(e) => {
                                  const newBullets = [...exp.bullet_points];
                                  newBullets[bpIndex] = e.target.value;
                                  handleExperienceChange(index, "bullet_points", newBullets);
                                }}
                                placeholder="Describe your achievement..."
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newBullets = exp.bullet_points.filter((_, i) => i !== bpIndex);
                                  handleExperienceChange(index, "bullet_points", newBullets);
                                }}
                                disabled={exp.bullet_points.length === 1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 h-8 border-dashed"
                            onClick={() => handleExperienceChange(index, "bullet_points", [...exp.bullet_points, ""])}
                          >
                            <Plus className="w-3 h-3 mr-2" /> Add Bullet Point
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full h-12 border-dashed rounded-xl"
                      onClick={addExperience}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Professional Experience
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {formData.educations.map((edu, index) => (
                      <div
                        key={index}
                        className="p-5 border rounded-xl relative bg-muted/20 group transition-colors hover:bg-muted/30"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>School</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) => handleEducationChange(index, "school", e.target.value)}
                              placeholder="University of Technology"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree / Certification</Label>
                            <Input
                              value={edu.school_type}
                              onChange={(e) => handleEducationChange(index, "school_type", e.target.value)}
                              placeholder="Bachelor of Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                              placeholder="Boston, MA"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                              <Label>From</Label>
                              <Input
                                value={edu.date_from}
                                onChange={(e) => handleEducationChange(index, "date_from", e.target.value)}
                                placeholder="2016"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>To</Label>
                              <Input
                                value={edu.date_to}
                                onChange={(e) => handleEducationChange(index, "date_to", e.target.value)}
                                placeholder="2020"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full h-12 border-dashed rounded-xl"
                      onClick={addEducation}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Education
                    </Button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-3">
                      <Label htmlFor="skill_description" className="text-lg">Skills & Summary</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        List your core competencies, technologies, and a brief professional summary.
                      </p>
                      <Textarea
                        id="skill_description"
                        name="skill_description"
                        placeholder="e.g. JavaScript, React, Python, UI Design, Project Management..."
                        className="min-h-60 rounded-xl resize-none"
                        value={formData.skill_description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>

            <Separator />
            
            <CardFooter className="flex justify-between py-6 px-6 bg-muted/5">
              <Button
                variant="outline"
                size="lg"
                onClick={prevStep}
                disabled={step === 1 || loading}
                className="rounded-xl px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              {step < 4 ? (
                <Button size="lg" onClick={nextStep} className="rounded-xl px-8">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-xl px-8 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <>Generating...</>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Resume
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {error && (
            <Alert variant="destructive" className="mt-4 animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </main>
      </div>
    </div>
  );
}
