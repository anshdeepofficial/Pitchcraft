// Central configuration for the AI provider used by the proposal endpoints.
// Supports two request styles:
//   * OpenAI-style `/v1/responses` (default, e.g. OpenAI or the managed gateway)
//   * OpenAI-compatible `/v1/chat/completions` (Google AI Studio / Gemini, Groq, …)
// Configure with AI_API_KEY (or GOOGLE_AI_API_KEY / GEMINI_API_KEY),
// AI_API_BASE_URL and AI_MODEL. Read on the server only.

const DEFAULT_BASE_URL = "https://ai.gateway.lovable.dev/v1";
const DEFAULT_MODEL = "openai/gpt-5.6-sol";

const GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai";
const GOOGLE_DEFAULT_MODEL = "gemini-2.5-flash";

function googleKey(): string | undefined {
  return process.env["GOOGLE_AI_API_KEY"] || process.env["GEMINI_API_KEY"] || undefined;
}

// True when the project is configured to talk to Google AI Studio (Gemini).
function isGoogle(): boolean {
  if (process.env["AI_API_BASE_URL"]) {
    return process.env["AI_API_BASE_URL"].includes("generativelanguage.googleapis.com");
  }
  return Boolean(googleKey());
}

function baseUrl(): string {
  const configured = process.env["AI_API_BASE_URL"];
  if (configured) return configured.replace(/\/+$/, "");
  return isGoogle() ? GOOGLE_BASE_URL : DEFAULT_BASE_URL;
}

// Google AI Studio exposes only the chat-completions shape.
function usesChatCompletions(): boolean {
  const style = process.env["AI_API_STYLE"];
  if (style) return style === "chat";
  return isGoogle();
}

export function aiApiKey(): string | undefined {
  return (
    process.env["AI_API_KEY"] ||
    googleKey() ||
    process.env["LOVABLE_API_KEY"] ||
    process.env["OPENAI_API_KEY"] ||
    undefined
  );
}

// Shown to the user when no key is present in the deployment environment.
export const AI_NOT_CONFIGURED_MESSAGE =
  "AI is not configured on this deployment. Add a GOOGLE_AI_API_KEY (Google AI Studio) or AI_API_KEY environment variable in your hosting project settings, then redeploy.";

export function aiModel(): string {
  return process.env["AI_MODEL"] || (isGoogle() ? GOOGLE_DEFAULT_MODEL : DEFAULT_MODEL);
}

export function aiResponsesUrl(): string {
  return usesChatCompletions() ? `${baseUrl()}/chat/completions` : `${baseUrl()}/responses`;
}

export function aiHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // The managed gateway authenticates with its own header; every other
  // OpenAI-compatible provider uses a standard bearer token.
  if (baseUrl().includes("ai.gateway.lovable.dev")) {
    headers["Lovable-API-Key"] = apiKey;
  } else {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }
  return headers;
}

/**
 * Builds a request body in whichever shape the configured provider speaks.
 */
export function aiRequestBody(options: {
  instructions?: string;
  input: string;
  stream?: boolean;
  effort?: "low" | "medium" | "high";
  priority?: boolean;
}): Record<string, unknown> {
  const { instructions, input, stream = false, effort = "low", priority = false } = options;

  if (usesChatCompletions()) {
    return {
      model: aiModel(),
      stream,
      messages: [
        ...(instructions ? [{ role: "system", content: instructions }] : []),
        { role: "user", content: input },
      ],
    };
  }

  return {
    model: aiModel(),
    stream,
    ...(priority ? { service_tier: "priority" } : {}),
    ...(instructions ? { instructions } : {}),
    input,
    reasoning: { effort },
  };
}

/** Text delta from one streamed SSE event, in either provider shape. */
export function aiStreamDelta(evt: unknown): string {
  const e = evt as {
    type?: string;
    delta?: string;
    choices?: { delta?: { content?: string } }[];
  };
  if (e?.type === "response.output_text.delta" && typeof e.delta === "string") return e.delta;
  const chunk = e?.choices?.[0]?.delta?.content;
  return typeof chunk === "string" ? chunk : "";
}

/** Full text from a non-streamed response, in either provider shape. */
export function aiResponseText(json: unknown): string {
  const j = json as {
    output_text?: string;
    output?: { content?: { type?: string; text?: string }[] }[];
    choices?: { message?: { content?: string } }[];
  };
  if (typeof j?.output_text === "string" && j.output_text) return j.output_text;
  const fromOutput = j?.output
    ?.flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text")
    .map((c) => c.text ?? "")
    .join("");
  if (fromOutput) return fromOutput;
  return j?.choices?.[0]?.message?.content ?? "";
}
