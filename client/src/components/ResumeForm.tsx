import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, GraduationCap, User, Wrench } from "lucide-react";
import { generateResume } from "@/api";
import type { ResumeData, Experience, Education } from "@/api";

const ResumeForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ResumeData>({
    full_name: '',
    email: '',
    phone_number: '',
    location: '',
    has_skill: true,
    skill_description: '',
    has_experience: true,
    experiences: [{
      company_name: '',
      location: '',
      job_title: '',
      date_from: '',
      date_to: '',
      bullet_points: ['']
    }],
    has_education: true,
    educations: [{
      school: '',
      location: '',
      school_type: '',
      date_from: '',
      date_to: '',
      has_content: false,
      content: ''
    }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string | string[]) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    setFormData(prev => ({ ...prev, experiences: updatedExperiences }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        company_name: '',
        location: '',
        job_title: '',
        date_from: '',
        date_to: '',
        bullet_points: ['']
      }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string | boolean) => {
    const updatedEducations = [...formData.educations];
    updatedEducations[index] = { ...updatedEducations[index], [field]: value };
    setFormData(prev => ({ ...prev, educations: updatedEducations }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      educations: [...prev.educations, {
        school: '',
        location: '',
        school_type: '',
        date_from: '',
        date_to: '',
        has_content: false,
        content: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateResume(formData);
      setTaskId(result.task_id);
      setStep(5); // Success step
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (step === 5) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 border-accent/20 shadow-xl bg-card/50 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold">Resume Generation Started!</CardTitle>
          <CardDescription className="text-lg">
            Your resume is being processed. Task ID: <code className="bg-muted px-2 py-1 rounded">{taskId}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-10">
          <p className="text-muted-foreground mb-6">
            We are generating a professional PDF for you. This might take a few moments.
          </p>
          <Button variant="outline" onClick={() => setStep(1)}>
            Create Another Resume
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          Resume Architect
        </h1>
        <p className="text-xl text-muted-foreground">
          Craft your professional story in minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Progress Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="sticky top-10 space-y-2">
            {[
              { id: 1, label: 'Personal', icon: User },
              { id: 2, label: 'Experience', icon: Briefcase },
              { id: 3, label: 'Education', icon: GraduationCap },
              { id: 4, label: 'Skills', icon: Wrench },
            ].map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step === s.id ? 'bg-primary text-primary-foreground shadow-md scale-105' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <s.icon className="w-5 h-5" />
                <span className="font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="md:col-span-3 shadow-2xl border-primary/10 overflow-hidden bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">
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
          <CardContent className="space-y-6">
            <ScrollArea className="h-125 pr-4">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-300">
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
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  {formData.experiences.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-xl relative bg-muted/30 group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeExperience(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company_name}
                            onChange={(e) => handleExperienceChange(index, 'company_name', e.target.value)}
                            placeholder="Acme Inc"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.job_title}
                            onChange={(e) => handleExperienceChange(index, 'job_title', e.target.value)}
                            placeholder="Senior Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                            placeholder="Remote"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>From</Label>
                            <Input
                              value={exp.date_from}
                              onChange={(e) => handleExperienceChange(index, 'date_from', e.target.value)}
                              placeholder="Jan 2020"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>To</Label>
                            <Input
                              value={exp.date_to}
                              onChange={(e) => handleExperienceChange(index, 'date_to', e.target.value)}
                              placeholder="Present"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed" onClick={addExperience}>
                    <Plus className="w-4 h-4 mr-2" /> Add Experience
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  {formData.educations.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-xl relative bg-muted/30 group">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeEducation(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>School</Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                            placeholder="University of Technology"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>School Type</Label>
                          <Input
                            value={edu.school_type}
                            onChange={(e) => handleEducationChange(index, 'school_type', e.target.value)}
                            placeholder="Bachelor of Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={edu.location}
                            onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                            placeholder="Boston, MA"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-2">
                            <Label>From</Label>
                            <Input
                              value={edu.date_from}
                              onChange={(e) => handleEducationChange(index, 'date_from', e.target.value)}
                              placeholder="2016"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>To</Label>
                            <Input
                              value={edu.date_to}
                              onChange={(e) => handleEducationChange(index, 'date_to', e.target.value)}
                              placeholder="2020"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full border-dashed" onClick={addEducation}>
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                  </Button>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label htmlFor="skill_description">Skills & Summary</Label>
                    <Textarea
                      id="skill_description"
                      name="skill_description"
                      placeholder="e.g. JavaScript, React, Python, UI Design, Project Management..."
                      className="min-h-50"
                      value={formData.skill_description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between py-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            
            {step < 4 ? (
              <Button onClick={nextStep}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="bg-linear-to-r from-primary to-accent hover:opacity-90">
                {loading ? "Generating..." : "Generate Resume"}
              </Button>
            )}
          </CardFooter>
          {error && <div className="p-4 text-center text-destructive font-medium bg-destructive/10">{error}</div>}
        </Card>
      </div>
    </div>
  );
};

export default ResumeForm;
