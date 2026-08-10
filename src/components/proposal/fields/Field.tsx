import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  htmlFor,
  action,
  number,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  action?: ReactNode;
  number?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground"
        >
          {number && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-[3px] bg-primary/10 px-1 text-[9px] font-semibold text-primary">
              {number}
            </span>
          )}
          <span>{label}</span>
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