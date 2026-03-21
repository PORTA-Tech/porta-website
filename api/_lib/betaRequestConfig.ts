type StartupDiagnostics = {
  ok: boolean;
  service: "ari-beta-request-api";
  smtpConfigured: boolean;
  timeoutMs: number;
  missingEnv: string[];
  invalidEnv: string[];
};

type RuntimeConfig = {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  betaRequestTo: string;
  timeoutMs: number;
};

type ConfigState = {
  diagnostics: StartupDiagnostics;
  runtime: RuntimeConfig | null;
};

const DEFAULT_TIMEOUT_MS = 10000;
const SERVICE_NAME = "ari-beta-request-api" as const;

function normalizeBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return fallback;
}

function readConfig(): ConfigState {
  const missingEnv: string[] = [];
  const invalidEnv: string[] = [];

  const smtpHost = process.env.SMTP_HOST?.trim() ?? "";
  const smtpPortRaw = process.env.SMTP_PORT?.trim() ?? "";
  const smtpUser = process.env.SMTP_USER?.trim() ?? "";
  const smtpPass = process.env.SMTP_PASS?.trim() ?? "";
  const smtpFrom = process.env.SMTP_FROM?.trim() ?? "";
  const betaRequestTo =
    process.env.BETA_REQUEST_TO?.trim() ??
    process.env.SMTP_TO?.trim() ??
    smtpUser;
  const timeoutMsRaw = process.env.SMTP_SEND_TIMEOUT_MS?.trim() ?? "";

  if (!smtpHost) missingEnv.push("SMTP_HOST");
  if (!smtpPortRaw) missingEnv.push("SMTP_PORT");
  if (!smtpUser) missingEnv.push("SMTP_USER");
  if (!smtpPass) missingEnv.push("SMTP_PASS");
  if (!smtpFrom) missingEnv.push("SMTP_FROM");
  if (!betaRequestTo) missingEnv.push("BETA_REQUEST_TO");

  const smtpPort = Number(smtpPortRaw);
  if (smtpPortRaw && (!Number.isInteger(smtpPort) || smtpPort <= 0)) {
    invalidEnv.push("SMTP_PORT");
  }

  const timeoutMs = timeoutMsRaw ? Number(timeoutMsRaw) : DEFAULT_TIMEOUT_MS;
  if (timeoutMsRaw && (!Number.isFinite(timeoutMs) || timeoutMs <= 0)) {
    invalidEnv.push("SMTP_SEND_TIMEOUT_MS");
  }

  const diagnostics: StartupDiagnostics = {
    ok: missingEnv.length === 0 && invalidEnv.length === 0,
    service: SERVICE_NAME,
    smtpConfigured: missingEnv.length === 0 && invalidEnv.length === 0,
    timeoutMs: Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : DEFAULT_TIMEOUT_MS,
    missingEnv,
    invalidEnv,
  };

  if (!diagnostics.ok) {
    return {
      diagnostics,
      runtime: null,
    };
  }

  return {
    diagnostics,
    runtime: {
      smtpHost,
      smtpPort,
      smtpSecure: normalizeBoolean(process.env.SMTP_SECURE, smtpPort === 465),
      smtpUser,
      smtpPass,
      smtpFrom,
      betaRequestTo,
      timeoutMs: diagnostics.timeoutMs,
    },
  };
}

const configState = readConfig();

export function getStartupDiagnostics() {
  return configState.diagnostics;
}

export function getRuntimeConfig() {
  return configState.runtime;
}
