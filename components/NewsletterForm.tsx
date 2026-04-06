// refactor this to useNotifyForm for NewsletterForm
'use client'
import { NotifyForm } from '@/components/NotifyForm'

export function NewsletterForm() {
  return (
    <NotifyForm
      buttonText="Subscribe"
      successMessage="You're on the list! Expect deliciousness in your inbox."
    />
  )
}