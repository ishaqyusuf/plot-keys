import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  description: string;
  title: string;
};

export function BlogDetailSection({ children, description, title }: Props) {
  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
