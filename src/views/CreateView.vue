<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import QrCodePanel from '@/components/QrCodePanel.vue'
import { APP_NAME, COPY_SUCCESS_TIMEOUT_MS } from '@/lib/constants'
import { copyText } from '@/lib/copy'
import {
  encodePayload,
  getPayloadErrorMessage,
  PayloadError,
} from '@/lib/payload'
import { buildShareUrl, normalizeDirectUrl } from '@/lib/share-url'

type CreateMode = 'text' | 'url'

const activeMode = ref<CreateMode>('text')
const inputValue = ref('')
const generatedUrl = ref('')
const errorMessage = ref('')
const copyStatus = ref<'idle' | 'success' | 'error'>('idle')

const modeOptions: Array<{ label: string; value: CreateMode }> = [
  { label: 'Text', value: 'text' },
  { label: 'URL', value: 'url' },
]

const inputLabel = computed(() =>
  activeMode.value === 'text' ? 'Text to share' : 'URL to share',
)

const inputPlaceholder = computed(() =>
  activeMode.value === 'text'
    ? 'Enter text here to generate the QR code...'
    : 'Enter a full URL like https://example.com',
)

const qrEmptyText = computed(() =>
  activeMode.value === 'text'
    ? 'Waiting for text. QR code will appear here.'
    : 'Waiting for a valid URL. QR code will appear here.',
)

const qrAltText = computed(() =>
  activeMode.value === 'text'
    ? `QR code for opening the shared text in ${APP_NAME}`
    : `QR code for opening the shared URL in ${APP_NAME}`,
)

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

watch([activeMode, inputValue], () => {
  window.clearTimeout(debounceHandle)

  if (!inputValue.value.trim()) {
    generatedUrl.value = ''
    errorMessage.value = ''
    copyStatus.value = 'idle'
    return
  }

  debounceHandle = window.setTimeout(() => {
    try {
      if (activeMode.value === 'text') {
        const { encodedPayload } = encodePayload(inputValue.value)
        generatedUrl.value = buildShareUrl(encodedPayload)
        errorMessage.value = ''
        copyStatus.value = 'idle'
        return
      }

      const normalizedUrl = normalizeDirectUrl(inputValue.value)

      if (!normalizedUrl) {
        throw new PayloadError('invalid_direct_url')
      }

      generatedUrl.value = normalizedUrl
      errorMessage.value = ''
      copyStatus.value = 'idle'
    } catch (error) {
      generatedUrl.value = ''
      errorMessage.value =
        error instanceof PayloadError
          ? getPayloadErrorMessage(error.code)
          : 'QR Share could not generate that QR code.'
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
        v-model="inputValue"
        :class="{ 'create-view__textarea--error': errorMessage }"
        rows="8"
        :placeholder="inputPlaceholder"
        :aria-label="inputLabel"
      />

      <div
        class="create-view__mode-switch"
        role="group"
        aria-label="Share mode"
      >
        <button
          v-for="option in modeOptions"
          :key="option.value"
          class="create-view__mode-pill"
          :class="{
            'create-view__mode-pill--active': activeMode === option.value,
          }"
          type="button"
          :aria-pressed="activeMode === option.value"
          @click="activeMode = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <p v-if="errorMessage" class="create-view__error">
        {{ errorMessage }}
      </p>
    </section>

    <section class="create-view__output">
      <div class="create-view__qr-wrap">
        <QrCodePanel
          :value="generatedUrl"
          :alt-text="qrAltText"
          bare
          :empty-text="qrEmptyText"
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

.create-view__mode-switch {
  display: flex;
  justify-content: flex-start;
  gap: 0.35rem;
}

.create-view__mode-pill {
  min-width: 0;
  min-height: 0;
  padding: 0.56rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface) 97%, transparent);
  color: var(--color-muted);
  font: inherit;
  font-size: 0.84rem;
  line-height: 1;
  cursor: pointer;
  transition: none;
}

.create-view__mode-pill:hover {
  border-color: var(--color-border-strong);
}

.create-view__mode-pill--active {
  border-color: color-mix(in srgb, var(--color-text) 12%, var(--color-border));
  background: var(--color-qr-panel);
  color: var(--color-text);
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
