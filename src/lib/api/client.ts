import axios from 'axios'
import Cookies from 'js-cookie'
import { requestInterceptor } from '@/lib'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const publicClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

publicClient.interceptors.request.use(requestInterceptor)

publicClient.interceptors.response.use((response) => {
  const url = response.config.url

  if (url && url.startsWith('/login')) {
    const { accessToken, refreshToken } = response.data
    Cookies.set('access_token', accessToken)
    Cookies.set('refresh_token', refreshToken)
  }

  return response
})

export const post = publicClient.post
