import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import RHFTextField from '../hook-form/RHFTextField'
import FormProvider from '../hook-form/FormProvider'
import Button from '../shared/Button'
import { useAuth, useLogin, useRegister } from '@/api/use-auth'
import { useAuthContext } from '@/context/User/UserAuthContext'
import { useRouter } from '@/hooks/use-router'

type FormProps = {
    type: 'login' | 'register'
}

export default function Form({ type }: FormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { user, dispatch } = useAuthContext()
    const { user: authUser } = useAuth()
    const {router} = useRouter()
    
    const { register } = useRegister()
    const { login } = useLogin()

    const loginSchema = Yup.object().shape({
        email: Yup.string().email('Please enter a valid email').required('Email is required'),
        password: Yup.string().required('Password is required')
    })

    const registerSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
        email: Yup.string().email('Please enter a valid email').required('Email is required'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
        confirmPassword: Yup.string().required('Please confirm your password').oneOf([Yup.ref('password')], 'Passwords must match')
    })

    const defaultValues = type === 'login' ? {
        email: '',
        password: ''
    } : {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const methods = useForm<typeof defaultValues>({
        resolver: yupResolver(type === 'login' ? loginSchema : registerSchema),
        defaultValues: defaultValues,
      });

      const { handleSubmit, watch } = methods;

      const values = watch();

      const onSubmit = async (data: typeof defaultValues) => {
        setIsLoading(true)
        setError(null)
        
        try {
            if (type === 'login') {
                const { email, password } = data
                const result = await login({ email, password })
                if (result.error) {
                    setError((result.error as any)?.message || 'Login failed')
                } else {
                    console.log('Login successful:', result.data)
                    // Handle successful login (redirect, set user state, etc.)
                    console.log("anujanuj", user)
                    dispatch({ type: 'SET_USER', payload: {...authUser, isAuthenticated: true} })
                }
            } else {
                const { first_name, last_name, email, password } = data
                const result = await register({ first_name, last_name, email, password })
                if (result.error) {
                    setError((result.error as any)?.message || 'Registration failed')
                } else {
                    console.log('Registration successful:', result.data)
                    // Handle successful registration (redirect, set user state, etc.)
                    router.replace('/auth/login')
                }
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
      }

      return (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
                {type === 'register' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            <RHFTextField name="first_name" label="First Name" />
                            <RHFTextField name="last_name" label="Last Name" />
                        </div>
                    </>
                )}
                <RHFTextField name="email" label="Email" type="email" />
                <RHFTextField name="password" label="Password" type="password" />
                {type === 'register' && (
                    <RHFTextField name="confirmPassword" label="Confirm Password" type="password" />
                )}
                <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? 'Loading...' : (type === 'login' ? 'Sign In' : 'Create Account')}
                </Button>
            </div>
        </FormProvider>
      )
}