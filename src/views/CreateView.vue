<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import QrCodePanel from '@/components/QrCodePanel.vue'
import { COPY_SUCCESS_TIMEOUT_MS } from '@/lib/constants'
import { copyText } from '@/lib/copy'
import {
  encodePayload,
  getPayloadErrorMessage,
  PayloadError,
} from '@/lib/payload'
import { buildShareUrl } from '@/lib/share-url'

const inputText = ref('')
const generatedUrl = ref('')
const errorMessage = ref('')
const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

let debounceHandle: number | undefined
let copyStatusHandle: number | undefined

function resetCopyStatus() {
  window.clearTimeout(copyStatusHandle)
  copyStatusHandle = window.setTimeout(() => {
    copyStatus.value = 'idle'
  }, COPY_SUCCESS_TIMEOUT_MS)
}

async function copyGeneratedUrl() {
  if (!generatedUrl.value) {
    return
  }

  try {
    await copyText(generatedUrl.value)
    copyStatus.value = 'success'
  } catch {
    copyStatus.value = 'error'
  }

  resetCopyStatus()
}

watch(inputText, () => {
  window.clearTimeout(debounceHandle)

  if (!inputText.value.trim()) {
    generatedUrl.value = ''
    errorMessage.value = ''
    copyStatus.value = 'idle'
    return
  }

  debounceHandle = window.setTimeout(() => {
    try {
      const { encodedPayload } = encodePayload(inputText.value)
      generatedUrl.value = buildShareUrl(encodedPayload)
      errorMessage.value = ''
      copyStatus.value = 'idle'
    } catch (error) {
      generatedUrl.value = ''
      errorMessage.value =
        error instanceof PayloadError
          ? getPayloadErrorMessage(error.code)
          : 'QR Share could not generate that link.'
      copyStatus.value = 'idle'
    }
  }, 120)
})

onBeforeUnmount(() => {
  window.clearTimeout(debounceHandle)
  window.clearTimeout(copyStatusHandle)
})
</script>

<template>
  <div class="create-view">
    <section class="create-view__input">
      <textarea
        id="payload-input"
        v-model="inputText"
        :class="{ 'create-view__textarea--error': errorMessage }"
        rows="8"
        placeholder="Enter text here to generate the QR code..."
        aria-label="Text to share"
      />

      <p v-if="errorMessage" class="create-view__error">
        {{ errorMessage }}
      </p>
    </section>

    <section class="create-view__output">
      <div class="create-view__qr-wrap">
        <QrCodePanel
          :value="generatedUrl"
          bare
          empty-text="Waiting for text. QR code will appear here."
        />
        <button
          class="create-view__qr-action"
          type="button"
          :disabled="!generatedUrl"
          aria-label="Copy link"
          :data-status="copyStatus"
          @click="copyGeneratedUrl"
        >
          <span class="create-view__qr-message" aria-live="polite">
            {{
              copyStatus === 'success'
                ? 'Copied link'
                : copyStatus === 'error'
                  ? 'Copy failed'
                  : 'Click to copy'
            }}
          </span>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.create-view {
  width: min(100%, var(--content-narrow-width));
  margin: 0 auto;
  display: grid;
  gap: 0.75rem;
}

.create-view__input {
  display: grid;
  gap: 0.35rem;
}

.create-view__input textarea {
  min-height: 20rem;
  resize: none;
  font-size: 1rem;
  line-height: 1.6;
}

.create-view__textarea--error {
  border-color: var(--color-error);
}

.create-view__error {
  margin: 0;
  color: var(--color-error);
  font-size: 0.95rem;
  text-align: center;
}

.create-view__output {
  display: grid;
  gap: 0.2rem;
}

.create-view__qr-wrap {
  position: relative;
  overflow: visible;
  margin-top: 0.3rem;
}

.create-view__qr-action {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.create-view__qr-action:disabled {
  opacity: 1;
  cursor: default;
}

.create-view__qr-message {
  position: absolute;
  top: 0;
  left: 50%;
  padding: 0.45rem 0.65rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-text) 92%, transparent);
  color: var(--color-primary-contrast);
  font-size: 0.85rem;
  line-height: 1;
  transform: translate(-50%, calc(-100% - 0.2rem));
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 140ms ease,
    transform 140ms ease;
}

.create-view__qr-wrap:hover
  .create-view__qr-action:not(:disabled)
  .create-view__qr-message,
.create-view__qr-action:focus-visible .create-view__qr-message,
.create-view__qr-action[data-status='success'] .create-view__qr-message,
.create-view__qr-action[data-status='error'] .create-view__qr-message {
  opacity: 1;
  transform: translate(-50%, calc(-100% - 0.3rem));
}
</style>
