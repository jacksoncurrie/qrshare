<script setup lang="ts">
import { APP_REPO_URL } from '@/lib/constants'
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p>
        QR Share stores nothing on a server. Anyone with the link or QR can read
        the text.
      </p>
      <a :href="APP_REPO_URL" target="_blank" rel="noreferrer">GitHub</a>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background: color-mix(in srgb, var(--color-surface) 92%, white);
}

.footer__inner {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  justify-content: space-between;
  color: var(--color-muted);
  font-size: 0.9375rem;
}

.footer__inner p {
  margin: 0;
}
</style>
