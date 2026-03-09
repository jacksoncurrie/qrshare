<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { APP_NAME, APP_REPO_URL, ROUTES } from '@/lib/constants'
import type { Theme } from '@/lib/theme'

const props = defineProps<{
  theme: Theme
}>()

defineEmits<{
  'toggle-theme': []
}>()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <RouterLink class="header__brand" :to="ROUTES.create">{{
        APP_NAME
      }}</RouterLink>

      <div class="header__actions">
        <RouterLink class="header__scan-link" :to="ROUTES.scan">
          <svg class="header__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M5.75 3.75a2 2 0 0 0-2 2v2a.75.75 0 0 0 1.5 0v-2a.5.5 0 0 1 .5-.5h2a.75.75 0 0 0 0-1.5h-2Zm10.5 0a.75.75 0 0 0 0 1.5h2a.5.5 0 0 1 .5.5v2a.75.75 0 0 0 1.5 0v-2a2 2 0 0 0-2-2h-2Zm-10.5 14.5a.5.5 0 0 1-.5-.5v-2a.75.75 0 0 0-1.5 0v2a2 2 0 0 0 2 2h2a.75.75 0 0 0 0-1.5h-2Zm14.5-2.5a.75.75 0 0 0-1.5 0v2a.5.5 0 0 1-.5.5h-2a.75.75 0 0 0 0 1.5h2a2 2 0 0 0 2-2v-2ZM7.75 8.75a1 1 0 0 0-1 1v4.5a1 1 0 0 0 1 1h8.5a1 1 0 0 0 1-1v-4.5a1 1 0 0 0-1-1h-8.5Zm.5 1.5h7.5v3.5h-7.5v-3.5Zm1.5.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5Zm3 0a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"
              fill="currentColor"
            />
          </svg>
          <span>Scan</span>
        </RouterLink>

        <a
          class="header__icon-button"
          :href="APP_REPO_URL"
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
        >
          <svg class="header__icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2.75a9.25 9.25 0 0 0-2.924 18.026c.462.086.612-.196.612-.437v-1.7c-2.49.542-3.015-1.056-3.015-1.056-.408-1.036-.997-1.311-.997-1.311-.815-.557.062-.546.062-.546.902.063 1.376.926 1.376.926.801 1.373 2.102.976 2.615.746.081-.58.313-.976.57-1.2-1.988-.226-4.079-.994-4.079-4.424 0-.977.35-1.777.925-2.403-.093-.226-.4-1.137.088-2.37 0 0 .755-.241 2.475.917A8.57 8.57 0 0 1 12 7.28a8.57 8.57 0 0 1 2.254.303c1.72-1.158 2.474-.917 2.474-.917.489 1.233.182 2.144.09 2.37.576.626.924 1.426.924 2.403 0 3.438-2.095 4.195-4.09 4.417.322.278.609.828.609 1.668v2.472c0 .243.148.527.617.437A9.25 9.25 0 0 0 12 2.75Z"
              fill="currentColor"
            />
          </svg>
        </a>

        <button
          class="header__icon-button"
          type="button"
          :aria-label="
            props.theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          "
          @click="$emit('toggle-theme')"
        >
          <svg
            v-if="props.theme === 'dark'"
            class="header__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M12 4.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a.75.75 0 0 1 .75-.75Zm0 11.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V17a.75.75 0 0 1 .75-.75Zm7.25-5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5Zm-13 0a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1 0-1.5h1.5Zm8.662-4.412a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 1 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Zm-7.864 7.864a.75.75 0 0 1 1.06 0l1.061 1.061a.75.75 0 0 1-1.06 1.06l-1.061-1.06a.75.75 0 0 1 0-1.061Zm8.924 1.06a.75.75 0 0 1 1.06-1.06l1.061 1.06a.75.75 0 1 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061Zm-7.864-7.863a.75.75 0 0 1 0 1.06L7.048 10.02a.75.75 0 1 1-1.06-1.061l1.06-1.06a.75.75 0 0 1 1.06 0ZM12 8.25A3.75 3.75 0 1 1 8.25 12 3.754 3.754 0 0 1 12 8.25Zm0 1.5A2.25 2.25 0 1 0 14.25 12 2.253 2.253 0 0 0 12 9.75Z"
              fill="currentColor"
            />
          </svg>
          <svg
            v-else
            class="header__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M14.996 3.75a.75.75 0 0 1 .648 1.127 7.25 7.25 0 1 0 3.478 9.27.75.75 0 0 1 1.405.523A8.75 8.75 0 1 1 14.35 3.924a.748.748 0 0 1 .646-.174Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: var(--space-4) var(--space-4) 0;
}

.header__inner {
  width: min(100%, 56rem);
  margin: 0 auto;
  padding: 0.85rem 0.95rem;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius-lg) + 0.15rem);
  background: color-mix(in srgb, var(--color-surface-strong) 88%, transparent);
  box-shadow: var(--shadow-card);
  backdrop-filter: blur(18px) saturate(1.1);
}

.header__brand {
  font-size: 1.05rem;
  font-weight: 650;
  color: var(--color-text);
  text-decoration: none;
  letter-spacing: -0.03em;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.header__icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.7rem;
  height: 2.7rem;
  padding: 0;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-panel-muted);
  text-decoration: none;
}

.header__scan-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.7rem;
  padding: 0 1rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  color: var(--color-primary-contrast);
  background: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.header__icon {
  width: 1.1rem;
  height: 1.1rem;
}

@media (max-width: 640px) {
  .header__inner {
    width: 100%;
  }

  .header__brand {
    font-size: 0.98rem;
  }
}
</style>
