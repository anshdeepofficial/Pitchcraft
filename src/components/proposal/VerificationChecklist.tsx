import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ShieldCheck } from "lucide-react";
import { verificationDetail, type ProposalSection } from "@/lib/proposal-sections";

export function VerificationChecklist({ sections }: { sections: ProposalSection[] }) {
  const verified = sections.filter((s) => s.verified).length;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="rounded-xl border border-border bg-card p-5 print:hidden">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="h-4 w-4 text-accent" /> Verification checklist
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        {verified} of {sections.length} sections fully verified from client data and crawled content.
      </p>
      <ul className="mt-3 max-h-[26rem] space-y-1 overflow-y-auto pr-1">
        {sections.map((s) => {
          const isOpen = open === s.index;
          const detail = isOpen ? verificationDetail(s) : null;
          return (
            <li key={s.index} className="rounded-lg border border-transparent hover:border-border">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : s.index)}
                className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs"
              >
                {s.verified ? (
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{s.heading}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {s.verified
                      ? "Verified"
                      : `${s.unverifiedCount} item${s.unverifiedCount === 1 ? "" : "s"} not publicly available`}
                  </span>
                </span>
                <ChevronDown
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && detail && (
                <div className="space-y-3 border-t border-border px-2 py-3 text-[11px]">
                  {detail.missing.length > 0 && (
                    <div>
                      <p className="font-semibold text-destructive">
                        Missing / not publicly available ({detail.missing.length})
                      </p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {detail.missing.map((m, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-accent">
                      Verified content ({detail.verified.length})
                    </p>
                    {detail.verified.length ? (
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {detail.verified.map((v, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-muted-foreground">No verifiable statements in this section.</p>
                    )}
                  </div>

                  {detail.sourceHints.length > 0 && (
                    <div>
                      <p className="font-semibold">Sources referenced</p>
                      <ul className="mt-1 space-y-1 break-all text-muted-foreground">
                        {detail.sourceHints.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}