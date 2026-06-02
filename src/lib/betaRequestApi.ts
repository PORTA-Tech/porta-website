export type BetaRequestPayload = {
  workEmail: string;
  role: string;
  hoursPerDay: string;
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

const DEFAULT_API_BASE_URL = "/api";
const REQUEST_TIMEOUT_MS = 12000;

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
    const response = await fetch(getEndpoint("/send-email"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const parsed = await parseApiResponse(response);
    if (!response.ok) {
      return normalizeFailure(parsed, "We could not send your request right now.");
    }

    if (parsed && typeof parsed === "object") {
      const candidate = parsed as { message?: unknown };
      if (typeof candidate.message === "string" && candidate.message.trim()) {
        return { ok: true, message: candidate.message };
      }
    }

    return { ok: true, message: "Thanks. Your beta request was sent." };
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
      error: "The beta request service is unavailable right now.",
      code: "network_error",
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}
