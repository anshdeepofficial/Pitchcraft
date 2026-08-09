import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function isValidUrl(value: string) {
  const v = value.trim();
  if (!v) return true;
  try {
    const url = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function UrlList({
  value,
  onChange,
  placeholder = "https://competitor.com",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const rows = value.length ? value : [""];

  const update = (i: number, v: string) => {
    const next = [...rows];
    next[i] = v;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {rows.map((row, i) => {
        const invalid = !isValidUrl(row);
        return (
          <div key={i} className="space-y-1">
            <div className="flex gap-2">
              <Input
                value={row}
                placeholder={placeholder}
                inputMode="url"
                aria-invalid={invalid}
                onChange={(e) => update(i, e.target.value)}
              />
              {rows.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove URL"
                  onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {invalid && <p className="text-xs text-destructive">That doesn’t look like a valid website address.</p>}
          </div>
        );
      })}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...rows, ""])}>
        <Plus className="h-4 w-4" /> Add another
      </Button>
    </div>
  );
}