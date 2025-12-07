import z from "zod";

export const ActivitySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  date: z.string(),
  name: z.string().min(1, "Activity name is required"),
  category: z.string().min(1, "Category is required"),
  minutes: z.number().int().min(1, "Minutes must be at least 1").max(1440, "Minutes cannot exceed 1440"),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateActivitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  name: z.string().min(1, "Activity name is required").max(100),
  category: z.string().min(1, "Category is required").max(50),
  minutes: z.number().int().min(1, "Minutes must be at least 1").max(1440, "Minutes cannot exceed 1440"),
});

export const UpdateActivitySchema = z.object({
  name: z.string().min(1, "Activity name is required").max(100).optional(),
  category: z.string().min(1, "Category is required").max(50).optional(),
  minutes: z.number().int().min(1, "Minutes must be at least 1").max(1440, "Minutes cannot exceed 1440").optional(),
});

export type Activity = z.infer<typeof ActivitySchema>;
export type CreateActivityInput = z.infer<typeof CreateActivitySchema>;
export type UpdateActivityInput = z.infer<typeof UpdateActivitySchema>;
