<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Project } from '../../types/project'

const { t } = useI18n()

// 接收属性
const props = defineProps<{
  modelValue: string
  project: Project | null
}>()

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: string]
  close: []
  submit: []
}>()

// 密码输入框引用
const passwordInput = ref<HTMLInputElement | null>(null)

// 本地密码
const password = ref(props.modelValue)

// 更新密码
const updatePassword = (value: string) => {
  password.value = value
  emit('update:modelValue', value)
}

// 提交密码
const handleSubmit = () => {
  emit('submit')
}

// 关闭模态框
const handleClose = () => {
  emit('close')
}

// 聚焦密码输入框
onMounted(async () => {
  await nextTick()
  if (passwordInput.value) {
    passwordInput.value.focus()
  }
})
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- 背景遮罩 -->
    <div 
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300"
      @click="handleClose"
    ></div>
    
    <!-- 模态框内容 -->
    <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
      <div 
        class="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
      >
        <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <!-- 锁图标 -->
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 sm:mx-0 sm:h-10 sm:w-10">
              <svg 
                class="h-6 w-6 text-primary-600 dark:text-primary-400" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            
            <!-- 模态框内容 -->
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 
                id="modal-title" 
                class="text-lg leading-6 font-medium text-gray-900 dark:text-white"
              >
                {{ props.project ? t('modal.restartProject') : t('modal.adminPassword') }}
              </h3>
              
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ props.project 
                    ? t('modal.restartConfirm', { name: props.project.serviceName }) 
                    : t('modal.enterPassword') 
                  }}
                </p>
                
                <!-- 密码输入框 -->
                <div class="mt-4">
                  <label for="admin-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ t('modal.password') }}
                  </label>
                  <input
                    ref="passwordInput"
                    id="admin-password"
                    type="password"
                    v-model="password"
                    @input="updatePassword($event.target.value)"
                    @keyup.enter="handleSubmit"
                    class="input mt-1 block w-full"
                    :placeholder="t('modal.passwordPlaceholder')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="handleSubmit"
            class="btn-primary w-full sm:w-auto sm:ml-3"
          >
            {{ props.project ? t('action.restart') : t('action.confirm') }}
          </button>
          <button 
            type="button" 
            @click="handleClose"
            class="mt-3 sm:mt-0 btn-secondary w-full sm:w-auto"
          >
            {{ t('action.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>