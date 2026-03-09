<script setup lang="ts">
defineProps<{
  tone: 'info' | 'success' | 'warning' | 'error'
}>()
</script>

<template>
  <p class="status" :class="[`status--${tone}`]" aria-live="polite">
    <slot />
  </p>
</template>

<style scoped>
.status {
  margin: 0;
  padding: 0.9rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  font-size: 0.95rem;
  line-height: 1.4;
  background: var(--color-panel-muted);
}

.status--info {
  color: color-mix(in srgb, var(--color-text) 85%, #2a7fff);
}

.status--success {
  color: var(--color-success);
}

.status--warning {
  color: var(--color-warning);
}

.status--error {
  color: var(--color-error);
}
</style>
