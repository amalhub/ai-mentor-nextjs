"use client";

import logo from "@/assets/logo.png";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const { theme } = useTheme();

  return (
    <div className="p-4 shadow">
      <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/questions" className="flex items-center gap-1">
          <Image alt="Ai Mentor logo" src={logo} width={40} height={40} />
          <span className="font-bold">Ai Mentor</span>
        </Link>
        <div className="flex items-center gap-2">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
            }}
          />
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
}
