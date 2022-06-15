import axios, { Method } from 'axios'

export const callApi = async (
  url: string,
  method: Method = 'GET',
  token: string | 'Token' = 'Token',
  data?: any,
) => {
  try {
    let res = null
    if (token) {
      const authAxios = createAxiosWithInterceptor(token)
      res = await authAxios({ url, method, data, timeout: 60000 }) //  auth req
    } else {
      res = await axios({ url, method, data, timeout: 60000 }) // normal req
    }
    if (res) return res.data
  } catch (err) {
    console.log(err)
    return null
  }
  return null
}

export const createAxiosWithInterceptor = (token: string) => {
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

export const getApiPath = (
  path: string,
  options: { key: string; value: string }[] = [],
) => {
  let queryStr = ''
  if (options && options.length > 0) {
    options.forEach((opt, i) => {
      if (opt?.key && opt?.value) {
        queryStr +=
          i === 0 ? `?${opt.key}=${opt.value}` : `&${opt.key}=${opt.value}`
      }
    })
  }
  return process.env.NEXT_PUBLIC_BASE_API_URL + path + queryStr
}

export function validateEmail(email: any) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
}
