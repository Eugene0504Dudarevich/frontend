export type User = {
  fullName: string
  email: string
  password: string
  phoneNumber: string
}

export type UserState = {
  user: User | null
  loading: boolean
  error: string | null
  message: string | null
}
