import { post } from '@/lib'
import { User } from './types'

export const registerUser = async (userData: User) => {
  const { data } = await post('/register', userData)

  return data
}
