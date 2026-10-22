export default {
  app: {
    title: 'Project Management System'
  },
  nav: {
    openMenu: 'Open menu',
    home: 'Home',
    admin: 'Admin'
  },
  route: {
    home: 'Home',
    admin: 'Admin',
    notFound: 'Page Not Found'
  },
  footer: {
    copyright: '© {year} Project Management System. All rights reserved.'
  },
  theme: {
    toggleLight: 'Switch to light mode',
    toggleDark: 'Switch to dark mode'
  },
  project: {
    title: 'Project List',
    serviceName: 'Service Name',
    serverIp: 'Server IP',
    sourceIp: 'Source IP',
    ipCount: '{count} IP(s) recorded',
    port: 'Port',
    runtime: 'Running Time',
    lastRestart: 'Last Restart',
    actions: 'Actions',
    noData: 'No project data available',
    restartSuccess: 'Service {name} has been restarted successfully',
    clearIpSuccess: 'IP records of {name} have been cleared',
    deleteSuccess: '{count} project(s) deleted successfully'
  },
  action: {
    refresh: 'Refresh',
    showIp: 'Show Full IP',
    hideIp: 'Hide Full IP',
    restart: 'Restart',
    clearIpHistory: 'Clear IP Records',
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    select: 'Select',
    selected: 'Selected'
  },
  modal: {
    adminPassword: 'Admin Password',
    restartProject: 'Restart Project',
    deleteProjects: 'Delete Projects',
    restartConfirm: 'Are you sure you want to restart service {name}?',
    deleteConfirm: 'Are you sure you want to delete the selected projects? This action cannot be undone.',
    clearIpHistory: 'Clear IP Records',
    clearIpConfirm: 'Are you sure you want to clear the recorded IPs of service {name}?',
    enterPassword: 'Please enter admin password to view full IP addresses',
    password: 'Password',
    passwordPlaceholder: 'Enter admin password'
  },
  time: {
    days: '{days}d ',
    hours: '{hours}h ',
    minutes: '{minutes}m',
    justStarted: 'Just started'
  },
  state: {
    loading: 'Loading...'
  },
  error: {
    fetchFailed: 'Failed to fetch project list',
    restartFailed: 'Failed to restart project',
    deleteFailed: 'Failed to delete projects',
    clearIpFailed: 'Failed to clear IP records'
  },
  notFound: {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist or has been removed',
    returnHome: 'Return to Home'
  },
  admin: {
    title: 'IP Blacklist Management',
    description: 'View and unblock IPs blocked by the rate limiting system.',
    loginHint: 'Enter the admin password to access the management page',
    passwordPlaceholder: 'Enter admin password',
    passwordRequired: 'Please enter the admin password',
    enter: 'Enter',
    logout: 'Sign Out',
    ip: 'IP Address',
    reason: 'Block Reason',
    blockedAt: 'Blocked At',
    blockedUntil: 'Blocked Until',
    remaining: 'Remaining',
    actions: 'Actions',
    unblock: 'Unblock',
    unblockConfirmTitle: 'Unblock IP',
    unblockConfirm: 'Are you sure you want to unblock {ip}?',
    unblockSuccess: 'IP {ip} has been unblocked',
    expired: 'Expired',
    lessThanMinute: 'Less than 1 minute',
    noData: 'No IP is currently blocked',
    authFailed: 'Invalid admin password',
    loadFailed: 'Failed to fetch the blacklist',
    unblockFailed: 'Failed to unblock the IP'
  }
}