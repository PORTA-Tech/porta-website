import { getRuntimeConfig, getStartupDiagnostics } from "./_lib/betaRequestConfig";
import {
  methodNotAllowed,
  parseJsonBody,
  sendJson,
  type ApiRequest,
  type ApiResponse,
} from "./_lib/http";

export const config = {
  runtime: "nodejs",
};

type BetaRequestBody = {
  workEmail?: unknown;
  role?: unknown;
  scatterSource?: unknown;
  hoursPerDay?: unknown;
};

type ValidatedBetaRequest = {
  workEmail: string;
  role: string;
  scatterSource: string;
  hoursPerDay: string;
};

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRequest(body: BetaRequestBody | null): {
  ok: true;
  value: ValidatedBetaRequest;
} | {
  ok: false;
  error: string;
} {
  if (!body) {
    return { ok: false, error: "Request body must be valid JSON." };
  }

  const workEmail = normalizeText(body.workEmail);
  const role = normalizeText(body.role);
  const scatterSource = normalizeText(body.scatterSource);
  const hoursPerDay = normalizeText(body.hoursPerDay);

  if (!/\S+@\S+\.\S+/.test(workEmail)) {
    return { ok: false, error: "A valid work email is required." };
  }

  if (!role) {
    return { ok: false, error: "Role is required." };
  }

  if (!scatterSource) {
    return { ok: false, error: "Biggest source of the day getting scattered is required." };
  }

  if (!hoursPerDay) {
    return { ok: false, error: "Hours per day on a computer is required." };
  }

  return {
    ok: true,
    value: {
      workEmail,
      role,
      scatterSource,
      hoursPerDay,
    },
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("mail_send_timeout"));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function buildTextBody(request: ValidatedBetaRequest) {
  return [
    "New Ari Windows beta request",
    "",
    `Work email: ${request.workEmail}`,
    `Role: ${request.role}`,
    `Hours per day on computer: ${request.hoursPerDay}`,
    "",
    "Biggest source of the day getting scattered:",
    request.scatterSource,
    "",
    `Submitted at UTC: ${new Date().toISOString()}`,
  ].join("\n");
}

function buildHtmlBody(request: ValidatedBetaRequest) {
  return `
    <h2>New Ari Windows beta request</h2>
    <p><strong>Work email:</strong> ${request.workEmail}</p>
    <p><strong>Role:</strong> ${request.role}</p>
    <p><strong>Hours per day on computer:</strong> ${request.hoursPerDay}</p>
    <p><strong>Biggest source of the day getting scattered:</strong></p>
    <p>${request.scatterSource.replace(/\n/g, "<br />")}</p>
    <p><strong>Submitted at UTC:</strong> ${new Date().toISOString()}</p>
  `;
}

export default async function handler(
  request: ApiRequest,
  response: ApiResponse
) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  const runtimeConfig = getRuntimeConfig();
  if (!runtimeConfig) {
    sendJson(response, 503, {
      ok: false,
      error: "The beta request service is not configured yet.",
      code: "smtp_not_configured",
      diagnostics: getStartupDiagnostics(),
    });
    return;
  }

  const validation = validateRequest(parseJsonBody<BetaRequestBody>(request.body));
  if (!validation.ok) {
    sendJson(response, 400, {
      ok: false,
      error: validation.error,
      code: "invalid_request",
    });
    return;
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: runtimeConfig.smtpHost,
      port: runtimeConfig.smtpPort,
      secure: runtimeConfig.smtpSecure,
      auth: {
        user: runtimeConfig.smtpUser,
        pass: runtimeConfig.smtpPass,
      },
    });

    await withTimeout(
      transporter.sendMail({
        from: runtimeConfig.smtpFrom,
        to: runtimeConfig.betaRequestTo,
        replyTo: validation.value.workEmail,
        subject: `Ari Windows beta request: ${validation.value.role}`,
        text: buildTextBody(validation.value),
        html: buildHtmlBody(validation.value),
      }),
      runtimeConfig.timeoutMs
    );

    sendJson(response, 200, {
      ok: true,
      message: "Thanks. Your beta request was sent.",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "unknown_error";
    const isTimeout = errorMessage === "mail_send_timeout";

    sendJson(response, isTimeout ? 504 : 502, {
      ok: false,
      error: isTimeout
        ? "The request took too long. Please try again."
        : "We could not send your request right now. Please try again.",
      code: isTimeout ? "mail_send_timeout" : "mail_send_failed",
    });
  }
}
