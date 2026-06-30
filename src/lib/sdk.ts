import {
  RunAnywhere,
  SDKEnvironment,
  ModelManager,
  ModelCategory,
  EventBus,
  VoicePipeline,
  AudioCapture,
  AudioPlayback,
  OPFSStorage,
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

    // registerModels() kicks off refreshDownloadStatus() but doesn't await it.
    // Poll until the async OPFS scan completes so cached models are detected.
    await waitForOPFSScan();
  })();

  return _initPromise;
}

// ---- OPFS cache detection ----

const opfs = new OPFSStorage();

async function waitForOPFSScan(): Promise<void> {
  // refreshDownloadStatus() runs asynchronously after registerModels().
  // Poll ModelManager until model statuses have settled.
  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((r) => setTimeout(r, 100));
    const models = ModelManager.getModels();
    // If no models are stuck in "registered" state, the scan is done
    const hasDownloaded = models.some(
      (m) => m.status === "downloaded" || m.status === "loaded",
    );
    if (hasDownloaded) return; // Scan found cached models
  }
}

/**
 * Check if a model file exists in OPFS (persistent browser storage).
 * Use this before calling downloadModel() to skip models already cached.
 */
export async function isModelInOPFS(modelId: string): Promise<boolean> {
  try {
    await opfs.initialize();
    const size = await opfs.getFileSize(modelId);
    return size !== null && size > 0;
  } catch {
    return false;
  }
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

/**
 * Resume a suspended AudioContext — required on iOS Safari where
 * AudioContext starts suspended even after a user gesture.
 * Also verifies the actual sample rate matches expectations.
 */
export async function ensureAudioContextRunning(capture: AudioCapture): Promise<void> {
  // audioContext is private in the SDK type defs, but exists at runtime.
  // This is a deliberate compat workaround for iOS Safari.
  const ctx = (capture as any).audioContext as AudioContext | null;
  if (!ctx) return;

  if (ctx.state === "suspended") {
    console.log("AudioContext suspended — resuming (iOS workaround)");
    await ctx.resume();
    console.log("AudioContext resumed, state:", ctx.state, "sampleRate:", ctx.sampleRate);
  }

  if (ctx.state === "running" && ctx.sampleRate !== SAMPLE_RATE_MIC) {
    console.warn(
      `AudioContext sample rate mismatch: expected ${SAMPLE_RATE_MIC}, got ${ctx.sampleRate}. ` +
        "VAD/STT may not work correctly.",
    );
  }
}

export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
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
