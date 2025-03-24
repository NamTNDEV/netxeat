import { Suspense } from 'react'
import LoginForm from './login-form'

export default function Login() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
