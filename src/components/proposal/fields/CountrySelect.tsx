import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COUNTRIES, type Country } from "@/lib/proposal-data";
import { cn } from "@/lib/utils";

export function CountrySelect({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (country: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = COUNTRIES.find((c) => c.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
          <span className={cn(!current && "text-muted-foreground")}>
            {current ? `${current.flag}  ${current.name} · ${current.dial} · ${current.currency}` : "Search your country…"}
          </span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(28rem,90vw)] p-0 pointer-events-auto" align="start">
        <Command>
          <CommandInput placeholder="Type a country…" />
          <CommandList className="max-h-72">
            <CommandEmpty>No country found.</CommandEmpty>
            {COUNTRIES.map((c) => (
              <CommandItem
                key={c.code}
                value={`${c.name} ${c.code} ${c.currency} ${c.dial}`}
                onSelect={() => {
                  onSelect(c);
                  setOpen(false);
                }}
              >
                <span className="mr-2">{c.flag}</span>
                <span>{c.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {c.dial} · {c.symbol} {c.currency} · {c.timezone}
                </span>
                {value === c.name && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}