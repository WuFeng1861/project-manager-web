<script setup lang="ts">
import TheHeader from '../components/layout/TheHeader.vue'
import TheFooter from '../components/layout/TheFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <TheHeader />
    
    <main class="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
    
    <TheFooter />
  </div>
</template>