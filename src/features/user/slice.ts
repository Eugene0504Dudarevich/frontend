import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { registerUser as registerUserApi } from './api'
import { User, UserState } from './types'

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  message: null
}

export const registerUser = createAsyncThunk<
  { message: string; user: User },
  User,
  { rejectValue: { status: number; message: string } }
>('user/register', async (userData: User, { rejectWithValue }) => {
  try {
    return await registerUserApi(userData)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        status: error.response?.status || 500,
        message:
          (error.response?.data as { message: string })?.message ||
          error.message ||
          'Failed to register'
      })
    }
    return rejectWithValue({
      status: 500,
      message: (error as Error).message || 'Network error'
    })
  }
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ message: string; user: User }>) => {
          state.loading = false
          console.log('actionPayload', action.payload)
          state.user = action.payload.user
          state.message = action.payload.message
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to register'
      })
  }
})

export default userSlice.reducer
