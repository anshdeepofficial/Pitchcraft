import { History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProposalVersion } from "@/lib/proposal-store";

export function VersionHistory({
  versions,
  onRestore,
  busy,
}: {
  versions: ProposalVersion[];
  onRestore: (version: ProposalVersion) => void;
  busy?: boolean;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 print:hidden">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <History className="h-4 w-4 text-accent" /> Version history
      </h3>
      {versions.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Snapshots are saved automatically each time a section is regenerated.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {versions.map((v, i) => (
            <li
              key={v.createdAt + i}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{v.label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(v.createdAt).toLocaleString()} · {v.markdown.length.toLocaleString()} chars
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => onRestore(v)}>
                <RotateCcw className="h-3.5 w-3.5" /> Restore
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}