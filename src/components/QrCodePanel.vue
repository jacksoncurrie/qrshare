<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { APP_NAME } from '@/lib/constants'
import { createQrCodeDataUrl } from '@/lib/qr'

const props = defineProps<{
  value: string
}>()

const qrDataUrl = ref('')
const qrError = ref('')

const altText = computed(
  () => `QR code for opening the shared text in ${APP_NAME}`,
)

watch(
  () => props.value,
  async (value) => {
    qrDataUrl.value = ''
    qrError.value = ''

    if (!value) {
      return
    }

    try {
      qrDataUrl.value = await createQrCodeDataUrl(value)
    } catch {
      qrError.value = 'QR Share could not render a QR code for this link.'
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="panel">
    <h2 class="panel__title">QR code</h2>
    <div class="qr-panel">
      <img
        v-if="qrDataUrl"
        class="qr-panel__image"
        :src="qrDataUrl"
        :alt="altText"
      />
      <p v-else-if="qrError" class="qr-panel__empty">{{ qrError }}</p>
      <p v-else class="qr-panel__empty">
        Generate a link to render the QR code.
      </p>
    </div>
  </section>
</template>

<style scoped>
.panel__title {
  margin-top: 0;
}

.qr-panel {
  min-height: 20rem;
  display: grid;
  place-items: center;
  padding: var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.qr-panel__image {
  width: min(18rem, 100%);
  aspect-ratio: 1;
  border-radius: var(--radius-md);
}

.qr-panel__empty {
  margin: 0;
  text-align: center;
  color: var(--color-muted);
}
</style>
