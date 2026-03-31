import type { Metadata } from 'next'
import { LittleAromasForm } from '@/components/LittleAromasForm'

export const metadata: Metadata = {
  title: 'Little Aromas',
  description: 'Simple vegetarian recipes for curious young cooks. Coming soon.',
}

export default function KidsCornerPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-8 md:px-20 text-center">
        <div className="kicker justify-center before:hidden">Coming Soon</div>
        <h1 className="heading-xl mb-4">Little Aromas</h1>
        <p className="body-lg mx-auto mb-14 max-w-prose">
          The best thing you can do in a kitchen is let a child in. Let them smell the spices,
          crack the eggs, stir the batter. That's how cooking gets passed on.
        </p>
        <div className="bg-gold-pale border border-gold/20 p-16">
          <div className="flex justify-center gap-4 text-5xl mb-8 animate-bob">
            🥚 🥞 🥕 🫛 🍳
          </div>
          <h2 className="font-display text-2xl text-bark mb-4">Little Cooks, Big Flavours</h2>
          <p className="text-sm text-stone font-light leading-relaxed mb-8 max-w-[38ch] mx-auto">
            We're building a collection of vegetarian recipes designed for curious young cooks.
            Colourful, simple, and genuinely delicious.
          </p>
          <div className="max-w-sm mx-auto">
            <LittleAromasForm />
          </div>
        </div>
      </div>
    </div>
  )
}
