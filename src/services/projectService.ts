import axios from 'axios'
import type {ApiResponse, Project} from '../types/project';
import type {BlockedIp} from '../types/admin';

const API_BASE_URL = 'https://wufeng98.cn/projectManagerApi'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取所有项目信息
export const getAllProjects = async (adminPassword?: string): Promise<ApiResponse<Project[]>> => {
  try {
    // 构建请求配置
    const config = {} as any
    
    // 如果提供了管理员密码，添加到请求中
    if (adminPassword) {
      config.params = { adminPassword }
    }
    
    // 发送请求
    const response = await apiClient.get('/projects', config)
    return response.data
  } catch (error) {
    // 处理错误
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 服务器响应了错误状态码
        return error.response.data as ApiResponse<Project[]>
      }
    }
    
    // 其他错误（网络错误等）
    return {
      code: 500,
      data: [],
      message: '获取项目列表失败',
      success: false
    }
  }
}

// 重启项目服务
export const restartProject = async (serviceName: string, adminPassword: string): Promise<ApiResponse<any>> => {
  try {
    // 发送请求
    const response = await apiClient.post('/projects/restart',
      { serviceName },
      { headers: { 'admin-password': adminPassword } }
    )
    return response.data
  } catch (error) {
    // 处理错误
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 服务器响应了错误状态码
        return error.response.data as ApiResponse<any>
      }
    }
    
    // 其他错误（网络错误等）
    return {
      code: 500,
      data: null,
      message: '重启项目失败',
      success: false
    }
  }
}

// 清空项目累计的 IP 记录
export const clearIpHistory = async (serviceName: string, adminPassword: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.delete(`/projects/${encodeURIComponent(serviceName)}/ip-history`, {
      headers: {
        'admin-password': adminPassword
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.data as ApiResponse<any>
      }
    }

    return {
      code: 500,
      data: null,
      message: '清空 IP 记录失败',
      success: false
    }
  }
}

// 删除项目
export const deleteProjects = async (serviceNames: string[], adminPassword: string) => {
  try {
    const response = await apiClient.delete(
      `/projects`,
      {
        headers: {
          'admin-password': adminPassword
        },
        data: serviceNames
      }
    )
    return {
      success: true,
      data: response.data
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '删除项目失败'
    }
  }
}

// 获取当前生效的 IP 黑名单
export const getBlockedIps = async (adminPassword: string): Promise<ApiResponse<BlockedIp[]>> => {
  try {
    const response = await apiClient.get('/projects/blocked-ips', {
      headers: {
        'admin-password': adminPassword
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<BlockedIp[]>
    }

    return {
      code: 500,
      data: [],
      message: '获取黑名单失败',
      success: false
    }
  }
}

// 手动将 IP 加入黑名单
export const blockIp = async (
  ip: string,
  durationHours: number | undefined,
  reason: string,
  adminPassword: string
): Promise<ApiResponse<any>> => {
  const payload: { ip: string; durationHours?: number; reason?: string } = { ip }
  if (durationHours && durationHours > 0) {
    payload.durationHours = durationHours
  }
  if (reason.trim()) {
    payload.reason = reason.trim()
  }

  try {
    const response = await apiClient.post('/projects/blocked-ips', payload, {
      headers: {
        'admin-password': adminPassword
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<any>
    }

    return {
      code: 500,
      data: null,
      message: '加入黑名单失败',
      success: false
    }
  }
}

// 解除指定 IP 的黑名单
export const unblockIp = async (ip: string, adminPassword: string): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.delete(`/projects/blocked-ips/${encodeURIComponent(ip)}`, {
      headers: {
        'admin-password': adminPassword
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<any>
    }

    return {
      code: 500,
      data: null,
      message: '解除黑名单失败',
      success: false
    }
  }
}
