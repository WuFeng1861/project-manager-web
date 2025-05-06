<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 transition-colors duration-200">
    <div class="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div class="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{{ t('footer.copyright', { year: currentYear }) }}</p>
      </div>
    </div>
  </footer>
</template>