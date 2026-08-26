// Every outbound destination and every call to action, in one place.

/** GitHub auto-resolves this to the newest published AriAgentInstaller.msi. */
export const DOWNLOAD_URL =
  "https://github.com/PORTA-Tech/porta-windows-releases/releases/latest/download/AriAgentInstaller.msi";

export const CONTACT_EMAIL = "insideporta2@gmail.com";

/**
 * ONE verb, everywhere. The page previously offered "Try it free", "Download for Windows",
 * "Start 14 days free" and "Send me the download" for a single action, which reads as four
 * different offers. Nav, hero and the Solo plan all say this and all land on the form.
 */
export const CTA_LABEL = "Try Ari free";
export const CTA_HREF = "#download";

/**
 * §7 of the first brief — the demo report at reports.useporta.com/r/demo does not exist yet,
 * and creating it deploys the live report service. Until it does, this is an in-page anchor
 * rather than a dead link.
 */
export const REPORT_HREF = "#report";
export const REPORT_LABEL = "See a real report ↓";

/** The footer's Contact link has to resolve somewhere. */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Ari")}`;

export function talkToUs(plan: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Ari ${plan} plan`)}`;
}
