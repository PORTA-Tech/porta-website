import { getStartupDiagnostics } from "./_lib/betaRequestConfig";
import {
  methodNotAllowed,
  sendJson,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http";

export const config = {
  runtime: "nodejs",
};

export default function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    methodNotAllowed(response, ["GET", "HEAD"]);
    return;
  }

  const diagnostics = getStartupDiagnostics();
  if (request.method === "HEAD") {
    response.status(diagnostics.ok ? 200 : 503).end();
    return;
  }

  sendJson(response, diagnostics.ok ? 200 : 503, diagnostics);
}
