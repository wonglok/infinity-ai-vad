import {
  RunAnywhere,
  SDKEnvironment,
  ModelManager,
  ModelCategory,
  EventBus,
  VoicePipeline,
  AudioCapture,
  AudioPlayback,
} from "@runanywhere/web";
import { LlamaCPP } from "@runanywhere/web-llamacpp";
import { ONNX, VAD } from "@runanywhere/web-onnx";
import { MODEL_DEFS, SAMPLE_RATE_MIC, SAMPLE_RATE_TTS } from "../constants";

// SpeechActivity is an enum from @runanywhere/web, re-exported by web-onnx VAD types
export { SpeechActivity } from "@runanywhere/web";

// ---- Idempotent init ----

let _initPromise: Promise<void> | null = null;

export async function initSDK(): Promise<void> {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    await RunAnywhere.initialize({
      environment: import.meta.env.DEV
        ? SDKEnvironment.Development
        : SDKEnvironment.Production,
      debug: true,
    });
    await LlamaCPP.register();
    await ONNX.register();
    RunAnywhere.registerModels(MODEL_DEFS);
  })();

  return _initPromise;
}

// ---- Model download/load helpers ----

export type ProgressCallback = (downloaded: number, total: number) => void;

export async function downloadModel(
  modelId: string,
  onProgress?: ProgressCallback,
): Promise<void> {
  const unsub = EventBus.shared.on("model.downloadProgress", (evt: any) => {
    if (evt.modelId === modelId && evt.progress != null) {
      onProgress?.(evt.progress, 1);
    }
  });

  try {
    await ModelManager.downloadModel(modelId);
  } finally {
    unsub();
  }
}

export async function loadModel(modelId: string): Promise<void> {
  await ModelManager.loadModel(modelId, { coexist: true });
}

export function isModelDownloaded(modelId: string): boolean {
  const models = ModelManager.getModels();
  const model = models.find((m) => m.id === modelId);
  return model?.status === "downloaded" || model?.status === "loaded";
}

export function isModelLoaded(category: ModelCategory): boolean {
  return ModelManager.getLoadedModel(category) != null;
}

// ---- Audio capture / playback ----

export function createAudioCapture() {
  return new AudioCapture({ sampleRate: SAMPLE_RATE_MIC });
}

export function createAudioPlayback() {
  return new AudioPlayback({ sampleRate: SAMPLE_RATE_TTS });
}

// ---- VAD ----

export function setupVAD() {
  VAD.reset();
  return VAD;
}

// ---- Voice Pipeline ----

let _pipelineInstance: VoicePipeline | null = null;

export function getPipeline(): VoicePipeline {
  if (!_pipelineInstance) {
    _pipelineInstance = new VoicePipeline();
  }
  return _pipelineInstance;
}

export function resetPipeline(): void {
  _pipelineInstance = null;
}

// ---- Browser capability check ----

export interface BrowserCheckResult {
  supported: boolean;
  warnings: string[];
}

export function checkBrowserSupport(): BrowserCheckResult {
  const warnings: string[] = [];

  if (typeof WebAssembly === "undefined") {
    return { supported: false, warnings: ["WebAssembly not supported"] };
  }

  if (typeof SharedArrayBuffer === "undefined") {
    warnings.push(
      "SharedArrayBuffer not available. WASM runs single-threaded. Ensure COOP/COEP headers are set.",
    );
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return {
      supported: false,
      warnings: ["Microphone access not available in this browser"],
    };
  }

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    warnings.push(
      "Safari detected. OPFS storage may be unreliable and WebGPU is not available. Chrome/Edge recommended.",
    );
  }

  if ("deviceMemory" in navigator) {
    const memory = (navigator as any).deviceMemory as number;
    if (memory < 4) {
      warnings.push(
        "Low memory device detected. Large models may fail to load.",
      );
    }
  }

  return { supported: true, warnings };
}
