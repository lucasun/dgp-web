import axios from 'axios'
import { Toast } from 'vant'

//axios 实例
const Axios = axios.create({
  timeout: 5000,
  withCredentials: true,
  xsrfCookieName: 'xsrf-token',
  xsrfHeaderName: 'web-xsrf-token',
})

Axios.interceptors.response.use(
  res => {
    if (res.status && res.status !== 200) {
      // 需要处理几种特殊的code 安全、登录
      if (res.status === 401) {
        Toast.loading({
          message: '哎呀，出错了～401',
        })
      }
      return Promise.reject(res || 'error')
    } else {
      return Promise.resolve(res)
    }
  },
  err => { return Promise.reject(err) },
)

export default Axios