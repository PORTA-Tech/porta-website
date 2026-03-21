export type ApiRequest = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = {
  setHeader(name: string, value: string | string[]): void;
  status(code: number): ApiResponse;
  json(payload: unknown): void;
  end(payload?: string): void;
};

export function sendJson(
  response: ApiResponse,
  statusCode: number,
  payload: unknown
) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.status(statusCode).json(payload);
}

export function methodNotAllowed(
  response: ApiResponse,
  allowedMethods: string[]
) {
  response.setHeader("Allow", allowedMethods);
  sendJson(response, 405, {
    ok: false,
    error: `Method not allowed. Use ${allowedMethods.join(", ")}.`,
    code: "method_not_allowed",
  });
}

export function parseJsonBody<T>(body: unknown): T | null {
  if (!body) {
    return null;
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body) as T;
    } catch {
      return null;
    }
  }

  if (typeof body === "object") {
    return body as T;
  }

  return null;
}
