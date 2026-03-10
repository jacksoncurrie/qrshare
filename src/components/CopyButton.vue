<script setup lang="ts">
import { ref } from 'vue'
import { COPY_SUCCESS_TIMEOUT_MS } from '@/lib/constants'
import { copyText } from '@/lib/copy'

const props = defineProps<{
  text: string
  idleLabel?: string
  iconOnly?: boolean
}>()

const emit = defineEmits<{
  copied: []
}>()

const status = ref<'idle' | 'success' | 'error'>('idle')

let resetHandle: number | undefined

async function handleCopy() {
  if (!props.text) {
    return
  }

  try {
    await copyText(props.text)
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
  <button
    class="copy-button"
    :class="{ 'copy-button--icon-only': iconOnly }"
    type="button"
    :disabled="!text"
    @click="handleCopy"
  >
    <template v-if="iconOnly">
      <svg
        v-if="status === 'idle'"
        class="copy-button__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M9.25 4.75A2.5 2.5 0 0 0 6.75 7.25v8.5a2.5 2.5 0 0 0 2.5 2.5h6.5a2.5 2.5 0 0 0 2.5-2.5v-8.5a2.5 2.5 0 0 0-2.5-2.5h-6.5Zm0 1.5h6.5c.552 0 1 .448 1 1v8.5c0 .552-.448 1-1 1h-6.5c-.552 0-1-.448-1-1v-8.5c0-.552.448-1 1-1Zm-3 2a.75.75 0 0 1 .75.75v8a2 2 0 0 0 2 2h6a.75.75 0 0 1 0 1.5h-6a3.5 3.5 0 0 1-3.5-3.5v-8a.75.75 0 0 1 .75-.75Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else-if="status === 'success'"
        class="copy-button__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M18.28 7.22a.75.75 0 0 1 0 1.06l-7 7a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.97 2.97 6.47-6.47a.75.75 0 0 1 1.06 0Z"
          fill="currentColor"
        />
      </svg>
      <svg
        v-else
        class="copy-button__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M12 4.75a7.25 7.25 0 1 0 7.25 7.25A7.258 7.258 0 0 0 12 4.75Zm0 1.5A5.75 5.75 0 1 1 6.25 12 5.756 5.756 0 0 1 12 6.25Zm0 2.5a.75.75 0 0 1 .75.75v1.75h1.75a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75v-2.5A.75.75 0 0 1 12 8.75Z"
          fill="currentColor"
        />
      </svg>
      <span class="sr-only" aria-live="polite">
        <template v-if="status === 'idle'">{{
          idleLabel ?? 'Copy link'
        }}</template>
        <template v-else-if="status === 'success'">Copied</template>
        <template v-else>Copy failed</template>
      </span>
    </template>
    <template v-else>
      <span v-if="status === 'idle'">{{ idleLabel ?? 'Copy' }}</span>
      <span v-else-if="status === 'success'">Copied</span>
      <span v-else>Copy failed</span>
    </template>
  </button>
</template>

<style scoped>
.copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.875rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  background: var(--color-panel-muted);
  color: var(--color-text);
  white-space: nowrap;
  font-weight: 500;
  line-height: 1.2;
  transition: none;
}

.copy-button--icon-only {
  width: 2.875rem;
  min-width: 2.875rem;
  padding: 0;
}

.copy-button:not(.copy-button--icon-only):hover {
  background: color-mix(
    in srgb,
    var(--color-panel-muted) 96%,
    var(--color-text)
  );
}

.copy-button__icon {
  width: 1.1rem;
  height: 1.1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
