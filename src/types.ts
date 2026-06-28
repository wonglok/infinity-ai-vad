// ---- App lifecycle ----

export type AppPhase =
  | 'browser-check'
  | 'initializing'
  | 'downloading-models'
  | 'loading-models'
  | 'ready'
  | 'error'

// ---- Models ----

export type ModelId = 'vad' | 'stt' | 'llm' | 'tts'

export type ModelStatus =
  | 'not-downloaded'
  | 'downloading'
  | 'downloaded'
  | 'loading'
  | 'loaded'
  | 'error'

export interface ModelInfo {
  id: ModelId
  label: string
  status: ModelStatus
  progress: number // 0-100
  error: string | null
}

// ---- Audio / Mic ----

export type MicStatus =
  | 'unavailable'
  | 'requesting'
  | 'denied'
  | 'ready'
  | 'active'

// ---- Pipeline ----

export type PipelineStatus =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'speaking'

export interface ConversationTurn {
  id: string
  transcript: string
  response: string
  timestamp: number
}
