<script setup lang="ts">
import { ref } from 'vue'
import { COPY_SUCCESS_TIMEOUT_MS } from '@/lib/constants'

const props = defineProps<{
  text: string
  idleLabel?: string
}>()

const emit = defineEmits<{
  copied: []
}>()

const status = ref<'idle' | 'success' | 'error'>('idle')

let resetHandle: number | undefined

async function copyText() {
  if (!props.text) {
    return
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.text)
    } else {
      const helper = document.createElement('textarea')
      helper.value = props.text
      helper.setAttribute('readonly', '')
      helper.style.position = 'absolute'
      helper.style.left = '-9999px'
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      helper.remove()
    }

    status.value = 'success'
    emit('copied')
  } catch {
    status.value = 'error'
  }

  window.clearTimeout(resetHandle)
  resetHandle = window.setTimeout(() => {
    status.value = 'idle'
  }, COPY_SUCCESS_TIMEOUT_MS)
}
</script>

<template>
  <button class="copy-button" type="button" :disabled="!text" @click="copyText">
    <span v-if="status === 'idle'">{{ idleLabel ?? 'Copy' }}</span>
    <span v-else-if="status === 'success'">Copied</span>
    <span v-else>Copy failed</span>
  </button>
</template>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3.25rem;
  padding: 0 var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  background: var(--color-panel-muted);
  color: var(--color-text);
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: -0.01em;
}
</style>
