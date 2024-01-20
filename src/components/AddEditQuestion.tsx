"use client";

import {
  CreateQuestionSchema,
  createQuestionSchema,
} from "@/lib/validation/question";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";

export default function AddEditQuestion() {
  const router = useRouter();

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      query: "",
      wrongAnswers: ["", "", "", ""],
      correctAnswer: "",
      keywords: [""],
      feedback: "",
    },
  });

  async function onSubmit(input: CreateQuestionSchema) {
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        body: JSON.stringify(input),
      });

      if (!response.ok) throw Error("Status code: " + response.status);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea placeholder="Questaion" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wrongAnswers.0"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Wrong Answer 1</FormLabel>
              <FormControl>
                <Input placeholder="Wrong Answer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wrongAnswers.1"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Wrong Answer 2</FormLabel>
              <FormControl>
                <Input placeholder="Wrong Answer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wrongAnswers.2"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Wrong Answer 3</FormLabel>
              <FormControl>
                <Input placeholder="Wrong Answer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="wrongAnswers.3"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Wrong Answer 4</FormLabel>
              <FormControl>
                <Input placeholder="Wrong Answer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="correctAnswer"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel className="font-bold">Correct Answer</FormLabel>
              <FormControl>
                <Input
                  className="font-bold"
                  placeholder="Correct Answer"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem className="py-1">
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea placeholder="Feedback" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords.0"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Keyword</FormLabel>
              <FormControl>
                <Input placeholder="Keyword" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" loading={form.formState.isSubmitting}>
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
}
