// refactor this to useNotifyForm for LittleAromasForm

'use client'
import { NotifyForm } from '@/components/NotifyForm'

export function LittleAromasForm() {
  return (
    <NotifyForm
      buttonText="Notify Me"
      successMessage="Thanks for your interest! We'll notify you when we launch."
    />
  )
}
