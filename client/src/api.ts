const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

export interface Experience {
  company_name: string;
  location: string;
  job_title: string;
  date_from: string;
  date_to: string;
  bullet_points: string[];
}

export interface Education {
  school: string;
  location: string;
  school_type: string;
  date_from: string;
  date_to: string;
  has_content: boolean;
  content?: string;
}

export interface AIFeedback {
  ats_score: number;
  keyword_match: string[];
  missing_keywords: string[];
  suggestions: string[];
  recommended_skills: string[];
  skills_reasoning?: string;
}

export interface ResumeData {
  id?: string;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  has_skill: boolean;
  skill_description: string;
  skills?: string[];
  has_experience: boolean;
  experiences: Experience[];
  has_education: boolean;
  educations: Education[];
  job_description?: string;
  target_role?: string;
  ai_feedback?: AIFeedback;
}

export const generateResume = async (data: ResumeData) => {
  const response = await fetch(`${API_BASE_URL}/resumes/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to generate resume");
  }

  return response.json();
};

export const checkTaskStatus = async (taskId: string, format: string = "pdf") => {
  const response = await fetch(`${API_BASE_URL}/resumes/status/${taskId}/${format}/`);
  if (!response.ok) {
    throw new Error("Failed to check task status");
  }
  return response.json();
};

export const checkTaskResult = async (taskId: string) => {
  const response = await fetch(`${API_BASE_URL}/resumes/task-status/${taskId}/`);
  if (!response.ok) {
    throw new Error("Failed to check task result");
  }
  return response.json();
};

export const analyzeResume = async (resumeData: ResumeData, jobDescription: string, targetRole: string): Promise<{ task_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/analyze/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resume_data: resumeData,
      job_description: jobDescription,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze resume");
  }

  return response.json();
};

export const paraphraseBullet = async (bulletPoint: string, jobDescription: string, targetRole: string): Promise<{ task_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/paraphrase/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bullet_point: bulletPoint,
      job_description: jobDescription,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to paraphrase description");
  }

  return response.json();
};

export const recommendJobDescription = async (jobTitle: string, jobDescription: string, targetRole: string): Promise<{ task_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/recommend_job_description/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_title: jobTitle,
      job_description: jobDescription,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to recommend job description");
  }

  return response.json();
};

export const recommendSkills = async (targetRole: string, jobDescription: string): Promise<{ task_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/recommend_skills/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target_role: targetRole,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to recommend skills");
  }

  return response.json();
};
