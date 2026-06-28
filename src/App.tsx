import { useInit } from "./hooks/useInit";
import { useVoiceTurn } from "./hooks/useVoiceTurn";
import { useVoiceStore } from "./stores/useVoiceStore";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { InitScreen } from "./components/InitScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { WarningBanner } from "./components/WarningBanner";
import { StatusIndicator } from "./components/StatusIndicator";
import { AudioVisualizer } from "./components/AudioVisualizer";
import { ListenButton } from "./components/ListenButton";
import { ConversationView } from "./components/ConversationView";
// import { ModelPanel } from "./components/ModelPanel";

function MainApp() {
  const { startListening, stopListening } = useVoiceTurn();
  const appPhase = useVoiceStore((s) => s.appPhase);

  if (appPhase === "error") {
    return <ErrorScreen />;
  }

  const isReady = appPhase === "ready";
  const isInit = !isReady;

  if (isInit) {
    return (
      <div style={{ position: "relative", height: "100%" }}>
        <div className="bg-blobs">
          <div className="bg-blob bg-blob-1" />
          <div className="bg-blob bg-blob-2" />
          <div className="bg-blob bg-blob-3" />
        </div>
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          <InitScreen />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        background: "#FFF8F0",
      }}
    >
      <div className="bg-blobs">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <StatusIndicator />
        <ConversationView />
        <div style={{ padding: "4px 0 0" }}>
          <AudioVisualizer />
        </div>
        <div style={{ padding: "12px 0 20px" }}>
          <ListenButton onStart={startListening} onStop={stopListening} />
        </div>
        {/* <ModelPanel /> */}
      </div>
    </div>
  );
}

export default function App() {
  const resetAll = useVoiceStore((s) => s.resetAll);
  useInit();

  return (
    <ErrorBoundary onRetry={resetAll}>
      <WarningBanner />
      <MainApp />
    </ErrorBoundary>
  );
}
