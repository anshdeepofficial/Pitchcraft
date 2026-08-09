import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { proposalDocName } from "@/lib/proposal-store";
import { exportElementToPdf, exportElementToPaginatedPdf } from "@/lib/pdf-export";

export function ProposalView({
  markdown,
  businessName,
  streaming,
  createdAt,
  variant = "full",
}: {
  markdown: string;
  businessName: string;
  streaming: boolean;
  createdAt?: string | undefined;
  variant?: "full" | "summary" | undefined;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const fileName = () =>
    proposalDocName(
      businessName,
      createdAt ?? new Date().toISOString(),
      variant === "summary" ? "summary" : "proposal",
    );

  const exportPdf = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      if (variant === "summary") {
        await exportElementToPdf(cardRef.current, fileName());
      } else {
        await exportElementToPaginatedPdf(cardRef.current, fileName(), {
          title: businessName || "Website proposal",
          subtitle: "Aniweb Designs",
        });
      }
    } finally {
      setExporting(false);
    }
  };

  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={cardRef} className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {variant === "summary" ? "One-page summary" : "Website proposal"} · Pitchcraft by Aniweb Designs
          </p>
          <h2 className="mt-1 text-2xl">{businessName || "Untitled client"}</h2>
          {createdAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(markdown)}>
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!markdown.trim()}>
            Download .md
          </Button>
          <Button variant="outline" size="sm" onClick={exportPdf} disabled={exporting || streaming || !markdown.trim()}>
            {exporting && <Loader2 className="h-4 w-4 animate-spin" />}
            {variant === "summary" ? "Download A4 PDF" : "Download PDF"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            Print / PDF
          </Button>
        </div>
      </div>

      <article className="proposal-doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        {streaming && (
          <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-accent align-middle" aria-hidden />
        )}
      </article>
    </div>
  );
}