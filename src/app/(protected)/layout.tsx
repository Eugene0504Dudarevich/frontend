'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter()

  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const accessToken = Cookies.get('access_token')

    if (!accessToken) {
      router.replace('login')
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    )
  }

  return <div>{children}</div>
}

export default ProtectedLayout
