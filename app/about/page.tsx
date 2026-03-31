import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Our Story',
  description: 'The story behind Follow The Aroma — a vegetarian family kitchen.',
}

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-8 md:px-20">
        <div className="kicker">Who's Cooking</div>
        <h1 className="heading-xl mb-8">Our Story</h1>
        <p className="body-lg mb-6">
          I grew up watching my mother cook without a single measuring spoon in sight.
          The spices went in by smell. The dal was ready when it looked right.
          The roti was done when it puffed up and told you so.
        </p>
        <p className="body-md mb-6">
          Now I cook for my own family — a mix of dal nights and pancake Sundays, of masala pasta
          and buddha bowls, of avocado toast with a pinch of chaat masala because that's just how
          it happens when Indian and American meet in the same kitchen.
        </p>
        <p className="body-md mb-12">
          Follow The Aroma is where I write it all down. Not as a professional chef —
          as a daily family cook who happens to love feeding people.
          The recipes are real. The measurements are approximate. The food is always good.
        </p>

        <div id="contact">
          <h2 className="font-display text-2xl mb-4">Say Hello</h2>
          <p className="body-md mb-6">Questions, collaborations, or just want to share what you cooked?</p>
          <Link href="mailto:hello@followthearoma.com" className="btn-primary inline-block">
            hello@followthearoma.com
          </Link>
        </div>
      </div>
    </div>
  )
}
