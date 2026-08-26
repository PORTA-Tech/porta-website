// Every outbound destination on the page, in one place.
// Answers to the build brief's §13 open questions live here.

/** GitHub auto-resolves this to the newest published AriAgentInstaller.msi. */
export const DOWNLOAD_URL =
  "https://github.com/PORTA-Tech/porta-windows-releases/releases/latest/download/AriAgentInstaller.msi";

/**
 * The "Download for Windows" buttons scroll to the request form rather than
 * pulling the MSI straight down — the form is the only way a visitor can reach
 * us. The direct MSI link above is still used by the Solo plan's CTA.
 */
export const DOWNLOAD_HREF = "#download";

export const CONTACT_EMAIL = "insideporta2@gmail.com";

export function talkToUs(plan: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Porta ${plan} plan`)}`;
}

/**
 * §7 — the demo report at reports.useporta.com/r/demo does not exist yet, and
 * creating it deploys the live report service. Until it does, the button is an
 * in-page anchor to the report section rather than a dead link.
 */
export const REPORT_DEMO_HREF = "#report";
export const REPORT_DEMO_LABEL = "See a real report ↓";
