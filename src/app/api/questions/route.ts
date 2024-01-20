import { createQuestionSchema } from "@/lib/validation/question";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createQuestionSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { query, wrongAnswers, correctAnswer, keywords, feedback, imageUrl } =
      parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.question.create({
      data: {
        query,
        wrongAnswers,
        correctAnswer,
        feedback: feedback ? feedback : "",
        imageUrl: imageUrl ? imageUrl : "",
        keywords,
        updatedUser: userId,
      },
    });

    return Response.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
