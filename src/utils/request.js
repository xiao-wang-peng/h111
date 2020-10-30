// 对axios进行二次封装
import axios from 'axios'

import JSONbig from 'json-bigint'
// 1. 设置基地址。
// http://www.axios-js.com/zh-cn/docs/#%E5%85%A8%E5%B1%80%E7%9A%84-axios-%E9%BB%98%E8%AE%A4%E5%80%BC
// 在真实接口地址中，域名部分一般就是固定的: http://ttapi.research.itcast.cn
// 可以把在固定这部分设为基地址：好处在于，后面再发ajax时，就可以省略这一段

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn'

// 添加axios请求拦截器， 让每次提交自动带上token
axios.interceptors.request.use(
  function (config) {
    // config: 表示当前请求的配置
    // 如果本地有token信息，就取出来，在这里添加到config上
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Do something before request is sent
    // console.log("所有的请求都这里走", config);
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

//  在transformResponse中处理大数问题
axios.defaults.transformResponse = [
  function (data) {
    // 做任意处理
    try {
      // 由于jsonbig.parse只能处理json字符串，如果后端返回的数据是不是json字符串，这里就
      // 可能会出错，所以 要try
      return JSONbig.parse(data)
    } catch (err) {
      console.log('transformResponse出错了', err)
      return data
    }
  }
]

export default axios
