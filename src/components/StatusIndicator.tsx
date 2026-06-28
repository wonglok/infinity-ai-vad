import { useVoiceStore } from '../stores/useVoiceStore'
import type { PipelineStatus } from '../types'

const STATUS_CONFIG: Record<PipelineStatus, {
  color: string
  bg: string
  label: string
  emoji: string
  pulse: boolean
}> = {
  idle: {
    color: '#CC7030',
    bg: 'rgba(204, 112, 48, 0.12)',
    label: 'Ready to chat!',
    emoji: '\u{1F4AD}',
    pulse: false,
  },
  listening: {
    color: '#E07030',
    bg: 'rgba(224, 112, 48, 0.15)',
    label: 'Listening...',
    emoji: '\u{1F442}',
    pulse: true,
  },
  processing: {
    color: '#C77800',
    bg: 'rgba(199, 120, 0, 0.15)',
    label: 'Thinking...',
    emoji: '\u{1F9E0}',
    pulse: true,
  },
  speaking: {
    color: '#5C8A2F',
    bg: 'rgba(92, 138, 47, 0.12)',
    label: 'Speaking...',
    emoji: '\u{1F4E3}',
    pulse: true,
  },
}

export function StatusIndicator() {
  const { pipelineStatus } = useVoiceStore()
  const config = STATUS_CONFIG[pipelineStatus]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px 16px 4px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 20,
        background: config.bg,
        border: `2px solid ${config.color}20`,
      }}>
        <span style={{
          fontSize: 16,
          lineHeight: 1,
          animation: config.pulse ? 'pulse-cute 1.5s ease-in-out infinite' : 'none',
        }}>
          {config.emoji}
        </span>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: config.color,
        }}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
