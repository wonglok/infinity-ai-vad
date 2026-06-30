import { useCallback, useRef } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'
import {
  createAudioCapture,
  createAudioPlayback,
  setupVAD,
  getPipeline,
  SpeechActivity,
  ensureAudioContextRunning,
  isIOS,
} from '../lib/sdk'
import { VOICE_SYSTEM_PROMPT, MAX_TOKENS, LLM_TEMPERATURE } from '../constants'

export function useVoiceTurn() {
  const {
    pipelineStatus,
    setPipelineStatus,
    setAudioLevel,
    setSpeechDetected,
    appendTranscript,
    appendResponseToken,
    startNewTurn,
    completeTurn,
    setMicStatus,
  } = useVoiceStore()

  const micRef = useRef<ReturnType<typeof createAudioCapture> | null>(null)
  const playerRef = useRef<ReturnType<typeof createAudioPlayback> | null>(null)
  const unsubRef = useRef<(() => void) | null>(null)

  const startListening = useCallback(async () => {
    if (pipelineStatus !== 'idle') return

    try {
      startNewTurn()
      setMicStatus('requesting')

      const mic = createAudioCapture()
      micRef.current = mic
      const vad = setupVAD()

      // Set up VAD callback
      const unsub = vad.onSpeechActivity((activity) => {
        if (activity === SpeechActivity.Started) {
          setSpeechDetected(true)
        } else if (activity === SpeechActivity.Ended) {
          setSpeechDetected(false)

          const segment = vad.popSpeechSegment()
          if (!segment || segment.samples.length < 1600) return

          // Got speech — stop mic and process
          mic.stop()
          setPipelineStatus('processing')

          const pipeline = getPipeline()
          pipeline
            .processTurn(
              segment.samples,
              {
                maxTokens: MAX_TOKENS,
                temperature: LLM_TEMPERATURE,
                systemPrompt: VOICE_SYSTEM_PROMPT,
                ttsSpeed: 1.0,
              },
              {
                onTranscription: (text: string) => {
                  appendTranscript(text)
                },
                onResponseToken: (_token: string, _accumulated: string) => {
                  appendResponseToken(_token)
                },
                onResponseComplete: () => {
                  // Response done
                },
                onSynthesisComplete: async (audio: Float32Array, sampleRate: number) => {
                  setPipelineStatus('speaking')
                  const player = createAudioPlayback()
                  playerRef.current = player
                  try {
                    await player.play(audio, sampleRate)
                  } catch (err) {
                    console.error('Playback error:', err)
                  }
                  player.dispose()
                  playerRef.current = null
                },
                onError: (err) => {
                  console.error('Pipeline error:', err)
                },
              },
            )
            .then(() => {
              completeTurn()
            })
            .catch((err) => {
              console.error('Pipeline turn error:', err)
              completeTurn()
            })
        }
      })

      unsubRef.current = unsub

      // Start mic capture
      await mic.start(
        (chunk: Float32Array) => {
          vad.processSamples(chunk)
        },
        (level: number) => {
          setAudioLevel(level)
        },
      )

      // iOS Safari workaround: AudioContext starts suspended even after
      // a user gesture. Explicitly resume it so audio processing runs.
      await ensureAudioContextRunning(mic)

      if (isIOS()) {
        console.log('iOS detected — audio context state:', (mic as any).audioContext?.state)
      }

      setMicStatus('active')
    } catch (err) {
      const msg = (err as Error).message
      if (msg.includes('NotAllowed') || msg.includes('Permission')) {
        setMicStatus('denied')
        if (isIOS()) {
          console.warn(
            'Microphone denied on iOS. User must allow mic in: Settings → Safari → Microphone',
          )
        }
      } else {
        setMicStatus('unavailable')
        console.error('Mic error:', err)
      }
      setPipelineStatus('idle')
    }
  }, [
    pipelineStatus,
    startNewTurn,
    setMicStatus,
    setSpeechDetected,
    setPipelineStatus,
    setAudioLevel,
    appendTranscript,
    appendResponseToken,
    completeTurn,
  ])

  const stopListening = useCallback(() => {
    unsubRef.current?.()
    micRef.current?.stop()
    if (playerRef.current) {
      playerRef.current.dispose()
      playerRef.current = null
    }
    setPipelineStatus('idle')
    setMicStatus('ready')
    setAudioLevel(0)
  }, [setPipelineStatus, setMicStatus, setAudioLevel])

  return { startListening, stopListening }
}
