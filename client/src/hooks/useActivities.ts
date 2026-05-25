import { useState, useEffect, useCallback } from "react";
import { fetchActivities } from "@/api";
import type { ActivityResponse } from "@/api";

export function useActivities() {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (err) {
      setError((err as Error).message ?? "Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { activities, isLoading, error, refetch: load };
}
