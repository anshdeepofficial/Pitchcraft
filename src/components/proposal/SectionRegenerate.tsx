import { useState } from "react";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { quickTargets, type ProposalSection } from "@/lib/proposal-sections";

export function SectionRegenerate({
  sections,
  busyHeading,
  onRegenerate,
}: {
  sections: ProposalSection[];
  busyHeading: string | null;
  onRegenerate: (section: ProposalSection, guidance: string) => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const [guidance, setGuidance] = useState("");
  const quick = quickTargets(sections);
  const chosen = sections.find((s) => s.heading === selected);
  const busy = busyHeading !== null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 print:hidden">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4 text-accent" /> Regenerate a section
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Only the chosen section is rewritten — everything else stays exactly as it is.
      </p>

      {quick.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {quick.map((t) => (
            <Button
              key={t.label}
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => onRegenerate(t.section, guidance)}
            >
              {busyHeading === t.section.heading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {t.label}
            </Button>
          ))}
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="text-xs">
            <SelectValue placeholder="Choose any section…" />
          </SelectTrigger>
          <SelectContent>
            {sections.map((s) => (
              <SelectItem key={s.index} value={s.heading} className="text-xs">
                {s.heading}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          placeholder="Optional: what should change? e.g. more local SEO detail, cheaper tier options…"
          className="min-h-20 text-xs"
        />

        <Button
          size="sm"
          className="w-full"
          disabled={!chosen || busy}
          onClick={() => chosen && onRegenerate(chosen, guidance)}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Regenerate section
        </Button>
      </div>
    </section>
  );
}