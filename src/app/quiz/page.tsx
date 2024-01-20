import Quiz from "@/components/Quiz";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ai Mentor - Quiz",
};

export default async function NotePage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  const questions = await prisma.question.findMany();
  const question = questions[0];

  return <Quiz question={question} />;
}
