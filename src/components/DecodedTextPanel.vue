<script setup lang="ts">
import CopyButton from '@/components/CopyButton.vue'

defineProps<{
  text: string
  title?: string
  showClear?: boolean
}>()

const emit = defineEmits<{
  clear: []
}>()
</script>

<template>
  <section class="panel">
    <div
      class="panel__header"
      :class="{ 'panel__header--actions-only': !title }"
    >
      <h2 v-if="title">{{ title }}</h2>
      <div class="button-group">
        <CopyButton :text="text" idle-label="Copy text" />
        <button
          v-if="showClear !== false"
          class="button button--secondary"
          type="button"
          @click="emit('clear')"
        >
          Clear
        </button>
      </div>
    </div>

    <textarea
      class="decoded-text"
      :value="text"
      readonly
      aria-label="Decoded text"
    />
  </section>
</template>

<style scoped>
.panel__header {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
}

.panel__header--actions-only {
  justify-content: flex-end;
}

.panel__header h2 {
  margin: 0;
}

.decoded-text {
  width: 100%;
  min-height: 13rem;
  margin-top: var(--space-4);
  resize: vertical;
  font-size: 1rem;
  line-height: 1.55;
}
</style>
