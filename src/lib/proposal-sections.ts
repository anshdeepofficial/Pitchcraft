export type ProposalSection = {
  index: number;
  heading: string;
  title: string;
  body: string;
  start: number;
  end: number;
  verified: boolean;
  unverifiedCount: number;
};

const UNVERIFIED = /not publicly available|unable to verify|request this information/i;

/** Split a proposal into its "## ..." sections. */
export function parseSections(markdown: string): ProposalSection[] {
  if (!markdown.trim()) return [];
  const re = /^##\s+(.+)$/gm;
  const marks: { heading: string; at: number; after: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) {
    marks.push({ heading: m[1]!.trim(), at: m.index, after: m.index + m[0].length });
  }
  return marks.map((mark, i) => {
    const end = i + 1 < marks.length ? marks[i + 1]!.at : markdown.length;
    const body = markdown.slice(mark.after, end);
    const matches = body.match(new RegExp(UNVERIFIED.source, "gi"));
    return {
      index: i,
      heading: mark.heading,
      title: mark.heading.replace(/^\d+\.\s*/, ""),
      body,
      start: mark.at,
      end,
      verified: !matches,
      unverifiedCount: matches?.length ?? 0,
    };
  });
}

export function replaceSection(markdown: string, section: ProposalSection, replacement: string) {
  const clean = replacement.trim().replace(/^```(?:markdown)?\s*/i, "").replace(/```$/, "").trim();
  const withHeading = /^##\s+/.test(clean) ? clean : `## ${section.heading}\n\n${clean}`;
  return `${markdown.slice(0, section.start)}${withHeading}\n\n${markdown.slice(section.end)}`;
}

/** Sections the user most often wants to regenerate on their own. */
export function quickTargets(sections: ProposalSection[]) {
  const pick = (re: RegExp) => sections.find((s) => re.test(s.title));
  return [
    { label: "SEO", section: pick(/seo/i) },
    { label: "Pricing", section: pick(/cost|pricing|investment/i) },
    { label: "Copy", section: pick(/copy|content strategy/i) },
  ].filter((t): t is { label: string; section: ProposalSection } => Boolean(t.section));
}

export type VerificationDetail = {
  missing: string[];
  verified: string[];
  sourceHints: string[];
};

const cleanLine = (l: string) =>
  l
    .replace(/^[#>\-*\d.\s]+/, "")
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .replace(/\|/g, " — ")
    .replace(/\*\*/g, "")
    .trim();

/** Per-section breakdown of what was verified vs. flagged as unavailable. */
export function verificationDetail(section: ProposalSection): VerificationDetail {
  const lines = section.body
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !/^\|?\s*[-: ]+\|/.test(l)); // drop table separators

  const missing: string[] = [];
  const verified: string[] = [];
  const sourceHints: string[] = [];

  for (const raw of lines) {
    const line = cleanLine(raw);
    if (!line || line.length < 3) continue;
    if (UNVERIFIED.test(line)) {
      if (missing.length < 12) missing.push(line.slice(0, 240));
    } else if (/https?:\/\//i.test(line)) {
      if (sourceHints.length < 6) sourceHints.push(line.slice(0, 240));
    } else if (verified.length < 12) {
      verified.push(line.slice(0, 240));
    }
  }

  return { missing, verified, sourceHints };
}