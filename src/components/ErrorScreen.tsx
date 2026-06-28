import { useVoiceStore } from '../stores/useVoiceStore'

export function ErrorScreen() {
  const { fatalError, resetAll } = useVoiceStore()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 32,
      textAlign: 'center',
      gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>&#9888;</div>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Something went wrong</h2>
      <p style={{ color: '#94a3b8', maxWidth: 400, fontSize: 14, lineHeight: 1.6 }}>
        {fatalError}
      </p>
      <button
        onClick={resetAll}
        style={{
          padding: '10px 24px',
          borderRadius: 8,
          border: 'none',
          background: '#3b82f6',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  )
}
