<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen-sm flex flex-col items-center justify-center text-center px-4">
    <h1 class="text-8xl font-bold text-primary-500">404</h1>
    <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-4">
      {{ t('notFound.title') }}
    </h2>
    <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
      {{ t('notFound.message') }}
    </p>
    <button @click="goHome" class="btn-primary mt-6">
      {{ t('notFound.returnHome') }}
    </button>
  </div>
</template>