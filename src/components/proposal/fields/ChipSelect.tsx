import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChipSelect({
  options,
  value,
  onChange,
  allowCustom = true,
  single = false,
  customPlaceholder = "Add your own…",
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  allowCustom?: boolean;
  single?: boolean;
  customPlaceholder?: string;
}) {
  const [custom, setCustom] = useState("");
  const all = Array.from(new Set([...options, ...value]));

  const toggle = (item: string) => {
    if (single) {
      onChange(value[0] === item ? [] : [item]);
      return;
    }
    onChange(value.includes(item) ? value.filter((v) => v !== item) : [...value, item]);
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (!value.includes(v)) onChange(single ? [v] : [...value, v]);
    setCustom("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {all.map((item) => {
          const active = value.includes(item);
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/10",
              )}
            >
              {active && <Check className="h-3.5 w-3.5" />}
              {item}
              {active && !options.includes(item) && <X className="h-3.5 w-3.5 opacity-70" />}
            </button>
          );
        })}
      </div>
      {allowCustom && (
        <div className="flex gap-2">
          <Input
            value={custom}
            placeholder={customPlaceholder}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            className="h-9 max-w-xs"
          />
          <Button type="button" variant="outline" size="sm" className="h-9" onClick={addCustom}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
}