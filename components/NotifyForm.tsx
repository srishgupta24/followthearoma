// refactor this component to remove redundancy between NewsletterForm and NotifyForm, and make it more reusable for future forms. The only differences between the two are the success message and the button text.

'use client'

import { useState } from 'react'

type NotifyFormProps = {
  buttonText:     string
  successMessage: string
}

export function NotifyForm({ buttonText, successMessage }: NotifyFormProps) {
  const [email,   setEmail]   = useState('')
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || done) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      setDone(true)
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <p className="text-sm font-medium text-cardamom py-3.5">
        ✓ {successMessage}
      </p>
    )
  }

  return (
    <form className="flex flex-col md:flex-row gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder=""
        className="w-full px-6 py-3.5 border border-ink/12 bg-white text-sm font-light 
        focus:outline-none focus:border-spice text-ink placeholder:text-sand"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto btn-primary whitespace-nowrap"
      >
        {loading ? 'Sending...' : buttonText}
      </button>
    </form>
  )
}   

