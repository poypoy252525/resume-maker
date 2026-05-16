import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, AIFeedback } from "@/api";
import {
  generateResume,
  checkTaskStatus,
  analyzeResume,
  paraphraseBullet,
  recommendJobDescription,
  recommendSkills,
  checkTaskResult,
} from "@/api";

interface ResumeState {
  // Data
  formData: ResumeData;
  step: number; // 1-4, or 0 if collapsed
  activeExperienceIndex: number | null;
  activeBulletIndex: number | null;
  focusedExperienceIndex: number | null;

  // Status
  isGenerating: boolean;
  loading: boolean;
  isDownloading: boolean;
  taskId: string | null;
  fileUrl: string | null;
  status: string;
  error: string | null;
  isReviewModalOpen: boolean;

  // Actions
  setStep: (step: number) => void;
  setFormData: (
    data: Partial<ResumeData> | ((prev: ResumeData) => ResumeData),
  ) => void;
  setActiveExperienceIndex: (index: number | null) => void;
  setActiveBulletIndex: (index: number | null) => void;
  setFocusedExperienceIndex: (index: number | null) => void;
  setReviewModalOpen: (open: boolean) => void;

  // Async Actions
  triggerAIAnalysis: () => Promise<void>;
  handleParaphrase: (bulletPoint: string) => Promise<string[] | null>;
  handleRecommendJobDescription: (jobTitle: string) => Promise<string[] | null>;
  handleRecommendSkills: () => Promise<string[] | null>;
  handleSubmit: (format?: "pdf" | "docx") => Promise<void>;
  handleReset: () => void;

  // Helpers
  pollTask: <T>(
    taskId: string,
    interval?: number,
    maxRetries?: number,
  ) => Promise<T>;
  updateStatus: (taskId: string) => Promise<void>;
}

const initialFormData: ResumeData = {
  full_name: "",
  email: "",
  phone_number: "",
  location: "",
  has_skill: true,
  skill_description: "",
  skills: [],
  has_experience: true,
  experiences: [],
  has_education: true,
  educations: [],
  job_description: "",
  target_role: "",
  ai_feedback: undefined,
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      // State
      formData: initialFormData,
      step: 1,
      activeExperienceIndex: null,
      activeBulletIndex: null,
      focusedExperienceIndex: null,
      isGenerating: false,
      loading: false,
      isDownloading: false,
      taskId: null,
      fileUrl: null,
      status: "PENDING",
      error: null,
      isReviewModalOpen: false,

      // Actions
      setStep: (step) => set({ step }),

      setFormData: (data) => {
        if (typeof data === "function") {
          set((state) => ({ formData: data(state.formData) }));
        } else {
          set((state) => ({ formData: { ...state.formData, ...data } }));
        }
      },

      setActiveExperienceIndex: (index) =>
        set({ activeExperienceIndex: index }),
      setActiveBulletIndex: (index) => set({ activeBulletIndex: index }),
      setFocusedExperienceIndex: (index) =>
        set({ focusedExperienceIndex: index }),
      setReviewModalOpen: (open) => set({ isReviewModalOpen: open }),

      handleReset: () =>
        set({
          step: 1,
          isGenerating: false,
          status: "PENDING",
          taskId: null,
          fileUrl: null,
          error: null,
          formData: initialFormData,
        }),

      pollTask: async (taskId, interval = 2000, maxRetries = 60) => {
        for (let i = 0; i < maxRetries; i++) {
          const result = await checkTaskResult(taskId);
          if (result.status === "SUCCESS") return result.result;
          if (result.status === "FAILURE")
            throw new Error(result.error || "Task failed");
          await new Promise((resolve) => setTimeout(resolve, interval));
        }
        throw new Error("Task timed out");
      },

      updateStatus: async (taskId) => {
        try {
          const result = await checkTaskStatus(taskId);
          set({ status: result.status });
          if (result.status === "SUCCESS") {
            set({ fileUrl: result.file_url });
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      },

      triggerAIAnalysis: async () => {
        const { formData, pollTask, setReviewModalOpen } = get();
        set({ loading: true, error: null });
        setReviewModalOpen(true);
        try {
          const { task_id } = await analyzeResume(
            formData,
            formData.job_description || "",
            formData.target_role || "",
          );
          const feedback = await pollTask<AIFeedback>(task_id);
          set((state) => ({
            formData: { ...state.formData, ai_feedback: feedback },
          }));
        } catch (err: unknown) {
          set({ error: (err as Error).message || "AI analysis failed" });
        } finally {
          set({ loading: false });
        }
      },

      handleParaphrase: async (bulletPoint) => {
        const { formData, pollTask } = get();
        set({ loading: true });
        try {
          const { task_id } = await paraphraseBullet(
            bulletPoint,
            formData.job_description || "",
            formData.target_role || "",
          );
          const result = await pollTask<{ suggestions: string[] }>(task_id);
          return result.suggestions;
        } catch (err: unknown) {
          set({ error: (err as Error).message || "Paraphrasing failed" });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      handleRecommendJobDescription: async (jobTitle) => {
        const { formData, pollTask } = get();
        set({ loading: true });
        try {
          const { task_id } = await recommendJobDescription(
            jobTitle,
            formData.job_description || "",
            formData.target_role || "",
          );
          const result = await pollTask<{ job_description: string[] }>(task_id);
          return result.job_description;
        } catch (err: unknown) {
          set({
            error:
              (err as Error).message || "Failed to generate recommendations",
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      handleRecommendSkills: async () => {
        const { formData, pollTask } = get();
        set({ loading: true });
        try {
          const { task_id } = await recommendSkills(
            formData.target_role || "Professional",
            formData.job_description || "",
          );
          const result = await pollTask<{ recommended_skills: string[] }>(
            task_id,
          );
          return result.recommended_skills;
        } catch (err: unknown) {
          set({
            error: (err as Error).message || "Failed to recommend skills",
          });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      handleSubmit: async (format: "pdf" | "docx" = "pdf") => {
        const { formData } = get();
        set({ isDownloading: true, error: null, fileUrl: null });
        try {
          const cleanedData = {
            ...formData,
            experiences: formData.experiences
              .map((exp) => ({
                ...exp,
                bullet_points: exp.bullet_points.filter(
                  (bp) => bp.trim() !== "",
                ),
              }))
              .filter((exp) => exp.company_name || exp.job_title),
          };

          cleanedData.experiences.forEach((exp) => {
            if (exp.bullet_points.length === 0) {
              exp.bullet_points = ["General duties and responsibilities"];
            }
          });

          const result = await generateResume(cleanedData);
          const taskId = result.task_id;
          set({ taskId, status: "PENDING" });

          // Poll until success
          let pollRetries = 0;
          const maxRetries = 30; // 60 seconds total (2s interval)

          const poll = async (): Promise<string> => {
            const res = await checkTaskStatus(taskId, format);
            if (res.status === "SUCCESS") return res.file_url;
            if (res.status === "FAILURE")
              throw new Error(res.error || "Generation failed");

            if (pollRetries >= maxRetries)
              throw new Error("Generation timed out. Please try again.");

            pollRetries++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return poll();
          };

          const fileUrl = await poll();
          set({ fileUrl, status: "SUCCESS", isGenerating: false });

          // Trigger direct download
          const link = document.createElement("a");
          link.href = fileUrl;
          link.setAttribute(
            "download",
            `${formData.full_name.replace(/\s+/g, "_")}_Resume.${format}`,
          );
          link.setAttribute("target", "_blank");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err: unknown) {
          set({ error: (err as Error).message || "Something went wrong" });
        } finally {
          set({ isDownloading: false });
        }
      },
    }),
    {
      name: "resume-storage",
      partialize: (state) => ({ formData: state.formData }),
    },
  ),
);
