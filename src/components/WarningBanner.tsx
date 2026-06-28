import { useState } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'

export function WarningBanner() {
  const { browserWarnings } = useVoiceStore()
  const [dismissed, setDismissed] = useState(false)

  if (browserWarnings.length === 0 || dismissed) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF5E8, #FFEDDC)',
      border: '2px solid #FFD4B8',
      borderRadius: 18,
      padding: '12px 16px',
      margin: 8,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      boxShadow: '0 3px 12px rgba(255, 180, 136, 0.15)',
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>&#x1F446;</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#FF8C42',
          marginBottom: 4,
        }}>
          Just a heads up!
        </p>
        {browserWarnings.map((w, i) => (
          <p key={i} style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#8B5E3C',
            lineHeight: 1.5,
            marginBottom: 2,
          }}>
            {w}
          </p>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#CC7030',
          fontSize: 18,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          fontWeight: 700,
        }}
      >
        &times;
      </button>
    </div>
  )
}
