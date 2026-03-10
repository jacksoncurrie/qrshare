<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CopyButton from '@/components/CopyButton.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import {
  getPayloadErrorMessage,
  parsePayload,
  PayloadError,
} from '@/lib/payload'

const decodedText = ref('')
const errorMessage = ref('')

function applyPayloadInput(input: string) {
  try {
    const parsed = parsePayload(input)
    decodedText.value = parsed.text
    errorMessage.value = ''
  } catch (error) {
    decodedText.value = ''
    errorMessage.value =
      error instanceof PayloadError
        ? getPayloadErrorMessage(error.code)
        : 'QR Share could not read that payload.'
  }
}

function readHash() {
  if (!window.location.hash) {
    decodedText.value = ''
    errorMessage.value = 'No QR Share payload was found in this link.'
    return
  }

  applyPayloadInput(window.location.hash)
}

onMounted(() => {
  readHash()
  window.addEventListener('hashchange', readHash)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', readHash)
})
</script>

<template>
  <div class="view-payload">
    <StatusMessage v-if="errorMessage" tone="error">{{
      errorMessage
    }}</StatusMessage>
    <section v-else-if="decodedText" class="view-payload__content">
      <textarea
        class="view-payload__textarea"
        :value="decodedText"
        disabled
        aria-label="Decoded text"
      />
      <CopyButton :text="decodedText" idle-label="Copy text" />
    </section>
  </div>
</template>

<style scoped>
.view-payload {
  width: min(100%, var(--content-narrow-width));
  margin: 0 auto;
  display: grid;
  gap: var(--space-3);
}

.view-payload__content {
  display: grid;
  gap: 0.75rem;
}

.view-payload__textarea {
  min-height: 20rem;
  resize: none;
  font-size: 1rem;
  line-height: 1.6;
}
</style>
