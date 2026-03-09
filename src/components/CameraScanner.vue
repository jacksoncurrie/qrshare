<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import StatusMessage from '@/components/StatusMessage.vue'
import {
  createScannerAdapter,
  getScannerErrorMessage,
  ScannerError,
} from '@/lib/scanner'

const props = withDefaults(
  defineProps<{
    autoStart?: boolean
    showControls?: boolean
  }>(),
  {
    autoStart: false,
    showControls: true,
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
  <section class="panel">
    <div v-if="showControls" class="panel__header">
      <h2>Scan a QR code</h2>
      <button class="button" type="button" @click="toggleScanner">
        {{ scannerState === 'active' ? 'Stop scanning' : 'Scan QR' }}
      </button>
    </div>

    <video
      ref="videoRef"
      class="scanner-video"
      :class="{ 'scanner-video--with-header': showControls }"
      playsinline
      muted
      aria-label="Camera preview"
    />
    <StatusMessage v-if="message" tone="warning">{{ message }}</StatusMessage>
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
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #cbd5e1, #e2e8f0);
  border: 1px solid var(--color-border);
}

.scanner-video--with-header {
  margin-top: var(--space-4);
}
</style>
