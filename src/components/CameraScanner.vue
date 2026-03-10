<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  createScannerAdapter,
  getScannerErrorMessage,
  ScannerError,
} from '@/lib/scanner'

const props = withDefaults(
  defineProps<{
    autoStart?: boolean
    showControls?: boolean
    square?: boolean
    errorMessage?: string
  }>(),
  {
    autoStart: false,
    showControls: true,
    square: false,
    errorMessage: '',
  },
)

const emit = defineEmits<{
  decoded: [value: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const scannerState = ref<'idle' | 'active'>('idle')
const message = ref('')
let adapter: ReturnType<typeof createScannerAdapter> | null = null

function stopScanner() {
  adapter?.stop()
  adapter?.destroy()
  adapter = null
  scannerState.value = 'idle'
}

async function startScanner() {
  if (scannerState.value === 'active') {
    return
  }

  message.value = ''

  if (!videoRef.value) {
    return
  }

  try {
    adapter = createScannerAdapter(
      videoRef.value,
      (value) => {
        emit('decoded', value)
        stopScanner()
      },
      (error) => {
        message.value = getScannerErrorMessage(error.code)
        stopScanner()
      },
    )

    await adapter.start()
    scannerState.value = 'active'
  } catch (error) {
    stopScanner()
    const errorCode =
      error instanceof ScannerError
        ? error.code
        : typeof error === 'object' && error && 'code' in error
          ? String(error.code)
          : 'scan_failed'
    message.value = getScannerErrorMessage(
      errorCode === 'permission_denied' ||
        errorCode === 'no_camera' ||
        errorCode === 'unsupported_browser'
        ? errorCode
        : 'scan_failed',
    )
  }
}

async function toggleScanner() {
  if (scannerState.value === 'active') {
    stopScanner()
    return
  }

  await startScanner()
}

onMounted(() => {
  if (props.autoStart) {
    void startScanner()
  }
})

onBeforeUnmount(() => {
  stopScanner()
})
</script>

<template>
  <section :class="{ panel: showControls }">
    <div v-if="showControls" class="panel__header">
      <h2>Scan a QR code</h2>
      <button class="button" type="button" @click="toggleScanner">
        {{ scannerState === 'active' ? 'Stop scanning' : 'Scan QR' }}
      </button>
    </div>

    <div
      class="scanner-frame"
      :class="{ 'scanner-frame--with-header': showControls }"
    >
      <video
        ref="videoRef"
        class="scanner-video"
        :class="{
          'scanner-video--error': errorMessage || message,
          'scanner-video--square': square,
        }"
        playsinline
        muted
        aria-label="Camera preview"
      />
      <div class="scanner-guide" aria-hidden="true">
        <span class="scanner-guide__corner scanner-guide__corner--top-left" />
        <span class="scanner-guide__corner scanner-guide__corner--top-right" />
        <span
          class="scanner-guide__corner scanner-guide__corner--bottom-left"
        />
        <span
          class="scanner-guide__corner scanner-guide__corner--bottom-right"
        />
      </div>
    </div>
    <p v-if="errorMessage || message" class="scanner-error">
      {{ errorMessage || message }}
    </p>
  </section>
</template>

<style scoped>
.panel__header {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

.panel__header h2 {
  margin: 0;
}

.scanner-video {
  width: 100%;
  aspect-ratio: 4 / 3;
  display: block;
  border-radius: calc(var(--radius-lg) - 0.1rem);
  background: var(--color-qr-panel);
  border: 1px solid var(--color-border);
  object-fit: cover;
}

.scanner-video--square {
  width: 100%;
  max-width: none;
  height: 20rem;
  aspect-ratio: auto;
  justify-self: stretch;
}

.scanner-video--error {
  border-color: var(--color-error);
}

.scanner-frame {
  position: relative;
}

.scanner-frame--with-header {
  margin-top: var(--space-4);
}

.scanner-error {
  margin: 0.35rem 0 0;
  color: var(--color-error);
  font-size: 0.95rem;
  text-align: center;
}

.scanner-guide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.scanner-guide::before {
  content: none;
}

.scanner-guide__corner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(62%, 12rem);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
}

.scanner-guide__corner::before,
.scanner-guide__corner::after {
  content: '';
  position: absolute;
  background: color-mix(in srgb, var(--color-text) 78%, transparent);
  border-radius: 999px;
}

.scanner-guide__corner--top-left::before,
.scanner-guide__corner--top-right::before,
.scanner-guide__corner--bottom-left::before,
.scanner-guide__corner--bottom-right::before {
  width: 2rem;
  height: 2px;
}

.scanner-guide__corner--top-left::after,
.scanner-guide__corner--top-right::after,
.scanner-guide__corner--bottom-left::after,
.scanner-guide__corner--bottom-right::after {
  width: 2px;
  height: 2rem;
}

.scanner-guide__corner--top-left::before {
  top: 0;
  left: 0;
}

.scanner-guide__corner--top-left::after {
  top: 0;
  left: 0;
}

.scanner-guide__corner--top-right::before {
  top: 0;
  right: 0;
}

.scanner-guide__corner--top-right::after {
  top: 0;
  right: 0;
}

.scanner-guide__corner--bottom-left::before {
  bottom: 0;
  left: 0;
}

.scanner-guide__corner--bottom-left::after {
  bottom: 0;
  left: 0;
}

.scanner-guide__corner--bottom-right::before {
  bottom: 0;
  right: 0;
}

.scanner-guide__corner--bottom-right::after {
  bottom: 0;
  right: 0;
}

.panel {
  position: relative;
}
</style>
