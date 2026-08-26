import { useState } from "react";
import { submitBetaRequest, type BetaRequestPayload } from "../lib/betaRequestApi";

type RequestState =
  | { tone: "idle"; message: string }
  | { tone: "loading"; message: string }
  | { tone: "success"; message: string }
  | { tone: "error"; message: string };

type BetaRequestFormProps = {
  title: string;
  description: string;
  onSuccess?: () => void;
  panelClassName?: string;
};

const INITIAL_FORM: BetaRequestPayload = {
  workEmail: "",
  role: "",
  clientUpdateMethod: "",
};

export default function BetaRequestForm({
  title,
  description,
  onSuccess,
  panelClassName = "",
}: BetaRequestFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [requestState, setRequestState] = useState<RequestState>({
    tone: "idle",
    message: "",
  });
  const isSubmitting = requestState.tone === "loading";

  const updateField = (field: keyof BetaRequestPayload, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (requestState.tone !== "idle") {
      setRequestState({ tone: "idle", message: "" });
    }
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(form.workEmail)) {
      return "Please enter a valid work email.";
    }

    if (!form.role.trim()) {
      return "Please tell us your role.";
    }

    // clientUpdateMethod is deliberately optional — it is the question we most
    // want answered, but not one worth blocking a download over.
    return null;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setRequestState({ tone: "error", message: validationError });
      return;
    }

    setRequestState({ tone: "loading", message: "Sending your request..." });

    const result = await submitBetaRequest(form);
    if (!result.ok) {
      setRequestState({ tone: "error", message: result.error });
      return;
    }

    setRequestState({ tone: "success", message: result.message });
    setSubmittedEmail(form.workEmail);
    setForm(INITIAL_FORM);
    onSuccess?.();
  };

  const resolvedPanelClassName = ["scene-access-panel", panelClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <form className={resolvedPanelClassName} onSubmit={handleSubmit} noValidate>
      <h3 className="scene-access-title">{title}</h3>
      <p className="scene-access-copy">{description}</p>

      <div className="scene-access-form">
        <label className="scene-access-field">
          <span className="scene-access-label">Work email</span>
          <input
            className="scene-access-input"
            type="email"
            value={form.workEmail}
            onChange={(e) => updateField("workEmail", e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
          />
        </label>

        <label className="scene-access-field">
          <span className="scene-access-label">Role</span>
          <input
            className="scene-access-input"
            type="text"
            value={form.role}
            onChange={(e) => updateField("role", e.target.value)}
            placeholder="Developer, designer, consultant..."
            autoComplete="organization-title"
          />
        </label>

        <label className="scene-access-field">
          <span className="scene-access-label">
            How do you tell clients where things stand today?
          </span>
          <input
            className="scene-access-input"
            type="text"
            value={form.clientUpdateMethod}
            onChange={(e) => updateField("clientUpdateMethod", e.target.value)}
            placeholder="A Friday email, a spreadsheet, they just ask..."
          />
        </label>
      </div>

      <button className="scene-access-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send me the link"}
      </button>

      {requestState.message && requestState.tone !== "idle" && (
        <div className="scene-access-feedback" data-tone={requestState.tone} role="status">
          <p className="scene-access-status" data-tone={requestState.tone}>
            {requestState.message}
          </p>
          {requestState.tone === "success" && submittedEmail ? (
            <p className="scene-access-followup">
              We&apos;ll reply to <strong>{submittedEmail}</strong>.
            </p>
          ) : null}
        </div>
      )}
    </form>
  );
}
