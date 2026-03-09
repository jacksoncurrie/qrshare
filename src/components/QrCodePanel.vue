<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { APP_NAME } from '@/lib/constants'
import { createQrCodeDataUrl } from '@/lib/qr'

const props = defineProps<{
  value: string
  title?: string
  emptyText?: string
  bare?: boolean
}>()

const qrDataUrl = ref('')
const qrError = ref('')
let latestRequestId = 0

const altText = computed(
  () => `QR code for opening the shared text in ${APP_NAME}`,
)

watch(
  () => props.value,
  async (value) => {
    const requestId = ++latestRequestId
    qrDataUrl.value = ''
    qrError.value = ''

    if (!value) {
      return
    }

    try {
      const nextQrDataUrl = await createQrCodeDataUrl(value)

      if (requestId !== latestRequestId) {
        return
      }

      qrDataUrl.value = nextQrDataUrl
    } catch {
      if (requestId !== latestRequestId) {
        return
      }

      qrError.value = 'QR Share could not render a QR code for this link.'
    }
  },
  { immediate: true },
)
</script>

<template>
  <section :class="{ panel: !bare }">
    <h2 v-if="title" class="panel__title">{{ title }}</h2>
    <div class="qr-panel">
      <img
        v-if="qrDataUrl"
        class="qr-panel__image"
        :src="qrDataUrl"
        :alt="altText"
      />
      <p v-else-if="qrError" class="qr-panel__empty">{{ qrError }}</p>
      <p v-else class="qr-panel__empty">
        {{ emptyText ?? 'Start typing to generate a QR code.' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.panel__title {
  margin-top: 0;
}

.qr-panel {
  min-height: 21rem;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  border: 1px solid
    color-mix(in srgb, var(--color-border-strong) 70%, transparent);
  border-radius: calc(var(--radius-lg) - 0.2rem);
  background: var(--color-qr-panel);
}

.qr-panel__image {
  width: min(18.5rem, 100%);
  aspect-ratio: 1;
  border-radius: 1.5rem;
  box-shadow:
    0 18px 40px rgba(17, 24, 39, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.qr-panel__empty {
  margin: 0;
  text-align: center;
  color: var(--color-muted);
  max-width: 18rem;
  line-height: 1.45;
}
</style>
