import { useEffect, useRef } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'
import type { PipelineStatus } from '../types'

const WIDTH = 240
const HEIGHT = 56
const DOT_COUNT = 16
const DOT_RADIUS = 5

function getDotColor(status: PipelineStatus): string {
  switch (status) {
    case 'listening':
      return '#FF8C42'
    case 'processing':
      return '#FFB74D'
    case 'speaking':
      return '#7CB342'
    default:
      return '#FFD4B8'
  }
}

export function AudioVisualizer() {
  const { audioLevel, pipelineStatus, isSpeechDetected } = useVoiceStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const levelRef = useRef(0)

  useEffect(() => {
    levelRef.current += (audioLevel - levelRef.current) * 0.25
  }, [audioLevel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const level = levelRef.current
      const isActive = pipelineStatus === 'listening' || pipelineStatus === 'speaking'
      const color = getDotColor(pipelineStatus)

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const spacing = WIDTH / (DOT_COUNT + 1)
      const centerY = HEIGHT / 2

      for (let i = 0; i < DOT_COUNT; i++) {
        const x = spacing * (i + 1)
        let radius: number
        let alpha: number

        if (isActive && isSpeechDetected) {
          const phase = (Date.now() / 150 + i * 0.35) % (Math.PI * 2)
          const wave = Math.sin(phase) * 0.5 + 0.5
          radius = Math.max(2, DOT_RADIUS * 0.3 + wave * level * DOT_RADIUS * 2)
          alpha = 0.5 + wave * 0.5
        } else if (isActive) {
          const phase = (Date.now() / 350 + i * 0.3) % (Math.PI * 2)
          radius = Math.max(2, DOT_RADIUS * 0.35 + (Math.sin(phase) * 0.2 + 0.2) * DOT_RADIUS)
          alpha = 0.35 + Math.sin(phase) * 0.15
        } else {
          radius = 2
          alpha = 0.25
        }

        ctx.fillStyle = color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(x, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [pipelineStatus, isSpeechDetected])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      style={{ display: 'block', margin: '0 auto' }}
    />
  )
}
