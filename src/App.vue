<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import {
  applyTheme,
  getInitialTheme,
  hasStoredThemePreference,
  persistTheme,
  type Theme,
  watchSystemTheme,
} from '@/lib/theme'

const theme = ref<Theme>(getInitialTheme())
const followsSystem = ref(!hasStoredThemePreference())

let stopWatchingSystemTheme = () => undefined

function setTheme(nextTheme: Theme) {
  theme.value = nextTheme
  applyTheme(nextTheme)
}

function toggleTheme() {
  followsSystem.value = false
  stopWatchingSystemTheme()
  const nextTheme = theme.value === 'light' ? 'dark' : 'light'
  setTheme(nextTheme)
  persistTheme(nextTheme)
}

onMounted(() => {
  setTheme(theme.value)

  if (followsSystem.value) {
    stopWatchingSystemTheme = watchSystemTheme((nextTheme) => {
      setTheme(nextTheme)
    })
  }
})

onBeforeUnmount(() => {
  stopWatchingSystemTheme()
})
</script>

<template>
  <div class="app-shell">
    <AppHeader :theme="theme" />
    <main class="app-main">
      <RouterView />
    </main>
    <AppFooter :theme="theme" @toggle-theme="toggleTheme" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-main {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding: var(--space-4);
}
</style>
