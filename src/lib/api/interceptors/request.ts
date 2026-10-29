import { InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  try {
    const accessToken = Cookies.get('access_token')

    if (config.headers && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  } catch (error) {
    return Promise.reject((error as Error).message)
  }
}
