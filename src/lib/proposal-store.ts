import type { ProposalInput } from "./proposal-schema";

export type ProposalVersion = {
  createdAt: string;
  label: string;
  markdown: string;
};

export type SavedProposal = {
  id: string;
  businessName: string;
  createdAt: string;
  markdown: string;
  summary?: string | undefined;
  input: ProposalInput;
  complete: boolean;
  versions?: ProposalVersion[] | undefined;
};

const KEY = "aniweb.proposals.v1";

export function loadProposals(): SavedProposal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedProposal[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function getProposal(id: string): SavedProposal | undefined {
  return loadProposals().find((p) => p.id === id);
}

export function saveProposal(record: SavedProposal) {
  if (typeof window === "undefined") return;
  const list = loadProposals().filter((p) => p.id !== record.id);
  list.unshift(record);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30)));
  } catch {
    /* storage full — keep the newest only */
    window.localStorage.setItem(KEY, JSON.stringify([record]));
  }
}

export function deleteProposal(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(loadProposals().filter((p) => p.id !== id)));
}

const MAX_VERSIONS = 12;

/** Append a snapshot of `markdown` to the record's version history. */
export function withVersion(
  record: SavedProposal,
  markdown: string,
  label: string,
): SavedProposal {
  if (!markdown.trim()) return record;
  const versions = record.versions ?? [];
  if (versions[0]?.markdown === markdown) return record;
  return {
    ...record,
    versions: [{ createdAt: new Date().toISOString(), label, markdown }, ...versions].slice(
      0,
      MAX_VERSIONS,
    ),
  };
}

export function proposalFileName(name: string, createdAt: string) {
  const date = new Date(createdAt);
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const slug = (name || "website").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug}-${stamp}`;
}

/** Professional, human-readable document file name (no extension). */
export function proposalDocName(
  name: string,
  createdAt: string,
  kind: "proposal" | "summary",
) {
  const date = new Date(createdAt);
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const brand = (name || "Client")
    .replace(/[^\p{L}\p{N}&\s-]/gu, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w.length > 2 ? w[0]!.toUpperCase() + w.slice(1) : w.toUpperCase()))
    .join("-")
    .slice(0, 60);
  const doc = kind === "summary" ? "Website-Proposal-One-Page-Summary" : "Website-Proposal";
  return `${brand}-${doc}-${stamp}-Aniweb-Designs`;
}

export function newProposalId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

const PENDING = "aniweb.pending.v1";

export function stashPendingInput(id: string, input: ProposalInput) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(PENDING, JSON.stringify({ id, input }));
}

export function takePendingInput(id: string): ProposalInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(PENDING);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { id: string; input: ProposalInput };
    return parsed.id === id ? parsed.input : null;
  } catch {
    return null;
  }
}