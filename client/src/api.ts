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

export interface ResumeData {
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  has_skill: boolean;
  skill_description: string;
  has_experience: boolean;
  experiences: Experience[];
  has_education: boolean;
  educations: Education[];
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

export const checkTaskStatus = async (taskId: string) => {
  const response = await fetch(`${API_BASE_URL}/resumes/status/${taskId}/`);
  if (!response.ok) {
    throw new Error("Failed to check task status");
  }
  return response.json();
};
