<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import type { Project } from '../../types/project'

const { t } = useI18n()

// 接收属性
const props = defineProps<{
  projects: Project[]
  isLoading: boolean
  showFullIp: boolean
}>()

// 定义事件
const emit = defineEmits<{
  restart: [project: Project]
}>()

// 点击重启按钮
const handleRestart = (project: Project) => {
  emit('restart', project)
}

// 格式化时间
const formatTime = (timestamp: string) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化运行时间
const formatRuntime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  let result = ''
  if (days > 0) result += t('time.days', { days })
  if (hours > 0) result += t('time.hours', { hours })
  if (minutes > 0) result += t('time.minutes', { minutes })
  if (!result) result = t('time.justStarted')
  
  return result
}

// 计算运行时长类别 (短/中/长)
const getRuntimeClass = (seconds: number) => {
  if (seconds < 3600) return 'text-warning-500' // 小于1小时
  if (seconds < 86400) return 'text-success-500' // 小于1天
  return 'text-primary-500' // 大于1天
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <!-- 表头 -->
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.serviceName') }}
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.serverIp') }}
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.port') }}
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.runtime') }}
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.lastRestart') }}
          </th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            {{ t('project.actions') }}
          </th>
        </tr>
      </thead>
      
      <!-- 表格主体 -->
      <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        <!-- 加载中状态 -->
        <tr v-if="isLoading">
          <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
            <div class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('state.loading') }}
            </div>
          </td>
        </tr>
        
        <!-- 空状态 -->
        <tr v-else-if="projects.length === 0">
          <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
            {{ t('project.noData') }}
          </td>
        </tr>
        
        <!-- 项目列表项 -->
        <tr 
          v-for="project in projects" 
          :key="project.id"
          class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <!-- 服务名称 -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ project.serviceName }}
              </div>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ project.serviceDescription }}
            </div>
          </td>
          
          <!-- 服务器IP -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">
              {{ project.serverIp }}
            </div>
          </td>
          
          <!-- 端口 -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900 dark:text-white">
              {{ project.servicePort }}
            </div>
          </td>
          
          <!-- 运行时间 -->
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm" :class="getRuntimeClass(project.serviceRuntime)">
              {{ formatRuntime(project.serviceRuntime) }}
            </div>
          </td>
          
          <!-- 最后重启时间 -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {{ formatTime(project.lastRestartTime) }}
          </td>
          
          <!-- 操作 -->
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button 
              @click="handleRestart(project)" 
              class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-150"
            >
              {{ t('action.restart') }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>