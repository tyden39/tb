import axios from 'axios'

export const callApi = async (url, method, token = 'Token', data) => {
  try {
    let res = null
    if (token) {
      const authAxios = createAxiosWithInterceptor(token)
      res = await authAxios({ url, method, data, timeout: 10000 }) //  auth req
    } else {
      res = await axios({ url, method, data, timeout: 10000 }) // normal req
    }
    if (res) return res.data
  } catch (err) {
    console.log(err)
    return null
  }
  return null
}

export const createAxiosWithInterceptor = (token) => {
  const apiInstance = axios.create()
  apiInstance.interceptors.request.use(
    (config) => {
      config.headers = { Authorization: token }
      return config
    },
    (error) => {
      Promise.reject(error)
    },
  )
  return apiInstance
}

export const genExpiredDate = (day) => {
  const now = Date.now()
  return now + day * 24 * 60 * 60 * 1000
}

export const checkExpiredCookie = (data) => {
  if (!data) return true
  const expiredDate = parseInt(data)
  return Date.now() > expiredDate ? true : false
}

export const getApiPath = (path, options = []) => {
  let queryStr = ''
  if (options && options.length > 0) {
    options.forEach((opt, i) => {
      if (opt?.key && opt?.value) {
        queryStr +=
          i === 0 ? `?${opt.key}=${opt.value}` : `&${opt.key}=${opt.value}`
      }
    })
  }
  return process.env.NEXT_PUBLIC_PRACTICE_TEST_BASE_API_URL + path + queryStr
}
