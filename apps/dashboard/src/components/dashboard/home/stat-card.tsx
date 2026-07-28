import Link from "next/link";

type Props = {
  href: string;
  label: string;
  meta: string;
  value: number;
};

export function DashboardHomeStatCard({ href, label, meta, value }: Props) {
  return (
    <Link
      className="h-full border border-border bg-card p-5 flex flex-col justify-between transition-all duration-300 hover:bg-muted cursor-pointer group min-h-[110px]"
      href={href}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-3">
        <span className="text-xl font-medium">{value}</span>
        <span className="ml-2 text-xs text-muted-foreground">{meta}</span>
      </div>
    </Link>
  );
}
