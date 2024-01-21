"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question as QuestionModel } from "@prisma/client";
import { useForm } from "react-hook-form";
import z from "zod";
import { Label } from "./ui/label";
import LoadingButton from "./ui/loading-button";

interface QuestionProps {
  question: QuestionModel;
}

const FormSchema = z.object({
  option: z.string().min(1, "You need to answer something."),
  answer: z.string().optional(),
  questionId: z.string().optional(),
});

async function onSubmit(input: z.infer<typeof FormSchema>) {
  try {
    const data = {
      questionId: input.questionId,
      givenAnswer: input.option,
    };
    const response = await fetch("/api/attempts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw Error("Status code: " + response.status);

    const statusLabel = document.getElementById("status") as HTMLLabelElement;

    if (input.answer === input.option) {
      statusLabel.innerHTML = "Correct!";
      statusLabel.style.color = "green";
    } else {
      statusLabel.innerHTML = "Incorrect!";
      statusLabel.style.color = "red";
    }

    const submitButton = document.getElementById(
      "submit-button",
    ) as HTMLButtonElement;
    submitButton.disabled = true;
  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
}

export default function Quiz({ question }: QuestionProps) {
  const answers = question.wrongAnswers;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            data.answer = question.correctAnswer;
            data.questionId = question.id;

            onSubmit(data);
          })}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.query}</FormLabel>
                <FormControl>
                  <RadioGroup
                    key={question.id}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {answers.map((answer, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={answer} />
                        </FormControl>
                        <FormLabel className="font-normal">{answer}</FormLabel>
                      </FormItem>
                    ))}
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={question.correctAnswer} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {question.correctAnswer}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
                <Label id="status" />
              </FormItem>
            )}
          />

          <LoadingButton
            id="submit-button"
            type="submit"
            loading={form.formState.isLoading}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
