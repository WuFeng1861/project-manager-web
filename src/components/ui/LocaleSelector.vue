<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '../../stores/locale'

const { t } = useI18n()
const localeStore = useLocaleStore()
const isOpen = ref(false)

// 定义支持的语言
const locales = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' }
]

// 处理切换语言
const changeLocale = (localeCode: string) => {
  localeStore.setLocale(localeCode)
  isOpen.value = false
}

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false
}
</script>

<template>
  <div class="relative inline-block text-left">
    <button
        @click="toggleDropdown"
        class="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <!-- 当前语言 -->
      <span>{{ locales.find(l => l.code === localeStore.locale)?.name }}</span>
      <!-- 下拉箭头 -->
      <svg
          class="ml-2 h-4 w-4"
          :class="{ 'transform rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <div
        v-show="isOpen"
        @click="closeDropdown"
        class="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
    >
      <div class="py-1" role="menu">
        <button
            v-for="locale in locales"
            :key="locale.code"
            @click="changeLocale(locale.code)"
            class="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
            :class="locale.code === localeStore.locale
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            role="menuitem"
        >
          {{ locale.name }}
        </button>
      </div>
    </div>
  </div>
</template>
