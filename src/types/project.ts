export interface Project {
  id: string
  serviceName: string
  serviceDescription: string
  serverIp: string
  servicePort: number
  serviceRuntime: number
  lastRestartTime: string
  selected?: boolean
}

// API 响应格式
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}
