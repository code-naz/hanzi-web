"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("theme") as ThemeMode | null;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}