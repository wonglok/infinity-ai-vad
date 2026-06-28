import { create } from 'zustand'
import type { AppPhase, ModelId, ModelInfo, ModelStatus, MicStatus, PipelineStatus, ConversationTurn } from '../types'
import { MODEL_IDS, MODEL_LABELS } from '../constants'

interface VoiceState {
  // App lifecycle
  appPhase: AppPhase
  fatalError: string | null
  browserWarnings: string[]

  // Models
  models: Record<string, ModelInfo>

  // Audio / Mic
  micStatus: MicStatus
  audioLevel: number

  // Pipeline
  pipelineStatus: PipelineStatus
  isSpeechDetected: boolean

  // Current turn
  partialTranscript: string
  streamedResponse: string

  // History
  conversation: ConversationTurn[]

  // Actions
  setAppPhase: (phase: AppPhase) => void
  setFatalError: (err: string) => void
  setBrowserWarnings: (warnings: string[]) => void
  updateModel: (id: ModelId, update: Partial<ModelInfo>) => void
  setMicStatus: (status: MicStatus) => void
  setAudioLevel: (level: number) => void
  setPipelineStatus: (status: PipelineStatus) => void
  setSpeechDetected: (detected: boolean) => void
  appendTranscript: (text: string) => void
  appendResponseToken: (token: string) => void
  startNewTurn: () => void
  completeTurn: () => void
  resetConversation: () => void
  resetAll: () => void
}

function initialModelState(): Record<string, ModelInfo> {
  const models: Record<string, ModelInfo> = {}
  for (const id of Object.keys(MODEL_IDS) as ModelId[]) {
    models[id] = {
      id,
      label: MODEL_LABELS[MODEL_IDS[id]],
      status: 'not-downloaded',
      progress: 0,
      error: null,
    }
  }
  return models
}

const initialState = {
  appPhase: 'browser-check' as AppPhase,
  fatalError: null as string | null,
  browserWarnings: [] as string[],
  models: initialModelState(),
  micStatus: 'unavailable' as MicStatus,
  audioLevel: 0,
  pipelineStatus: 'idle' as PipelineStatus,
  isSpeechDetected: false,
  partialTranscript: '',
  streamedResponse: '',
  conversation: [] as ConversationTurn[],
}

export const useVoiceStore = create<VoiceState>((set) => ({
  ...initialState,

  setAppPhase: (phase) => set({ appPhase: phase }),

  setFatalError: (err) => set({ appPhase: 'error', fatalError: err }),

  setBrowserWarnings: (warnings) => set({ browserWarnings: warnings }),

  updateModel: (id, update) =>
    set((state) => ({
      models: {
        ...state.models,
        [id]: { ...state.models[id], ...update },
      },
    })),

  setMicStatus: (status) => set({ micStatus: status }),

  setAudioLevel: (level) => set({ audioLevel: level }),

  setPipelineStatus: (status) => set({ pipelineStatus: status }),

  setSpeechDetected: (detected) => set({ isSpeechDetected: detected }),

  appendTranscript: (text) => set({ partialTranscript: text }),

  appendResponseToken: (token) =>
    set((state) => ({ streamedResponse: state.streamedResponse + token })),

  startNewTurn: () =>
    set({
      partialTranscript: '',
      streamedResponse: '',
      pipelineStatus: 'listening',
    }),

  completeTurn: () =>
    set((state) => {
      const turn: ConversationTurn = {
        id: crypto.randomUUID(),
        transcript: state.partialTranscript,
        response: state.streamedResponse,
        timestamp: Date.now(),
      }
      return {
        conversation: [...state.conversation, turn],
        partialTranscript: '',
        streamedResponse: '',
        pipelineStatus: 'idle',
      }
    }),

  resetConversation: () => set({ conversation: [] }),

  resetAll: () => set({ ...initialState, models: initialModelState() }),
}))
