'use client'

export function LittleAromasForm() {
  return (
    <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
      <input
        type="email" placeholder="your@email.com"
        className="flex-1 px-4 py-3 border border-gold/25 bg-white text-sm font-light
                   focus:outline-none focus:border-gold text-ink placeholder:text-sand"
      />
      <button type="submit" className="bg-bark text-white px-5 py-3 text-sm font-semibold
                                       hover:bg-spice transition-colors whitespace-nowrap">
        Notify Me
      </button>
    </form>
  )
}
