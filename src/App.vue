<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
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

const route = useRoute()
const theme = ref<Theme>(getInitialTheme())
const followsSystem = ref(!hasStoredThemePreference())
const showShell = computed(() => route.meta.fullscreen !== true)

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
  <div class="app-shell" :class="{ 'app-shell--fullscreen': !showShell }">
    <AppHeader v-if="showShell" :theme="theme" @toggle-theme="toggleTheme" />
    <main class="app-main" :class="{ 'app-main--fullscreen': !showShell }">
      <RouterView />
    </main>
    <AppFooter v-if="showShell" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-shell--fullscreen {
  display: block;
}

.app-main {
  width: min(100%, var(--content-max-width));
  margin: 0 auto;
  padding: var(--space-5) var(--space-4) var(--space-8);
}

.app-main--fullscreen {
  width: 100%;
  max-width: none;
  padding: 0;
}
</style>
