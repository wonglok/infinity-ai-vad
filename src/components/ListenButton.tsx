import { useVoiceStore } from '../stores/useVoiceStore'

interface Props {
  onStart: () => void
  onStop: () => void
}

const MIC_SVG = (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
)

const STOP_SVG = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="2" />
    <rect x="14" y="4" width="4" height="16" rx="2" />
  </svg>
)

export function ListenButton({ onStart, onStop }: Props) {
  const { pipelineStatus, micStatus } = useVoiceStore()

  const isIdle = pipelineStatus === 'idle'
  const isListening = pipelineStatus === 'listening'
  const isDisabled = pipelineStatus === 'processing' || pipelineStatus === 'speaking'
  const isDenied = micStatus === 'denied'

  const handleClick = () => {
    if (isDisabled) return
    if (isListening) {
      onStop()
    } else {
      onStart()
    }
  }

  let label = 'Tap me!'
  let sublabel = 'I\'m ready to listen \u{1F442}'
  if (isDenied) {
    label = 'Mic blocked \u{1F622}'
    sublabel = 'Please allow in browser settings'
  } else if (isListening) {
    label = 'Listening...'
    sublabel = 'Talk to me!'
  } else if (pipelineStatus === 'processing') {
    label = 'Thinking...'
    sublabel = 'Gimme a sec \u{1F9E0}'
  } else if (pipelineStatus === 'speaking') {
    label = 'Speaking...'
    sublabel = 'Hope it sounds good!'
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Shadow + button */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Shadow blob */}
        <div style={{
          position: 'absolute',
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 72,
          height: 18,
          borderRadius: '50%',
          background: '#FFD4B8',
          opacity: isListening ? 0.6 : 0.3,
          transition: 'all 0.3s',
        }} />

        <button
          onClick={handleClick}
          disabled={isDisabled || isDenied}
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            border: '3px solid',
            borderColor: isListening
              ? '#FF8C42'
              : isDisabled
                ? '#FFD4B8'
                : '#FFB088',
            background: isListening
              ? 'linear-gradient(135deg, #FFF0E5, #FFE0CC)'
              : isDisabled
                ? '#FFF5EE'
                : 'linear-gradient(135deg, #FFFFFF, #FFF5EE)',
            boxShadow: isListening
              ? '0 6px 28px rgba(255, 140, 66, 0.35), inset 0 1px 0 rgba(255,255,255,0.6)'
              : isDisabled
                ? '0 3px 12px rgba(255, 180, 136, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
                : '0 4px 20px rgba(255, 180, 136, 0.25), inset 0 1px 0 rgba(255,255,255,0.6)',
            color: isDenied
              ? '#FF8FAB'
              : isListening
                ? '#FF8C42'
                : isDisabled
                  ? '#FFD4B8'
                  : '#FFB088',
            cursor: isDisabled || isDenied ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            margin: '0 auto',
            position: 'relative',
            animation: isListening
              ? 'pulse-cute 2s ease-in-out infinite'
              : isIdle
                ? 'float 3s ease-in-out infinite'
                : 'none',
          }}
        >
          {isListening ? STOP_SVG : MIC_SVG}
        </button>
      </div>

      <p style={{
        fontSize: 15,
        fontWeight: 600,
        color: isDenied ? '#FF8FAB' : '#8B6B52',
        marginTop: 16,
        animation: isListening ? 'pulse-soft 0.8s ease-in-out infinite' : 'none',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: 12,
        fontWeight: 500,
        color: '#D4B896',
        marginTop: 4,
        maxWidth: 220,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        {sublabel}
      </p>
    </div>
  )
}
