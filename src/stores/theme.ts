import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const isDark = ref(false)
  
  // 初始化主题
  const initTheme = () => {
    // 从本地存储读取主题设置
    const savedTheme = localStorage.getItem('theme')
    
    // 如果有保存的主题设置，使用它
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 否则检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    
    // 应用主题
    applyTheme()
  }
  
  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    
    // 保存到本地存储
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    
    // 应用主题
    applyTheme()
  }
  
  // 应用主题到 HTML 元素
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }
  
  return {
    isDark,
    initTheme,
    toggleTheme
  }
})