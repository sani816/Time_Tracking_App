import z from "zod";

export const CreateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  minutes: z.number().int().min(1, "Minutes must be at least 1").max(1440, "Minutes cannot exceed 1440"),
  activity_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  minutes: z.number().int().min(1, "Minutes must be at least 1").max(1440, "Minutes cannot exceed 1440"),
});

export type CreateActivityType = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityType = z.infer<typeof UpdateActivitySchema>;

export interface Activity {
  id: number;
  user_id: string;
  activity_date: string;
  name: string;
  category: string;
  minutes: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityStats {
  activity_date: string;
  category: string;
  total_minutes: number;
}
