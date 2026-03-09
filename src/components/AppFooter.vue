<script setup lang="ts">
import { APP_AUTHOR_NAME, APP_AUTHOR_URL } from '@/lib/constants'
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p>
        Built by
        <a :href="APP_AUTHOR_URL" target="_blank" rel="noreferrer">{{
          APP_AUTHOR_NAME
        }}</a>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 0 var(--space-4) var(--space-5);
}

.footer__inner {
  width: min(100%, 56rem);
  margin: 0 auto;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: center;
  color: var(--color-muted);
  font-size: 0.92rem;
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius-lg) - 0.15rem);
  background: color-mix(in srgb, var(--color-surface-strong) 72%, transparent);
}

.footer__inner p {
  margin: 0;
}

.footer__inner a {
  color: var(--color-text);
  text-decoration: none;
}
</style>
