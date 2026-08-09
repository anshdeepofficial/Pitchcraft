import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function SearchMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Search…",
  popular = [],
  recentKey,
  allowCustom = true,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  popular?: string[];
  recentKey?: string;
  allowCustom?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!recentKey) return;
    try {
      const raw = localStorage.getItem(recentKey);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, [recentKey]);

  const remember = (item: string) => {
    if (!recentKey) return;
    const next = [item, ...recent.filter((r) => r !== item)].slice(0, 8);
    setRecent(next);
    try {
      localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (item: string) => {
    if (value.includes(item)) onChange(value.filter((v) => v !== item));
    else {
      onChange([...value, item]);
      remember(item);
    }
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? options.filter((o) => o.toLowerCase().includes(q)) : options;
    return base.slice(0, 60);
  }, [options, query]);

  const suggestions = useMemo(
    () => (query.trim() ? [] : [...recent, ...popular].filter((v, i, a) => a.indexOf(v) === i).slice(0, 10)),
    [recent, popular, query],
  );

  const exactExists = options.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn(!value.length && "text-muted-foreground")}>
              {value.length ? `${value.length} selected` : placeholder}
            </span>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[min(28rem,90vw)] p-0 pointer-events-auto" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder={placeholder} value={query} onValueChange={setQuery} />
            <CommandList className="max-h-72">
              {suggestions.length > 0 && (
                <CommandGroup heading={recent.length ? "Recent & popular" : "Popular"}>
                  {suggestions.map((item) => (
                    <CommandItem key={`s-${item}`} value={item} onSelect={() => toggle(item)}>
                      <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
                      {item}
                      {value.includes(item) && <Check className="ml-auto h-4 w-4" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandGroup heading="All options">
                {filtered.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => toggle(item)}>
                    {item}
                    {value.includes(item) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
              {allowCustom && query.trim() && !exactExists && (
                <CommandGroup heading="Add your own">
                  <CommandItem value={`add-${query}`} onSelect={() => toggle(query.trim())}>
                    Add “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
              )}
              {!filtered.length && !query.trim() && <CommandEmpty>No options.</CommandEmpty>}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary bg-primary px-3 py-1 text-sm text-primary-foreground"
            >
              {item}
              <button type="button" onClick={() => toggle(item)} aria-label={`Remove ${item}`}>
                <X className="h-3.5 w-3.5 opacity-80" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}