import { useState, useEffect } from "react";
import { generateResume, checkTaskStatus } from "@/api";
import type { ResumeData, Experience, Education } from "@/api";

export function useResumeBuilder() {
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
    setError(null);
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
      interval = window.setInterval(async () => {
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
    return () => window.clearInterval(interval);
  }, [taskId, isGenerating, status]);

  return {
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
  };
}
