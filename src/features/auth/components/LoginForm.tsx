'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppDispatch, useAppSelector } from '@/lib'
import { loginUser } from '@/features/auth/slice'
import { FormTitle } from './FormTitle'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/components/ui'

const LoginSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('"Email" is required'),
  password: yup
    .string()
    .required('"Password" is required')
    .min(6, '"Password" must be at least 6 characters')
})

type LoginFormData = yup.InferType<typeof LoginSchema>

export const LoginForm = () => {
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state) => state.user)

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: yupResolver(LoginSchema)
  })

  const { errors, isDirty, isValid, isSubmitting, isSubmitted } = form.formState

  const onSubmit = async (formValues: LoginFormData) => {
    try {
      await dispatch(loginUser(formValues)).unwrap()
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status: number; message: string }
        if (err.status === 401) {
          form.setError('root', { type: 'server', message: err.message })
        }
      } else {
        console.error('Login failed:', error)
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col gap-2 items-center justify-center">
      <div className="w-87.5 text-center border border-neutral-300 p-8">
        <FormTitle />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  {errors.email?.message && (
                    <FormMessage className="text-left">{errors.email.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  {errors.password?.message && (
                    <FormMessage className="text-left">{errors.password.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            {errors.root?.message && (
              <FormMessage className="text-left">{errors.root.message}</FormMessage>
            )}
            <Button
              disabled={((isDirty || isSubmitted) && !isValid) || isSubmitting}
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
        </Form>
      </div>
      <div className="w-87.5 flex items-center gap-2 border border-neutral-300 px-8 py-4">
        <p>Don&apos;t have an account?</p>
        <Button
          variant="link"
          className="text-indigo-500 font-bold text-md p-0 cursor-pointer hover:no-underline"
          onClick={() => {
            router.push('/register')
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  )
}
