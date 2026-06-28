import { useVoiceStore } from '../stores/useVoiceStore'
import { MODEL_IDS, MODEL_LABELS } from '../constants'
import type { ModelId } from '../types'

const MODEL_ORDER: ModelId[] = ['vad', 'stt', 'llm', 'tts']

const EMOJI_MAP: Record<string, string> = {
  [MODEL_IDS.vad]: '\u{1F442}',
  [MODEL_IDS.stt]: '\u{1F4DD}',
  [MODEL_IDS.llm]: '\u{1F9E0}',
  [MODEL_IDS.tts]: '\u{1F4E3}',
}

function StatusEmoji({ status }: { status: string }) {
  const base: React.CSSProperties = { fontSize: 18, lineHeight: 1 }
  switch (status) {
    case 'not-downloaded':
      return <span style={{ ...base, opacity: 0.3 }}>&#x1F7E3;</span>
    case 'downloading':
      return <span style={{ ...base, animation: 'spin-bounce 1.2s ease-in-out infinite' }}>&#x1F36A;</span>
    case 'downloaded':
      return <span style={base}>&#x2705;</span>
    case 'loading':
      return <span style={{ ...base, animation: 'wiggle 0.6s ease-in-out infinite' }}>&#x1F434;</span>
    case 'loaded':
      return <span style={base}>&#x2B50;</span>
    case 'error':
      return <span style={base}>&#x1F4A2;</span>
    default:
      return <span style={{ ...base, opacity: 0.3 }}>&#x1F7E3;</span>
  }
}

export function InitScreen() {
  const { appPhase, models } = useVoiceStore()

  const phases = [
    { key: 'browser-check', label: 'Checking your browser', emoji: '\u{1F50D}' },
    { key: 'initializing', label: 'Waking up the AI engine', emoji: '\u{1F4A4}' },
    { key: 'downloading-models', label: 'Packing some brain snacks', emoji: '\u{1F36A}' },
    { key: 'loading-models', label: 'Putting on its thinking cap', emoji: '\u{1F9E0}' },
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
      gap: 28,
    }}>
      {/* Mascot */}
      <div style={{
        fontSize: 64,
        animation: 'float 3s ease-in-out infinite',
        lineHeight: 1,
      }}>
        &#x1F9B8;
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 700,
          color: '#FF7A3D',
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          Infinity AI
        </h1>
        <p style={{
          color: '#C4956A',
          fontSize: 15,
          marginTop: 2,
          fontWeight: 500,
        }}>
          your cute voice buddy
        </p>
      </div>

      {/* Phase steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '100%',
        maxWidth: 340,
      }}>
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
                padding: '12px 16px',
                borderRadius: 20,
                background: isActive
                  ? 'rgba(255, 140, 66, 0.12)'
                  : isDone
                    ? 'rgba(255, 180, 120, 0.06)'
                    : 'transparent',
                border: isActive
                  ? '2px solid rgba(255, 140, 66, 0.3)'
                  : isDone
                    ? '2px solid rgba(255, 180, 120, 0.15)'
                    : '2px solid rgba(255, 180, 120, 0.08)',
                opacity: isPending ? 0.35 : 1,
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                animation: isActive ? 'bounce-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>
                {isDone ? <span>&#x2705;</span> : isActive ? <span style={{ animation: 'spin-bounce 1.5s ease-in-out infinite', display: 'inline-block' }}>{phase.emoji}</span> : <span style={{ opacity: 0.3 }}>{phase.emoji}</span>}
              </span>
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? '#FF7A3D' : isDone ? '#C4956A' : '#D4B896',
              }}>
                {phase.label}
              </span>
              {isActive && (
                <span style={{
                  marginLeft: 'auto',
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#FF8C42',
                  animation: 'pulse-cute 0.8s ease-in-out infinite',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Model download progress */}
      {(appPhase === 'downloading-models' || appPhase === 'loading-models') && (
        <div style={{
          width: '100%',
          maxWidth: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {MODEL_ORDER.map((id) => {
            const model = models[id]
            return (
              <div key={id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 12px',
                borderRadius: 16,
                background: 'rgba(255, 212, 184, 0.2)',
                animation: model.status === 'downloading' || model.status === 'loading'
                  ? 'slide-up 0.3s ease-out'
                  : 'none',
              }}>
                <StatusEmoji status={model.status} />
                <span style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#8B6B52',
                  flex: 1,
                }}>
                  {MODEL_LABELS[MODEL_IDS[id]]}
                </span>
                {model.status === 'downloading' && (
                  <>
                    <div style={{
                      width: 80,
                      height: 8,
                      background: '#FFE8D6',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${model.progress}%`,
                        background: 'linear-gradient(90deg, #FFB088, #FF8C42)',
                        borderRadius: 10,
                        transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }} />
                    </div>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#FF8C42',
                      width: 36,
                      textAlign: 'right',
                    }}>
                      {model.progress}%
                    </span>
                  </>
                )}
                {(model.status === 'loading') && (
                  <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: '#FFB088',
                  }}>
                    warming up...
                  </span>
                )}
                {(model.status === 'loaded') && (
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#7CB342' }}>
                    ready!
                  </span>
                )}
                {model.status === 'error' && (
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#FF8FAB' }}>
                    oops!
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p style={{
        fontSize: 12,
        color: '#D4B896',
        textAlign: 'center',
        maxWidth: 280,
        lineHeight: 1.5,
      }}>
        {appPhase === 'downloading-models'
          ? 'Grabbing some brain snacks from the internet — this might take a minute!'
          : appPhase === 'loading-models'
            ? 'Almost ready to chat! Putting everything together...'
            : 'First-time setup — models will be saved for next time!'}
      </p>
    </div>
  )
}
