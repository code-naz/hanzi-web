"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ThemeToggle from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/words", label: "Words" },
  { href: "/sentences", label: "Sentences" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = useMemo(
    () => (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/favicon.svg"
            alt="Xuexi Hanzi logo"
            width={34}
            height={34}
            priority
            className="h-8 w-8"
          />
          <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
            Xuexi Hanzi
          </span>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-[#ff9900] hover:text-[#ff9900] dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "rounded-2xl px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-[#ff9900] text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}

          <span className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-400 dark:text-slate-600">
            Write Tutorial
          </span>

          <ThemeToggle />
        </nav>
      </div>

      <div
        id="mobile-navigation"
        className={`${open ? "block" : "hidden"} border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden`}
      >
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-8">
          <div className="grid gap-2">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-[#ff9900] text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}

            <span className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-400 dark:bg-slate-900 dark:text-slate-600">
              Write Tutorial
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}