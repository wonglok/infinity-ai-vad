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
      gap: 14,
      background: '#FFF8F0',
    }}>
      <div style={{ fontSize: 64, animation: 'float 3s ease-in-out infinite', lineHeight: 1 }}>
        &#x1F622;
      </div>
      <h2 style={{
        fontSize: 22,
        fontWeight: 700,
        color: '#FF8C42',
      }}>
        Oh no! Something went wrong...
      </h2>
      <p style={{
        color: '#8B5E3C',
        maxWidth: 360,
        fontSize: 13,
        lineHeight: 1.6,
        fontWeight: 500,
      }}>
        {fatalError}
      </p>
      <button
        onClick={resetAll}
        style={{
          padding: '12px 32px',
          borderRadius: 20,
          border: 'none',
          background: 'linear-gradient(135deg, #FFB088, #FF8C42)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255, 140, 66, 0.3)',
          transition: 'all 0.3s',
          marginTop: 8,
        }}
      >
        Try Again &#x1F64F;
      </button>
    </div>
  )
}
