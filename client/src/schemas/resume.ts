import { z } from "zod";

export const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  location: z.string().optional(),
  job_title: z.string().min(1, "Job title is required"),
  date_from: z.string().min(1, "Start date is required"),
  date_to: z.string().min(1, "End date is required"),
  bullet_points: z.array(z.string()).min(1, "At least one bullet point is required"),
});

export const educationSchema = z.object({
  school: z.string().min(1, "School name is required"),
  location: z.string().optional(),
  school_type: z.string().optional(),
  date_from: z.string().min(1, "Start date is required"),
  date_to: z.string().min(1, "End date is required"),
  has_content: z.boolean().default(false),
  content: z.string().optional(),
});

export const resumeSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  has_skill: z.boolean().default(true),
  skill_description: z.string().min(1, "Professional summary is required"),
  skills: z.array(z.string()).optional(),
  has_experience: z.boolean().default(true),
  experiences: z.array(experienceSchema),
  has_education: z.boolean().default(true),
  educations: z.array(educationSchema),
  job_description: z.string().optional(),
  target_role: z.string().optional(),
});

export type ResumeValues = z.infer<typeof resumeSchema>;
