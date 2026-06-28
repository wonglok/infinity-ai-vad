import { useVoiceStore } from '../stores/useVoiceStore'
import { MODEL_IDS, MODEL_LABELS } from '../constants'
import type { ModelId } from '../types'

const MODEL_ORDER: ModelId[] = ['vad', 'stt', 'llm', 'tts']

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'not-downloaded':
      return <span style={{ color: '#64748b' }}>&#9711;</span>
    case 'downloading':
      return <span style={{ color: '#3b82f6' }}>&#8635;</span>
    case 'downloaded':
      return <span style={{ color: '#22c55e' }}>&#10003;</span>
    case 'loading':
      return <span style={{ color: '#f59e0b' }}>&#8635;</span>
    case 'loaded':
      return <span style={{ color: '#22c55e' }}>&#9679;</span>
    case 'error':
      return <span style={{ color: '#ef4444' }}>&#10007;</span>
    default:
      return <span style={{ color: '#64748b' }}>&#9711;</span>
  }
}

export function InitScreen() {
  const { appPhase, models } = useVoiceStore()

  const phases = [
    { key: 'browser-check', label: 'Checking browser support' },
    { key: 'initializing', label: 'Initializing AI engine' },
    { key: 'downloading-models', label: 'Downloading models' },
    { key: 'loading-models', label: 'Loading models into memory' },
  ]

  const phaseIndex = phases.findIndex((p) => p.key === appPhase)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 32,
      gap: 32,
    }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Infinity AI</h1>
        <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 4 }}>Voice Assistant</p>
      </div>

      {/* Phase steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 360 }}>
        {phases.map((phase, i) => {
          const isDone = i < phaseIndex
          const isActive = i === phaseIndex
          const isPending = i > phaseIndex

          return (
            <div
              key={phase.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                opacity: isPending ? 0.4 : 1,
                transition: 'all 0.3s',
              }}
            >
              <span style={{ width: 20, textAlign: 'center', fontSize: 14 }}>
                {isDone ? <span style={{ color: '#22c55e' }}>&#10003;</span> : isActive ? <span style={{ color: '#3b82f6' }}>&#9679;</span> : <span style={{ color: '#475569' }}>&#9711;</span>}
              </span>
              <span style={{ fontSize: 14, color: isActive ? '#e2e8f0' : '#94a3b8' }}>
                {phase.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Model download progress */}
      {appPhase === 'downloading-models' && (
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MODEL_ORDER.map((id) => {
            const model = models[id]
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusIcon status={model.status} />
                <span style={{ fontSize: 12, color: '#94a3b8', width: 130 }}>
                  {MODEL_LABELS[MODEL_IDS[id]]}
                </span>
                {model.status === 'downloading' && (
                  <>
                    <div style={{
                      flex: 1,
                      height: 4,
                      background: '#1e293b',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${model.progress}%`,
                        background: '#3b82f6',
                        borderRadius: 2,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b', width: 36, textAlign: 'right' }}>
                      {model.progress}%
                    </span>
                  </>
                )}
                {model.status === 'error' && (
                  <span style={{ fontSize: 11, color: '#ef4444' }}>Failed</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {appPhase === 'loading-models' && (
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MODEL_ORDER.map((id) => {
            const model = models[id]
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusIcon status={model.status} />
                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                  {MODEL_LABELS[MODEL_IDS[id]]}
                </span>
                {model.status === 'loading' && (
                  <span style={{ fontSize: 11, color: '#f59e0b', marginLeft: 'auto' }}>Loading...</span>
                )}
                {model.status === 'loaded' && (
                  <span style={{ fontSize: 11, color: '#22c55e', marginLeft: 'auto' }}>Ready</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
