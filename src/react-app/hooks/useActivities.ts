import { useState, useEffect } from "react";
import type { Activity } from "@/shared/types";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activities");
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return { activities, loading, error, refetch: fetchActivities };
}

export function useActivitiesByDate(date: string) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/by-date/${date}`);
      if (!response.ok) throw new Error("Failed to fetch activities");
      const data = await response.json();
      setActivities(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [date]);

  return { activities, loading, error, refetch: fetchActivities };
}

export function useActivitySummary() {
  const [summary, setSummary] = useState<Array<{ date: string; total_minutes: number; activity_count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/activities/summary");
      if (!response.ok) throw new Error("Failed to fetch summary");
      const data = await response.json();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, error, refetch: fetchSummary };
}
