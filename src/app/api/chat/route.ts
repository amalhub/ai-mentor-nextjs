import { notesIndex } from "@/lib/db/pinecone";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessageParam[] = body.messages;

    const messagesTruncated = messages.slice(-1);

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "No user found" }, { status: 500 });
    }

    const lastAttempt = await prisma.attempt.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!lastAttempt) {
      return Response.json({ error: "No attempt found" }, { status: 500 });
    }
    const question = await prisma.question.findFirst({
      where: { id: lastAttempt.questionId },
    });

    if (!question) {
      return Response.json({ error: "No question found" }, { status: 500 });
    }

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content:
        "You are an intelligent Maths teacher. Your response should be based on the question student had attempted and the feedback given. The relevant details:\n\n" +
        "Question: " +
        question.query +
        "\n" +
        "Student Given Answer: " +
        lastAttempt.givenAnswer +
        "\n" +
        "Correct Answer: " +
        question.correctAnswer +
        "\n" +
        "Feedback: " +
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
