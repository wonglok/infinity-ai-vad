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
  const downloading = MODEL_ORDER.some((id) => models[id]?.status === 'downloading' || models[id]?.status === 'loading')

  return (
    <div style={{
      borderTop: '1px solid #1e293b',
      padding: '8px 16px',
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
          color: '#94a3b8',
          fontSize: 12,
          cursor: 'pointer',
          padding: '4px 0',
        }}
      >
        <span>
          Models: {allLoaded ? 'All ready' : downloading ? 'Loading...' : hasErrors ? 'Errors detected' : 'Not loaded'}
        </span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          &#9660;
        </span>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          {MODEL_ORDER.map((id) => {
            const model = models[id]
            if (!model) return null
            return (
              <div
                key={id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: '#0f172a',
                }}
              >
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {MODEL_LABELS[MODEL_IDS[id]]}
                </span>
                <span style={{
                  fontSize: 10,
                  color:
                    model.status === 'loaded' ? '#22c55e' :
                    model.status === 'error' ? '#ef4444' :
                    model.status === 'downloading' || model.status === 'loading' ? '#f59e0b' :
                    '#475569',
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
