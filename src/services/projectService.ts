import axios from 'axios'
import type {ApiResponse, Project} from '../types/project';

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
