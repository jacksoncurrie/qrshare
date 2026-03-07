<script setup lang="ts">
defineProps<{
  tone?: 'default' | 'warning'
}>()
</script>

<template>
  <p class="field-hint" :class="[`field-hint--${tone ?? 'default'}`]">
    <slot />
  </p>
</template>

<style scoped>
.field-hint {
  margin: 0;
  font-size: 0.9375rem;
}

.field-hint--default {
  color: var(--color-muted);
}

.field-hint--warning {
  color: var(--color-warning-text);
}
</style>
