<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DecodedTextPanel from '@/components/DecodedTextPanel.vue'
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
    <DecodedTextPanel
      v-else-if="decodedText"
      :text="decodedText"
      :show-clear="false"
    />
  </div>
</template>

<style scoped>
.view-payload {
  min-height: 100vh;
  width: min(100%, 46rem);
  margin: 0 auto;
  padding: var(--space-4);
  display: grid;
  align-content: center;
}
</style>
