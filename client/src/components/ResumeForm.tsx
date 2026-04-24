import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, Briefcase, GraduationCap, User, Wrench } from "lucide-react";
import { generateResume, checkTaskStatus } from "@/api";
import type { ResumeData, Experience, Education } from "@/api";
import { useEffect } from 'react';

const ResumeForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('PENDING');
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
      // Filter out empty bullet points and ensure at least one non-empty string if required,
      // or filter out experiences/educations if they are essentially empty.
      const cleanedData = {
        ...formData,
        experiences: formData.experiences.map(exp => ({
          ...exp,
          bullet_points: exp.bullet_points.filter(bp => bp.trim() !== '')
        })).filter(exp => exp.company_name || exp.job_title) // Optional: filter empty exp
      };

      // If backend requires bullet_points to have at least one item, 
      // we should ensure it's not empty if we kept the experience.
      cleanedData.experiences.forEach(exp => {
        if (exp.bullet_points.length === 0) {
          exp.bullet_points = ["General duties and responsibilities"]; // Fallback or handle error
        }
      });

      const result = await generateResume(cleanedData);
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

  useEffect(() => {
    let interval: number;
    if (taskId && step === 5 && status !== 'SUCCESS' && status !== 'FAILURE') {
      interval = setInterval(async () => {
        try {
          const result = await checkTaskStatus(taskId);
          setStatus(result.status);
          if (result.status === 'SUCCESS') {
            setFileUrl(result.file_url);
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [taskId, step, status]);

  if (step === 5) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 border-accent/20 shadow-xl bg-card/50 backdrop-blur-sm animate-in fade-in zoom-in duration-500">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'SUCCESS' ? (
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            ) : status === 'FAILURE' ? (
              <Trash2 className="w-20 h-20 text-destructive" />
            ) : (
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
          <CardTitle className="text-3xl font-bold">
            {status === 'SUCCESS' ? "Resume Ready!" : status === 'FAILURE' ? "Generation Failed" : "Generating Resume..."}
          </CardTitle>
          <CardDescription className="text-lg">
            Task ID: <code className="bg-muted px-2 py-1 rounded">{taskId}</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-10">
          <p className="text-muted-foreground mb-6">
            {status === 'SUCCESS' 
              ? "Your professional resume has been generated successfully." 
              : status === 'FAILURE' 
              ? "Something went wrong during the generation process." 
              : "We are crafting your story. This usually takes a few seconds."}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {status === 'SUCCESS' && fileUrl && (
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                  Download PDF
                </a>
              </Button>
            )}
            <Button variant="outline" onClick={() => {
              setStep(1);
              setStatus('PENDING');
              setTaskId(null);
              setFileUrl(null);
            }}>
              {status === 'SUCCESS' ? "Create Another" : "Try Again"}
            </Button>
          </div>
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

                      <div className="mt-4 space-y-2">
                        <Label>Bullet Points</Label>
                        {exp.bullet_points.map((bp, bpIndex) => (
                          <div key={bpIndex} className="flex gap-2 mb-2">
                            <Input
                              value={bp}
                              onChange={(e) => {
                                const newBullets = [...exp.bullet_points];
                                newBullets[bpIndex] = e.target.value;
                                handleExperienceChange(index, 'bullet_points', newBullets);
                              }}
                              placeholder="Describe your achievement..."
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newBullets = exp.bullet_points.filter((_, i) => i !== bpIndex);
                                handleExperienceChange(index, 'bullet_points', newBullets);
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
                          className="mt-2"
                          onClick={() => {
                            handleExperienceChange(index, 'bullet_points', [...exp.bullet_points, '']);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-2" /> Add Bullet Point
                        </Button>
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
