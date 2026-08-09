import { useState } from "react";
import { Check, Copy, Link2, Loader2, Lock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createShareLink } from "@/lib/share.functions";

export function ShareDialog({
  businessName,
  markdown,
  summary,
  disabled,
}: {
  businessName: string;
  markdown: string;
  summary?: string | undefined;
  disabled?: boolean | undefined;
}) {
  const share = useServerFn(createShareLink);
  const [open, setOpen] = useState(false);
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setBusy(true);
    setError(null);
    setLink("");
    try {
      const res = await share({
        data: {
          businessName,
          markdown,
          summary,
          password: usePassword ? password.trim() : "",
        },
      });
      setLink(`${window.location.origin}/share/${res.token}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the link.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setLink("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Link2 className="h-4 w-4" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this proposal</DialogTitle>
          <DialogDescription>
            Creates a new public link with a snapshot of the proposal as it is right now.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Password protect</p>
                <p className="text-xs text-muted-foreground">Viewers must enter it to open the link.</p>
              </div>
            </div>
            <Switch checked={usePassword} onCheckedChange={setUsePassword} />
          </div>

          {usePassword && (
            <div className="space-y-1.5">
              <Label htmlFor="share-password">Password</Label>
              <Input
                id="share-password"
                type="text"
                value={password}
                maxLength={128}
                placeholder="e.g. aniweb2026"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <Button
            className="w-full"
            onClick={() => void generate()}
            disabled={busy || (usePassword && password.trim().length < 4)}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Generate public link
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {link && (
            <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
              <p className="break-all text-sm">{link}</p>
              <Button variant="outline" size="sm" onClick={() => void copy()}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              {usePassword && password.trim() && (
                <p className="text-xs text-muted-foreground">
                  Share the password separately — it is not included in the link.
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}