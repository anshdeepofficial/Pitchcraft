import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { COLOR_PALETTES, DESIGN_STYLES } from "@/lib/proposal-data";

export function StyleCards({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {DESIGN_STYLES.map((s) => {
        const active = value === s.name;
        return (
          <button
            key={s.name}
            type="button"
            onClick={() => onChange(active ? "" : s.name)}
            aria-pressed={active}
            className={cn(
              "overflow-hidden rounded-lg border text-left transition-shadow",
              active ? "border-primary shadow-md" : "border-border hover:border-primary/50",
            )}
          >
            <div className={cn("style-thumb", s.className)}>
              <span className="style-thumb-bar" />
              <span className="style-thumb-block" />
              <span className="style-thumb-line" />
              <span className="style-thumb-line short" />
            </div>
            <div className="flex items-start justify-between gap-2 p-3">
              <div>
                <p className="text-sm">{s.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.hint}</p>
              </div>
              {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function PalettePicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggleColor = (hex: string) =>
    onChange(value.includes(hex) ? value.filter((c) => c !== hex) : [...value, hex]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {COLOR_PALETTES.map((p) => {
          const active = p.colors.every((c) => value.includes(c));
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => onChange(active ? value.filter((c) => !p.colors.includes(c)) : Array.from(new Set([...value, ...p.colors])))}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                active ? "border-primary" : "border-border hover:border-primary/50",
              )}
            >
              <span className="flex overflow-hidden rounded">
                {p.colors.map((c) => (
                  <span key={c} className="h-8 w-6" style={{ backgroundColor: c }} />
                ))}
              </span>
              <span className="text-sm">{p.name}</span>
              {active && <Check className="ml-auto h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-wide text-muted-foreground" htmlFor="custom-color">
          Pick an exact colour
        </label>
        <input
          id="custom-color"
          type="color"
          className="h-9 w-14 cursor-pointer rounded border border-border bg-card"
          onChange={(e) => toggleColor(e.target.value.toUpperCase())}
        />
        {value.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleColor(c)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs"
              >
                <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: c }} />
                {c}
                <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}