import Link from "next/link";

type Props = {
  items: { label: string; href?: string }[];
};

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-[#ff9900]">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-medium text-slate-900 dark:text-white" : ""}>
                {item.label}
              </span>
            )}
            {!isLast ? <span>›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
