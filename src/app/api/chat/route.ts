import prisma from "@/lib/db/prisma";
import openai from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessageParam[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "No user found" }, { status: 401 });
    }

    const lastAttempt = await prisma.attempt.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastAttempt) {
      return Response.json({ error: "No attempt found" }, { status: 404 });
    }
    const question = await prisma.question.findFirst({
      where: { id: lastAttempt.questionId },
    });

    if (!question) {
      return Response.json({ error: "No question found" }, { status: 404 });
    }

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content:
        "You are an intelligent Maths teacher for 5th Grade students. Your response to the student should be based on the question student has attempted and the tips he was given beforehand. The relevant details:\n\n" +
        "Question: " +
        question.query +
        "\n" +
        "Student Given Answer: " +
        lastAttempt.givenAnswer +
        "\n" +
        "Correct Answer: " +
        question.correctAnswer +
        "\n" +
        "Tips: " +
        question.feedback +
        "\n",
    };

    // console.log("Query: ", systemMessage.content, messagesTruncated);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
