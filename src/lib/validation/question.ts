import { z } from "zod";

export const createQuestionSchema = z.object({
  query: z.string().min(1, { message: "Query is required" }),
  wrongAnswers: z
    .array(z.string().min(1, { message: "Wrong answer is required" }))
    .min(4, { message: "4 wrong answers required" }),
  correctAnswer: z.string().min(1, { message: "Correct answer is required" }),
  feedback: z.string().optional(),
  imageUrl: z.string().url().optional(),
  keywords: z
    .array(z.string().min(1, "Keyword cannot be empty"))
    .min(1, "At least one keyword is required"),
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

export const updateQuestionSchema = createQuestionSchema.extend({
  id: z.string().min(1),
});

export const deleteQuestionSchema = z.object({
  id: z.string().min(1),
});
