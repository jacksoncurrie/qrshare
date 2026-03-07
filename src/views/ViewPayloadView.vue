<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CameraScanner from '@/components/CameraScanner.vue'
import DecodedTextPanel from '@/components/DecodedTextPanel.vue'
import FieldHint from '@/components/FieldHint.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import { ROUTES } from '@/lib/constants'
import {
  getPayloadErrorMessage,
  parsePayload,
  PayloadError,
} from '@/lib/payload'
import { extractPayloadFromInput } from '@/lib/share-url'

const router = useRouter()
const decodedText = ref('')
const errorMessage = ref('')
const manualInput = ref('')

function applyPayloadInput(input: string) {
  const candidate = extractPayloadFromInput(input)

  if (!candidate) {
    decodedText.value = ''
    errorMessage.value = getPayloadErrorMessage('unsupported_qr_content')
    return
  }

  try {
    const parsed = parsePayload(candidate)
    decodedText.value = parsed.text
    errorMessage.value = ''
    router.replace({ path: ROUTES.view, hash: `#${parsed.encodedPayload}` })
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
    return
  }

  applyPayloadInput(window.location.hash)
}

function submitManualInput() {
  applyPayloadInput(manualInput.value)
}

function clearResult() {
  decodedText.value = ''
  errorMessage.value = ''
  manualInput.value = ''
  router.replace({ path: ROUTES.view, hash: '' })
}

function handleScannedValue(value: string) {
  manualInput.value = value
  applyPayloadInput(value)
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
  <div class="stack-lg">
    <section class="panel stack-md">
      <div class="stack-sm">
        <p class="eyebrow">View</p>
        <h1>Open a QR Share payload</h1>
        <p class="lede">
          Open a QR Share link, scan a QR code, or paste a raw `v1.p...`
          payload. Non-QR Share QR codes are rejected in v1.
        </p>
      </div>

      <StatusMessage v-if="errorMessage" tone="error">{{
        errorMessage
      }}</StatusMessage>
      <StatusMessage v-else-if="decodedText" tone="success"
        >Payload decoded locally on this device.</StatusMessage
      >

      <label class="stack-sm" for="manual-input">
        <span>Paste a QR Share URL or payload</span>
        <textarea
          id="manual-input"
          v-model="manualInput"
          rows="4"
          placeholder="https://jacksoncurrie.github.io/proxisend/view#v1.p... or v1.p..."
        />
      </label>

      <div class="button-group">
        <button class="button" type="button" @click="submitManualInput">
          Decode input
        </button>
        <RouterLink class="button button--secondary" :to="ROUTES.create"
          >Back to create</RouterLink
        >
      </div>
      <FieldHint>
        The text is decoded locally. QR Share does not upload or store payloads
        on a server.
      </FieldHint>
    </section>

    <CameraScanner @decoded="handleScannedValue" />

    <DecodedTextPanel
      v-if="decodedText"
      :text="decodedText"
      @clear="clearResult"
    />
  </div>
</template>

<style scoped>
.lede {
  max-width: 60ch;
  color: var(--color-muted);
}
</style>
