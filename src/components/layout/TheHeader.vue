<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../../stores/theme'
import { useLocaleStore } from '../../stores/locale'
import ThemeToggle from '../ui/ThemeToggle.vue'
import LocaleSelector from '../ui/LocaleSelector.vue'

const { t } = useI18n()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()
const mobileMenuOpen = ref(false)

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- 品牌和导航 -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <!-- 品牌 Logo / 名称 -->
            <h1 class="text-xl font-bold text-primary-600 dark:text-primary-400 transition-colors duration-200">
              {{ t('app.title') }}
            </h1>
          </div>
        </div>

        <!-- 控制面板按钮 - 桌面版 -->
        <div class="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
          <!-- 主题切换 -->
          <ThemeToggle class="mr-2" />
          
          <!-- 语言切换 -->
          <LocaleSelector />
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="flex items-center sm:hidden">
          <button 
            @click="toggleMobileMenu" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-expanded="false"
          >
            <span class="sr-only">{{ t('nav.openMenu') }}</span>
            <!-- 菜单图标 -->
            <svg 
              class="block h-6 w-6" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <div 
      v-show="mobileMenuOpen" 
      class="sm:hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-200"
    >
      <div class="px-2 pt-2 pb-3 space-y-1 flex flex-col items-center">
        <!-- 控制面板 -->
        <div class="flex items-center justify-center space-x-4 w-full py-3">
          <ThemeToggle />
          <LocaleSelector />
        </div>
      </div>
    </div>
  </header>
</template>