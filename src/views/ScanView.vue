<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraScanner from '@/components/CameraScanner.vue'
import { ROUTES } from '@/lib/constants'
import {
  getPayloadErrorMessage,
  parsePayload,
  PayloadError,
} from '@/lib/payload'
import { extractPayloadFromInput } from '@/lib/share-url'

const router = useRouter()
const errorMessage = ref('')

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
    <div class="scan-view__content">
      <CameraScanner
        auto-start
        :error-message="errorMessage"
        :show-controls="false"
        square
        @decoded="handleDecodedValue"
      />
    </div>
  </div>
</template>

<style scoped>
.scan-view {
  width: min(100%, var(--content-narrow-width));
  margin: 0 auto;
  display: grid;
  gap: var(--space-3);
  align-content: start;
}

.scan-view__content {
  display: grid;
  gap: var(--space-3);
}
</style>
