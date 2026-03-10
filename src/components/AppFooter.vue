<script setup lang="ts">
import { computed } from 'vue'
import githubIconUrl from '@/assets/icons/github.svg'
import themeDarkIconUrl from '@/assets/icons/theme-dark.svg'
import themeLightIconUrl from '@/assets/icons/theme-light.svg'
import { APP_AUTHOR_NAME, APP_AUTHOR_URL, APP_REPO_URL } from '@/lib/constants'
import type { Theme } from '@/lib/theme'

const props = defineProps<{
  theme: Theme
}>()

defineEmits<{
  'toggle-theme': []
}>()

const iconFilter = computed(() =>
  props.theme === 'dark'
    ? 'brightness(0) saturate(100%) invert(1)'
    : 'brightness(0) saturate(100%)',
)
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__meta">
        Built by
        <a :href="APP_AUTHOR_URL" target="_blank" rel="noreferrer">{{
          APP_AUTHOR_NAME
        }}</a>
      </p>
      <div class="footer__actions">
        <a
          class="footer__icon-link"
          :href="APP_REPO_URL"
          target="_blank"
          rel="noreferrer"
          aria-label="View source on GitHub"
        >
          <img
            class="footer__icon"
            :src="githubIconUrl"
            :style="{ filter: iconFilter }"
            alt=""
            aria-hidden="true"
          />
        </a>
        <button
          class="footer__icon-link footer__icon-link--button"
          type="button"
          :aria-label="
            props.theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          "
          @click="$emit('toggle-theme')"
        >
          <img
            class="footer__icon"
            :src="props.theme === 'dark' ? themeLightIconUrl : themeDarkIconUrl"
            :style="{ filter: iconFilter }"
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 0 var(--space-4) var(--space-4);
}

.footer__inner {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding-top: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  color: var(--color-muted);
  font-size: 0.9rem;
  border-top: 1px solid var(--color-border);
}

.footer__meta {
  margin: 0;
}

.footer__meta a,
.footer__link {
  color: var(--color-text);
  text-decoration: none;
}

.footer__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}

.footer__icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  border: 0;
  color: var(--color-text);
  background: transparent;
  min-height: 0;
  font: inherit;
  text-decoration: none;
}

.footer__icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}
</style>
