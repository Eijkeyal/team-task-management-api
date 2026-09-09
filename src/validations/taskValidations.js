import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z.coerce.date(),

  assignedTo: z.string().min(1, "Assigned user is required"),

  project: z.string().min(1, "Project is required"),
});

export const updateTaskSchema = z.object({
  title: z.string().trim().min(3).max(100).optional(),

  description: z.string().trim().max(1000).optional(),

  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  dueDate: z.coerce.date().optional(),

  assignedTo: z.string().optional(),

  project: z.string().optional(),
});

export const taskQuerySchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),

  search: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),
});
