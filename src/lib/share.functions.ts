import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

function hashPassword(token: string, password: string) {
  return createHash("sha256").update(`${token}:${password}`, "utf8").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export type CreateShareInput = {
  businessName: string;
  markdown: string;
  summary?: string | undefined;
  password?: string | undefined;
};

export const createShareLink = createServerFn({ method: "POST" })
  .inputValidator((data: CreateShareInput) => {
    const markdown = String(data.markdown ?? "").slice(0, 400_000);
    if (!markdown.trim()) throw new Error("Nothing to share yet.");
    const password = String(data.password ?? "").trim().slice(0, 128);
    return {
      businessName: String(data.businessName ?? "").slice(0, 200),
      markdown,
      summary: String(data.summary ?? "").slice(0, 200_000),
      password,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const token = randomBytes(12).toString("base64url");
    const { error } = await supabaseAdmin.from("shared_proposals").insert({
      token,
      business_name: data.businessName,
      markdown: data.markdown,
      summary: data.summary || null,
      password_hash: data.password ? hashPassword(token, data.password) : null,
    });
    if (error) throw new Error("Could not create the share link.");
    return { token, protected: Boolean(data.password) };
  });

export type SharedProposalResult =
  | { status: "ok"; businessName: string; markdown: string; summary: string; createdAt: string }
  | { status: "password-required" }
  | { status: "wrong-password" }
  | { status: "not-found" };

export const fetchSharedProposal = createServerFn({ method: "POST" })
  .inputValidator((data: { token: string; password?: string | undefined }) => ({
    token: String(data.token ?? "").slice(0, 64),
    password: String(data.password ?? "").slice(0, 128),
  }))
  .handler(async ({ data }): Promise<SharedProposalResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("shared_proposals")
      .select("business_name, markdown, summary, password_hash, created_at, views")
      .eq("token", data.token)
      .maybeSingle();

    if (!row) return { status: "not-found" };
    if (row.password_hash) {
      if (!data.password) return { status: "password-required" };
      if (!safeEqual(row.password_hash, hashPassword(data.token, data.password))) {
        return { status: "wrong-password" };
      }
    }

    await supabaseAdmin
      .from("shared_proposals")
      .update({ views: (row.views ?? 0) + 1 })
      .eq("token", data.token);

    return {
      status: "ok",
      businessName: row.business_name ?? "",
      markdown: row.markdown ?? "",
      summary: row.summary ?? "",
      createdAt: row.created_at,
    };
  });