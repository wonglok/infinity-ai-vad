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
    color: '#FFB088',
    bg: 'rgba(255, 176, 136, 0.12)',
    label: 'Ready to chat!',
    emoji: '\u{1F4AD}',
    pulse: false,
  },
  listening: {
    color: '#FF8C42',
    bg: 'rgba(255, 140, 66, 0.15)',
    label: 'Listening...',
    emoji: '\u{1F442}',
    pulse: true,
  },
  processing: {
    color: '#FFB74D',
    bg: 'rgba(255, 183, 77, 0.15)',
    label: 'Thinking...',
    emoji: '\u{1F9E0}',
    pulse: true,
  },
  speaking: {
    color: '#7CB342',
    bg: 'rgba(124, 179, 66, 0.12)',
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
