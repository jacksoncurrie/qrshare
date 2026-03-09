<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import CopyButton from '@/components/CopyButton.vue'
import QrCodePanel from '@/components/QrCodePanel.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import {
  encodePayload,
  getPayloadErrorMessage,
  PayloadError,
} from '@/lib/payload'
import { buildShareUrl } from '@/lib/share-url'

const inputText = ref('')
const generatedUrl = ref('')
const errorMessage = ref('')

let debounceHandle: number | undefined

watch(inputText, () => {
  window.clearTimeout(debounceHandle)

  if (!inputText.value.trim()) {
    generatedUrl.value = ''
    errorMessage.value = ''
    return
  }

  debounceHandle = window.setTimeout(() => {
    try {
      const { encodedPayload } = encodePayload(inputText.value)
      generatedUrl.value = buildShareUrl(encodedPayload)
      errorMessage.value = ''
    } catch (error) {
      generatedUrl.value = ''
      errorMessage.value =
        error instanceof PayloadError
          ? getPayloadErrorMessage(error.code)
          : 'QR Share could not generate that link.'
    }
  }, 120)
})

onBeforeUnmount(() => window.clearTimeout(debounceHandle))
</script>

<template>
  <div class="create-view stack-lg">
    <section class="panel create-view__input stack-md">
      <textarea
        id="payload-input"
        v-model="inputText"
        rows="8"
        placeholder="Enter text here..."
        aria-label="Text to share"
      />

      <StatusMessage v-if="errorMessage" tone="error">
        {{ errorMessage }}
      </StatusMessage>
    </section>

    <section class="panel create-view__output stack-sm">
      <QrCodePanel
        :value="generatedUrl"
        bare
        empty-text="Start typing and the QR code will appear here."
      />
      <div class="create-view__link-row">
        <input
          id="generated-link"
          :value="generatedUrl"
          readonly
          aria-label="Share link"
        />
        <CopyButton :text="generatedUrl" idle-label="Copy" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.create-view {
  width: min(100%, 46rem);
  margin: 0 auto;
}

.create-view__input {
  gap: 0.9rem;
}

.create-view__input textarea {
  min-height: 14rem;
  font-size: 1.08rem;
  line-height: 1.6;
}

.create-view__link-row {
  display: grid;
  gap: var(--space-3);
}

.create-view__output {
  gap: 1rem;
}

@media (min-width: 760px) {
  .create-view__link-row {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
}
</style>
