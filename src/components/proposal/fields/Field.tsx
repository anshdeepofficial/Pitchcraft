import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  htmlFor,
  action,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="text-xs uppercase tracking-wide text-muted-foreground"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
        {action}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function SectionHeader({ index, title, subtitle }: { index: number; title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {index}
        </span>
        <h3 className="text-lg">{title}</h3>
        <span className="h-px flex-1 bg-border" />
      </div>
      <p className="mt-2 pl-10 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}