// 项目信息接口
export interface Project {
  id: number
  serviceName: string
  serverIp: string
  servicePort: number
  serviceNotes: string
  serviceRuntime: number // 运行时间（秒）
  serviceDescription: string
  lastRestartTime: string // ISO 8601 格式
  createdAt: string
  updatedAt: string
}

// API 响应格式
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}