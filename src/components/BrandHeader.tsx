import { Link } from "@tanstack/react-router";

export function BrandHeader({ right }: { right?: React.ReactNode }) {
  return (
    <div className="brand-bar sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-6 py-3 lg:px-10 xl:px-16">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/aniweb-logo.png"
            alt="Aniweb Designs — Animating Technologies"
            className="h-9 w-auto rounded-sm"
            width={160}
            height={48}
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-tight">Pitchcraft</span>
            <span className="text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
              by Aniweb Designs
            </span>
          </span>
        </Link>
        {right}
      </div>
    </div>
  );
}