import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, SectionHeader } from "./fields/Field";
import { ChipSelect } from "./fields/ChipSelect";
import { SearchMultiSelect } from "./fields/SearchMultiSelect";
import { CountrySelect } from "./fields/CountrySelect";
import { UrlList, isValidUrl } from "./fields/UrlList";
import { PalettePicker, StyleCards } from "./fields/DesignPickers";
import {
  AUDIENCES,
  BRAND_PERSONALITIES,
  BUSINESS_GOALS,
  CMS_OPTIONS,
  CONTACT_METHODS,
  DEADLINE_PRESETS,
  INDUSTRIES,
  MARKETING_GOALS,
  PAGE_COUNTS,
  POPULAR_INDUSTRIES,
  SEO_GOALS,
  profileFor,
} from "@/lib/proposal-data";
import { emptyProposalInput, LABELS, type ProposalInput } from "@/lib/proposal-schema";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Your business", subtitle: "The basics. We only need a name to begin." },
  { title: "What you offer", subtitle: "Pick from suggestions tailored to your industry." },
  { title: "Where you want to grow", subtitle: "Plain-language goals — no marketing jargon needed." },
  { title: "How it should look", subtitle: "Choose a look you like, or let the AI recommend one." },
  { title: "Practical details", subtitle: "Budget, timing and how you'd like to manage the site." },
  { title: "Who we contact", subtitle: "Optional, but it makes the proposal client-ready." },
];

const BUDGETS = ["Under 1k", "1k – 3k", "3k – 7k", "7k – 15k", "15k – 30k", "30k+", "Not sure yet"];
const COLOR_MODES = ["I have brand colours", "Suggest colours for me", "Match my existing website"];

const DRAFT_KEY = "pitchcraft-intake-draft";

function loadDraft(): { step: number; values: ProposalInput } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { step?: number; values?: ProposalInput };
    if (!parsed?.values) return null;
    return { step: Math.min(Math.max(parsed.step ?? 0, 0), STEPS.length - 1), values: { ...emptyProposalInput, ...parsed.values } };
  } catch {
    return null;
  }
}

export function IntakeForm({
  loading,
  onSubmit,
  initialValues,
}: {
  loading: boolean;
  onSubmit: (data: ProposalInput) => void;
  initialValues?: ProposalInput | undefined;
}) {
  const [values, setValues] = useState<ProposalInput>(initialValues ?? emptyProposalInput);
  const [step, setStep] = useState(0);
  const [restored, setRestored] = useState(false);

  // Resume exactly where the user left off (unless a saved proposal was pre-filled).
  useEffect(() => {
    if (initialValues) {
      setRestored(true);
      return;
    }
    const draft = loadDraft();
    if (draft) {
      setValues(draft.values);
      setStep(draft.step);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  useEffect(() => {
    if (!restored || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, values }));
    } catch {
      /* storage full or unavailable — drafting is best-effort */
    }
  }, [step, values, restored]);

  const [detecting, setDetecting] = useState(false);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [assistError, setAssistError] = useState<string | null>(null);

  const set = <K extends keyof ProposalInput>(key: K, value: ProposalInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const profile = useMemo(() => profileFor(values.industries), [values.industries]);
  const symbol = useMemo(() => values.currency || "", [values.currency]);

  const detect = async () => {
    const url = values.websiteUrl.trim();
    if (!url || !isValidUrl(url)) {
      setDetectMsg("Enter a valid website address first.");
      return;
    }
    setDetecting(true);
    setDetectMsg(null);
    try {
      const res = await fetch("/api/detect-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as {
        found: boolean;
        businessName?: string;
        description?: string;
        colors?: string[];
        fonts?: string[];
        headings?: string[];
      };
      if (!data.found) {
        setDetectMsg("We couldn't read that site — no problem, just fill things in below.");
        return;
      }
      setValues((v) => ({
        ...v,
        businessName: v.businessName || (data.businessName ?? ""),
        description: v.description || (data.description ?? ""),
        colors: v.colors.length ? v.colors : (data.colors ?? []).slice(0, 4),
        fonts: v.fonts || (data.fonts ?? []).join(", "),
        detectedSiteNotes: [
          data.businessName ? `Site name: ${data.businessName}` : "",
          data.description ? `Meta description: ${data.description}` : "",
          data.headings?.length ? `Headings: ${data.headings.join(" | ")}` : "",
          data.fonts?.length ? `Fonts detected: ${data.fonts.join(", ")}` : "",
          data.colors?.length ? `Colours detected: ${data.colors.join(", ")}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      }));
      setDetectMsg("Found it — we filled in what we could verify. Edit anything that looks wrong.");
    } catch {
      setDetectMsg("We couldn't reach that site. You can carry on filling the form.");
    } finally {
      setDetecting(false);
    }
  };

  const writeDescription = async () => {
    setWriting(true);
    setAssistError(null);
    try {
      const res = await fetch("/api/assist-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: values.businessName,
          industries: values.industries,
          services: values.services,
          audience: values.targetAudience,
          country: values.country,
          draft: values.description,
        }),
      });
      if (!res.ok) {
        setAssistError((await res.text()) || "Could not write a description.");
        return;
      }
      const { text } = (await res.json()) as { text: string };
      if (text) set("description", text);
    } catch {
      setAssistError("Could not write a description right now.");
    } finally {
      setWriting(false);
    }
  };

  const canContinue = step > 0 || values.businessName.trim().length > 0;
  const isLast = step === STEPS.length - 1;

  const submit = () => {
    onSubmit({
      ...values,
      competitors: values.competitors.filter((c) => c.trim()),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isLast) submit();
        else setStep((s) => Math.min(s + 1, STEPS.length - 1));
      }}
      className="space-y-8"
    >
      {/* Stepper */}
      <ol className="flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50",
              )}
            >
              {i + 1}. {s.title}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <SectionHeader index={step + 1} title={STEPS[step]!.title} subtitle={STEPS[step]!.subtitle} />

        {step === 0 && (
          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={LABELS.businessName!} required htmlFor="businessName">
                <Input
                  id="businessName"
                  required
                  placeholder="Northwind Dental Care"
                  value={values.businessName}
                  onChange={(e) => set("businessName", e.target.value)}
                />
              </Field>

              <Field
                label={LABELS.websiteUrl!}
                hint="Have one already? We'll read it and fill in what we can verify."
                htmlFor="websiteUrl"
                action={
                  <Button type="button" variant="ghost" size="sm" onClick={detect} disabled={detecting}>
                    {detecting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                    {detecting ? "Reading…" : "Auto-fill"}
                  </Button>
                }
              >
                <Input
                  id="websiteUrl"
                  inputMode="url"
                  placeholder="example.com"
                  aria-invalid={!isValidUrl(values.websiteUrl)}
                  value={values.websiteUrl}
                  onChange={(e) => set("websiteUrl", e.target.value)}
                />
              </Field>
            </div>

            {detectMsg && <p className="text-xs text-muted-foreground">{detectMsg}</p>}

            <Field
              label={LABELS.industries!}
              hint="Pick one or more. Everything after this adapts to your choice."
            >
              <SearchMultiSelect
                options={INDUSTRIES}
                popular={POPULAR_INDUSTRIES}
                recentKey="recent-industries"
                placeholder="Search 150+ industries…"
                value={values.industries}
                onChange={(v) => set("industries", v)}
              />
            </Field>

            <Field label={LABELS.country!} hint="Sets your currency, timezone and date format automatically.">
              <CountrySelect
                value={values.country}
                onSelect={(c) =>
                  setValues((v) => ({
                    ...v,
                    country: c.name,
                    currency: `${c.symbol} ${c.currency}`,
                    timezone: c.timezone,
                    dateFormat: c.dateFormat,
                    languages: v.languages.length ? v.languages : c.languages.slice(0, 2),
                    businessPhone: v.businessPhone || `${c.dial} `,
                  }))
                }
              />
              {values.country && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {values.currency} · {values.timezone} · dates as {values.dateFormat}
                </p>
              )}
            </Field>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={LABELS.city!} htmlFor="city">
                <Input id="city" value={values.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label={LABELS.state!} htmlFor="state">
                <Input id="state" value={values.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
              <Field label={LABELS.address!} htmlFor="address" className="sm:col-span-2">
                <Input id="address" value={values.address} onChange={(e) => set("address", e.target.value)} />
              </Field>
              <Field label={LABELS.postalCode!} htmlFor="postalCode">
                <Input id="postalCode" value={values.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
              </Field>
              <Field label={LABELS.mapsUrl!} htmlFor="mapsUrl">
                <Input id="mapsUrl" placeholder="Optional" value={values.mapsUrl} onChange={(e) => set("mapsUrl", e.target.value)} />
              </Field>
              <Field label={LABELS.businessEmail!} htmlFor="businessEmail">
                <Input id="businessEmail" type="email" value={values.businessEmail} onChange={(e) => set("businessEmail", e.target.value)} />
              </Field>
              <Field label={LABELS.businessPhone!} htmlFor="businessPhone">
                <Input id="businessPhone" inputMode="tel" value={values.businessPhone} onChange={(e) => set("businessPhone", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8">
            <Field
              label={LABELS.services!}
              hint={values.industries.length ? "Suggestions based on your industry — tap to select." : "Pick your industry first for tailored suggestions."}
            >
              <ChipSelect options={profile.services} value={values.services} onChange={(v) => set("services", v)} />
            </Field>

            <Field label={LABELS.products!} hint="Skip this if you only sell services.">
              <ChipSelect options={profile.products} value={values.products} onChange={(v) => set("products", v)} />
            </Field>

            <Field label={LABELS.targetAudience!} hint="Who actually buys from you?">
              <ChipSelect
                options={Array.from(new Set([...profile.audience, ...AUDIENCES])).slice(0, 30)}
                value={values.targetAudience}
                onChange={(v) => set("targetAudience", v)}
              />
            </Field>

            <Field
              label={LABELS.description!}
              hint="A short paragraph in your own words. The AI can draft one from what you've selected — it will never invent facts."
              htmlFor="description"
              action={
                <Button type="button" variant="ghost" size="sm" onClick={writeDescription} disabled={writing}>
                  {writing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {writing ? "Writing…" : "Write it for me"}
                </Button>
              }
            >
              <Textarea
                id="description"
                rows={5}
                placeholder="What you do, who you do it for, and what makes you different."
                value={values.description}
                onChange={(e) => set("description", e.target.value)}
              />
              {assistError && <p className="mt-1.5 text-xs text-destructive">{assistError}</p>}
            </Field>

            <Field label={LABELS.competitors!} hint="Only real websites you know of. We never invent competitors.">
              <UrlList value={values.competitors} onChange={(v) => set("competitors", v)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <Field label={LABELS.goals!} hint="What should the website actually achieve?">
              <ChipSelect
                options={Array.from(new Set([...profile.goals, ...BUSINESS_GOALS]))}
                value={values.goals}
                onChange={(v) => set("goals", v)}
              />
            </Field>
            <Field label={LABELS.seoGoals!} hint="How people should find you on Google.">
              <ChipSelect options={SEO_GOALS} value={values.seoGoals} onChange={(v) => set("seoGoals", v)} />
            </Field>
            <Field label={LABELS.marketingGoals!}>
              <ChipSelect options={MARKETING_GOALS} value={values.marketingGoals} onChange={(v) => set("marketingGoals", v)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <Field label={LABELS.style!} hint="Pick the look that feels right — you'll see a preview of each.">
              <StyleCards value={values.style} onChange={(v) => set("style", v)} />
            </Field>
            <Field label={LABELS.brandPersonality!} hint="How should the site feel to a visitor?">
              <ChipSelect options={BRAND_PERSONALITIES} value={values.brandPersonality} onChange={(v) => set("brandPersonality", v)} />
            </Field>
            <Field label={LABELS.colorMode!}>
              <ChipSelect single allowCustom={false} options={COLOR_MODES} value={values.colorMode ? [values.colorMode] : []} onChange={(v) => set("colorMode", v[0] ?? "")} />
            </Field>
            {values.colorMode !== "Suggest colours for me" && (
              <Field label={LABELS.colors!} hint="Choose a ready-made palette or pick exact colours.">
                <PalettePicker value={values.colors} onChange={(v) => set("colors", v)} />
              </Field>
            )}
            <Field label={LABELS.fonts!} hint="Leave blank and we'll recommend a pairing." htmlFor="fonts">
              <Input id="fonts" placeholder="e.g. Söhne, or open to suggestions" value={values.fonts} onChange={(e) => set("fonts", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <Field label={LABELS.budget!} hint={symbol ? `Ranges shown in ${symbol}.` : "Pick a range — this shapes the recommended scope."}>
              <ChipSelect
                single
                options={BUDGETS.map((b) => (symbol && b !== "Not sure yet" ? `${symbol} ${b}` : b))}
                value={values.budget ? [values.budget] : []}
                onChange={(v) => set("budget", v[0] ?? "")}
                customPlaceholder="Or type an exact budget"
              />
            </Field>
            <Field label={LABELS.deadline!}>
              <ChipSelect
                single
                options={DEADLINE_PRESETS}
                value={values.deadline ? [values.deadline] : []}
                onChange={(v) => set("deadline", v[0] ?? "")}
                customPlaceholder="Or a specific date"
              />
            </Field>
            <Field label={LABELS.pages!} hint="Not sure? Leave it — we'll propose a sitemap.">
              <ChipSelect
                single
                options={PAGE_COUNTS}
                value={values.pages ? [values.pages] : []}
                onChange={(v) => set("pages", v[0] ?? "")}
                customPlaceholder="Exact number"
              />
            </Field>
            <Field label={LABELS.languages!}>
              <ChipSelect
                options={Array.from(new Set(["English", ...values.languages]))}
                value={values.languages}
                onChange={(v) => set("languages", v)}
                customPlaceholder="Add a language"
              />
            </Field>
            <Field label={LABELS.cms!} hint="In plain terms: how do you want to update the site later?">
              <div className="grid gap-2 sm:grid-cols-2">
                {CMS_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("cms", values.cms === o.value ? "" : o.value)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition-colors",
                      values.cms === o.value ? "border-primary bg-accent/10" : "border-border hover:border-primary/50",
                    )}
                  >
                    <p className="text-sm">{o.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{o.hint}</p>
                  </button>
                ))}
              </div>
            </Field>
            <Field label={LABELS.integrations!} hint="Things the site should connect to.">
              <ChipSelect options={profile.integrations} value={values.integrations} onChange={(v) => set("integrations", v)} />
            </Field>
            <Field label={LABELS.specialRequirements!} htmlFor="specialRequirements">
              <Textarea
                id="specialRequirements"
                rows={3}
                placeholder="Accessibility, privacy rules, multiple locations, anything unusual."
                value={values.specialRequirements}
                onChange={(e) => set("specialRequirements", e.target.value)}
              />
            </Field>
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label={LABELS.contactName!} htmlFor="contactName">
              <Input id="contactName" value={values.contactName} onChange={(e) => set("contactName", e.target.value)} />
            </Field>
            <Field label={LABELS.contactPosition!} htmlFor="contactPosition">
              <Input id="contactPosition" placeholder="Owner, Marketing Manager…" value={values.contactPosition} onChange={(e) => set("contactPosition", e.target.value)} />
            </Field>
            <Field label={LABELS.contactEmail!} htmlFor="contactEmail">
              <Input id="contactEmail" type="email" value={values.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
            </Field>
            <Field label={LABELS.contactPhone!} htmlFor="contactPhone">
              <Input id="contactPhone" inputMode="tel" value={values.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} />
            </Field>
            <Field label={LABELS.preferredContact!} className="sm:col-span-2">
              <ChipSelect
                single
                allowCustom={false}
                options={CONTACT_METHODS}
                value={values.preferredContact ? [values.preferredContact] : []}
                onChange={(v) => set("preferredContact", v[0] ?? "")}
              />
            </Field>
            <Field label={LABELS.registrationNumber!} htmlFor="registrationNumber" className="sm:col-span-2">
              <Input id="registrationNumber" placeholder="Optional" value={values.registrationNumber} onChange={(e) => set("registrationNumber", e.target.value)} />
            </Field>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} disabled={loading}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}

        {!isLast ? (
          <>
            <Button type="submit" size="lg">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" onClick={submit} disabled={!canContinue || loading}>
              Skip ahead and generate
            </Button>
          </>
        ) : (
          <Button type="submit" size="lg" disabled={loading || !values.businessName.trim()}>
            {loading ? "Writing proposal…" : "Generate my proposal"}
          </Button>
        )}

        <p className="text-xs text-muted-foreground">
          Anything you leave blank is reported as “Not publicly available” — never invented.
        </p>
      </div>
    </form>
  );
}