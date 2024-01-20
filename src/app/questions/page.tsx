import AddEditQuestion from "@/components/AddEditQuestion";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ai Mentor - Add Questions",
};

export default async function NotePage() {
  const { userId } = auth();

  if (!userId) throw Error("userId undefined");

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <AddEditQuestion />
    </div>
  );
}
