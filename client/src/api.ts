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
  review?: {
    overview: string;
    what_to_improve?: string;
    section_analysis: {
      section_name: string;
      score: number;
      what_to_improve: string;
    }[];
  };
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
  template?: "modern" | "classic" | "minimal";
}

export const generateResume = async (data: ResumeData) => {
  const response = await fetch(`${API_BASE_URL}/resumes/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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

export const paraphraseBullet = async (bulletPoint: string, jobDescription: string, targetRole: string): Promise<{ suggestions: string[] }> => {
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

export const recommendJobDescription = async (jobTitle: string, jobDescription: string, targetRole: string): Promise<{ job_description: string[] }> => {
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

export const recommendSkills = async (targetRole: string, jobDescription: string): Promise<{ recommended_skills: string[] }> => {
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

export const recommendSummary = async (
  resumeData: ResumeData,
  targetRole: string,
  jobDescription: string,
): Promise<{ summary: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/recommend_summary/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      resume_data: resumeData,
      target_role: targetRole,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to recommend summary");
  }

  return response.json();
};

export interface ResumeResponse {
  id: string;
  title: string;
  data: ResumeData;
  file: string | null;
  status: string;
  score: number;
  is_favorite: boolean;
  updated_at: string;
}

export interface ActivityResponse {
  id: number;
  activity_type: string;
  label: string;
  sub: string;
  created_at: string;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const fetchResumes = async (): Promise<ResumeResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/resumes/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch resumes");
  }
  return response.json();
};

export const toggleFavoriteResume = async (id: string, isFavorite: boolean): Promise<ResumeResponse> => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ is_favorite: isFavorite }),
  });
  if (!response.ok) {
    throw new Error("Failed to update resume");
  }
  return response.json();
};

export const fetchActivities = async (): Promise<ActivityResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/activities/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
};

export const fetchResume = async (id: string): Promise<ResumeResponse> => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }
  return response.json();
};

export const createResume = async (title: string, data: ResumeData): Promise<ResumeResponse> => {
  const response = await fetch(`${API_BASE_URL}/resumes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, data }),
  });
  if (!response.ok) {
    throw new Error("Failed to save resume");
  }
  return response.json();
};

export const updateResume = async (id: string, title: string, data: ResumeData): Promise<ResumeResponse> => {
  const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title, data }),
  });
  if (!response.ok) {
    throw new Error("Failed to update resume");
  }
  return response.json();
};

export interface PublicStatsResponse {
  resumes_built: number;
  success_rate: number;
  active_users: number;
  ats_pass_rate: number;
}

export const fetchPublicStats = async (): Promise<PublicStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/public-stats/`);
  if (!response.ok) {
    throw new Error("Failed to fetch public stats");
  }
  return response.json();
};

export interface TailoredExperience {
  index: number;
  original_bullets: string[];
  tailored_bullets: string[];
  reasoning: string;
}

export interface TailoredResumeResult {
  tailored_summary: string;
  tailored_experiences: TailoredExperience[];
  skills_to_add: string[];
}

export const tailorResume = async (
  resumeData: ResumeData,
  jobDescription: string,
  targetRole: string
): Promise<{ task_id: string }> => {
  const response = await fetch(`${API_BASE_URL}/resumes/tailor/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      resume_data: resumeData,
      job_description: jobDescription,
      target_role: targetRole,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to tailor resume");
  }

  return response.json();
};



