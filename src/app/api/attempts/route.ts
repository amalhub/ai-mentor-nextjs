import prisma from "@/lib/db/prisma";
import { createAttemptSchema } from "@/lib/validation/attempt";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createAttemptSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { questionId, givenAnswer, isCorrect } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const note = await prisma.attempt.create({
      data: {
        userId,
        questionId,
        givenAnswer,
        isCorrect,
      },
    });

    return Response.json(note, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
