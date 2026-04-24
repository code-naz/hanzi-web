import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-10 text-center md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-900 dark:text-white">
          <Link href="/#about" className="hover:text-[#ff9900]">
            About Us
          </Link>
          <span>•</span>
          <Link href="/#data" className="hover:text-[#ff9900]">
            Our Data
          </Link>
          <span>•</span>
          <Link href="/#contact" className="hover:text-[#ff9900]">
            Contact
          </Link>
        </div>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          © 2026 Xuexi Hanzi. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}