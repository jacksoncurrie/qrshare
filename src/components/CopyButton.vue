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
  <button class="button button--secondary" type="button" @click="copyText">
    <span v-if="status === 'idle'">{{ idleLabel ?? 'Copy' }}</span>
    <span v-else-if="status === 'success'">Copied</span>
    <span v-else>Copy failed</span>
  </button>
</template>
