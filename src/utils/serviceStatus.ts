import dayjs from 'dayjs'

/**
 * 检查服务是否离线
 * @param lastRestartTime 最后重启时间
 * @param runtime 运行时间(秒)
 * @returns 如果服务离线返回true，否则返回false
 */
export const checkServiceStatus = (lastRestartTime: string, runtime: number): boolean => {
  const lastActiveTime = dayjs(lastRestartTime).add(runtime, 'second')
  const now = dayjs()
  const diffMinutes = now.diff(lastActiveTime, 'minute')
  
  return diffMinutes > 10
}
