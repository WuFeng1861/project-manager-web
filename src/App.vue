<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'
import { useLocaleStore } from './stores/locale'
import MainLayout from './layouts/MainLayout.vue'

// 获取主题和语言设置
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

// 初始化主题
onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  
  // 初始化语言
  localeStore.initLocale()
})

// 监听主题变化
watch(
  () => themeStore.isDark,
  (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true }
)
</script>

<template>
  <MainLayout>
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </MainLayout>
</template>