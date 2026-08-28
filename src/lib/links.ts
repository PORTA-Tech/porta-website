// Every outbound destination and every call to action, in one place.

/** GitHub auto-resolves this to the newest published AriAgentInstaller.msi. */
export const DOWNLOAD_URL =
  "https://github.com/PORTA-Tech/porta-windows-releases/releases/latest/download/AriAgentInstaller.msi";

export const CONTACT_EMAIL = "insideporta2@gmail.com";

/**
 * ONE verb, everywhere. The page previously offered "Try it free", "Download for Windows",
 * "Start 14 days free" and "Send me the download" for a single action, which reads as four
 * different offers.
 *
 * CHANGED 2026-08-25 — the nav and hero no longer go to a form. They scroll to Pricing, because
 * the download is not one offer: Solo downloads, Team and Agency talk to us. Sending everyone to
 * one form made the page promise a single thing it does not do.
 */
export const CTA_LABEL = "Get Ari free";
export const CTA_HREF = "#pricing";

/**
 * The Solo plan's button. It is the ONLY thing on the page that downloads, and it goes straight
 * to the MSI — no form in between. DOWNLOAD_URL resolves to whatever is newest at the moment it
 * is clicked, so a version rolled out tomorrow is picked up without touching this site.
 */
export const DOWNLOAD_LABEL = "Download Ari, free for 14 days";

/** Stated under the button, so the price is not a surprise after the download. */
export const TRIAL_NOTE = "Free for 14 days. Then $19 a month. No card to start.";

/**
 * Team and Agency. The form is CONTACT ONLY now: it does not send a download link and does not
 * pretend to, so it lives under a contact heading and nothing else points at it.
 */
export const CONTACT_FORM_HREF = "#contact";
export const CONTACT_FORM_LABEL = "Talk to us";

/**
 * §7 of the first brief — the demo report at reports.useporta.com/r/demo does not exist yet,
 * and creating it deploys the live report service. Until it does, this is an in-page anchor
 * rather than a dead link.
 */
export const REPORT_HREF = "#report";
export const REPORT_LABEL = "See a real report ↓";

/** The footer's Contact link has to resolve somewhere. */
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Ari")}`;

/**
 * Team and Agency now land on the contact form rather than opening a mail client. A mailto is a
 * dead end on a machine with no mail client configured, and the form reaches us either way.
 * The footer's Contact link stays a mailto, because that one IS "email us".
 */
export function talkToUs(): string {
  return CONTACT_FORM_HREF;
}
