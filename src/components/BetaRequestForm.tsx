import { useEffect, useRef, useState } from "react";
import { PORTA_VISUAL_STYLE } from "../core/PORTA_VISUAL_STYLE";
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
  scatterSource: "",
  hoursPerDay: "",
};

const HOURS_OPTIONS = [
  "Less than 4 hours",
  "4 to 6 hours",
  "6 to 8 hours",
  "8 to 10 hours",
  "10+ hours",
];

export default function BetaRequestForm({
  title,
  description,
  onSuccess,
  panelClassName = "",
}: BetaRequestFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [requestState, setRequestState] = useState<RequestState>({
    tone: "idle",
    message: "",
  });
  const [hovered, setHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSubmitting = requestState.tone === "loading";

  useEffect(() => {
    if (!hovered || !buttonRef.current) return;

    let angle = 0;
    let id: number;

    const pulse = () => {
      angle += 0.1;
      const scale = 1 + PORTA_VISUAL_STYLE.ui.panelHoverScale * Math.sin(angle);
      buttonRef.current!.style.transform = `scale(${scale})`;
      id = requestAnimationFrame(pulse);
    };

    pulse();
    return () => {
      cancelAnimationFrame(id);
      if (buttonRef.current) {
        buttonRef.current.style.transform = "scale(1)";
      }
    };
  }, [hovered]);

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

    if (!form.scatterSource.trim()) {
      return "Please describe the biggest thing that scatters your day.";
    }

    if (!form.hoursPerDay) {
      return "Please choose how many hours per day you work on a computer.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setRequestState({ tone: "error", message: validationError });
      return;
    }

    setRequestState({
      tone: "loading",
      message: "Sending your beta request...",
    });

    const result = await submitBetaRequest(form);
    if (!result.ok) {
      setRequestState({ tone: "error", message: result.error });
      return;
    }

    setRequestState({ tone: "success", message: result.message });
    setForm(INITIAL_FORM);
    onSuccess?.();
  };

  const resolvedPanelClassName = ["scene-access-panel", panelClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className={resolvedPanelClassName}>
        <h2 className="scene-access-title">{title}</h2>
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
              placeholder="Engineer, PM, founder..."
              autoComplete="organization-title"
            />
          </label>

          <label className="scene-access-field">
            <span className="scene-access-label">Biggest source of the day getting scattered</span>
            <textarea
              className="scene-access-input scene-access-textarea"
              value={form.scatterSource}
              onChange={(e) => updateField("scatterSource", e.target.value)}
              placeholder="Meetings, chat, too many tabs, app switching..."
              rows={4}
            />
          </label>

          <label className="scene-access-field">
            <span className="scene-access-label">Hours per day on a computer</span>
            <select
              className="scene-access-input scene-access-select"
              value={form.hoursPerDay}
              onChange={(e) => updateField("hoursPerDay", e.target.value)}
            >
              <option value="">Choose one</option>
              {HOURS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="scene-access-button"
          ref={buttonRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending request..." : "Request beta access"}
        </button>
      </div>

      {requestState.message && requestState.tone !== "idle" && (
        <p className="scene-access-status" data-tone={requestState.tone}>
          {requestState.message}
        </p>
      )}
    </>
  );
}
