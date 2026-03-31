import Link                from 'next/link'
import Image               from 'next/image'
import { getAllRecipes, getFeaturedRecipe } from '@/lib/sanity/queries'
import { RecipeCard }      from '@/components/recipes/RecipeCard'
import { urlForImage }     from '@/lib/sanity/client'
import { formatTime, TICKER_ITEMS, CUISINE_WORLDS } from '@/lib/utils'
import { LittleAromasForm } from '@/components/LittleAromasForm'
import { NewsletterForm } from '@/components/NewsletterForm'

export const revalidate = 60

export default async function HomePage() {
  const [recipes, featured] = await Promise.all([getAllRecipes(), getFeaturedRecipe()])
  const recent = recipes.slice(0, 3)

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20 overflow-hidden">

        {/* Left */}
        <div className="flex flex-col justify-center px-8 md:px-20 py-20 animate-fade-up">
          <div className="kicker">Vegetarian · Home Cooked · Globally Inspired</div>

          <h1 className="font-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[1.04] tracking-tight mb-6">
            Good food follows<br />its own{' '}
            <em className="italic text-spice">aroma.</em>
          </h1>

          <p className="text-lg text-stone font-light leading-relaxed max-w-[44ch] mb-10">
            A family kitchen. A vegetarian table. Indian roots,
            American mornings, and whatever the week calls for.
            No culinary school — just a lifetime of cooking by smell.
          </p>

          <div className="flex gap-4 flex-wrap mb-14">
            <Link href="/recipes" className="btn-primary">Browse Recipes →</Link>
            <Link href="#story"   className="btn-secondary">Our Story</Link>
          </div>

          {/* Author */}
          <div className="flex items-center gap-4 pt-8 border-t border-ink/8">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0
                            bg-gradient-to-br from-spice to-gold">
              🍳
            </div>
            <div className="text-sm text-stone font-light leading-snug">
              <strong className="text-ink font-medium">@leandiet on Instagram</strong><br/>
              Daily family cooking · Vegetarian · Real &amp; unmeasured
            </div>
          </div>
        </div>

        {/* Right — editorial mosaic */}
        <div className="hidden lg:grid grid-cols-3 grid-rows-2 bg-ink gap-px animate-fade-in">
          {[
            { emoji:'🍛', label:'Dal & Curries',  bg:'#2d1a0e', href:'/recipes?cat=indian',    rows: 2 },
            { emoji:'🥗', label:'Fresh Salads',   bg:'#1a2d1a', href:'/recipes?cat=salads',    rows: 1 },
            { emoji:'🥞', label:'Breakfasts',     bg:'#2d2010', href:'/recipes?cat=breakfast', rows: 1 },
          ].map(({ emoji, label, bg, href, rows }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-center justify-center relative overflow-hidden
                         hover:brightness-110 transition-all duration-400"
              style={{
                background: bg,
                gridRow: rows === 2 ? 'span 2' : 'span 1',
                fontSize: rows === 2 ? '8rem' : '5rem',
              }}
            >
              <span className="group-hover:scale-110 transition-transform duration-400">{emoji}</span>
              <span className="absolute bottom-4 left-4 text-[0.65rem] font-semibold uppercase
                               tracking-[0.14em] text-white/50">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────── */}
      <div className="bg-ink h-12 flex items-center overflow-hidden">
        <div className="flex gap-12 animate-ticker whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-[0.7rem] font-medium tracking-[0.16em] uppercase text-white/40 flex items-center gap-3 flex-shrink-0">
              {item}
              <span className="text-spice text-[0.5rem]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── RECENT RECIPES ───────────────────────────── */}
      <section className="section-padding bg-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="kicker">From the Kitchen</div>
              <h2 className="heading-lg">What we've been cooking</h2>
            </div>
            <Link href="/recipes" className="text-sm font-medium text-spice hover:text-spice-soft transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recent.map((r, i) => <RecipeCard key={r._id} recipe={r} index={i} priority={i === 0} />)}
          </div>
        </div>
      </section>

      {/* ── FEATURED ────────────────────────────────── */}
      {featured && (
        <section className="section-padding bg-cream">
          <div className="max-w-7xl mx-auto">
            <div className="kicker">Editor's Pick</div>
            <h2 className="heading-lg mb-12">This week in the kitchen</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 border border-ink/8 bg-white">
              {/* Image */}
              <div className="relative min-h-[420px] bg-bark overflow-hidden">
                {featured.mainImage ? (
                  <Image
                    src={urlForImage(featured.mainImage).width(800).height(600).format('webp').url()}
                    alt={featured.title}
                    fill className="object-cover"
                    sizes="(max-width:1024px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10rem]">🍛</div>
                )}
                {/* Fade to white on right edge */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white hidden lg:block" />
              </div>

              {/* Content */}
              <div className="p-12 md:p-14 flex flex-col justify-center">
                <span className="inline-flex items-center gap-2 text-[0.65rem] font-semibold
                                 tracking-[0.14em] uppercase text-gold border border-gold/30
                                 px-3 py-1.5 w-fit mb-6">
                  ⭐ This Week's Favourite
                </span>
                <h3 className="font-display text-[2.2rem] leading-tight tracking-tight mb-4">
                  {featured.title}
                </h3>
                <p className="text-stone font-light leading-relaxed mb-8">
                  {featured.description}
                </p>
                <div className="grid grid-cols-4 gap-4 pb-8 border-b border-ink/8 mb-8">
                  {[
                    { l: 'Prep',      v: `${featured.prepTime}m` },
                    { l: 'Cook',      v: `${featured.cookTime}m` },
                    { l: 'Serves',    v: featured.servings       },
                    { l: 'Difficulty',v: featured.difficulty     },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <div className="text-[0.65rem] uppercase tracking-wider text-sand mb-1">{l}</div>
                      <div className="font-semibold text-ink">{v}</div>
                    </div>
                  ))}
                </div>
                <Link href={`/recipes/${featured.slug.current}`} className="btn-primary w-fit">
                  View Recipe →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── STORY ───────────────────────────────────── */}
      <section id="story" className="bg-ink grid grid-cols-1 lg:grid-cols-2">
        <div className="px-8 md:px-20 py-24 flex flex-col justify-center">
          <div className="kicker" style={{ color:'#e8845a' }}>
            <span style={{ display:'block', width:'1.8rem', height:'1px', background:'#e8845a' }}/>
            Who's Cooking
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight tracking-tight mb-6">
            Indian kitchen,<br/><em className="italic text-gold">American table.</em>
          </h2>
          <p className="text-white/50 font-light leading-[1.9] mb-5">
            I grew up watching my mother cook without a single measuring spoon in sight.{' '}
            <span className="text-white/80">The spices went in by smell.</span>{' '}
            The dal was ready when it looked right. The roti was done when it puffed up and told you so.
          </p>
          <p className="text-white/50 font-light leading-[1.9] mb-8">
            Now I cook for my own family — a mix of dal nights and pancake Sundays, of masala pasta
            and buddha bowls. I write it all down so{' '}
            <span className="text-white/80">you don't have to guess.</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {['Vegetarian','Indian Roots','Global Kitchen','Family Cooking','No Rules'].map(t => (
              <span key={t} className="text-[0.7rem] font-medium uppercase tracking-[0.08em]
                                       border border-white/12 px-3 py-1.5 text-white/35">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center text-[12rem]
                        bg-gradient-to-br from-bark to-[#4a2e18] min-h-[480px]">
          🫕
        </div>
      </section>

      {/* ── WORLD CUISINES ───────────────────────────── */}
      <section id="world" className="section-padding bg-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="kicker">The Global Table</div>
          <h2 className="heading-lg mb-3">One kitchen, many worlds</h2>
          <p className="body-md max-w-[50ch] mb-12">
            Indian soul on weeknights, avocado toast on weekends, and whatever the week demands.
          </p>
          <div className="grid grid-cols-5 gap-px bg-ink/8">
            {CUISINE_WORLDS.map(({ flag, name, desc }) => (
              <Link
                key={name}
                href={`/recipes?cuisine=${name.toLowerCase()}`}
                className="bg-white p-8 text-center hover:bg-gold-pale transition-colors group"
              >
                <span className="text-4xl block mb-3">{flag}</span>
                <div className="font-display text-lg text-ink group-hover:text-spice transition-colors">{name}</div>
                <div className="text-xs text-sand mt-1">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LITTLE AROMAS ───────────────────────────── */}
      <section id="kids" className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="kicker">Coming Soon</div>
            <h2 className="heading-lg mb-6">Little Aromas</h2>
            <p className="body-md mb-5">
              The best thing you can do in a kitchen is let a child in. Let them smell the spices,
              crack the eggs, stir the batter. That's how cooking gets passed on — not from a recipe book,
              but from standing next to someone who loves to cook.
            </p>
            <p className="body-md mb-8">
              Little Aromas is coming — simple, fun vegetarian recipes designed for curious young cooks.
              Colourful, unfussy, and genuinely delicious.
            </p>
            <p className="text-sm text-spice font-medium">→ Drop your email below to be first in when we launch.</p>
          </div>

          <div className="bg-gold-pale border border-gold/20 p-14 text-center">
            <div className="flex justify-center gap-3 text-5xl mb-6 animate-bob">
              🥚 🥞 🥕 🫛
            </div>
            <h3 className="font-display text-2xl text-bark mb-3">Little Aromas</h3>
            <p className="text-sm text-stone font-light leading-relaxed mb-6 max-w-[32ch] mx-auto">
              Simple recipes little hands can help make — and little mouths will actually eat.
            </p>
            <LittleAromasForm />
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────── */}
      <section id="newsletter" className="section-padding bg-parchment text-center">
        <div className="max-w-xl mx-auto">
          <div className="kicker justify-center before:hidden">Stay Close</div>
          <h2 className="heading-lg mb-4">Follow the aroma weekly</h2>
          <p className="body-md mx-auto mb-8">
            One email, every Sunday. What we cooked this week, what's in season,
            and one recipe your kitchen will thank you for.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  )
}
