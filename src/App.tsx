import { useInit } from './hooks/useInit'
import { useVoiceTurn } from './hooks/useVoiceTurn'
import { useVoiceStore } from './stores/useVoiceStore'
import { ErrorBoundary } from './components/ErrorBoundary'
import { InitScreen } from './components/InitScreen'
import { ErrorScreen } from './components/ErrorScreen'
import { WarningBanner } from './components/WarningBanner'
import { StatusIndicator } from './components/StatusIndicator'
import { AudioVisualizer } from './components/AudioVisualizer'
import { ListenButton } from './components/ListenButton'
import { ConversationView } from './components/ConversationView'
import { ModelPanel } from './components/ModelPanel'

function MainApp() {
  const { startListening, stopListening } = useVoiceTurn()
  const appPhase = useVoiceStore((s) => s.appPhase)

  // Init / Error screens
  if (appPhase === 'error') {
    return <ErrorScreen />
  }

  const isReady = appPhase === 'ready'
  const isInit = !isReady

  if (isInit) {
    return <InitScreen />
  }

  // Main voice assistant UI
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StatusIndicator />
      <ConversationView />
      <div style={{ padding: '8px 0 0' }}>
        <AudioVisualizer />
      </div>
      <div style={{ padding: '16px 0 24px' }}>
        <ListenButton onStart={startListening} onStop={stopListening} />
      </div>
      <ModelPanel />
    </div>
  )
}

export default function App() {
  const resetAll = useVoiceStore((s) => s.resetAll)
  useInit()

  return (
    <ErrorBoundary onRetry={resetAll}>
      <WarningBanner />
      <MainApp />
    </ErrorBoundary>
  )
}
