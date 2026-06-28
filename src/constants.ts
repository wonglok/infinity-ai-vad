import { ModelCategory, LLMFramework } from '@runanywhere/web'
import type { CompactModelDef } from '@runanywhere/web'

export const MODEL_IDS = {
  vad: 'silero-vad-v5',
  stt: 'sherpa-onnx-whisper-tiny.en',
  llm: 'lfm2-350m-q4_k_m',
  tts: 'vits-piper-en_US-lessac-medium',
} as const

export const MODEL_DEFS: CompactModelDef[] = [
  {
    id: MODEL_IDS.vad,
    name: 'Silero VAD v5',
    url: 'https://huggingface.co/runanywhere/silero-vad-v5/resolve/main/silero_vad.onnx',
    files: ['silero_vad.onnx'],
    framework: LLMFramework.ONNX,
    modality: ModelCategory.Audio,
    memoryRequirement: 5_000_000,
  },
  {
    id: MODEL_IDS.stt,
    name: 'Whisper Tiny English (ONNX)',
    url: 'https://huggingface.co/runanywhere/sherpa-onnx-whisper-tiny.en/resolve/main/sherpa-onnx-whisper-tiny.en.tar.gz',
    framework: LLMFramework.ONNX,
    modality: ModelCategory.SpeechRecognition,
    memoryRequirement: 105_000_000,
    artifactType: 'archive' as const,
  },
  {
    id: MODEL_IDS.llm,
    name: 'LFM2 350M Q4_K_M',
    repo: 'LiquidAI/LFM2-350M-GGUF',
    files: ['LFM2-350M-Q4_K_M.gguf'],
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Language,
    memoryRequirement: 250_000_000,
  },
  {
    id: MODEL_IDS.tts,
    name: 'Piper TTS US English (Lessac)',
    url: 'https://huggingface.co/runanywhere/vits-piper-en_US-lessac-medium/resolve/main/vits-piper-en_US-lessac-medium.tar.gz',
    framework: LLMFramework.ONNX,
    modality: ModelCategory.SpeechSynthesis,
    memoryRequirement: 65_000_000,
    artifactType: 'archive' as const,
  },
]

export const MODEL_LABELS: Record<string, string> = {
  [MODEL_IDS.vad]: 'VAD (Silero)',
  [MODEL_IDS.stt]: 'STT (Whisper Tiny EN)',
  [MODEL_IDS.llm]: 'LLM (LFM2 350M)',
  [MODEL_IDS.tts]: 'TTS (Piper TTS)',
}

export const SAMPLE_RATE_MIC = 16000
export const SAMPLE_RATE_TTS = 22050
export const VOICE_SYSTEM_PROMPT =
  'You are a helpful voice assistant. Keep responses concise — 1 to 2 sentences max. Speak naturally.'
export const MAX_TOKENS = 80
export const LLM_TEMPERATURE = 0.7
