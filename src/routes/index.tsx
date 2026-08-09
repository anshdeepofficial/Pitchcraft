import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandHeader } from "@/components/BrandHeader";
import { IntakeForm } from "@/components/proposal/IntakeForm";
import type { ProposalInput } from "@/lib/proposal-schema";
import {
  deleteProposal,
  loadProposals,
  newProposalId,
  stashPendingInput,
  type SavedProposal,
} from "@/lib/proposal-store";

const title = "Pitchcraft | AI Website Proposal Generator";
const description =
  "Pitchcraft turns a client intake into a 25-section website proposal — strategy, UX, branding, SEO, stack, roadmap and costs — with a strict zero-fabrication policy.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SavedProposal[]>([]);
  const [prefill, setPrefill] = useState<ProposalInput | undefined>(undefined);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => setHistory(loadProposals()), []);

  const generate = (data: ProposalInput) => {
    const id = newProposalId();
    stashPendingInput(id, data);
    void navigate({ to: "/proposal/$id", params: { id } });
  };

  const reuse = (record: SavedProposal) => {
    setPrefill({ ...record.input });
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <header className="paper-grid relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-accent/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-56 -left-32 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-[92rem] items-center gap-12 px-6 py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:px-10 xl:px-16">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Pitchcraft · by Aniweb Designs
            </p>
            <h1 className="mt-5 text-5xl leading-[1.05] sm:text-6xl xl:text-7xl">
              Client-ready website proposals,{" "}
              <em className="text-primary">written like a senior agency</em> would.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground">
              Fill in the intake once. Get a 25-section proposal covering strategy, business analysis,
              sitemap, page-by-page breakdown, UI/UX, branding, palette, SEO, copy, stack, roadmap,
              timeline, costs, architecture and API design. Anything unverifiable is flagged — never
              invented.
            </p>
            <div className="mt-8 flex flex-wrap gap-2 text-xs">
              {["Ready in under 90 seconds", "No invented competitors", "No made-up pricing", "WCAG 2.2 AA", "One-page A4 summary"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="rounded-xl border border-border bg-card/80 p-5 backdrop-blur">
                <p className="font-display text-3xl text-primary">{h.stat}</p>
                <p className="mt-2 text-sm">{h.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{h.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div
        ref={formRef}
        className="mx-auto grid max-w-[92rem] gap-10 px-6 py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-10 xl:px-16"
      >
        <div className="min-w-0">
          <IntakeForm loading={false} onSubmit={generate} initialValues={prefill} />
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {history.length > 0 && (
            <section className="rounded-xl border border-border bg-card/60 p-5">
              <h2 className="text-lg">Your saved proposals</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Kept on this device. Reopen one, or reuse its details as a starting point.
              </p>
              <ul className="mt-4 grid max-h-[22rem] gap-3 overflow-y-auto">
                {history.map((p) => (
                  <li key={p.id} className="rounded-lg border border-border bg-card p-3">
                    <p className="truncate text-sm">{p.businessName || "Untitled client"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(p.createdAt).toLocaleString()} · {p.complete ? "Complete" : "Partial"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/proposal/$id" params={{ id: p.id }}>
                          Open
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => reuse(p)}>
                        <RotateCcw className="h-4 w-4" /> Use details
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete proposal"
                        onClick={() => {
                          deleteProposal(p.id);
                          setHistory(loadProposals());
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-border bg-card/60 p-5">
            <h2 className="text-lg">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {DELIVERABLES.map((d) => (
                <li key={d} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </section>

          <section className="paper-grid rounded-xl border border-border p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Zero fabrication</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Blank fields are reported as “Not publicly available”. Nothing is invented — every claim
              traces back to your intake or your crawled website.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

const HIGHLIGHTS = [
  { stat: "25", title: "Proposal sections", detail: "Strategy through API design, plus 4 appendices." },
  { stat: "<90s", title: "Time to first draft", detail: "Priority streaming while you watch it write." },
  { stat: "A4", title: "One-page summary", detail: "Client-facing PDF export in a click." },
  { stat: "0", title: "Invented facts", detail: "Unverifiable details are flagged, never guessed." },
];

const DELIVERABLES = [
  "Business analysis, goals and sitemap",
  "Page-by-page breakdown with UI/UX direction",
  "Branding, palette and typography system",
  "SEO plan, copy strategy and tech stack",
  "Roadmap, timeline and transparent costing",
  "Version history and section-level rewrites",
];
