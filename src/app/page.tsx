import Image from "next/image";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image alt="Ai Mentor logo" src={logo} width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Ai Mentor
        </span>
      </div>
      <p className="max-w-prose text-center">
        Experience better education with AI. The 24/7 mentor for your education.
        Learn, practice facing questions and exams with your AI Mentor beside
        you to help!
      </p>
      <Button size="lg" asChild>
        <Link href="/notes">Oepn</Link>
      </Button>
    </main>
  );
}
