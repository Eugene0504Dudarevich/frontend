import { post } from '@/lib'
import { User } from './types'

export const registerUser = async (userData: User) => {
  const { data } = await post('/register', userData)

  return data
}

export const loginUser = async (email: string, password: string) => {
  const { data } = await post('/login', { email, password })

  return data
}
