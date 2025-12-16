import router from '@/router'
import { getLocalStorage, removeLocalStorage } from '@/utils/localStorage.util'
import { showErrorMessage } from '@/utils/message.util'
import axios, { type AxiosRequestConfig } from 'axios'
const api = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
})
export const useGet = <TResponse>(
  url: string,
  query?: AxiosRequestConfig,
  config?: AxiosRequestConfig,
) => {
  return api.get<TResponse>(url, { ...query, ...config })
}
export const usePost = <TResponse>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return api.post<TResponse>(url, data, config)
}
export const useMultipartPost = <TResponse>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
) => {
  return api.post<TResponse>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}
export const usePut = <TResponse>(url: string, data?: unknown) => {
  return api.put<TResponse>(url, data)
}

export const useDelete = <TResponse>(url: string, data?: unknown) => {
  return api.delete<TResponse>(url, { data })
}

export const usePatch = <TResponse>(url: string, data?: unknown) => {
  return api.patch<TResponse>(url, data)
}

// Add a request interceptor to attach the access token to every request
api.interceptors.request.use((config) => {

  // transform params undefined value to empty string
  const [baseUrl, queryString] = config.url ? config.url.split('?') : ""
  const params = new URLSearchParams(queryString)

  // transform params undefined value to empty string
  Array.from(params.keys()).forEach((key) => {
    if (params.get(key) === 'undefined') {
      params.set(key, '') // delete o'rniga set qilish
    }
  })

  // add new params
  const newQueryString = params.toString()
  config.url = newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl
  // set access token
  const token = getLocalStorage('access_token')
  config.headers['Authorization'] = `Bearer ${token || ''}`
  return config
})

// Add a response interceptor to handle token refresh

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    showErrorMessage(error.response?.data?.message || error.message || 'Xatolik yuz berdi')
    // showErrorToast(error.response?.data?.message || error.message || "Xatolik yuz berdi");
    if (error.response?.status === 401 && !error.config.url.includes('/v1/auth/login')) {
      const redirectFrom = window.location.pathname || '/dashboard'
      removeLocalStorage('accessToken')
      router.push(`/auth/login?redirectFrom=${redirectFrom}`)
    }
    //  throw error;
    return Promise.reject(error)
  },
)

export default api
