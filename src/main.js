import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 配置axios默认URL为相对路径 /api，以便开发服务器代理能够拦截
axios.defaults.baseURL = '/api' 

// 请求拦截器 - 添加token到请求头
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理401错误（token过期）
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // 检查是否在登录页，避免无限循环
      if (router.currentRoute.value.name !== 'login') {
        store.dispatch('logout')
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

// 创建Vue应用实例
const app = createApp(App)

// 注册全局axios实例
app.config.globalProperties.$axios = axios

// 注册Vuex和Router
app.use(store)
app.use(router)

// 挂载应用
app.mount('#app') 