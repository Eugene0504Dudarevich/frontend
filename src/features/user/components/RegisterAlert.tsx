import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { clsx } from 'clsx'

type RegisterAlertProps = {
  message: string
  type: 'success' | 'error'
}

const ALERT_VISIBLE_DELAY = 5000

export const RegisterAlert = ({ message, type }: RegisterAlertProps) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, ALERT_VISIBLE_DELAY)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute w-full">
      <Alert
        className={clsx(
          'flex justify-center rounded-none',
          type === 'success'
            ? 'bg-emerald-200 text-emerald-400 border border-emerald-400'
            : 'bg-rose-50 text-orange-600'
        )}
      >
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}
