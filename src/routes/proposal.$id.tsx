import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandHeader } from "@/components/BrandHeader";
import { ProposalView } from "@/components/proposal/ProposalView";
import { ProgressOverlay } from "@/components/proposal/ProgressOverlay";
import {
  getProposal,
  saveProposal,
  takePendingInput,
  withVersion,
  type ProposalVersion,
  type SavedProposal,
} from "@/lib/proposal-store";
import { parseSections, replaceSection, type ProposalSection } from "@/lib/proposal-sections";
import { VersionHistory } from "@/components/proposal/VersionHistory";
import { VerificationChecklist } from "@/components/proposal/VerificationChecklist";
import { SectionRegenerate } from "@/components/proposal/SectionRegenerate";
import { ShareDialog } from "@/components/proposal/ShareDialog";

const title = "Website proposal | Pitchcraft";
const description =
  "A full agency-grade website proposal generated with Pitchcraft by Aniweb Designs — strategy, UX, branding, SEO, stack, roadmap and costs.";

export const Route = createFileRoute("/proposal/$id")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ProposalPage,
});

function ProposalPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState<SavedProposal | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [summary, setSummary] = useState("");
  const [view, setView] = useState<"full" | "summary">("full");
  const [loading, setLoading] = useState(false);
  const [summarising, setSummarising] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const existing = getProposal(id);
    const pending = takePendingInput(id);

    if (existing?.complete && existing.markdown) {
      setRecord(existing);
      setMarkdown(existing.markdown);
      setSummary(existing.summary ?? "");
      return;
    }

    const input = pending ?? existing?.input;
    if (!input) {
      setError("This proposal is no longer available. Generate a new one from the home page.");
      return;
    }

    const base: SavedProposal = existing ?? {
      id,
      businessName: input.businessName,
      createdAt: new Date().toISOString(),
      markdown: "",
      input,
      complete: false,
    };
    setRecord(base);
    saveProposal(base);

    void (async () => {
      setLoading(true);
      let text = "";
      try {
        const res = await fetch("/api/generate-proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok || !res.body) {
          setError((await res.text()) || "Generation failed.");
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setMarkdown(text);
        }
        const done = withVersion({ ...base, markdown: text, complete: true }, text, "Initial generation");
        setRecord(done);
        saveProposal(done);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        if (text) saveProposal({ ...base, markdown: text, complete: false });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const summarise = async () => {
    if (summary) {
      setView("summary");
      return;
    }
    setSummarising(true);
    setError(null);
    let text = "";
    try {
      const res = await fetch("/api/summarise-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, businessName: record?.businessName ?? "" }),
      });
      if (!res.ok || !res.body) {
        setError((await res.text()) || "Could not summarise.");
        return;
      }
      setView("summary");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        setSummary(text);
      }
      if (record) saveProposal({ ...record, markdown, summary: text, complete: true });
    } catch {
      setError("Could not summarise right now.");
    } finally {
      setSummarising(false);
    }
  };

  const goBack = () => {
    if (record) {
      saveProposal({ ...record, markdown, summary: summary || record.summary, complete: !loading });
    }
    void navigate({ to: "/" });
  };

  const persist = (next: SavedProposal) => {
    setRecord(next);
    setMarkdown(next.markdown);
    saveProposal(next);
  };

  const restore = (version: ProposalVersion) => {
    if (!record) return;
    const snapshot = withVersion(record, markdown, "Before restore");
    persist({ ...snapshot, markdown: version.markdown, complete: true });
    setView("full");
  };

  const regenerateSection = async (section: ProposalSection, guidance: string) => {
    if (!record || regenerating) return;
    setRegenerating(section.heading);
    setError(null);
    try {
      const res = await fetch("/api/regenerate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: section.heading,
          currentSection: section.body,
          guidance,
          intake: Object.entries(record.input)
            .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : String(v ?? "")}`)
            .join("\n"),
          outline: sections.map((s) => `## ${s.heading}`).join("\n"),
        }),
      });
      if (!res.ok || !res.body) {
        setError((await res.text()) || "Could not regenerate this section.");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      if (!text.trim()) {
        setError("The model returned nothing — please try again.");
        return;
      }
      const snapshot = withVersion(record, markdown, `Before regenerating "${section.title}"`);
      persist({
        ...snapshot,
        markdown: replaceSection(markdown, section, text),
        complete: true,
      });
    } catch {
      setError("Could not regenerate this section right now.");
    } finally {
      setRegenerating(null);
    }
  };

  const showing = view === "summary" ? summary : markdown;
  const sections = parseSections(markdown);

  return (
    <main className="min-h-screen bg-background">
      <ProgressOverlay active={loading && !markdown} charCount={markdown.length} businessName={record?.businessName ?? ""} />

      <BrandHeader
        right={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={goBack}>
              <ArrowLeft className="h-4 w-4" /> Save &amp; back
            </Button>
            <ShareDialog
              businessName={record?.businessName ?? ""}
              markdown={markdown}
              summary={summary}
              disabled={!markdown || loading}
            />
            <Button size="sm" onClick={summarise} disabled={!markdown || loading || summarising}>
              {summarising ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              One-page summary
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-[92rem] px-6 py-10 lg:px-10 xl:px-16 print:max-w-none print:px-0 print:py-0">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive print:hidden">
            {error}
          </div>
        )}

        {summary && (
          <div className="mb-6 flex gap-2 print:hidden">
            <Button variant={view === "full" ? "default" : "outline"} size="sm" onClick={() => setView("full")}>
              Full proposal
            </Button>
            <Button variant={view === "summary" ? "default" : "outline"} size="sm" onClick={() => setView("summary")}>
              A4 summary
            </Button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] print:block">
          <div className="min-w-0">
            {showing ? (
              <div className={view === "summary" ? "a4-page" : undefined}>
                <ProposalView
                  markdown={showing}
                  businessName={record?.businessName ?? ""}
                  streaming={view === "summary" ? summarising : loading}
                  createdAt={record?.createdAt}
                  variant={view}
                />
              </div>
            ) : (
              !error && (
                <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                  Preparing your proposal…
                </div>
              )
            )}
          </div>

          {markdown && !loading && (
            <aside className="space-y-4 print:hidden">
              <SectionRegenerate
                sections={sections}
                busyHeading={regenerating}
                onRegenerate={(s, g) => void regenerateSection(s, g)}
              />
              <VerificationChecklist sections={sections} />
              <VersionHistory
                versions={record?.versions ?? []}
                onRestore={restore}
                busy={regenerating !== null}
              />
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}