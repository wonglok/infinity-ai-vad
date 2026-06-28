import { useEffect, useCallback } from 'react'
import { useVoiceStore } from '../stores/useVoiceStore'
import { initSDK, downloadModel, loadModel, isModelInOPFS, checkBrowserSupport } from '../lib/sdk'
import { MODEL_IDS } from '../constants'
import type { ModelId } from '../types'

const ALL_MODELS: ModelId[] = ['vad', 'stt', 'llm', 'tts']

export function useInit() {
  const { appPhase, setAppPhase, setFatalError, setBrowserWarnings, updateModel } = useVoiceStore()

  const runInit = useCallback(async () => {
    try {
      // Phase 1: Browser check
      setAppPhase('browser-check')
      const { supported, warnings } = checkBrowserSupport()
      if (!supported) {
        setFatalError('Browser not supported. Please use Chrome 96+ or Edge 96+.')
        return
      }
      if (warnings.length > 0) {
        setBrowserWarnings(warnings)
      }

      // Phase 2: Init SDK + register models + wait for OPFS scan
      setAppPhase('initializing')
      await initSDK()

      // Phase 3: Download models (only if not already cached in OPFS)
      setAppPhase('downloading-models')

      const downloadResults = await Promise.allSettled(
        ALL_MODELS.map(async (modelId) => {
          const sdkId = MODEL_IDS[modelId]
          try {
            // Check OPFS first — skip download if already cached
            const cached = await isModelInOPFS(sdkId)
            if (cached) {
              updateModel(modelId, { status: 'downloaded', progress: 100 })
              return { modelId, cached: true }
            }

            updateModel(modelId, { status: 'downloading', progress: 0 })

            let lastProgress = 0
            let lastTime = Date.now()

            await downloadModel(sdkId, (progress) => {
              const pct = Math.round(progress * 100)
              updateModel(modelId, { progress: pct })

              if (progress > lastProgress) {
                lastProgress = progress
                lastTime = Date.now()
              } else if (Date.now() - lastTime > 30000) {
                console.warn(`Download stalled for ${modelId}, still waiting...`)
              }
            })

            updateModel(modelId, { status: 'downloaded', progress: 100 })
            return { modelId, cached: false }
          } catch (err) {
            updateModel(modelId, {
              status: 'error',
              error: (err as Error).message,
            })
            throw err
          }
        }),
      )

      // Check if any downloads failed
      const failedModels = downloadResults
        .filter((r) => r.status === 'rejected')
        .map((_, i) => ALL_MODELS[i])

      if (failedModels.length > 0) {
        setFatalError(
          `Failed to download: ${failedModels.join(', ')}. Check your network and try again.`,
        )
        return
      }

      // Show how many were cached vs downloaded
      const cachedCount = downloadResults.filter(
        (r) => r.status === 'fulfilled' && (r.value as any)?.cached,
      ).length
      if (cachedCount > 0) {
        console.log(`Using ${cachedCount}/${ALL_MODELS.length} models from OPFS cache`)
      }

      // Phase 4: Load models (sequential, coexist)
      setAppPhase('loading-models')
      for (const modelId of ALL_MODELS) {
        const sdkId = MODEL_IDS[modelId]
        updateModel(modelId, { status: 'loading' })

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            await loadModel(sdkId)
            updateModel(modelId, { status: 'loaded', progress: 100 })
            break
          } catch (err) {
            if (attempt === 3) {
              updateModel(modelId, {
                status: 'error',
                error: (err as Error).message,
              })
              setFatalError(`Failed to load model: ${modelId}. ${(err as Error).message}`)
              return
            }
            await new Promise((r) => setTimeout(r, 2000 * attempt))
          }
        }
      }

      // Phase 5: Ready
      setAppPhase('ready')
    } catch (err) {
      setFatalError((err as Error).message || 'Initialization failed')
    }
  }, [setAppPhase, setFatalError, setBrowserWarnings, updateModel])

  useEffect(() => {
    runInit()
  }, [runInit])

  return { appPhase, retry: runInit }
}
