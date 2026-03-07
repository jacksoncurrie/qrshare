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
  padding: var(--space-3);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  font-size: 0.95rem;
}

.status--info {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.status--success {
  background: #ecfdf5;
  border-color: #86efac;
  color: #166534;
}

.status--warning {
  background: #fffbeb;
  border-color: #fcd34d;
  color: #92400e;
}

.status--error {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #b91c1c;
}
</style>
