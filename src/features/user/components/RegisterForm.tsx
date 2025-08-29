import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form, FormControl, FormField, FormItem, FormMessage, Input } from '@/components/ui'
import { registerUser } from '@/features/user/slice'
import { useAppDispatch, useAppSelector } from '@/lib'
import { RegisterAlert } from '@/features/user'

const RegisterSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('"Full name" is required')
    .min(3, '"Full name" must be at least 3 characters'),
  email: yup.string().email('Invalid email address').required('"Email" is required'),
  password: yup
    .string()
    .required('"Password" is required')
    .min(6, '"Password" must be at least 6 characters'),
  phoneNumber: yup.string().required('"Phone number" is required')
})

type RegisterFormData = yup.InferType<typeof RegisterSchema>

export const RegisterForm = () => {
  const dispatch = useAppDispatch()
  const { loading, message } = useAppSelector((state) => state.user)

  const form = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      phoneNumber: ''
    },
    resolver: yupResolver(RegisterSchema),
    mode: 'onChange'
  })

  const onSubmit = async (formValues: RegisterFormData) => {
    try {
      await dispatch(registerUser(formValues)).unwrap()

      form.reset()
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        const err = error as { status: number; message: string }

        if (err.status === 400) {
          form.setError('email', { type: 'server', message: err.message })
        }
      } else {
        console.error('Registration failed:', error)
      }
    }
  }

  const { errors, isValid, isDirty, isSubmitted, isSubmitting } = form.formState

  return (
    <>
      {message && <RegisterAlert type="success" message={message} />}
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <div className="w-87.5 flex flex-col text-center border border-neutral-300 p-8">
          <h1 className="instagram-heading mt-9 mb-3">Instagram</h1>
          <p className="font-semibold text-neutral-500 mb-3">
            Sign up to see photos and videos from your friends.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full name" {...field} />
                    </FormControl>
                    {errors.fullName?.message && (
                      <FormMessage className="text-left">{errors.fullName.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    {errors.phoneNumber?.message && (
                      <FormMessage className="text-left">{errors.phoneNumber.message}</FormMessage>
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
              <Button
                type="submit"
                disabled={((isDirty || isSubmitted) && !isValid) || isSubmitting || loading}
                className="bg-indigo-500 hover:bg-indigo-400 cursor-pointer"
              >
                {loading || isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
