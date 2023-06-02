// 1是开发阶段  2是线上阶段
var JD_PROJECT_STATE = 1
var JD_PROJECT_BS_CONFIG = {
  // api请求接口的根路径
  APP_BASE_API: '',
  // 用户登录的api接口路径
  APP_USER_API: '',
  // 本地开发代理api接口前缀
  API_PROXY_PREFIX: '',
}
if (JD_PROJECT_STATE === 1) {
  // 开发阶段相关配置
  JD_PROJECT_BS_CONFIG.APP_BASE_API = '/ts'
} else if (JD_PROJECT_STATE == 2) {
  // 线上阶段配置
  JD_PROJECT_BS_CONFIG.APP_BASE_API = ''
}
