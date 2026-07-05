import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, AIFeedback, TailoredResumeResult } from "@/api";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import {
  generateResume,
  checkTaskStatus,
  analyzeResume,
  paraphraseBullet,
  recommendJobDescription,
  recommendSkills,
  recommendSummary,
  checkTaskResult,
  fetchResume,
  createResume,
  updateResume,
  tailorResume,
  importResumePdf,
} from "@/api";


interface ResumeState {
  // Data
  formData: ResumeData;
  step: number; // 1-4, or 0 if collapsed
  activeExperienceIndex: number | null;
  activeBulletIndex: number | null;
  focusedExperienceIndex: number | null;

  // Data
  resumeId: string | null;
  resumeTitle: string;

  // Status
  isGenerating: boolean;
  loading: boolean;
  isDownloading: boolean;
  isSaving: boolean;
  taskId: string | null;
  fileUrl: string | null;
  status: string;
  error: string | null;
  isImporting: boolean;
  isReviewModalOpen: boolean;
  isAIAnalyzing: boolean;
  showTemplatePicker: boolean;
  isRecommendingSummary: boolean;
  isTailoring: boolean;
  isTailorModalOpen: boolean;
  tailorResult: TailoredResumeResult | null;

  // Actions
  setShowTemplatePicker: (show: boolean) => void;
  setStep: (step: number) => void;
  setFormData: (
    data: Partial<ResumeData> | ((prev: ResumeData) => ResumeData),
  ) => void;
  setActiveExperienceIndex: (index: number | null) => void;
  setActiveBulletIndex: (index: number | null) => void;
  setFocusedExperienceIndex: (index: number | null) => void;
  setReviewModalOpen: (open: boolean) => void;
  setTailorModalOpen: (open: boolean) => void;
  setResumeTitle: (title: string) => void;

  // Async Actions
  triggerAIAnalysis: () => Promise<void>;
  triggerTailorResume: () => Promise<void>;
  applyTailoredResume: (selectedExperienceIndexes: number[], applySummary: boolean, applySkills: boolean) => void;
  handleParaphrase: (bulletPoint: string, jobTitle: string) => Promise<string[] | null>;
  handleRecommendJobDescription: (jobTitle: string) => Promise<string[] | null>;
  handleRecommendSkills: () => Promise<string[] | null>;
  handleRecommendSummary: () => Promise<string | null>;
  handleSubmit: (format?: "pdf" | "docx") => Promise<void>;
  handleReset: () => void;
  loadResume: (id: string) => Promise<void>;
  saveResume: () => Promise<string | null>;
  importResume: (file: File) => Promise<void>;


  // Helpers
  pollTask: <T>(
    taskId: string,
    interval?: number,
    maxRetries?: number,
  ) => Promise<T>;
  updateStatus: (taskId: string) => Promise<void>;

  // PDF Preview State & Actions
  pdfPreviewUrl: string | null;
  isCompilingPdf: boolean;
  compileError: string | null;
  compilePdf: () => Promise<void>;
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
  template: "modern",
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      // State
      formData: initialFormData,
      resumeId: null,
      resumeTitle: "Untitled Resume",
      step: 1,
      activeExperienceIndex: null,
      activeBulletIndex: null,
      focusedExperienceIndex: null,
      isGenerating: false,
      loading: false,
      isDownloading: false,
      isSaving: false,
      taskId: null,
      fileUrl: null,
      status: "PENDING",
      error: null,
      isReviewModalOpen: false,
      isAIAnalyzing: false,
      showTemplatePicker: true,
      isRecommendingSummary: false,
      isTailoring: false,
      isTailorModalOpen: false,
      tailorResult: null,
      isImporting: false,
      pdfPreviewUrl: null,
      isCompilingPdf: false,
      compileError: null,


      // Actions
      setShowTemplatePicker: (show) => set({ showTemplatePicker: show }),
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
      setTailorModalOpen: (open) => set({ isTailorModalOpen: open }),
      setResumeTitle: (resumeTitle) => set({ resumeTitle }),

      handleReset: () =>
        set({
          step: 1,
          isGenerating: false,
          status: "PENDING",
          taskId: null,
          fileUrl: null,
          error: null,
          formData: initialFormData,
          resumeId: null,
          resumeTitle: "Untitled Resume",
          showTemplatePicker: true,
          activeExperienceIndex: null,
          activeBulletIndex: null,
          focusedExperienceIndex: null,
          isReviewModalOpen: false,
          isAIAnalyzing: false,
          isRecommendingSummary: false,
          isTailoring: false,
          isTailorModalOpen: false,
          tailorResult: null,
          isImporting: false,
          pdfPreviewUrl: null,
          isCompilingPdf: false,
          compileError: null,
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
        set({ isAIAnalyzing: true, error: null });
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
          
          // Automatically save the resume if the user is authenticated to trigger backend score update
          if (useAuthStore.getState().isAuthenticated) {
            await get().saveResume();
          }
        } catch (err: unknown) {
          set({ error: (err as Error).message || "AI analysis failed" });
        } finally {
          set({ isAIAnalyzing: false });
        }
      },

      triggerTailorResume: async () => {
        const { formData, pollTask, setTailorModalOpen } = get();
        set({ isTailoring: true, error: null, tailorResult: null });
        setTailorModalOpen(true);
        try {
          const { task_id } = await tailorResume(
            formData,
            formData.job_description || "",
            formData.target_role || "",
          );
          const result = await pollTask<TailoredResumeResult>(task_id);
          set({ tailorResult: result });
        } catch (err: unknown) {
          set({ error: (err as Error).message || "AI tailoring failed" });
          setTailorModalOpen(false);
        } finally {
          set({ isTailoring: false });
        }
      },

      applyTailoredResume: (selectedExperienceIndexes, applySummary, applySkills) => {
        const { tailorResult } = get();
        if (!tailorResult) return;

        set((state) => {
          const updatedFormData = { ...state.formData };

          // 1. Apply summary
          if (applySummary && tailorResult.tailored_summary) {
            updatedFormData.skill_description = tailorResult.tailored_summary;
          }

          // 2. Apply skills
          if (applySkills && tailorResult.skills_to_add && tailorResult.skills_to_add.length > 0) {
            const currentSkills = updatedFormData.skills || [];
            const newSkills = [...currentSkills];
            tailorResult.skills_to_add.forEach((skill) => {
              if (!newSkills.includes(skill)) {
                newSkills.push(skill);
              }
            });
            updatedFormData.skills = newSkills;
          }

          // 3. Apply experiences
          if (tailorResult.tailored_experiences && tailorResult.tailored_experiences.length > 0) {
            const newExperiences = [...updatedFormData.experiences];
            tailorResult.tailored_experiences.forEach((item) => {
              if (selectedExperienceIndexes.includes(item.index) && newExperiences[item.index]) {
                newExperiences[item.index] = {
                  ...newExperiences[item.index],
                  bullet_points: item.tailored_bullets,
                };
              }
            });
            updatedFormData.experiences = newExperiences;
          }

          return {
            formData: updatedFormData,
            isTailorModalOpen: false,
            tailorResult: null,
          };
        });
      },

      handleParaphrase: async (bulletPoint, jobTitle) => {
        const { formData } = get();
        try {
          const result = await paraphraseBullet(
            bulletPoint,
            formData.job_description || "",
            formData.target_role || "",
            jobTitle,
          );
          return result.suggestions;
        } catch (err: unknown) {
          set({ error: (err as Error).message || "Paraphrasing failed" });
          return null;
        }
      },

      handleRecommendJobDescription: async (jobTitle) => {
        const { formData } = get();
        try {
          const result = await recommendJobDescription(
            jobTitle,
            formData.job_description || "",
            formData.target_role || "",
          );
          return result.job_description;
        } catch (err: unknown) {
          set({
            error:
              (err as Error).message || "Failed to generate recommendations",
          });
          return null;
        }
      },

      handleRecommendSkills: async () => {
        const { formData } = get();
        try {
          const result = await recommendSkills(
            formData.target_role || "Professional",
            formData.job_description || "",
          );
          return result.recommended_skills;
        } catch (err: unknown) {
          set({
            error: (err as Error).message || "Failed to recommend skills",
          });
          return null;
        }
      },

      handleRecommendSummary: async () => {
        const { formData } = get();
        set({ isRecommendingSummary: true, error: null });
        try {
          const result = await recommendSummary(
            formData,
            formData.target_role || "Professional",
            formData.job_description || "",
          );
          return result.summary;
        } catch (err: unknown) {
          set({
            error: (err as Error).message || "Failed to recommend summary",
          });
          return null;
        } finally {
          set({ isRecommendingSummary: false });
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

      loadResume: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await fetchResume(id);
          set({
            resumeId: res.id,
            resumeTitle: res.title,
            showTemplatePicker: false,
            step: 1,
            formData: {
              ...initialFormData,
              ...res.data,
            },
          });
        } catch (err: unknown) {
          set({ error: (err as Error).message || "Failed to load resume" });
        } finally {
          set({ loading: false });
        }
      },

      saveResume: async () => {
        const { resumeId, resumeTitle, formData } = get();
        set({ isSaving: true, error: null });
        try {
          let res;
          if (resumeId) {
            res = await updateResume(resumeId, resumeTitle, formData);
          } else {
            res = await createResume(resumeTitle, formData);
          }
          set({
            resumeId: res.id,
            resumeTitle: res.title,
            formData: {
              ...initialFormData,
              ...res.data,
            },
          });
          return res.id;
        } catch (err: unknown) {
          set({ error: (err as Error).message || "Failed to save resume" });
          return null;
        } finally {
          set({ isSaving: false });
        }
      },

      importResume: async (file: File) => {
        set({ isImporting: true, error: null });
        try {
          const parsedData = await importResumePdf(file);
          set({
            formData: {
              ...initialFormData,
              ...parsedData,
              template: get().formData.template || "modern",
            },
            showTemplatePicker: false,
            step: 1,
            resumeTitle: parsedData.full_name ? `${parsedData.full_name}'s Resume` : "Imported Resume",
            resumeId: null,
            activeExperienceIndex: null,
            activeBulletIndex: null,
            focusedExperienceIndex: null,
            isReviewModalOpen: false,
            isAIAnalyzing: false,
            isRecommendingSummary: false,
            isTailoring: false,
            isTailorModalOpen: false,
            tailorResult: null,
            pdfPreviewUrl: null,
            isCompilingPdf: false,
            compileError: null,
          });
          toast.success("Resume details extracted successfully!");
          
          if (useAuthStore.getState().isAuthenticated) {
            await get().saveResume();
          }
        } catch (err: any) {
          const errMsg = err.message || "Failed to parse resume PDF.";
          set({ error: errMsg });
          toast.error(errMsg);
          throw err;
        } finally {
          set({ isImporting: false });
        }
      },

      compilePdf: async () => {
        const { formData } = get();
        set({ isCompilingPdf: true, compileError: null });
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

          const result = await generateResume(cleanedData, true);
          const taskId = result.task_id;

          // Poll until success
          let pollRetries = 0;
          const maxRetries = 30; // 60 seconds total (2s interval)

          const poll = async (): Promise<string> => {
            const res = await checkTaskStatus(taskId, "pdf");
            if (res.status === "SUCCESS") return res.file_url;
            if (res.status === "FAILURE")
              throw new Error(res.error || "Generation failed");

            if (pollRetries >= maxRetries)
              throw new Error("PDF compilation timed out. Please try again.");

            pollRetries++;
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return poll();
          };

          const fileUrl = await poll();
          set({ pdfPreviewUrl: fileUrl, isCompilingPdf: false });
        } catch (err: unknown) {
          set({
            compileError: (err as Error).message || "Failed to compile PDF",
            isCompilingPdf: false,
          });
        }
      },

    }),
    {
      name: "resume-storage",
      partialize: (state) => ({
        formData: state.formData,
        resumeId: state.resumeId,
        resumeTitle: state.resumeTitle,
        showTemplatePicker: state.showTemplatePicker,
        step: state.step,
      }),
    },
  ),
);
