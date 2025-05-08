<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import ProjectList from '../components/project/ProjectList.vue'
import AdminPasswordModal from '../components/modals/AdminPasswordModal.vue'
import { getAllProjects, restartProject, deleteProjects } from '../services/projectService'
import type { Project } from '../types/project'

const { t } = useI18n()

// 状态
const projects = ref<Project[]>([])
const isLoading = ref(true)
const error = ref('')
const showAdminModal = ref(false)
const adminPassword = ref('')
const selectedProject = ref<Project | null>(null)
const showFullIp = ref(false)
const showRestartSuccess = ref(false)
const restartMessage = ref('')
const selectedMode = ref(false)

// 获取项目列表
const fetchProjects = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await getAllProjects(showFullIp.value ? adminPassword.value : '')
    if (response.success) {
      projects.value = response.data
    } else {
      error.value = response.message
    }
  } catch (err) {
    console.error('获取项目列表失败:', err)
    error.value = t('error.fetchFailed')
  } finally {
    isLoading.value = false
  }
}

// 初始加载
onMounted(() => {
  fetchProjects()
})

// 显示管理员密码输入框
const openAdminModal = (project: Project | null = null) => {
  selectedProject.value = project
  adminPassword.value = ''
  showAdminModal.value = true
}

// 关闭管理员密码输入框
const closeAdminModal = () => {
  showAdminModal.value = false
}

// 提交管理员密码
const submitAdminPassword = async () => {
  if (selectedProject.value) {
    // 重启项目
    try {
      const response = await restartProject(selectedProject.value.serviceName, adminPassword.value)
      
      if (response.success) {
        restartMessage.value = t('project.restartSuccess', { name: selectedProject.value.serviceName })
        showRestartSuccess.value = true
        setTimeout(() => {
          showRestartSuccess.value = false
        }, 3000)
        
        // 刷新项目列表
        fetchProjects()
      } else {
        error.value = response.message
      }
    } catch (err) {
      console.error('重启项目失败:', err)
      error.value = t('error.restartFailed')
    }
  } else {
    // 查看完整 IP
    showFullIp.value = true
    fetchProjects()
  }
  
  // 关闭模态框
  closeAdminModal()
}

// 切换选择模式
const toggleSelectedMode = () => {
  selectedMode.value = !selectedMode.value
  if (!selectedMode.value) {
    // 退出选择模式时清除所有选择
    projects.value.forEach(project => project.selected = false)
  }
}

// 选择项目
const handleSelect = (project: Project) => {
  project.selected = !project.selected
}

// 获取选中的项目
const selectedProjects = computed(() => {
  return projects.value.filter(project => project.selected)
})

// 删除选中的项目
const deleteSelectedProjects = () => {
  const selectedNames = selectedProjects.value.map(p => p.serviceName)
  if (selectedNames.length === 0) {
    return
  }
  openAdminModal(null, true)
}

// 执行删除操作
const executeDelete = async () => {
  const selectedNames = selectedProjects.value.map(p => p.serviceName)
  try {
    const response = await deleteProjects(selectedNames, adminPassword.value)
    if (response.success) {
      // 显示成功消息
      restartMessage.value = t('project.deleteSuccess', { count: selectedNames.length })
      showRestartSuccess.value = true
      setTimeout(() => {
        showRestartSuccess.value = false
      }, 3000)
      
      // 退出选择模式
      selectedMode.value = false
      
      // 刷新项目列表
      fetchProjects()
    } else {
      error.value = response.message
    }
  } catch (err) {
    console.error('删除项目失败:', err)
    error.value = t('error.deleteFailed')
  }
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
</script>

<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('project.title') }}
      </h1>
      
      <div class="flex space-x-2">
        <!-- 选择模式按钮 -->
        <button
          v-if="!selectedMode"
          @click="toggleSelectedMode"
          class="btn-secondary"
        >
          {{ t('action.select') }}
        </button>
        
        <!-- 删除按钮 -->
        <button
          v-if="selectedMode"
          @click="deleteSelectedProjects"
          class="btn-error"
          :disabled="selectedProjects.length === 0"
        >
          {{ t('action.delete') }} ({{ selectedProjects.length }})
        </button>
        
        <!-- 取消选择按钮 -->
        <button
          v-if="selectedMode"
          @click="toggleSelectedMode"
          class="btn-secondary"
        >
          {{ t('action.cancel') }}
        </button>
        
        <button 
          v-if="!selectedMode"
          @click="fetchProjects" 
          class="btn-secondary"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="inline-block animate-spin-slow mr-2">⟳</span>
          {{ t('action.refresh') }}
        </button>
        
        <button 
          v-if="!selectedMode"
          @click="openAdminModal()" 
          class="btn-primary"
        >
          {{ showFullIp ? t('action.hideIp') : t('action.showIp') }}
        </button>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div 
      v-if="error" 
      class="mb-4 bg-error-50 border-l-4 border-error-500 p-4 text-error-700"
    >
      <p>{{ error }}</p>
    </div>
    
    <!-- 重启成功提示 -->
    <div 
      v-if="showRestartSuccess" 
      class="mb-4 bg-success-50 border-l-4 border-success-500 p-4 text-success-700"
    >
      <p>{{ restartMessage }}</p>
    </div>
    
    <!-- 项目列表 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-200">
      <ProjectList 
        :projects="projects" 
        :is-loading="isLoading"
        :show-full-ip="showFullIp"
        :selected-mode="selectedMode"
        @restart="openAdminModal"
        @select="handleSelect"
      />
    </div>
    
    <!-- 管理员密码模态框 -->
    <AdminPasswordModal
      v-if="showAdminModal"
      v-model="adminPassword"
      :project="selectedProject"
      :is-delete="selectedMode"
      @close="closeAdminModal"
      @submit="selectedMode ? executeDelete() : submitAdminPassword()"
    />
  </div>
</template>