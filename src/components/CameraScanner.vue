<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import StatusMessage from '@/components/StatusMessage.vue'
import {
  createScannerAdapter,
  getScannerErrorMessage,
  ScannerError,
} from '@/lib/scanner'

const emit = defineEmits<{
  decoded: [value: string]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const scannerState = ref<'idle' | 'active'>('idle')
const message = ref('')
let adapter: ReturnType<typeof createScannerAdapter> | null = null

const buttonLabel = computed(() =>
  scannerState.value === 'active' ? 'Stop scanning' : 'Scan QR',
)

async function toggleScanner() {
  if (scannerState.value === 'active') {
    adapter?.stop()
    adapter?.destroy()
    adapter = null
    scannerState.value = 'idle'
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
        adapter?.stop()
        scannerState.value = 'idle'
      },
      (error) => {
        message.value = getScannerErrorMessage(error.code)
        scannerState.value = 'idle'
      },
    )

    await adapter.start()
    scannerState.value = 'active'
  } catch (error) {
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

onBeforeUnmount(() => {
  adapter?.stop()
  adapter?.destroy()
})
</script>

<template>
  <section class="panel">
    <div class="panel__header">
      <h2>Scan a QR code</h2>
      <button class="button" type="button" @click="toggleScanner">
        {{ buttonLabel }}
      </button>
    </div>

    <video
      ref="videoRef"
      class="scanner-video"
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
  margin-top: var(--space-4);
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, #cbd5e1, #e2e8f0);
  border: 1px solid var(--color-border);
}
</style>
