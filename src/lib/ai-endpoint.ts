// Central configuration for the AI provider used by the proposal endpoints.
// Any OpenAI-compatible `/v1/responses` API works; configure it with
// AI_API_BASE_URL, AI_API_KEY and AI_MODEL. These are read on the server only.

const DEFAULT_BASE_URL = "https://ai.gateway.lovable.dev/v1";
const DEFAULT_MODEL = "openai/gpt-5.6-sol";

function baseUrl(): string {
  return (process.env["AI_API_BASE_URL"] || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

export function aiApiKey(): string | undefined {
  return process.env["AI_API_KEY"] || process.env["LOVABLE_API_KEY"];
}

export function aiModel(): string {
  return process.env["AI_MODEL"] || DEFAULT_MODEL;
}

export function aiResponsesUrl(): string {
  return `${baseUrl()}/responses`;
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
