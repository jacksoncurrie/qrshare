<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraScanner from '@/components/CameraScanner.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import { ROUTES } from '@/lib/constants'
import {
  getPayloadErrorMessage,
  parsePayload,
  PayloadError,
} from '@/lib/payload'
import { extractPayloadFromInput } from '@/lib/share-url'

const router = useRouter()
const errorMessage = ref('')

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(ROUTES.create)
}

function handleDecodedValue(value: string) {
  const candidate = extractPayloadFromInput(value)

  if (!candidate) {
    errorMessage.value = getPayloadErrorMessage('unsupported_qr_content')
    return
  }

  try {
    const parsed = parsePayload(candidate)
    errorMessage.value = ''
    router.replace({ path: ROUTES.view, hash: `#${parsed.encodedPayload}` })
  } catch (error) {
    errorMessage.value =
      error instanceof PayloadError
        ? getPayloadErrorMessage(error.code)
        : 'QR Share could not read that payload.'
  }
}
</script>

<template>
  <div class="scan-view">
    <button
      class="scan-view__back"
      type="button"
      aria-label="Back"
      @click="goBack"
    >
      <svg class="scan-view__back-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14.78 5.47a.75.75 0 0 1 0 1.06L10.31 11l4.47 4.47a.75.75 0 1 1-1.06 1.06l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 0 1 1.06 0Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <div class="scan-view__content">
      <CameraScanner
        auto-start
        :show-controls="false"
        @decoded="handleDecodedValue"
      />
      <StatusMessage v-if="errorMessage" tone="warning">
        {{ errorMessage }}
      </StatusMessage>
    </div>
  </div>
</template>

<style scoped>
.scan-view {
  min-height: 100vh;
  padding: var(--space-4);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: var(--space-4);
  background:
    radial-gradient(circle at top, var(--color-bg-accent) 0, transparent 26rem),
    linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%);
}

.scan-view__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  padding: 0;
  justify-self: start;
  border-radius: 1rem;
  background: color-mix(in srgb, var(--color-surface-strong) 82%, transparent);
}

.scan-view__back-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.scan-view__content {
  width: min(100%, 42rem);
  margin: 0 auto;
  display: grid;
  gap: var(--space-4);
  align-content: center;
}
</style>
