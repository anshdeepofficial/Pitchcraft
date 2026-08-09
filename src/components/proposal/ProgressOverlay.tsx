import { useEffect, useState } from "react";
import { Check, Loader2, Lightbulb } from "lucide-react";
import { DID_YOU_KNOW, PROGRESS_STEPS } from "@/lib/proposal-data";
import { cn } from "@/lib/utils";

export function ProgressOverlay({
  active,
  charCount,
  businessName,
}: {
  active: boolean;
  charCount: number;
  businessName: string;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [tip, setTip] = useState(0);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setTip((i) => (i + 1) % DID_YOU_KNOW.length), 7000);
    return () => clearInterval(t);
  }, [active]);

  if (!active) return null;

  // Steps advance on real output volume, with a gentle time floor before streaming starts.
  const byOutput = Math.min(PROGRESS_STEPS.length - 1, Math.floor(charCount / 1600));
  const byTime = Math.min(2, Math.floor(elapsed / 12));
  const current = Math.max(byOutput, charCount > 0 ? 0 : byTime);
  const pct = Math.min(97, Math.round(((current + 0.5) / PROGRESS_STEPS.length) * 100));
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Building your proposal
        </p>
        <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
          Preparing a full proposal for{" "}
          <em className="text-primary">{businessName || "your business"}</em>
        </h2>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{pct}% complete</span>
          <span>
            {mm}:{ss} elapsed · {charCount.toLocaleString()} characters written
          </span>
        </div>

        <ul className="mt-8 grid gap-2 sm:grid-cols-2">
          {PROGRESS_STEPS.map((step, i) => {
            const done = i < current;
            const running = i === current;
            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  running && "bg-card",
                  !done && !running && "text-muted-foreground/60",
                )}
              >
                {done ? (
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                ) : running ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-border" />
                )}
                {step}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex gap-3 rounded-lg border border-border bg-card p-4">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Did you know?</p>
            <p className="mt-1 text-sm">{DID_YOU_KNOW[tip]}</p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This usually takes 2–5 minutes. Please keep this tab open.
        </p>
      </div>
    </div>
  );
}