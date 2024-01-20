import { z } from "zod";

export const createAttemptSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
  givenAnswer: z.string().min(1, { message: "Given answer is required" }),
});

export type CreateAttemptSchema = z.infer<typeof createAttemptSchema>;

export const updateAttemptSchema = createAttemptSchema.extend({
  id: z.string().min(1),
});

export const deleteAttemptSchema = z.object({
  id: z.string().min(1),
});
