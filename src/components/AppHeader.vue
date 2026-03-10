<script setup lang="ts">
import { computed } from 'vue'
import backIconUrl from '@/assets/icons/back.svg'
import scanIconUrl from '@/assets/icons/scan.svg'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { APP_NAME, ROUTES } from '@/lib/constants'
import type { Theme } from '@/lib/theme'

const props = defineProps<{
  theme: Theme
}>()

const router = useRouter()
const route = useRoute()
const isScanRoute = computed(() => route.path === ROUTES.scan)
const isViewRoute = computed(() => route.path === ROUTES.view)
const showBackButton = computed(() => isScanRoute.value || isViewRoute.value)
const showScanLink = computed(() => route.path !== ROUTES.scan)
const iconFilter = computed(() =>
  props.theme === 'dark'
    ? 'brightness(0) saturate(100%) invert(1)'
    : 'brightness(0) saturate(100%)',
)

function goBack() {
  if (isViewRoute.value) {
    router.replace(ROUTES.create)
    return
  }

  if (window.history.length > 1) {
    router.back()
    return
  }

  router.replace(ROUTES.create)
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <button
        v-if="showBackButton"
        class="header__back"
        type="button"
        @click="goBack"
      >
        <img
          class="header__icon"
          :src="backIconUrl"
          :style="{ filter: iconFilter }"
          alt=""
          aria-hidden="true"
        />
        Back
      </button>
      <template v-else>
        <RouterLink class="header__brand" :to="ROUTES.create">
          <img class="header__brand-mark" src="/favicon.svg" :alt="APP_NAME" />
          <span class="header__brand-label">{{ APP_NAME }}</span>
        </RouterLink>
        <nav class="header__nav" aria-label="Primary">
          <RouterLink
            class="header__link"
            :class="{ 'header__link--active': route.path === ROUTES.scan }"
            :to="ROUTES.scan"
          >
            <img
              class="header__icon"
              :src="scanIconUrl"
              :style="{ filter: iconFilter }"
              alt=""
              aria-hidden="true"
            />
            Scan
          </RouterLink>
        </nav>
      </template>
      <nav
        v-if="showScanLink && showBackButton"
        class="header__nav"
        aria-label="Primary"
      >
        <RouterLink class="header__link" :to="ROUTES.scan">
          <img
            class="header__icon"
            :src="scanIconUrl"
            :style="{ filter: iconFilter }"
            alt=""
            aria-hidden="true"
          />
          Scan
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  padding: var(--space-3) var(--space-4) 0;
}

.header__inner {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  min-height: 2.25rem;
  padding: 0 0 var(--space-3);
  display: flex;
  gap: var(--space-3);
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  color: var(--color-text);
}

.header__brand-mark {
  width: 1.75rem;
  height: 1.75rem;
  display: block;
}

.header__brand-label {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.header__back {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.header__link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-height: 2.25rem;
  padding: 0;
  color: var(--color-muted);
  text-decoration: none;
  font-weight: 500;
}

.header__icon {
  width: 1rem;
  height: 1rem;
  display: block;
}

.header__link--active {
  color: var(--color-text);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .header__inner {
    width: 100%;
  }
}
</style>
