<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { getBlockedIps, unblockIp } from '../services/projectService'
import type { BlockedIp } from '../types/admin'

const { t } = useI18n()

// 状态
const adminPassword = ref('')
const authenticated = ref(false)
const isLoading = ref(false)
const isUnblocking = ref(false)
const error = ref('')
const successMessage = ref('')
const blockedIps = ref<BlockedIp[]>([])
const pendingUnblock = ref<BlockedIp | null>(null)

// 用于刷新剩余时间
const now = ref(Date.now())
const timer = setInterval(() => {
  now.value = Date.now()
}, 30 * 1000)
onUnmounted(() => clearInterval(timer))

const isAuthError = (code: number) => code === 401

// 验证密码并加载黑名单
const handleLogin = async () => {
  if (!adminPassword.value) {
    error.value = t('admin.passwordRequired')
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const response = await getBlockedIps(adminPassword.value)
    if (response.success) {
      blockedIps.value = response.data
      authenticated.value = true
    } else {
      error.value = isAuthError(response.code) ? t('admin.authFailed') : (response.message || t('admin.loadFailed'))
    }
  } catch (err) {
    console.error('获取黑名单失败:', err)
    error.value = t('admin.loadFailed')
  } finally {
    isLoading.value = false
  }
}

// 刷新黑名单
const refresh = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const response = await getBlockedIps(adminPassword.value)
    if (response.success) {
      blockedIps.value = response.data
    } else {
      error.value = isAuthError(response.code) ? t('admin.authFailed') : (response.message || t('admin.loadFailed'))
      if (isAuthError(response.code)) {
        authenticated.value = false
      }
    }
  } catch (err) {
    console.error('获取黑名单失败:', err)
    error.value = t('admin.loadFailed')
  } finally {
    isLoading.value = false
  }
}

// 退出管理
const logout = () => {
  authenticated.value = false
  adminPassword.value = ''
  blockedIps.value = []
  error.value = ''
  successMessage.value = ''
}

// 确认解除黑名单
const confirmUnblock = async () => {
  if (!pendingUnblock.value) return

  const ip = pendingUnblock.value.ip
  isUnblocking.value = true
  error.value = ''

  try {
    const response = await unblockIp(ip, adminPassword.value)
    if (response.success) {
      blockedIps.value = blockedIps.value.filter(item => item.ip !== ip)
      successMessage.value = t('admin.unblockSuccess', { ip })
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
    } else {
      error.value = isAuthError(response.code) ? t('admin.authFailed') : (response.message || t('admin.unblockFailed'))
      if (isAuthError(response.code)) {
        authenticated.value = false
      }
    }
  } catch (err) {
    console.error('解除黑名单失败:', err)
    error.value = t('admin.unblockFailed')
  } finally {
    isUnblocking.value = false
    pendingUnblock.value = null
  }
}

// 格式化时间
const formatTime = (timestamp: string) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

// 计算剩余封禁时间
const formatRemaining = (blockedUntil: string) => {
  const diff = dayjs(blockedUntil).valueOf() - now.value
  if (diff <= 0) return t('admin.expired')

  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)

  let result = ''
  if (days > 0) result += t('time.days', { days })
  if (hours > 0) result += t('time.hours', { hours })
  if (days === 0 && minutes > 0) result += t('time.minutes', { minutes })

  return result || t('admin.lessThanMinute')
}

const isExpired = (blockedUntil: string) => {
  return dayjs(blockedUntil).valueOf() <= now.value
}
</script>

<template>
  <div>
    <!-- 管理员密码验证 -->
    <div v-if="!authenticated" class="card max-w-md mx-auto p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('admin.title') }}
      </h1>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ t('admin.loginHint') }}
      </p>

      <form class="mt-5" @submit.prevent="handleLogin">
        <label for="admin-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('modal.password') }}
        </label>
        <input
          id="admin-password"
          v-model="adminPassword"
          type="password"
          autocomplete="current-password"
          class="input mt-1 block w-full"
          :placeholder="t('admin.passwordPlaceholder')"
        />
        <button
          type="submit"
          class="btn-primary w-full mt-4"
          :disabled="isLoading"
        >
          {{ isLoading ? t('state.loading') : t('admin.enter') }}
        </button>
      </form>

      <div v-if="error" class="mt-4 bg-error-50 border-l-4 border-error-500 p-3 text-sm text-error-700">
        {{ error }}
      </div>
    </div>

    <!-- 黑名单管理 -->
    <div v-else>
      <div class="mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ t('admin.title') }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ t('admin.description') }}
          </p>
        </div>

        <div class="flex space-x-2">
          <button class="btn-secondary" :disabled="isLoading" @click="refresh">
            <span v-if="isLoading" class="inline-block animate-spin-slow mr-2">⟳</span>
            {{ t('action.refresh') }}
          </button>
          <button class="btn-secondary" @click="logout">
            {{ t('admin.logout') }}
          </button>
        </div>
      </div>

      <!-- 操作提示 -->
      <div v-if="successMessage" class="mb-4 bg-success-50 border-l-4 border-success-500 p-4 text-success-700">
        <p>{{ successMessage }}</p>
      </div>
      <div v-if="error" class="mb-4 bg-error-50 border-l-4 border-error-500 p-4 text-error-700">
        <p>{{ error }}</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.ip') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.reason') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.blockedAt') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.blockedUntil') }}
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.remaining') }}
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ t('admin.actions') }}
              </th>
            </tr>
            </thead>

            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
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

            <tr v-else-if="blockedIps.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-gray-500 dark:text-gray-400">
                {{ t('admin.noData') }}
              </td>
            </tr>

            <tr v-for="item in blockedIps" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white font-mono">
                {{ item.ip }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs break-words">
                {{ item.reason || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(item.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatTime(item.blockedUntil) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="isExpired(item.blockedUntil) ? 'text-success-500' : 'text-error-600 dark:text-error-400'">
                  {{ formatRemaining(item.blockedUntil) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-150"
                  @click="pendingUnblock = item"
                >
                  {{ t('admin.unblock') }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 解除封禁确认弹窗 -->
    <div v-if="pendingUnblock" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-300" @click="pendingUnblock = null"></div>

      <div class="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div class="relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {{ t('admin.unblockConfirmTitle') }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {{ t('admin.unblockConfirm', { ip: pendingUnblock.ip }) }}
            </p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="btn-primary w-full sm:w-auto sm:ml-3"
              :disabled="isUnblocking"
              @click="confirmUnblock"
            >
              {{ isUnblocking ? t('state.loading') : t('admin.unblock') }}
            </button>
            <button
              type="button"
              class="mt-3 sm:mt-0 btn-secondary w-full sm:w-auto"
              @click="pendingUnblock = null"
            >
              {{ t('action.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
