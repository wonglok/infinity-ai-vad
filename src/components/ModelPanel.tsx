import { useState } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'
import { MODEL_IDS, MODEL_LABELS } from '../constants'
import type { ModelId } from '../types'

const MODEL_ORDER: ModelId[] = ['vad', 'stt', 'llm', 'tts']

export function ModelPanel() {
  const { models } = useVoiceStore()
  const [open, setOpen] = useState(false)

  const allLoaded = MODEL_ORDER.every((id) => models[id]?.status === 'loaded')
  const hasErrors = MODEL_ORDER.some((id) => models[id]?.status === 'error')
  const downloading = MODEL_ORDER.some(
    (id) => models[id]?.status === 'downloading' || models[id]?.status === 'loading',
  )

  let summary = 'All set!'
  if (downloading) summary = 'Loading brains...'
  else if (hasErrors) summary = 'Some oopsies'
  else if (!allLoaded) summary = 'Not ready'

  return (
    <div style={{
      borderTop: '2px solid #FFE8D6',
      padding: '8px 16px',
      background: '#FFFBF7',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          color: '#8B5E3C',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px 8px',
          borderRadius: 12,
          transition: 'background 0.2s',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{allLoaded ? '\u{1F31F}' : downloading ? '\u{1F36A}' : hasErrors ? '\u{1F4A2}' : '\u{1F4E6}'}</span>
          Models &middot; {summary}
        </span>
        <span style={{
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          fontSize: 10,
          color: '#8B5E3C',
        }}>
          &#9660;
        </span>
      </button>

      {open && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: 6,
          padding: '0 4px 4px',
        }}>
          {MODEL_ORDER.map((id, i) => {
            const model = models[id]
            if (!model) return null
            const isLoaded = model.status === 'loaded'
            const isError = model.status === 'error'
            const isLoading = model.status === 'downloading' || model.status === 'loading'

            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 14,
                  background: isLoaded
                    ? 'rgba(92, 138, 47, 0.07)'
                    : isError
                      ? 'rgba(224, 85, 112, 0.07)'
                      : isLoading
                        ? 'rgba(199, 120, 0, 0.07)'
                        : '#FFFBF7',
                  animation: `slide-up 0.3s ease-out ${i * 0.04}s both`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 14, lineHeight: 1 }}>
                    {isLoaded ? '\u{2B50}' : isError ? '\u{1F4A2}' : isLoading ? '\u{1F36A}' : '\u{1F4E6}'}
                  </span>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isLoaded ? '#5C8A2F' : isError ? '#E05570' : isLoading ? '#C77800' : '#8B6B52',
                  }}>
                    {MODEL_LABELS[MODEL_IDS[id]]}
                  </span>
                </div>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 10,
                  background: isLoaded
                    ? 'rgba(92, 138, 47, 0.12)'
                    : isError
                      ? 'rgba(224, 85, 112, 0.12)'
                      : isLoading
                        ? 'rgba(199, 120, 0, 0.12)'
                        : '#FFE8D6',
                  color: isLoaded
                    ? '#5C8A2F'
                    : isError
                      ? '#E05570'
                      : isLoading
                        ? '#C77800'
                        : '#8B5E3C',
                }}>
                  {model.status === 'downloading' ? `${model.progress}%` : model.status}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
