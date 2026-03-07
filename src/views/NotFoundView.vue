<template>
  <section class="panel stack-md">
    <p class="eyebrow">Not found</p>
    <h1>This page does not exist.</h1>
    <p class="lede">
      QR Share only uses a small set of routes. Return to create to generate a
      new QR payload.
    </p>
    <RouterLink class="button" to="/create">Back to create</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.lede {
  color: var(--color-muted);
}
</style>
