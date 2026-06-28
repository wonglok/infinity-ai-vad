import { useVoiceStore } from '../stores/useVoiceStore'
import type { PipelineStatus } from '../types'

const STATUS_CONFIG: Record<PipelineStatus, { color: string; label: string; pulse: boolean }> = {
  idle: { color: '#475569', label: 'Ready', pulse: false },
  listening: { color: '#3b82f6', label: 'Listening', pulse: true },
  processing: { color: '#f59e0b', label: 'Processing', pulse: true },
  speaking: { color: '#22c55e', label: 'Speaking', pulse: true },
}

export function StatusIndicator() {
  const { pipelineStatus } = useVoiceStore()
  const config = STATUS_CONFIG[pipelineStatus]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 16px',
    }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: config.color,
          animation: config.pulse ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}
      />
      <span style={{ fontSize: 12, color: '#94a3b8' }}>{config.label}</span>
    </div>
  )
}
