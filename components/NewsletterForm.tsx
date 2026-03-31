'use client'

export function NewsletterForm() {
  return (
    <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
      <input
        type="email" placeholder="your@email.com"
        className="flex-1 px-6 py-3.5 border border-ink/12 bg-white text-sm font-light
                   focus:outline-none focus:border-spice text-ink placeholder:text-sand"
      />
      <button type="submit" className="btn-primary whitespace-nowrap">Subscribe →</button>
    </form>
  )
}
