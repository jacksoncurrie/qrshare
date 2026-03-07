<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import CopyButton from '@/components/CopyButton.vue'
import FieldHint from '@/components/FieldHint.vue'
import QrCodePanel from '@/components/QrCodePanel.vue'
import StatusMessage from '@/components/StatusMessage.vue'
import { PAYLOAD_WARNING_BYTES, ROUTES } from '@/lib/constants'
import {
  encodePayload,
  getPayloadErrorMessage,
  getPayloadMetrics,
  PayloadError,
} from '@/lib/payload'
import { buildShareUrl } from '@/lib/share-url'

const inputText = ref('')
const generatedUrl = ref('')
const generatedPayload = ref('')
const message = ref('')

const metrics = computed(() => getPayloadMetrics(inputText.value))
const canGenerate = computed(
  () => inputText.value.trim().length > 0 && metrics.value.allowed,
)
const canNativeShare = computed(
  () =>
    typeof navigator !== 'undefined' && typeof navigator.share === 'function',
)

function resetGeneratedState() {
  generatedUrl.value = ''
  generatedPayload.value = ''
}

watch(inputText, () => {
  message.value = ''
  resetGeneratedState()
})

function generateShare() {
  try {
    const { encodedPayload } = encodePayload(inputText.value)
    generatedPayload.value = encodedPayload
    generatedUrl.value = buildShareUrl(encodedPayload)
    message.value = ''
  } catch (error) {
    message.value =
      error instanceof PayloadError
        ? getPayloadErrorMessage(error.code)
        : 'QR Share could not generate that link.'
    resetGeneratedState()
  }
}

async function shareLink() {
  if (!generatedUrl.value || !navigator.share) {
    return
  }

  await navigator.share({
    title: 'QR Share link',
    text: 'Open this QR Share link to read the text payload.',
    url: generatedUrl.value,
  })
}
</script>

<template>
  <div class="stack-lg">
    <section class="panel stack-md">
      <div class="stack-sm">
        <p class="eyebrow">Create</p>
        <h1>Generate a QR Share link</h1>
        <p class="lede">
          Encode short text into a shareable link and QR code. The content is
          not secret. Anyone with the link or QR can read it.
        </p>
      </div>

      <label class="stack-sm" for="payload-input">
        <span>Text to share</span>
        <textarea
          id="payload-input"
          v-model="inputText"
          rows="8"
          placeholder="Paste a short note, URL, test credential, code, or JSON snippet."
        />
      </label>

      <div class="cluster">
        <strong>{{ inputText.length }} characters</strong>
        <span>{{ metrics.byteLength }} bytes</span>
      </div>

      <FieldHint>
        Keep payloads short for reliable scanning. Warnings start at
        {{ PAYLOAD_WARNING_BYTES }} bytes.
      </FieldHint>
      <FieldHint v-if="metrics.warning && metrics.allowed" tone="warning">
        This payload is getting dense and may be harder to scan on older screens
        or cameras.
      </FieldHint>
      <StatusMessage v-if="message" tone="error">{{ message }}</StatusMessage>

      <div class="button-group">
        <button
          class="button"
          type="button"
          :disabled="!canGenerate"
          @click="generateShare"
        >
          Generate QR
        </button>
        <button
          v-if="canNativeShare && generatedUrl"
          class="button button--secondary"
          type="button"
          @click="shareLink"
        >
          Share
        </button>
      </div>
    </section>

    <div class="responsive-grid">
      <QrCodePanel :value="generatedUrl" />

      <section class="panel stack-md">
        <h2>Generated link</h2>
        <FieldHint>
          QR Share stores the payload in the URL fragment so the text is not
          sent to the server, but anyone with the URL can still read it.
        </FieldHint>
        <label class="stack-sm" for="generated-link">
          <span>Share URL</span>
          <input
            id="generated-link"
            :value="generatedUrl"
            readonly
            placeholder="Generate a QR code to create a link."
          />
        </label>

        <div class="button-group">
          <CopyButton :text="generatedUrl" idle-label="Copy link" />
          <RouterLink
            class="button button--secondary"
            :aria-disabled="!generatedPayload"
            :to="`${ROUTES.view}#${generatedPayload}`"
          >
            Open view
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.lede {
  max-width: 60ch;
  color: var(--color-muted);
}

.cluster {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  color: var(--color-muted);
}

.responsive-grid {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 900px) {
  .responsive-grid {
    grid-template-columns: 1.1fr 0.9fr;
  }
}
</style>
