<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
const themeVersion = ref(0)
let latestRequestId = 0
let stopWatchingTheme = () => undefined

const altText = computed(
  () => `QR code for opening the shared text in ${APP_NAME}`,
)

function readQrColors() {
  if (typeof window === 'undefined') {
    return {
      dark: '#171717',
      light: '#f1efe8',
    }
  }

  const styles = window.getComputedStyle(document.documentElement)

  return {
    dark: styles.getPropertyValue('--color-text').trim() || '#171717',
    light: styles.getPropertyValue('--color-qr-panel').trim() || '#f1efe8',
  }
}

watch(
  [() => props.value, themeVersion],
  async ([value]) => {
    const requestId = ++latestRequestId
    qrDataUrl.value = ''
    qrError.value = ''

    if (!value) {
      return
    }

    try {
      const nextQrDataUrl = await createQrCodeDataUrl(value, readQrColors())

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

onMounted(() => {
  if (typeof MutationObserver === 'undefined') {
    return
  }

  const observer = new MutationObserver(() => {
    themeVersion.value += 1
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  stopWatchingTheme = () => observer.disconnect()
})

onBeforeUnmount(() => {
  stopWatchingTheme()
})
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
  min-height: 20rem;
  display: grid;
  place-items: center;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-qr-panel);
}

.qr-panel__image {
  width: min(18rem, 100%);
  aspect-ratio: 1;
}

.qr-panel__empty {
  margin: 0;
  text-align: center;
  color: var(--color-muted);
  max-width: none;
  line-height: 1.45;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .qr-panel__empty {
    max-width: 16rem;
    white-space: normal;
  }
}
</style>
