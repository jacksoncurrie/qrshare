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
  --status-color: var(--color-text);
  margin: 0;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  border-left-width: 3px;
  border-left-color: var(--status-color);
  font-size: 0.95rem;
  line-height: 1.4;
  background: var(--color-panel-muted);
  color: var(--status-color);
}

.status--info {
  --status-color: var(--color-text);
}

.status--success {
  --status-color: var(--color-success);
}

.status--warning {
  --status-color: var(--color-warning);
}

.status--error {
  --status-color: var(--color-error);
}
</style>
