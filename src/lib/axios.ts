import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const publicClient = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

export const post = publicClient.post
