import { useState } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'

export function WarningBanner() {
  const { browserWarnings } = useVoiceStore()
  const [dismissed, setDismissed] = useState(false)

  if (browserWarnings.length === 0 || dismissed) return null

  return (
    <div style={{
      background: 'rgba(245,158,11,0.15)',
      border: '1px solid rgba(245,158,11,0.3)',
      borderRadius: 8,
      padding: '12px 16px',
      margin: 8,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>&#9888;</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24', marginBottom: 4 }}>
          Compatibility Notes
        </p>
        {browserWarnings.map((w, i) => (
          <p key={i} style={{ fontSize: 12, color: '#fcd34d', lineHeight: 1.5, marginBottom: 2 }}>
            {w}
          </p>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fbbf24',
          fontSize: 16,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  )
}
