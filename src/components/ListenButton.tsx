import { useVoiceStore } from '../stores/useVoiceStore'

interface Props {
  onStart: () => void
  onStop: () => void
}

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

  let label = 'Start Listening'
  if (isDenied) label = 'Microphone Blocked'
  else if (isListening) label = 'Listening...'
  else if (pipelineStatus === 'processing') label = 'Processing...'
  else if (pipelineStatus === 'speaking') label = 'Speaking...'

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        onClick={handleClick}
        disabled={isDisabled || isDenied}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: isListening ? '3px solid #3b82f6' : '3px solid #334155',
          background: isListening
            ? 'rgba(59,130,246,0.2)'
            : isDisabled
              ? '#1e293b'
              : '#1e293b',
          color: isDenied ? '#ef4444' : isListening ? '#3b82f6' : '#e2e8f0',
          fontSize: 28,
          cursor: isDisabled || isDenied ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          margin: '0 auto',
          opacity: isDisabled ? 0.5 : 1,
          animation: isListening ? 'pulse-scale 2s ease-in-out infinite' : 'none',
        }}
      >
        {isListening ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        )}
      </button>
      <p style={{
        fontSize: 12,
        color: isDenied ? '#ef4444' : '#64748b',
        marginTop: 12,
      }}>
        {label}
      </p>
      {isIdle && !isDenied && (
        <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
          Tap to start voice conversation
        </p>
      )}
      {isDenied && (
        <p style={{ fontSize: 11, color: '#ef4444', marginTop: 4, maxWidth: 260, margin: '4px auto 0' }}>
          Please allow microphone access in your browser settings
        </p>
      )}
    </div>
  )
}
