import BetaRequestForm from "../components/BetaRequestForm";

export default function Scene5_Access({ onAdvance }: { onAdvance?: () => void }) {
  return (
    <div className="scene scene-access-layout scene-access-scene">
      <BetaRequestForm
        title="Request Windows Beta"
        description="Tell us a bit about your work, and we will reach out when Ari is ready for you."
        panelClassName="scene-access-panel-scrollable"
        onSuccess={onAdvance}
      />
    </div>
  );
}
