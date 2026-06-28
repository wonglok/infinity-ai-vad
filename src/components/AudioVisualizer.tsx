import { useEffect, useRef } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'
import type { PipelineStatus } from '../types'

const BAR_COUNT = 32
const WIDTH = 240
const HEIGHT = 60
const BAR_WIDTH = 4
const GAP = 3

function getBarColor(_i: number, _total: number, status: PipelineStatus): string {
  switch (status) {
    case 'listening':
      return '#3b82f6'
    case 'processing':
      return '#f59e0b'
    case 'speaking':
      return '#22c55e'
    default:
      return '#334155'
  }
}

export function AudioVisualizer() {
  const { audioLevel, pipelineStatus, isSpeechDetected } = useVoiceStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const levelRef = useRef(0)

  // Smooth audio level
  useEffect(() => {
    levelRef.current += (audioLevel - levelRef.current) * 0.3
  }, [audioLevel])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const level = levelRef.current
      const isActive = pipelineStatus === 'listening' || pipelineStatus === 'speaking'
      const barColor = getBarColor(0, BAR_COUNT, pipelineStatus)

      ctx.clearRect(0, 0, WIDTH, HEIGHT)

      const totalWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * GAP
      const startX = (WIDTH - totalWidth) / 2

      for (let i = 0; i < BAR_COUNT; i++) {
        let height: number

        if (isActive && isSpeechDetected) {
          // Animated bars based on audio level
          const phase = (Date.now() / 200 + i * 0.3) % (Math.PI * 2)
          const baseHeight = Math.sin(phase) * 0.5 + 0.5
          height = Math.max(3, baseHeight * level * HEIGHT * 0.8 + 3)
        } else if (isActive) {
          // Gentle ambient animation
          const phase = (Date.now() / 400 + i * 0.4) % (Math.PI * 2)
          height = Math.max(2, (Math.sin(phase) * 0.3 + 0.3) * HEIGHT * 0.3)
        } else {
          // Idle: flat line
          height = 2
        }

        const x = startX + i * (BAR_WIDTH + GAP)
        const y = (HEIGHT - height) / 2

        ctx.fillStyle = barColor
        ctx.beginPath()
        ctx.roundRect(x, y, BAR_WIDTH, height, 2)
        ctx.fill()
      }

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
