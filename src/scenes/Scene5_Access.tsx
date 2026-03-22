import BetaRequestForm from "../components/BetaRequestForm";

export default function Scene5_Access({ onAdvance }: { onAdvance?: () => void }) {
  return (
    <div className="scene scene-access-layout scene-access-scene">
      <BetaRequestForm
        title="Request access to the Windows beta"
        description="Ari is currently available as a Windows beta. Leave your email and we will reach out when new access spots open."
        panelClassName="scene-access-panel-scrollable"
        onSuccess={onAdvance}
      />
    </div>
  );
}
