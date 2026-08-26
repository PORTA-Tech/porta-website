/**
 * The download form's client.
 *
 * It posts to the CONTROL PLANE, not to this repo. porta-website ships as a static site, so the
 * `api/` functions here have never executed — a POST to /api/send-email is answered by the static
 * host with an empty 200, and this file used to read that as success. The control plane is a live
 * Node service with a verified sender, so the endpoint lives there instead.
 */
export type BetaRequestPayload = {
  workEmail: string;
  role: string;
  /** "How do you tell clients where things stand today?" — optional. */
  clientUpdateMethod: string;
};

type BetaRequestSuccess = {
  ok: true;
  message: string;
};

type BetaRequestFailure = {
  ok: false;
  error: string;
  code?: string;
};

const DEFAULT_API_BASE_URL = "https://porta-control-plane.onrender.com";
const REQUEST_TIMEOUT_MS = 20000;

function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_PORTA_API_BASE_URL?.trim();
  if (!configuredBaseUrl) {
    return DEFAULT_API_BASE_URL;
  }

  return configuredBaseUrl.replace(/\/+$/, "");
}

function getEndpoint(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function normalizeFailure(
  payload: unknown,
  fallbackError: string
): BetaRequestFailure {
  if (payload && typeof payload === "object") {
    const candidate = payload as { error?: unknown; code?: unknown };
    if (typeof candidate.error === "string" && candidate.error.trim()) {
      return {
        ok: false,
        error: candidate.error,
        code: typeof candidate.code === "string" ? candidate.code : undefined,
      };
    }
  }

  return { ok: false, error: fallbackError };
}

async function parseApiResponse(response: Response) {
  const raw = await response.text();
  if (!raw.trim()) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

export async function submitBetaRequest(
  payload: BetaRequestPayload
): Promise<BetaRequestSuccess | BetaRequestFailure> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getEndpoint("/api/download-request"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const parsed = await parseApiResponse(response);
    if (!response.ok) {
      if (response.status === 429) {
        return {
          ok: false,
          error: "Too many requests from here. Please try again shortly.",
          code: "rate_limited",
        };
      }

      return normalizeFailure(parsed, "We could not send your request right now.");
    }

    // A 200 alone is not proof the request was handled. A static host with no function mounted
    // answers POST with an empty 200, which used to render as success while nothing was ever
    // sent. Require a JSON object back before believing it.
    if (!parsed || typeof parsed !== "object") {
      return {
        ok: false,
        error: "We could not send your request right now. Please try again.",
        code: "invalid_response",
      };
    }

    const candidate = parsed as { message?: unknown };
    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return { ok: true, message: candidate.message };
    }

    return { ok: true, message: "Thanks. We will be in touch shortly." };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        ok: false,
        error: "The request took too long. Please try again.",
        code: "request_timeout",
      };
    }

    return {
      ok: false,
      error: "The request service is unavailable right now.",
      code: "network_error",
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
