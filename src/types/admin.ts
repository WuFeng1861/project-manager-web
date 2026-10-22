// 被限流系统封禁的 IP
export interface BlockedIp {
  id: number
  ip: string
  reason?: string
  blockedUntil: string
  createdAt: string
  updatedAt: string
}
