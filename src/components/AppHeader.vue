<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { APP_NAME, ROUTES } from '@/lib/constants'

const route = useRoute()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <div>
        <RouterLink class="header__brand" :to="ROUTES.create">{{
          APP_NAME
        }}</RouterLink>
        <p class="header__tagline">
          Short text handoff between nearby devices.
        </p>
      </div>

      <nav aria-label="Primary">
        <ul class="header__nav">
          <li>
            <RouterLink
              :class="{ 'is-active': route.path === ROUTES.create }"
              :to="ROUTES.create"
            >
              Create
            </RouterLink>
          </li>
          <li>
            <RouterLink
              :class="{ 'is-active': route.path === ROUTES.view }"
              :to="ROUTES.view"
            >
              View
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(12px);
  background: color-mix(in srgb, var(--color-surface) 86%, white);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.header__tagline {
  margin: var(--space-1) 0 0;
  color: var(--color-muted);
  font-size: 0.9375rem;
}

.header__nav {
  list-style: none;
  display: flex;
  gap: var(--space-2);
  padding: 0;
  margin: 0;
}

.header__nav a {
  display: inline-flex;
  align-items: center;
  min-height: 2.5rem;
  padding: 0 var(--space-3);
  border-radius: 999px;
  color: var(--color-text);
  text-decoration: none;
  border: 1px solid transparent;
}

.header__nav a.is-active {
  border-color: var(--color-border-strong);
  background: var(--color-panel);
}
</style>
