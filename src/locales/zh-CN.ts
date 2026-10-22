export default {
  app: {
    title: '项目管理系统'
  },
  nav: {
    openMenu: '打开菜单',
    home: '首页',
    admin: '管理'
  },
  route: {
    home: '首页',
    admin: '管理',
    notFound: '页面未找到'
  },
  footer: {
    copyright: '© {year} 项目管理系统. 保留所有权利.'
  },
  theme: {
    toggleLight: '切换到亮色模式',
    toggleDark: '切换到暗色模式'
  },
  project: {
    title: '项目列表',
    serviceName: '服务名称',
    serverIp: '服务器IP',
    sourceIp: '来源IP',
    ipCount: '累计 {count} 个IP',
    port: '端口',
    runtime: '运行时间',
    lastRestart: '最后重启',
    actions: '操作',
    noData: '暂无项目数据',
    restartSuccess: '服务 {name} 已成功重启',
    clearIpSuccess: '已清空 {name} 的 IP 记录',
    deleteSuccess: '成功删除 {count} 个项目'
  },
  action: {
    refresh: '刷新',
    showIp: '显示完整IP',
    hideIp: '隐藏完整IP',
    restart: '重启',
    clearIpHistory: '清空IP记录',
    confirm: '确认',
    cancel: '取消',
    delete: '删除',
    select: '选择',
    selected: '已选择'
  },
  modal: {
    adminPassword: '管理员密码',
    restartProject: '重启项目',
    deleteProjects: '删除项目',
    restartConfirm: '确定要重启服务 {name} 吗？',
    deleteConfirm: '确定要删除选中的项目吗？此操作无法撤销。',
    clearIpHistory: '清空 IP 记录',
    clearIpConfirm: '确定要清空服务 {name} 的累计 IP 记录吗？',
    enterPassword: '请输入管理员密码以查看完整IP地址',
    password: '密码',
    passwordPlaceholder: '请输入管理员密码'
  },
  time: {
    days: '{days}天',
    hours: '{hours}小时',
    minutes: '{minutes}分钟',
    justStarted: '刚刚启动'
  },
  state: {
    loading: '加载中...'
  },
  error: {
    fetchFailed: '获取项目列表失败',
    restartFailed: '重启项目失败',
    deleteFailed: '删除项目失败',
    clearIpFailed: '清空 IP 记录失败'
  },
  notFound: {
    title: '页面未找到',
    message: '您访问的页面不存在或已被移除',
    returnHome: '返回首页'
  },
  admin: {
    title: 'IP 黑名单管理',
    description: '查看并解除被请求限流系统封禁的 IP 地址。',
    loginHint: '请输入管理员密码以进入管理界面',
    passwordPlaceholder: '请输入管理员密码',
    passwordRequired: '请输入管理员密码',
    enter: '进入管理',
    logout: '退出管理',
    ip: 'IP 地址',
    reason: '封禁原因',
    blockedAt: '封禁时间',
    blockedUntil: '解封时间',
    remaining: '剩余时间',
    actions: '操作',
    unblock: '解除',
    unblockConfirmTitle: '解除黑名单',
    unblockConfirm: '确定要解除 {ip} 的黑名单吗？',
    unblockSuccess: '已解除 {ip} 的黑名单',
    expired: '已过期',
    lessThanMinute: '不足1分钟',
    noData: '当前没有处于黑名单中的 IP',
    authFailed: '管理员密码错误',
    loadFailed: '获取黑名单失败',
    unblockFailed: '解除黑名单失败'
  }
}