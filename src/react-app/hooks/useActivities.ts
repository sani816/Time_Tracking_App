import { useState, useEffect, useCallback } from "react";
import type { Activity } from "@/shared/types";

export function useActivities(selectedDate: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/activities?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const addActivity = useCallback((activity: Activity) => {
    setActivities((prev) => [activity, ...prev]);
  }, []);

  const updateActivity = useCallback(async (id: number, name: string, category: string, minutes: number) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, minutes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update activity");
      }

      const updated = await response.json();
      setActivities((prev) =>
        prev.map((activity) => (activity.id === id ? updated : activity))
      );
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update activity");
      throw error;
    }
  }, []);

  const deleteActivity = useCallback(async (id: number) => {
    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      setActivities((prev) => prev.filter((activity) => activity.id !== id));
    } catch (error) {
      alert("Failed to delete activity");
      throw error;
    }
  }, []);

  const totalMinutes = activities.reduce((sum, activity) => sum + activity.minutes, 0);

  return {
    activities,
    totalMinutes,
    isLoading,
    addActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
