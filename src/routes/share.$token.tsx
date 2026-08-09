import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandHeader } from "@/components/BrandHeader";
import { ProposalView } from "@/components/proposal/ProposalView";
import { fetchSharedProposal, type SharedProposalResult } from "@/lib/share.functions";

const title = "Shared website proposal | Pitchcraft";
const description =
  "View a website proposal shared via Pitchcraft by Aniweb Designs — strategy, design direction, SEO, stack, roadmap and costs.";

export const Route = createFileRoute("/share/$token")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SharedProposalPage,
});

function SharedProposalPage() {
  const { token } = Route.useParams();
  const load = useServerFn(fetchSharedProposal);

  const [state, setState] = useState<SharedProposalResult | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(true);
  const [view, setView] = useState<"full" | "summary">("full");

  const attempt = async (pass: string) => {
    setBusy(true);
    try {
      setState(await load({ data: { token, password: pass } }));
    } catch {
      setState({ status: "not-found" });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void attempt("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const locked = state?.status === "password-required" || state?.status === "wrong-password";

  return (
    <main className="min-h-screen bg-background">
      <BrandHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        {busy && !state && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Opening proposal…
          </div>
        )}

        {state?.status === "not-found" && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            This share link is no longer available.
          </div>
        )}

        {locked && (
          <form
            className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-8"
            onSubmit={(e) => {
              e.preventDefault();
              void attempt(password);
            }}
          >
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-lg">This proposal is password protected</h1>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pass">Password</Label>
              <Input
                id="pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>
            {state?.status === "wrong-password" && (
              <p className="text-sm text-destructive">That password is not correct.</p>
            )}
            <Button type="submit" className="w-full" disabled={busy || !password}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Open proposal
            </Button>
          </form>
        )}

        {state?.status === "ok" && (
          <>
            {state.summary && (
              <div className="mb-6 flex gap-2 print:hidden">
                <Button
                  variant={view === "full" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("full")}
                >
                  Full proposal
                </Button>
                <Button
                  variant={view === "summary" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView("summary")}
                >
                  A4 summary
                </Button>
              </div>
            )}
            <div className={view === "summary" ? "a4-page" : undefined}>
              <ProposalView
                markdown={view === "summary" ? state.summary : state.markdown}
                businessName={state.businessName}
                streaming={false}
                createdAt={state.createdAt}
                variant={view}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}