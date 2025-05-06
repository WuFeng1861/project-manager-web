import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLocaleStore = defineStore('locale', () => {
  // 获取 i18n 实例
  const i18n = useI18n()
  
  // 状态
  const locale = ref(i18n.locale.value)
  
  // 初始化语言
  const initLocale = () => {
    // 从本地存储读取语言设置
    const savedLocale = localStorage.getItem('locale')
    
    // 如果有保存的语言设置，使用它
    if (savedLocale) {
      setLocale(savedLocale)
    } else {
      // 否则使用默认语言（中文）
      setLocale('zh-CN')
    }
  }
  
  // 设置语言
  const setLocale = (newLocale: string) => {
    // 更新状态
    locale.value = newLocale
    
    // 更新 i18n 语言
    i18n.locale.value = newLocale
    
    // 保存到本地存储
    localStorage.setItem('locale', newLocale)
    
    // 更新 HTML lang 属性
    document.documentElement.setAttribute('lang', newLocale.split('-')[0])
    
    // 更新页面标题
    if (i18n.t) {
      document.title = i18n.t('app.title')
    }
  }
  
  return {
    locale,
    initLocale,
    setLocale
  }
})