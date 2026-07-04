import { useState, useEffect, useCallback } from "react";
import { fetchResumes, toggleFavoriteResume, deleteResume } from "@/api";
import type { ResumeResponse } from "@/api";

export function useResumes() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      setError((err as Error).message ?? "Failed to load resumes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = useCallback(
    async (id: string, current: boolean) => {
      // Optimistic update
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_favorite: !current } : r))
      );
      try {
        await toggleFavoriteResume(id, !current);
      } catch {
        // Revert on failure
        setResumes((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_favorite: current } : r))
        );
      }
    },
    []
  );

  const removeResume = useCallback(
    async (id: string) => {
      // Keep copy for fallback
      let deletedResume: ResumeResponse | undefined;
      setResumes((prev) => {
        deletedResume = prev.find((r) => r.id === id);
        return prev.filter((r) => r.id !== id);
      });
      try {
        await deleteResume(id);
      } catch (err) {
        // Revert on failure
        if (deletedResume) {
          setResumes((prev) => [...prev, deletedResume!]);
        }
        throw err;
      }
    },
    []
  );

  return { resumes, isLoading, error, refetch: load, toggleFavorite, deleteResume: removeResume };
}

