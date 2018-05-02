import axios from 'axios'
import { cookie } from './common'
import config from '../../config'
import message from '@/components/message'

const http = axios.create()

const conf = config[process.env.PROD_ENV]

http.defaults.baseURL = `${conf.apiHost}/api`
// http.defaults.withCredentials = true

http.interceptors.request.use(req => {
  const token = cookie('token')
  req.headers = {
    ...req.headers,
    Authorization: token,
  }
  return req
}, err => {
  console.log(err)
  message(err.message)
  return { error: err.message }
})
http.interceptors.response.use(res => {
  const { code, msg } = res.data
  if (code === 200) {
    return res.data
  } else {
    let text = msg
    if (code === 401 || code === 403) {
      text = text || '登录过期'
      const { pathname } = location
      if (pathname !== '/login') {
        location.href = '/login'
      }
    } else if (code === 404) {
      text = text || '请求的资源不存在'
    } else if (code >= 500) {
      text = text || '服务器错误'
    } else {
      text = text || '未知错误码'
    }
    message(text)
    return { error: text }
  }
}, err => {
  console.log(err)
  message(err.message)
  return { error: err.message }
})

export default http
